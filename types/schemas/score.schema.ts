import { z } from 'zod'

// Aligne avec la contrainte CHECK de score_history.trigger_event (migration 03)
export const ScoreTriggerEventSchema = z.enum([
  'DOCUMENT_UPLOADED',
  'DOCUMENT_DELETED',
  'PROFILE_UPDATED',
  'BACKOFFICE_VALIDATED',
  'BACKOFFICE_REJECTED',
  'DISPUTE_RESOLVED',
  'MANUAL_RECALCULATION',
])
export type ScoreTriggerEvent = z.infer<typeof ScoreTriggerEventSchema>

export const ScoreContextSchema = z.object({
  ongId:       z.string().uuid(),
  triggeredBy: z.string().uuid().optional(),
  details:     z.record(z.unknown()).optional(),
})
export type ScoreContext = z.infer<typeof ScoreContextSchema>

// Aligne avec la table audit_trail (migration 04)
export const AuditEntrySchema = z.object({
  entityType:  z.string(),
  entityId:    z.string().uuid(),
  action:      z.string(),
  performedBy: z.string().uuid().optional(),
  ongId:       z.string().uuid().optional(),
  details:     z.record(z.unknown()).optional(),
})
export type AuditEntry = z.infer<typeof AuditEntrySchema>
