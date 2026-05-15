# Architecture — Paika ONG Platform

**Date :** 2026-05-13

---

## Résumé exécutif

Application Nuxt 3 full-stack déployée sur Netlify. Le frontend (Vue 3) et l'API (Nitro) coexistent dans le même dépôt. Supabase gère la base de données PostgreSQL, l'authentification JWT, le Realtime et le Storage.

---

## Patterns architecturaux

### Organisation du code : Feature-based (DDD-lite)

Le code est organisé par **domaine métier** dans `features/`, non par type de fichier. Chaque feature encapsule ses composants, services, stores et types.

```
features/
  auth/          → Authentification, store Pinia, UserHeader
  user/          → Profil, dashboard partenaire, composables stats
  ong/           → Entité ONG, cartes, dashboard agent
  ong-profile/   → Stepper 5 étapes de constitution du dossier
  verification/  → Messagerie dossier, ScoreTransparenceWidget, PipelineKanban
  donations/     → Paiements Stripe
  admin/         → Services back-office (appels API)
  score/         → Services score côté client
```

### Layout system (Nuxt)

| Layout | Usage |
|--------|-------|
| `layouts/default.vue` | Toutes les pages utilisateurs (Header sticky + slot) |
| `layouts/admin.vue` | Pages back-office (sidebar nav + main content) |

Les pages auth (`/auth/*`), landing (`/`), détail ONG et récapitulatif utilisent `layout: false` et gèrent leur propre structure.

### Flux de requête

```
Browser → Nuxt SSR/CSR
           ↓
    middleware/auth.ts  (SSR — vérifie JWT, redirige si non authentifié)
           ↓
    page .vue (definePageMeta → middleware: ['auth', 'agent-only'])
           ↓
    $fetch('/api/...') → server/api/**/*.ts (Nitro handler)
           ↓
    server/services/*.ts (logique métier)
           ↓
    createClient(supabaseUrl, anonKey, { headers: { Authorization: Bearer JWT } })
           ↓
    Supabase PostgreSQL (RLS appliqué via JWT)
```

---

## Couches applicatives

### 1. Présentation (Vue 3 + Nuxt pages)

- **Pages** : `pages/` — routage file-based Nuxt
- **Layouts** : `layouts/` — structure commune
- **Composants globaux** : `components/` — Header, Footer, OngStatus, ThemeToggle
- **Composants feature** : `features/*/components/`

### 2. État global (Pinia)

Un seul store actif : `features/auth/stores/auth.client.ts`
- Contient : `currentUser` (id, fullName, accountType, email), `userInitials`
- Hydraté au montage depuis Supabase Auth
- Méthodes : `setDisconnected()`

### 3. API Layer (Nitro — `server/api/`)

Handlers organisés par ressource :

| Groupe | Routes |
|--------|--------|
| `/api/ongs/[id]/` | submit, resubmit, messages (GET/POST) |
| `/api/admin/dossiers/[id]/` | validate, reject, complement, suspend, start-review, audit, messages |
| `/api/back-office/dossiers/[id]/` | Idem (routes miroir — à consolider) |
| `/api/admin/` | historique, donations, dossiers list |
| `/api/score/` | criteria, ong score |
| `/api/donations/` | create-checkout, confirm-session |
| `/api/webhooks/` | stripe, vanilla-pay |

### 4. Services serveur (`server/services/`)

| Service | Responsabilité |
|---------|----------------|
| `ong-status.service.ts` | Machine d'états ONG — seul point de changement de statut |
| `audit.service.ts` | Insertion dans `audit_trail` via RPC SECURITY DEFINER |
| `score.service.ts` | Calcul du score de transparence (5 critères) |
| `payment.service.ts` | Orchestration paiements |
| `stripe.service.ts` | Intégration Stripe |
| `email.service.ts` | Emails transactionnels (stub Brevo) |
| `pdf.service.ts` | Génération PDF récapitulatif |

### 5. Base de données (Supabase PostgreSQL)

Tables principales :
- `accounts` — comptes utilisateurs (first_name, last_name, email, account_type)
- `ongs` — dossiers ONG (status, section_visibility JSONB, score)
- `ong_documents` — documents uploadés (Storage)
- `dossier_messages` — messagerie back-office ↔ agent (Realtime)
- `audit_trail` — journal immuable des actions (SECURITY DEFINER RPC)
- `financial_transactions` — dons Stripe
- `score_history` — historique des scores
- `algorithm_versions` — versions de l'algo de score

Migrations : `supabase/migrations/` (01 → 17, toutes idempotentes)

---

## Authentification & Autorisation

### Flux d'authentification

1. Login via Supabase Auth (email/password)
2. JWT retourné avec `app_metadata.role` injecté par trigger PostgreSQL (migration 07)
3. Middleware SSR (`middleware/auth.ts`) vérifie le JWT à chaque navigation
4. API handlers extraient `event.context.userId` et `token` depuis les headers

### Guards middleware (Nuxt)

| Middleware | Rôle |
|-----------|------|
| `auth` | Redirige vers `/auth/login` si non authentifié |
| `agent-only` | Redirige si `accountType !== 'user_agent'` |
| `partner-only` | Redirige si `accountType !== 'user_partner'` |
| `back-office` | Vérifie `role = back_office/admin` dans le JWT |
| `guest` | Redirige vers `/dashboard` si déjà connecté |

### RLS (Row Level Security) Supabase

La fonction `get_user_role()` lit `auth.jwt() -> 'app_metadata' ->> 'role'` (migration 16).

Policies clés :
- `ongs` : les agents voient/modifient uniquement leur ONG ; back-office voit tout
- `audit_trail` : insert via `insert_audit_entry()` (SECURITY DEFINER, contourne RLS)
- `dossier_messages` : agent voit ses messages, back-office voit tout

---

## Realtime

Deux canaux Supabase Realtime actifs :
1. **Statut ONG** (`ong-status-{ongId}`) — Dashboard agent : actualise le badge de statut en temps réel
2. **Messages non lus** (`header-unread-messages`) — Header : badge de notification dans la nav
3. **Messagerie dossier** (`dossier-messages-{ongId}`) — DossierMessagerie : push des nouveaux messages

---

## Déploiement

- **Plateforme** : Netlify
- **Preset Nitro** : `netlify`
- **Stripe** : externalisé du bundle Nitro (préserve la chaîne prototype StripeError)
- **Build** : `nuxt build`

---

## Décisions architecturales notables

| Décision | Raison |
|---------|--------|
| Machine d'états centralisée dans `ong-status.service.ts` | Garantit qu'aucun statut ne change sans audit trail |
| `insert_audit_entry` via SECURITY DEFINER | Contourne le besoin de service_role key pour l'audit |
| Fire & forget supprimé sur l'audit | Les erreurs d'audit sont maintenant loggées (mais ne bloquent pas la transition) |
| Layout `default.vue` centralisé | Uniformité du Header sur toutes les pages utilisateur |
| Widget messagerie flottant (Teleport) | La messagerie n'encombre plus le dashboard agent |
