import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const sessionId: string | undefined = raw?.sessionId
  if (!sessionId) throw createError({ statusCode: 400, statusMessage: 'sessionId requis' })

  const config = useRuntimeConfig()
  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe non configuré' })
  }

  // Récupérer la session Stripe pour vérifier le paiement côté serveur
  let session: Stripe.Checkout.Session
  try {
    const stripe = new Stripe(config.stripeSecretKey as string)
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 502, statusMessage: `Stripe: ${msg}` })
  }

  // Paiement non complété — ne rien enregistrer
  if (session.payment_status !== 'paid') {
    return { recorded: false, paymentStatus: session.payment_status }
  }

  const ongId = session.metadata?.ong_id
  const idempotencyKey = session.metadata?.idempotency_key
  const paymentIntentId = session.payment_intent as string
  const amountCents = session.amount_total!

  if (!ongId || !idempotencyKey || !paymentIntentId) {
    console.error('[confirm-session] metadata manquante:', session.metadata)
    return { recorded: false, paymentStatus: 'metadata_missing' }
  }

  // Service role si disponible, sinon anon key (policy ft_stripe_server_insert le permet)
  const supabaseKey = (config.supabaseServiceRoleKey as string) || (config.public.supabaseKey as string)
  const supabase = createClient(
    config.public.supabaseUrl as string,
    supabaseKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Idempotence : si déjà enregistré, retourner succès silencieux
  const { data: existing } = await supabase
    .from('financial_transactions')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle()

  if (existing) return { recorded: true, alreadyExisted: true }

  const { error } = await supabase.from('financial_transactions').insert({
    ong_id: ongId,
    stripe_payment_intent_id: paymentIntentId,
    idempotency_key: idempotencyKey,
    amount: amountCents,
    currency: 'eur',
    status: 'completed',
    transaction_type: 'donation',
    provider: 'stripe',
    donor_email: session.customer_details?.email ?? null,
    metadata: {
      stripe_session_id: sessionId,
      customer_name: session.customer_details?.name ?? null,
    },
  })

  if (error) {
    console.error('[confirm-session] insert error:', error.message)
    throw createError({ statusCode: 500, statusMessage: `DB: ${error.message}` })
  }

  return { recorded: true }
})
