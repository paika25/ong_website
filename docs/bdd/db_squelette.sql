-- ============================================
-- SCHÉMA : Plateforme avec deux types d'utilisateurs
-- user_partner : donneurs / partenaires
-- user_agent   : agents qui créent et gèrent les ONG
-- ============================================

-- Extension nécessaire pour les indexes trigram (recherche full-text sur name/description)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- PARTIE 1: CRÉATION DES TABLES
-- ============================================

-- Table principale : comptes (authentification unique)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('user_partner', 'user_agent')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des ONG (liée à un compte user_agent)
CREATE TABLE ongs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('education', 'health', 'environment', 'social', 'culture')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  location TEXT,
  image TEXT,
  volunteers INTEGER DEFAULT 0,
  email TEXT,
  phone TEXT,
  website TEXT,

  -- Projets (tableau JSONB)
  projects JSONB DEFAULT '[]'::jsonb,

  -- Données financières (objet JSONB)
  financials JSONB DEFAULT '{
    "totalBudget2023": 0,
    "fundingSources": [],
    "financialReports": [],
    "allocation": {
      "programs": 0,
      "administration": 0,
      "fundraising": 0
    }
  }'::jsonb,

  -- Données légales (objet JSONB)
  legal JSONB DEFAULT '{
    "siret": null,
    "registrationDate": null,
    "compliance": {
      "dataProtection": null,
      "financialTransparency": null
    }
  }'::jsonb,

  -- Impact (objet JSONB)
  impact JSONB DEFAULT '{
    "totalBeneficiaries": 0,
    "kpis": []
  }'::jsonb,

  -- Opportunités de dons (tableau JSONB)
  donation_opportunities JSONB DEFAULT '[]'::jsonb,

  -- Opportunités d'investissement (tableau JSONB)
  investment_opportunities JSONB DEFAULT '[]'::jsonb,

  -- Monitoring (objet JSONB)
  monitoring JSONB DEFAULT '{
    "reportsFrequency": null,
    "evaluation": null,
    "audits": null
  }'::jsonb,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table de jonction : un user_agent peut gérer plusieurs ONG
CREATE TABLE agent_ong_managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  
  -- Permissions détaillées (objet JSONB)
  permissions JSONB DEFAULT '{
    "manageProjects": false,
    "manageDonations": false,
    "manageVolunteers": false,
    "editOngProfile": false,
    "viewAnalytics": true,
    "manageBudget": false,
    "inviteManagers": false
  }'::jsonb,
  
  granted_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (agent_account_id, ong_id)
);

-- Table optionnelle : profil étendu pour les partenaires
CREATE TABLE partner_profiles (
  account_id UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  
  partner_type TEXT CHECK (partner_type IN ('individual', 'company', 'foundation', 'government')),
  company_logo TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
  industry TEXT,
  
  preferred_causes TEXT[] DEFAULT '{}',
  partnership_level TEXT DEFAULT 'bronze' CHECK (partnership_level IN ('bronze', 'silver', 'gold', 'platinum')),
  
  -- Statistiques (calculées via trigger)
  stats JSONB DEFAULT '{
    "totalDonated": 0,
    "donationsCount": 0,
    "ongsSupported": 0,
    "firstDonationDate": null,
    "lastDonationDate": null
  }'::jsonb,
  
  -- Préférences de visibilité
  visibility_settings JSONB DEFAULT '{
    "showProfile": true,
    "showDonations": false,
    "showAmount": false,
    "showCompanyLogo": true
  }'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des dons (tout compte peut donner)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  type TEXT DEFAULT 'one-time' CHECK (type IN ('one-time', 'monthly', 'annual', 'project-based')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  
  -- Métadonnées du don (objet JSONB)
  metadata JSONB DEFAULT '{
    "anonymous": false,
    "publicMessage": null,
    "taxReceiptRequested": false,
    "taxReceiptSent": false,
    "recognitionType": "full_name"
  }'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PARTIE 2: INDEX POUR PERFORMANCE
-- ============================================

-- Index sur accounts
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_type ON accounts(account_type);
CREATE INDEX idx_accounts_verified ON accounts(verified);

