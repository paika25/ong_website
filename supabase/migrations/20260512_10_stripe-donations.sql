-- =============================================================================
-- Migration 10 : Support multi-provider pour financial_transactions
-- Permet les dons Stripe en plus de Vanilla Pay.
-- vanilla_pay_transaction_id devient nullable ; stripe_payment_intent_id ajouté.
-- =============================================================================

-- Rendre vanilla_pay_transaction_id nullable (était NOT NULL — Vanilla Pay uniquement)
ALTER TABLE financial_transactions
  ALTER COLUMN vanilla_pay_transaction_id DROP NOT NULL;

-- Colonnes multi-provider
ALTER TABLE financial_transactions
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS provider                  TEXT NOT NULL DEFAULT 'vanilla_pay'
    CHECK (provider IN ('vanilla_pay', 'stripe')),
  ADD COLUMN IF NOT EXISTS currency                  TEXT NOT NULL DEFAULT 'ariary',
  ADD COLUMN IF NOT EXISTS donor_email               TEXT;

-- Contrainte : au moins un ID de transaction fournisseur doit être présent
ALTER TABLE financial_transactions
  ADD CONSTRAINT chk_financial_transactions_provider_id CHECK (
    vanilla_pay_transaction_id IS NOT NULL OR stripe_payment_intent_id IS NOT NULL
  );

-- Index pour les lookups Stripe (webhook)
CREATE INDEX IF NOT EXISTS idx_financial_transactions_stripe_pi
  ON financial_transactions(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
