import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Pinia store (setup-style) for authentication using Composition API syntax.
 * - client-safe localStorage access
 * - exports refs, computed and actions
 */
export const useAuthStore = defineStore('auth', () => {
  // reactive state - initialize from localStorage only on client
  const connected = ref(false)

  // computed getter
  const isConnected = computed(() => connected.value === true)

  // actions
  function setConnected() {
    connected.value = true
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('login', 'true')
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }

  function setDisconnected() {
    connected.value = false
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('login')
      }
    } catch (e) {
      // ignore
    }
  }

  function initFromStorage() {
    if (typeof window === 'undefined') return
    try {
      const logged = localStorage.getItem('login')
      connected.value = logged === 'true'
    } catch (e) {
      // ignore
    }
  }

  // Auto-init from storage when the store is first used on client
  if (typeof window !== 'undefined') {
    initFromStorage()
  }

	function middleware(){
		if (!isConnected.value) {
			window.location.href = '/auth/login'   
		}
	}

  return {
    // state
    connected,
    // getter
    isConnected,
    // actions
    setConnected,
    setDisconnected,
    initFromStorage,
		middleware
  }
})

export default useAuthStore
