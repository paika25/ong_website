import { z } from 'zod'
import { createAdminWriteClient, parseJwtSub } from '~/server/utils/admin-supabase'

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft:    ['approved', 'deprecated'],
  approved: ['active', 'deprecated'],
  active:   ['deprecated'],
}

const BodySchema = z.object({
  status: z.enum(['approved', 'active', 'deprecated']),
})

export default defineEventHandler(async (event) => {
  const versionId = getRouterParam(event, 'id')
  if (!versionId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const raw    = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Statut invalide' })

  const targetStatus = parsed.data.status

  const config = useRuntimeConfig()
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  // Service role obligatoire — les transitions atomiques contournent la contrainte UNIQUE
  const supabase = createAdminWriteClient(config)

  const { data: current, error: readErr } = await supabase
    .from('algorithm_versions')
    .select('status, version')
    .eq('id', versionId)
    .single()

  if (readErr || !current) throw createError({ statusCode: 404, statusMessage: 'Version introuvable' })

  const allowed = VALID_TRANSITIONS[current.status] ?? []
  if (!allowed.includes(targetStatus)) {
    throw createError({
      statusCode: 409,
      statusMessage: `Transition invalide : ${current.status} → ${targetStatus}`,
    })
  }

  // Activation : déprécier l'active courante en premier (contrainte UNIQUE partielle)
  if (targetStatus === 'active') {
    const { error: deprecateErr } = await supabase
      .from('algorithm_versions')
      .update({ status: 'deprecated' })
      .eq('status', 'active')
      .neq('id', versionId)

    if (deprecateErr) {
      throw createError({ statusCode: 500, statusMessage: `Erreur dépréciation : ${deprecateErr.message}` })
    }
  }

  const updatePayload: Record<string, unknown> = { status: targetStatus }

  if (targetStatus === 'approved') {
    updatePayload.approved_by = parseJwtSub(token)
    updatePayload.approved_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('algorithm_versions')
    .update(updatePayload)
    .eq('id', versionId)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
