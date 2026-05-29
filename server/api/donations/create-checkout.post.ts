import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createCheckoutSession } from '~/server/services/stripe.service'

const DONATION_ALLOWED_STATUSES = ['verified', 'active']

const BodySchema = z.object({
  ongId:       z.string().uuid(),
  ongName:     z.string().min(1).max(200),
  amountEuros: z.number().positive().min(1).max(10000),
})

function parseJwtSub(token: string): string | null {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub ?? null
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const raw    = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Données invalides : ' + parsed.error.errors[0]?.message })
  }
  const body = parsed.data

  const config = useRuntimeConfig()
  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_STRIPE_SECRET_KEY non configurée' })
  }

  // Vérifier que l'ONG est validée avant de créer la session de paiement
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data: ong, error: ongError } = await supabase
    .from('ongs')
    .select('id, status')
    .eq('id', body.ongId)
    .single()

  if (ongError || !ong) {
    throw createError({ statusCode: 404, statusMessage: 'ONG introuvable' })
  }

  if (!DONATION_ALLOWED_STATUSES.includes(ong.status)) {
    throw createError({ statusCode: 403, statusMessage: 'Cette ONG n\'est pas habilitée à recevoir des dons' })
  }

  // Extraction optionnelle du donor_id depuis le JWT (null si invité non connecté)
  const authHeader = getRequestHeader(event, 'authorization')
  const token      = authHeader?.replace('Bearer ', '') ?? null
  const donorId    = token ? parseJwtSub(token) : null

  const idempotencyKey = crypto.randomUUID()

  const configuredUrl = config.public.appUrl as string
  const requestUrl    = getRequestURL(event)
  const appUrl        =
    configuredUrl && !configuredUrl.includes('localhost')
      ? configuredUrl
      : `${requestUrl.protocol}//${requestUrl.host}`

  const amountCents = Math.round(body.amountEuros * 100)

  try {
    const { url } = await createCheckoutSession({
      ongId:          body.ongId,
      ongName:        body.ongName,
      amountCents,
      successUrl:     `${appUrl}/ongs/${body.ongId}?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:      `${appUrl}/ongs/${body.ongId}?donation=cancelled`,
      idempotencyKey,
      donorId,
    })
    return { url }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 502, statusMessage: `Stripe: ${msg}` })
  }
})
