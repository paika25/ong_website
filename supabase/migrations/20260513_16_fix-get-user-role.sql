-- =============================================================================
-- Migration 16 : Correction de get_user_role()
--
-- PROBLÈME : migration 05 lisait auth.jwt() ->> 'role'
-- Cette clé vaut TOUJOURS 'authenticated' (rôle système Supabase).
-- Le rôle custom (back_office, admin, user_agent…) est dans app_metadata.role
-- via raw_app_meta_data (migration 07).
--
-- CORRECTION : lire auth.jwt() -> 'app_metadata' ->> 'role' en priorité.
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    -- 1. Custom claim JWT (app_metadata.role — positionné par trigger migration 07
    --    ou manuellement dans Supabase Dashboard pour les comptes admin)
    auth.jwt() -> 'app_metadata' ->> 'role',
    -- 2. Fallback : table accounts (brownfield — si app_metadata pas encore rempli)
    (SELECT account_type FROM accounts WHERE id = auth.uid())
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
