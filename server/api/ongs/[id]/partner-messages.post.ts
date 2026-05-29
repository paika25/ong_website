import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const BodySchema = z.object({
  content:   z.string().min(1).max(2000),
  partnerId: z.string().uuid().optional(),
})

function parseJwt(token: string): Record<string, any> | null {
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) } catch { return null }
}

export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!ongId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const payload = parseJwt(token)
  if (!payload?.sub) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const raw = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Contenu invalide' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const appRole = payload.app_metadata?.role ?? payload.role
  const isPartner = appRole === 'user_partner'

  const senderRole = isPartner ? 'partner' : 'agent'
  const partnerId  = isPartner ? payload.sub : parsed.data.partnerId

  if (!partnerId) throw createError({ statusCode: 400, statusMessage: 'partnerId requis pour un agent' })

  // Vérifier que l'ONG est accessible (RLS gère, mais double-check explicite)
  if (!isPartner) {
    const { data: ong } = await supabase
      .from('ongs')
      .select('id')
      .eq('id', ongId)
      .maybeSingle()
    if (!ong) throw createError({ statusCode: 403, statusMessage: 'ONG introuvable ou accès refusé' })
  }

  const { data, error } = await supabase
    .from('ong_partner_messages')
    .insert({
      ong_id:      ongId,
      partner_id:  partnerId,
      sender_id:   payload.sub,
      sender_role: senderRole,
      content:     parsed.data.content,
    })
    .select('id, ong_id, partner_id, sender_id, sender_role, content, read_at, created_at')
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
