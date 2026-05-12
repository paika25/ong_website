-- =============================================================================
-- Migration 01 : financial_transactions
-- Table append-only immuable pour l'audit trail financier FATF.
-- Triggers BEFORE UPDATE/DELETE → RAISE EXCEPTION (immuabilité absolue).
-- =============================================================================

-- Fonction partagée pour le trigger d'immuabilité (réutilisée par audit_trail)
CREATE OR REPLACE FUNCTION fn_immutable_record()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'immutable record: table % does not allow UPDATE or DELETE', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

-- Table principale
CREATE TABLE IF NOT EXISTS financial_transactions (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id                      UUID        NOT NULL REFERENCES ongs(id) ON DELETE RESTRICT,
  vanilla_pay_transaction_id  TEXT        UNIQUE NOT NULL,
  idempotency_key             TEXT        UNIQUE NOT NULL,
  amount                      INTEGER     NOT NULL CHECK (amount > 0), -- Ariary, jamais float
  status                      TEXT        NOT NULL DEFAULT 'pending'
                                          CHECK (status IN ('pending','processing','completed','failed','timeout','cancelled')),
  transaction_type            TEXT        NOT NULL DEFAULT 'subscription'
                                          CHECK (transaction_type IN ('subscription','donation')),
  previous_hash               TEXT,       -- chaîne Merkle SHA-256 (activée en Story 5.1)
  current_hash                TEXT,       -- hash de cette entrée (activée en Story 5.1)
  retry_count                 INTEGER     NOT NULL DEFAULT 0,
  metadata                    JSONB,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
  -- Pas de updated_at : table immuable, created_at sert de référence pour le zombie-recovery
);

-- Index performance multi-tenant (NFR15)
CREATE INDEX idx_financial_transactions_ong_id
  ON financial_transactions(ong_id);

-- Index partiel sur les statuts actifs pour le zombie-recovery
CREATE INDEX idx_financial_transactions_processing
  ON financial_transactions(created_at)
  WHERE status = 'processing';

-- Trigger immuabilité : interdit tout UPDATE
CREATE TRIGGER trg_financial_transactions_no_update
  BEFORE UPDATE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

-- Trigger immuabilité : interdit tout DELETE
CREATE TRIGGER trg_financial_transactions_no_delete
  BEFORE DELETE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();
