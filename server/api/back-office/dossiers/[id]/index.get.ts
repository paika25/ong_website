import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  if (!ongId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: ong, error } = await supabase
    .from('ongs')
    .select('*')
    .eq('id', ongId)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!ong)  throw createError({ statusCode: 404, statusMessage: 'ONG introuvable' })

  // Documents — URL signées 1h via storage_path stocké en base
  let documents: any[] = []
  if (config.supabaseServiceRoleKey) {
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const admin = createAdmin(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    const { data: rows } = await admin
      .from('ong_documents')
      .select('id, name, category, visibility, storage_path, file_url, file_size, mime_type, created_at')
      .eq('ong_id', ongId)
      .order('created_at', { ascending: false })

    documents = await Promise.all(
      (rows ?? []).map(async (row: any) => {
        const path: string | null = row.storage_path ?? extractPublicPath(row.file_url, ongId)
        let signedUrl: string | null = null
        if (path) {
          const { data: s } = await admin.storage.from('ong-documents').createSignedUrl(path, 3600)
          signedUrl = s?.signedUrl ?? null
        }
        return {
          id: row.id,
          name: row.name,
          category: row.category,
          visibility: row.visibility,
          fileSize: row.file_size,
          mimeType: row.mime_type,
          createdAt: row.created_at,
          url: signedUrl,
        }
      })
    )
  }

  function extractPublicPath(fileUrl: string | null, ongId: string): string | null {
    if (!fileUrl) return null
    const marker = '/storage/v1/object/public/ong-documents/'
    const idx = fileUrl.indexOf(marker)
    if (idx === -1) return null
    return decodeURIComponent(fileUrl.substring(idx + marker.length))
  }

  return { ong, documents }
})
