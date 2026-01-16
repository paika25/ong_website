-- ============================================
-- PARTIE 1: CRÉATION DES TABLES
-- ============================================

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  skills TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT NOW(),
  stats JSONB DEFAULT '{
    "ongs": 0,
    "projects": 0,
    "followers": 0,
    "following": 0
  }'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: ongs (avec JSONB pour éviter les jointures!)
CREATE TABLE ongs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK(category IN ('education', 'health', 'environment', 'social', 'culture')),
  status TEXT CHECK(status IN ('active', 'pending', 'inactive')) DEFAULT 'active',
  location TEXT,
  image TEXT,
  volunteers INTEGER DEFAULT 0,
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Données complexes en JSONB (pas de tables séparées!)
  projects JSONB DEFAULT '[]'::jsonb,
  financials JSONB,
  legal JSONB,
  impact JSONB,
  donation_opportunities JSONB DEFAULT '[]'::jsonb,
  investment_opportunities JSONB DEFAULT '[]'::jsonb,
  monitoring JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: donations (seule vraie relation)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ong_id UUID REFERENCES ongs(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK(amount > 0),
  type TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PARTIE 2: INDEX POUR PERFORMANCE
-- ============================================

-- Index sur users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verified ON users(verified);

-- Index sur ongs
CREATE INDEX idx_ongs_category ON ongs(category);
CREATE INDEX idx_ongs_status ON ongs(status);
CREATE INDEX idx_ongs_location ON ongs(location);
CREATE INDEX idx_ongs_volunteers ON ongs(volunteers DESC);

-- Index GIN pour recherche JSONB (super puissant!)
CREATE INDEX idx_ongs_projects_gin ON ongs USING GIN (projects);
CREATE INDEX idx_ongs_financials_gin ON ongs USING GIN (financials);
CREATE INDEX idx_ongs_impact_gin ON ongs USING GIN (impact);

-- Index sur donations
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_ong_id ON donations(ong_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);

-- Index pour recherche full-text
CREATE INDEX idx_ongs_name_trgm ON ongs USING gin(name gin_trgm_ops);
CREATE INDEX idx_ongs_description_trgm ON ongs USING gin(description gin_trgm_ops);

-- ============================================
-- PARTIE 3: FONCTIONS UTILITAIRES
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ongs_updated_at BEFORE UPDATE ON ongs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTIE 4: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ongs ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policies pour users
CREATE POLICY "Public users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour ongs
CREATE POLICY "Active ONGs are viewable by everyone"
  ON ongs FOR SELECT
  USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create ONGs"
  ON ongs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policies pour donations
CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM users WHERE verified = true
  ));

CREATE POLICY "Users can create donations"
  ON donations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PARTIE 5: INSERTION DES DONNÉES MOCKONGS
-- ============================================

