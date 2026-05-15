import { VanillaPayWebhookSchema } from '~/types/schemas/payment.schema'
import { ServiceError, codeToStatus } from '~/server/utils/errors'

// Handlers stubs — implémentés en Story 5.1 et 7.1
async function handleSubscriptionPayment(_data: Record<string, unknown>) {
  return { received: true }
}

async function handleDonationPayment(_data: Record<string, unknown>) {
  return { received: true }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const parsed = VanillaPayWebhookSchema.safeParse(body)
    if (!parsed.success) {
      throw new ServiceError('VALIDATION', 'Invalid webhook payload', {
        issues: parsed.error.issues,
      })
    }

    const { event: webhookEvent, data } = parsed.data

    switch (webhookEvent) {
      case 'subscription.payment':
        return await handleSubscriptionPayment(data)
      case 'donation.payment':
        return await handleDonationPayment(data)
      default:
        // Événements inconnus : accuser réception sans erreur (forward-compat)
        return { received: true, event: webhookEvent, status: 'unhandled' }
    }
  } catch (err) {
    if (err instanceof ServiceError) {
      throw createError({ statusCode: codeToStatus[err.code], message: err.message })
    }
    console.error('[webhook:vanilla-pay]', err)
    throw createError({ statusCode: 500, message: 'INTERNAL_ERROR' })
  }
})
