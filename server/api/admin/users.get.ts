import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const query = getQuery(event)
  const search = (query.search as string | undefined)?.trim() ?? ''
  const type   = query.type as string | undefined

  let q = supabase
    .from('accounts')
    .select('id, email, account_type, first_name, last_name, company_name, verified, created_at')
    .order('created_at', { ascending: false })

  if (type === 'user_agent' || type === 'user_partner') {
    q = q.eq('account_type', type)
  }

  if (search) {
    q = q.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,company_name.ilike.%${search}%`)
  }

  const { data, error } = await q.limit(200)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return (data ?? []).map((row: any) => ({
    id:          row.id,
    email:       row.email,
    accountType: row.account_type,
    firstName:   row.first_name,
    lastName:    row.last_name,
    companyName: row.company_name,
    verified:    row.verified ?? false,
    createdAt:   row.created_at,
  }))
})