-- ONG 1: Éducation pour Tous Madagascar
INSERT INTO ongs (
  id, name, description, category, status, location, image, volunteers,
  email, phone, website, projects, financials, legal, impact,
  donation_opportunities, monitoring, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Éducation pour Tous Madagascar',
  'Organisation dédiée à l''amélioration de l''accès à l''éducation dans les zones rurales de Madagascar. Nous construisons des écoles, formons des enseignants et promouvons l''éducation inclusive.',
  'education',
  'active',
  'Antananarivo, Madagascar',
  'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400',
  245,
  'contact@education-madagascar.org',
  '+261 34 12 345 67',
  'https://education-madagascar.org',
  '[
    {"id": "p1-1", "name": "Construction École Antsirabe", "description": "Construction d''une école primaire à Antsirabe.", "startDate": "2022-03-01", "status": "completed", "impact": "500 élèves scolarisés", "budget": 50000},
    {"id": "p1-2", "name": "Formation Enseignants 2023", "description": "Programme de formation pour 50 enseignants.", "startDate": "2023-01-15", "status": "ongoing", "impact": "50 enseignants formés, 2000 élèves impactés", "budget": 25000},
    {"id": "p1-3", "name": "Bibliothèque Mobile", "description": "Mise en place d''une bibliothèque itinérante.", "startDate": "2023-06-01", "status": "planned", "impact": "1000 bénéficiaires attendus", "budget": 15000},
    {"id": "p1-4", "name": "École Secondaire Fianarantsoa", "description": "Construction d''une école secondaire.", "startDate": "2024-02-01", "status": "ongoing", "impact": "300 élèves attendus", "budget": 75000},
    {"id": "p1-5", "name": "Ateliers Numériques", "description": "Introduction aux compétences numériques.", "startDate": "2022-09-01", "status": "completed", "impact": "200 élèves formés", "budget": 10000},
    {"id": "p1-6", "name": "Bourses Scolaires 2024", "description": "Bourses pour élèves défavorisés.", "startDate": "2024-01-10", "status": "planned", "impact": "100 élèves soutenus", "budget": 20000},
    {"id": "p1-7", "name": "Renforcement Capacités", "description": "Formation continue des enseignants.", "startDate": "2023-04-01", "status": "ongoing", "impact": "30 enseignants formés", "budget": 18000},
    {"id": "p1-8", "name": "École Rurale Ambatolampy", "description": "Construction d''une école rurale.", "startDate": "2022-11-01", "status": "completed", "impact": "400 élèves scolarisés", "budget": 45000},
    {"id": "p1-9", "name": "Programme Alphabétisation", "description": "Cours d''alphabétisation pour adultes.", "startDate": "2023-07-01", "status": "ongoing", "impact": "150 adultes alphabétisés", "budget": 12000},
    {"id": "p1-10", "name": "Équipements Scolaires", "description": "Fourniture de matériel scolaire.", "startDate": "2024-03-01", "status": "planned", "impact": "1000 élèves équipés", "budget": 8000},
    {"id": "p1-11", "name": "Ateliers Pédagogiques", "description": "Ateliers pour enseignants.", "startDate": "2022-05-01", "status": "completed", "impact": "40 enseignants formés", "budget": 9000},
    {"id": "p1-12", "name": "Éducation Inclusive", "description": "Programme pour enfants handicapés.", "startDate": "2024-05-01", "status": "ongoing", "impact": "50 enfants intégrés", "budget": 22000}
  ]'::jsonb,
  '{
    "totalBudget2023": 250000,
    "fundingSources": [
      {"source": "Subventions publiques", "percentage": 58, "amount": 145000},
      {"source": "Dons privés et fondations", "percentage": 30, "amount": 75000},
      {"source": "Financement participatif", "percentage": 10, "amount": 25000},
      {"source": "Investissements institutionnels", "percentage": 2, "amount": 5000}
    ],
    "financialReports": [
      {"year": 2022, "url": "https://education-madagascar.org/reports/2022.pdf", "audited": true},
      {"year": 2023, "url": "https://education-madagascar.org/reports/2023.pdf", "audited": true}
    ],
    "allocation": {
      "programs": 70,
      "administration": 20,
      "fundraising": 10
    }
  }'::jsonb,
  '{
    "siret": "123 456 789 00012",
    "registrationDate": "2022-01-10",
    "compliance": {
      "dataProtection": "Conforme RGPD",
      "financialTransparency": "Audits annuels réalisés par cabinet indépendant"
    }
  }'::jsonb,
  '{
    "totalBeneficiaries": 5000,
    "schoolsBuilt": 3,
    "teachersTrained": 120,
    "kpis": [
      {"metric": "Taux de scolarisation", "value": "85% dans les zones ciblées"},
      {"metric": "Nombre d''élèves soutenus", "value": 2000},
      {"metric": "Taux d''alphabétisation adulte", "value": "60% dans les programmes"}
    ]
  }'::jsonb,
  '[
    {
      "type": "Don ponctuel",
      "description": "Don unique pour soutenir la construction d''écoles, l''achat de matériel pédagogique ou une urgence locale. Aidez directement les bénéficiaires sans attendre de retour financier.",
      "minAmount": 20,
      "benefits": "Remerciement personnalisé et rapport d''impact sur l''utilisation des fonds."
    },
    {
      "type": "Don mensuel",
      "description": "Soutien récurrent pour assurer la pérennité des programmes éducatifs, des bourses et des activités quotidiennes.",
      "minAmount": 5,
      "benefits": "Mises à jour régulières sur l''impact, priorité pour participer aux événements et transparence sur l''utilisation des dons."
    },
    {
      "type": "Parrainage de projet",
      "description": "Soutenez un projet précis (ex : construction d''une classe, bourses pour élèves) et suivez son avancement étape par étape.",
      "minAmount": 200,
      "benefits": "Rapports d''avancement, photos et mentions de remerciement dans les communications publiques."
    }
  ]'::jsonb,
  '{
    "reportsFrequency": "Trimestrielle",
    "evaluation": "Évaluations d''impact annuelles par des experts indépendants",
    "audits": "Annuels, réalisés par cabinet externe"
  }'::jsonb,
  '2022-01-15T10:00:00Z',
  '2024-10-30T15:30:00Z'
);

