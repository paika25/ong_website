import { z } from 'zod'

// Aligne avec financial_transactions.status (migration 01)
export const TransactionStatusSchema = z.enum([
  'pending', 'processing', 'completed', 'failed', 'timeout', 'cancelled',
])
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>

// Aligne avec financial_transactions.transaction_type (migration 01)
export const TransactionTypeSchema = z.enum(['subscription', 'donation'])
export type TransactionType = z.infer<typeof TransactionTypeSchema>

export const PaymentPayloadSchema = z.object({
  ongId:                   z.string().uuid(),
  vanillaPayTransactionId: z.string().min(1),
  idempotencyKey:          z.string().min(1),
  amount:                  z.number().int().positive(), // Ariary — jamais float
  transactionType:         TransactionTypeSchema,
  metadata:                z.record(z.unknown()).optional(),
})
export type PaymentPayload = z.infer<typeof PaymentPayloadSchema>

export const PaymentResultSchema = z.object({
  transactionId:  z.string().uuid(),
  status:         TransactionStatusSchema,
  idempotencyKey: z.string(),
})
export type PaymentResult = z.infer<typeof PaymentResultSchema>

// Webhook Vanilla Pay entrant — structure minimale validée à l'entrée
export const VanillaPayWebhookSchema = z.object({
  event:     z.string(),
  data:      z.record(z.unknown()),
  timestamp: z.string().optional(),
})
export type VanillaPayWebhook = z.infer<typeof VanillaPayWebhookSchema>
