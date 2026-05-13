import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const ongId  = getRouterParam(event, 'id')
  const query  = getQuery(event)
  const cursor = query.cursor as string | undefined
  const limit  = 20

  if (!ongId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  let q = supabase
    .from('audit_trail')
    .select('id, action, performed_by, details_json, created_at')
    .eq('ong_id', ongId)
    .order('created_at', { ascending: false })
    .limit(limit + 1)

  if (cursor) q = q.lt('created_at', cursor)

  const { data, error } = await q
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const rows    = data ?? []
  const hasMore = rows.length > limit
  const items   = hasMore ? rows.slice(0, limit) : rows

  return {
    data:   items,
    cursor: hasMore ? items[items.length - 1]?.created_at ?? null : null,
    total:  items.length,
  }
})
