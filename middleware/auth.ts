/**
 * Middleware d'authentification
 * 
 * Protège les pages qui nécessitent une connexion.
 * 
 * Usage dans une page:
 * definePageMeta({
 *   middleware: ['auth']
 * })
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Pages publiques - pas besoin d'authentification
  const publicPages = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/callback',
    '/auth/forgot',
    '/auth/reset-password',
    '/about',
    '/contact',
    '/ongs'
  ]

  // Vérifier si c'est une page publique
  const isPublicPage = publicPages.some(page => 
    to.path === page || to.path.startsWith('/ongs/')
  )

  if (isPublicPage) {
    return
  }

  // Côté client uniquement
  if (import.meta.client) {
    const { useAuthStore } = await import('~/features/auth/stores/auth')
    const authStore = useAuthStore()
    
    // Si déjà connecté dans le store
    if (authStore.isConnected && authStore.currentUser) {
      return
    }

    // Vérifier la session Supabase
    const supabase = useSupabase()
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        return
      }
    }

    // Non connecté - rediriger
    const redirect = to.fullPath !== '/auth/login' ? to.fullPath : '/'
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
  }
})
