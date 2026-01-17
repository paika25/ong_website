import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Composable CLIENT-ONLY pour accéder au client Supabase
 * ⚠️ À utiliser uniquement côté client (dans onMounted, ClientOnly, etc.)
 */
export const useSupabase = (): SupabaseClient | null => {
  // Vérification côté client
  if (typeof window === 'undefined') {
    console.warn('⚠️ useSupabase appelé côté serveur - retour null')
    return null
  }
  
  try {
    const nuxtApp = useNuxtApp()

    if (nuxtApp?.$supabase) {
      console.log('✅ [useSupabase] Using supabase instance from Nuxt plugin')
      return nuxtApp.$supabase as SupabaseClient
    }

    console.warn('⚠️ [useSupabase] Plugin $supabase non trouvé')
    return null
  } catch (error) {
    console.error('❌ [useSupabase] Error:', error)
    return null
  }
}

// Export pour les imports directs
export default useSupabase

// Helper pour vérifier la connexion (désactivé temporairement)
export const checkSupabaseConnection = async () => {
  console.log('[checkSupabaseConnection] Checking connection...')
  const supabase = useSupabase()
  
  if (!supabase) {
    console.warn('⚠️ Supabase client not initialized')
    return false
  }
  
  try {
    console.log('[checkSupabaseConnection] Calling supabase.from("ongs").select(...)')
    const { data, error } = await supabase.from('ongs').select('id').limit(1)
    if (error) {
      console.error('❌ Supabase connection error:', error)
      return false
    }
    console.log('✅ Supabase connected successfully', { sampleRow: Array.isArray(data) ? data[0] : data })
    return true
  } catch (err) {
    console.error('❌ Supabase connection failed:', err)
    return false
  }
}
