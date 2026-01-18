# 🎨 User Flow Visual - Diagrammes

Visualisation simplifiée des parcours utilisateurs de l'ONG Platform.

---

## 🗺️ Navigation principale

```
                                    ┌─────────────────────┐
                                    │   Page d'accueil    │
                                    │         /           │
                                    │                     │
                                    │  • Liste des ONGs   │
                                    │  • Recherche        │
                                    │  • Filtres          │
                                    └──────────┬──────────┘
                                               │
                        ┌──────────────────────┼──────────────────────┐
                        │                      │                      │
                        ↓                      ↓                      ↓
            ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
            │   /ongs/[id]       │  │   /auth/login      │  │   /auth/signup     │
            │                    │  │                    │  │                    │
            │  Détail d'une ONG  │  │  Page connexion    │  │  Page inscription  │
            │                    │  │                    │  │                    │
            │  PUBLIC ✓          │  │  GUEST only        │  │  GUEST only        │
            └────────────────────┘  └─────────┬──────────┘  └─────────┬──────────┘
                                               │                       │
                                               └───────────┬───────────┘
                                                           │
                                                           │ Auth success
                                                           ↓
                                               ┌────────────────────┐
                                               │    /dashboard      │
                                               │                    │
                                               │  Tableau de bord   │
                                               │                    │
                                               │  PROTECTED 🔒      │
                                               └─────────┬──────────┘
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    ↓                    ↓                    ↓
                        ┌────────────────────┐  ┌────────────────┐  ┌────────────────┐
                        │     /profil        │  │  /my-ongs      │  │   /favorites   │
                        │                    │  │  (futur)       │  │   (futur)      │
                        │  Mon profil        │  │                │  │                │
                        │                    │  │  Agent only    │  │  Partner only  │
                        │  PROTECTED 🔒      │  │  🔒🏢          │  │  🔒❤️          │
                        └────────────────────┘  └────────────────┘  └────────────────┘
```

---

## 👤 Parcours Visiteur Anonyme

```
     START
       │
       ↓
   ┌───────┐
   │   /   │ ← Arrive sur la page d'accueil
   └───┬───┘
       │
       ├─→ Consulte la liste des ONGs
       │   • Recherche par nom
       │   • Filtre par catégorie
       │   • Filtre par localisation
       │
       ├─→ Clique sur une ONG
       │   ┌─────────────┐
       │   │ /ongs/[id]  │ ← Voit les détails
       │   └─────────────┘
       │
       ├─→ Veut en savoir plus ou donner
       │   ⚠️ Besoin de se connecter
       │
       ↓
   ┌──────────────┐
   │ /auth/login  │ ← Décide de se connecter
   └──────┬───────┘
          │
          ├─→ A déjà un compte → Login
          │                       │
          │                       ↓
          │                   ┌────────────┐
          │                   │ /dashboard │
          │                   └────────────┘
          │
          └─→ Pas de compte → Vers Signup
                              │
                              ↓
                          ┌───────────────┐
                          │ /auth/signup  │
                          └───────┬───────┘
                                  │
                                  ↓
                              ┌────────────┐
                              │ /dashboard │
                              └────────────┘
                                   END
```

---

## 🤝 Parcours User Partner (Donateur)

```
     START (après signup/login)
       │
       ↓
   ┌────────────┐
   │ /dashboard │ ← Vue d'ensemble
   └─────┬──────┘
         │
         ├─→ "Voir mon profil"
         │   ┌───────────┐
         │   │  /profil  │
         │   └───────────┘
         │   • Modifier infos
         │   • Changer avatar
         │   • Mettre à jour bio
         │
         ├─→ "Découvrir les ONGs"
         │   ┌───────┐
         │   │   /   │
         │   └───┬───┘
         │       │
         │       ├─→ Recherche ONGs
         │       │   • Filtre "Environnement"
         │       │   • Filtre "Paris"
         │       │
         │       └─→ Clique sur ONG
         │           ┌─────────────┐
         │           │ /ongs/[id]  │
         │           └──────┬──────┘
         │                  │
         │                  ├─→ ❤️ Suivre l'ONG
         │                  ├─→ 💰 Faire un don
         │                  └─→ 📧 Contacter
         │
         └─→ "Mes ONGs suivies" (futur)
             ┌──────────────┐
             │  /favorites  │
             └──────────────┘
             • Liste des ONGs suivies
             • Activité récente
             • Notifications
```

