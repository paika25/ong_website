import { getToken } from '~/features/auth/utils/getToken'

export interface ActionResult {
  success: boolean
  status?: string
}

export async function submitDossier(ongId: string): Promise<ActionResult> {
  const token = await getToken()
  return $fetch<ActionResult>(`/api/ongs/${ongId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function resubmitDossier(ongId: string): Promise<ActionResult> {
  const token = await getToken()
  return $fetch<ActionResult>(`/api/ongs/${ongId}/resubmit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}