-- ONG 2: Santé Communautaire Océan Indien
INSERT INTO ongs (
  id, name, description, category, status, location, image, volunteers,
  email, phone, website, projects, financials, legal, impact,
  investment_opportunities, monitoring, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Santé Communautaire Océan Indien',
  'Amélioration des soins de santé primaires dans les communautés isolées. Programme de vaccination et de sensibilisation sanitaire.',
  'health',
  'active',
  'Toamasina, Madagascar',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
  156,
  'info@sante-oi.mg',
  '+261 32 98 765 43',
  'https://sante-oi.mg',
  '[
    {"id": "p2-1", "name": "Campagne Vaccination 2023", "description": "Vaccination contre la rougeole dans les villages.", "startDate": "2023-06-01", "status": "completed", "impact": "3000 enfants vaccinés", "budget": 35000},
    {"id": "p2-2", "name": "Sensibilisation Hygiène", "description": "Ateliers sur l''hygiène communautaire.", "startDate": "2024-02-01", "status": "ongoing", "impact": "500 familles formées", "budget": 12000},
    {"id": "p2-3", "name": "Centre de Santé Mobile", "description": "Unité mobile pour soins primaires.", "startDate": "2022-08-01", "status": "completed", "impact": "5000 consultations réalisées", "budget": 80000},
    {"id": "p2-4", "name": "Programme Nutrition", "description": "Distribution de compléments alimentaires.", "startDate": "2023-03-01", "status": "ongoing", "impact": "1200 enfants bénéficiaires", "budget": 45000},
    {"id": "p2-5", "name": "Dépistage Malaria", "description": "Campagne de dépistage dans les zones à risque.", "startDate": "2024-01-15", "status": "planned", "impact": "2000 personnes ciblées", "budget": 25000},
    {"id": "p2-6", "name": "Formation Infirmiers", "description": "Formation pour personnel médical local.", "startDate": "2022-10-01", "status": "completed", "impact": "60 infirmiers formés", "budget": 30000},
    {"id": "p2-7", "name": "Santé Maternelle", "description": "Suivi prénatal dans les villages.", "startDate": "2023-09-01", "status": "ongoing", "impact": "800 femmes suivies", "budget": 40000},
    {"id": "p2-8", "name": "Accès Eau Potable", "description": "Installation de points d''eau.", "startDate": "2024-04-01", "status": "planned", "impact": "10 villages équipés", "budget": 60000}
  ]'::jsonb,
  '{
    "totalBudget2023": 180000,
    "fundingSources": [
      {"source": "OMS et organismes internationaux", "percentage": 45, "amount": 81000},
      {"source": "Subventions gouvernementales", "percentage": 35, "amount": 63000},
      {"source": "Dons privés", "percentage": 15, "amount": 27000},
      {"source": "Partenariats pharmaceutiques", "percentage": 5, "amount": 9000}
    ],
    "financialReports": [
      {"year": 2022, "url": "https://sante-oi.mg/reports/2022.pdf", "audited": true},
      {"year": 2023, "url": "https://sante-oi.mg/reports/2023.pdf", "audited": true}
    ],
    "allocation": {
      "programs": 75,
      "administration": 18,
      "fundraising": 7
    }
  }'::jsonb,
  '{
    "siret": "234 567 890 00023",
    "registrationDate": "2021-06-15",
    "compliance": {
      "dataProtection": "Conforme RGPD - Protection données médicales",
      "financialTransparency": "Audits annuels certifiés par expert-comptable"
    }
  }'::jsonb,
  '{
    "totalBeneficiaries": 8000,
    "healthcareProvided": 5000,
    "kpis": [
      {"metric": "Taux de vaccination", "value": "78% dans les zones ciblées"},
      {"metric": "Consultations médicales", "value": 5000},
      {"metric": "Personnel médical formé", "value": 60},
      {"metric": "Réduction mortalité infantile", "value": "-12% dans les zones d''intervention"}
    ]
  }'::jsonb,
  '[
    {
      "type": "Obligations sanitaires",
      "description": "Titres pour financement d''équipements médicaux.",
      "minInvestment": 2000,
      "terms": "Rendement 2.5% sur 5 ans, remboursement à l''échéance."
    },
    {
      "type": "Partenariat clinique",
      "description": "Co-financement de centres de santé.",
      "minInvestment": 15000,
      "terms": "Visibilité partenaire, rapports semestriels."
    }
  ]'::jsonb,
  '{
    "reportsFrequency": "Semestrielle",
    "evaluation": "Évaluations d''impact sanitaire par experts OMS",
    "audits": "Annuels, certification ISO santé"
  }'::jsonb,
  '2021-06-20T14:15:00Z',
  '2024-10-28T09:45:00Z'
);

