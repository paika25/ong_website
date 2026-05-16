-- =============================================================================
-- Migration 20 : financial_transactions — ajout donor_id
--
-- Remplace le matching par donor_email (fragile si email différent)
-- par un UUID référençant directement le compte Paika du donateur.
-- Nullable : les dons anonymes/invités n'ont pas de compte.
-- =============================================================================

ALTER TABLE financial_transactions
  ADD COLUMN IF NOT EXISTS donor_id UUID REFERENCES accounts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_financial_transactions_donor_id
  ON financial_transactions(donor_id)
  WHERE donor_id IS NOT NULL;

-- Remplacer la policy email-based (migration 19) par donor_id
DROP POLICY IF EXISTS "ft_donor_select_own" ON financial_transactions;

CREATE POLICY "ft_donor_select_own" ON financial_transactions
  FOR SELECT
  USING (donor_id = auth.uid());
