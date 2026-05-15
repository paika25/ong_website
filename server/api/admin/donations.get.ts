import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await supabase
    .from('financial_transactions')
    .select('id, ong_id, amount, currency, status, provider, donor_email, created_at, metadata, stripe_payment_intent_id')
    .eq('transaction_type', 'donation')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
