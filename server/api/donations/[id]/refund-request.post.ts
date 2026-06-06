import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const txId = getRouterParam(event, 'id')
  if (!txId) throw createError({ statusCode: 400, statusMessage: 'ID transaction manquant' })

  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  // Vérifier que la transaction appartient au donateur
  const { data: tx } = await supabase
    .from('financial_transactions')
    .select('id, donor_id, status, amount, ong_id')
    .eq('id', txId)
    .eq('donor_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (!tx) throw createError({ statusCode: 404, statusMessage: 'Transaction introuvable ou non éligible' })

  // Enregistrer la demande dans les metadata via audit_trail (table immuable → on crée une entrée d'audit)
  const serviceSupabase = createClient(
    config.public.supabaseUrl as string,
    config.supabaseServiceRoleKey as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  await serviceSupabase.from('audit_trail').insert({
    actor_id:    user.id,
    action:      'refund_request',
    target_type: 'financial_transaction',
    target_id:   txId,
    metadata: {
      amount:  tx.amount,
      ong_id:  tx.ong_id,
      donor_id: user.id,
    },
  })

  return { success: true }
})
