import { ServiceError } from '../utils/errors'

// Templates email transactionnels prévus (Brevo SDK — implémentation Story 3.3+)
export type EmailTemplate =
  | 'certification_granted'
  | 'certification_rejected'
  | 'document_complement_required'
  | 'badge_suspended'
  | 'badge_reactivated'
  | 'subscription_expiry_reminder'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'signup_confirmation'
  | 'password_reset'

// Stub — implémentation complète en Story 3.3 (Brevo SDK côté Nitro uniquement — clé API jamais exposée client)
export async function sendTransactionalEmail(
  _template: EmailTemplate,
  _to: string,
  _data: Record<string, unknown>
): Promise<void> {
  throw new ServiceError('NOT_IMPLEMENTED', 'email.sendTransactionalEmail not yet implemented')
}
