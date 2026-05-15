import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const BodySchema = z.object({
  content: z.string().min(1).max(2000),
})

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  if (!ongId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const raw = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Contenu invalide' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Utilisateur introuvable' })

  const { data, error } = await supabase
    .from('dossier_messages')
    .insert({
      ong_id: ongId,
      sender_id: user.id,
      sender_role: 'back_office',
      content: parsed.data.content,
    })
    .select('id, sender_id, sender_role, content, read_at, created_at')
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
