/**
 * Middleware pour les invités (non connectés) - CLIENT-ONLY
 * Redirige vers le dashboard si déjà connecté
 * 
 * Usage:
 * definePageMeta({
 *   middleware: ['guest']
 * })
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return

  const { useAuthStore } = await import('~/features/auth/stores/auth.client')
  const authStore = useAuthStore()

  // Si déjà connecté, rediriger
  if (authStore.isConnected && authStore.currentUser) {
    const redirect = to.query.redirect as string
    return navigateTo(redirect || '/dashboard')
  }

  // Vérifier la session Supabase
  const supabase = useSupabase()
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const redirect = to.query.redirect as string
      return navigateTo(redirect || '/dashboard')
    }
  }
})
