import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('🔌 [PLUGIN] supabase.client.ts init START')
  
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  console.log('🔌 [PLUGIN] Config:', {
    url: supabaseUrl,
    keyLength: supabaseKey?.length,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey
  })

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ [PLUGIN] Missing Supabase credentials!')
    return {
      provide: {
        supabase: null
      }
    }
  }

  console.log('🔌 [PLUGIN] Creating Supabase client...')

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: {
        getItem: (key) => {
          console.log('📦 [STORAGE] getItem:', key)
          if (typeof window === 'undefined') return null
          
          const localValue = localStorage.getItem(key)
          console.log('📦 [STORAGE] localStorage value:', localValue ? 'EXISTS' : 'NULL')
          if (localValue) return localValue
          
          const cookies = document.cookie.split(';')
          const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
          const cookieValue = cookie ? decodeURIComponent(cookie.split('=')[1]) : null
          console.log('📦 [STORAGE] cookie value:', cookieValue ? 'EXISTS' : 'NULL')
          return cookieValue
        },
        setItem: (key, value) => {
          console.log('💾 [STORAGE] setItem:', key, value ? '(value set)' : '(empty)')
          if (typeof window === 'undefined') return
          
          localStorage.setItem(key, value)
          
          const maxAge = 60 * 60 * 24 * 7
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
        },
        removeItem: (key) => {
          console.log('🗑️ [STORAGE] removeItem:', key)
          if (typeof window === 'undefined') return
          
          localStorage.removeItem(key)
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    }
  })

  console.log('✅ [PLUGIN] Supabase client created')

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 [PLUGIN] Auth state:', event, session?.user?.email || 'no user')
  })

  nuxtApp.provide('supabase', supabase)
  console.log('✅ [PLUGIN] Supabase plugin initialized')
})
