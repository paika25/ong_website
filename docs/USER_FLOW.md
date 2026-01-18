# 🗺️ User Flow - ONG Platform

**Date de création**: 18 Janvier 2026  
**Version**: 1.1  
**Dernière mise à jour**: 18 Janvier 2026  
**Auteur**: Documentation générée pour Paika Ongs

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Types d'utilisateurs](#types-dutilisateurs)
3. [Flow principal](#flow-principal)
4. [Flow par rôle](#flow-par-rôle)
5. [Pages et routes](#pages-et-routes)
6. [Middleware et protection](#middleware-et-protection)
7. [Architecture des features](#architecture-des-features)

---

## 🎯 Vue d'ensemble

L'application **ONG Platform** est une plateforme web permettant de découvrir, gérer et interagir avec des organisations à but non lucratif (ONGs).

### Objectifs principaux
- 📋 Lister et découvrir les ONGs
- 👤 Gérer son profil utilisateur
- 🏢 Gérer ses ONGs (pour les agents)
- 🤝 Suivre et soutenir des ONGs (pour les partenaires)

---

## 👥 Types d'utilisateurs

### 1. **Visiteur anonyme** (Non connecté)
- Peut consulter la liste des ONGs
- Peut voir les détails d'une ONG
- Doit se connecter pour accéder aux fonctionnalités avancées

### 2. **User Partner** (`user_partner`)
Utilisateur partenaire/donateur :
- ✅ Voir toutes les ONGs
- ✅ Suivre des ONGs
- ✅ Faire des dons
- ✅ Gérer son profil
- ❌ Ne peut pas créer/gérer d'ONGs

### 3. **User Agent** (`user_agent`)
Agent/Responsable d'ONG :
- ✅ Toutes les permissions du Partner
- ✅ Créer et gérer **une seule ONG** (1 agent = 1 ONG)
- ✅ Voir les statistiques de son ONG
- ✅ Gérer les projets de son ONG
- ✅ Dashboard dédié avec vue détaillée de son organisation

---

## 🔄 Flow principal

### Flow de navigation globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         Page d'accueil (/)                      │
│                      Liste des ONGs publique                    │
│                                                                 │
│  Actions possibles:                                             │
│  • Voir la liste des ONGs                                       │
│  • Rechercher/Filtrer des ONGs                                  │
│  • Cliquer sur une ONG → /ongs/[id]                             │
│  • Se connecter (Header) → /auth/login                          │
│  • S'inscrire (Header) → /auth/signup                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├───────────────────────────────┐
                              ↓                               ↓
                    ┌──────────────────┐          ┌────────────────────┐
                    │  /auth/login     │          │  /auth/signup      │
                    │  Page de login   │          │  Page d'inscription│
                    │                  │          │                    │
                    │  • Email         │          │  • Email           │
                    │  • Password      │          │  • Password        │
                    │  • Remember me   │          │  • Account Type    │
                    │                  │          │  • Nom/Prénom      │
                    │  Middleware:     │          │                    │
                    │  guest-client    │          │  Middleware:       │
                    └──────────────────┘          │  guest-client      │
                              │                   └────────────────────┘
                              │ Connexion réussie
                              ↓
                    ┌──────────────────┐
                    │   /dashboard     │
                    │  Tableau de bord │
                    │                  │
                    │  • Vue d'ensemble│
                    │  • Accès profil  │
                    │  • Statistiques  │
                    │                  │
                    │  Middleware:     │
                    │  auth-client     │
                    └──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   /profil    │    │    /ongs/[id]    │    │      /       │
│Mon profil    │    │  Détail ONG      │    │Liste ONGs    │
│              │    │                  │    │              │
│• Modifier    │    │• Infos complètes │    │• Rechercher  │
│  infos       │    │• Projets         │    │• Filtrer     │
│• Avatar      │    │• Statistiques    │    │              │
│• Bio         │    │• Contact         │    │              │
│              │    │                  │    │              │
│Middleware:   │    │Public accessible │    │Public        │
│auth-client   │    │                  │    │              │
└──────────────┘    └──────────────────┘    └──────────────┘
```

---

## 🎭 Flow par rôle

### Flow Visiteur Anonyme

```
1. Arrive sur / (page d'accueil)
   ↓
2. Consulte la liste des ONGs
   ↓
3. Peut cliquer sur une ONG → /ongs/[id]
   ↓
4. Pour aller plus loin → "Se connecter" dans le Header
   ↓
5. Redirigé vers /auth/login
   ↓
6. Peut switcher vers /auth/signup
```

### Flow User Partner (Partenaire/Donateur)

```
1. S'inscrit via /auth/signup
   ├─ Choisit "user_partner"
   ├─ Renseigne email, password, nom
   └─ Validation → Redirigé vers /dashboard
   
2. Accède au Dashboard
   ├─ Voit ses statistiques personnelles
### Flow User Partner (Partenaire/Donateur)

```
1. S'inscrit via /auth/signup
   ├─ Choisit "user_partner"
   ├─ Renseigne email, password, nom
   └─ Validation → Redirigé vers /dashboard
   
2. Accède au Dashboard Partenaire (spécifique)
   ├─ Section "Mes Dons"
   │  ├─ Liste complète des donations
   │  ├─ Tableau avec : Date, ONG, Projet, Montant, Statut
   │  └─ Total des dons affichés
   ├─ Historique du bénévolat (futur)
   │  ├─ ONGs suivies
   │  ├─ Projets soutenus
   │  └─ Heures de bénévolat
   └─ Accès rapide au profil et à l'exploration
   
3. Peut naviguer vers /profil
   ├─ Modifier ses informations
   ├─ Changer avatar
   └─ Mettre à jour bio/localisation
   
4. Consulte les ONGs (/)
   ├─ Recherche par catégorie
   ├─ Filtre par localisation/statut
   └─ Clique sur une ONG → /ongs/[id]
   
5. Sur une page ONG (/ongs/[id])
   ├─ Voit tous les détails
   ├─ Peut suivre l'ONG
   ├─ Peut faire un don
   └─ Voit les projets actifs
```

### Flow User Agent (Responsable d'ONG)

```
1. S'inscrit via /auth/signup
   ├─ Choisit "user_agent"
   ├─ Renseigne email, password, entreprise
   └─ Validation → Redirigé vers /dashboard
   
2. Dashboard Agent (spécifique) 🏢
   ├─ Section "Mon ONG" (1 agent = 1 ONG)
   │  ├─ Affichage détaillé de son organisation
   │  ├─ Image de couverture de l'ONG
   │  ├─ 3 statistiques clés :
   │  │  ├─ Nombre de bénévoles
   │  │  ├─ Projets actifs
   │  │  └─ Taux de transparence (%)
   │  ├─ Badge de statut (Active/En attente)
   │  ├─ Description complète
   │  └─ Actions : "Voir page publique" + "Gérer mon ONG"
   ├─ État vide si pas encore d'ONG
   │  ├─ Message d'encouragement
   │  └─ Bouton "Créer mon ONG"
   └─ Accès rapide au profil et à l'exploration
   
3. Gestion de l'ONG
   ├─ Créer son ONG unique (si pas encore créée)
   ├─ Modifier son ONG
   ├─ Ajouter des projets
   ├─ Voir les statistiques détaillées
   └─ Gérer les opportunités de don
   
4. Profil Agent (/profil)
   ├─ Informations personnelles
   ├─ Entreprise/Organisation
   ├─ ONG gérée (affichage unique)
   └─ Statistiques globales
   
5. Consultation ONGs (même que Partner)
   ├─ Voir toutes les ONGs de la plateforme
   ├─ Rechercher et filtrer
   └─ Consulter les détails
```

---

## 📄 Pages et routes

### Pages publiques (accessibles sans connexion)

| Route            | Fichier                   | Description                     | Middleware     |
|------------------|---------------------------|---------------------------------|----------------|
| `/`              | `pages/index.vue`         | Page d'accueil - Liste des ONGs | Aucun          |
| `/ongs/[id]`     | `pages/ongs/[id].vue`     | Détail d'une ONG spécifique     | Aucun          |
| `/auth/login`    | `pages/auth/Login.vue`    | Page de connexion               | `guest-client` |
| `/auth/signup`   | `pages/auth/SignUp.vue`   | Page d'inscription              | `guest-client` |
| `/auth/callback` | `pages/auth/callback.vue` | Callback OAuth Supabase         | Aucun          |

### Pages protégées (nécessitent authentification)

| Route        | Fichier               | Description                          | Middleware    | Accès                |
|--------------|-----------------------|--------------------------------------|---------------|----------------------|
| `/dashboard` | `pages/dashboard.vue` | Tableau de bord (différent par rôle) | `auth-client` | Tous users connectés |
| `/profil`    | `pages/Profil.vue`    | Profil utilisateur                   | `auth-client` | Tous users connectés |

**Note** : Le dashboard affiche un contenu différent selon le type d'utilisateur :
- **Agent** : Dashboard avec vue détaillée de son ONG unique (stats, projets, actions)
- **Partenaire** : Dashboard avec liste de ses dons et bénévolat

### Pages futures (à implémenter)

| Route suggérée    | Description              | Middleware                           | Accès                     |
|-------------------|--------------------------|--------------------------------------|---------------------------|
| `/ongs/create`    | Créer son ONG unique     | `auth-client`, `agent-only-client`   | User Agent uniquement     |
| `/ongs/[id]/edit` | Modifier son ONG         | `auth-client`, `agent-only-client`   | User Agent (propriétaire) |
| `/my-donations`   | Mes donations détaillées | `auth-client`, `partner-only-client` | User Partner uniquement   |
| `/favorites`      | ONGs suivies             | `auth-client`, `partner-only-client` | User Partner uniquement   |
| `/auth/forgot`    | Mot de passe oublié      | `guest-client`                       | Non connectés             |
| `/settings`       | Paramètres du compte     | `auth-client`                        | Tous users connectés      |

---

## 🛡️ Middleware et protection

### Middleware disponibles

#### 1. **auth.client.ts**
**Protection** : Route accessible uniquement si connecté
```typescript
// Vérifie si l'utilisateur est authentifié
// Si non → Redirige vers /auth/login?redirect=[page]
```
**Utilisé sur** :
- `/dashboard`
- `/profil`

#### 2. **guest.client.ts**
**Protection** : Route accessible uniquement si NON connecté
```typescript
// Vérifie si l'utilisateur est déjà connecté
// Si oui → Redirige vers /dashboard
```
**Utilisé sur** :
- `/auth/login`
- `/auth/signup`

#### 3. **agent-only.client.ts**
**Protection** : Route accessible uniquement pour les User Agents
```typescript
// Vérifie si user.accountType === 'user_agent'
// Si non → Redirige vers /dashboard avec message d'erreur
```
**Usage futur** :
- Gestion des ONGs
- Création d'ONGs

#### 4. **partner-only.client.ts**
**Protection** : Route accessible uniquement pour les User Partners
```typescript
// Vérifie si user.accountType === 'user_partner'
// Si non → Redirige vers /dashboard
```
**Usage futur** :
- Pages spécifiques aux partenaires/donateurs

---

## 🏗️ Architecture des features

### Structure des features

```
features/
├── auth/                    # Feature d'authentification
│   ├── components/
│   │   ├── Login.client.vue         # Formulaire de connexion
│   │   ├── Signup.client.vue        # Formulaire d'inscription
│   │   └── UserHeader.client.vue    # Widget utilisateur (Header)
│   ├── stores/
│   │   └── auth.client.ts           # Store Pinia (état utilisateur)
│   ├── services/
│   │   └── authService.ts           # Services API auth
│   ├── composables/
│   │   └── useAuthValidation.ts     # Validation formulaires
│   └── types/
│       └── auth.types.ts            # Types TypeScript
│
├── ong/                     # Feature ONGs
│   ├── components/
│   │   ├── Card.vue                 # Card ONG (liste)
│   │   ├── OngList.client.vue       # Liste complète
│   │   ├── OngListFilter.vue        # Filtres de recherche
│   │   ├── OngDetail.client.vue     # Page détail ONG
│   │   ├── OngProfile.client.vue    # Profil public ONG
│   │   └── Profil.client.vue        # Profil éditable
│   ├── services/
│   │   └── ongService.ts            # API ONGs (Supabase)
│   ├── composables/
│   │   └── useOngFilters.ts         # Logique de filtrage
│   ├── data/
│   │   └── index.ts                 # Données mock
│   └── type/
│       └── index.ts                 # Types ONG
│
└── user/                    # Feature utilisateurs
    ├── components/
    │   └── Profil.client.vue        # Composant profil utilisateur
    └── services/
        └── userService.ts           # API utilisateurs
```

---

## 🔐 Système d'authentification

### Technologies utilisées
- **Supabase Auth** : Backend d'authentification
- **Pinia** : Gestion d'état (store auth)
- **localStorage** : Persistance côté client
- **Cookies** : Session Supabase

### Flow d'authentification détaillé

```
┌──────────────────────────────────────────────────────────────┐
│                    1. Inscription (/auth/signup)             │
│                                                              │
│  • Utilisateur remplit le formulaire                         │
│  • Validation client (useAuthValidation)                     │
│  • Envoi à Supabase via authService.signUp()                 │
│  • Supabase crée le compte + envoie email confirmation       │
│  • Store Pinia met à jour l'état                             │
│  • Redirection vers /dashboard                               │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    2. Connexion (/auth/login)                │
│                                                              │
│  • Utilisateur entre email + password                        │
│  • Validation des champs                                     │
│  • Appel authService.login()                                 │
│  • Supabase vérifie les credentials                          │
│  • Retourne session + user data                              │
│  • Store Pinia sauvegarde (+ localStorage)                   │
│  • Redirection vers destination ou /dashboard                │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    3. Session active                         │
│                                                              │
│  • Plugin Supabase (plugins/supabase.client.ts)              │
│  • onAuthStateChange écoute les changements                  │
│  • Store auth synchronisé en temps réel                      │
│  • Middleware vérifie l'état sur chaque navigation           │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    4. Déconnexion                            │
│                                                              │
│  • User clique "Déconnexion" (UserHeader)                    │
│  • authService.logout() → supabase.auth.signOut()            │
│  • Store Pinia réinitialisé                                  │
│  • localStorage nettoyé                                      │
│  • Redirection vers /                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Composants globaux

### Header (`components/Header.vue`)
**Visible sur** : Toutes les pages (sauf auth)

**Contenu** :
- Logo + lien vers accueil (/)
- Widget utilisateur (UserHeader.client.vue) si connecté
- Boutons Login/Signup si non connecté

**Comportement** :
- Responsive (mobile/desktop)
- Toggle theme (dark/light)
- Dropdown profil utilisateur

### Footer (`components/Footer.client.vue`)
**Visible sur** : Pages principales

**Contenu** :
- Liens utiles
- Réseaux sociaux
- Copyright

---

## 📊 Flow de données

### État global (Pinia Store)

```typescript
// features/auth/stores/auth.client.ts
{
  user: User | null,          // Données utilisateur
  isAuthenticated: boolean,   // Statut connexion
  loading: boolean,           // État chargement
  
  // Actions
  setUser(user: User)        // Définir l'utilisateur
  setConnected()             // Marquer comme connecté
  clearUser()                // Déconnexion
  loadUserFromStorage()      // Restaurer depuis localStorage
}
```

### Services API

#### authService.ts
```typescript
login(credentials: LoginCredentials): Promise<AuthResult>
signUp(data: SignUpData): Promise<AuthResult>
logout(): Promise<void>
getCurrentUser(): Promise<User | null>
updateProfile(data: Partial<User>): Promise<User>
```

#### ongService.ts
```typescript
getOngs(): Promise<ONG[]>                    // Liste toutes ONGs
getOngById(id: string): Promise<ONG | null>  // Une ONG spécifique
searchOngs(query: string): Promise<ONG[]>    // Recherche
getOngsByCategory(category: string): Promise<ONG[]>
```

#### userService.ts
```typescript
getUserProfile(userId: string): Promise<User>
updateUserProfile(data: Partial<User>): Promise<User>
uploadAvatar(file: File): Promise<string>
```

---

## 🚀 Points d'entrée utilisateur

### 1. **Première visite (Nouveau visiteur)**
```
Landing → / (Liste ONGs) → Découvrir → /ongs/[id]
                           ↓
                    Intéressé → /auth/signup
```

### 2. **Utilisateur qui revient**
```
Landing → / → Header : Connexion → /auth/login → /dashboard
```

### 3. **Utilisateur connecté (session active)**
```
Landing → / → Déjà connecté → Accès direct /dashboard ou /profil
```

### 4. **Recherche d'ONG spécifique**
```
/ → Recherche/Filtre → Résultats → /ongs/[id] → Détails complets
```

---

## 🔄 Navigation entre pages

### Liens de navigation globaux 

| Depuis             | Vers           | Déclencheur             | Type              |
|--------------------|----------------|-------------------------|-------------------|
| Partout            | `/`            | Logo/Accueil            | NuxtLink          |
| Partout            | `/auth/login`  | Bouton "Connexion"      | NuxtLink          |
| Partout            | `/auth/signup` | Bouton "Inscription"    | NuxtLink          |
| `/auth/login`      | `/auth/signup` | Lien "Créer un compte"  | Événement @switch |
| `/auth/signup`     | `/auth/login`  | Lien "Se connecter"     | Événement @switch |
| `/auth/login`      | `/`            | Bouton "Retour accueil" | NuxtLink          |
| `/auth/signup`     | `/`            | Bouton "Retour accueil" | NuxtLink          |
| Login success      | `/dashboard`   | Auto redirect           | navigateTo()      |
| Signup success     | `/dashboard`   | Auto redirect           | navigateTo()      |
| `/dashboard`       | `/profil`      | Bouton "Voir profil"    | NuxtLink          |
| `/`                | `/ongs/[id]`   | Click sur Card ONG      | NuxtLink          |
| `/ongs/[id]`       | `/`            | Bouton "Retour liste"   | Router.back()     |
| Partout (connecté) | Logout → `/`   | "Déconnexion"           | authService       |

---

## 📱 Responsive & UX

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Comportements spécifiques

#### Mobile
- Header simplifié (hamburger menu potentiel)
- Cards ONGs en grille 1 colonne
- Dashboard en colonne unique

#### Desktop
- Header complet avec tous les liens
- Grille 3 colonnes pour les ONGs
- Dashboard en grille 3 colonnes

---

## 🎯 Scénarios d'usage

### Scénario 1 : Partenaire recherche une ONG environnementale

```
1. Arrive sur / (accueil)
2. Utilise le filtre "Catégorie" → Sélectionne "Environnement"
3. Liste filtrée s'affiche
4. Clique sur une ONG qui l'intéresse
5. Consulte /ongs/[id] avec tous les détails
6. Décide de suivre → Doit se connecter
7. Redirigé vers /auth/login?redirect=/ongs/[id]
8. Se connecte
9. Revient automatiquement sur la page ONG
10. Clique "Suivre cette ONG"
11. Va sur /dashboard → Voit l'ONG dans ses favoris
```

### Scénario 2 : Agent crée son compte et ajoute son ONG

```
1. Arrive sur /
2. Clique "S'inscrire" → /auth/signup
3. Sélectionne "Je suis un agent/responsable d'ONG"
4. Remplit le formulaire (email, password, nom entreprise)
5. Valide → Compte créé → /dashboard
6. Dashboard agent : Section "Mon ONG" avec état vide
7. Message "Vous n'avez pas encore d'ONG"
8. Clique "Créer mon ONG"
9. (À implémenter : formulaire création ONG)
10. Remplit les infos de l'ONG (nom, catégorie, description, etc.)
11. Valide → ONG créée
12. Dashboard mis à jour avec :
    - Image de couverture de l'ONG
    - 3 stats : Bénévoles (0), Projets (0), Transparence (0%)
    - Boutons "Voir page publique" + "Gérer mon ONG"
13. Va sur / → Voit son ONG dans la liste publique
```

### Scénario 3 : Partenaire consulte son historique de dons

```
1. Connecté sur /dashboard (partenaire)
2. Voit section "Mes Dons" avec :
   - Total des dons en haut à droite
   - Tableau complet : Date, ONG, Projet, Montant, Statut
3. Parcourt son historique de contributions
4. Clique sur une ONG dans le tableau
5. Redirigé vers /ongs/[id] pour en savoir plus
6. Peut faire un nouveau don
7. Retour sur /dashboard → Liste mise à jour
```

### Scénario 4 : Agent gère son ONG depuis le dashboard

```
1. Connecté sur /dashboard (agent)
2. Voit la card complète de son ONG :
   - Image de couverture
   - Statistiques en temps réel
   - Badge de statut (Active/En attente)
3. Clique "Gérer mon ONG"
4. Accède à l'interface de gestion (à implémenter)
5. Peut modifier :
   - Informations générales
   - Ajouter/modifier des projets
   - Gérer les opportunités de dons
   - Voir les statistiques avancées
6. Clique "Voir page publique"
7. Voit son ONG telle que les visiteurs la voient
```

### Scénario 5 : Utilisateur met à jour son profil

```
1. Connecté sur /dashboard
2. Clique "Voir mon profil"
3. Arrive sur /profil
4. Voit ses informations actuelles
5. Clique "Modifier" sur une section
6. Change son avatar, bio, localisation
7. Clique "Sauvegarder"
8. Toast de confirmation
9. Profil mis à jour visible immédiatement
```

---

## 🔮 Évolutions futures

### Pages à créer

1. **Page de recherche avancée**
   - Route : `/search`
   - Filtres multiples : catégorie, localisation, taille, impact
   - Tri : pertinence, date, popularité

2. **Espace de gestion ONG (Agent)**
   - Route : `/my-ongs`
   - Liste des ONGs gérées par l'agent
   - Stats détaillées par ONG
   - Accès rapide à l'édition

3. **Création/Édition ONG**
   - Route : `/ongs/create` et `/ongs/[id]/edit`
   - Formulaire complet multi-étapes
   - Upload d'images
   - Gestion des projets

4. **Page projets**
   - Route : `/projects`
   - Liste tous les projets actifs
   - Filtrage par ONG/catégorie

5. **Page de don**
   - Route : `/ongs/[id]/donate`
   - Formulaire de don sécurisé
   - Intégration paiement (Stripe?)

6. **Mes ONGs suivies (Partner)**
   - Route : `/favorites`
   - Liste des ONGs suivies
   - Notifications de nouveaux projets

7. **Paramètres du compte**
   - Route : `/settings`
   - Préférences utilisateur
   - Notifications
   - Sécurité (change password)

### Features à ajouter

- **Système de notifications**
- **Chat en direct (support)**
- **Blog/Actualités**
- **Système de rating/reviews pour ONGs**
- **Partage social (share buttons)**
- **Export de données (RGPD)**

---

## 📝 Notes techniques

### SSR et Client-only

**Fichiers `.client.ts` / `.client.vue`** :
- Exécutés **uniquement côté client**
- Ne peuvent pas utiliser d'APIs navigateur côté serveur
- Middleware, composables avec localStorage/window

**Fichiers universels** :
- Peuvent s'exécuter côté serveur ET client
- Doivent gérer les deux contextes
- Vérifier `typeof window !== 'undefined'`

### Supabase

**Plugin** : `plugins/supabase.client.ts`
- Initialise le client Supabase
- Écoute les changements d'auth
- Fournit `$supabase` dans l'app

**Composable** : `composables/useSupabase.client.ts`
- Accède à l'instance Supabase
- Retourne `null` côté serveur
- Utilisé dans tous les services

---

## 🎬 Conclusion

Ce user flow couvre l'ensemble de l'expérience utilisateur de **ONG Platform**, de la première visite à la gestion avancée d'une ONG.

### Points clés à retenir

1. **3 types d'utilisateurs** : Anonyme, Partner, Agent
2. **5 pages principales** : Accueil, Login, Signup, Dashboard, Profil
3. **4 middleware** de protection des routes
4. **Architecture feature-based** pour une meilleure organisation
5. **System d'auth Supabase** avec persistance localStorage

### Prochaines étapes recommandées

1. ✅ Implémenter la page `/my-ongs` pour les agents
2. ✅ Créer le formulaire de création d'ONG
3. ✅ Ajouter la page "Mot de passe oublié"
4. ✅ Système de notifications en temps réel
5. ✅ Améliorer les filtres de recherche

---

**📅 Dernière mise à jour** : 18 Janvier 2026  
**🔗 Projet** : Paika Ongs (ONG Platform)  
