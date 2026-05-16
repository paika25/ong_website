import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const [ongsRes, donationsRes, usersRes] = await Promise.all([
    supabase.from('ongs').select('status'),
    supabase.from('financial_transactions').select('amount, status, currency').eq('status', 'completed').eq('currency', 'eur'),
    supabase.from('accounts').select('account_type'),
  ])

  const ongs = ongsRes.data ?? []
  const donations = donationsRes.data ?? []
  const users = usersRes.data ?? []

  const byStatus: Record<string, number> = {}
  for (const o of ongs) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1
  }

  return {
    totalOngs:        ongs.length,
    byStatus,
    totalDonations:   donations.length,
    totalAmountCents: donations.reduce((sum, d) => sum + (d.amount ?? 0), 0),
    totalUsers:       users.length,
    totalAgents:      users.filter(u => u.account_type === 'user_agent').length,
    totalPartners:    users.filter(u => u.account_type === 'user_partner').length,
  }
})
