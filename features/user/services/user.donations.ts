import { useSupabase } from '~/composables/useSupabase.client'

export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type DonationType = 'one-time' | 'monthly' | 'annual' | 'project-based'

export interface DonationMetadata {
  anonymous: boolean
  publicMessage: string | null
  taxReceiptRequested: boolean
  taxReceiptSent: boolean
  recognitionType: string
}

export interface UserDonation {
  id: string
  ongId: string
  ongName: string
  amount: number
  type: DonationType
  status: DonationStatus
  paymentMethod: string | null
  transactionId: string | null
  metadata: DonationMetadata
  createdAt: string
}

export const useUserDonationsService = () => {
  const fetchUserDonations = async (userId: string): Promise<UserDonation[]> => {
    const supabase = useSupabase()
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('donations')
        .select('id, ong_id, amount, type, status, payment_method, transaction_id, metadata, created_at, ong:ongs ( name )')
        .eq('donor_account_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur chargement donations:', error.message)
        return []
      }

      if (!data || data.length === 0) return []

      return data.map((d: any) => ({
        id: d.id,
        ongId: d.ong_id,
        ongName: d.ong?.name || 'ONG inconnue',
        amount: Number(d.amount),
        type: d.type || 'one-time',
        status: d.status || 'pending',
        paymentMethod: d.payment_method,
        transactionId: d.transaction_id,
        metadata: d.metadata || { anonymous: false, publicMessage: null, taxReceiptRequested: false, taxReceiptSent: false, recognitionType: 'full_name' },
        createdAt: d.created_at
      }))
    } catch (err) {
      console.error('Erreur chargement donations:', err)
      return []
    }
  }

  return { fetchUserDonations }
}
