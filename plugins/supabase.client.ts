import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase non configuré')
    return {
      provide: {
        supabase: null
      }
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      // Stockage personnalisé pour SSR
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') return null
          
          // Essayer localStorage
          const localValue = localStorage.getItem(key)
          if (localValue) return localValue
          
          // Fallback cookies
          const cookies = document.cookie.split(';')
          const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
          return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
        },
        setItem: (key, value) => {
          if (typeof window === 'undefined') return
          
          localStorage.setItem(key, value)
          
          // Cookie pour SSR (7 jours)
          const maxAge = 60 * 60 * 24 * 7
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
        },
        removeItem: (key) => {
          if (typeof window === 'undefined') return
          
          localStorage.removeItem(key)
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    }
  })

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔄 Auth state:', event)
    
    // Import dynamique pour éviter les problèmes de circular dependency
    const { useAuthStore } = await import('~/features/auth/stores/auth')
    const authStore = useAuthStore()
    
    if (event === 'SIGNED_IN' && session) {
      // Charger le profil depuis accounts
      const { data: account } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (account) {
        authStore.setUser({
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
        })
      } else {
        // Utiliser metadata comme fallback
        const meta = session.user.user_metadata
        authStore.setUser({
          id: session.user.id,
          email: session.user.email!,
          accountType: meta?.account_type || 'user_partner',
          firstName: meta?.first_name || null,
          lastName: meta?.last_name || null,
          fullName: [meta?.first_name, meta?.last_name].filter(Boolean).join(' ') || session.user.email!,
          companyName: meta?.company_name,
          avatar: meta?.avatar,
          bio: meta?.bio,
          location: meta?.location,
          website: meta?.website,
          verified: false,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at
        })
      }
    } else if (event === 'SIGNED_OUT') {
      authStore.setDisconnected()
    }
  })

  return {
    provide: {
      supabase
    }
  }
})
