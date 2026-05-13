import { createClient } from '@supabase/supabase-js'

export interface AuditEntry {
  entityType:  string
  entityId:    string
  action:      string
  operatorId?: string
  ongId?:      string
  metadata?:   Record<string, unknown>
  /** JWT opérateur — utilisé comme fallback quand service_role key est absent */
  operatorToken?: string
}

export async function insertAuditEntry(entry: AuditEntry): Promise<void> {
  const config = useRuntimeConfig()

  const serviceRoleKey = config.supabaseServiceRoleKey as string
  const anonKey        = config.public.supabaseKey as string
  const supabaseUrl    = config.public.supabaseUrl as string

  let supabaseKey: string
  let extraHeaders: Record<string, string> = {}

  if (serviceRoleKey) {
    // Préférence : service role bypass tout RLS
    supabaseKey = serviceRoleKey
  } else if (entry.operatorToken) {
    // Fallback : JWT opérateur + policy at_backoffice_insert
    supabaseKey = anonKey
    extraHeaders = { Authorization: `Bearer ${entry.operatorToken}` }
  } else {
    console.warn('[audit.service] impossible d\'insérer : ni service_role ni token opérateur fourni')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: extraHeaders },
  })

  const { error } = await supabase.from('audit_trail').insert({
    entity_type:  entry.entityType,
    entity_id:    entry.entityId,
    action:       entry.action,
    performed_by: entry.operatorId ?? null,
    ong_id:       entry.ongId ?? (entry.entityType === 'ong' ? entry.entityId : null),
    details_json: entry.metadata ?? null,
    pre_merkle:   true,
  })

  if (error) console.error('[audit.service] insertAuditEntry:', error.message)
}
