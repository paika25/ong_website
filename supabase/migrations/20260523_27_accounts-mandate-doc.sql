-- Chemin storage du justificatif de mandat fourni par les bailleurs institutionnels (user_partner).
-- Stocké sous ong-documents/mandates/{userId}/... via /api/auth/mandate-upload.
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS mandate_doc_path TEXT;

COMMENT ON COLUMN accounts.mandate_doc_path IS 'Chemin storage du justificatif de mandat (user_partner) — bucket ong-documents, préfixe mandates/{userId}/';
