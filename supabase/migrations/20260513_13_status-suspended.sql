-- =============================================================================
-- Migration 13 : Ajout du statut 'suspended' comme état distinct
-- Sépare la suspension post-certification du complément pré-certification.
-- =============================================================================

-- Mettre à jour la contrainte CHECK sur ongs.status pour inclure 'suspended'
-- (on doit d'abord supprimer l'ancienne contrainte si elle existe)
ALTER TABLE ongs DROP CONSTRAINT IF EXISTS ongs_status_check;

ALTER TABLE ongs ADD CONSTRAINT ongs_status_check CHECK (
  status IN (
    'pending', 'submitted', 'under_review',
    'complement_required', 'verified', 'active',
    'rejected', 'inactive', 'suspended'
  )
);
