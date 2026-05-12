-- migration 20260509_09_ong-status-submitted.sql
-- Ajoute les nouveaux statuts du cycle de validation au champ status de la table ongs.
-- Le champ status est un TEXT (pas d'enum), donc aucune contrainte à modifier.
-- Les nouvelles valeurs : submitted, under_review, complement_required, verified, rejected.

COMMENT ON COLUMN ongs.status IS
  'Cycle de vie ONG : pending → submitted → under_review → verified | rejected | complement_required';
