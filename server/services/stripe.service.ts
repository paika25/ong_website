import Stripe from 'stripe'

function getStripe(): Stripe {
  const config = useRuntimeConfig()
  if (!config.stripeSecretKey) throw new Error('NUXT_STRIPE_SECRET_KEY non configurée')
  return new Stripe(config.stripeSecretKey as string)
}

export async function createCheckoutSession(params: {
  ongId: string
  ongName: string
  amountCents: number
  successUrl: string
  cancelUrl: string
  idempotencyKey: string
}): Promise<{ url: string }> {
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: params.amountCents,
            product_data: {
              name: `Don à ${params.ongName}`,
              description: 'Don unique via Paika Platform',
            },
          },
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        ong_id: params.ongId,
        idempotency_key: params.idempotencyKey,
      },
    },
    { idempotencyKey: params.idempotencyKey }
  )

  return { url: session.url! }
}

export function constructWebhookEvent(
  rawBody: string,
  signature: string,
  secret: string
): Stripe.Event {
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(rawBody, signature, secret)
}
