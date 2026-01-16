-- ============================================
-- SCRIPT D'INSERTION DES DONNÉES DE TEST
-- ============================================

-- Nettoyage préalable (optionnel - décommentez si vous voulez réinitialiser)
-- TRUNCATE TABLE donations CASCADE;
-- TRUNCATE TABLE agent_ong_managers CASCADE;
-- TRUNCATE TABLE partner_profiles CASCADE;
-- TRUNCATE TABLE ongs CASCADE;
-- TRUNCATE TABLE accounts CASCADE;

-- ============================================
-- PARTIE 1: INSERTION DES COMPTES (ACCOUNTS)
-- ============================================

-- Comptes user_agent (gestionnaires d'ONG)
INSERT INTO accounts (id, email, password_hash, account_type, first_name, last_name, avatar, bio, location, website, verified, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'marius@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_agent', 'Marius', 'Razafitsalama', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', 'Développeur passionné par les technologies web et l''aide aux communautés locales. Spécialisé en Laravel, Vue.js et architecture logicielle.', 'Antananarivo, Madagascar', 'https://marius-portfolio.com', true, '2022-01-15T00:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'marie.dubois@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_agent', 'Marie', 'Dubois', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200', 'Coordinatrice de projets humanitaires avec 8 ans d''expérience dans le développement communautaire.', 'Fianarantsoa, Madagascar', NULL, true, '2021-03-20T00:00:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'sophie@education-madagascar.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_agent', 'Sophie', 'Randrianarisoa', NULL, 'Directrice Education pour Tous Madagascar', 'Antananarivo, Madagascar', NULL, true, '2022-01-10T00:00:00Z', NOW()),
('44444444-4444-4444-4444-444444444444', 'jean.rakoto@sante-oi.mg', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_agent', 'Jean', 'Rakoto', NULL, 'Coordinateur santé communautaire', 'Toamasina, Madagascar', NULL, true, '2021-06-15T00:00:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'paul@reboisement-mg.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_agent', 'Paul', 'Martin', NULL, 'Responsable projet environnement', 'Andasibe, Madagascar', NULL, true, '2023-03-01T00:00:00Z', NOW());

-- Comptes user_partner (donateurs/partenaires)
INSERT INTO accounts (id, email, password_hash, account_type, first_name, last_name, company_name, avatar, bio, location, website, verified, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'contact@techforgood.mg', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_partner', 'Tech', 'ForGood', 'TechForGood Madagascar', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Entreprise technologique engagée dans la transformation digitale pour le bien social.', 'Antananarivo, Madagascar', 'https://techforgood.mg', true, '2022-01-01T00:00:00Z', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'info@fondation-sante.mg', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_partner', 'Fondation', 'Santé', 'Fondation Santé Madagascar', NULL, 'Fondation dédiée à l''amélioration de l''accès aux soins de santé primaires.', 'Antananarivo, Madagascar', 'https://fondation-sante.mg', true, '2021-01-01T00:00:00Z', NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'jean.rakoto.donor@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_partner', 'Jean', 'Rakoto', NULL, NULL, 'Passionné par la protection de l''environnement et l''éducation des jeunes.', 'Mahajanga, Madagascar', NULL, true, '2022-06-01T00:00:00Z', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'support@greenplanet.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEhZvO', 'user_partner', 'Green', 'Planet', 'Green Planet Foundation', NULL, 'Organisation internationale pour l''environnement', 'International', 'https://greenplanet.org', true, '2020-01-01T00:00:00Z', NOW());

-- ============================================
-- PARTIE 2: INSERTION DES PROFILS PARTENAIRES
-- ============================================

INSERT INTO partner_profiles (account_id, partner_type, company_logo, company_size, industry, preferred_causes, partnership_level, stats, visibility_settings, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'company', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', '51-200', 'Technology', ARRAY['education', 'social'], 'gold', '{
  "totalDonated": 12000,
  "donationsCount": 12,
  "ongsSupported": 3,
  "firstDonationDate": "2022-02-01T00:00:00Z",
  "lastDonationDate": "2024-11-01T00:00:00Z"
}'::jsonb, '{
  "showProfile": true,
  "showDonations": true,
  "showAmount": false,
  "showCompanyLogo": true
}'::jsonb, '2022-01-01T00:00:00Z', NOW()),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'foundation', NULL, '11-50', 'Healthcare', ARRAY['health', 'social'], 'platinum', '{
  "totalDonated": 50000,
  "donationsCount": 8,
  "ongsSupported": 4,
  "firstDonationDate": "2021-02-01T00:00:00Z",
  "lastDonationDate": "2024-10-15T00:00:00Z"
}'::jsonb, '{
  "showProfile": true,
  "showDonations": true,
  "showAmount": true,
  "showCompanyLogo": true
}'::jsonb, '2021-01-01T00:00:00Z', NOW()),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'individual', NULL, NULL, NULL, ARRAY['environment', 'education'], 'silver', '{
  "totalDonated": 2400,
  "donationsCount": 12,
  "ongsSupported": 2,
  "firstDonationDate": "2022-07-01T00:00:00Z",
  "lastDonationDate": "2024-11-01T00:00:00Z"
}'::jsonb, '{
  "showProfile": false,
  "showDonations": false,
  "showAmount": false,
  "showCompanyLogo": false
}'::jsonb, '2022-06-01T00:00:00Z', NOW()),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'foundation', NULL, '201-500', 'Environmental Conservation', ARRAY['environment'], 'platinum', '{
  "totalDonated": 150000,
  "donationsCount": 15,
  "ongsSupported": 8,
  "firstDonationDate": "2020-03-01T00:00:00Z",
  "lastDonationDate": "2024-11-10T00:00:00Z"
}'::jsonb, '{
  "showProfile": true,
  "showDonations": true,
  "showAmount": true,
  "showCompanyLogo": true
}'::jsonb, '2020-01-01T00:00:00Z', NOW());

-- ============================================
-- PARTIE 3: INSERTION DES ONGs
-- ============================================

-- ONG 1: Éducation pour Tous Madagascar
INSERT INTO ongs (id, account_id, name, description, category, status, location, image, volunteers, email, phone, website, projects, financials, legal, impact, donation_opportunities, monitoring, created_at, updated_at) VALUES
('10000000-1000-1000-1000-100000000001', '33333333-3333-3333-3333-333333333333', 'Éducation pour Tous Madagascar', 
'Organisation dédiée à l''amélioration de l''accès à l''éducation dans les zones rurales de Madagascar. Nous construisons des écoles, formons des enseignants et promouvons l''éducation inclusive.',
'education', 'active', 'Antananarivo, Madagascar', 
'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400', 
245, 'contact@education-madagascar.org', '+261 34 12 345 67', 'https://education-madagascar.org',
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
'2022-01-15T10:00:00Z', '2024-10-30T15:30:00Z');

-- ONG 2: Santé Communautaire Océan Indien
INSERT INTO ongs (id, account_id, name, description, category, status, location, image, volunteers, email, phone, website, projects, financials, legal, impact, investment_opportunities, monitoring, created_at, updated_at) VALUES
('20000000-2000-2000-2000-200000000002', '44444444-4444-4444-4444-444444444444', 'Santé Communautaire Océan Indien',
'Amélioration des soins de santé primaires dans les communautés isolées. Programme de vaccination et de sensibilisation sanitaire.',
'health', 'active', 'Toamasina, Madagascar',
'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
156, 'info@sante-oi.mg', '+261 32 98 765 43', 'https://sante-oi.mg',
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
'2021-06-20T14:15:00Z', '2024-10-28T09:45:00Z');

-- ONG 3: Reboisement Vert Madagascar
INSERT INTO ongs (id, account_id, name, description, category, status, location, image, volunteers, email, phone, projects, financials, legal, impact, investment_opportunities, monitoring, created_at, updated_at) VALUES
('30000000-3000-3000-3000-300000000003', '55555555-5555-5555-5555-555555555555', 'Reboisement Vert Madagascar',
'Protection et restauration des forêts malgaches. Plantation d''arbres endémiques et sensibilisation environnementale.',
'environment', 'active', 'Andasibe, Madagascar',
'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
89, 'contact@reboisement-mg.org', '+261 33 44 556 78',
'[
  {"id": "p3-1", "name": "Plantation Andasibe 2023", "description": "Plantation de 10 000 arbres endémiques dans la région d''Andasibe.", "startDate": "2023-04-01", "status": "completed"},
  {"id": "p3-2", "name": "Sensibilisation Écoles 2023", "description": "Ateliers environnementaux dans 15 écoles primaires pour promouvoir la conservation.", "startDate": "2023-06-15", "status": "completed"},
  {"id": "p3-3", "name": "Corridor Écologique Mantadia", "description": "Création d''un corridor écologique pour relier les habitats de la faune.", "startDate": "2023-09-01", "status": "ongoing"},
  {"id": "p3-4", "name": "Reforestation Analamazaotra", "description": "Restauration de 50 hectares de forêt dégradée à Analamazaotra.", "startDate": "2024-01-10", "status": "ongoing"},
  {"id": "p3-5", "name": "Protection Lémuriens", "description": "Monitoring et protection des populations de lémuriens dans la région.", "startDate": "2023-03-01", "status": "completed"}
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
'2023-03-10T08:30:00Z', '2024-10-25T16:20:00Z');

-- Ajout de quelques ONGs supplémentaires (versions simplifiées)
INSERT INTO ongs (id, account_id, name, description, category, status, location, volunteers, email, phone, created_at, updated_at) VALUES
('40000000-4000-4000-4000-400000000004', '11111111-1111-1111-1111-111111111111', 'Solidarité Urbaine Tana', 'Aide aux familles défavorisées d''Antananarivo. Distribution de nourriture, vêtements et accompagnement social.', 'social', 'pending', 'Antananarivo, Madagascar', 67, 'aide@solidarite-tana.mg', '+261 34 77 889 90', '2024-01-05T12:00:00Z', '2024-10-20T11:15:00Z'),
('50000000-5000-5000-5000-500000000005', '22222222-2222-2222-2222-222222222222', 'Culture et Patrimoine Malagasy', 'Préservation et promotion de la culture traditionnelle malgache. Organisation d''événements culturels et formation artistique.', 'culture', 'active', 'Fianarantsoa, Madagascar', 134, 'culture@patrimoine-mg.org', NULL, '2022-09-12T16:45:00Z', '2024-10-22T14:30:00Z');

-- ============================================
-- PARTIE 4: INSERTION DES GESTIONNAIRES D'ONG
-- ============================================

-- Propriétaires automatiques (créateurs des ONGs)
INSERT INTO agent_ong_managers (agent_account_id, ong_id, role, permissions, granted_at) VALUES
('33333333-3333-3333-3333-333333333333', '10000000-1000-1000-1000-100000000001', 'owner', '{
  "manageProjects": true,
  "manageDonations": true,
  "manageVolunteers": true,
  "editOngProfile": true,
  "viewAnalytics": true,
  "manageBudget": true,
  "inviteManagers": true
}'::jsonb, '2022-01-15T00:00:00Z'),

('44444444-4444-4444-4444-444444444444', '20000000-2000-2000-2000-200000000002', 'owner', '{
  "manageProjects": true,
  "manageDonations": true,
  "manageVolunteers": true,
  "editOngProfile": true,
  "viewAnalytics": true,
  "manageBudget": true,
  "inviteManagers": true
}'::jsonb, '2021-06-20T00:00:00Z'),

('55555555-5555-5555-5555-555555555555', '30000000-3000-3000-3000-300000000003', 'owner', '{
  "manageProjects": true,
  "manageDonations": true,
  "manageVolunteers": true,
  "editOngProfile": true,
  "viewAnalytics": true,
  "manageBudget": true,
  "inviteManagers": true
}'::jsonb, '2023-03-10T00:00:00Z'),

('11111111-1111-1111-1111-111111111111', '40000000-4000-4000-4000-400000000004', 'owner', '{
  "manageProjects": true,
  "manageDonations": true,
  "manageVolunteers": true,
  "editOngProfile": true,
  "viewAnalytics": true,
  "manageBudget": true,
  "inviteManagers": true
}'::jsonb, '2024-01-05T00:00:00Z'),

('22222222-2222-2222-2222-222222222222', '50000000-5000-5000-5000-500000000005', 'owner', '{
  "manageProjects": true,
  "manageDonations": true,
  "manageVolunteers": true,
  "editOngProfile": true,
  "viewAnalytics": true,
  "manageBudget": true,
  "inviteManagers": true
}'::jsonb, '2022-09-12T00:00:00Z');

-- Ajout de gestionnaires collaborateurs
INSERT INTO agent_ong_managers (agent_account_id, ong_id, role, permissions, granted_at) VALUES
('11111111-1111-1111-1111-111111111111', '10000000-1000-1000-1000-100000000001', 'admin', '{
  "manageProjects": true,
  "manageDonations": true,
  "manageVolunteers": true,
  "editOngProfile": true,
  "viewAnalytics": true,
  "manageBudget": false,
  "inviteManagers": false
}'::jsonb, '2022-03-01T00:00:00Z'),

('22222222-2222-2222-2222-222222222222', '20000000-2000-2000-2000-200000000002', 'editor', '{
  "manageProjects": true,
  "manageDonations": false,
  "manageVolunteers": true,
  "editOngProfile": false,
  "viewAnalytics": true,
  "manageBudget": false,
  "inviteManagers": false
}'::jsonb, '2022-01-15T00:00:00Z');

-- ============================================
-- PARTIE 5: INSERTION DES DONATIONS
-- ============================================

-- Donations de TechForGood Madagascar (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa) 
INSERT INTO donations (donor_account_id, ong_id, amount, type, status, payment_method, transaction_id, metadata, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', 1000, 'monthly', 'completed', 'bank_transfer', 'TXN-001-2024-01', '{"anonymous": false, "publicMessage": "Fiers de soutenir l''éducation pour tous!", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-01-15T10:00:00Z'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', 1000, 'monthly', 'completed', 'bank_transfer', 'TXN-002-2024-02', '{"anonymous": false, "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-02-15T10:00:00Z'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', 1000, 'monthly', 'completed', 'bank_transfer', 'TXN-003-2024-03', '{"anonymous": false, "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-03-15T10:00:00Z'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', 1000, 'monthly', 'completed', 'bank_transfer', 'TXN-004-2024-04', '{"anonymous": false, "taxReceiptRequested": true, "taxReceiptSent": false, "recognitionType": "company_name"}'::jsonb, '2024-04-15T10:00:00Z'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '20000000-2000-2000-2000-200000000002', 500, 'one-time', 'completed', 'card', 'TXN-005-2024-05', '{"anonymous": false, "publicMessage": "Soutien à la santé communautaire", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-05-10T14:30:00Z'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '30000000-3000-3000-3000-300000000003', 2000, 'project-based', 'completed', 'bank_transfer', 'TXN-006-2024-06', '{"anonymous": false, "publicMessage": "Pour la reforestation!", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-06-20T09:15:00Z');

-- Donations de Fondation Santé Madagascar (bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb)
INSERT INTO donations (donor_account_id, ong_id, amount, type, status, payment_method, transaction_id, metadata, created_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '20000000-2000-2000-2000-200000000002', 10000, 'annual', 'completed', 'bank_transfer', 'TXN-007-2024-01', '{"anonymous": false, "publicMessage": "Partenariat pour la santé 2024", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-01-05T11:00:00Z'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '20000000-2000-2000-2000-200000000002', 5000, 'one-time', 'completed', 'bank_transfer', 'TXN-008-2024-03', '{"anonymous": false, "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-03-10T15:45:00Z'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-1000-1000-1000-100000000001', 3000, 'one-time', 'completed', 'bank_transfer', 'TXN-009-2024-07', '{"anonymous": false, "publicMessage": "Soutien à l''éducation", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-07-15T10:20:00Z');

-- Donations de Jean Rakoto (cccccccc-cccc-cccc-cccc-cccccccccccc) - individu
INSERT INTO donations (donor_account_id, ong_id, amount, type, status, payment_method, transaction_id, metadata, created_at) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '30000000-3000-3000-3000-300000000003', 200, 'monthly', 'completed', 'card', 'TXN-010-2024-01', '{"anonymous": true, "taxReceiptRequested": false, "taxReceiptSent": false, "recognitionType": "anonymous"}'::jsonb, '2024-01-01T08:00:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '30000000-3000-3000-3000-300000000003', 200, 'monthly', 'completed', 'card', 'TXN-011-2024-02', '{"anonymous": true, "taxReceiptRequested": false, "taxReceiptSent": false, "recognitionType": "anonymous"}'::jsonb, '2024-02-01T08:00:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '30000000-3000-3000-3000-300000000003', 200, 'monthly', 'completed', 'card', 'TXN-012-2024-03', '{"anonymous": true, "taxReceiptRequested": false, "taxReceiptSent": false, "recognitionType": "anonymous"}'::jsonb, '2024-03-01T08:00:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '30000000-3000-3000-3000-300000000003', 200, 'monthly', 'completed', 'card', 'TXN-013-2024-04', '{"anonymous": true, "taxReceiptRequested": false, "taxReceiptSent": false, "recognitionType": "anonymous"}'::jsonb, '2024-04-01T08:00:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000001', 50, 'one-time', 'completed', 'mobile_money', 'TXN-014-2024-09', '{"anonymous": true, "taxReceiptRequested": false, "taxReceiptSent": false, "recognitionType": "anonymous"}'::jsonb, '2024-09-15T12:30:00Z');

-- Donations de Green Planet Foundation (dddddddd-dddd-dddd-dddd-dddddddddddd)
INSERT INTO donations (donor_account_id, ong_id, amount, type, status, payment_method, transaction_id, metadata, created_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '30000000-3000-3000-3000-300000000003', 50000, 'annual', 'completed', 'bank_transfer', 'TXN-015-2024-01', '{"anonymous": false, "publicMessage": "Partnership for environmental conservation 2024", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-01-10T10:00:00Z'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '30000000-3000-3000-3000-300000000003', 25000, 'project-based', 'completed', 'bank_transfer', 'TXN-016-2024-05', '{"anonymous": false, "publicMessage": "Special funding for reforestation project", "taxReceiptRequested": true, "taxReceiptSent": true, "recognitionType": "company_name"}'::jsonb, '2024-05-20T14:00:00Z');

-- Donations en attente
INSERT INTO donations (donor_account_id, ong_id, amount, type, status, payment_method, transaction_id, metadata, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', 1000, 'monthly', 'pending', 'bank_transfer', 'TXN-017-2024-12', '{"anonymous": false, "taxReceiptRequested": true, "taxReceiptSent": false, "recognitionType": "company_name"}'::jsonb, '2024-12-01T09:00:00Z'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '30000000-3000-3000-3000-300000000003', 200, 'monthly', 'pending', 'card', 'TXN-018-2024-12', '{"anonymous": true, "taxReceiptRequested": false, "taxReceiptSent": false, "recognitionType": "anonymous"}'::jsonb, '2024-12-01T08:00:00Z');

-- ============================================
-- PARTIE 6: VÉRIFICATION DES DONNÉES
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Données insérées avec succès!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Résumé:';
  RAISE NOTICE '   - Comptes (accounts): %', (SELECT COUNT(*) FROM accounts);
  RAISE NOTICE '   - Agents: %', (SELECT COUNT(*) FROM accounts WHERE account_type = 'user_agent');
  RAISE NOTICE '   - Partenaires: %', (SELECT COUNT(*) FROM accounts WHERE account_type = 'user_partner');
  RAISE NOTICE '   - Profils partenaires: %', (SELECT COUNT(*) FROM partner_profiles);
  RAISE NOTICE '   - ONGs: %', (SELECT COUNT(*) FROM ongs);
  RAISE NOTICE '   - Gestionnaires d''ONG: %', (SELECT COUNT(*) FROM agent_ong_managers);
  RAISE NOTICE '   - Donations: %', (SELECT COUNT(*) FROM donations);
  RAISE NOTICE '   - Donations complétées: %', (SELECT COUNT(*) FROM donations WHERE status = 'completed');
  RAISE NOTICE '   - Total dons: % Ar', (SELECT SUM(amount) FROM donations WHERE status = 'completed');
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Top 3 ONGs par montant de dons:';
END $$;

SELECT 
  o.name,
  COUNT(d.id) as nb_donations,
  COALESCE(SUM(d.amount), 0) as total_donated
FROM ongs o
LEFT JOIN donations d ON o.id = d.ong_id AND d.status = 'completed'
GROUP BY o.id, o.name
ORDER BY total_donated DESC
LIMIT 3;

-- ============================================
-- FIN DU SCRIPT D'INSERTION
-- ============================================