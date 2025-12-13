import { ONG, OngStats } from "../type"


// Mock data
export const mockOngs: ONG[] = [
  {
    id: '1',
    name: 'Éducation pour Tous Madagascar',
    description: 'Organisation dédiée à l\'amélioration de l\'accès à l\'éducation dans les zones rurales de Madagascar. Nous construisons des écoles, formons des enseignants et promouvons l\'éducation inclusive.',
    category: 'education',
    status: 'active',
    location: 'Antananarivo, Madagascar',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400',
    volunteers: 245,
    projects: [
      { id: 'p1-1', name: 'Construction École Antsirabe', description: 'Construction d\'une école primaire à Antsirabe.', startDate: '2022-03-01', status: 'completed', impact: '500 élèves scolarisés', budget: 50000 },
      { id: 'p1-2', name: 'Formation Enseignants 2023', description: 'Programme de formation pour 50 enseignants.', startDate: '2023-01-15', status: 'ongoing', impact: '50 enseignants formés, 2000 élèves impactés', budget: 25000 },
      { id: 'p1-3', name: 'Bibliothèque Mobile', description: 'Mise en place d\'une bibliothèque itinérante.', startDate: '2023-06-01', status: 'planned', impact: '1000 bénéficiaires attendus', budget: 15000 },
      { id: 'p1-4', name: 'École Secondaire Fianarantsoa', description: 'Construction d\'une école secondaire.', startDate: '2024-02-01', status: 'ongoing', impact: '300 élèves attendus', budget: 75000 },
      { id: 'p1-5', name: 'Ateliers Numériques', description: 'Introduction aux compétences numériques.', startDate: '2022-09-01', status: 'completed', impact: '200 élèves formés', budget: 10000 },
      { id: 'p1-6', name: 'Bourses Scolaires 2024', description: 'Bourses pour élèves défavorisés.', startDate: '2024-01-10', status: 'planned', impact: '100 élèves soutenus', budget: 20000 },
      { id: 'p1-7', name: 'Renforcement Capacités', description: 'Formation continue des enseignants.', startDate: '2023-04-01', status: 'ongoing', impact: '30 enseignants formés', budget: 18000 },
      { id: 'p1-8', name: 'École Rurale Ambatolampy', description: 'Construction d\'une école rurale.', startDate: '2022-11-01', status: 'completed', impact: '400 élèves scolarisés', budget: 45000 },
      { id: 'p1-9', name: 'Programme Alphabétisation', description: 'Cours d\'alphabétisation pour adultes.', startDate: '2023-07-01', status: 'ongoing', impact: '150 adultes alphabétisés', budget: 12000 },
      { id: 'p1-10', name: 'Équipements Scolaires', description: 'Fourniture de matériel scolaire.', startDate: '2024-03-01', status: 'planned', impact: '1000 élèves équipés', budget: 8000 },
      { id: 'p1-11', name: 'Ateliers Pédagogiques', description: 'Ateliers pour enseignants.', startDate: '2022-05-01', status: 'completed', impact: '40 enseignants formés', budget: 9000 },
      { id: 'p1-12', name: 'Éducation Inclusive', description: 'Programme pour enfants handicapés.', startDate: '2024-05-01', status: 'ongoing', impact: '50 enfants intégrés', budget: 22000 }
    ],
    email: 'contact@education-madagascar.org',
    phone: '+261 34 12 345 67',
    website: 'https://education-madagascar.org',
    createdAt: '2022-01-15T10:00:00Z',
    updatedAt: '2024-10-30T15:30:00Z',
    financials: {
      totalBudget2023: 250000,
      fundingSources: [
        { source: 'Subventions publiques', percentage: 58, amount: 145000 },
        { source: 'Dons privés et fondations', percentage: 30, amount: 75000 },
        { source: 'Financement participatif', percentage: 10, amount: 25000 },
        { source: 'Investissements institutionnels', percentage: 2, amount: 5000 }
      ],
      financialReports: [
        { year: 2022, url: 'https://education-madagascar.org/reports/2022.pdf', audited: true },
        { year: 2023, url: 'https://education-madagascar.org/reports/2023.pdf', audited: true }
      ],
      allocation: {
        programs: 70,
        administration: 20,
        fundraising: 10
      }
    },
    legal: {
      siret: '123 456 789 00012',
      registrationDate: '2022-01-10',
      compliance: {
        dataProtection: 'Conforme RGPD',
        financialTransparency: 'Audits annuels réalisés par cabinet indépendant'
      }
    },
    impact: {
      totalBeneficiaries: 5000,
      schoolsBuilt: 3,
      teachersTrained: 120,
      kpis: [
        { metric: 'Taux de scolarisation', value: '85% dans les zones ciblées' },
        { metric: 'Nombre d\’élèves soutenus', value: 2000 },
        { metric: 'Taux d\’alphabétisation adulte', value: '60% dans les programmes' }
      ]
    },
    donationOpportunities: [
      {
        type: 'Don ponctuel',
        description: 'Don unique pour soutenir la construction d\'écoles, l\'achat de matériel pédagogique ou une urgence locale. Aidez directement les bénéficiaires sans attendre de retour financier.',
        minAmount: 20,
        benefits: 'Remerciement personnalisé et rapport d\'impact sur l\'utilisation des fonds.'
      },
      {
        type: 'Don mensuel',
        description: 'Soutien récurrent pour assurer la pérennité des programmes éducatifs, des bourses et des activités quotidiennes.',
        minAmount: 5,
        benefits: 'Mises à jour régulières sur l\'impact, priorité pour participer aux événements et transparence sur l\'utilisation des dons.'
      },
      {
        type: 'Parrainage de projet',
        description: 'Soutenez un projet précis (ex : construction d\'une classe, bourses pour élèves) et suivez son avancement étape par étape.',
        minAmount: 200,
        benefits: 'Rapports d\'avancement, photos et mentions de remerciement dans les communications publiques.'
      }
    ],
    monitoring: {
      reportsFrequency: 'Trimestrielle',
      evaluation: "Évaluations d\’impact annuelles par des experts indépendants",
      audits: 'Annuels, réalisés par cabinet externe'
    }
  },

  {
    id: '2',
    name: 'Santé Communautaire Océan Indien',
    description: 'Amélioration des soins de santé primaires dans les communautés isolées. Programme de vaccination et de sensibilisation sanitaire.',
    category: 'health',
    status: 'active',
    location: 'Toamasina, Madagascar',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    volunteers: 156,
    projects: [
      { id: 'p2-1', name: 'Campagne Vaccination 2023', description: 'Vaccination contre la rougeole dans les villages.', startDate: '2023-06-01', status: 'completed', impact: '3000 enfants vaccinés', budget: 35000 },
      { id: 'p2-2', name: 'Sensibilisation Hygiène', description: 'Ateliers sur l\'hygiène communautaire.', startDate: '2024-02-01', status: 'ongoing', impact: '500 familles formées', budget: 12000 },
      { id: 'p2-3', name: 'Centre de Santé Mobile', description: 'Unité mobile pour soins primaires.', startDate: '2022-08-01', status: 'completed', impact: '5000 consultations réalisées', budget: 80000 },
      { id: 'p2-4', name: 'Programme Nutrition', description: 'Distribution de compléments alimentaires.', startDate: '2023-03-01', status: 'ongoing', impact: '1200 enfants bénéficiaires', budget: 45000 },
      { id: 'p2-5', name: 'Dépistage Malaria', description: 'Campagne de dépistage dans les zones à risque.', startDate: '2024-01-15', status: 'planned', impact: '2000 personnes ciblées', budget: 25000 },
      { id: 'p2-6', name: 'Formation Infirmiers', description: 'Formation pour personnel médical local.', startDate: '2022-10-01', status: 'completed', impact: '60 infirmiers formés', budget: 30000 },
      { id: 'p2-7', name: 'Santé Maternelle', description: 'Suivi prénatal dans les villages.', startDate: '2023-09-01', status: 'ongoing', impact: '800 femmes suivies', budget: 40000 },
      { id: 'p2-8', name: 'Accès Eau Potable', description: 'Installation de points d\'eau.', startDate: '2024-04-01', status: 'planned', impact: '10 villages équipés', budget: 60000 }
    ],
    email: 'info@sante-oi.mg',
    phone: '+261 32 98 765 43',
    website: 'https://sante-oi.mg',
    createdAt: '2021-06-20T14:15:00Z',
    updatedAt: '2024-10-28T09:45:00Z',
    financials: {
      totalBudget2023: 180000,
      fundingSources: [
        { source: 'OMS et organismes internationaux', percentage: 45, amount: 81000 },
        { source: 'Subventions gouvernementales', percentage: 35, amount: 63000 },
        { source: 'Dons privés', percentage: 15, amount: 27000 },
        { source: 'Partenariats pharmaceutiques', percentage: 5, amount: 9000 }
      ],
      financialReports: [
        { year: 2022, url: 'https://sante-oi.mg/reports/2022.pdf', audited: true },
        { year: 2023, url: 'https://sante-oi.mg/reports/2023.pdf', audited: true }
      ],
      allocation: {
        programs: 75,
        administration: 18,
        fundraising: 7
      }
    },
    legal: {
      siret: '234 567 890 00023',
      registrationDate: '2021-06-15',
      compliance: {
        dataProtection: 'Conforme RGPD - Protection données médicales',
        financialTransparency: 'Audits annuels certifiés par expert-comptable'
      }
    },
    impact: {
      totalBeneficiaries: 8000,
      healthcareProvided: 5000,
      kpis: [
        { metric: 'Taux de vaccination', value: '78% dans les zones ciblées' },
        { metric: 'Consultations médicales', value: 5000 },
        { metric: 'Personnel médical formé', value: 60 },
        { metric: 'Réduction mortalité infantile', value: '-12% dans les zones d\'intervention' }
      ]
    },
    investmentOpportunities: [
      {
        type: 'Obligations sanitaires',
        description: 'Titres pour financement d\'équipements médicaux.',
        minInvestment: 2000,
        terms: 'Rendement 2.5% sur 5 ans, remboursement à l\'échéance.'
      },
      {
        type: 'Partenariat clinique',
        description: 'Co-financement de centres de santé.',
        minInvestment: 15000,
        terms: 'Visibilité partenaire, rapports semestriels.'
      }
    ],
    monitoring: {
      reportsFrequency: 'Semestrielle',
      evaluation: 'Évaluations d\'impact sanitaire par experts OMS',
      audits: 'Annuels, certification ISO santé'
    }
  },
  {
    id: '3',
    name: 'Reboisement Vert Madagascar',
    description: 'Protection et restauration des forêts malgaches. Plantation d\'arbres endémiques et sensibilisation environnementale.',
    category: 'environment',
    status: 'active',
    location: 'Andasibe, Madagascar',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    volunteers: 89,
    projects: [
      {
        id: 'p3-1',
        name: 'Plantation Andasibe 2023',
        description: 'Plantation de 10 000 arbres endémiques dans la région d\'Andasibe.',
        startDate: '2023-04-01',
        status: 'completed'
      },
      {
        id: 'p3-2',
        name: 'Sensibilisation Écoles 2023',
        description: 'Ateliers environnementaux dans 15 écoles primaires pour promouvoir la conservation.',
        startDate: '2023-06-15',
        status: 'completed'
      },
      {
        id: 'p3-3',
        name: 'Corridor Écologique Mantadia',
        description: 'Création d\'un corridor écologique pour relier les habitats de la faune.',
        startDate: '2023-09-01',
        status: 'ongoing'
      },
      {
        id: 'p3-4',
        name: 'Reforestation Analamazaotra',
        description: 'Restauration de 50 hectares de forêt dégradée à Analamazaotra.',
        startDate: '2024-01-10',
        status: 'ongoing'
      },
      {
        id: 'p3-5',
        name: 'Protection Lémuriens',
        description: 'Monitoring et protection des populations de lémuriens dans la région.',
        startDate: '2023-03-01',
        status: 'completed'
      },
      {
        id: 'p3-6',
        name: 'Plantation Communautaire 2024',
        description: 'Engagement des communautés locales pour planter 5 000 arbres.',
        startDate: '2024-03-01',
        status: 'planned'
      },
      {
        id: 'p3-7',
        name: 'Formation Guides Écotourisme',
        description: 'Formation de 20 guides locaux pour promouvoir l\'écotourisme durable.',
        startDate: '2023-07-01',
        status: 'completed'
      },
      {
        id: 'p3-8',
        name: 'Restauration Zone Humide',
        description: 'Réhabilitation d\'une zone humide pour la biodiversité aquatique.',
        startDate: '2024-05-01',
        status: 'planned'
      },
      {
        id: 'p3-9',
        name: 'Campagne Anti-Déforestation',
        description: 'Sensibilisation contre la coupe illégale dans les villages voisins.',
        startDate: '2023-11-01',
        status: 'ongoing'
      },
      {
        id: 'p3-10',
        name: 'Pépinière Endémique',
        description: 'Création d\'une pépinière pour produire 20 000 plants d\'arbres endémiques.',
        startDate: '2023-02-01',
        status: 'completed'
      },
      {
        id: 'p3-11',
        name: 'Surveillance Feux de Forêt',
        description: 'Mise en place d\'un système de surveillance pour prévenir les incendies.',
        startDate: '2024-06-01',
        status: 'planned'
      },
      {
        id: 'p3-12',
        name: 'Éducation Jeunes Écologistes',
        description: 'Programme pour former les jeunes à la conservation environnementale.',
        startDate: '2023-08-01',
        status: 'ongoing'
      },
      {
        id: 'p3-13',
        name: 'Plantation Moramanga',
        description: 'Plantation de 8 000 arbres dans la région de Moramanga.',
        startDate: '2022-11-01',
        status: 'completed'
      },
      {
        id: 'p3-14',
        name: 'Protection Tortues Terrestres',
        description: 'Programme de conservation des tortues terrestres endémiques.',
        startDate: '2023-05-01',
        status: 'ongoing'
      },
      {
        id: 'p3-15',
        name: 'Sentier Éducatif Andasibe',
        description: 'Création d\'un sentier éducatif pour sensibiliser les visiteurs à la biodiversité.',
        startDate: '2024-07-01',
        status: 'planned'
      }
    ],
    email: 'contact@reboisement-mg.org',
    phone: '+261 33 44 556 78',
    createdAt: '2023-03-10T08:30:00Z',
    updatedAt: '2024-10-25T16:20:00Z',
    financials: {
      totalBudget2023: 120000,
      fundingSources: [
        { source: 'Fonds environnementaux internationaux', percentage: 50, amount: 60000 },
        { source: 'Subventions écologiques', percentage: 30, amount: 36000 },
        { source: 'Dons particuliers et mécénat', percentage: 15, amount: 18000 },
        { source: 'Écotourisme et ventes pépinière', percentage: 5, amount: 6000 }
      ],
      financialReports: [
        { year: 2023, url: 'https://reboisement-mg.org/rapports/2023.pdf', audited: true }
      ],
      allocation: {
        programs: 80,
        administration: 12,
        fundraising: 8
      }
    },
    legal: {
      siret: '345 678 901 00034',
      registrationDate: '2023-03-05',
      compliance: {
        dataProtection: 'Conforme RGPD',
        financialTransparency: 'Rapports annuels publics et certifiés'
      }
    },
    impact: {
      totalBeneficiaries: 2500,
      treesPlanted: 35000,
      kpis: [
        { metric: 'Arbres plantés (total)', value: 35000 },
        { metric: 'Hectares reboisés', value: '80 hectares' },
        { metric: 'Espèces endémiques protégées', value: 12 },
        { metric: 'Guides écotourisme formés', value: 20 },
        { metric: 'Villageois sensibilisés', value: 1500 }
      ]
    },
    investmentOpportunities: [
      {
        type: 'Crédit carbone',
        description: 'Investissement dans des crédits carbone générés par la reforestation.',
        minInvestment: 3000,
        terms: 'Rendement indexé sur crédits carbone, durée 10 ans.'
      },
      {
        type: 'Parrainage d\'arbres',
        description: 'Parrainage participatif pour financer la plantation.',
        minInvestment: 500,
        terms: 'Certificat de parrainage, suivi annuel des arbres.'
      }
    ],
    monitoring: {
      reportsFrequency: 'Annuelle',
      evaluation: 'Évaluations environnementales par experts forestiers indépendants',
      audits: 'Audits écologiques annuels'
    }
  },
  {
    id: '4',
    name: 'Solidarité Urbaine Tana',
    description: 'Aide aux familles défavorisées d\'Antananarivo. Distribution de nourriture, vêtements et accompagnement social.',
    category: 'social',
    status: 'pending',
    location: 'Antananarivo, Madagascar',
    volunteers: 67,
    projects: [
      {
        id: 'p4-1',
        name: 'Distribution Alimentaire 2024',
        description: 'Distribution de paniers alimentaires à 200 familles défavorisées dans les quartiers d\'Antananarivo.',
        startDate: '2024-03-01',
        status: 'completed'
      },
      {
        id: 'p4-2',
        name: 'Collecte de Vêtements Hiver',
        description: 'Collecte et distribution de vêtements chauds pour les familles sans abri avant la saison froide.',
        startDate: '2024-06-01',
        status: 'ongoing'
      },
      {
        id: 'p4-3',
        name: 'Accompagnement Social Femmes',
        description: 'Programme d\'accompagnement social pour les femmes en situation de précarité.',
        startDate: '2024-09-01',
        status: 'planned'
      },
      {
        id: 'p4-4',
        name: 'Ateliers Réinsertion',
        description: 'Ateliers de formation professionnelle pour les jeunes défavorisés d\'Antananarivo.',
        startDate: '2024-11-01',
        status: 'planned'
      },
      {
        id: 'p4-5',
        name: 'Aide d\'Urgence Logement',
        description: 'Fourniture de matériel pour réparer les abris de familles vulnérables.',
        startDate: '2024-07-15',
        status: 'ongoing'
      }
    ],
    email: 'aide@solidarite-tana.mg',
    phone: '+261 34 77 889 90',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-10-20T11:15:00Z'
  },
  {
    id: '5',
    name: 'Culture et Patrimoine Malagasy',
    description: 'Préservation et promotion de la culture traditionnelle malgache. Organisation d\'événements culturels et formation artistique.',
    category: 'culture',
    status: 'active',
    location: 'Fianarantsoa, Madagascar',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    volunteers: 134,
    projects: [
      {
        id: 'p5-1',
        name: 'Festival Culturel Fianarantsoa 2023',
        description: 'Organisation d\'un festival annuel mettant en valeur la musique et la danse traditionnelles malgaches.',
        startDate: '2023-05-01',
        status: 'completed'
      },
      {
        id: 'p5-2',
        name: 'Atelier Sculpture sur Bois',
        description: 'Formation de 30 artisans à la sculpture traditionnelle malgache.',
        startDate: '2023-03-15',
        status: 'completed'
      },
      {
        id: 'p5-3',
        name: 'Exposition Patrimoine Oral',
        description: 'Collecte et exposition d\'histoires orales des communautés Betsileo.',
        startDate: '2023-09-01',
        status: 'ongoing'
      },
      {
        id: 'p5-4',
        name: 'Formation Danse Traditionnelle',
        description: 'Ateliers pour enseigner les danses malgaches aux jeunes de Fianarantsoa.',
        startDate: '2024-02-01',
        status: 'ongoing'
      },
      {
        id: 'p5-5',
        name: 'Restauration Artisanat Textile',
        description: 'Projet de préservation des techniques de tissage traditionnel malgache.',
        startDate: '2023-07-01',
        status: 'completed'
      },
      {
        id: 'p5-6',
        name: 'Festival des Arts 2024',
        description: 'Organisation d\'un festival multi-arts pour promouvoir les talents locaux.',
        startDate: '2024-06-01',
        status: 'planned'
      },
      {
        id: 'p5-7',
        name: 'Archive Numérique Culturelle',
        description: 'Création d\'une plateforme numérique pour archiver la musique et les contes malgaches.',
        startDate: '2024-01-15',
        status: 'ongoing'
      },
      {
        id: 'p5-8',
        name: 'Atelier Peinture Traditionnelle',
        description: 'Formation de jeunes artistes aux techniques de peinture malgache.',
        startDate: '2023-11-01',
        status: 'completed'
      },
      {
        id: 'p5-9',
        name: 'Journées du Patrimoine Malagasy',
        description: 'Événement pour sensibiliser à la préservation des sites culturels à Fianarantsoa.',
        startDate: '2024-09-01',
        status: 'planned'
      }
    ],
    email: 'culture@patrimoine-mg.org',
    website: 'https://patrimoine-mg.org',
    createdAt: '2022-09-12T16:45:00Z',
    updatedAt: '2024-10-22T14:30:00Z'
  },
  {
    id: '6',
    name: 'Eau Pure pour Villages',
    description: 'Construction de puits et systèmes d\'assainissement dans les villages ruraux. Amélioration de l\'accès à l\'eau potable.',
    category: 'health',
    status: 'active',
    location: 'Mahajanga, Madagascar',
    volunteers: 78,
    projects: [
      { id: 'p6-1', name: 'Construction Puits Ambato', description: 'Construction d\'un puits communautaire à Ambato.', startDate: '2022-04-10', status: 'completed' },
      { id: 'p6-2', name: 'Système Assainissement Ampasindava', description: 'Installation de latrines et systèmes d\'évacuation.', startDate: '2022-09-01', status: 'completed' },
      { id: 'p6-3', name: 'Maintenance Réseau 2023', description: 'Maintenance des points d\'eau existants.', startDate: '2023-03-15', status: 'ongoing' },
      { id: 'p6-4', name: 'Formation Entretien', description: 'Formation des comités locaux pour l\'entretien des puits.', startDate: '2023-07-01', status: 'completed' },
      { id: 'p6-5', name: 'Localisation Nouveaux Puits', description: 'Étude pour identifier les emplacements prioritaires.', startDate: '2023-11-01', status: 'planned' },
      { id: 'p6-6', name: 'Campagne Sensibilisation Eau', description: 'Ateliers sur la gestion de l\'eau et l\'hygiène.', startDate: '2024-02-01', status: 'ongoing' },
      { id: 'p6-7', name: 'Réseau Distribution Eau', description: 'Extension du réseau pour 3 villages.', startDate: '2024-05-01', status: 'planned' },
      { id: 'p6-8', name: 'Réhabilitation Puits 2024', description: 'Réhabilitation de puits anciens et sécurisation.', startDate: '2024-06-15', status: 'planned' },
      { id: 'p6-9', name: 'Soutien Pompes Solaires', description: 'Installation de pompes solaires sur 5 sites.', startDate: '2024-08-01', status: 'planned' },
      { id: 'p6-10', name: 'Suivi Qualité Eau', description: 'Suivi régulier de la qualité de l\'eau dans les points d\'eau.', startDate: '2024-09-01', status: 'ongoing' },
      { id: 'p6-11', name: 'Programme Eau Durable', description: 'Programme long terme pour gestion durable de l\'eau.', startDate: '2024-10-01', status: 'planned' }
    ],
    email: 'eau@villages-mg.org',
    phone: '+261 32 11 223 44',
    createdAt: '2023-07-18T10:20:00Z',
    updatedAt: '2024-10-26T13:50:00Z'
  },
  {
    id: '7',
    name: 'Jeunesse et Éducation Nord',
    description: 'Programme d\'appui scolaire et bourses pour étudiants défavorisés dans le nord de Madagascar.',
    category: 'education',
    status: 'active',
    location: 'Diego Suarez, Madagascar',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
    volunteers: 98,
    projects: [
      { id: 'p7-1', name: 'Bourses Étudiants Nord', description: 'Attribution de bourses pour élèves méritants.', startDate: '2021-09-01', status: 'completed' },
      { id: 'p7-2', name: 'Ateliers Soutien Scolaire', description: 'Ateliers de renforcement pour élèves.', startDate: '2022-02-01', status: 'completed' },
      { id: 'p7-3', name: 'Club Lecture', description: 'Mise en place de clubs de lecture dans 6 écoles.', startDate: '2022-06-01', status: 'ongoing' },
      { id: 'p7-4', name: 'Matériel Pédagogique', description: 'Fourniture de matériel pour les classes rurales.', startDate: '2023-01-15', status: 'completed' },
      { id: 'p7-5', name: 'Orientation Carrière', description: 'Sessions d\'orientation pour lycéens.', startDate: '2023-05-01', status: 'ongoing' },
      { id: 'p7-6', name: 'Programme Mentorat', description: 'Mentorat pour étudiants en difficultés.', startDate: '2023-09-01', status: 'ongoing' },
      { id: 'p7-7', name: 'Campagne Inscription Scolaire', description: 'Campagnes d\'inscription pour l\'année scolaire.', startDate: '2024-03-01', status: 'planned' }
    ],
    email: 'contact@jeunesse-nord.mg',
    phone: '+261 20 55 123 45',
    website: 'https://jeunesse-nord.mg',
    createdAt: '2020-11-02T09:10:00Z',
    updatedAt: '2024-09-30T10:00:00Z'
  },
  {
    id: '8',
    name: 'Clinique Mobile Sud',
    description: 'Unités mobiles médicales fournissant des consultations et soins de base aux zones isolées du sud.',
    category: 'health',
    status: 'active',
    location: 'Toliara, Madagascar',
    volunteers: 132,
    projects: [
      { id: 'p8-1', name: 'Clinique Mobile Tombok', description: 'Unités mobiles pour villages éloignés.', startDate: '2021-03-01', status: 'completed' },
      { id: 'p8-2', name: 'Campagne Vaccination Sud', description: 'Campagnes de vaccination ciblées.', startDate: '2021-08-01', status: 'completed' },
      { id: 'p8-3', name: 'Consultations Pédiatriques', description: 'Consultations régulières pour enfants.', startDate: '2022-02-01', status: 'ongoing' },
      { id: 'p8-4', name: 'Santé Maternelle', description: 'Suivi prénatal et accouchement sécurisé.', startDate: '2022-07-01', status: 'ongoing' },
      { id: 'p8-5', name: 'Formation Agents Santé', description: 'Formation du personnel mobile.', startDate: '2022-11-01', status: 'completed' },
      { id: 'p8-6', name: 'Distribution Médicaments', description: 'Distribution de kits de premiers secours.', startDate: '2023-04-01', status: 'completed' },
      { id: 'p8-7', name: 'Campagne Dépistage', description: 'Dépistage maladies tropicales.', startDate: '2023-09-01', status: 'ongoing' },
      { id: 'p8-8', name: 'Clinique Itinérante 2024', description: 'Extension des tournées cliniques.', startDate: '2024-01-15', status: 'planned' },
      { id: 'p8-9', name: 'Programme Nutrition', description: 'Ateliers nutritionnels pour familles.', startDate: '2024-05-01', status: 'planned' },
      { id: 'p8-10', name: 'Point de Soins Toliara', description: 'Création d\'un point de soins fixe.', startDate: '2024-08-01', status: 'planned' }
    ],
    email: 'santemobile@sud.mg',
    phone: '+261 33 22 334 55',
    createdAt: '2021-02-14T07:50:00Z',
    updatedAt: '2024-08-12T12:30:00Z'
  },
  {
    id: '9',
    name: 'Oasis Verte',
    description: 'Projets de protection des zones humides et gestion durable de l\'eau.',
    category: 'environment',
    status: 'pending',
    location: 'Île Sainte-Marie, Madagascar',
    volunteers: 44,
    projects: [
      { id: 'p9-1', name: 'Protection Zones Humides', description: 'Inventaire et protection des zones humides.', startDate: '2023-03-01', status: 'completed' },
      { id: 'p9-2', name: 'Campagne Réhabilitation', description: 'Actions de réhabilitation écologique.', startDate: '2023-06-01', status: 'ongoing' },
      { id: 'p9-3', name: 'Suivi Biodiversité', description: 'Suivi des espèces aquatiques.', startDate: '2023-09-01', status: 'ongoing' },
      { id: 'p9-4', name: 'Formation Communauté', description: 'Formation à la gestion durable des zones humides.', startDate: '2024-01-01', status: 'planned' },
      { id: 'p9-5', name: 'Gestion Déchets', description: 'Projet pilote de gestion des déchets locaux.', startDate: '2024-04-01', status: 'planned' },
      { id: 'p9-6', name: 'Sensibilisation Écoles', description: 'Programmes éducatifs en milieu scolaire.', startDate: '2024-07-01', status: 'planned' }
    ],
    email: 'info@oasis-verte.mg',
    createdAt: '2023-05-22T11:00:00Z',
    updatedAt: '2024-07-01T09:00:00Z'
  },
  {
    id: '10',
    name: 'Ateliers d\'Artisanat Local',
    description: 'Formation d\'artisans et ventes solidaires pour soutenir l\'économie locale et préserver les savoir-faire.',
    category: 'culture',
    status: 'active',
    location: 'Nosy Be, Madagascar',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
    volunteers: 57,
    projects: [
      { id: 'p10-1', name: 'Ateliers Artisanat 2022', description: 'Formation pour artisans locaux.', startDate: '2022-05-01', status: 'completed' },
      { id: 'p10-2', name: 'Boutiques Solidaires', description: 'Mise en place de points de vente solidaires.', startDate: '2022-10-01', status: 'ongoing' },
      { id: 'p10-3', name: 'Formation Vente En Ligne', description: 'Accompagnement numérique pour artisans.', startDate: '2023-03-01', status: 'completed' },
      { id: 'p10-4', name: 'Foire Artisanale 2024', description: 'Organisation d\'une foire pour promouvoir les créations.', startDate: '2024-06-01', status: 'planned' }
    ],
    email: 'artisans@local-mg.org',
    website: 'https://artisans-mg.org',
    createdAt: '2019-08-30T13:00:00Z',
    updatedAt: '2024-06-18T10:20:00Z'
  },
  {
    id: '11',
    name: 'Réemploi et Solidarité',
    description: 'Collecte et réutilisation de matériaux pour soutenir des micro-projets locaux.',
    category: 'social',
    status: 'active',
    location: 'Antsirabe, Madagascar',
    volunteers: 38,
    projects: [
      { id: 'p11-1', name: 'Collecte Matériaux Réemploi', description: 'Collecte et tri de matériaux réutilisables.', startDate: '2024-03-15', status: 'ongoing' },
      { id: 'p11-2', name: 'Ateliers Réparation', description: 'Ateliers pour réparer et valoriser objets.', startDate: '2024-05-01', status: 'ongoing' },
      { id: 'p11-3', name: 'Marché Solidaire', description: 'Vente des objets remis à neuf pour financer projets.', startDate: '2024-09-01', status: 'planned' }
    ],
    email: 'contact@reemploi.mg',
    createdAt: '2024-03-12T08:40:00Z',
    updatedAt: '2024-10-10T14:00:00Z'
  },
  {
    id: '12',
    name: 'Bourses pour Futurs Enseignants',
    description: 'Soutien financier et mentorat pour former des enseignants dans les régions défavorisées.',
    category: 'education',
    status: 'inactive',
    location: 'Toamasina, Madagascar',
    volunteers: 22,
    projects: [
      { id: 'p12-1', name: 'Bourses 2023', description: 'Attribution de bourses pour futurs enseignants.', startDate: '2023-01-15', status: 'completed' },
      { id: 'p12-2', name: 'Mentorat Enseignants', description: 'Programme de mentorat pour jeunes enseignants.', startDate: '2023-09-01', status: 'ongoing' }
    ],
    email: 'bourses@enseignants.mg',
    createdAt: '2018-04-01T09:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: '13',
    name: 'Santé Maternelle Ensemble',
    description: 'Programmes dédiés à la santé maternelle et infantile dans les villages reculés.',
    category: 'health',
    status: 'active',
    location: 'Ambatondrazaka, Madagascar',
    volunteers: 110,
    projects: [
      { id: 'p13-1', name: 'Maternité Mobile', description: 'Unités de maternité mobile pour villages.', startDate: '2022-01-01', status: 'completed' },
      { id: 'p13-2', name: 'Suivi Postnatal', description: 'Suivi des nouveau-nés et mamans.', startDate: '2022-06-01', status: 'ongoing' },
      { id: 'p13-3', name: 'Ateliers Nutrition', description: 'Ateliers pour nutrition des mères.', startDate: '2022-10-01', status: 'completed' },
      { id: 'p13-4', name: 'Vaccination Bébés', description: 'Séances de vaccination ciblées.', startDate: '2023-02-01', status: 'completed' },
      { id: 'p13-5', name: 'Formation Assistantes', description: 'Formation des assistantes communautaires.', startDate: '2023-05-01', status: 'ongoing' },
      { id: 'p13-6', name: 'Campagne Sensibilisation', description: 'Sensibilisation sur santé maternelle.', startDate: '2023-08-01', status: 'ongoing' },
      { id: 'p13-7', name: 'Approvisionnement Médicaments', description: 'Approvisionnement en kits essentiels.', startDate: '2023-11-01', status: 'planned' },
      { id: 'p13-8', name: 'Clinique Locale', description: 'Renforcement d\'un point de soins local.', startDate: '2024-03-01', status: 'planned' },
      { id: 'p13-9', name: 'Programme Suivi 2024', description: 'Programme de suivi périnatal.', startDate: '2024-07-01', status: 'planned' }
    ],
    phone: '+261 34 22 445 66',
    createdAt: '2022-12-01T06:30:00Z',
    updatedAt: '2024-09-05T11:45:00Z'
  },
  {
    id: '14',
    name: 'Volontaires pour la Mangrove',
    description: 'Protection des mangroves et sensibilisation des communautés côtières.',
    category: 'environment',
    status: 'active',
    location: 'Mahambo, Madagascar',
    volunteers: 71,
    projects: [
      { id: 'p14-1', name: 'Plantation Mangrove', description: 'Replantation des mangroves en zone côtière.', startDate: '2021-05-01', status: 'completed' },
      { id: 'p14-2', name: 'Sensibilisation Pêche Durable', description: 'Ateliers pour pêcheurs locaux.', startDate: '2022-03-01', status: 'completed' },
      { id: 'p14-3', name: 'Monitoring Zones Côtières', description: 'Surveillance écologique des mangroves.', startDate: '2022-10-01', status: 'ongoing' },
      { id: 'p14-4', name: 'Reforestation 2023', description: 'Projets de reforestation côtière.', startDate: '2023-04-01', status: 'ongoing' },
      { id: 'p14-5', name: 'Programme Éducation', description: 'Programme éducatif en écoles locales.', startDate: '2023-09-01', status: 'ongoing' },
      { id: 'p14-6', name: 'Protection Littoral', description: 'Actions de protection contre l\'érosion.', startDate: '2024-02-01', status: 'planned' }
    ],
    image: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=400',
    email: 'mangrove@coast-mg.org',
    createdAt: '2020-05-18T10:00:00Z',
    updatedAt: '2024-09-20T09:25:00Z'
  },
  {
    id: '15',
    name: 'Cœur Solidaire',
    description: 'Aide d\'urgence et programmes de réinsertion pour personnes sans abri en milieu urbain.',
    category: 'social',
    status: 'pending',
    location: 'Antananarivo, Madagascar',
    volunteers: 29,
    projects: [
      { id: 'p15-1', name: 'Distribution Urgence', description: 'Distribution d\'aide d\'urgence aux familles.', startDate: '2024-02-20', status: 'ongoing' },
      { id: 'p15-2', name: 'Ateliers Réinsertion', description: 'Ateliers pour réinsertion socioprofessionnelle.', startDate: '2024-04-01', status: 'planned' },
      { id: 'p15-3', name: 'Aide Logement', description: 'Réparations d\'urgence pour abris.', startDate: '2024-06-01', status: 'planned' },
      { id: 'p15-4', name: 'Accompagnement Social', description: 'Accompagnement et suivi des bénéficiaires.', startDate: '2024-07-01', status: 'planned' }
    ],
    email: 'coeur@solidaire.mg',
    phone: '+261 34 99 123 00',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-10-01T08:00:00Z'
  },
  {
    id: '16',
    name: 'Festival des Arts de la Grande Île',
    description: 'Promotion des arts et organisation d\'un festival annuel pour mettre en valeur les artistes locaux.',
    category: 'culture',
    status: 'active',
    location: 'Antananarivo, Madagascar',
    volunteers: 200,
    projects: [
      { id: 'p16-1', name: 'Festival 2024', description: 'Organisation du festival annuel des arts.', startDate: '2024-07-01', status: 'planned' }
    ],
    email: 'festival@arts-mg.org',
    website: 'https://festival-arts.mg',
    createdAt: '2017-11-11T12:00:00Z',
    updatedAt: '2024-05-30T12:30:00Z'
  },
  {
    id: '17',
    name: 'École Numérique Rurale',
    description: 'Introduction du numérique dans les écoles rurales via des ateliers et équipements abordables.',
    category: 'education',
    status: 'active',
    location: 'Ambositra, Madagascar',
    volunteers: 64,
    projects: [
      { id: 'p17-1', name: 'Ateliers Numérique', description: 'Ateliers pour intégrer le numérique en milieu rural.', startDate: '2021-10-01', status: 'completed' },
      { id: 'p17-2', name: 'Formation Enseignants 2022', description: 'Formation pour enseignants en outils numériques.', startDate: '2022-03-01', status: 'completed' },
      { id: 'p17-3', name: 'Laboratoire Itinérant', description: 'Laboratoire mobile pour pratique numérique.', startDate: '2022-09-01', status: 'ongoing' },
      { id: 'p17-4', name: 'Bourses Études', description: 'Soutien pour étudiants en informatique.', startDate: '2023-02-01', status: 'ongoing' },
      { id: 'p17-5', name: 'Programme Coding 2023', description: 'Programme d\'initiation au coding pour lycéens.', startDate: '2023-06-01', status: 'completed' },
      { id: 'p17-6', name: 'Réseau Connectivité', description: 'Amélioration de la connectivité dans 3 écoles.', startDate: '2024-01-15', status: 'planned' }
    ],
    email: 'numérique@ecole-rurale.mg',
    createdAt: '2021-09-09T09:30:00Z',
    updatedAt: '2024-08-08T10:10:00Z'
  },
  {
    id: '18',
    name: 'Clinique Vétérinaire Mobile',
    description: 'Soins vétérinaires et campagnes de stérilisation pour animaux de compagnie et d\'élevage.',
    category: 'health',
    status: 'inactive',
    location: 'Fenoarivo, Madagascar',
    volunteers: 15,
    projects: [
      { id: 'p18-1', name: 'Clinique Vétérinaire Mobile 1', description: 'Campagne de stérilisation locale.', startDate: '2019-05-01', status: 'completed' },
      { id: 'p18-2', name: 'Vaccination Animaux', description: 'Campagne de vaccination pour animaux domestiques.', startDate: '2020-03-01', status: 'completed' }
    ],
    createdAt: '2019-03-22T07:00:00Z',
    updatedAt: '2023-12-12T09:00:00Z'
  },
  {
    id: '19',
    name: 'Sentiers pour la Biodiversité',
    description: 'Création de sentiers éducatifs et protection des corridors naturels.',
    category: 'environment',
    status: 'active',
    location: 'Ranomafana, Madagascar',
    volunteers: 52,
    projects: [
      { id: 'p19-1', name: 'Sentier Ranomafana', description: 'Création de sentiers éducatifs.', startDate: '2022-03-01', status: 'completed' },
      { id: 'p19-2', name: 'Protection Corridor', description: 'Protection des corridors fauniques.', startDate: '2022-06-01', status: 'ongoing' },
      { id: 'p19-3', name: 'Suivi Faune', description: 'Monitoring des populations locales.', startDate: '2022-09-01', status: 'ongoing' },
      { id: 'p19-4', name: 'Ateliers Communautaires', description: 'Sensibilisation et formation des communautés.', startDate: '2023-02-01', status: 'completed' },
      { id: 'p19-5', name: 'Sentier Éducatif 2023', description: 'Mise en place d\'itinéraires pédagogiques.', startDate: '2023-07-01', status: 'ongoing' },
      { id: 'p19-6', name: 'Entretien Sentiers', description: 'Travaux d\'entretien et signalétique.', startDate: '2023-10-01', status: 'planned' },
      { id: 'p19-7', name: 'Projet Recherche', description: 'Projet de recherche sur biodiversité.', startDate: '2024-01-01', status: 'planned' },
      { id: 'p19-8', name: 'Festival Nature', description: 'Événement local pour promouvoir conservation.', startDate: '2024-05-01', status: 'planned' }
    ],
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    email: 'biodiversite@sentiers.mg',
    createdAt: '2022-06-01T08:00:00Z',
    updatedAt: '2024-07-25T13:15:00Z'
  },
  {
    id: '20',
    name: 'Maison des Femmes Solidaires',
    description: 'Espace d\'accueil, formation professionnelle et accompagnement pour femmes en difficulté.',
    category: 'social',
    status: 'active',
    location: 'Mahajanga, Madagascar',
    volunteers: 85,
    projects: [
      { id: 'p20-1', name: 'Maison Accueil Femmes', description: 'Programme d\'accueil et formation.', startDate: '2020-11-01', status: 'completed' },
      { id: 'p20-2', name: 'Ateliers Artisanat', description: 'Ateliers de formation professionnelle.', startDate: '2021-04-01', status: 'completed' },
      { id: 'p20-3', name: 'Soutien Microcrédit', description: 'Microcrédits pour activités génératrices.', startDate: '2021-09-01', status: 'ongoing' },
      { id: 'p20-4', name: 'Accompagnement Psychosocial', description: 'Soutien et suivi personnalisé.', startDate: '2022-02-01', status: 'ongoing' },
      { id: 'p20-5', name: 'Insertion Professionnelle', description: 'Partenariat entreprises locales.', startDate: '2022-08-01', status: 'ongoing' },
      { id: 'p20-6', name: 'Programme Santé', description: 'Actions santé pour femmes et enfants.', startDate: '2023-03-01', status: 'ongoing' },
      { id: 'p20-7', name: 'Forum Femmes 2024', description: 'Organisation d\'un forum annuel.', startDate: '2024-06-01', status: 'planned' }
    ],
    phone: '+261 32 45 667 88',
    createdAt: '2020-10-10T10:10:00Z',
    updatedAt: '2024-09-10T09:00:00Z'
  },
  {
    id: '21',
    name: 'Archives Vivantes Malagasy',
    description: 'Collecte et conservation des histoires orales et traditions locales.',
    category: 'culture',
    status: 'pending',
    location: 'Sambava, Madagascar',
    volunteers: 12,
    projects: [
      { id: 'p21-1', name: 'Collecte Histoires Orales', description: 'Enregistrements et conservation.', startDate: '2023-02-01', status: 'completed' },
      { id: 'p21-2', name: 'Ateliers Transmission', description: 'Ateliers pour transmettre traditions.', startDate: '2023-08-01', status: 'ongoing' }
    ],
    email: 'archives@vivantes.mg',
    createdAt: '2023-01-20T11:20:00Z',
    updatedAt: '2024-04-15T10:00:00Z'
  },
  {
    id: '22',
    name: 'Campus Vert',
    description: 'Sensibilisation écologique dans les universités et réduction de l\'empreinte carbone campus.',
    category: 'environment',
    status: 'active',
    location: 'Antananarivo, Madagascar',
    volunteers: 150,
    projects: [
      { id: 'p22-1', name: 'Campus Vert Campagne', description: 'Campagnes de sensibilisation universitaires.', startDate: '2021-04-01', status: 'completed' },
      { id: 'p22-2', name: 'Réduction Empreinte', description: 'Programmes pour réduire empreinte carbone.', startDate: '2021-10-01', status: 'ongoing' },
      { id: 'p22-3', name: 'Ateliers Étudiants', description: 'Ateliers pratiques en écologie.', startDate: '2022-03-01', status: 'completed' },
      { id: 'p22-4', name: 'Journée Propreté Campus', description: 'Organisation d\'événements campus propres.', startDate: '2023-05-01', status: 'ongoing' },
      { id: 'p22-5', name: 'Programme Recyclage', description: 'Installation de filières de recyclage sur campus.', startDate: '2024-02-01', status: 'planned' }
    ],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
    email: 'campus@vert.mg',
    website: 'https://campus-vert.mg',
    createdAt: '2021-04-05T09:00:00Z',
    updatedAt: '2024-09-01T08:30:00Z'
  },
  {
    id: '23',
    name: 'Programme de Lecture Itinérant',
    description: 'Bibliobus apportant des livres et ateliers de lecture aux enfants des zones rurales.',
    category: 'education',
    status: 'active',
    location: 'Vatomandry, Madagascar',
    volunteers: 46,
    projects: [
      { id: 'p23-1', name: 'Bibliobus Routes', description: 'Tournées de bibliobus dans villages.', startDate: '2022-02-01', status: 'completed' },
      { id: 'p23-2', name: 'Ateliers Lecture', description: 'Ateliers pour enfants et parents.', startDate: '2022-07-01', status: 'ongoing' },
      { id: 'p23-3', name: 'Don Livres 2024', description: 'Campagne de collecte et donation de livres.', startDate: '2024-03-01', status: 'planned' }
    ],
    createdAt: '2022-02-14T08:00:00Z',
    updatedAt: '2024-06-22T09:40:00Z'
  },
  {
    id: '24',
    name: 'Aide Psychologique Communautaire',
    description: 'Sessions gratuites de soutien psychologique et formation des conseillers locaux.',
    category: 'health',
    status: 'pending',
    location: 'Taolagnaro, Madagascar',
    volunteers: 27,
    projects: [
      { id: 'p24-1', name: 'Groupes de Soutien', description: 'Sessions de soutien psychologique hebdomadaires.', startDate: '2024-04-15', status: 'ongoing' },
      { id: 'p24-2', name: 'Formation Conseillers', description: 'Formation de conseillers locaux en psychologie de base.', startDate: '2024-05-01', status: 'planned' },
      { id: 'p24-3', name: 'Ligne d’écoute', description: 'Mise en place d\’une ligne téléphonique d\’écoute.', startDate: '2024-06-01', status: 'ongoing' },
      { id: 'p24-4', name: 'Ateliers Communautaires', description: 'Ateliers de gestion du stress pour jeunes et familles.', startDate: '2024-07-01', status: 'planned' }
    ],
    email: 'psychosupport@communaute.mg',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-10-05T11:00:00Z'
  },
  {
    id: '25',
    name: 'Réseau des Initiatives Locales',
    description: 'Plateforme de coordination pour petites associations locales, partage de ressources et formation en gestion de projets.',
    category: 'social',
    status: 'active',
    location: 'Antananarivo, Madagascar',
    volunteers: 310,
    projects: [
      { id: 'p25-1', name: 'Plateforme Ressources', description: 'Création d\’une plateforme en ligne pour partager ressources et modèles de projets.', startDate: '2018-01-01', status: 'completed' },
      { id: 'p25-2', name: 'Formation Gestion', description: 'Programmes de formation en gestion associative pour leaders locaux.', startDate: '2019-03-01', status: 'completed' },
      { id: 'p25-3', name: 'Micro-subventions', description: 'Attribution de petites subventions pour démarrer des initiatives locales.', startDate: '2020-06-01', status: 'ongoing' },
      { id: 'p25-4', name: 'Réseautage Annuel', description: 'Conférence annuelle des initiatives locales.', startDate: '2021-11-01', status: 'completed' },
      { id: 'p25-5', name: 'Programme Mentorat', description: 'Mentorat entre organisations expérimentées et nouvelles.', startDate: '2022-02-01', status: 'ongoing' },
      { id: 'p25-6', name: 'Boîte à outils', description: 'Création et diffusion d\’outils pratiques pour gestion de projet.', startDate: '2022-09-01', status: 'completed' },
      { id: 'p25-7', name: 'Campagnes Sensibilisation', description: 'Campagnes sur inclusion sociale et bonnes pratiques.', startDate: '2023-03-01', status: 'ongoing' },
      { id: 'p25-8', name: 'Ateliers Financement', description: 'Ateliers pour lever des fonds et écrire des propositions.', startDate: '2023-08-01', status: 'planned' },
      { id: 'p25-9', name: 'Échange International', description: 'Programme d\’échange entre ONG locales et partenaires internationaux.', startDate: '2024-01-01', status: 'planned' },
      { id: 'p25-10', name: 'Suivi & Evaluation', description: 'Mise en place d\’outils de suivi et évaluation pour projets locaux.', startDate: '2019-05-01', status: 'ongoing' }
    ],
    image: 'https://images.unsplash.com/photo-1520975922051-4c65a8a1a3b9?w=400',
    email: 'contact@initiatives-locales.mg',
    website: 'https://initiatives-locales.mg',
    createdAt: '2016-06-06T06:06:00Z',
    updatedAt: '2024-10-30T16:00:00Z'
  }
]
