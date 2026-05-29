-- Ajoute la colonne storage_path pour stocker le chemin dans le bucket
-- (séparé de file_url qui stockait l'URL publique, maintenant dépréciée)
ALTER TABLE ong_documents
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Migrer les file_url existantes : extraire le chemin relatif depuis l'URL publique
-- Pattern : .../storage/v1/object/public/ong-documents/{path}
UPDATE ong_documents
SET storage_path = REGEXP_REPLACE(
  file_url,
  '^.*/storage/v1/object/public/ong-documents/',
  ''
)
WHERE storage_path IS NULL
  AND file_url LIKE '%/storage/v1/object/public/ong-documents/%';
