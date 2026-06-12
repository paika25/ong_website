import { createClient } from '@supabase/supabase-js'

function parseJwt(token: string): Record<string, any> | null {
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) } catch { return null }
}

export default defineEventHandler(async (event) => {
  const partnerId = getRouterParam(event, 'id')
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!partnerId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const payload = parseJwt(token)
  if (!payload?.sub) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const role = payload.app_metadata?.role ?? payload.role
  const isBackOffice = role === 'back_office' || role === 'admin'

  if (payload.sub !== partnerId && !isBackOffice) {
    throw createError({ statusCode: 403, statusMessage: 'Accès non autorisé' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await supabase
    .from('partner_admin_messages')
    .select('id, sender_id, sender_role, content, read_at, created_at')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
