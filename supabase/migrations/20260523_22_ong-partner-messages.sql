-- =============================================================================
-- Migration 22 : Messagerie ONG ↔ Bailleurs de fonds (user_partner)
--
-- Table ong_partner_messages
-- Une conversation = (ong_id, partner_id). Chaque ligne est un message.
-- sender_role : 'agent' (côté ONG) | 'partner' (côté bailleur)
-- =============================================================================

CREATE TABLE ong_partner_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id      UUID        NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  partner_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL,
  sender_role TEXT        NOT NULL CHECK (sender_role IN ('agent', 'partner')),
  content     TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_opm_ong_partner ON ong_partner_messages(ong_id, partner_id, created_at);
CREATE INDEX idx_opm_partner     ON ong_partner_messages(partner_id, created_at);

ALTER TABLE ong_partner_messages ENABLE ROW LEVEL SECURITY;

-- ── Policies partenaire ───────────────────────────────────────────────────────

-- Le partenaire lit uniquement ses propres conversations
CREATE POLICY "opm_partner_select" ON ong_partner_messages
  FOR SELECT
  USING (partner_id = auth.uid());

-- Le partenaire envoie un message
CREATE POLICY "opm_partner_insert" ON ong_partner_messages
  FOR INSERT
  WITH CHECK (
    sender_role = 'partner'
    AND sender_id = auth.uid()
    AND partner_id = auth.uid()
  );

-- Le partenaire marque les messages agent comme lus
CREATE POLICY "opm_partner_read_mark" ON ong_partner_messages
  FOR UPDATE
  USING (
    sender_role = 'agent'
    AND partner_id = auth.uid()
  );

-- ── Policies agent ONG ────────────────────────────────────────────────────────

-- L'agent lit les conversations de son ONG
CREATE POLICY "opm_agent_select" ON ong_partner_messages
  FOR SELECT
  USING (
    ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
      UNION
      SELECT ong_id FROM agent_ong_managers WHERE agent_account_id = auth.uid()
    )
  );

-- L'agent envoie un message depuis son ONG
CREATE POLICY "opm_agent_insert" ON ong_partner_messages
  FOR INSERT
  WITH CHECK (
    sender_role = 'agent'
    AND sender_id = auth.uid()
    AND ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
      UNION
      SELECT ong_id FROM agent_ong_managers WHERE agent_account_id = auth.uid()
    )
  );

-- L'agent marque les messages partenaire comme lus
CREATE POLICY "opm_agent_read_mark" ON ong_partner_messages
  FOR UPDATE
  USING (
    sender_role = 'partner'
    AND ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
      UNION
      SELECT ong_id FROM agent_ong_managers WHERE agent_account_id = auth.uid()
    )
  );

-- ── Service role bypass ───────────────────────────────────────────────────────
CREATE POLICY "opm_service_role_all" ON ong_partner_messages
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
