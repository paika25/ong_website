import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!ongId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await supabase
    .from('dossier_messages')
    .select('id, sender_id, sender_role, content, read_at, created_at')
    .eq('ong_id', ongId)
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
