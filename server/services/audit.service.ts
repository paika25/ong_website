import { createClient } from '@supabase/supabase-js'

export interface AuditEntry {
  entityType:  string
  entityId:    string
  action:      string
  operatorId?: string
  ongId?:      string
  metadata?:   Record<string, unknown>
}

export async function insertAuditEntry(entry: AuditEntry): Promise<void> {
  const config = useRuntimeConfig()
  if (!config.supabaseServiceRoleKey) return

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
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
