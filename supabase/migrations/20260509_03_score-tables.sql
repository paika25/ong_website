-- =============================================================================
-- Migration 03 : score_history + score_disputes + vue matérialisée
-- score_history : append-only par convention (pas de triggers car pas financier).
-- ong_current_scores : vue matérialisée pour lecture performante du score actuel.
-- =============================================================================

-- ── score_history ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS score_history (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id          UUID        NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  score           INTEGER     NOT NULL CHECK (score >= 0 AND score <= 100),
  version_id      UUID        NOT NULL REFERENCES algorithm_versions(id),
  trigger_event   TEXT        NOT NULL
                              CHECK (trigger_event IN (
                                'DOCUMENT_UPLOADED',
                                'DOCUMENT_DELETED',
                                'PROFILE_UPDATED',
                                'BACKOFFICE_VALIDATED',
                                'BACKOFFICE_REJECTED',
                                'DISPUTE_RESOLVED',
                                'MANUAL_RECALCULATION'
                              )),
  context_json    JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_score_history_ong_id
  ON score_history(ong_id);

CREATE INDEX idx_score_history_created_at
  ON score_history(created_at DESC);

-- ── score_disputes ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS score_disputes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id            UUID        NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  disputed_by       UUID        NOT NULL REFERENCES accounts(id),
  reason            TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open','processing','resolved')),
  resolution_notes  TEXT,
  resolved_by       UUID        REFERENCES accounts(id),
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_score_disputes_ong_id
  ON score_disputes(ong_id);

-- Index partiel : disputes actives uniquement (évite de scanner les résolues)
CREATE INDEX idx_score_disputes_open
  ON score_disputes(created_at DESC)
  WHERE status != 'resolved';

-- ── Vue matérialisée : score actuel par ONG ───────────────────────────────────
-- Lecture O(1) du score courant — rafraîchie après chaque triggerScoreRecalculation().
-- CONCURRENTLY possible car idx_ong_current_scores_ong_id est UNIQUE.

CREATE MATERIALIZED VIEW IF NOT EXISTS ong_current_scores AS
SELECT DISTINCT ON (ong_id)
  ong_id,
  score,
  version_id,
  trigger_event,
  created_at AS scored_at
FROM score_history
ORDER BY ong_id, created_at DESC;

CREATE UNIQUE INDEX idx_ong_current_scores_ong_id
  ON ong_current_scores(ong_id);

-- Fonction de rafraîchissement (appelée depuis score.service.ts après chaque calcul)
CREATE OR REPLACE FUNCTION refresh_ong_current_scores()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY ong_current_scores;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
