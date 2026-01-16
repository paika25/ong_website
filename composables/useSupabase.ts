import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './supabase'

let supabaseInstance: SupabaseClient<Database> | null = null

export const useSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()
  
  // Essayer plusieurs sources pour les variables (pour compatibilité Netlify)
  const supabaseUrl = config.public.supabaseUrl as string || 
                      (import.meta.env?.NUXT_PUBLIC_SUPABASE_URL as string) ||
                      ''
  
  const supabaseKey = config.public.supabaseKey as string || 
                      (import.meta.env?.NUXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
                      ''
// const supabaseUrl = 'https://cdbpsbwhklvkjpaeavnk.supabase.co'
// const supabaseKey = 'sb_publishable_UX23hMKEvRijJTkRFwgXhQ_gq3S10xX'


  console.log('🔍 Supabase config check:')
  console.log('- URL found:', !!supabaseUrl, '(length:', supabaseUrl?.length, ')')
  console.log('- Key found:', !!supabaseKey, '(length:', supabaseKey?.length, ')')
  console.log('- URL preview:', supabaseUrl?.substring(0, 30) + '...')

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials not configured. Using mock data.')
    return null
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    }
  })

  console.log('✅ Supabase client initialized successfully')

  return supabaseInstance
}

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
