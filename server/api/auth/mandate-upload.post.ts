import { readMultipartFormData } from 'h3'
import { createAdminWriteClient } from '~/server/utils/admin-supabase'

const BUCKET       = 'ong-documents'
const MAX_SIZE     = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_MIME = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png']

export default defineEventHandler(async (event) => {
  const config   = useRuntimeConfig()
  const formData = await readMultipartFormData(event)

  const userIdPart = formData?.find(p => p.name === 'userId')
  const filePart   = formData?.find(p => p.name === 'file')

  if (!userIdPart?.data || !filePart?.data) {
    throw createError({ statusCode: 400, statusMessage: 'userId et file requis' })
  }

  const userId   = userIdPart.data.toString().trim()
  const fileName = filePart.filename ?? 'mandat.pdf'
  const mimeType = filePart.type ?? 'application/octet-stream'

  if (!userId.match(/^[0-9a-f-]{36}$/i)) {
    throw createError({ statusCode: 400, statusMessage: 'userId invalide' })
  }

  if (filePart.data.length > MAX_SIZE) {
    throw createError({ statusCode: 413, statusMessage: 'Fichier trop volumineux (max 5 Mo)' })
  }

  if (!ALLOWED_MIME.includes(mimeType)) {
    throw createError({ statusCode: 415, statusMessage: 'Type de fichier non accepté' })
  }

  const supabase  = createAdminWriteClient(config)
  const safeName  = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath  = `mandates/${userId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, filePart.data, { contentType: mimeType, upsert: true })

  if (uploadError) {
    throw createError({ statusCode: 500, statusMessage: uploadError.message })
  }

  await supabase
    .from('accounts')
    .update({ mandate_doc_path: filePath, updated_at: new Date().toISOString() })
    .eq('id', userId)

  return { success: true }
})
