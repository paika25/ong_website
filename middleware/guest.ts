/**
 * Middleware pour les invités (non connectés)
 * Redirige vers le dashboard si déjà connecté
 * 
 * Usage:
 * definePageMeta({
 *   middleware: ['guest']
 * })
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Côté client uniquement
  if (!import.meta.client) return

  const { useAuthStore } = await import('~/features/auth/stores/auth')
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
