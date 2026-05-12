/**
 * Helper pour les tests d'intégration Supabase.
 * Crée des clients avec différents niveaux de privilège.
 *
 * Variables d'environnement requises dans .env.test :
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY  ← pour créer/supprimer des utilisateurs de test
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const ANON_KEY    = process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL manquant dans les variables d\'environnement')
}

/** Client service_role — bypasse RLS, pour setup/teardown de tests uniquement */
export const adminClient = SERVICE_KEY
  ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
  : null

/** Client anon — utilisé pour se connecter avec des credentials de test */
export const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

/** Crée un client authentifié pour un utilisateur de test */
export async function signInAsTestUser(email: string, password: string): Promise<SupabaseClient> {
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Connexion test échouée (${email}): ${error.message}`)
  return client
}

/** Crée un utilisateur de test via service_role */
export async function createTestUser(
  email: string,
  password: string,
  accountType: 'user_agent' | 'user_partner' | 'back_office'
): Promise<string> {
  if (!adminClient) throw new Error('SUPABASE_SERVICE_ROLE_KEY requis pour créer des utilisateurs de test')

  // Créer dans auth.users
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: accountType },
    user_metadata: { account_type: accountType },
  })
  if (error) throw new Error(`Création user test échouée: ${error.message}`)

  const userId = data.user.id

  // Créer dans la table accounts
  await adminClient.from('accounts').upsert({
    id: userId,
    email,
    account_type: accountType,
    verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  return userId
}

/** Supprime un utilisateur de test */
export async function deleteTestUser(userId: string): Promise<void> {
  if (!adminClient) return
  await adminClient.from('accounts').delete().eq('id', userId)
  await adminClient.auth.admin.deleteUser(userId)
}

/** Crée une ONG de test pour un user_agent */
export async function createTestOng(agentUserId: string, name: string): Promise<string> {
  if (!adminClient) throw new Error('adminClient requis')
  const { data, error } = await adminClient.from('ongs').insert({
    account_id: agentUserId,
    name,
    description: 'ONG de test pour RLS',
    category: 'education',
    status: 'pending',
    location: 'Antananarivo',
    volunteers: 0,
    email: `${name.toLowerCase().replace(/\s/g, '')}@test.paika`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).select('id').single()

  if (error) throw new Error(`Création ONG test échouée: ${error.message}`)
  return data.id
}
