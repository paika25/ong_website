-- =============================================================================
-- Migration 12 : Messagerie Back-office ↔ ONG (Story 3.5)
-- Table dossier_messages — canal de communication par dossier ONG.
-- =============================================================================

CREATE TABLE dossier_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id      UUID        NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL,
  sender_role TEXT        NOT NULL CHECK (sender_role IN ('back_office', 'agent')),
  content     TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dossier_messages_ong ON dossier_messages(ong_id, created_at);

ALTER TABLE dossier_messages ENABLE ROW LEVEL SECURITY;

-- Agent : lit les messages de son ONG
CREATE POLICY "dm_agent_select" ON dossier_messages
  FOR SELECT
  USING (ong_id IN (SELECT id FROM ongs WHERE account_id = auth.uid()));

-- Agent : envoie un message pour son ONG
CREATE POLICY "dm_agent_insert" ON dossier_messages
  FOR INSERT
  WITH CHECK (
    sender_role = 'agent'
    AND sender_id = auth.uid()
    AND ong_id IN (SELECT id FROM ongs WHERE account_id = auth.uid())
  );

-- Agent : marque les messages back-office comme lus
CREATE POLICY "dm_agent_read_mark" ON dossier_messages
  FOR UPDATE
  USING (
    sender_role = 'back_office'
    AND ong_id IN (SELECT id FROM ongs WHERE account_id = auth.uid())
  );

-- Back-office / admin : lit tous les messages
CREATE POLICY "dm_backoffice_select" ON dossier_messages
  FOR SELECT
  USING (get_user_role() IN ('back_office', 'admin'));

-- Back-office / admin : envoie un message
CREATE POLICY "dm_backoffice_insert" ON dossier_messages
  FOR INSERT
  WITH CHECK (
    sender_role = 'back_office'
    AND sender_id = auth.uid()
    AND get_user_role() IN ('back_office', 'admin')
  );

-- Back-office / admin : marque les messages agent comme lus
CREATE POLICY "dm_backoffice_read_mark" ON dossier_messages
  FOR UPDATE
  USING (get_user_role() IN ('back_office', 'admin'));