-- ONG 3: Reboisement Vert Madagascar
INSERT INTO ongs (
  id, name, description, category, status, location, image, volunteers,
  email, phone, projects, financials, legal, impact,
  investment_opportunities, monitoring, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Reboisement Vert Madagascar',
  'Protection et restauration des forêts malgaches. Plantation d''arbres endémiques et sensibilisation environnementale.',
  'environment',
  'active',
  'Andasibe, Madagascar',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  89,
  'contact@reboisement-mg.org',
  '+261 33 44 556 78',
  '[
    {"id": "p3-1", "name": "Plantation Andasibe 2023", "description": "Plantation de 10 000 arbres endémiques dans la région d''Andasibe.", "startDate": "2023-04-01", "status": "completed"},
    {"id": "p3-2", "name": "Sensibilisation Écoles 2023", "description": "Ateliers environnementaux dans 15 écoles primaires pour promouvoir la conservation.", "startDate": "2023-06-15", "status": "completed"},
    {"id": "p3-3", "name": "Corridor Écologique Mantadia", "description": "Création d''un corridor écologique pour relier les habitats de la faune.", "startDate": "2023-09-01", "status": "ongoing"},
    {"id": "p3-4", "name": "Reforestation Analamazaotra", "description": "Restauration de 50 hectares de forêt dégradée à Analamazaotra.", "startDate": "2024-01-10", "status": "ongoing"},
    {"id": "p3-5", "name": "Protection Lémuriens", "description": "Monitoring et protection des populations de lémuriens dans la région.", "startDate": "2023-03-01", "status": "completed"},
    {"id": "p3-6", "name": "Plantation Communautaire 2024", "description": "Engagement des communautés locales pour planter 5 000 arbres.", "startDate": "2024-03-01", "status": "planned"},
    {"id": "p3-7", "name": "Formation Guides Écotourisme", "description": "Formation de 20 guides locaux pour promouvoir l''écotourisme durable.", "startDate": "2023-07-01", "status": "completed"},
    {"id": "p3-8", "name": "Restauration Zone Humide", "description": "Réhabilitation d''une zone humide pour la biodiversité aquatique.", "startDate": "2024-05-01", "status": "planned"},
    {"id": "p3-9", "name": "Campagne Anti-Déforestation", "description": "Sensibilisation contre la coupe illégale dans les villages voisins.", "startDate": "2023-11-01", "status": "ongoing"},
    {"id": "p3-10", "name": "Pépinière Endémique", "description": "Création d''une pépinière pour produire 20 000 plants d''arbres endémiques.", "startDate": "2023-02-01", "status": "completed"},
    {"id": "p3-11", "name": "Surveillance Feux de Forêt", "description": "Mise en place d''un système de surveillance pour prévenir les incendies.", "startDate": "2024-06-01", "status": "planned"},
    {"id": "p3-12", "name": "Éducation Jeunes Écologistes", "description": "Programme pour former les jeunes à la conservation environnementale.", "startDate": "2023-08-01", "status": "ongoing"},
    {"id": "p3-13", "name": "Plantation Moramanga", "description": "Plantation de 8 000 arbres dans la région de Moramanga.", "startDate": "2022-11-01", "status": "completed"},
    {"id": "p3-14", "name": "Protection Tortues Terrestres", "description": "Programme de conservation des tortues terrestres endémiques.", "startDate": "2023-05-01", "status": "ongoing"},
    {"id": "p3-15", "name": "Sentier Éducatif Andasibe", "description": "Création d''un sentier éducatif pour sensibiliser les visiteurs à la biodiversité.", "startDate": "2024-07-01", "status": "planned"}
  ]'::jsonb,
  '{
    "totalBudget2023": 120000,
    "fundingSources": [
      {"source": "Fonds environnementaux internationaux", "percentage": 50, "amount": 60000},
      {"source": "Subventions écologiques", "percentage": 30, "amount": 36000},
      {"source": "Dons particuliers et mécénat", "percentage": 15, "amount": 18000},
      {"source": "Écotourisme et ventes pépinière", "percentage": 5, "amount": 6000}
    ],
    "financialReports": [
      {"year": 2023, "url": "https://reboisement-mg.org/rapports/2023.pdf", "audited": true}
    ],
    "allocation": {
      "programs": 80,
      "administration": 12,
      "fundraising": 8
    }
  }'::jsonb,
  '{
    "siret": "345 678 901 00034",
    "registrationDate": "2023-03-05",
    "compliance": {
      "dataProtection": "Conforme RGPD",
      "financialTransparency": "Rapports annuels publics et certifiés"
    }
  }'::jsonb,
  '{
    "totalBeneficiaries": 2500,
    "treesPlanted": 35000,
    "kpis": [
      {"metric": "Arbres plantés (total)", "value": 35000},
      {"metric": "Hectares reboisés", "value": "80 hectares"},
      {"metric": "Espèces endémiques protégées", "value": 12},
      {"metric": "Guides écotourisme formés", "value": 20},
      {"metric": "Villageois sensibilisés", "value": 1500}
    ]
  }'::jsonb,
  '[
    {
      "type": "Crédit carbone",
      "description": "Investissement dans des crédits carbone générés par la reforestation.",
      "minInvestment": 3000,
      "terms": "Rendement indexé sur crédits carbone, durée 10 ans."
    },
    {
      "type": "Parrainage d''arbres",
      "description": "Parrainage participatif pour financer la plantation.",
      "minInvestment": 500,
      "terms": "Certificat de parrainage, suivi annuel des arbres."
    }
  ]'::jsonb,
  '{
    "reportsFrequency": "Annuelle",
    "evaluation": "Évaluations environnementales par experts forestiers indépendants",
    "audits": "Audits écologiques annuels"
  }'::jsonb,
  '2023-03-10T08:30:00Z',
  '2024-10-25T16:20:00Z'
);

