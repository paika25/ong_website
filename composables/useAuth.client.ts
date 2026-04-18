import type { User } from '~/features/auth/types/auth.types'
import { useAuthStore } from '~/features/auth/stores/auth.client'

export const useAuth = () => {
  const supabase = useSupabase()
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia as any)

  /**
   * Utilisateur connecté
   */
  const user = computed(() => authStore.currentUser)

  /**
   * Est connecté ?
   */
  const isAuthenticated = computed(() => authStore.isConnected && !!authStore.currentUser)

  /**
   * Est un agent ONG ?
   */
  const isAgent = computed(() => authStore.isAgent)

  /**
   * Est un partenaire ?
   */
  const isPartner = computed(() => authStore.isPartner)

  /**
   * Chargement en cours
   */
  const loading = computed(() => authStore.loading)

  /**
   * Vérifier et charger la session Supabase
   */
  const checkSession = async (): Promise<User | null> => {
    if (!supabase) {
      console.warn('⚠️ Supabase non disponible')
      return null
    }

    authStore.setLoading(true)

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        authStore.setDisconnected()
        return null
      }

      // Si déjà dans le store, retourner
      if (authStore.currentUser?.id === session.user.id) {
        return authStore.currentUser
      }

      // Charger depuis accounts
      const { data: account } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (account) {
        const user: User = {
          id: account.id,
          email: account.email,
          accountType: account.account_type,
          firstName: account.first_name,
          lastName: account.last_name,
          fullName: [account.first_name, account.last_name].filter(Boolean).join(' ') || account.email,
          companyName: account.company_name,
          avatar: account.avatar,
          bio: account.bio,
          location: account.location,
          website: account.website,
          verified: account.verified,
          createdAt: account.created_at,
          updatedAt: account.updated_at
        }
        authStore.setUser(user)
        return user
      }

      // Fallback: utiliser les métadonnées
      const meta = session.user.user_metadata
      const fallbackUser: User = {
        id: session.user.id,
        email: session.user.email!,
        accountType: meta?.account_type || 'user_partner',
        firstName: meta?.first_name || null,
        lastName: meta?.last_name || null,
        fullName: [meta?.first_name, meta?.last_name].filter(Boolean).join(' ') || session.user.email!,
        companyName: meta?.company_name,
        bio: meta?.bio,
        location: meta?.location,
        website: meta?.website,
        verified: false,
        createdAt: session.user.created_at,
        updatedAt: session.user.created_at
      }
      authStore.setUser(fallbackUser)
      return fallbackUser

    } catch (err) {
      console.error('❌ Erreur checkSession:', err)
      authStore.setDisconnected()
      return null
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Déconnexion
   */
  const logout = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Erreur logout:', err)
    }

    authStore.setDisconnected()

    // Nettoyer les cookies Supabase
    if (typeof window !== 'undefined') {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim()
        if (name.startsWith('sb-')) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      })
    }

    await navigateTo('/auth/login')
  }

  /**
   * Rafraîchir la session
   */
  const refreshSession = async () => {
    if (!supabase) return null

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      return session
    } catch (err) {
      console.error('Erreur refresh:', err)
      return null
    }
  }

  return {
    user,
    isAuthenticated,
    isAgent,
    isPartner,
    loading,
    checkSession,
    logout,
    refreshSession
  }
}
