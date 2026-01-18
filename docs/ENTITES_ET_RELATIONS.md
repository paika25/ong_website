# 🏗️ Entités et Relations du Système

**Version**: 1.0  
**Date**: 18 Janvier 2026  
**Description**: Documentation complète des entités métier (Agent, Partenaire, ONG) et de leurs interactions.

---

## 📑 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Entité : Agent](#entité--agent)
3. [Entité : Partenaire](#entité--partenaire)
4. [Entité : ONG](#entité--ong)
5. [Relations entre entités](#relations-entre-entités)
6. [Diagrammes d'interactions](#diagrammes-dinteractions)
7. [Flux de données](#flux-de-données)
8. [Règles métier](#règles-métier)
9. [Cas d'usage](#cas-dusage)
10. [Schéma de base de données](#schéma-de-base-de-données)

---

## 🎯 Vue d'ensemble

### Concept central

Le système repose sur **3 entités principales** qui interagissent pour créer un écosystème de solidarité :

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   AGENT     │◄───────►│     ONG     │◄───────►│ PARTENAIRE  │
│             │  possède│             │soutient │             │
│  (Créateur) │         │(Organisation)│        │ (Donateur)  │
└─────────────┘         └─────────────┘         └─────────────┘
```

### Principe fondamental

> **"1 Agent = 1 ONG"**  
> Chaque agent ne peut créer et gérer qu'**une seule organisation**.  
> Cela garantit la qualité, l'engagement et la responsabilité.

---

## 👤 Entité : Agent

### Définition

Un **Agent** est un **utilisateur créateur** qui représente et gère une organisation caritative (ONG).

### Caractéristiques

| Propriété | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Identifiant unique (hérité de Supabase Auth) |
| `email` | String | Email de connexion (unique) |
| `full_name` | String | Nom complet de l'agent |
| `account_type` | Enum | `'user_agent'` (fixe) |
| `avatar_url` | String? | URL de la photo de profil |
| `phone` | String? | Numéro de téléphone |
| `bio` | Text? | Présentation personnelle |
| `created_at` | Timestamp | Date de création du compte |
| `updated_at` | Timestamp | Dernière modification |

### Rôle et responsabilités

#### ✅ Peut faire :
- **Créer** une ONG unique
- **Gérer** sa propre ONG (informations, projets, financials)
- **Publier** des projets pour son ONG
- **Modérer** les commentaires sur sa page ONG
- **Voir** les statistiques de son ONG (vues, dons, engagement)
- **Mettre à jour** les informations de transparence financière
- **Répondre** aux messages des partenaires
- **Consulter** la liste des donateurs de son ONG

#### ❌ Ne peut pas faire :
- Créer plusieurs ONGs
- Modifier les ONGs d'autres agents
- Faire des dons (réservé aux partenaires)
- Supprimer son ONG si elle a des dons actifs

### Cycle de vie

```
┌─────────────────────────────────────────────────────────────┐
│  CYCLE DE VIE D'UN AGENT                                    │
└─────────────────────────────────────────────────────────────┘

1. Inscription
   ↓
   [Création compte + Vérification email]
   ↓
2. Profil incomplet
   ↓
   [Complétion informations personnelles]
   ↓
3. Agent sans ONG
   ↓
   [Création de son ONG unique]
   ↓
4. Agent avec ONG
   ↓
   [Gestion quotidienne : projets, stats, transparence]
   ↓
5. Agent actif (ONG vérifiée)
   ↓
   [Réception de dons, engagement communauté]
```

### Interface utilisateur

#### Dashboard Agent
```
┌─────────────────────────────────────────────────────────────┐
│  Mon ONG                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Image de couverture]                               │   │
│  │                                                       │   │
│  │  Nom de l'ONG                            [Active ✓]  │   │
│  │  Description complète...                             │   │
│  │  🏷️ Éducation | 📍 Paris, France                   │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │👥 150    │  │✅ 8      │  │📊 95%    │         │   │
│  │  │Bénévoles │  │Projets   │  │Transparence│       │   │
│  │  └──────────┘  └──────────┘  └──────────┘         │   │
│  │                                                       │   │
│  │  [Voir page publique]  [Gérer mon ONG]              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Points d'entrée API

```typescript
// Récupérer l'ONG de l'agent
GET /api/agents/{agentId}/ong

// Créer son ONG (une seule fois)
POST /api/ongs
Body: { name, description, category, location, ... }

// Mettre à jour son ONG
PATCH /api/ongs/{ongId}
Body: { description?, projects?, financials?, ... }

// Obtenir les statistiques
GET /api/ongs/{ongId}/stats

// Gérer les projets
POST /api/ongs/{ongId}/projects
PATCH /api/projects/{projectId}
DELETE /api/projects/{projectId}
```

---

## 💝 Entité : Partenaire

### Définition

Un **Partenaire** est un **utilisateur donateur** qui soutient des ONGs via des dons financiers ou du bénévolat.

### Caractéristiques

| Propriété | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Identifiant unique (hérité de Supabase Auth) |
| `email` | String | Email de connexion (unique) |
| `full_name` | String | Nom complet du partenaire |
| `account_type` | Enum | `'user_partner'` (fixe) |
| `avatar_url` | String? | URL de la photo de profil |
| `phone` | String? | Numéro de téléphone |
| `bio` | Text? | Présentation personnelle |
| `total_donated` | Decimal | Montant total des dons (calculé) |
| `favorite_ongs` | UUID[] | Liste des ONGs suivies |
| `created_at` | Timestamp | Date de création du compte |
| `updated_at` | Timestamp | Dernière modification |

### Rôle et responsabilités

#### ✅ Peut faire :
- **Faire des dons** à n'importe quelle ONG
- **Suivre** (favoris) plusieurs ONGs
- **Consulter** l'historique de ses dons
- **Voir** les pages publiques des ONGs
- **Évaluer** les ONGs (notes et avis)
- **Recevoir** des notifications sur les ONGs suivies
- **Télécharger** les reçus fiscaux de dons
- **Filtrer** les ONGs par catégorie, localisation
- **S'inscrire** comme bénévole pour des projets

#### ❌ Ne peut pas faire :
- Créer ou gérer une ONG
- Modifier les informations d'une ONG
- Voir les données privées d'une ONG
- Annuler un don après validation

### Cycle de vie

```
┌─────────────────────────────────────────────────────────────┐
│  CYCLE DE VIE D'UN PARTENAIRE                               │
└─────────────────────────────────────────────────────────────┘

1. Inscription
   ↓
   [Création compte + Vérification email]
   ↓
2. Exploration
   ↓
   [Navigation sur les pages ONGs]
   ↓
3. Premier engagement
   ↓
   [Premier don OU ajout aux favoris]
   ↓
4. Partenaire actif
   ↓
   [Dons réguliers, suivi d'ONGs, bénévolat]
   ↓
5. Partenaire fidèle (>5 dons)
   ↓
   [Badges, reconnaissance, avantages]
```

### Interface utilisateur

#### Dashboard Partenaire
```
┌─────────────────────────────────────────────────────────────┐
│  Mes Dons                              Total : 225 €         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Date       │ ONG          │ Projet      │ Montant   │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 15 jan 2026│ Enfants...   │ Éducation   │ 50 €    ✓│   │
│  │ 10 jan 2026│ Croix-Rouge  │ Urgence     │ 100 €   ✓│   │
│  │ 05 jan 2026│ Greenpeace   │ Climat      │ 75 €    ✓│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Mes ONGs Suivies (3)                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ [Logo 1] │  │ [Logo 2] │  │ [Logo 3] │                 │
│  │ ONG 1    │  │ ONG 2    │  │ ONG 3    │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Points d'entrée API

```typescript
// Récupérer l'historique des dons
GET /api/partners/{partnerId}/donations

// Faire un don
POST /api/donations
Body: { ong_id, project_id?, amount, message? }

// Gérer les favoris
GET /api/partners/{partnerId}/favorites
POST /api/partners/{partnerId}/favorites/{ongId}
DELETE /api/partners/{partnerId}/favorites/{ongId}

// Télécharger un reçu
GET /api/donations/{donationId}/receipt

// S'inscrire comme bénévole
POST /api/volunteers
Body: { ong_id, project_id, availability, skills }
```

---

## 🏢 Entité : ONG

### Définition

Une **ONG** (Organisation Non Gouvernementale) est l'**entité centrale** créée par un Agent pour représenter son organisation caritative.

### Caractéristiques principales

| Propriété | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Identifiant unique |
| `owner_id` | UUID | ID de l'agent propriétaire (FK → users) |
| `name` | String | Nom de l'organisation (unique) |
| `slug` | String | URL-friendly (ex: "enfants-du-monde") |
| `description` | Text | Description complète de la mission |
| `category` | Enum | Éducation, Santé, Environnement, etc. |
| `status` | Enum | `'active'`, `'pending'`, `'suspended'` |
| `image_url` | String? | Image de couverture |
| `logo_url` | String? | Logo de l'organisation |
| `website` | String? | Site web officiel |
| `email` | String | Email de contact |
| `phone` | String? | Téléphone de contact |
| `address` | JSON | Adresse complète |
| `founded_year` | Integer? | Année de création |
| `registration_number` | String? | Numéro d'enregistrement officiel |
| `total_volunteers` | Integer | Nombre de bénévoles (calculé) |
| `total_projects` | Integer | Nombre de projets (calculé) |
| `total_received` | Decimal | Montant total reçu (calculé) |
| `transparency_score` | Integer | Score de transparence (0-100) |
| `view_count` | Integer | Nombre de vues de la page |
| `created_at` | Timestamp | Date de création |
| `updated_at` | Timestamp | Dernière modification |

### Sous-entités

#### 1. Projets (`projects`)

Chaque ONG peut avoir **plusieurs projets** :

```typescript
{
  id: UUID
  ong_id: UUID  // FK → ongs
  name: String
  description: Text
  goal_amount: Decimal?  // Objectif financier
  raised_amount: Decimal  // Montant collecté
  start_date: Date
  end_date: Date?
  status: 'active' | 'completed' | 'cancelled'
  image_url: String?
  category: String
}
```

#### 2. Informations financières (`financials`)

```typescript
{
  id: UUID
  ong_id: UUID  // FK → ongs
  year: Integer
  total_income: Decimal
  total_expenses: Decimal
  admin_costs_percentage: Decimal
  program_costs_percentage: Decimal
  fundraising_costs_percentage: Decimal
  reserves: Decimal
  audit_report_url: String?
  transparency_score: Integer  // Auto-calculé
}
```

#### 3. Témoignages (`testimonials`)

```typescript
{
  id: UUID
  ong_id: UUID  // FK → ongs
  author_name: String
  author_role: String?  // "Bénévole", "Bénéficiaire", etc.
  content: Text
  rating: Integer  // 1-5
  created_at: Timestamp
}
```

### États et transitions

```
┌─────────────────────────────────────────────────────────────┐
│  ÉTATS D'UNE ONG                                            │
└─────────────────────────────────────────────────────────────┘

[pending]  (En attente de validation)
    ↓
    ├─[approved]→ [active]  (Active et visible publiquement)
    │
    └─[rejected]→ [suspended]  (Rejetée ou suspendue)

[active]
    ↓
    ├─[temporary_issue]→ [suspended]  (Suspension temporaire)
    │                         ↓
    │                    [resolved]→ [active]
    │
    └─[deleted_by_agent]→ [archived]  (Supprimée)
```

### Règles de validation

✅ **Pour être Active**, une ONG doit avoir :
- [ ] Nom et description complets
- [ ] Catégorie définie
- [ ] Informations de contact valides
- [ ] Au moins 1 projet défini
- [ ] Score de transparence ≥ 50%

### Interface utilisateur

#### Page publique ONG (vue par tous)
```
┌─────────────────────────────────────────────────────────────┐
│  [Image de couverture]                                       │
│                                                              │
│  ┌─────┐  Nom de l'ONG                         [Active ✓]  │
│  │Logo │  🏷️ Catégorie | 📍 Localisation                  │
│  └─────┘                                                     │
│          [❤️ Suivre]  [💰 Faire un don]                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📝 À propos                                          │  │
│  │  Description complète de la mission...                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✅ Projets en cours (3)                             │  │
│  │  ┌───────┐  ┌───────┐  ┌───────┐                    │  │
│  │  │Projet1│  │Projet2│  │Projet3│                    │  │
│  │  └───────┘  └───────┘  └───────┘                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📊 Transparence financière (95%)                    │  │
│  │  ██████████████████░░                                │  │
│  │  - Coûts admin: 5%                                   │  │
│  │  - Programmes: 90%                                   │  │
│  │  - Collecte: 5%                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Points d'entrée API

```typescript
// Liste publique des ONGs (filtrée)
GET /api/ongs?category=education&location=paris

// Détails d'une ONG
GET /api/ongs/{ongId}

// Projets d'une ONG
GET /api/ongs/{ongId}/projects

// Informations financières
GET /api/ongs/{ongId}/financials

// Statistiques publiques
GET /api/ongs/{ongId}/stats
```

---

## 🔗 Relations entre entités

### 1. Agent ↔ ONG (1:1)

**Relation** : Un Agent **possède** une ONG unique

```
┌─────────────┐         ┌─────────────┐
│   AGENT     │ 1     1 │     ONG     │
│             ├────────►│             │
│  owner_id   │ possède │ id          │
└─────────────┘         └─────────────┘
```

**Contraintes** :
- ✅ Un agent peut créer **exactement 1 ONG** (pas 0, pas 2+)
- ✅ Une ONG appartient à **exactement 1 agent**
- ✅ Si l'agent supprime son compte → ONG archivée (soft delete)

**Implémentation** :
```sql
ALTER TABLE ongs
ADD CONSTRAINT unique_owner_id UNIQUE (owner_id);
```

### 2. Partenaire ↔ ONG (N:N via Dons)

**Relation** : Un Partenaire **soutient** plusieurs ONGs via des **Dons**

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  PARTENAIRE  │ N     M │     DONS     │ M     1 │     ONG      │
│              ├────────►│              │◄────────┤              │
│  id          │ donne à│ partner_id   │provient │ id           │
└──────────────┘         │ ong_id       │    de   └──────────────┘
                         │ amount       │
                         │ date         │
                         └──────────────┘
```

**Contraintes** :
- ✅ Un partenaire peut donner à **plusieurs ONGs**
- ✅ Une ONG peut recevoir de **plusieurs partenaires**
- ✅ Chaque don est **traçable et horodaté**

**Implémentation** :
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES users(id),
  ong_id UUID REFERENCES ongs(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Partenaire ↔ ONG (N:N via Favoris)

**Relation** : Un Partenaire **suit** plusieurs ONGs

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  PARTENAIRE  │ N     M │   FAVORIS    │ M     1 │     ONG      │
│              ├────────►│              │◄────────┤              │
│  id          │  suit  │ partner_id   │  suivie │ id           │
└──────────────┘         │ ong_id       │     par └──────────────┘
                         │ created_at   │
                         └──────────────┘
```

**Contraintes** :
- ✅ Un partenaire peut suivre **N ONGs**
- ✅ Une ONG peut être suivie par **M partenaires**
- ✅ Pas de doublon (contrainte unique sur `partner_id + ong_id`)

### 4. ONG ↔ Projets (1:N)

**Relation** : Une ONG **a** plusieurs Projets

```
┌─────────────┐         ┌─────────────┐
│     ONG     │ 1     N │   PROJETS   │
│             ├────────►│             │
│  id         │    a    │ ong_id      │
└─────────────┘         │ name        │
                        │ goal_amount │
                        └─────────────┘
```

**Contraintes** :
- ✅ Une ONG peut avoir **plusieurs projets**
- ✅ Un projet appartient à **1 seule ONG**
- ✅ Si l'ONG est supprimée → projets archivés

### Diagramme complet

```
┌─────────────┐
│   AGENT     │
│ (user_agent)│
└──────┬──────┘
       │ 1:1 possède
       ↓
┌──────────────────────────┐
│          ONG             │
│                          │
│  - name                  │
│  - description           │◄────────────┐
│  - category              │             │
│  - transparency_score    │             │
│  - total_volunteers      │             │
└──────┬──────────────┬────┘             │
       │              │                  │
       │ 1:N          │ M:N              │ M:N
       │              │                  │
       ↓              ↓                  │
┌──────────┐   ┌─────────────┐    ┌─────┴─────────┐
│ PROJETS  │   │    DONS     │    │   FAVORIS     │
│          │   │             │    │               │
│ - name   │   │ - amount    │    │ - created_at  │
│ - goal   │   │ - date      │    └───────────────┘
│ - raised │   │ - status    │           ↑
└──────────┘   └─────────────┘           │
                      ↑                  │
                      │ N:M              │ N:M
                      │                  │
               ┌──────┴──────────────────┘
               │
        ┌──────┴────────┐
        │  PARTENAIRE   │
        │(user_partner) │
        │               │
        │ - total_donated│
        └───────────────┘
```

---

## 💬 Diagrammes d'interactions

### Scénario 1 : Agent crée son ONG

```
┌──────┐                  ┌────────┐              ┌──────────┐
│Agent │                  │ Système│              │ Database │
└───┬──┘                  └───┬────┘              └────┬─────┘
    │                         │                        │
    │ 1. Clic "Créer mon ONG" │                        │
    ├────────────────────────►│                        │
    │                         │                        │
    │ 2. Formulaire multi-step│                        │
    │◄────────────────────────┤                        │
    │                         │                        │
    │ 3. Soumet données       │                        │
    ├────────────────────────►│                        │
    │                         │                        │
    │                         │ 4. Validation         │
    │                         ├───────────────────────►│
    │                         │                        │
    │                         │ 5. Vérifie: 1 agent = 1 ONG
    │                         │    (SELECT COUNT(*) WHERE owner_id)
    │                         │◄───────────────────────┤
    │                         │                        │
    │                         │ 6. INSERT INTO ongs    │
    │                         ├───────────────────────►│
    │                         │                        │
    │                         │ 7. Succès              │
    │                         │◄───────────────────────┤
    │                         │                        │
    │ 8. Redirect /dashboard  │                        │
    │◄────────────────────────┤                        │
    │                         │                        │
    │ 9. Affiche ONG créée    │                        │
    │◄────────────────────────┤                        │
```

### Scénario 2 : Partenaire fait un don

```
┌───────────┐           ┌────────┐           ┌──────────┐          ┌─────┐
│Partenaire │           │ Système│           │ Database │          │ ONG │
└─────┬─────┘           └───┬────┘           └────┬─────┘          └──┬──┘
      │                     │                     │                   │
      │ 1. Visite page ONG  │                     │                   │
      ├────────────────────►│                     │                   │
      │                     │                     │                   │
      │ 2. Clic "Faire don" │                     │                   │
      ├────────────────────►│                     │                   │
      │                     │                     │                   │
      │ 3. Modal donation   │                     │                   │
      │◄────────────────────┤                     │                   │
      │                     │                     │                   │
      │ 4. Remplit montant  │                     │                   │
      │    + projet         │                     │                   │
      ├────────────────────►│                     │                   │
      │                     │                     │                   │
      │                     │ 5. INSERT donation  │                   │
      │                     ├────────────────────►│                   │
      │                     │                     │                   │
      │                     │ 6. UPDATE ong stats │                   │
      │                     │    (total_received) │                   │
      │                     ├────────────────────►│                   │
      │                     │                     │                   │
      │                     │                     │ 7. Notify agent   │
      │                     │                     ├──────────────────►│
      │                     │                     │                   │
      │ 8. Reçu fiscal     │                     │                   │
      │◄────────────────────┤                     │                   │
      │                     │                     │                   │
      │ 9. Update dashboard │                     │                   │
      │    (new donation)   │                     │                   │
      │◄────────────────────┤                     │                   │
```

### Scénario 3 : Agent gère son ONG

```
┌──────┐                  ┌────────┐              ┌──────────┐
│Agent │                  │ Système│              │ Database │
└───┬──┘                  └───┬────┘              └────┬─────┘
    │                         │                        │
    │ 1. Dashboard           │                        │
    ├────────────────────────►│                        │
    │                         │                        │
    │                         │ 2. Load ONG (owner_id) │
    │                         ├───────────────────────►│
    │                         │                        │
    │                         │ 3. Return ONG + stats  │
    │                         │◄───────────────────────┤
    │                         │                        │
    │ 4. Affiche carte ONG    │                        │
    │◄────────────────────────┤                        │
    │                         │                        │
    │ 5. Clic "Gérer mon ONG" │                        │
    ├────────────────────────►│                        │
    │                         │                        │
    │ 6. Page édition         │                        │
    │◄────────────────────────┤                        │
    │                         │                        │
    │ 7. Modifie description  │                        │
    │    + ajoute projet      │                        │
    ├────────────────────────►│                        │
    │                         │                        │
    │                         │ 8. UPDATE ongs         │
    │                         ├───────────────────────►│
    │                         │                        │
    │                         │ 9. INSERT project      │
    │                         ├───────────────────────►│
    │                         │                        │
    │                         │ 10. Recalcul stats     │
    │                         │◄───────────────────────┤
    │                         │                        │
    │ 11. Toast succès        │                        │
    │◄────────────────────────┤                        │
    │                         │                        │
    │ 12. Redirect dashboard  │                        │
    │◄────────────────────────┤                        │
```

---

## 📊 Flux de données

### Flux 1 : Création d'ONG

```
[Agent] → Formulaire création
    ↓
[Frontend] → Validation client
    ↓
[API] /api/ongs (POST)
    ↓
[Middleware] → Vérification auth + type agent
    ↓
[Business Logic] → Vérification "1 agent = 1 ONG"
    │
    ├─ Si agent a déjà une ONG → Error 409
    │
    └─ Sinon → Continue
        ↓
[Database] → INSERT INTO ongs
    ↓
[Auto-calculations] → Init stats (volunteers=0, projects=0)
    ↓
[Response] → ONG créée avec ID
    ↓
[Frontend] → Redirect dashboard + Toast succès
```

### Flux 2 : Donation

```
[Partenaire] → Sélection ONG + montant
    ↓
[Frontend] → Validation montant (≥1€)
    ↓
[API] /api/donations (POST)
    ↓
[Middleware] → Vérification auth + type partner
    ↓
[Payment Gateway] → Traitement paiement
    │
    ├─ Si échec → Error 402 + Rollback
    │
    └─ Si succès → Continue
        ↓
[Database] → Transaction
    │
    ├─ INSERT INTO donations
    ├─ UPDATE ongs.total_received += amount
    └─ UPDATE projects.raised_amount += amount (si project_id)
    ↓
[Notifications] → Email agent + partenaire
    ↓
[Response] → Donation confirmée
    ↓
[Frontend] → Update dashboard + Reçu fiscal
```

### Flux 3 : Consultation publique ONG

```
[Visiteur anonyme/connecté] → Visite /ongs/[slug]
    ↓
[API] /api/ongs/[id] (GET)
    ↓
[Cache] → Check cache (1h TTL)
    │
    ├─ Si cache hit → Return cached data
    │
    └─ Si cache miss → Continue
        ↓
[Database] → Query ONG + projects + financials
    ↓
[Database] → UPDATE ongs.view_count += 1
    ↓
[Response] → ONG complète
    ↓
[Frontend] → Render page publique
```

---

## ⚖️ Règles métier

### Règle 1 : Unicité ONG par Agent

> **"1 Agent = 1 ONG"**

**Implémentation** :
```sql
-- Contrainte DB
ALTER TABLE ongs
ADD CONSTRAINT unique_owner_id UNIQUE (owner_id);

-- Vérification applicative
async function createONG(agentId: string, data: OngData) {
  const existingOng = await db
    .select()
    .from('ongs')
    .where('owner_id', agentId)
    .first()
  
  if (existingOng) {
    throw new Error('Agent already has an ONG')
  }
  
  // Continue creation...
}
```

### Règle 2 : Validation avant Activation

Une ONG ne peut passer à `status='active'` que si :

```typescript
interface OngValidation {
  hasName: boolean          // ✅ Nom rempli
  hasDescription: boolean   // ✅ Description ≥100 caractères
  hasCategory: boolean      // ✅ Catégorie sélectionnée
  hasContact: boolean       // ✅ Email + téléphone valides
  hasProject: boolean       // ✅ Au moins 1 projet
  hasFinancials: boolean    // ✅ Infos financières remplies
  transparencyScore: number // ✅ Score ≥ 50%
}

function canActivate(ong: ONG): boolean {
  return (
    ong.name &&
    ong.description.length >= 100 &&
    ong.category &&
    ong.email && ong.phone &&
    ong.projects.length > 0 &&
    ong.financials &&
    ong.transparency_score >= 50
  )
}
```

### Règle 3 : Montant minimum de don

```typescript
const MIN_DONATION_AMOUNT = 1 // 1€

function validateDonation(amount: number): boolean {
  if (amount < MIN_DONATION_AMOUNT) {
    throw new Error(`Le montant minimum est ${MIN_DONATION_AMOUNT}€`)
  }
  return true
}
```

### Règle 4 : Calcul du score de transparence

```typescript
function calculateTransparencyScore(financials: Financials): number {
  let score = 0
  
  // +30 points : Rapport annuel disponible
  if (financials.audit_report_url) score += 30
  
  // +20 points : Coûts admin ≤ 15%
  if (financials.admin_costs_percentage <= 15) score += 20
  
  // +25 points : Coûts programmes ≥ 75%
  if (financials.program_costs_percentage >= 75) score += 25
  
  // +15 points : Détails complets (revenus + dépenses)
  if (financials.total_income && financials.total_expenses) score += 15
  
  // +10 points : Historique multi-années
  if (financials.years_count >= 3) score += 10
  
  return Math.min(score, 100) // Cap à 100
}
```

### Règle 5 : Suppression d'ONG

Une ONG **ne peut pas** être supprimée si :
- Elle a reçu des dons au cours des 12 derniers mois
- Elle a des projets actifs avec des fonds collectés
- Elle est suivie par plus de 10 partenaires

```typescript
async function canDeleteOng(ongId: string): Promise<boolean> {
  const ong = await getOng(ongId)
  
  // Vérifie dons récents
  const recentDonations = await db
    .select()
    .from('donations')
    .where('ong_id', ongId)
    .where('created_at', '>=', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))
  
  if (recentDonations.length > 0) return false
  
  // Vérifie projets actifs
  const activeProjects = await db
    .select()
    .from('projects')
    .where('ong_id', ongId)
    .where('status', 'active')
    .where('raised_amount', '>', 0)
  
  if (activeProjects.length > 0) return false
  
  // Vérifie followers
  const followersCount = await db
    .count()
    .from('favorites')
    .where('ong_id', ongId)
  
  if (followersCount > 10) return false
  
  return true
}
```

---

## 🎬 Cas d'usage

### CU-01 : Agent crée son ONG

**Acteur principal** : Agent  
**Préconditions** :
- Agent authentifié
- Agent n'a pas encore d'ONG

**Scénario principal** :
1. Agent accède à son dashboard
2. Système affiche message "Vous n'avez pas encore d'ONG"
3. Agent clique sur "Créer mon ONG"
4. Système affiche formulaire multi-step
5. **Step 1** : Agent remplit infos générales (nom, description, catégorie)
6. **Step 2** : Agent remplit localisation et contact
7. **Step 3** : Agent ajoute son premier projet
8. **Step 4** : Agent remplit infos financières
9. Agent soumet le formulaire
10. Système valide les données
11. Système crée l'ONG avec `status='pending'`
12. Système redirige vers dashboard
13. Système affiche toast "ONG créée avec succès"

**Scénario alternatif 9a** : Validation échoue
- 9a.1. Système affiche erreurs par champ
- 9a.2. Agent corrige et soumet à nouveau
- Retour à l'étape 10

**Postconditions** :
- ONG créée en base
- `ongs.owner_id` = Agent ID
- Agent voit sa ONG dans le dashboard

---

### CU-02 : Partenaire fait un don

**Acteur principal** : Partenaire  
**Préconditions** :
- Partenaire authentifié
- ONG existe et est active

**Scénario principal** :
1. Partenaire visite page publique d'une ONG
2. Système affiche infos ONG + bouton "Faire un don"
3. Partenaire clique sur "Faire un don"
4. Système affiche modal avec :
   - Choix du montant
   - Sélection du projet (optionnel)
   - Message personnel (optionnel)
5. Partenaire remplit montant (ex: 50€)
6. Partenaire sélectionne un projet
7. Partenaire clique "Confirmer"
8. Système redirige vers page de paiement
9. Partenaire valide le paiement
10. Système traite le paiement
11. Système enregistre la donation
12. Système met à jour stats ONG
13. Système envoie emails (partenaire + agent)
14. Système affiche page de confirmation + reçu
15. Partenaire voit le don dans son dashboard

**Scénario alternatif 10a** : Paiement échoue
- 10a.1. Système affiche erreur paiement
- 10a.2. Système propose de réessayer
- Retour à l'étape 8

**Postconditions** :
- Donation enregistrée avec `status='completed'`
- `ongs.total_received` incrémenté
- `projects.raised_amount` incrémenté
- Emails envoyés

---

### CU-03 : Agent met à jour son ONG

**Acteur principal** : Agent  
**Préconditions** :
- Agent authentifié
- Agent possède une ONG

**Scénario principal** :
1. Agent accède à son dashboard
2. Système affiche carte de son ONG
3. Agent clique "Gérer mon ONG"
4. Système affiche page d'édition avec tabs :
   - Informations générales
   - Projets
   - Finances
   - Paramètres
5. Agent modifie la description
6. Agent ajoute un nouveau projet
7. Agent upload une nouvelle image de couverture
8. Agent clique "Enregistrer"
9. Système valide les modifications
10. Système met à jour l'ONG
11. Système recalcule le score de transparence
12. Système affiche toast "Modifications enregistrées"
13. Système redirige vers dashboard
14. Agent voit les modifications appliquées

**Scénario alternatif 9a** : Validation échoue
- 9a.1. Système affiche erreurs
- 9a.2. Agent corrige
- Retour à l'étape 8

**Postconditions** :
- ONG mise à jour en base
- `transparency_score` recalculé
- `updated_at` mis à jour

---

### CU-04 : Partenaire suit une ONG

**Acteur principal** : Partenaire  
**Préconditions** :
- Partenaire authentifié
- ONG existe et est active

**Scénario principal** :
1. Partenaire visite page d'une ONG
2. Système affiche bouton "❤️ Suivre"
3. Partenaire clique sur "Suivre"
4. Système ajoute l'ONG aux favoris
5. Système change le bouton en "✓ Suivi"
6. Système affiche toast "Vous suivez maintenant [ONG]"
7. ONG apparaît dans la section "Mes ONGs suivies" du dashboard

**Scénario alternatif 4a** : ONG déjà suivie
- 4a.1. Système retire l'ONG des favoris (toggle)
- 4a.2. Bouton redevient "❤️ Suivre"

**Postconditions** :
- Entrée créée dans `favorites`
- Partenaire recevra notifications de cette ONG

---

## 🗄️ Schéma de base de données

### Table : `users` (Supabase Auth + Extensions)

```sql
CREATE TABLE users (
  -- Hérité de Supabase Auth
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- Extensions custom
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('user_agent', 'user_partner')),
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  bio TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_account_type ON users(account_type);
```

### Table : `ongs`

```sql
CREATE TABLE ongs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informations principales
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  
  -- Médias
  image_url TEXT,
  logo_url TEXT,
  
  -- Contact
  website TEXT,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address JSONB,
  
  -- Informations légales
  founded_year INTEGER,
  registration_number VARCHAR(100),
  
  -- Statistiques (calculées)
  total_volunteers INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  total_received DECIMAL(12, 2) DEFAULT 0,
  transparency_score INTEGER DEFAULT 0 CHECK (transparency_score BETWEEN 0 AND 100),
  view_count INTEGER DEFAULT 0,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_ongs_owner ON ongs(owner_id);
CREATE INDEX idx_ongs_category ON ongs(category);
CREATE INDEX idx_ongs_status ON ongs(status);
CREATE INDEX idx_ongs_slug ON ongs(slug);

-- Fonction de génération de slug
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Trigger auto-slug
CREATE TRIGGER set_ong_slug
BEFORE INSERT ON ongs
FOR EACH ROW
EXECUTE FUNCTION generate_slug_trigger();
```

### Table : `projects`

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  
  -- Financier
  goal_amount DECIMAL(10, 2),
  raised_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  
  -- État
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  
  -- Médias
  image_url TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_ong ON projects(ong_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### Table : `donations`

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Montant
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 1),
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- État
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  
  -- Détails
  message TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  
  -- Paiement
  payment_id VARCHAR(255),
  payment_method VARCHAR(50),
  
  -- Fiscal
  receipt_url TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donations_partner ON donations(partner_id);
CREATE INDEX idx_donations_ong ON donations(ong_id);
CREATE INDEX idx_donations_project ON donations(project_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_date ON donations(created_at DESC);
```

### Table : `favorites`

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(partner_id, ong_id)
);

CREATE INDEX idx_favorites_partner ON favorites(partner_id);
CREATE INDEX idx_favorites_ong ON favorites(ong_id);
```

### Table : `financials`

```sql
CREATE TABLE financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  
  year INTEGER NOT NULL,
  
  total_income DECIMAL(12, 2) NOT NULL,
  total_expenses DECIMAL(12, 2) NOT NULL,
  
  -- Répartition des coûts (%)
  admin_costs_percentage DECIMAL(5, 2) CHECK (admin_costs_percentage BETWEEN 0 AND 100),
  program_costs_percentage DECIMAL(5, 2) CHECK (program_costs_percentage BETWEEN 0 AND 100),
  fundraising_costs_percentage DECIMAL(5, 2) CHECK (fundraising_costs_percentage BETWEEN 0 AND 100),
  
  reserves DECIMAL(12, 2) DEFAULT 0,
  audit_report_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(ong_id, year)
);

CREATE INDEX idx_financials_ong ON financials(ong_id);
CREATE INDEX idx_financials_year ON financials(year DESC);
```

### Vue : `ongs_with_stats` (Vue matérialisée pour performance)

```sql
CREATE MATERIALIZED VIEW ongs_with_stats AS
SELECT 
  o.*,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT d.id) as donation_count,
  COALESCE(SUM(d.amount), 0) as total_donated,
  COUNT(DISTINCT f.partner_id) as follower_count
FROM ongs o
LEFT JOIN projects p ON p.ong_id = o.id AND p.status = 'active'
LEFT JOIN donations d ON d.ong_id = o.id AND d.status = 'completed'
LEFT JOIN favorites f ON f.ong_id = o.id
GROUP BY o.id;

-- Rafraîchir toutes les heures
CREATE INDEX idx_ongs_stats_refresh ON ongs_with_stats(id);
```

---

## 🔄 Triggers et fonctions automatiques

### Trigger 1 : Mise à jour auto du score de transparence

```sql
CREATE OR REPLACE FUNCTION update_transparency_score()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Calcul du score
  IF NEW.audit_report_url IS NOT NULL THEN
    score := score + 30;
  END IF;
  
  IF NEW.admin_costs_percentage <= 15 THEN
    score := score + 20;
  END IF;
  
  IF NEW.program_costs_percentage >= 75 THEN
    score := score + 25;
  END IF;
  
  IF NEW.total_income > 0 AND NEW.total_expenses > 0 THEN
    score := score + 15;
  END IF;
  
  -- Mise à jour de l'ONG
  UPDATE ongs 
  SET transparency_score = score,
      updated_at = NOW()
  WHERE id = NEW.ong_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transparency
AFTER INSERT OR UPDATE ON financials
FOR EACH ROW
EXECUTE FUNCTION update_transparency_score();
```

### Trigger 2 : Mise à jour auto des totaux ONG

```sql
CREATE OR REPLACE FUNCTION update_ong_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Mise à jour total_received
    UPDATE ongs
    SET total_received = (
      SELECT COALESCE(SUM(amount), 0)
      FROM donations
      WHERE ong_id = NEW.ong_id AND status = 'completed'
    ),
    updated_at = NOW()
    WHERE id = NEW.ong_id;
    
    -- Si donation liée à un projet
    IF NEW.project_id IS NOT NULL THEN
      UPDATE projects
      SET raised_amount = (
        SELECT COALESCE(SUM(amount), 0)
        FROM donations
        WHERE project_id = NEW.project_id AND status = 'completed'
      )
      WHERE id = NEW.project_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ong_totals
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_ong_totals();
```

### Trigger 3 : Compteur de projets

```sql
CREATE OR REPLACE FUNCTION update_project_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ongs
  SET total_projects = (
    SELECT COUNT(*)
    FROM projects
    WHERE ong_id = COALESCE(NEW.ong_id, OLD.ong_id)
  )
  WHERE id = COALESCE(NEW.ong_id, OLD.ong_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_count
AFTER INSERT OR DELETE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_project_count();
```

---

## 📚 Conclusion

Ce document décrit l'architecture complète des entités du système :

✅ **3 entités principales** : Agent, Partenaire, ONG  
✅ **Relations claires** : 1:1, 1:N, N:N  
✅ **Règles métier** : 1 agent = 1 ONG, validations, calculs auto  
✅ **Interactions détaillées** : Diagrammes de séquence  
✅ **Cas d'usage** : Scénarios complets  
✅ **Base de données** : Schéma SQL avec contraintes et triggers  

Ce modèle garantit :
- 🎯 **Clarté** : Chaque rôle a des responsabilités précises
- 🔒 **Intégrité** : Contraintes DB + validations applicatives
- ⚡ **Performance** : Vues matérialisées, index, calculs optimisés
- 📊 **Traçabilité** : Toutes les actions sont enregistrées
- 🚀 **Évolutivité** : Architecture modulaire et extensible

---

**Version**: 1.0  
**Date**: 18 Janvier 2026  
**Auteur**: Équipe Dev ONG Platform  
**Prochaines mises à jour** : Ajout entités Bénévolat, Événements, Notifications
