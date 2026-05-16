import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const BodySchema = z.object({
  identite:  z.boolean(),
  mission:   z.boolean(),
  documents: z.boolean(),
  projets:   z.boolean(),
  contacts:  z.boolean(),
})

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  if (!ongId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const raw    = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Données invalides' })

  const config = useRuntimeConfig()
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { error } = await supabase
    .from('ongs')
    .update({ section_visibility: parsed.data, updated_at: new Date().toISOString() })
    .eq('id', ongId)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { updated: true }
})
