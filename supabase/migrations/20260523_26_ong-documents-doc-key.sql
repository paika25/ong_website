-- Identifiant de type document pour la correspondance fiable (statuts, recepisse, rapport_financier).
-- Remplace le substring-matching sur le filename utilisateur qui ne fonctionnait pas.
ALTER TABLE ong_documents
  ADD COLUMN IF NOT EXISTS doc_key TEXT;

COMMENT ON COLUMN ong_documents.doc_key IS 'Clé de type du document (statuts | recepisse | rapport_financier | …) — indépendante du nom de fichier';
