/**
 * Middleware pour les pages réservées aux partenaires
 * 
 * Usage:
 * definePageMeta({
 *   middleware: ['auth', 'partner-only']
 * })
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Côté client uniquement
  if (!import.meta.client) return

  const { useAuthStore } = await import('~/features/auth/stores/auth')
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
