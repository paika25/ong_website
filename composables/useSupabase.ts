import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './supabase'

let supabaseInstance: SupabaseClient<Database> | null = null

export const useSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()

  console.log('Supabase configuration:', config)
  
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

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

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Supabase client initialized')
  }

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
