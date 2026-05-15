import { getToken } from '~/features/auth/utils/getToken'
import type { DossierCard } from '../types'

export interface DossierDetail {
  ong: Record<string, unknown> | null
  documents: Array<{ name: string; url: string }>
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

export interface ActionBody {
  comment?: string
  message?: string
}

// ── Liste & détail ────────────────────────────────────────────────────────────

export async function getDossiers(): Promise<DossierCard[]> {
  const token = await getToken()
  return $fetch<DossierCard[]>('/api/admin/dossiers', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getDossier(ongId: string): Promise<DossierDetail> {
  const token = await getToken()
  return $fetch<DossierDetail>(`/api/admin/dossiers/${ongId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Actions métier ────────────────────────────────────────────────────────────

export async function callDossierAction(
  ongId: string,
  action: string,
  body: ActionBody = {}
): Promise<unknown> {
  const token = await getToken()
  return $fetch(`/api/admin/dossiers/${ongId}/${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
}

// ── Audit trail ───────────────────────────────────────────────────────────────

export interface AuditParams {
  action?: string
  ongId?: string
  cursor?: string
}

export async function getAuditTrail(
  ongId: string,
  cursorParam?: string
): Promise<AuditEntry[]> {
  const token = await getToken()
  const qs = cursorParam ? `?cursor=${cursorParam}` : ''
  return $fetch<AuditEntry[]>(`/api/admin/dossiers/${ongId}/audit${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getHistorique(params: AuditParams): Promise<AuditPage> {
  const token = await getToken()
  const qs = new URLSearchParams()
  if (params.action) qs.set('action', params.action)
  if (params.ongId)  qs.set('ong_id', params.ongId)
  if (params.cursor) qs.set('cursor', params.cursor)
  return $fetch<AuditPage>(`/api/admin/historique?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
