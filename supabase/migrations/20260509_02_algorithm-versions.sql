-- =============================================================================
-- Migration 02 : algorithm_versions
-- Gouvernance du Score de Transparence : versionnement, approbation, traçabilité.
-- Contrainte : une seule version 'active' à la fois (index UNIQUE partiel).
-- =============================================================================

CREATE TABLE IF NOT EXISTS algorithm_versions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  version       TEXT        NOT NULL,
  params_json   JSONB       NOT NULL DEFAULT '{}',
  status        TEXT        NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','approved','active','deprecated')),
  approved_by   UUID        REFERENCES accounts(id),
  approved_at   TIMESTAMPTZ,
  created_by    UUID        REFERENCES accounts(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Une seule version 'active' simultanément (contrainte métier FATF)
CREATE UNIQUE INDEX idx_algorithm_versions_single_active
  ON algorithm_versions(status)
  WHERE status = 'active';

-- Seed : version initiale v1.0.0 active
-- Poids : reflètent la logique métier de base (à affiner en Story 4.1)
INSERT INTO algorithm_versions (version, params_json, status)
VALUES (
  '1.0.0',
  '{
    "weights": {
      "documents_uploaded": 20,
      "profile_complete": 25,
      "backoffice_validated": 30,
      "financial_reports": 15,
      "projects_declared": 10
    },
    "thresholds": {
      "submission_minimum": 40,
      "verified_badge": 70
    },
    "required_documents": ["statuts", "recepisse", "rapport_financier"]
  }',
  'active'
);
