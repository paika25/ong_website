import { createClient } from '@supabase/supabase-js'

// Retourne la liste des partenaires ayant échangé avec cette ONG,
// avec le dernier message et le nombre de non-lus pour l'agent.
export default defineEventHandler(async (event) => {
  const ongId = getRouterParam(event, 'id')
  const token = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!ongId || !token) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  // Tous les messages de cette ONG — RLS filtre automatiquement
  const { data, error } = await supabase
    .from('ong_partner_messages')
    .select('id, partner_id, sender_role, content, read_at, created_at, accounts!ong_partner_messages_partner_id_fkey(first_name, last_name, email, avatar)')
    .eq('ong_id', ongId)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  // Grouper par partner_id : garder le dernier message + compter les non-lus
  const map = new Map<string, {
    partnerId: string
    partnerName: string
    partnerEmail: string
    partnerAvatar: string | null
    lastMessage: string
    lastMessageAt: string
    unreadCount: number
  }>()

  for (const row of data ?? []) {
    const pid = row.partner_id
    const acc = row.accounts as any
    if (!map.has(pid)) {
      map.set(pid, {
        partnerId:     pid,
        partnerName:   [acc?.first_name, acc?.last_name].filter(Boolean).join(' ') || acc?.email || pid.slice(0, 8),
        partnerEmail:  acc?.email ?? '',
        partnerAvatar: acc?.avatar ?? null,
        lastMessage:   row.content,
        lastMessageAt: row.created_at,
        unreadCount:   0,
      })
    }
    // Compter non-lus : messages envoyés par le partenaire et non lus par l'agent
    if (row.sender_role === 'partner' && !row.read_at) {
      map.get(pid)!.unreadCount++
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  )
})
