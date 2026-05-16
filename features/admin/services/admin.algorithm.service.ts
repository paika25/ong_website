import { getToken } from '~/features/auth/utils/getToken'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AlgorithmWeights {
  documents_uploaded:   number
  profile_complete:     number
  backoffice_validated: number
  financial_reports:    number
  projects_declared:    number
}

export interface AlgorithmThresholds {
  submission_minimum: number
  verified_badge:     number
}

export interface AlgorithmParams {
  weights:            AlgorithmWeights
  thresholds:         AlgorithmThresholds
  required_documents: string[]
}

export type AlgorithmStatus = 'draft' | 'approved' | 'active' | 'deprecated'

export interface AlgorithmVersion {
  id:          string
  version:     string
  params_json: AlgorithmParams
  status:      AlgorithmStatus
  approved_by: string | null
  approved_at: string | null
  created_by:  string | null
  created_at:  string
}

export interface CreateAlgorithmPayload {
  version:            string
  weights:            AlgorithmWeights
  thresholds:         AlgorithmThresholds
  required_documents: string[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export const WEIGHT_KEYS: Array<{ key: keyof AlgorithmWeights; label: string; description: string }> = [
  { key: 'profile_complete',     label: 'Profil complet',            description: 'Nom, mission, localisation, email, téléphone' },
  { key: 'backoffice_validated', label: 'Validation back-office',    description: 'Dossier validé par l\'équipe de certification' },
  { key: 'documents_uploaded',   label: 'Documents obligatoires',    description: 'Statuts + récépissé uploadés' },
  { key: 'financial_reports',    label: 'Rapport financier audité',  description: 'Au moins un rapport financier certifié' },
  { key: 'projects_declared',    label: 'Projets déclarés',          description: 'Au moins un projet déclaré' },
]

export const STATUS_META: Record<AlgorithmStatus, { label: string; class: string; icon: string }> = {
  draft:      { label: 'Brouillon',  class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',       icon: 'i-heroicons-pencil-square' },
  approved:   { label: 'Approuvé',   class: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',       icon: 'i-heroicons-check' },
  active:     { label: 'Actif',      class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',   icon: 'i-heroicons-bolt' },
  deprecated: { label: 'Déprécié',   class: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',          icon: 'i-heroicons-archive-box-x-mark' },
}

export const VALID_TRANSITIONS: Record<AlgorithmStatus, Array<{ status: AlgorithmStatus; label: string; color: string }>> = {
  draft:      [
    { status: 'approved',   label: 'Approuver',   color: 'blue' },
    { status: 'deprecated', label: 'Archiver',     color: 'gray' },
  ],
  approved:   [
    { status: 'active',     label: 'Activer',      color: 'green' },
    { status: 'deprecated', label: 'Archiver',     color: 'gray' },
  ],
  active:     [
    { status: 'deprecated', label: 'Déprécier',   color: 'red' },
  ],
  deprecated: [],
}

export function weightsTotal(w: AlgorithmWeights): number {
  return Object.values(w).reduce((s, v) => s + v, 0)
}

export function defaultWeights(): AlgorithmWeights {
  return { documents_uploaded: 20, profile_complete: 25, backoffice_validated: 30, financial_reports: 15, projects_declared: 10 }
}

export function defaultThresholds(): AlgorithmThresholds {
  return { submission_minimum: 40, verified_badge: 70 }
}

// ── API calls ──────────────────────────────────────────────────────────────────

export async function getAlgorithmVersions(): Promise<AlgorithmVersion[]> {
  const token = await getToken()
  return $fetch<AlgorithmVersion[]>('/api/admin/algorithm', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAlgorithmVersion(payload: CreateAlgorithmPayload): Promise<AlgorithmVersion> {
  const token = await getToken()
  return $fetch<AlgorithmVersion>('/api/admin/algorithm', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  })
}

export async function updateAlgorithmDraft(
  id: string,
  params: Partial<Pick<CreateAlgorithmPayload, 'weights' | 'thresholds' | 'required_documents'>>
): Promise<AlgorithmVersion> {
  const token = await getToken()
  return $fetch<AlgorithmVersion>(`/api/admin/algorithm/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: params,
  })
}

export async function transitionAlgorithmStatus(
  id: string,
  status: 'approved' | 'active' | 'deprecated'
): Promise<AlgorithmVersion> {
  const token = await getToken()
  return $fetch<AlgorithmVersion>(`/api/admin/algorithm/${id}/status`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { status },
  })
}
