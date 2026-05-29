import { getToken } from '~/features/auth/utils/getToken'

export interface PartnerMessage {
  id: string
  ong_id: string
  partner_id: string
  sender_id: string
  sender_role: 'agent' | 'partner'
  content: string
  read_at: string | null
  created_at: string
}

export interface PartnerConversation {
  partnerId: string
  partnerName: string
  partnerEmail: string
  partnerAvatar: string | null
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export async function fetchPartnerMessages(
  ongId: string,
  partnerId?: string
): Promise<PartnerMessage[]> {
  const token = await getToken()
  const qs = partnerId ? `?partnerId=${partnerId}` : ''
  return $fetch<PartnerMessage[]>(`/api/ongs/${ongId}/partner-messages${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function postPartnerMessage(
  ongId: string,
  content: string,
  partnerId?: string
): Promise<PartnerMessage> {
  const token = await getToken()
  return $fetch<PartnerMessage>(`/api/ongs/${ongId}/partner-messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { content, partnerId },
  })
}

export async function fetchPartnerConversations(ongId: string): Promise<PartnerConversation[]> {
  const token = await getToken()
  return $fetch<PartnerConversation[]>(`/api/ongs/${ongId}/partner-conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
