-- =============================================================================
-- Migration 14 : Permissions back-office sur audit_trail
-- Le back-office/admin peut insérer dans audit_trail sans service_role key.
-- =============================================================================

-- Lecture audit — admin en plus de back_office (déjà couvert par migration 05)
CREATE POLICY "at_admin_select" ON audit_trail
  FOR SELECT
  USING (get_user_role() = 'admin');

-- Insert — back_office et admin peuvent écrire l'historique
CREATE POLICY "at_backoffice_insert" ON audit_trail
  FOR INSERT
  WITH CHECK (get_user_role() IN ('back_office', 'admin'));
