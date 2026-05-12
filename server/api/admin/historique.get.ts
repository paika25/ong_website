import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query  = getQuery(event)
  const cursor = query.cursor as string | undefined
  const filter = query.action as string | undefined   // filtrer par type d'action
  const ongId  = query.ong_id as string | undefined   // filtrer par ONG
  const limit  = 30
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey, {
    auth:   { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  let q = supabase
    .from('audit_trail')
    .select(`
      id,
      entity_type,
      entity_id,
      action,
      performed_by,
      ong_id,
      details_json,
      created_at,
      ongs ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(limit + 1)

  if (cursor)  q = q.lt('created_at', cursor)
  if (filter)  q = q.eq('action', filter)
  if (ongId)   q = q.eq('ong_id', ongId)

  const { data, error } = await q
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const rows    = data ?? []
  const hasMore = rows.length > limit
  const items   = hasMore ? rows.slice(0, limit) : rows

  return {
    data:   items,
    cursor: hasMore ? items[items.length - 1]?.created_at ?? null : null,
  }
})