-- Index sur ongs
CREATE INDEX idx_ongs_account_id ON ongs(account_id);
CREATE INDEX idx_ongs_category ON ongs(category);
CREATE INDEX idx_ongs_status ON ongs(status);
CREATE INDEX idx_ongs_location ON ongs(location);
CREATE INDEX idx_ongs_volunteers ON ongs(volunteers DESC);

-- Index GIN pour recherche JSONB
CREATE INDEX idx_ongs_projects_gin ON ongs USING GIN (projects);
CREATE INDEX idx_ongs_financials_gin ON ongs USING GIN (financials);
CREATE INDEX idx_ongs_impact_gin ON ongs USING GIN (impact);

-- Index GIN trigram pour recherche full-text
CREATE INDEX idx_ongs_name_trgm ON ongs USING gin (name gin_trgm_ops);
CREATE INDEX idx_ongs_description_trgm ON ongs USING gin (description gin_trgm_ops);

-- Index sur agent_ong_managers
CREATE INDEX idx_agent_ong_agent ON agent_ong_managers(agent_account_id);
CREATE INDEX idx_agent_ong_ong ON agent_ong_managers(ong_id);
CREATE INDEX idx_agent_ong_role ON agent_ong_managers(role);

-- Index sur partner_profiles
CREATE INDEX idx_partner_profiles_type ON partner_profiles(partner_type);
CREATE INDEX idx_partner_profiles_level ON partner_profiles(partnership_level);
CREATE INDEX idx_partner_profiles_causes_gin ON partner_profiles USING GIN (preferred_causes);

-- Index sur donations
CREATE INDEX idx_donations_donor ON donations(donor_account_id);
CREATE INDEX idx_donations_ong ON donations(ong_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_type ON donations(type);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);

-- ============================================
-- PARTIE 3: FONCTIONS & TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_accounts_updated_at 
  BEFORE UPDATE ON accounts
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ongs_updated_at 
  BEFORE UPDATE ON ongs
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_profiles_updated_at 
  BEFORE UPDATE ON partner_profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at 
  BEFORE UPDATE ON donations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour vérifier que account_id dans ongs est bien un user_agent
CREATE OR REPLACE FUNCTION check_ong_account_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = NEW.account_id 
    AND account_type = 'user_agent'
  ) THEN
    RAISE EXCEPTION 'L''ONG doit être liée à un compte de type user_agent';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_ong_owned_by_agent
  BEFORE INSERT OR UPDATE ON ongs
  FOR EACH ROW
  EXECUTE FUNCTION check_ong_account_type();

-- Fonction pour vérifier que agent_account_id est bien un user_agent
CREATE OR REPLACE FUNCTION check_agent_manager_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = NEW.agent_account_id 
    AND account_type = 'user_agent'
  ) THEN
    RAISE EXCEPTION 'Seuls les user_agent peuvent gérer des ONGs';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_manager_is_agent
  BEFORE INSERT OR UPDATE ON agent_ong_managers
  FOR EACH ROW
  EXECUTE FUNCTION check_agent_manager_type();

-- Fonction pour vérifier que partner_profile est pour un user_partner
CREATE OR REPLACE FUNCTION check_partner_profile_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = NEW.account_id 
    AND account_type = 'user_partner'
  ) THEN
    RAISE EXCEPTION 'Les profils partenaires sont réservés aux user_partner';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_partner_profile_for_partners
  BEFORE INSERT OR UPDATE ON partner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_partner_profile_type();

-- Fonction pour définir automatiquement les permissions du propriétaire
CREATE OR REPLACE FUNCTION set_owner_permissions()
RETURNS TRIGGER AS $$
BEGIN
  -- Si c'est le créateur (account_id de l'ONG)
  IF NEW.agent_account_id = (SELECT account_id FROM ongs WHERE id = NEW.ong_id) THEN
    NEW.role := 'owner';
    NEW.permissions := '{
      "manageProjects": true,
      "manageDonations": true,
      "manageVolunteers": true,
      "editOngProfile": true,
      "viewAnalytics": true,
      "manageBudget": true,
      "inviteManagers": true
    }'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_set_owner_permissions
  BEFORE INSERT ON agent_ong_managers
  FOR EACH ROW
  EXECUTE FUNCTION set_owner_permissions();

