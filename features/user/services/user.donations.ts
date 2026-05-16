import { useSupabase } from '~/composables/useSupabase.client'

export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
export type DonationType   = 'one-time' | 'monthly' | 'annual' | 'project-based'

export interface UserDonation {
  id:            string
  ongId:         string
  ongName:       string
  amount:        number  // en euros (centimes convertis)
  currency:      string
  type:          DonationType
  status:        DonationStatus
  provider:      string
  paymentMethod: string | null
  transactionId: string | null
  createdAt:     string
}

export const useUserDonationsService = () => {
  const fetchUserDonations = async (userId: string): Promise<UserDonation[]> => {
    const supabase = useSupabase()
    if (!supabase || !userId) return []

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('id, ong_id, amount, currency, status, provider, stripe_payment_intent_id, created_at, ong:ongs(name)')
        .eq('donor_id', userId)
        .eq('transaction_type', 'donation')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[user.donations] Erreur Supabase:', error.message)
        return []
      }

      return (data ?? []).map((d: any) => ({
        id:            d.id,
        ongId:         d.ong_id,
        ongName:       d.ong?.name ?? 'ONG inconnue',
        // financial_transactions stocke les montants EUR en centimes
        amount:        d.currency === 'eur' ? Math.round(d.amount / 100) : d.amount,
        currency:      d.currency ?? 'eur',
        type:          'one-time' as DonationType,
        status:        d.status as DonationStatus,
        provider:      d.provider ?? 'stripe',
        paymentMethod: d.provider ?? null,
        transactionId: d.stripe_payment_intent_id ?? null,
        createdAt:     d.created_at,
      }))
    } catch (err) {
      console.error('[user.donations] Exception:', err)
      return []
    }
  }

  return { fetchUserDonations }
}
