import { ServiceError } from '../utils/errors'
import type { PaymentPayload, PaymentResult } from '~/types/schemas/payment.schema'

// Stub — implémentation complète en Story 5.1 (séquence canonique : Zod → idempotence → BEGIN → INSERT → audit → COMMIT → score async)
export async function processPayment(_payload: PaymentPayload): Promise<PaymentResult> {
  throw new ServiceError('NOT_IMPLEMENTED', 'payment.processPayment not yet implemented')
}
