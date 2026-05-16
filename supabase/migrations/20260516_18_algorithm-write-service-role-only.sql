-- =============================================================================
-- Migration 18 : algorithm_versions — écriture réservée au service_role
--
-- AVANT : av_backoffice_all permettait aux back_office d'écrire directement
--         via JWT (contournement de l'API admin).
--
-- APRÈS : seul le service_role peut écrire (INSERT/UPDATE/DELETE).
--         Les back_office peuvent lire TOUTES les versions (pas seulement active).
--         La version active reste publique (lecture).
-- =============================================================================

-- Supprimer la policy qui autorisait les écritures directes par JWT back_office
DROP POLICY IF EXISTS "av_backoffice_all" ON algorithm_versions;

-- Back-office : lecture de toutes les versions (draft, approved, active, deprecated)
CREATE POLICY "av_backoffice_read_all" ON algorithm_versions
  FOR SELECT
  USING (get_user_role() IN ('back_office', 'admin'));

-- Écriture exclusivement via service_role (API Nitro admin, jamais client direct)
-- av_service_role_all est déjà présent (migration 05) — on le conserve tel quel.
