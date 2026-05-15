import { applyStatusTransition } from '../../../../services/ong-status.service'

export default defineEventHandler(async (event) => {
  const ongId  = getRouterParam(event, 'id')
  const userId = event.context.userId
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  const body   = await readBody(event)

  if (!ongId || !userId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const result = await applyStatusTransition(ongId, 'reject', token, userId, { comment: body?.comment })
  if (!result.success) throw createError({ statusCode: 422, statusMessage: result.error })

  return { success: true, status: result.newStatus }
})
