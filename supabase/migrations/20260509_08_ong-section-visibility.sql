-- migration 20260509_08_ong-section-visibility.sql
-- Ajoute la colonne section_visibility (JSONB) à la table ongs.
-- Chaque section (identite, mission, documents, projets, contacts) est visible par défaut.

ALTER TABLE ongs
  ADD COLUMN IF NOT EXISTS section_visibility JSONB
  NOT NULL DEFAULT '{"identite": true, "mission": true, "documents": true, "projets": true, "contacts": true}'::jsonb;

COMMENT ON COLUMN ongs.section_visibility IS
  'Contrôle la visibilité publique de chaque section du profil ONG. Valeurs possibles par clé : true (visible) / false (masqué).';