-- Fonction pour mettre à jour les stats des partenaires
CREATE OR REPLACE FUNCTION update_partner_stats_on_donation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.donor_account_id IS NOT NULL AND NEW.status = 'completed' THEN
    UPDATE partner_profiles
    SET stats = jsonb_build_object(
      'totalDonated', COALESCE((
        SELECT SUM(amount) 
        FROM donations 
        WHERE donor_account_id = NEW.donor_account_id 
        AND status = 'completed'
      ), 0),
      'donationsCount', COALESCE((
        SELECT COUNT(*) 
        FROM donations 
        WHERE donor_account_id = NEW.donor_account_id 
        AND status = 'completed'
      ), 0),
      'ongsSupported', COALESCE((
        SELECT COUNT(DISTINCT ong_id) 
        FROM donations 
        WHERE donor_account_id = NEW.donor_account_id 
        AND status = 'completed'
      ), 0),
      'firstDonationDate', (
        SELECT MIN(created_at) 
        FROM donations 
        WHERE donor_account_id = NEW.donor_account_id 
        AND status = 'completed'
      ),
      'lastDonationDate', (
        SELECT MAX(created_at) 
        FROM donations 
        WHERE donor_account_id = NEW.donor_account_id 
        AND status = 'completed'
      )
    )
    WHERE account_id = NEW.donor_account_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_partner_stats
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_partner_stats_on_donation();

-- ============================================
-- PARTIE 4: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ongs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_ong_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policies pour accounts
CREATE POLICY "Comptes publics visibles par tous"
  ON accounts FOR SELECT
  USING (true);

CREATE POLICY "Utilisateurs peuvent mettre à jour leur profil"
  ON accounts FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour ongs
CREATE POLICY "ONGs actives visibles par tous"
  ON ongs FOR SELECT
  USING (status = 'active' OR auth.uid() = account_id);

CREATE POLICY "Agents peuvent créer des ONGs"
  ON ongs FOR INSERT
  WITH CHECK (
    auth.uid() = account_id 
    AND EXISTS (
      SELECT 1 FROM accounts 
      WHERE id = auth.uid() 
      AND account_type = 'user_agent'
    )
  );

CREATE POLICY "Gestionnaires peuvent modifier les ONGs"
  ON ongs FOR UPDATE
  USING (
    auth.uid() = account_id 
    OR auth.uid() IN (
      SELECT agent_account_id 
      FROM agent_ong_managers 
      WHERE ong_id = ongs.id 
      AND role IN ('owner', 'admin')
    )
  );

-- Policies pour agent_ong_managers
CREATE POLICY "Gestionnaires voient les managers de leurs ONGs"
  ON agent_ong_managers FOR SELECT
  USING (
    auth.uid() = agent_account_id 
    OR auth.uid() IN (
      SELECT agent_account_id 
      FROM agent_ong_managers am 
      WHERE am.ong_id = agent_ong_managers.ong_id
    )
  );

CREATE POLICY "Propriétaires peuvent ajouter des gestionnaires"
  ON agent_ong_managers FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT agent_account_id 
      FROM agent_ong_managers 
      WHERE ong_id = agent_ong_managers.ong_id 
      AND role = 'owner'
    )
  );

-- Policies pour partner_profiles
CREATE POLICY "Profils partenaires publics si visibilité activée"
  ON partner_profiles FOR SELECT
  USING (
    (visibility_settings->>'showProfile')::boolean = true 
    OR auth.uid() = account_id
  );

CREATE POLICY "Partenaires gèrent leur profil"
  ON partner_profiles FOR ALL
  USING (auth.uid() = account_id);

-- Policies pour donations
CREATE POLICY "Utilisateurs voient leurs dons"
  ON donations FOR SELECT
  USING (
    auth.uid() = donor_account_id 
    OR auth.uid() IN (
      SELECT account_id FROM ongs WHERE id = donations.ong_id
    )
  );

CREATE POLICY "Utilisateurs peuvent créer des dons"
  ON donations FOR INSERT
  WITH CHECK (auth.uid() = donor_account_id);

-- ============================================
-- PARTIE 5: VUES UTILES
-- ============================================

-- Vue pour statistiques globales ONGs
CREATE OR REPLACE VIEW ongs_stats AS
SELECT 
  category,
  COUNT(*) as total_ongs,
  SUM(volunteers) as total_volunteers,
  AVG(volunteers)::INTEGER as avg_volunteers,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_ongs
