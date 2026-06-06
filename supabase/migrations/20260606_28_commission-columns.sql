-- =============================================================================
-- Migration 28 : Colonnes commission sur financial_transactions
-- commission_cents : montant prélevé par Paika (en centimes EUR ou Ariary)
-- net_amount_cents : montant reversé à l'ONG après commission
-- commission_rate  : taux appliqué au moment de la transaction (immuable)
-- =============================================================================

ALTER TABLE financial_transactions
  ADD COLUMN IF NOT EXISTS commission_cents  INTEGER,
  ADD COLUMN IF NOT EXISTS net_amount_cents  INTEGER,
  ADD COLUMN IF NOT EXISTS commission_rate   NUMERIC(5,4);
