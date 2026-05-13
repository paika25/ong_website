import { getToken } from '~/features/auth/utils/getToken'

export interface Donation {
  id: string
  ong_id: string
  amount: number
  currency: string
  status: string
  provider: string
  donor_email: string | null
  created_at: string
  stripe_payment_intent_id: string | null
  metadata: Record<string, unknown> | null
}

export interface AuditEntry {
  id: string
  action: string
  ong_id: string
  performed_by: string | null
  details_json: Record<string, unknown> | null
  created_at: string
  ongs?: { name: string }
}

export interface AuditPage {
  data: AuditEntry[]
  cursor: string | null
}

export interface HistoriqueParams {
  action?: string
  ongId?: string
  cursor?: string
}

export async function getDonations(): Promise<Donation[]> {
  const token = await getToken()
  return $fetch<Donation[]>('/api/admin/donations', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getHistorique(params: HistoriqueParams): Promise<AuditPage> {
  const token = await getToken()
  const qs = new URLSearchParams()
  if (params.action) qs.set('action', params.action)
  if (params.ongId)  qs.set('ong_id', params.ongId)
  if (params.cursor) qs.set('cursor', params.cursor)
  return $fetch<AuditPage>(`/api/admin/historique?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
