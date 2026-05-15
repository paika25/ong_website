export type KanbanColumnId =
  | 'a_verifier'
  // | 'en_cours'
  | 'complement_requis'
  | 'badge_suspendu'
  | 'valide'
  | 'cloture'

export interface KanbanColumn {
  id: KanbanColumnId
  label: string
  color?: string
}

export interface DossierCard {
  id: string
  ongName: string
  submittedAt: string  // ISO 8601
  status: string
  score?: number
  agentEmail?: string
  agentId?: string
  commentaire?: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'a_verifier',        label: 'À vérifier',     color: 'blue'   },
  // { id: 'en_cours',          label: 'En cours',       color: 'purple' },
  { id: 'complement_requis', label: 'Docs manquants', color: 'amber'  },
  { id: 'badge_suspendu',    label: 'Suspendu',       color: 'red'    },
  { id: 'valide',            label: 'Certifiés ✓',    color: 'green'  },
  { id: 'cloture',           label: 'Clôturés',       color: 'gray'   },
]

// Tous les statuts sont affichés — pending/submitted → À vérifier, rejected/inactive → Clôturés
export const KANBAN_STATUSES = new Set([
  'pending', 'submitted', 'under_review',
  'complement_required', 'suspended',
  'verified', 'active',
  'rejected', 'inactive',
])

export function ongStatusToColumn(status: string): KanbanColumnId {
  const map: Record<string, KanbanColumnId> = {
    pending:             'a_verifier',
    submitted:           'a_verifier',
    // under_review:        'en_cours',
    complement_required: 'complement_requis',
    suspended:           'badge_suspendu',
    verified:            'valide',
    active:              'valide',
    rejected:            'cloture',
    inactive:            'cloture',
  }
  return map[status] ?? 'a_verifier'
}

export type BadgeStatus = 'verified' | 'pending' | 'suspended' | 'unverified'
export type BadgeSize   = 'sm' | 'md' | 'lg'
