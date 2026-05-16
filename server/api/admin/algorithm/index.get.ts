import { createAdminReadClient } from '~/server/utils/admin-supabase'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createAdminReadClient(config, token)

  const { data, error } = await supabase
    .from('algorithm_versions')
    .select('id, version, params_json, status, approved_by, approved_at, created_by, created_at')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data ?? []
})
