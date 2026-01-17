import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Instance de fallback si le plugin n'est pas chargé
let fallbackInstance: SupabaseClient | null = null

// Helper de debug centralisé
const prefix = () => `[useSupabase:${new Date().toISOString()}]`
const dbg = {
  log: (...args: any[]) => console.log(prefix(), ...args),
  info: (...args: any[]) => console.info(prefix(), ...args),
  warn: (...args: any[]) => console.warn(prefix(), ...args),
  error: (...args: any[]) => console.error(prefix(), ...args),
  debug: (...args: any[]) => console.debug(prefix(), ...args),
}

/**
 * Créer une instance de fallback si le plugin n'est pas disponible
 */
const createFallbackInstance = (): SupabaseClient | null => {
  if (fallbackInstance) return fallbackInstance

  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public?.supabaseUrl as string
    const supabaseKey = config.public?.supabaseKey as string

    if (!supabaseUrl || !supabaseKey) {
      dbg.error('❌ Cannot create fallback: missing credentials')
      return null
    }

    dbg.warn('⚠️ Creating fallback Supabase instance')
    
    fallbackInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: {
          getItem: (key) => {
            if (typeof window === 'undefined') return null
            const localValue = localStorage.getItem(key)
            if (localValue) return localValue
            
            const cookies = document.cookie.split(';')
            const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
            return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
          },
          setItem: (key, value) => {
            if (typeof window === 'undefined') return
            localStorage.setItem(key, value)
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

    dbg.info('✅ Fallback instance created')
    return fallbackInstance
  } catch (e) {
    dbg.error('❌ Failed to create fallback instance', e)
    return null
  }
}

/**
 * Composable CLIENT-ONLY pour accéder au client Supabase
 * Retourne l'instance créée par le plugin supabase.client.ts
 * Ou crée une instance de fallback si le plugin n'est pas disponible
 */
export const useSupabase = (): SupabaseClient | null => {
  dbg.debug('Entering useSupabase()')

  try {
    const nuxtApp = useNuxtApp()
    dbg.debug('nuxtApp exists:', Boolean(nuxtApp))
    
    // Vérifier si $supabase existe
    const hasSupabase = nuxtApp && '$supabase' in nuxtApp
    dbg.debug('$supabase in nuxtApp:', hasSupabase)
    
    if (hasSupabase && (nuxtApp as any).$supabase) {
      dbg.info('✅ Using supabase instance from Nuxt plugin')
      return (nuxtApp as any).$supabase as SupabaseClient
    }
    
    // Fallback: créer notre propre instance
    dbg.warn('⚠️ Nuxt plugin $supabase not found, using fallback')
    return createFallbackInstance()
  } catch (e) {
    dbg.error('❌ Error while accessing Nuxt app or plugin', e)
    
    // En cas d'erreur, essayer le fallback
    return createFallbackInstance()
  }
}

// Export pour les imports directs
export default useSupabase

// Helper pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  dbg.debug('Checking supabase connection')
  const supabase = useSupabase()
  
  if (!supabase) {
    dbg.warn('⚠️ Supabase client not initialized')
    return false
  }
  
  try {
    dbg.debug('Calling supabase.from("ongs").select(...)')
    const { data, error } = await supabase.from('ongs').select('id').limit(1)
    if (error) {
      dbg.error('❌ Supabase connection error:', error)
      return false
    }
    dbg.info('✅ Supabase connected successfully', { sampleRow: Array.isArray(data) ? data[0] : data })
    return true
  } catch (err) {
    dbg.error('❌ Supabase connection failed:', err)
    return false
  }
}
