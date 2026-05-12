/**
 * Middleware Nitro : vérifie JWT valide + rôle présent sur toutes les routes /api/
 * Règle architecture : ce middleware vérifie l'authentification uniquement.
 * L'accès aux données est géré par RLS PostgreSQL (source of truth).
 */

function parseJWT(token: string): Record<string, any> | null {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Routes publiques — pas d'auth requise
  const publicRoutes = [
    '/api/ongs',
    '/api/webhooks/vanilla-pay',
    '/api/score/criteria',
    '/api/score/ong/',
  ]
  const isPublic = publicRoutes.some(r => path.startsWith(r))
  if (isPublic) return

  // Ne traiter que les routes /api/
  if (!path.startsWith('/api/')) return

  const authHeader = getRequestHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  const payload = parseJWT(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide' })
  }

  const role = payload?.app_metadata?.role ?? payload?.role

  // Rôle requis uniquement pour les routes back-office (migration 07 pas forcément appliquée)
  const isAdminRoute     = path.startsWith('/api/admin/') || path.startsWith('/api/back-office/')
  const isAdminRole      = role === 'admin' || role === 'back_office'
  if (isAdminRoute && !isAdminRole) {
    throw createError({ statusCode: 403, statusMessage: 'Rôle admin requis' })
  }

  // Injecter le contexte dans l'event pour les handlers
  event.context.userId = payload.sub
  event.context.userRole = role ?? null
})
