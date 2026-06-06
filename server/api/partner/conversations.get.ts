import { createClient } from '@supabase/supabase-js'

function parseJwt(token: string): Record<string, any> | null {
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) } catch { return null }
}

export default defineEventHandler(async (event) => {
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const payload = parseJwt(token)
  if (!payload?.sub) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  // RLS : opm_partner_select → partner_id = auth.uid()
  const { data, error } = await supabase
    .from('ong_partner_messages')
    .select('ong_id, sender_role, content, read_at, created_at, ongs(id, name, image)')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  // Grouper par ONG : dernier message + non-lus (messages envoyés par l'agent non encore lus)
  const map = new Map<string, {
    ongId: string
    ongName: string
    ongImage: string | null
    lastMessage: string
    lastMessageAt: string
    unreadCount: number
  }>()

  for (const row of data ?? []) {
    const ong = row.ongs as any
    const ongId = row.ong_id
    if (!map.has(ongId)) {
      map.set(ongId, {
        ongId,
        ongName:      ong?.name ?? ongId.slice(0, 8),
        ongImage:     ong?.image ?? null,
        lastMessage:  row.content,
        lastMessageAt: row.created_at,
        unreadCount:  0,
      })
    }
    if (row.sender_role === 'agent' && !row.read_at) {
      map.get(ongId)!.unreadCount++
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  )
})
