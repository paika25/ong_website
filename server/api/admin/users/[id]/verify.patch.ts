import { z } from 'zod'
import { createAdminWriteClient } from '~/server/utils/admin-supabase'
import { sendTransactionalEmail } from '~/server/services/email.service'

const BodySchema = z.object({
  verified: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const raw = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Données invalides' })

  const config  = useRuntimeConfig()
  const supabase = createAdminWriteClient(config)

  // Lire l'email avant la mise à jour pour pouvoir envoyer la notification
  const { data: account } = await supabase
    .from('accounts')
    .select('email, first_name, organization_name')
    .eq('id', userId)
    .maybeSingle()

  const { error } = await supabase
    .from('accounts')
    .update({ verified: parsed.data.verified, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  // Email d'activation (fire & forget)
  if (parsed.data.verified && account?.email) {
    sendTransactionalEmail('signup_confirmation', account.email, {
      firstName:        account.first_name,
      organizationName: account.organization_name,
    }).catch((e: any) => console.error('[verify] email failed:', e.message))
  }

  return { updated: true, verified: parsed.data.verified }
})
