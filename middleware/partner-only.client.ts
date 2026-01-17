/**
 * Middleware pour les pages réservées aux partenaires - CLIENT-ONLY
 * 
 * Usage:
 * definePageMeta({
 *   middleware: ['auth', 'partner-only']
 * })
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { useAuthStore } = await import('~/features/auth/stores/auth.client')
  const authStore = useAuthStore()

  // Vérifier d'abord l'authentification
  if (!authStore.isConnected) {
    const supabase = useSupabase()
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: account } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (account) {
          authStore.setUser(account)
        }
      }
    }
  }

  // Vérifier le rôle
  if (!authStore.isPartner) {
    console.warn('⚠️ Accès refusé - Réservé aux partenaires')
    return navigateTo('/dashboard')
  }
})
