-- =============================================================================
-- Migration 17 : Fonction SECURITY DEFINER pour insérer dans audit_trail
--
-- PROBLÈME : INSERT sur audit_trail bloqué pour les JWT non-service_role.
-- La policy "at_service_role_insert" (migration 05) n'autorise que service_role.
-- Sans NUXT_SUPABASE_SERVICE_ROLE_KEY configurée, les agents ET le back-office
-- ne peuvent pas écrire dans audit_trail, donc l'historique reste vide.
--
-- SOLUTION : fonction SECURITY DEFINER exécutée en tant que postgres (owner),
-- qui bypasse RLS tout en restant appelable par tout utilisateur authentifié.
-- Cela évite d'exposer la service_role key dans l'environnement.
-- =============================================================================

CREATE OR REPLACE FUNCTION insert_audit_entry(
  p_entity_type   TEXT,
  p_entity_id     UUID,
  p_action        TEXT,
  p_performed_by  UUID    DEFAULT NULL,
  p_ong_id        UUID    DEFAULT NULL,
  p_details_json  JSONB   DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_trail (
    entity_type,
    entity_id,
    action,
    performed_by,
    ong_id,
    details_json,
    pre_merkle
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_action,
    p_performed_by,
    p_ong_id,
    p_details_json,
    true
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Tout utilisateur authentifié (agent, back_office, admin) peut appeler cette fonction.
-- La logique métier qui décide QUAND appeler reste côté serveur Nitro.
GRANT EXECUTE ON FUNCTION insert_audit_entry TO authenticated;