-- ============================================
-- PARTIE 6: INSERTION DES USERS MOCK
-- ============================================

INSERT INTO users (
  id, first_name, last_name, email, avatar, bio, location, website, skills, verified, joined_at, stats
) VALUES
(
  gen_random_uuid(),
  'Marius',
  'Razafitsalama',
  'marius@example.com',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  'Développeur passionné par les technologies web et l''aide aux communautés locales. Spécialisé en Laravel, Vue.js et architecture logicielle.',
  'Antananarivo, Madagascar',
  'https://marius-portfolio.com',
  ARRAY['Laravel', 'Vue.js', 'PHP', 'JavaScript', 'Docker'],
  true,
  '2022-01-15T00:00:00Z',
  '{"ongs": 3, "projects": 12, "followers": 156, "following": 89}'::jsonb
),
(
  gen_random_uuid(),
  'Marie',
  'Dubois',
  'marie.dubois@example.com',
  'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
  'Coordinatrice de projets humanitaires avec 8 ans d''expérience dans le développement communautaire.',
  'Fianarantsoa, Madagascar',
  NULL,
  ARRAY['Gestion de projet', 'Développement communautaire', 'Formation'],
  true,
  '2021-03-20T00:00:00Z',
  '{"ongs": 2, "projects": 8, "followers": 234, "following": 45}'::jsonb
);

-- ============================================
-- PARTIE 7: VUES UTILES (OPTIONNEL)
-- ============================================

-- Vue pour statistiques globales ONGs
CREATE OR REPLACE VIEW ongs_stats AS
SELECT 
  category,
  COUNT(*) as total_ongs,
  SUM(volunteers) as total_volunteers,
  AVG(volunteers) as avg_volunteers,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_ongs
FROM ongs
GROUP BY category;

-- Vue pour projets en cours
CREATE OR REPLACE VIEW ongoing_projects AS
SELECT 
  o.id as ong_id,
  o.name as ong_name,
  o.category,
  p.value->>'name' as project_name,
  p.value->>'status' as project_status,
  (p.value->>'budget')::numeric as project_budget
FROM ongs o,
  jsonb_array_elements(o.projects) as p
WHERE p.value->>'status' = 'ongoing';

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Tables créées avec succès!';
  RAISE NOTICE '✅ Index créés avec succès!';
  RAISE NOTICE '✅ 3 ONGs insérées avec succès!';
  RAISE NOTICE '✅ 2 utilisateurs insérés avec succès!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Nombre total d''ONGs: %', (SELECT COUNT(*) FROM ongs);
  RAISE NOTICE '👥 Nombre total d''utilisateurs: %', (SELECT COUNT(*) FROM users);
END $$;