/**
 * Middleware agent-only universel (SSR + CSR)
 * Réservé au rôle `user_agent`.
 *
 * Usage :
 *   definePageMeta({ middleware: ['auth', 'agent-only'] })
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
  if (import.meta.client) {
    const { useAuthStore } = await import('~/features/auth/stores/auth.client')
    const authStore = useAuthStore()

    let role = authStore.currentUser?.accountType ?? null

    if (!role) {
      const supabase = useSupabase()
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          role = getRoleFromJWT(session.access_token)
        }
      }
    }

    if (role === 'user_agent') return
    return navigateTo('/dashboard')
  }

  // SSR
  const cookies = useRequestHeaders(['cookie'])
  const sessionMatch = (cookies.cookie ?? '').match(/sb-[^-]+-auth-token=([^;]+)/)
  if (sessionMatch) {
    try {
      const session = JSON.parse(decodeURIComponent(sessionMatch[1]))
      if (getRoleFromJWT(session?.access_token ?? '') === 'user_agent') return
    } catch { /* */ }
  }

  return navigateTo('/dashboard')
})
