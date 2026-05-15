import { createClient } from '@supabase/supabase-js'

export interface AuditEntry {
  entityType:  string
  entityId:    string
  action:      string
  operatorId?: string
  ongId?:      string
  metadata?:   Record<string, unknown>
  /** JWT de l'opérateur — nécessaire pour que Supabase authentifie l'appel RPC */
  operatorToken: string
}

/**
 * Insère une entrée dans audit_trail via la fonction RPC `insert_audit_entry`
 * (SECURITY DEFINER — bypass RLS, pas besoin de service_role key).
 *
 * Lance une erreur si l'insertion échoue, afin que l'appelant puisse la traiter.
 */
export async function insertAuditEntry(entry: AuditEntry): Promise<void> {
  const config      = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const anonKey     = config.public.supabaseAnonKey as string

  const supabase = createClient(supabaseUrl, anonKey, {
    auth:   { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${entry.operatorToken}` } },
  })

  const ongId = entry.ongId ?? (entry.entityType === 'ong' ? entry.entityId : null)

  const { error } = await supabase.rpc('insert_audit_entry', {
    p_entity_type:  entry.entityType,
    p_entity_id:    entry.entityId,
    p_action:       entry.action,
    p_performed_by: entry.operatorId ?? null,
    p_ong_id:       ongId ?? null,
    p_details_json: entry.metadata ?? null,
  })

  if (error) {
    throw new Error(`[audit.service] insert_audit_entry failed: ${error.message}`)
  }
}
