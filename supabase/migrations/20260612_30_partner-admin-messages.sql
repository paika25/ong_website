-- =============================================================================
-- Migration 30 : Messagerie Bailleur (user_partner) ↔ Administration Paika
--
-- Table partner_admin_messages — canal de support direct par bailleur.
-- sender_role : 'back_office' (admin/back-office) | 'partner' (bailleur)
-- =============================================================================

CREATE TABLE partner_admin_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL,
  sender_role TEXT        NOT NULL CHECK (sender_role IN ('back_office', 'partner')),
  content     TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pam_partner ON partner_admin_messages(partner_id, created_at);

ALTER TABLE partner_admin_messages ENABLE ROW LEVEL SECURITY;

-- ── Policies bailleur ─────────────────────────────────────────────────────────

-- Le bailleur lit ses propres messages avec l'administration
CREATE POLICY "pam_partner_select" ON partner_admin_messages
  FOR SELECT
  USING (partner_id = auth.uid());

-- Le bailleur envoie un message à l'administration
CREATE POLICY "pam_partner_insert" ON partner_admin_messages
  FOR INSERT
  WITH CHECK (
    sender_role = 'partner'
    AND sender_id = auth.uid()
    AND partner_id = auth.uid()
  );

-- Le bailleur marque les messages back-office comme lus
CREATE POLICY "pam_partner_read_mark" ON partner_admin_messages
  FOR UPDATE
  USING (
    sender_role = 'back_office'
    AND partner_id = auth.uid()
  );

-- ── Policies back-office / admin ────────────────────────────────────────────

-- Back-office / admin : lit toutes les conversations bailleurs
CREATE POLICY "pam_backoffice_select" ON partner_admin_messages
  FOR SELECT
  USING (get_user_role() IN ('back_office', 'admin'));

-- Back-office / admin : répond à un bailleur
CREATE POLICY "pam_backoffice_insert" ON partner_admin_messages
  FOR INSERT
  WITH CHECK (
    sender_role = 'back_office'
    AND sender_id = auth.uid()
    AND get_user_role() IN ('back_office', 'admin')
  );

-- Back-office / admin : marque les messages bailleur comme lus
CREATE POLICY "pam_backoffice_read_mark" ON partner_admin_messages
  FOR UPDATE
  USING (get_user_role() IN ('back_office', 'admin'));

-- ── Service role bypass ──────────────────────────────────────────────────────
CREATE POLICY "pam_service_role_all" ON partner_admin_messages
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
