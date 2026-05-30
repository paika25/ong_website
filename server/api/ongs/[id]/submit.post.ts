import { applyStatusTransition } from '../../../services/ong-status.service'
import { createAdminReadClient } from '../../../utils/admin-supabase'
import { createClient } from '@supabase/supabase-js'

const REQUIRED_DOC_KEYS = ['statuts', 'recepisse', 'rapport_financier']

export default defineEventHandler(async (event) => {
  const ongId  = getRouterParam(event, 'id')
  const userId = event.context.userId
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!ongId || !userId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  // Vérifier que l'ONG appartient bien à cet agent (ownership check)
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth:   { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: ong } = await supabase.from('ongs').select('account_id').eq('id', ongId).maybeSingle()
  if (!ong) throw createError({ statusCode: 404, statusMessage: 'ONG introuvable' })
  if (ong.account_id !== userId) throw createError({ statusCode: 403, statusMessage: 'Accès non autorisé' })

  // Vérifier la présence des documents obligatoires (côté serveur)
  const adminDb = createAdminReadClient(config, token)
  const { data: docs } = await adminDb
    .from('ong_documents')
    .select('doc_key')
    .eq('ong_id', ongId)

  const uploadedKeys = (docs ?? []).map((d: { doc_key: string }) => d.doc_key)
  const missing = REQUIRED_DOC_KEYS.filter(key => !uploadedKeys.includes(key))
  if (missing.length > 0) {
    throw createError({
      statusCode: 422,
      statusMessage: `Documents obligatoires manquants : ${missing.join(', ')}`,
    })
  }

  const result = await applyStatusTransition(ongId, 'submit', token, userId)
  if (!result.success) throw createError({ statusCode: 422, statusMessage: result.error })

  return { success: true, status: result.newStatus }
})