---

## 🏢 Parcours User Agent (Responsable ONG)

```
     START (après signup/login)
       │
       ↓
   ┌────────────┐
   │ /dashboard │ ← Dashboard Agent
   └─────┬──────┘
         │
         │ 🏢 Section "Mon ONG" (1 agent = 1 ONG)
         │   ┌──────────────────────────────────┐
         │   │ [Image de couverture]            │
         │   │ ┌─────────────────────────────┐  │
         │   │ │ Nom de l'ONG                │  │
         │   │ │ Description                 │  │
         │   │ │ 🏷️ Catégorie | 📍 Lieu      │  │
         │   │ └─────────────────────────────┘  │
         │   │                                  │
         │   │ Statistiques:                    │
         │   │  👥 150 bénévoles                │
         │   │  ✅ 8 projets actifs             │
         │   │  📊 95% transparence             │
         │   │                                  │
         │   │ [Voir page publique] [Gérer]     │
         │   └──────────────────────────────────┘
         │
         ├─→ Si pas d'ONG encore :
         │   ┌──────────────────────────────────┐
         │   │ 🏢 Vous n'avez pas encore d'ONG  │
         │   │                                  │
         │   │ Créez votre organisation pour    │
         │   │ commencer à faire la différence  │
         │   │                                  │
         │   │     [Créer mon ONG]              │
         │   └──────────────────────────────────┘
         │
         ├─→ "Créer mon ONG" (si pas d'ONG)
         │   ┌────────────────┐
         │   │ /ongs/create   │ (à créer)
         │   └────────┬───────┘
         │            │
         │            ├─→ Étape 1: Infos générales
         │            ├─→ Étape 2: Localisation
         │            ├─→ Étape 3: Projets
         │            ├─→ Étape 4: Financiers
         │            │
         │            ↓
         │        ✅ ONG créée !
         │            │
         │            ↓
         │        Dashboard mis à jour
         │        avec infos de l'ONG
         │
         ├─→ "Gérer mon ONG" (si ONG existe)
         │   ┌──────────────────┐
         │   │ /ongs/[id]/edit  │ (à créer)
         │   └────────┬─────────┘
         │            │
         │            ├─→ Modifier infos
         │            ├─→ Ajouter projet
         │            ├─→ Gérer finances
         │            ├─→ Upload images
         │            └─→ Voir statistiques
         │
         ├─→ "Voir page publique"
         │   ┌─────────────┐
         │   │ /ongs/[id]  │
         │   └─────────────┘
         │   • Voir l'ONG comme un visiteur
         │   • Vérifier l'apparence publique
         │
         ├─→ "Voir mon profil"
         │   ┌───────────┐
         │   │  /profil  │
         │   └───────────┘
         │   • Infos personnelles
         │   • Entreprise
         │   • ONG gérée (lien unique)
         │
         └─→ "Découvrir autres ONGs"
             ┌───────┐
             │   /   │
             └───────┘
             (même accès que Partner)
```

---

## 🔐 Flow d'authentification détaillé

