import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()
  

// Configuration Supabase
// Note: Dans Nuxt 3, les variables NUXT_PUBLIC_* sont automatiquement exposées
// via import.meta.env côté client et process.env côté serveur
const supabaseUrl = config.public.supabaseUrl as string || '';
const supabaseKey = config.public.supabaseKey as string || '';


// Client Supabase singleton (créé seulement si les credentials sont présents)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      }
    })
  : null

// Log du statut de configuration (seulement en développement)
if (process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials not configured. Using mock data.')
  } else {
    console.log('✅ Supabase client initialized')
  }
}

// Type helper pour les tables de la base de données
export type Database = {
  public: {
    Tables: {
      ongs: {
        Row: {
          id: string
          account_id: string
          name: string
          description: string
          category: string
          status: string
          location: string
          image: string | null
          volunteers: number
          email: string
          phone: string | null
          website: string | null
          projects: any
          financials: any
          legal: any
          impact: any
          donation_opportunities: any | null
          investment_opportunities: any | null
          monitoring: any
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ongs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ongs']['Insert']>
      }
      accounts: {
        Row: {
          id: string
          email: string
          password_hash: string
          account_type: 'user_agent' | 'user_partner'
          first_name: string
          last_name: string
          company_name: string | null
          avatar: string | null
          bio: string | null
          location: string | null
          website: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
      }
      donations: {
        Row: {
          id: string
          donor_account_id: string
          ong_id: string
          amount: number
          type: string
          status: string
          payment_method: string
          transaction_id: string
          metadata: any
          created_at: string
        }
      }
    }
  }
}

// Helper pour vérifier la connexion
export const checkSupabaseConnection = async () => {
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
