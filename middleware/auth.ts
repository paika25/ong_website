/**
 * Middleware d'authentification universel (SSR + CSR)
 * Redirige vers /auth/login si non connecté.
 *
 * Usage dans une page :
 *   definePageMeta({ middleware: ['auth'] })
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const publicPaths = [
    '/', '/auth/login', '/auth/signup', '/auth/callback',
    '/auth/forgot', '/auth/reset-password',
    '/about', '/contact', '/ongs',
  ]

  const isPublic = publicPaths.some(p => to.path === p || to.path.startsWith('/ongs/'))
  if (isPublic) return

  // ── Côté client : utiliser le store Pinia + Supabase ──────────
  if (import.meta.client) {
    const { useAuthStore } = await import('~/features/auth/stores/auth.client')
    const authStore = useAuthStore()

    if (authStore.isConnected && authStore.currentUser) return

    const supabase = useSupabase()
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return
    }

    const redirect = to.fullPath !== '/auth/login' ? to.fullPath : '/'
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
  }

  // ── Côté serveur (SSR) : lire le cookie de session Supabase ───
  // Le cookie 'sb-*-auth-token' est défini par le plugin supabase.client.ts
  const cookies = useRequestHeaders(['cookie'])
  const cookieHeader = cookies.cookie ?? ''

  // Chercher le cookie de session Supabase (format sb-<ref>-auth-token)
  const sessionMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)
  if (sessionMatch) {
    try {
      const decoded = decodeURIComponent(sessionMatch[1])
      const session = JSON.parse(decoded)
      if (session?.access_token) return
    } catch {
      // cookie corrompu → rediriger
    }
  }

  const redirect = to.fullPath !== '/auth/login' ? to.fullPath : '/'
  return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
})
