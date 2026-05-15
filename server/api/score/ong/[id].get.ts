import { createClient } from '@supabase/supabase-js'

// Route publique — ong_current_scores accessible à anon + authenticated (GRANT migration 03)
export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  if (!ongId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase
    .from('ong_current_scores')
    .select('score, version_id, trigger_event, created_at')
    .eq('ong_id', ongId)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { score: data?.score ?? 0, updatedAt: data?.created_at ?? null }
})
