import { createClient } from '@supabase/supabase-js'

function parseJwt(token: string): Record<string, any> | null {
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) } catch { return null }
}

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!ongId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const payload = parseJwt(token)
  if (!payload?.sub) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const role = payload.app_metadata?.role ?? payload.role

  // Côté agent : doit fournir partnerId pour cibler une conversation
  // Côté partner : partnerId = auth.uid() automatiquement
  const query = getQuery(event)
  const partnerId = role === 'user_partner'
    ? payload.sub
    : (query.partnerId as string | undefined)

  if (!partnerId) throw createError({ statusCode: 400, statusMessage: 'partnerId requis pour un agent' })

  const { data, error } = await supabase
    .from('ong_partner_messages')
    .select('id, ong_id, partner_id, sender_id, sender_role, content, read_at, created_at')
    .eq('ong_id', ongId)
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