FROM ongs
GROUP BY category;

-- Vue pour projets en cours
CREATE OR REPLACE VIEW ongoing_projects AS
SELECT 
  o.id as ong_id,
  o.name as ong_name,
  o.category,
  p.value->>'id' as project_id,
  p.value->>'name' as project_name,
  p.value->>'status' as project_status,
  (p.value->>'budget')::numeric as project_budget
FROM ongs o,
  jsonb_array_elements(o.projects) as p
WHERE p.value->>'status' = 'ongoing';

-- Vue pour dashboard des partenaires
CREATE OR REPLACE VIEW partner_dashboard AS
SELECT 
  a.id,
  COALESCE(a.company_name, a.first_name || ' ' || a.last_name) as name,
  pp.partner_type,
  pp.partnership_level,
  pp.stats,
  COUNT(DISTINCT d.ong_id) as ongs_supported,
  COUNT(DISTINCT d.id) as total_donations,
  COALESCE(SUM(d.amount), 0) as total_donated
FROM accounts a
LEFT JOIN partner_profiles pp ON a.id = pp.account_id
LEFT JOIN donations d ON a.id = d.donor_account_id AND d.status = 'completed'
WHERE a.account_type = 'user_partner'
GROUP BY a.id, a.company_name, a.first_name, a.last_name, pp.partner_type, pp.partnership_level, pp.stats;

-- ============================================
-- COMMENTAIRES POUR DOCUMENTATION
-- ============================================

COMMENT ON TABLE accounts IS 'Compte principal : user_partner (donneur/partenaire) ou user_agent (gestionnaire d''ONG)';
COMMENT ON COLUMN accounts.account_type IS 'Valeurs autorisées : ''user_partner'' ou ''user_agent''';

COMMENT ON TABLE ongs IS 'Profil d''une ONG, toujours liée à un compte de type user_agent';
COMMENT ON COLUMN ongs.account_id IS 'Doit référencer un compte de type user_agent (vérifié via trigger)';
COMMENT ON COLUMN ongs.projects IS 'Tableau JSONB des projets de l''ONG';
COMMENT ON COLUMN ongs.financials IS 'Objet JSONB contenant les données financières';
COMMENT ON COLUMN ongs.legal IS 'Objet JSONB contenant les informations légales';
COMMENT ON COLUMN ongs.impact IS 'Objet JSONB contenant les métriques d''impact';
COMMENT ON COLUMN ongs.donation_opportunities IS 'Tableau JSONB des opportunités de dons';
COMMENT ON COLUMN ongs.monitoring IS 'Objet JSONB contenant les informations de suivi';

COMMENT ON TABLE agent_ong_managers IS 'Permet à un user_agent de gérer plusieurs ONGs, et à une ONG d''avoir plusieurs gestionnaires';
COMMENT ON COLUMN agent_ong_managers.agent_account_id IS 'Doit être un compte de type user_agent (vérifié via trigger)';
COMMENT ON COLUMN agent_ong_managers.permissions IS 'Objet JSONB définissant les permissions granulaires';

COMMENT ON TABLE partner_profiles IS 'Profil étendu optionnel pour les comptes partenaires';
COMMENT ON TABLE donations IS 'Dons effectués par n''importe quel compte vers une ONG';

-- ============================================
-- FIN DU SQUELETTE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schéma de base créé avec succès!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Structure créée:';
  RAISE NOTICE '   - accounts (comptes utilisateurs)';
  RAISE NOTICE '   - ongs (organisations avec JSONB)';
  RAISE NOTICE '   - agent_ong_managers (gestion multi-agents)';
  RAISE NOTICE '   - partner_profiles (profils partenaires étendus)';
  RAISE NOTICE '   - donations (historique des dons)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Fonctionnalités installées:';
  RAISE NOTICE '   - Index de performance (GIN, trigram)';
  RAISE NOTICE '   - Triggers de validation';
  RAISE NOTICE '   - Row Level Security (RLS)';
  RAISE NOTICE '   - Vues utiles';
  RAISE NOTICE '   - Calcul automatique des stats';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Prêt pour l''insertion des données!';
END $$;
