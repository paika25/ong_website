import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const { data, error } = await supabase
    .from('financial_transactions')
    .select(`
      id, amount, currency, status, provider, created_at,
      commission_cents, net_amount_cents, commission_rate,
      stripe_payment_intent_id, metadata,
      ongs(id, name, image)
    `)
    .eq('donor_id', user.id)
    .eq('transaction_type', 'donation')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
