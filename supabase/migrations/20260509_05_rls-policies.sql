-- =============================================================================
-- Migration 05 : Row Level Security — toutes les nouvelles tables
-- Helper get_user_role() : lit d'abord le JWT custom claim (Story 1.4),
-- avec fallback sur la table accounts (brownfield actuel).
-- =============================================================================

-- ── Helper rôle utilisateur ───────────────────────────────────────────────────
-- Priorité : JWT app_metadata.role (custom claim Story 1.4) > accounts.account_type.
-- SECURITY DEFINER + STABLE : exécuté une fois par requête, en contexte sécurisé.

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'role',
    (SELECT account_type FROM accounts WHERE id = auth.uid())
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── financial_transactions ────────────────────────────────────────────────────
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- L'agent voit uniquement les transactions de son ONG
CREATE POLICY "ft_agent_select_own" ON financial_transactions
  FOR SELECT
  USING (ong_id IN (
    SELECT id FROM ongs WHERE account_id = auth.uid()
  ));

-- L'agent peut insérer pour son ONG (via server/api — jamais direct client)
CREATE POLICY "ft_agent_insert_own" ON financial_transactions
  FOR INSERT
  WITH CHECK (ong_id IN (
    SELECT id FROM ongs WHERE account_id = auth.uid()
  ));

-- Le back-office voit tout en lecture
CREATE POLICY "ft_backoffice_select_all" ON financial_transactions
  FOR SELECT
  USING (get_user_role() = 'back_office');

-- Le service_role contourne tout RLS (pour les API Nitro server-side)
CREATE POLICY "ft_service_role_all" ON financial_transactions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── algorithm_versions ────────────────────────────────────────────────────────
ALTER TABLE algorithm_versions ENABLE ROW LEVEL SECURITY;

-- Les critères du Score sont publics — tout le monde lit la version active
CREATE POLICY "av_public_read_active" ON algorithm_versions
  FOR SELECT
  USING (status = 'active');

-- Le back-office gère toutes les versions
CREATE POLICY "av_backoffice_all" ON algorithm_versions
  FOR ALL
  USING (get_user_role() = 'back_office')
  WITH CHECK (get_user_role() = 'back_office');

-- Service role pour les migrations/seeds
CREATE POLICY "av_service_role_all" ON algorithm_versions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── score_history ─────────────────────────────────────────────────────────────
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

-- Les scores sont publics (FR23 : user_partner et visiteurs peuvent consulter)
CREATE POLICY "sh_public_read_all" ON score_history
  FOR SELECT
  USING (true);

-- Seul le service_role peut insérer (score.service.ts côté Nitro)
CREATE POLICY "sh_service_role_insert" ON score_history
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── score_disputes ────────────────────────────────────────────────────────────
ALTER TABLE score_disputes ENABLE ROW LEVEL SECURITY;

-- L'agent gère ses propres disputes
CREATE POLICY "sd_agent_own" ON score_disputes
  FOR ALL
  USING (ong_id IN (
    SELECT id FROM ongs WHERE account_id = auth.uid()
  ))
  WITH CHECK (ong_id IN (
    SELECT id FROM ongs WHERE account_id = auth.uid()
  ));

-- Le back-office voit et résout toutes les disputes
CREATE POLICY "sd_backoffice_all" ON score_disputes
  FOR ALL
  USING (get_user_role() = 'back_office')
  WITH CHECK (get_user_role() = 'back_office');

-- ── audit_trail ───────────────────────────────────────────────────────────────
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Seul le back-office consulte l'historique des actions (traçabilité interne)
CREATE POLICY "at_backoffice_select" ON audit_trail
  FOR SELECT
  USING (get_user_role() = 'back_office');

-- Seul le service_role insère (audit.service.ts côté Nitro)
CREATE POLICY "at_service_role_insert" ON audit_trail
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── ops_alerts ────────────────────────────────────────────────────────────────
ALTER TABLE ops_alerts ENABLE ROW LEVEL SECURITY;

-- Le back-office consulte et résout les alertes
CREATE POLICY "oa_backoffice_all" ON ops_alerts
  FOR ALL
  USING (get_user_role() = 'back_office')
  WITH CHECK (get_user_role() = 'back_office');

-- Le service_role insère les alertes (zombie-recovery, webhook failures)
CREATE POLICY "oa_service_role_insert" ON ops_alerts
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Note : ong_current_scores est une MATERIALIZED VIEW.
-- Les vues matérialisées n'ont pas de RLS native dans PostgreSQL.
-- L'accès est contrôlé par les permissions de table (GRANT).
-- Accès en lecture publique via GRANT SELECT :
GRANT SELECT ON ong_current_scores TO anon, authenticated;
