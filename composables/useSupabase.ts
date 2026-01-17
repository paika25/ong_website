import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

/**
 * Composable pour accéder au client Supabase
 * Utilise le plugin côté client, crée une instance côté serveur si nécessaire
 */
export const useSupabase = (): SupabaseClient | null => {
  // Côté client: utiliser le plugin
  const config = useRuntimeConfig()
  console.log('config',config.public.supabaseKey)
    if (typeof window !== 'undefined') {
    try {
      const nuxtApp = useNuxtApp()
      if (nuxtApp.$supabase) {
        return nuxtApp.$supabase as SupabaseClient
      }
    } catch (e) {
      console.error(e)
      // Plugin pas encore initialisé
    }
  }

  // Fallback: créer/retourner l'instance
  if (supabaseInstance) {
    return supabaseInstance
  }


  const supabaseUrl = config.public.supabaseUrl as string || 
                      (import.meta.env?.NUXT_PUBLIC_SUPABASE_URL as string) ||
                      ''
  
  const supabaseKey = config.public.supabaseKey as string || 
                      (import.meta.env?.NUXT_PUBLIC_SUPABASE_KEY as string) ||
                      ''
  
  // const supabaseUrl = config.public.supabaseUrl as string
  // const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials not configured')
    return null
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: true,
    }
  })

  return supabaseInstance
}

// Export pour les imports directs
export default useSupabase

// Helper pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  const supabase = useSupabase()
  
  if (!supabase) {
    console.warn('⚠️ Supabase client not initialized')
    return false
  }
  
  try {
    const { data, error } = await supabase.from('ongs').select('count').limit(1)
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      return false
    }
    console.log('✅ Supabase connected successfully')
    return true
  } catch (err) {
    console.error('❌ Supabase connection failed:', err)
    return false
  }
}
