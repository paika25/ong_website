import { getToken } from '~/features/auth/utils/getToken'

export interface PartnerAdminMessage {
  id: string
  sender_id: string
  sender_role: 'back_office' | 'partner'
  content: string
  read_at: string | null
  created_at: string
}

export async function fetchPartnerAdminMessages(partnerId: string): Promise<PartnerAdminMessage[]> {
  const token = await getToken()
  return $fetch<PartnerAdminMessage[]>(`/api/partners/${partnerId}/admin-messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function postPartnerAdminMessage(partnerId: string, content: string): Promise<PartnerAdminMessage> {
  const token = await getToken()
  return $fetch<PartnerAdminMessage>(`/api/partners/${partnerId}/admin-messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { content },
  })
}
