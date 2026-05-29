-- Les documents juridiques de certification sont privés par défaut.
-- Seuls les documents d'activité publics (plaquettes, rapports annuels publics) peuvent rester 'public'.
ALTER TABLE ong_documents
  ALTER COLUMN visibility SET DEFAULT 'private';

-- Mettre à jour les documents légaux existants sans visibility explicite vers 'private'
-- (ceux dont la visibility = 'public' par défaut de la migration 21 et qui sont de catégorie 'legal')
UPDATE ong_documents
SET visibility = 'private'
WHERE category = 'legal'
  AND visibility = 'public';
