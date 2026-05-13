/**
 * Machine d'états du statut ONG.
 * SEUL endroit où un statut ONG peut changer.
 *
 * Chaque transition définit :
 *   - les états source autorisés
 *   - l'état cible
 *   - l'événement métier associé
 *   - l'entrée audit_trail
 *   - l'email à envoyer (optionnel)
 *   - si un commentaire est obligatoire
 */

import { createClient } from '@supabase/supabase-js'
import { insertAuditEntry } from './audit.service'
import { sendTransactionalEmail } from './email.service'
import type { EmailTemplate } from './email.service'

// ── Types ─────────────────────────────────────────────────────────────────────

export type OngStatus =
  | 'pending'
  | 'submitted'
  | 'under_review'
  | 'complement_required'
  | 'verified'
  | 'active'
  | 'rejected'
  | 'inactive'
  | 'suspended'

export type StatusAction =
  | 'submit'        // agent soumet son dossier
  | 'start_review'  // back-office prend en charge
  | 'validate'      // back-office valide → verified
  | 'reject'        // back-office rejette
  | 'request_complement' // back-office demande des pièces
  | 'resubmit'      // agent soumet à nouveau après complément
  | 'suspend'       // back-office suspend le badge
  | 'reactivate'    // back-office réactive le badge
  | 'deactivate'    // back-office désactive définitivement

interface Transition {
  from:            OngStatus[]
  to:              OngStatus
  auditAction:     string
  emailTemplate?:  EmailTemplate
  requiresComment: boolean
}

// ── Machine d'états ───────────────────────────────────────────────────────────

const TRANSITIONS: Record<StatusAction, Transition> = {
  submit: {
    from:            ['pending', 'complement_required'],
    to:              'submitted',
    auditAction:     'DOSSIER_SUBMITTED',
    requiresComment: false,
  },
  start_review: {
    from:            ['pending', 'submitted'],
    to:              'under_review',
    auditAction:     'REVIEW_STARTED',
    requiresComment: false,
  },
  validate: {
    from:            ['pending', 'submitted', 'under_review', 'complement_required'],
    to:              'verified',
    auditAction:     'BACKOFFICE_VALIDATED',
    emailTemplate:   'certification_granted',
    requiresComment: false,
  },
  reject: {
    from:            ['pending', 'submitted', 'under_review', 'complement_required'],
    to:              'rejected',
    auditAction:     'BACKOFFICE_REJECTED',
    emailTemplate:   'certification_rejected',
    requiresComment: true,
  },
  request_complement: {
    from:            ['pending', 'submitted', 'under_review'],
    to:              'complement_required',
    auditAction:     'COMPLEMENT_REQUESTED',
    emailTemplate:   'document_complement_required',
    requiresComment: true,
  },
  resubmit: {
    from:            ['complement_required'],
    to:              'submitted',
    auditAction:     'DOSSIER_RESUBMITTED',
    requiresComment: false,
  },
  suspend: {
    from:            ['verified', 'active'],
    to:              'suspended',          // état distinct — badge retiré post-certification
    auditAction:     'BADGE_SUSPENDED',
    emailTemplate:   'badge_suspended',
    requiresComment: true,
  },
  reactivate: {
    from:            ['suspended'],        // ne peut réactiver que depuis suspended
    to:              'verified',
    auditAction:     'BADGE_REACTIVATED',
    emailTemplate:   'badge_reactivated',
    requiresComment: false,
  },
  deactivate: {
    from:            ['verified', 'active', 'submitted', 'under_review'],
    to:              'inactive',
    auditAction:     'DOSSIER_DEACTIVATED',
    requiresComment: true,
  },
}

// ── Résultat ──────────────────────────────────────────────────────────────────

export interface TransitionResult {
  success:   boolean
  newStatus: OngStatus
  error?:    string
}

// ── Fonction principale ───────────────────────────────────────────────────────

export async function applyStatusTransition(
  ongId:      string,
  action:     StatusAction,
  token:      string,       // JWT de l'opérateur (RLS via token)
  operatorId: string,
  options?:   { comment?: string; message?: string }
): Promise<TransitionResult> {
  const config = useRuntimeConfig()

  // Client avec JWT de l'opérateur pour que la RLS s'applique
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey, {
    auth:   { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const transition = TRANSITIONS[action]
  if (!transition) {
    return { success: false, newStatus: 'pending', error: `Action inconnue : ${action}` }
  }

  // 1. Lire le statut actuel
  const { data: ong, error: fetchErr } = await supabase
    .from('ongs')
    .select('id, status, email, name')
    .eq('id', ongId)
    .maybeSingle()

  if (fetchErr || !ong) {
    return { success: false, newStatus: 'pending', error: 'ONG introuvable' }
  }

  // 2. Vérifier que la transition est autorisée depuis le statut actuel
  if (!transition.from.includes(ong.status as OngStatus)) {
    return {
      success:   false,
      newStatus: ong.status as OngStatus,
      error:     `Transition interdite : ${ong.status} → ${transition.to} (action: ${action})`,
    }
  }

  // 3. Vérifier que le commentaire est fourni si requis
  const comment = options?.comment ?? options?.message ?? ''
  if (transition.requiresComment && !comment.trim()) {
    return { success: false, newStatus: ong.status as OngStatus, error: 'Commentaire obligatoire pour cette action' }
  }

  // 4. Appliquer le changement de statut
  // .select() permet de détecter les 0 lignes modifiées (RLS silencieux ou ONG inexistante)
  const { data: updated, error: updateErr } = await supabase
    .from('ongs')
    .update({ status: transition.to, updated_at: new Date().toISOString() })
    .eq('id', ongId)
    .select('id')

  if (updateErr) {
    return { success: false, newStatus: ong.status as OngStatus, error: updateErr.message }
  }

  if (!updated || updated.length === 0) {
    return {
      success:   false,
      newStatus: ong.status as OngStatus,
      error:     `Mise à jour bloquée (RLS ou ONG introuvable). Vérifiez les policies Supabase sur la table ongs.`,
    }
  }

  // 5. Audit trail — attendu, erreur propagée dans les logs mais ne bloque pas la réponse
  try {
    await insertAuditEntry({
      entityType:    'ong',
      entityId:      ongId,
      action:        transition.auditAction,
      operatorId,
      operatorToken: token,
      metadata:      { comment, previousStatus: ong.status, newStatus: transition.to },
    })
  } catch (auditErr: any) {
    console.error(`[ong-status] audit trail failed for action ${action} on ong ${ongId}:`, auditErr.message)
  }

  // 6. Email transactionnel (fire & forget — stub pour l'instant)
  if (transition.emailTemplate && ong.email) {
    sendTransactionalEmail(transition.emailTemplate, ong.email, {
      ongId,
      ongName: ong.name,
      comment,
      newStatus: transition.to,
    }).catch((emailErr: any) => {
      console.error(`[ong-status] email failed for action ${action}:`, emailErr.message)
    })
  }

  return { success: true, newStatus: transition.to }
}

// ── Export des transitions (pour affichage UI) ────────────────────────────────

export function getAllowedActions(currentStatus: OngStatus): StatusAction[] {
  return (Object.keys(TRANSITIONS) as StatusAction[]).filter(
    action => TRANSITIONS[action].from.includes(currentStatus)
  )
}
