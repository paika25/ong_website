import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  // Utiliser le JWT de l'admin — la RLS back_office autorise SELECT ALL sur les tables concernées
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await supabase
    .from('ongs')
    .select('id, name, status, email, updated_at, created_at, account_id')
    .order('updated_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return (data ?? []).map((row: any) => ({
    id:          row.id,
    ongName:     row.name,
    submittedAt: row.updated_at,
    status:      row.status,
    agentEmail:  row.email,
    agentId:     row.account_id,
  }))
})
