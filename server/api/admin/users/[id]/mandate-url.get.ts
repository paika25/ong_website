import { createAdminWriteClient } from '~/server/utils/admin-supabase'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const config   = useRuntimeConfig()
  const supabase = createAdminWriteClient(config)

  const { data: account } = await supabase
    .from('accounts')
    .select('mandate_doc_path')
    .eq('id', userId)
    .maybeSingle()

  if (!account?.mandate_doc_path) {
    throw createError({ statusCode: 404, statusMessage: 'Aucun justificatif de mandat' })
  }

  const { data: signed, error } = await supabase.storage
    .from('ong-documents')
    .createSignedUrl(account.mandate_doc_path, 3600)

  if (error || !signed?.signedUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de générer l\'URL' })
  }

  return { url: signed.signedUrl }
})
