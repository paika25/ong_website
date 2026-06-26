import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  // Lecture publique avec la clé anon (pas d'auth requise)
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const [ongsRes, donationsRes, partnersRes] = await Promise.all([
    supabase.from('ongs').select('status', { count: 'exact', head: false }),
    supabase.from('financial_transactions').select('amount').eq('status', 'completed').eq('currency', 'eur'),
    supabase.from('accounts').select('id', { count: 'exact', head: false }).eq('account_type', 'user_partner'),
  ])

  const ongs = ongsRes.data ?? []
  const donations = donationsRes.data ?? []
  const certifiedCount = ongs.filter((o: any) => o.status === 'verified' || o.status === 'active').length
  const totalAmountCents = donations.reduce((sum: number, d: any) => sum + (d.amount ?? 0), 0)
  const partnerCount = partnersRes.count ?? 0

  return {
    certifiedOngs:    certifiedCount,
    partnerCount,
    totalAmountCents,
    donationCount:    donations.length,
  }
})
