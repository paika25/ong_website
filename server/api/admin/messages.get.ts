import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await supabase
    .from('ong_partner_messages')
    .select(`
      id, ong_id, partner_id, sender_role, content, read_at, created_at,
      ongs(id, name),
      accounts!ong_partner_messages_partner_id_fkey(id, first_name, last_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
