import { createClient } from '@supabase/supabase-js'
import { constructWebhookEvent } from '~/server/services/stripe.service'

export default defineEventHandler(async (event) => {
  const sig = getRequestHeader(event, 'stripe-signature')
  if (!sig) throw createError({ statusCode: 400, statusMessage: 'Header Stripe-Signature manquant' })

  const rawBody = await readRawBody(event)
  if (!rawBody) throw createError({ statusCode: 400, statusMessage: 'Corps de requête vide' })

  const config = useRuntimeConfig()

  let stripeEvent
  try {
    stripeEvent = constructWebhookEvent(rawBody, sig, config.stripeWebhookSecret as string)
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: `Signature Stripe invalide: ${err.message}` })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session        = stripeEvent.data.object as any
    const ongId: string | undefined          = session.metadata?.ong_id
    const idempotencyKey: string | undefined = session.metadata?.idempotency_key
    const donorId: string | null             = session.metadata?.donor_id ?? null
    const amountCents: number                = session.amount_total
    const paymentIntentId: string            = session.payment_intent

    if (!ongId || !idempotencyKey || !amountCents || !paymentIntentId) {
      return { received: true }
    }

    const supabase = createClient(
      config.public.supabaseUrl as string,
      config.supabaseServiceRoleKey as string,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: existing } = await supabase
      .from('financial_transactions')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle()

    if (!existing) {
      const COMMISSION_RATE = 0.05
      const commissionCents = Math.round(amountCents * COMMISSION_RATE)
      const netAmountCents  = amountCents - commissionCents

      const { error } = await supabase.from('financial_transactions').insert({
        ong_id:                   ongId,
        stripe_payment_intent_id: paymentIntentId,
        idempotency_key:          idempotencyKey,
        amount:                   amountCents,
        currency:                 'eur',
        status:                   'completed',
        transaction_type:         'donation',
        provider:                 'stripe',
        donor_id:                 donorId,
        donor_email:              session.customer_details?.email ?? null,
        commission_rate:          COMMISSION_RATE,
        commission_cents:         commissionCents,
        net_amount_cents:         netAmountCents,
        metadata: {
          stripe_session_id: session.id,
          customer_name:     session.customer_details?.name ?? null,
        },
      })

      if (error) {
        console.error('[stripe webhook] insert error:', error.message)
        throw createError({ statusCode: 500, statusMessage: 'Erreur base de données' })
      }
    }
  }

  return { received: true }
})
