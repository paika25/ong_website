import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const BodySchema = z.object({
  content: z.string().min(1).max(2000),
})

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!ongId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const raw = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Contenu invalide' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  // Vérifier que l'ONG appartient bien à cet utilisateur (double contrôle avant RLS)
  const { data: ong } = await supabase
    .from('ongs')
    .select('id')
    .eq('id', ongId)
    .eq('account_id', user.id)
    .maybeSingle()

  if (!ong) throw createError({ statusCode: 403, statusMessage: 'Accès non autorisé' })

  const { data, error } = await supabase
    .from('dossier_messages')
    .insert({
      ong_id: ongId,
      sender_id: user.id,
      sender_role: 'agent',
      content: parsed.data.content,
    })
    .select('id, sender_id, sender_role, content, read_at, created_at')
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
