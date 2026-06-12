-- =============================================================================
-- Migration 29 : Rattrapage — colonnes bailleur sur accounts (organization_name, job_title)
--
-- La migration 25 (20260523_25_accounts-partner-fields) ajoute ces colonnes mais
-- n'a jamais été appliquée sur la base distante : server/api/admin/users.get.ts
-- les sélectionne déjà, ce qui provoque une erreur 500
-- "column accounts.organization_name does not exist".
-- IF NOT EXISTS rend cette migration sûre même si elle est rejouée.
-- =============================================================================

ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS organization_name TEXT,
  ADD COLUMN IF NOT EXISTS job_title         TEXT;

COMMENT ON COLUMN accounts.organization_name IS 'Nom de l''organisation du bailleur (fondation, agence, etc.)';
COMMENT ON COLUMN accounts.job_title         IS 'Fonction/poste du bailleur au sein de son organisation';
