-- =============================================================================
-- Migration 19 : financial_transactions — lecture par le donateur
--
-- PROBLÈME : aucune policy ne permettait à un user_partner de lire
--            ses propres donations dans financial_transactions.
--            La table n'a pas de donor_account_id, seulement donor_email.
--
-- SOLUTION : policy SELECT filtrée sur donor_email = email du compte connecté.
-- =============================================================================

CREATE POLICY "ft_donor_select_own" ON financial_transactions
  FOR SELECT
  USING (
    donor_email = (
      SELECT email FROM accounts WHERE id = auth.uid()
    )
  );
