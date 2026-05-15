# Modèles de données — Paika ONG Platform

**Date :** 2026-05-13
**Base de données :** Supabase (PostgreSQL)
**Migrations :** `supabase/migrations/` (01 → 17)

---

## Schéma global

```
auth.users (Supabase Auth)
    │
    └──► accounts (id = auth.users.id)
              │
              └──► ongs (account_id → accounts.id)
                        │
                        ├──► ong_documents
                        ├──► dossier_messages
                        ├──► financial_transactions
                        ├──► score_history
                        └──► audit_trail (ong_id → ongs.id)
                                  └── performed_by → accounts.id
```

---

## Table : `accounts`

Comptes utilisateurs liés à `auth.users`.

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PK | = `auth.users.id` |
| `email` | TEXT | UNIQUE NOT NULL | Email de connexion |
| `password_hash` | TEXT | NOT NULL | Hash mot de passe |
| `account_type` | TEXT | CHECK | `user_partner` \| `user_agent` \| `admin` |
| `first_name` | TEXT | — | Prénom |
| `last_name` | TEXT | — | Nom |
| `company_name` | TEXT | — | Entreprise (partenaires) |
| `avatar` | TEXT | — | URL avatar |
| `bio` | TEXT | — | Biographie |
| `location` | TEXT | — | Ville |
| `website` | TEXT | — | Site web |
| `verified` | BOOLEAN | DEFAULT false | Compte vérifié |
| `created_at` | TIMESTAMP | DEFAULT now() | — |
| `updated_at` | TIMESTAMP | DEFAULT now() | — |

---

## Table : `ongs`

Dossiers ONG soumis à certification.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID PK | Identifiant |
| `account_id` | UUID FK→accounts | Propriétaire (agent) |
| `name` | TEXT | Nom de l'ONG |
| `description` | TEXT | Description |
| `category` | TEXT | Catégorie d'activité |
| `location` | TEXT | Siège social |
| `email` | TEXT | Contact email |
| `phone` | TEXT | Contact téléphone |
| `website` | TEXT | Site web |
| `image` | TEXT | URL photo de couverture |
| `status` | TEXT | Voir machine d'états ci-dessous |
| `score` | INTEGER | Score de transparence (0-100) |
| `section_visibility` | JSONB | Sections visibles publiquement |
| `projects` | JSONB[] | Liste des projets |
| `financials` | JSONB | Données financières |
| `legal` | JSONB | Informations légales |
| `volunteers` | INTEGER | Nombre de bénévoles |
| `created_at` | TIMESTAMPTZ | — |
| `updated_at` | TIMESTAMPTZ | — |

**Statuts possibles :**
```
pending → submitted → under_review → verified
                                   → rejected
                                   → complement_required
verified → active → suspended
any → inactive
```

**`section_visibility` (JSONB) :**
```json
{
  "identite": true,
  "mission": true,
  "documents": false,
  "projets": true,
  "contacts": true
}
```

---

## Table : `audit_trail`

Journal immuable des actions back-office. Append-only (triggers bloquent UPDATE/DELETE).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID PK | — |
| `entity_type` | TEXT | `ong` \| `badge` \| `score_dispute` |
| `entity_id` | UUID | ID de l'entité |
| `action` | TEXT | Code action (voir api-contracts.md) |
| `performed_by` | UUID FK→accounts | Opérateur (null = système) |
| `ong_id` | UUID FK→ongs | ONG concernée |
| `details_json` | JSONB | `{ comment, previousStatus, newStatus }` |
| `pre_merkle` | BOOLEAN | true jusqu'à Story 5.1 (chaîne SHA-256) |
| `created_at` | TIMESTAMPTZ | — |

**Insertion :** exclusivement via `insert_audit_entry()` (SECURITY DEFINER — contourne RLS).

---

## Table : `dossier_messages`

Messagerie en temps réel entre agents et back-office.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID PK | — |
| `ong_id` | UUID FK→ongs | ONG concernée |
| `sender_id` | UUID FK→accounts | Expéditeur |
| `sender_role` | TEXT | `back_office` \| `agent` |
| `content` | TEXT | Corps du message |
| `read_at` | TIMESTAMPTZ | null = non lu |
| `created_at` | TIMESTAMPTZ | — |

**Realtime :** canal `dossier-messages-{ongId}` (INSERT).

---

## Table : `financial_transactions`

Dons et transactions Stripe.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID PK | — |
| `ong_id` | UUID FK→ongs | ONG bénéficiaire |
| `donor_id` | UUID FK→accounts | Donateur |
| `amount` | INTEGER | Montant en centimes (EUR) |
| `currency` | TEXT | `eur` \| `mga` |
| `status` | TEXT | `pending` \| `completed` \| `failed` \| `cancelled` |
| `provider` | TEXT | `stripe` \| `vanilla-pay` |
| `stripe_payment_intent_id` | TEXT | Référence Stripe |
| `donor_email` | TEXT | Email donateur |
| `metadata` | JSONB | Données supplémentaires |
| `created_at` | TIMESTAMPTZ | — |

---

## Table : `score_history`

Historique des calculs de score ONG.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID PK | — |
| `ong_id` | UUID FK→ongs | — |
| `score` | INTEGER | Score calculé (0-100) |
| `details_json` | JSONB | Détail par critère |
| `algorithm_version_id` | UUID FK→algorithm_versions | Version algo utilisée |
| `computed_at` | TIMESTAMPTZ | — |

---

## Table : `algorithm_versions`

Versions de l'algorithme de calcul du score.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID PK | — |
| `version` | TEXT | Numéro de version |
| `criteria` | JSONB | Critères et poids |
| `status` | TEXT | `active` \| `archived` |
| `activated_at` | TIMESTAMPTZ | — |

---

## Fonctions PostgreSQL personnalisées

| Fonction | Signature | Rôle |
|----------|-----------|------|
| `get_user_role()` | `→ TEXT` | Lit `app_metadata.role` du JWT (fallback: table accounts) |
| `fn_immutable_record()` | trigger | Bloque UPDATE/DELETE sur les tables immuables |
| `insert_audit_entry(...)` | `→ UUID` | Insère dans audit_trail en SECURITY DEFINER (bypass RLS) |

---

## RLS — Résumé des policies actives

| Table | Policy | Règle |
|-------|--------|-------|
| `ongs` | `ongs_agent_own` | Agent voit/modifie uniquement son ONG |
| `ongs` | `ongs_backoffice_all` | Back-office voit et modifie tout |
| `audit_trail` | `at_service_role_insert` | Seul service_role peut INSERT (obsolète depuis migration 17) |
| `audit_trail` | `at_backoffice_insert` | back_office/admin peuvent INSERT via JWT |
| `audit_trail` | `at_backoffice_select` | back_office peut SELECT |
| `audit_trail` | `at_admin_select` | admin peut SELECT |
| `dossier_messages` | RLS selon sender_role | Agent = ses messages ; back-office = tout |
| `financial_transactions` | RLS agent/back-office | Séparation par ownership |

> **Migration 17** : `insert_audit_entry()` SECURITY DEFINER remplace la dépendance au service_role key pour l'audit trail.
