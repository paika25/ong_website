import { z } from 'zod'
import { createCheckoutSession } from '~/server/services/stripe.service'

const BodySchema = z.object({
  ongId: z.string().uuid(),
  ongName: z.string().min(1).max(200),
  amountEuros: z.number().positive().min(1).max(10000),
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Données invalides : ' + parsed.error.errors[0]?.message })
  }
  const body = parsed.data

  const config = useRuntimeConfig()
  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_STRIPE_SECRET_KEY non configurée' })
  }

  const idempotencyKey = crypto.randomUUID()
  const appUrl = (config.public.appUrl as string) || 'http://localhost:3000'
  const amountCents = Math.round(body.amountEuros * 100)

  try {
    const { url } = await createCheckoutSession({
      ongId: body.ongId,
      ongName: body.ongName,
      amountCents,
      successUrl: `${appUrl}/ongs/${body.ongId}?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/ongs/${body.ongId}?donation=cancelled`,
      idempotencyKey,
    })
    return { url }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 502, statusMessage: `Stripe: ${msg}` })
  }
})
