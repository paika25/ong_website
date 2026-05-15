/**
 * Middleware back-office universel (SSR + CSR)
 * Réservé aux rôles `admin` ou `back_office`.
 *
 * Usage :
 *   definePageMeta({ middleware: ['auth', 'back-office'] })
 */

function getRoleFromJWT(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload?.app_metadata?.role ?? payload?.role ?? null
  } catch {
    return null
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // ── Côté client ───────────────────────────────────────────────
  if (import.meta.client) {
    // Toujours lire le rôle depuis le JWT — le store ne contient que user_agent/user_partner
    // et ne reflète pas les rôles admin/back_office définis dans app_metadata
    const supabase = useSupabase()
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        const role = getRoleFromJWT(session.access_token)
        if (role === 'admin' || role === 'back_office') return
      }
    }

    throw createError({ statusCode: 403, statusMessage: 'Accès réservé au back-office' })
  }

  // ── Côté serveur (SSR) ────────────────────────────────────────
  const cookies = useRequestHeaders(['cookie'])
  const cookieHeader = cookies.cookie ?? ''
  const sessionMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)

  if (sessionMatch) {
    try {
      const decoded = decodeURIComponent(sessionMatch[1])
      const session = JSON.parse(decoded)
      if (session?.access_token) {
        const role = getRoleFromJWT(session.access_token)
        if (role === 'admin' || role === 'back_office') return
      }
    } catch {
      // cookie invalide
    }
  }

  throw createError({ statusCode: 403, statusMessage: 'Accès réservé au back-office' })
})
