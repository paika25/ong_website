import { getToken } from '~/features/auth/utils/getToken'

export interface Message {
  id: string
  sender_id: string
  sender_role: 'back_office' | 'agent'
  content: string
  read_at: string | null
  created_at: string
}

export async function fetchMessages(apiBase: string, ongId: string): Promise<Message[]> {
  const token = await getToken()
  return $fetch<Message[]>(`${apiBase}/${ongId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function postMessage(
  apiBase: string,
  ongId: string,
  content: string
): Promise<Message> {
  const token = await getToken()
  return $fetch<Message>(`${apiBase}/${ongId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { content },
  })
}
