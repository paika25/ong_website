import { defineStore, skipHydrate } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/auth.types'

const STORAGE_KEYS = {
  LOGIN: 'login',
  USER: 'user',
  TOKEN: 'auth-token',
  REFRESH_TOKEN: 'refresh-token'
}

/**
 * Pinia store (setup-style) for authentication using Composition API syntax.
 * - client-safe localStorage access
 * - User data persistence
 * - exports refs, computed and actions
 */
export const useAuthStore = defineStore('auth', () => {
  // reactive state - initialize from localStorage only on client
  const connected = ref(false)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)
  const error = ref<string | null>(null)

  // computed getters
  const isConnected = computed(() => connected.value === true)
  const isAuthenticated = computed(() => connected.value && user.value !== null)
  const currentUser = computed(() => user.value)
  const fullName = computed(() => {
    if (!user.value) return ''
    return user.value.fullName || [user.value.firstName, user.value.lastName].filter(Boolean).join(' ') || user.value.email.split('@')[0]
  })
  const isAgent = computed(() => user.value?.accountType === 'user_agent')
  const isPartner = computed(() => user.value?.accountType === 'user_partner')
  const isVerified = computed(() => user.value?.verified === true)
  const userInitials = computed(() => {
    if (!user.value) return '?'
    const first = user.value.firstName?.[0] || user.value.email[0]
    const last = user.value.lastName?.[0] || ''
    return (first + last).toUpperCase()
  })

  // actions
  
  /**
   * Définir l'utilisateur connecté et persister dans localStorage
   */
  function setUser(userData: User | null) {
    user.value = userData
    connected.value = !!userData
    error.value = null
    
    try {
      if (typeof window !== 'undefined') {
        if (userData) {
          localStorage.setItem(STORAGE_KEYS.LOGIN, 'true')
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
          console.log('✅ User persisté:', userData.email)
        } else {
          localStorage.removeItem(STORAGE_KEYS.LOGIN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          console.log('🗑️ User supprimé du storage')
        }
      }
    } catch (e) {
      console.warn('⚠️ Erreur localStorage:', e)
    }
  }

  /**
   * Connexion - alias pour setUser
   */
  function setConnected(userData?: User) {
    if (userData) {
      setUser(userData)
    } else {
      connected.value = true
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.LOGIN, 'true')
        }
      } catch (e) {
        // ignore localStorage errors
      }
    }
  }

  /**
   * Déconnexion - nettoyer tout
   */
  function setDisconnected() {
    user.value = null
    connected.value = false
    error.value = null
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.LOGIN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        sessionStorage.clear()
      }
    } catch (e) {
      // ignore
    }
  }

  /**
   * Initialiser depuis le localStorage
   */
  function initFromStorage() {
    if (typeof window === 'undefined') return
    if (initialized.value) return
    
    try {
      const logged = localStorage.getItem(STORAGE_KEYS.LOGIN)
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      
      if (logged === 'true' && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User
          user.value = parsedUser
          connected.value = true
          console.log('🔄 User restauré depuis localStorage:', parsedUser.email)
        } catch (parseError) {
          console.warn('⚠️ Erreur parsing user:', parseError)
          localStorage.removeItem(STORAGE_KEYS.USER)
          connected.value = false
        }
      } else {
        connected.value = logged === 'true'
      }
      
      initialized.value = true
    } catch (e) {
      console.warn('⚠️ Erreur initFromStorage:', e)
    }
  }

  /**
   * Vérifier et rafraîchir la session avec Supabase
   */
  async function verifySession() {
    if (typeof window === 'undefined') return false
    
    loading.value = true
    
    try {
      const { useAuthService } = await import('../services/authService')
      const authService = useAuthService()
      
      const currentUserData = await authService.getCurrentUser()
      
      if (currentUserData) {
        setUser(currentUserData)
        console.log('✅ Session vérifiée:', currentUserData.email)
        return true
      } else {
        // Session invalide - nettoyer
        if (connected.value) {
          console.log('⚠️ Session expirée, déconnexion...')
          setDisconnected()
        }
        return false
      }
    } catch (e) {
      console.error('❌ Erreur vérification session:', e)
      return false
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  /**
   * Middleware pour protéger les pages
   */
  function middleware(redirectTo: string = '/auth/login') {
    if (!isConnected.value) {
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo
      }
      return false
    }
    return true
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  function hasRole(role: 'user_partner' | 'user_agent'): boolean {
    return user.value?.accountType === role
  }

  /**
   * Mettre à jour partiellement les données utilisateur
   */
  function updateUserData(updates: Partial<User>) {
    if (!user.value) return
    
    user.value = {
      ...user.value,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // Persister les modifications
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
      }
    } catch (e) {
      console.warn('⚠️ Erreur update localStorage:', e)
    }
  }

  /**
   * Définir une erreur
   */
  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  /**
   * Définir l'état de chargement
   */
  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  // Auto-init from storage when the store is first used on client
  if (typeof window !== 'undefined') {
    initFromStorage()
  }

  return {
    // state - skip hydration to avoid SSR issues
    connected: skipHydrate(connected),
    user: skipHydrate(user),
    loading: skipHydrate(loading),
    initialized: skipHydrate(initialized),
    error: skipHydrate(error),
    
    // getters
    isConnected,
    isAuthenticated,
    currentUser,
    fullName,
    isAgent,
    isPartner,
    isVerified,
    userInitials,
    
    // actions
    setUser,
    setConnected,
    setDisconnected,
    initFromStorage,
    verifySession,
    middleware,
    hasRole,
    updateUserData,
    setError,
    setLoading
  }
})

export default useAuthStore
