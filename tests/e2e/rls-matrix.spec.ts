/**
 * Tests E2E — Matrice RLS Multi-tenant (Story 1.3)
 *
 * Prouve que le "Secret Bancaire" fonctionne :
 *  - user_agent_A ne voit pas les données de user_agent_B
 *  - user_partner voit uniquement les données publiques
 *  - back_office voit tout
 *
 * Prérequis :
 *  - Migrations 1.2 et 1.4 (migration 07) appliquées en staging
 *  - Variables d'environnement dans .env.test :
 *      NUXT_PUBLIC_SUPABASE_URL=...
 *      NUXT_PUBLIC_SUPABASE_KEY=...
 *      SUPABASE_SERVICE_ROLE_KEY=...
 *
 * Exécution : npm run test:rls
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  createTestUser,
  deleteTestUser,
  createTestOng,
  signInAsTestUser,
  adminClient,
} from '../helpers/supabase-test'

// ── Identifiants des utilisateurs de test ─────────────────────────
const TEST_USERS = {
  agentA:     { email: 'test-agent-a@paika-rls.test', password: 'Test1234!RLS', type: 'user_agent'   as const },
  agentB:     { email: 'test-agent-b@paika-rls.test', password: 'Test1234!RLS', type: 'user_agent'   as const },
  partner:    { email: 'test-partner@paika-rls.test',  password: 'Test1234!RLS', type: 'user_partner' as const },
  backoffice: { email: 'test-bo@paika-rls.test',       password: 'Test1234!RLS', type: 'back_office'  as const },
}

let ids: Record<string, string> = {}
let ongAId: string
let ongBId: string

// ── Setup : créer les utilisateurs et ONGs de test ─────────────────
beforeAll(async () => {
  if (!adminClient) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY absent — tests ignorés (mode CI sans credentials)')
    return
  }

  console.log('🔧 Création des utilisateurs de test...')

  ids.agentA     = await createTestUser(TEST_USERS.agentA.email,     TEST_USERS.agentA.password,     TEST_USERS.agentA.type)
  ids.agentB     = await createTestUser(TEST_USERS.agentB.email,     TEST_USERS.agentB.password,     TEST_USERS.agentB.type)
  ids.partner    = await createTestUser(TEST_USERS.partner.email,    TEST_USERS.partner.password,    TEST_USERS.partner.type)
  ids.backoffice = await createTestUser(TEST_USERS.backoffice.email, TEST_USERS.backoffice.password, TEST_USERS.backoffice.type)

  ongAId = await createTestOng(ids.agentA, 'ONG Test Alpha')
  ongBId = await createTestOng(ids.agentB, 'ONG Test Beta')

  console.log('✅ Setup RLS terminé')
}, 30000)

// ── Teardown : supprimer tous les utilisateurs et données de test ───
afterAll(async () => {
  if (!adminClient) return

  console.log('🧹 Nettoyage des données de test...')

  await adminClient.from('ongs').delete().in('id', [ongAId, ongBId].filter(Boolean))

  for (const userId of Object.values(ids)) {
    if (userId) await deleteTestUser(userId)
  }

  console.log('✅ Nettoyage terminé')
}, 30000)

// ── Helpers ────────────────────────────────────────────────────────
function skipIfNoAdmin() {
  if (!adminClient) return true
  return false
}

// ══════════════════════════════════════════════════════════════════
// BLOC 1 — Isolation user_agent (Secret Bancaire)
// ══════════════════════════════════════════════════════════════════
describe('#1 Cloisonnement user_agent (Secret Bancaire)', () => {

  it('user_agent_A voit son ONG mais PAS celle de user_agent_B', async () => {
    if (skipIfNoAdmin()) return

    const clientA = await signInAsTestUser(TEST_USERS.agentA.email, TEST_USERS.agentA.password)

    const { data: ongs, error } = await clientA.from('ongs').select('id, name, account_id')
    expect(error).toBeNull()

    const ids_found = (ongs ?? []).map((o: any) => o.id)

    // Voit son ONG
    expect(ids_found).toContain(ongAId)

    // NE VOIT PAS l'ONG de B — isolation RLS garantie
    expect(ids_found).not.toContain(ongBId)
  })

  it('user_agent_A ne peut PAS lire les données de user_agent_B directement', async () => {
    if (skipIfNoAdmin()) return

    const clientA = await signInAsTestUser(TEST_USERS.agentA.email, TEST_USERS.agentA.password)

    const { data, error } = await clientA
      .from('ongs')
      .select('id')
      .eq('id', ongBId)
      .maybeSingle()

    // RLS retourne 0 rows (pas d'erreur — pas de fuite d'information)
    expect(error).toBeNull()
    expect(data).toBeNull()
  })

  it('user_agent_A ne peut PAS modifier l\'ONG de user_agent_B', async () => {
    if (skipIfNoAdmin()) return

    const clientA = await signInAsTestUser(TEST_USERS.agentA.email, TEST_USERS.agentA.password)

    const { count, error } = await clientA
      .from('ongs')
      .update({ description: 'Tentative de modification cross-tenant' })
      .eq('id', ongBId)
      .select('id', { count: 'exact' })

    // 0 rows affectées (RLS bloque silencieusement)
    expect(count).toBe(0)
  })

  it('user_agent_A ne peut PAS lire financial_transactions d\'une autre ONG', async () => {
    if (skipIfNoAdmin()) return

    const clientA = await signInAsTestUser(TEST_USERS.agentA.email, TEST_USERS.agentA.password)

    const { data, error } = await clientA
      .from('financial_transactions')
      .select('id')
      .eq('ong_id', ongBId)

    expect(error).toBeNull()
    expect(data).toHaveLength(0)
  })
})

// ══════════════════════════════════════════════════════════════════
// BLOC 2 — user_partner : lecture publique uniquement
// ══════════════════════════════════════════════════════════════════
describe('#2 user_partner — lecture publique, pas de données privées', () => {

  it('user_partner peut lire les ONGs actives (données publiques)', async () => {
    if (skipIfNoAdmin()) return

    const clientP = await signInAsTestUser(TEST_USERS.partner.email, TEST_USERS.partner.password)

    // Les ONGs actives sont publiques (pas de RLS restrictive sur SELECT public)
    const { data, error } = await clientP.from('ongs').select('id, name, status')
    expect(error).toBeNull()
    // Peut récupérer des ONGs (liste publique)
    expect(Array.isArray(data)).toBe(true)
  })

  it('user_partner ne peut PAS lire audit_trail (données internes)', async () => {
    if (skipIfNoAdmin()) return

    const clientP = await signInAsTestUser(TEST_USERS.partner.email, TEST_USERS.partner.password)

    const { data, error } = await clientP.from('audit_trail').select('id')

    // RLS bloque : 0 résultats ou erreur 403
    const isBlocked = (data?.length === 0) || (error !== null)
    expect(isBlocked).toBe(true)
  })

  it('user_partner ne peut PAS lire financial_transactions', async () => {
    if (skipIfNoAdmin()) return

    const clientP = await signInAsTestUser(TEST_USERS.partner.email, TEST_USERS.partner.password)

    const { data, error } = await clientP.from('financial_transactions').select('id')

    const isBlocked = (data?.length === 0) || (error !== null)
    expect(isBlocked).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════
// BLOC 3 — back_office : accès total (portail de certification)
// ══════════════════════════════════════════════════════════════════
describe('#3 back_office — accès total pour certification', () => {

  it('back_office peut lire toutes les ONGs (toutes tailles de tenant)', async () => {
    if (skipIfNoAdmin()) return

    const clientBO = await signInAsTestUser(TEST_USERS.backoffice.email, TEST_USERS.backoffice.password)

    const { data, error } = await clientBO.from('ongs').select('id, account_id')
    expect(error).toBeNull()

    const ids_found = (data ?? []).map((o: any) => o.id)

    // Voit les ONGs des deux agents
    expect(ids_found).toContain(ongAId)
    expect(ids_found).toContain(ongBId)
  })

  it('back_office peut lire audit_trail (traçabilité complète)', async () => {
    if (skipIfNoAdmin()) return

    const clientBO = await signInAsTestUser(TEST_USERS.backoffice.email, TEST_USERS.backoffice.password)

    const { error } = await clientBO.from('audit_trail').select('id').limit(1)
    expect(error).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════
// BLOC 4 — Immuabilité financial_transactions
// ══════════════════════════════════════════════════════════════════
describe('#4 Immuabilité des transactions financières (FATF)', () => {

  it('UPDATE sur financial_transactions est bloqué par trigger', async () => {
    if (!adminClient) return

    // Insérer une transaction de test via service_role
    const { data: tx } = await adminClient.from('financial_transactions').insert({
      ong_id: ongAId,
      vanilla_pay_transaction_id: `test-vpay-rls-${Date.now()}`,
      idempotency_key: `test-idem-rls-${Date.now()}`,
      amount: 1000,
      status: 'pending',
      transaction_type: 'subscription',
    }).select('id').single()

    if (!tx) return

    // Tenter un UPDATE → doit échouer avec "immutable record"
    const { error } = await adminClient
      .from('financial_transactions')
      .update({ status: 'completed' })
      .eq('id', tx.id)

    expect(error).not.toBeNull()
    expect(error?.message).toContain('immutable')
  })

  it('DELETE sur financial_transactions est bloqué par trigger', async () => {
    if (!adminClient) return

    const { data: tx } = await adminClient.from('financial_transactions').insert({
      ong_id: ongAId,
      vanilla_pay_transaction_id: `test-vpay-del-${Date.now()}`,
      idempotency_key: `test-idem-del-${Date.now()}`,
      amount: 500,
      status: 'pending',
      transaction_type: 'donation',
    }).select('id').single()

    if (!tx) return

    const { error } = await adminClient
      .from('financial_transactions')
      .delete()
      .eq('id', tx.id)

    expect(error).not.toBeNull()
    expect(error?.message).toContain('immutable')
  })
})
