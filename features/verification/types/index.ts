export type KanbanColumnId = 'a_verifier' | 'en_cours' | 'complement_requis' | 'valide'

export interface KanbanColumn {
  id: KanbanColumnId
  label: string
}

export interface DossierCard {
  id: string           // ONG id
  ongName: string
  submittedAt: string  // ISO 8601
  status: string
  score?: number
  agentEmail?: string
  agentId?: string
  commentaire?: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'a_verifier',        label: 'À vérifier'         },
  { id: 'en_cours',          label: 'En cours'           },
  { id: 'complement_requis', label: 'Complément requis'  },
  { id: 'valide',            label: 'Validé'             },
]

export function ongStatusToColumn(status: string): KanbanColumnId {
  const map: Record<string, KanbanColumnId> = {
    submitted:           'a_verifier',
    under_review:        'en_cours',
    complement_required: 'complement_requis',
    verified:            'valide',
    active:              'valide',
  }
  return map[status] ?? 'a_verifier'
}

export function isUrgent(submittedAt: string): boolean {
  const hours = (Date.now() - new Date(submittedAt).getTime()) / 3_600_000
  return hours > 48
}

export type BadgeStatus = 'verified' | 'pending' | 'suspended' | 'unverified'
export type BadgeSize   = 'sm' | 'md' | 'lg'
