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

  // Documents — URL signées 1h (nécessite service role pour Storage, sinon liste vide)
  let documents: any[] = []
  if (config.supabaseServiceRoleKey) {
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const admin = createAdmin(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    const { data: files } = await admin.storage.from('ong-documents').list(`${ongId}/`, { limit: 50 })
    documents = await Promise.all(
      (files ?? []).map(async (f: any) => {
        const { data: signed } = await admin.storage.from('ong-documents').createSignedUrl(`${ongId}/${f.name}`, 3600)
        return { name: f.name, url: signed?.signedUrl ?? null }
      })
    )
  }

  return { ong, documents }
})