```
┌─────────────────────────────────────────────────────────────────┐
│                        INSCRIPTION                               │
└─────────────────────────────────────────────────────────────────┘

    Browser                     Frontend                   Supabase
       │                           │                          │
       ├─→ Visite /auth/signup     │                          │
       │                           │                          │
       ├─→ Remplit formulaire      │                          │
       │   • Email                 │                          │
       │   • Password              │                          │
       │   • Account Type          │                          │
       │   • Nom/Prénom            │                          │
       │                           │                          │
       ├─→ Clique "S'inscrire"     │                          │
       │                           ├─→ useAuthValidation      │
       │                           │   ✓ Validation client    │
       │                           │                          │
       │                           ├─→ authService.signUp() ─→│
       │                           │                          ├─→ Create user
       │                           │                          ├─→ Send email
       │                           │                          │   confirmation
       │                           │                          │
       │                           │←─ { user, session } ─────┤
       │                           │                          │
       │                           ├─→ authStore.setUser()    │
       │                           │   • Save to Pinia        │
       │                           │   • Save to localStorage │
       │                           │                          │
       │←─ navigateTo('/dashboard')│                          │
       │                           │                          │
       ↓                           ↓                          ↓
   /dashboard                  ✅ Connected             Session active


┌─────────────────────────────────────────────────────────────────┐
│                          CONNEXION                              │
└─────────────────────────────────────────────────────────────────┘

    Browser                    Frontend                   Supabase
       │                          │                          │
       ├─→ Visite /auth/login     │                          │
       │                          │                          │
       ├─→ Entre email/password   │                          │
       │                          │                          │
       ├─→ Clique "Se connecter"  │                          │
       │                          ├─→ authService.login() ──→│
       │                          │                          ├─→ Verify creds
       │                          │                          │
       │                          │←─ { user, session } ─────┤
       │                          │                          │
       │                          ├─→ authStore.setUser()    │
       │                          │   • Update Pinia         │
       │                          │   • Save localStorage    │
       │                          │                          │
       │                          ├─→ Check redirect param   │
       │                          │   ?redirect=/ongs/123    │
       │                          │                          │
       │←─ navigateTo(redirect)   │                          │
       │                          │                          │
       ↓                          ↓                          ↓
   Destination              ✅ Connected             Session active


┌─────────────────────────────────────────────────────────────────┐
│                     PROTECTION ROUTE                             │
└─────────────────────────────────────────────────────────────────┘

    Browser                 Middleware                    Store
       │                       │                           │
       ├─→ Tente /dashboard    │                           │
       │                       ├─→ auth.client.ts          │
       │                       │                           │
       │                       ├─→ Check authStore ───────→│
       │                       │                           ├─→ isAuthenticated?
       │                       │                           │
       │                       │←──────────────────────────┤
       │                       │   • Si OUI: allow         │
       │                       │   • Si NON: block         │
       │                       │                           │
       │←─ navigateTo(...)     │                           │
       │   Si NON:             │                           │
       │   /auth/login?        │                           │
       │   redirect=/dashboard │                           │
       │                       │                           │
       ↓                       ↓                           ↓
```

---

## 🔄 Cycle de vie de la session

```
                        ┌─────────────────────┐
                        │  Page Load          │
                        │  (nuxt start)       │
                        └──────────┬──────────┘
                                   │
                                   ↓
                        ┌─────────────────────┐
                        │  Plugin Init        │
                        │  supabase.client.ts │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ↓              ↓              ↓
         ┌─────────────────┐  ┌────────────┐  ┌───────────────────┐
         │ Create client   │  │ Listen     │  │ Check localStorage│
         │ with config     │  │ auth state │  │ for saved user    │
         └─────────────────┘  └────────────┘  └───────────────────┘
                    │              │              │
                    └──────────────┼──────────────┘
                                   │
                                   ↓
                        ┌─────────────────────┐
                        │  Provide $supabase  │
                        │  to Nuxt app        │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ↓              ↓              ↓
         ┌─────────────────┐  ┌────────────┐  ┌─────────────────┐
         │ User action     │  │ Auth state │  │ Session expired │
         │ triggers        │  │ changes    │  │                 │
         │ API call        │  │            │  │                 │
         └────────┬────────┘  └─────┬──────┘  └────────┬────────┘
                  │                 │                  │
                  │                 ↓                  │
                  │      ┌─────────────────────┐       │
                  │      │ onAuthStateChange   │       │
                  │      │ event fired         │       │
                  │      └──────────┬──────────┘       │
                  │                 │                  │
                  │                 ↓                  │
                  │      ┌─────────────────────┐       │
                  │      │ Update authStore    │       │
                  │      │ Update localStorage │       │
                  │      └──────────┬──────────┘       │
                  │                 │                  │
                  └─────────────────┼──────────────────┘
                                    │
                                    ↓
                         ┌──────────────────┐
                         │  UI Updated      │
                         │  • Header        │
                         │  • User widget   │
                         │  • Protected     │
                         │    routes        │
                         └──────────────────┘
```

---

