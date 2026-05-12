-- =============================================================================
-- Migration 04 : audit_trail + ops_alerts
-- audit_trail : append-only avec triggers immuabilité (même fn_immutable_record).
-- Champ pre_merkle=true pour les entrées créées avant Story 5.1 (chaîne Merkle).
-- ops_alerts : alertes opérationnelles lisibles par le back-office.
-- =============================================================================

-- ── audit_trail ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_trail (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT        NOT NULL,
  -- Valeurs : 'ong_dossier' | 'algorithm_version' | 'badge' | 'score_dispute' | 'subscription'
  entity_id       UUID        NOT NULL,
  action          TEXT        NOT NULL,
  -- Valeurs : 'validated' | 'rejected' | 'document_uploaded' | 'badge_suspended' |
  --           'algorithm_activated' | 'dispute_opened' | 'dispute_resolved' | etc.
  performed_by    UUID        REFERENCES accounts(id),
  ong_id          UUID        REFERENCES ongs(id),
  details_json    JSONB,
  previous_hash   TEXT,       -- chaîne Merkle (null jusqu'à Story 5.1)
  current_hash    TEXT,       -- hash de cette entrée (null jusqu'à Story 5.1)
  pre_merkle      BOOLEAN     NOT NULL DEFAULT TRUE,
  -- pre_merkle = true pour toutes les entrées avant Story 5.1.
  -- Story 5.1 le passera à false et activera la chaîne SHA-256.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_trail_ong_id
  ON audit_trail(ong_id);

CREATE INDEX idx_audit_trail_entity
  ON audit_trail(entity_type, entity_id);

CREATE INDEX idx_audit_trail_created_at
  ON audit_trail(created_at DESC);

-- Triggers immuabilité : réutilise fn_immutable_record() de Migration 01
CREATE TRIGGER trg_audit_trail_no_update
  BEFORE UPDATE ON audit_trail
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

CREATE TRIGGER trg_audit_trail_no_delete
  BEFORE DELETE ON audit_trail
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

-- ── ops_alerts ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ops_alerts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT        NOT NULL,
  -- Valeurs : 'zombie_transaction' | 'webhook_timeout' | 'hash_mismatch' | 'score_recalc_failed'
  payload       JSONB       NOT NULL DEFAULT '{}',
  severity      TEXT        NOT NULL DEFAULT 'warning'
                            CHECK (severity IN ('info','warning','critical')),
  resolved_at   TIMESTAMPTZ,
  resolved_by   UUID        REFERENCES accounts(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index partiel : alertes non résolues uniquement (tableau de bord back-office)
CREATE INDEX idx_ops_alerts_unresolved
  ON ops_alerts(created_at DESC)
  WHERE resolved_at IS NULL;
