-- Champs supplémentaires pour les bailleurs de fonds institutionnels (user_partner)
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS organization_name TEXT,
  ADD COLUMN IF NOT EXISTS job_title         TEXT;

-- Commentaires documentant l'intention
COMMENT ON COLUMN accounts.organization_name IS 'Nom de l''organisation du bailleur (fondation, agence, etc.)';
COMMENT ON COLUMN accounts.job_title         IS 'Fonction/poste du bailleur au sein de son organisation';
