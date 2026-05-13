-- =============================================================================
-- Migration 15 : RLS sur la table ongs
-- Sécurise les accès multi-rôles et permet au back-office de changer les statuts.
-- =============================================================================

-- Activer RLS (idempotent si déjà actif)
ALTER TABLE ongs ENABLE ROW LEVEL SECURITY;

-- ── Lecture ──────────────────────────────────────────────────────────────────

-- Marketplace publique : seulement les ONGs certifiées
CREATE POLICY "ongs_public_read_verified" ON ongs
  FOR SELECT
  USING (status IN ('verified', 'active'));

-- Agent : voit sa propre ONG peu importe le statut
CREATE POLICY "ongs_agent_read_own" ON ongs
  FOR SELECT
  USING (account_id = auth.uid());

-- Back-office / admin : voit toutes les ONGs
CREATE POLICY "ongs_backoffice_read_all" ON ongs
  FOR SELECT
  USING (get_user_role() IN ('back_office', 'admin'));

-- ── Écriture agent ───────────────────────────────────────────────────────────

-- Agent : crée son ONG
CREATE POLICY "ongs_agent_insert_own" ON ongs
  FOR INSERT
  WITH CHECK (account_id = auth.uid());

-- Agent : modifie son ONG (données, visibilité)
CREATE POLICY "ongs_agent_update_own" ON ongs
  FOR UPDATE
  USING (account_id = auth.uid());

-- ── Écriture back-office ─────────────────────────────────────────────────────

-- Back-office / admin : change le statut de n'importe quelle ONG
CREATE POLICY "ongs_backoffice_update_status" ON ongs
  FOR UPDATE
  USING (get_user_role() IN ('back_office', 'admin'));