## 📊 Structure des données

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER OBJECT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  {                                                               │
│    id: "uuid-1234",                                             │
│    email: "user@example.com",                                   │
│    accountType: "user_partner" | "user_agent",                  │
│    firstName: "John",                                           │
│    lastName: "Doe",                                             │
│    fullName: "John Doe",                                        │
│    companyName: "My Company",  // Si agent                      │
│    avatar: "https://...",                                       │
│    bio: "Je suis passionné par...",                            │
│    location: "Paris, France",                                   │
│    website: "https://mysite.com",                              │
│    verified: true,                                              │
│    createdAt: "2026-01-01T00:00:00Z",                          │
│    updatedAt: "2026-01-18T10:30:00Z"                           │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                          ONG OBJECT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {                                                              │
│    id: "ong-uuid",                                              │
│    name: "Enfants du Monde",                                    │
│    description: "ONG dédiée à...",                              │
│    category: "Éducation",                                       │
│    status: "active" | "pending" | "inactive",                   │
│    location: "Paris, France",                                   │
│    image: "https://...",                                        │
│    volunteers: 150,                                             │
│    email: "contact@ong.com",                                    │
│    phone: "+33 1 23 45 67 89",                                  │
│    website: "https://ong.com",                                  │
│    projects: [                                                  │
│      {                                                          │
│        id: "proj-1",                                            │
│        title: "École en Afrique",                               │
│        description: "...",                                      │
│        budget: 50000,                                           │
│        raised: 30000,                                           │
│        status: "active"                                         │
│      }                                                          │
│    ],                                                           │
│    financials: {                                                │
│      totalBudget: 500000,                                       │
│      totalRaised: 350000,                                       │
│      transparency: 95                                           │
│    },                                                           │
│    legal: {                                                     │
│      registrationNumber: "W123456789",                          │
│      legalStatus: "Association",                                │
│      taxExempt: true                                            │
│    },                                                           │
│    impact: {                                                    │
│      beneficiaries: 10000,                                      │
│      projectsCompleted: 25,                                     │
│      countries: ["France", "Sénégal", "Mali"]                   │
│    },                                                           │
│    donationOpportunities: [...],                                │
│    monitoring: {...},                                           │
│    createdAt: "2025-06-01T00:00:00Z",                           │
│    updatedAt: "2026-01-15T00:00:00Z"                            │
│  }                                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 États d'interface

```
┌────────────────────────────────────────────────────────────────────┐
│                    HEADER - État NON connecté                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [❤️ Logo] ONG Platform          [🌙]  [Se connecter]  [S'inscrire]│
│                                                                    │
└───────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                     HEADER - État connecté                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [❤️ Logo] ONG Platform          [🌙]  [👤 John Doe ▼]           │
│                                           └─ Dropdown:           │
│                                              • Dashboard         │
│                                              • Mon profil        │
│                                              • Paramètres        │
│                                              • ─────────         │
│                                              • Déconnexion       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────┐
│                   PAGE LISTE ONGs - États                         │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  État 1: LOADING                                                  │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  [Spinner animé] Chargement des ONGs...                   │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                   │
│  État 2: LOADED                                                   │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  Filtres: [Catégorie ▼] [Localisation ▼] [Recherche...]   │    │
│  │                                                           │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐                             │    │
│  │  │ ONG1 │  │ ONG2 │  │ ONG3 │                             │    │
│  │  └──────┘  └──────┘  └──────┘                             │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐                             │    │
│  │  │ ONG4 │  │ ONG5 │  │ ONG6 │                             │    │
│  │  └──────┘  └──────┘  └──────┘                             │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                   │
│  État 3: EMPTY                                                    │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  🔍 Aucune ONG trouvée                                    │    │
│  │  Essayez de modifier vos filtres                          │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                   │
│  État 4: ERROR                                                    │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  ❌ Erreur de chargement                                  │    │
│  │  [Réessayer]                                              │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚦 Logique de redirection

```
┌────────────────────────────────────────────────────────────────────┐
│                  REDIRECTION APRÈS LOGIN                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Scénario 1: Login direct (depuis Header)                          │
│  /auth/login                                                       │
│      │                                                             │
│      └─→ Login success → /dashboard                                │
│                                                                    │
│  Scénario 2: Redirect depuis page protégée                         │
│  User essaie d'accéder /profil                                     │
│      │                                                             │
│      ├─→ Non connecté → Middleware auth-client                     │
│      │                                                             │
│      └─→ /auth/login?redirect=/profil                              │
│          │                                                         │
│          └─→ Login success → /profil  (redirect vers page original)│
│                                                                    │
│  Scénario 3: Depuis page ONG                                       │
│  User clique "Suivre ONG" sur /ongs/123                            │
│      │                                                             │
│      ├─→ Non connecté → Requires auth                              │
│      │                                                             │
│      └─→ /auth/login?redirect=/ongs/123                            │
│          │                                                         │
│          └─→ Login success → /ongs/123  (retour sur ONG)           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│              PROTECTION PAR TYPE DE COMPTE                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Agent essaie /my-ongs (futur)                              │
│      │                                                           │
│      ├─→ Middleware: auth-client ✓                               │
│      ├─→ Middleware: agent-only-client                           │
│      │       │                                                   │
│      │       ├─→ accountType === 'user_agent' ? ✓                │
│      │       │                                                   │
│      │       └─→ accountType === 'user_partner' ? ❌             │
│      │           Redirect → /dashboard + toast error             │
│      │           "Cette page est réservée aux agents"            │
│      │                                                           │
│      └─→ Access granted                                          │
│                                                                  │
│  User Partner essaie /favorites (futur)                          │
│      │                                                           │
│      ├─→ Middleware: auth-client ✓                               │
│      ├─→ Middleware: partner-only-client                         │
│      │       │                                                   │
│      │       ├─→ accountType === 'user_partner' ? ✓              │
│      │       │                                                   │
│      │       └─→ accountType === 'user_agent' ? ❌               │
│      │           Redirect → /dashboard + toast error             │
│      │           "Cette page est réservée aux partenaires"       │
│      │                                                           │
│      └─→ Access granted                                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Événements et actions utilisateur

```
┌─────────────────────────────────────────────────────────────────┐
│                  ACTIONS SUR CARTE ONG                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────────────────────────┐                      │
│   │  [Image ONG]                         │                      │
│   │  Enfants du Monde                    │                      │
│   │  Éducation • Paris                   │                      │
│   │  150 bénévoles                       │                      │
│   │  ──────────────────────────────────  │                      │
│   │  [Voir détails]  [❤️ Suivre]        │◄──┐                   │
│   └──────────────────────────────────────┘   │                  │
│        │                  │                   │                 │
│        │                  │                   │ Si non connecté:│
│        │                  └──────────────────►│ → /auth/login   │
│        │                                      │   ?redirect=... │
│        │                                                        │
│        └─→ NuxtLink to /ongs/[id]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│              ACTIONS SUR PAGE DÉTAIL ONG                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Page: /ongs/123                                               │
│                                                                 │
│   Actions disponibles (selon statut connexion):                 │
│                                                                 │
│   NON CONNECTÉ:                                                 │
│   ├─→ Voir informations ✓                                       │
│   ├─→ Voir projets ✓                                            │
│   ├─→ Voir contact ✓                                            │
│   ├─→ Suivre ❌ → Requires auth                                 │
│   └─→ Donner ❌ → Requires auth                                 │
│                                                                 │
│   CONNECTÉ (Partner):                                           │
│   ├─→ Toutes les infos ✓                                        │
│   ├─→ Suivre/Unfollow ✓                                         │
│   ├─→ Faire un don ✓                                            │
│   ├─→ Contacter ✓                                               │
│   └─→ Modifier ❌ (pas propriétaire)                            │
│                                                                 │
│   CONNECTÉ (Agent propriétaire):                                │
│   ├─→ Toutes les actions Partner ✓                              │
│   ├─→ Modifier l'ONG ✓                                          │
│   ├─→ Gérer projets ✓                                           │
│   ├─→ Voir statistiques avancées ✓                              │
│   └─→ Supprimer ONG ✓                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**📅 Dernière mise à jour** : 18 Janvier 2026  
**🎨 Document** : Diagrammes visuels du user flow
