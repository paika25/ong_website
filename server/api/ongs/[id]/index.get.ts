/**
 * GET /api/ongs/:id
 * Retourne le détail d'une ONG.
 * - Données financières (champ `financials`) visibles uniquement pour :
 *     • partenaires (user_partner) avec verified = true
 *     • agents ONG (user_agent)
 *     • back_office / admin
 * - Les anonymes et partenaires non-validés reçoivent `financials: null`.
 */
import { createAdminReadClient, parseJwtSub } from '~/server/utils/admin-supabase'

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  if (!ongId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const config = useRuntimeConfig()
  const admin  = createAdminReadClient(config, '')

  const { data: ong, error } = await admin
    .from('ongs')
    .select('*')
    .eq('id', ongId)
    .in('status', ['verified', 'active'])
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!ong)  throw createError({ statusCode: 404, statusMessage: 'ONG introuvable' })

  // Vérifier le droit d'accès aux données financières
  const canSeeFinancials = await checkFinancialsAccess(event, admin)
  if (!canSeeFinancials) {
    ong.financials = null
  }

  return ong
})

async function checkFinancialsAccess(event: any, admin: any): Promise<boolean> {
  const authHeader = getRequestHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return false

  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    const role    = payload?.app_metadata?.role ?? payload?.role as string | undefined
    const userId  = payload?.sub as string | undefined

    // Agents et back-office accèdent toujours aux financials
    if (role === 'user_agent' || role === 'back_office' || role === 'admin') return true

    // Partenaire : doit être validé manuellement
    if (role === 'user_partner' && userId) {
      const { data: account } = await admin
        .from('accounts')
        .select('verified')
        .eq('id', userId)
        .maybeSingle()
      return account?.verified === true
    }
  } catch { /* JWT malformé ou expiré */ }

  return false
}
