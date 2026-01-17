import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[PLUGIN] 🚀 Initializing supabase.client.ts plugin')
  
  const config = useRuntimeConfig()
  
  console.log('[PLUGIN] 📝 Config loaded:', {
    hasUrl: Boolean(config.public?.supabaseUrl),
    hasKey: Boolean(config.public?.supabaseKey),
  })

  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    console.error('[PLUGIN] ❌ Supabase non configuré - credentials manquantes')
    return {
      provide: {
        supabase: null
      }
    }
  }

  console.log('[PLUGIN] 🔧 Creating Supabase client...')
  
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
          
          console.log('[STORAGE] 🔑 getItem:', key)
          
          // Essayer localStorage
          const localValue = localStorage.getItem(key)
          if (localValue) {
            console.log('[STORAGE] ✅ Found in localStorage')
            return localValue
          }
          
          // Fallback cookies
          const cookies = document.cookie.split(';')
          const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
          const value = cookie ? decodeURIComponent(cookie.split('=')[1]) : null
          
          if (value) {
            console.log('[STORAGE] ✅ Found in cookies')
          } else {
            console.log('[STORAGE] ⚠️ Not found')
          }
          
          return value
        },
        setItem: (key, value) => {
          if (typeof window === 'undefined') return
          
          console.log('[STORAGE] 💾 setItem:', key)
          
          localStorage.setItem(key, value)
          
          // Cookie pour SSR (7 jours)
          const maxAge = 60 * 60 * 24 * 7
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
        },
        removeItem: (key) => {
          if (typeof window === 'undefined') return
          
          console.log('[STORAGE] 🗑️ removeItem:', key)
          
          localStorage.removeItem(key)
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    }
  })

  console.log('[PLUGIN] ✅ Supabase client created successfully')

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[PLUGIN] 🔄 Auth state changed:', event, { hasSession: Boolean(session) })
    
    // Import dynamique pour éviter les problèmes de circular dependency
    const { useAuthStore } = await import('~/features/auth/stores/auth.client')
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

  console.log('[PLUGIN] 🎯 Providing $supabase to nuxtApp')

  return {
    provide: {
      supabase
    }
  }
})
