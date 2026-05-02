---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-05-02'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/project-context.md'
workflowType: 'architecture'
project_name: 'Paika ONG Platform'
user_name: 'Paika'
date: '2026-05-02'
---

# Architecture Decision Document — Paika ONG Platform

**Auteur:** Paika
**Date:** 2026-05-02

---

_Ce document se construit collaborativement étape par étape. Les sections sont ajoutées au fil des décisions architecturales._

---

## Analyse du Contexte Projet

### Vue d'ensemble des Exigences

**Exigences Fonctionnelles : 51 FRs organisées en 8 domaines**

| Domaine | FRs | Implication architecturale |
|---------|-----|---------------------------|
| Authentification & Comptes | FR1–5 | Auth Supabase standard + middleware rôles |
| Profil & Formulaire ONG | FR6–12 | StepperForm persistant + Supabase Storage |
| Certification Back-office | FR13–19 | Pipeline kanban + messagerie back-office |
| Score de Transparence | FR20–24 | Moteur de calcul event-driven, immuabilité |
| Découverte & Recherche | FR25–31 | Moteur de recherche Supabase + cache public |
| Abonnement & Paiements | FR32–37 | Machine d'états transactions + webhooks |
| Audit Trail & Conformité | FR38–42 | Table append-only + triggers + hash SHA-256 |
| Communication & Admin | FR43–51 | Email transactionnel + reporting agrégé |

**Exigences Non-Fonctionnelles critiques pour l'architecture :**

| NFR | Contrainte | Impact architectural |
|-----|-----------|---------------------|
| NFR1 | Pages publiques < 3s sur 3G (1Mbps) | SSR Nuxt obligatoire sur pages publiques + cache Nitro |
| NFR2 | Accusé de réception < 500ms sur actions critiques | Pattern optimistic UI + job async en background |
| NFR3 | Webhook mobile money traité < 10s | API route Nitro dédiée, hors rendu SSR |
| NFR9 | Audit trail immuable — triggers bloquant UPDATE/DELETE | Table `financial_transactions` en append-only via triggers PostgreSQL |
| NFR10 | Hash SHA-256 quotidien hors base principale | Cron Supabase Edge Function + stockage hash séparé |
| NFR15 | 500 ONGs simultanées sans dégradation | Index PostgreSQL sur `ong_id` + views matérialisées pour Score |
| NFR19 | Formulaires multi-étapes persistent hors connexion | localStorage + sync Supabase à la reconnexion |
| NFR20 | Retry webhook × 3 avec backoff exponentiel | File d'attente ou Edge Function avec retry logic |

### Échelle & Complexité

**Complexité évaluée : HAUTE — 4 sous-systèmes critiques indépendants**

| Sous-système | Complexité | Risque | Priorité |
|--------------|-----------|--------|---------|
| Certification (formulaire + upload + Score + kanban) | Moyenne | Faible | P0 MVP |
| Transactions Mobile Money (machine d'états + webhooks + idempotence) | Haute | Élevé | P0 MVP |
| Audit Trail Immuable (append-only + triggers + hash FATF) | Haute | Élevé | P0 MVP |
| Score de Transparence (algo versionné + event-driven + gouvernance) | Moyenne | Moyen | P0 MVP |

**Domaine technique primaire :** Full-stack web (Nuxt SSR + Supabase BFF + Nitro API)

**Contexte :** Brownfield — base existante (auth, rôles, modèle ONG basique, pages statiques)

**Cible plateforme :** Desktop web uniquement — breakpoints `lg`/`xl` TailwindCSS (≥ 1024px), aucune version mobile

### Contraintes Techniques & Dépendances

**Stack imposée (brownfield) :**
- Nuxt 3.14+ / Vue 3.5+ / TypeScript permissif (noImplicitAny=false, strictNullChecks=false)
- @nuxt/ui 2.20+ + TailwindCSS (dark mode class-based, CSS custom properties)
- Supabase JS 2.89+ (auth, RLS, storage, realtime, edge functions)
- Pinia 2.3+ (état client — setup-style, stores suffixés `.client.ts`)
- Déploiement : Netlify (Nitro preset), Node 22, bun local
- `~/lib/supabase.ts` INTERDIT — `useSupabase()` composable uniquement
- `import.meta.client` obligatoire avant tout accès Supabase (crash SSR sinon)

**Contraintes réglementaires :**
- BCRM/BFM Madagascar — statut réglementaire (agrégateur ou EME) à clarifier avant décaissement réel
- FATF — audit trail conservé 5 ans, KYC obligatoire au-dessus du seuil BFM
- RGPD de facto pour toute donnée partagée avec entités UE (AFD, GIZ, UE)

### Préoccupations Transversales

| Préoccupation | Périmètre | Priorité |
|---------------|-----------|---------|
| Multi-tenancy RLS | Toutes tables liées à `ong_id` | P0 — sécurité |
| Immuabilité audit trail | Table `financial_transactions` + migrations | P0 — compliance |
| Idempotence webhooks | Toutes routes API mobile money | P0 — fiabilité |
| Gestion SSR/Client | Composants accédant à Supabase ou window | P0 — stabilité |
| Cache pages publiques | Liste ONGs, profil ONG, Score | P1 — performance 3G |
| Notifications transactionnelles | Certification, paiement, alerte abonnement | P1 — UX |
| Feature flags | Mobile money (sandbox → prod) | P1 — déploiement |
| PDF server-side | Rapport vérification + reçus fiscaux | P1 — MVP |
| Résilience formulaires | localStorage + sync Supabase à reconnexion | P1 — UX offline |

---

## Fondation Technique — Starter Template

### Domaine Technique Primaire

Full-stack web — Nuxt 3.14+ avec rendu hybride (SSR pour les pages publiques, CSR pour les dashboards authentifiés).

### Starter Template : Brownfield — Base Nuxt Existante

**Statut :** Projet déjà bootstrappé et en cours de développement. Aucun starter template à initialiser.

**Décisions architecturales établies par la base existante :**

**Langage & Runtime :**
TypeScript 5.8+ permissif (`noImplicitAny=false`, `strictNullChecks=false`). Auto-imports Nuxt activés — `ref`, `computed`, `watch`, stores Pinia, composables `~/composables/` ne s'importent jamais manuellement.

> ⚠️ **Décision à prendre (Step 4) :** Migration progressive vers `strict: true` sur les périmètres financiers critiques (`features/mvola/`, `features/audit-trail/`) via `tsconfig` composés. Le mode permissif global est maintenu pour le reste du codebase brownfield.

**Styling :**
TailwindCSS avec CSS custom properties HSL pour le thème. Dark mode class-based. `@nuxt/ui 2.20+` comme bibliothèque de composants (`global: true`). Zéro couleur hardcodée — uniquement les tokens CSS du thème.

**Build Tooling :**
Vite (via Nuxt 3). Nitro comme server engine. Déploiement Netlify via preset Nitro. `--legacy-peer-deps` requis (npm). Package manager local : bun.

> ⚠️ **Contrainte Netlify :** `NUXT_PUBLIC_*` vars injectées au BUILD, pas au runtime. La version d'algorithme du Transparency Score ne doit PAS être en env var — stocker en table `algorithm_config` Supabase (RLS back_office only), lue au runtime.

**Tests :**
Vitest + `@nuxt/test-utils`. Priorité : mappers 100%, services 80%, composants logique métier uniquement. Co-localisation des specs. Zéro appel réseau réel (`vi.mock` obligatoire sur Supabase).

**Organisation du code :**
Architecture feature-based : `~/features/[feature]/` avec sous-dossiers `services/` (`queries.ts`, `mutations.ts`, `mapper.ts`, `types.ts`, `index.ts`), `components/`, `composables/`, `data/`. Imports croisés entre features interdits sauf via `~/types/` ou `~/lib/`.

**Expérience développeur :**
HMR Nuxt. Alias `~/` exclusif. `<script setup lang="ts">` obligatoire. Commits format `type(scope): description`. Branches `dev` → `feature/[scope]-[desc]`.

**Gardes de sécurité à implémenter dès le setup :**
- ESLint `no-restricted-imports` sur `@supabase/supabase-js` direct (forcer `useSupabase()` uniquement)
- pg_cron Supabase pour réconciliation des transactions MVola zombies (`status = 'processing'` depuis > 2 min)
- Ancrage externe du hash SHA-256 quotidien (API tierce) pour preuve d'intégrité indépendante
- Table `algorithm_versions` avec statut `draft/approved/deprecated` pour gouvernance du Transparency Score

**Note :** Aucune commande d'initialisation requise. La première story d'implémentation est la migration des modules existants vers l'architecture feature-based documentée.

---

## Décisions Architecturales Fondamentales

### Analyse de Priorité

**Décisions critiques (bloquent l'implémentation) :**

- Structure JWT multi-rôles via `app_metadata`
- Passerelle de paiement Vanilla Pay (remplace les intégrations directes MVola/Orange/Airtel)
- Schéma audit trail append-only avec chaîne Merkle

**Décisions importantes (structurent l'architecture) :**

- Gouvernance du Transparency Score (versionnement + approbation + contestation)
- Service email transactionnel Brevo
- Génération PDF via Playwright + Supabase Edge Function
- Monitoring Sentry + ops_alerts

**Décisions différées (post-MVP) :**

- Messagerie temps réel Supabase Realtime (Growth phase)
- API publique versionnée (Growth phase)
- Environnement staging isolé (post-lancement)

---

### Architecture de Données

**Authentification & Multi-rôles**

- Mécanisme : Custom claims JWT via `auth.users.app_metadata.role`
- Valeurs : `user_agent` | `user_partner` | `back_office`
- Accès RLS : `(auth.jwt() ->> 'role') = 'back_office'`
- Révocation : `auth.admin.updateUserById()` → invalidation immédiate
- Trigger Postgres copie le rôle de `app_metadata` dans les claims JWT personnalisés
- Affecte : toutes les policies RLS, tous les middlewares de route

**Audit Trail Immuable**

```sql
CREATE TABLE financial_transactions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id                    UUID NOT NULL REFERENCES ongs(id),
  vanilla_pay_transaction_id TEXT UNIQUE NOT NULL,
  amount                    INTEGER NOT NULL, -- Ariary, jamais de float
  status                    TEXT NOT NULL,    -- pending/processing/completed/failed/timeout
  previous_hash             TEXT,             -- chaîne Merkle
  created_at                TIMESTAMPTZ DEFAULT now()
);
```

- Triggers PostgreSQL `BEFORE UPDATE OR DELETE` → `RAISE EXCEPTION` (immuabilité absolue)
- Chaîne Merkle : chaque insert calcule `SHA-256(previous_hash || transaction_data)`
- Daily checkpoint : hash quotidien calculé par pg_cron, stocké hors base principale ET publié sur service tiers (ancrage externe)
- `service_role` Supabase interdit en Edge Functions accédant à cette table — rôle dédié uniquement

**Gouvernance du Transparency Score**

```
algorithm_versions (id, version, params_json, status: draft|approved|active|deprecated,
                    approved_by, approved_at, created_at)
score_disputes     (id, ong_id, reason, status: open|processing|resolved,
                    dispute_id, resolution_notes, created_at)
```

- Une seule version `active` à la fois (contrainte CHECK en base)
- Recalcul déclenché uniquement par événements documentés (upload document, validation back-office)
- Aucun opérateur Paika ne modifie un score directement — algorithme seul
- Contestation ONG → `score_disputes` → recalcul tracé avec `dispute_id`

---

### Authentification & Sécurité

| Décision | Choix | Rationale |
|----------|-------|-----------|
| Auth provider | Supabase Auth (email/password) | Stack imposée, JWT natif |
| Multi-rôles | `app_metadata.role` custom claims | Rôles exclusifs, révocation immédiate, performance RLS |
| RLS discriminant | `ong_id` sur toutes tables ONG | Multi-tenancy standard Supabase |
| Accès back-office | Rôle dédié + audit log toutes actions | Surveillance des surveillants |
| Guard import Supabase | ESLint `no-restricted-imports` sur `@supabase/supabase-js` | Prévenir crash SSR, forcer `useSupabase()` |
| TypeScript strict | `strict: true` sur `features/vanilla-pay/` et `features/audit-trail/` uniquement | Null safety sur périmètres financiers |

---

### API & Communication

**Passerelle de paiement — Vanilla Pay**

- Intégration : route Nitro dédiée `server/api/webhooks/vanilla-pay.post.ts`
- Hors pipeline SSR — traitement stateless < 10s (NFR3)
- Idempotence : contrainte `UNIQUE` sur `vanilla_pay_transaction_id` en PostgreSQL
- State machine : `pending → processing → completed / failed / timeout`
- Réconciliation zombie via pg_cron (toutes les 5 min) :

```sql
UPDATE financial_transactions
SET status = 'pending', retry_count = retry_count + 1
WHERE status = 'processing'
  AND updated_at < NOW() - INTERVAL '2 minutes'
  AND retry_count < 3;
```

- Timeout > 30 min → insert dans `ops_alerts` → visible back-office dashboard
- Vanilla Pay porte la responsabilité d'agrégateur agréé BCRM — Paika opère en tant que marchand client

**Email transactionnel — Brevo**

- SDK Node.js côté Nitro uniquement (clé API jamais exposée client)
- Événements déclencheurs : certification accordée, paiement reçu, complément requis, suspension badge, expiration J-7
- Délivrabilité > 95% vers domaines institutionnels (AFD, GIZ, UE)

**Génération PDF — Playwright via Supabase Edge Function**

- Rendu HTML → PDF via headless browser dans Edge Function
- Stockage : `Supabase Storage /reports/{ong_id}/{report_id}.pdf`
- Accès : URL signée retournée au client (expiration 1h)
- Délai cible < 30s (NFR5)

---

### Architecture Frontend

| Décision | Choix | Rationale |
|----------|-------|-----------|
| State management | Pinia 2.3+ setup-style, `.client.ts` | Stack imposée |
| Offline formulaires | VueUse `useStorage` + `useOnline()` watcher | Persistance localStorage, sync à reconnexion |
| Upload résilient | Supabase Storage `resumable: true` | Documents > 1 Mo sur connexion Madagascar |
| Optimistic UI | Pattern sur actions critiques (soumission, paiement) | Accusé de réception < 500ms (NFR2) |
| Feature flags | `NUXT_PUBLIC_FEATURE_*` via Netlify env vars + `useRuntimeConfig()` | Sandbox → prod sans revert Git |
| États composants | 4 états obligatoires : loading / error / empty / success | Règle project-context, pas de `v-if="data"` seul |

---

### Infrastructure & Déploiement

| Décision | Choix | Rationale |
|----------|-------|-----------|
| Hébergement | Netlify (Nitro preset) | Stack imposée, auto-deploy depuis `main` |
| CI/CD | Netlify auto-deploy + checklist pré-merge manuelle | `npm run lint` + `npm run build` obligatoires |
| Error tracking | Sentry (SDK Vue + Node Nitro) | Frontend + serveur, alertes prod |
| Métriques BDD | Supabase Dashboard | Requêtes lentes, RLS, storage |
| Alertes ops | Table `ops_alerts` Supabase, lue par back-office | Transactions zombie, webhooks timeout |
| Migrations | `/supabase/migrations/YYYYMMDD_HH_description.sql` | Versionné avant déploiement, bloquant si absent |
| Logs webhooks | `console.error('[webhook:vanilla-pay]', ...)` | Capturés par Netlify Functions logs |

---

### Analyse d'Impact

**Séquence d'implémentation recommandée :**

1. Setup ESLint guard + tsconfig strict sur périmètres financiers
2. Migrations Supabase : schéma `financial_transactions` + triggers + `algorithm_versions` + `score_disputes`
3. Custom claims JWT + middleware rôles
4. Intégration Vanilla Pay (route webhook + state machine + pg_cron)
5. Calcul Transparency Score (algo v1 + events + versionnement)
6. Formulaire ONG multi-étapes (localStorage + upload résilient)
7. Pipeline back-office certification (kanban + PDF + Brevo)
8. Monitoring Sentry + ops_alerts

**Dépendances inter-composants :**

- Les migrations (step 2) bloquent tout le reste
- Les custom claims JWT (step 3) bloquent toutes les features authentifiées
- Vanilla Pay (step 4) bloque l'abonnement "Vérifié" et les dons bailleurs
- Le Score (step 5) dépend du formulaire ONG et de la certification back-office

---

## Patterns d'Implémentation & Règles de Cohérence

### Points de conflit identifiés pour les agents IA

9 zones où des agents peuvent produire du code structurellement incompatible si non spécifiées : arborescence des services, gestion d'erreur inter-couches, séquence des mutations critiques, pagination, optimistic updates, side effects ownership, validation layer, defense in depth RLS/middleware, tests state machine.

---

### Arborescence des Services

```
server/services/{domain}.service.ts   → logique métier server-side (appels Supabase, Vanilla Pay)
server/utils/{domain}.utils.ts        → fonctions pures sans état (hash, formatters)
server/middleware/auth.ts             → vérification JWT + role présent uniquement
composables/use{Domain}.ts            → état réactif client uniquement
~/features/{feature}/services/        → queries.ts / mutations.ts / mapper.ts / types.ts / index.ts
```

**Règle :** les composants Vue importent uniquement depuis `~/features/*/services/index.ts` ou un store Pinia — jamais directement depuis `server/`.

---

### Gestion d'Erreur Inter-Couches

**`ServiceError` — classe obligatoire dans tous les services server-side :**

```typescript
// server/utils/errors.ts
export class ServiceError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'VALIDATION' | 'FORBIDDEN' | 'CONFLICT' | 'WEBHOOK_FAILED',
    message: string,
    public context?: Record<string, unknown>
  ) { super(message) }
}
```

**Règle de responsabilité :**
- Les **services** `throw new ServiceError(...)` — jamais de `createError()` dans un service
- Les **API handlers** (`server/api/*.ts`) sont les **seuls** à appeler `createError()` et à transformer `ServiceError` en réponse HTTP
- Jamais laisser une `PostgrestError` remonter brute jusqu'au client

```typescript
// server/api/webhooks/vanilla-pay.post.ts — pattern obligatoire
try {
  const result = await paymentService.processWebhook(body)
  return { data: result, error: null }
} catch (err) {
  if (err instanceof ServiceError) {
    throw createError({ statusCode: codeToStatus[err.code], message: err.message })
  }
  throw createError({ statusCode: 500, message: 'INTERNAL_ERROR' })
}
```

---

### Séquence Canonique des Mutations Critiques

**Ordre strict et non négociable pour toute mutation touchant `financial_transactions` :**

```typescript
// server/services/payment.service.ts — séquence CANONIQUE
async function createTransaction(payload: TransactionPayload) {
  // 1. Validation Zod (jamais de DB si payload invalide)
  TransactionSchema.parse(payload)

  // 2. Idempotence check (return early si duplicate — pas d'exception)
  const existing = await checkIdempotence(payload.vanillaPayTransactionId)
  if (existing) return { data: existing, error: null }

  // 3. BEGIN transaction PostgreSQL
  // 4. DB insert (status: 'pending')
  // 5. insertAuditEntry() dans la MÊME transaction
  // 6. COMMIT

  // 7. triggerScoreRecalculation() HORS transaction — async, non-bloquant
  //    WHY: ne jamais bloquer le COMMIT sur un recalcul de score
  await triggerScoreRecalculation(ongId, 'payment.received', { transactionId })

  // 8. return { data, error: null }
}
```

**Atomicité :** étapes 3–6 = atomiques (tout ou rien). Étape 7 = éventuellement cohérente (peut échouer sans invalider la transaction).

---

### Atomicité vs Cohérence Éventuelle

| Opération | Atomique (transaction DB) | Éventuellement cohérente |
|-----------|--------------------------|--------------------------|
| insert + audit trail | ✅ obligatoire | — |
| insert + recalcul Score | — | ✅ hors transaction |
| insert + email Brevo | — | ✅ hors transaction |
| insert + ops_alert | — | ✅ hors transaction |

**Partial failure :** si une opération éventuellement cohérente échoue, retourner `{ data, error: null }` avec log d'erreur — ne pas rollback la transaction principale.

---

### Side Effects Ownership

**Liste exhaustive des mutations qui déclenchent des side effects obligatoires :**

| Mutation | Side effects (dans le service, jamais dans le caller) |
|----------|------------------------------------------------------|
| `validateOngDossier()` | `triggerScoreRecalculation('backoffice.validated')` + notification Brevo |
| `uploadDocument()` | `triggerScoreRecalculation('document.uploaded')` |
| `deleteDocument()` | `triggerScoreRecalculation('document.deleted')` |
| `updateOngProfile()` | `triggerScoreRecalculation('profile.updated')` |
| `resolveDispute()` | `triggerScoreRecalculation('dispute.resolved')` + notification Brevo |
| `processWebhookPayment()` | `insertAuditEntry()` + notification Brevo si completed/failed |
| `suspendBadge()` | notification Brevo |

**Règle :** le side effect est ancré dans le **service**, jamais dans le composant ou le store caller.

---

### Validation Layer

**Principe : defense in depth — serveur toujours, client en complément UX uniquement.**

```
Composant Vue       → validation Zod pour feedback UX immédiat (non-bloquante)
server/api/*.ts     → validation Zod obligatoire avant tout appel service (bloquante)
Service             → fait confiance aux données reçues de l'API handler
```

**Schémas Zod partagés** dans `~/types/schemas/` — utilisés des deux côtés (client + serveur). Jamais de schéma dupliqué.

---

### Defense in Depth — RLS vs Middleware

```
server/middleware/auth.ts  → vérifie JWT valide + role présent → 401/403 rapide
Postgres RLS policies      → source of truth pour l'isolation des données par tenant
```

**Règle de séparation :**
- Le middleware vérifie l'*authentification* et la *présence* d'un rôle — pas les permissions sur les données
- RLS vérifie l'*accès aux données* — pas la validité du token
- **Ne jamais dupliquer la logique de filtrage data entre middleware et RLS**

---

### Pagination Standard

**Type `PaginatedResponse<T>` imposé sur toutes les collections :**

```typescript
// ~/types/pagination.ts
export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null  // cursor-based (pas de limit/offset)
  total: number
}
```

**Cursor-based uniquement** — pas de `limit/offset` (instable sur les insertions concurrentes de l'audit trail).

---

### Optimistic Updates

**Autorisés uniquement sur les actions UI non-financières** (toggle visibilité, favoris, préférences). Interdits sur les mutations financières (paiements, abonnement).

```typescript
// Pattern obligatoire si optimistic update autorisé :
const previousState = { ...store.item }      // 1. Sauvegarder l'état précédent
store.item = optimisticUpdate                // 2. Appliquer immédiatement
try {
  await service.update(payload)
} catch {
  store.item = previousState                 // 3. Rollback systématique sur erreur
}
```

---

### Cache et Invalidation RLS

**Les stores Pinia sont role-aware** : vidés et re-hydratés à chaque changement de session ou de rôle.

```typescript
// Pattern dans useAuthStore ou équivalent :
watch(() => authStore.role, () => {
  // Vider TOUS les stores qui contiennent des données filtrées par RLS
  ongStore.$reset()
  transactionStore.$reset()
  scoreStore.$reset()
})
```

**Règle :** aucun store ne cache des données cross-tenant. Le cache Nitro (`useFetch` avec `getCachedData`) est réservé aux données publiques uniquement (liste ONGs, scores publics).

---

### Template de Test — State Machine

**Obligatoire pour toute implémentation de state machine :**

```typescript
// tests/unit/payment-state-machine.spec.ts
const VALID_TRANSITIONS = [
  ['pending', 'processing'],
  ['processing', 'completed'],
  ['processing', 'failed'],
  ['processing', 'pending'],   // pg_cron retry
  ['processing', 'timeout'],
]

const INVALID_TRANSITIONS = [/* cross-product de tous les états sauf VALID_TRANSITIONS */]

describe('PaymentStateMachine', () => {
  it.each(VALID_TRANSITIONS)('allows %s → %s', (from, to) => { /* ... */ })
  it.each(INVALID_TRANSITIONS)('throws on %s → %s', (from, to) => { /* ... */ })
  it('pending → pending = no-op (idempotence, pas exception)', () => { /* ... */ })
  it('throws on unknown source state', () => { /* ... */ })
})
```

**`pending → pending` = no-op** (pas d'exception) — convention Paika pour l'idempotence des webhooks rejoués.

---

### Règles Obligatoires pour Tous les Agents IA

Tous les agents **DOIVENT** :

- Valider les payloads Vanilla Pay avec Zod avant tout appel service
- Utiliser `insertAuditEntry()` pour toute écriture dans `financial_transactions` — jamais d'insert direct
- Déclencher `triggerScoreRecalculation()` avec un `ScoreTriggerEvent` typé — hors transaction DB
- Retourner `{ data: T, error: null }` sur toutes les routes Nitro — `createError()` uniquement dans les API handlers
- Ancrer les side effects dans le service — jamais dans le composant ou le store caller
- Utiliser `PaginatedResponse<T>` cursor-based pour toutes les collections
- Vider les stores Pinia RLS-dépendants à chaque changement de session
- Couvrir les state machines avec le template de test obligatoire (4 cas minimum)

---

## Structure Projet & Frontières Architecturales

### Arborescence Complète

```
ong_website/
├── .env.example
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json                         # permissif global
├── tsconfig.strict.json                  # strict=true — features/payments/ + features/audit-trail/
├── .eslintrc.json                        # no-restricted-imports @supabase/supabase-js
├── supabase/
│   └── migrations/
│       ├── 20260502_01_financial-transactions.sql
│       ├── 20260502_02_algorithm-versions.sql
│       ├── 20260502_03_score-disputes.sql
│       ├── 20260502_04_rls-policies.sql
│       ├── 20260502_05_pgcron-zombie-recovery.sql
│       └── 20260502_06_ops-alerts.sql
├── server/
│   ├── middleware/
│   │   └── auth.ts                       # JWT valide + role présent → 401/403
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── vanilla-pay.post.ts       # hors SSR — stateless — < 10s
│   │   ├── ongs/
│   │   │   ├── index.get.ts              # PaginatedResponse<ONG>, cache 1h
│   │   │   ├── [id].get.ts
│   │   │   └── [id]/score.get.ts
│   │   ├── reports/
│   │   │   └── [ong_id].get.ts           # déclenche PDF Edge Function
│   │   └── admin/
│   │       ├── dashboard.get.ts
│   │       └── algorithm-versions.post.ts
│   ├── services/
│   │   ├── payment.service.ts            # state machine Vanilla Pay + séquence canonique
│   │   ├── audit.service.ts              # insertAuditEntry() + chaîne Merkle
│   │   ├── score.service.ts              # triggerScoreRecalculation()
│   │   ├── email.service.ts              # Brevo
│   │   └── pdf.service.ts               # Playwright Edge Function → Storage
│   └── utils/
│       ├── errors.ts                     # ServiceError class
│       ├── hash.ts                       # SHA-256 + Merkle helpers
│       └── pagination.ts                 # cursor helpers
├── features/
│   ├── auth/                             # FR1–5
│   │   ├── components/
│   │   │   ├── LoginForm.vue
│   │   │   └── ResetPasswordForm.vue
│   │   ├── composables/
│   │   │   └── useAuth.client.ts
│   │   ├── services/
│   │   │   ├── auth.mutations.ts
│   │   │   ├── auth.queries.ts
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── auth.client.ts
│   ├── ong-profile/                      # FR6–12
│   │   ├── components/
│   │   │   ├── OngStepperForm.vue
│   │   │   ├── OngDocumentUpload.vue
│   │   │   └── OngProfileCard.vue
│   │   ├── composables/
│   │   │   ├── useOngForm.client.ts      # useStorage localStorage + useOnline()
│   │   │   └── useOngProfile.ts
│   │   ├── data/
│   │   │   └── ong.fixtures.ts
│   │   ├── services/
│   │   │   ├── ong.queries.ts
│   │   │   ├── ong.mutations.ts
│   │   │   ├── ong.mapper.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── ong.client.ts
│   ├── certification/                    # FR13–19
│   │   ├── components/
│   │   │   ├── CertificationPipeline.vue
│   │   │   ├── DossierChecklist.vue
│   │   │   └── CertificationBadge.vue
│   │   ├── services/
│   │   │   ├── certification.queries.ts
│   │   │   ├── certification.mutations.ts
│   │   │   ├── certification.mapper.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── certification.client.ts
│   ├── transparency-score/               # FR20–24
│   │   ├── components/
│   │   │   ├── ScoreDisplay.vue
│   │   │   ├── ScoreCriteria.vue
│   │   │   └── ScoreDisputeForm.vue
│   │   ├── services/
│   │   │   ├── score.queries.ts
│   │   │   ├── score.mutations.ts
│   │   │   ├── score.mapper.ts
│   │   │   ├── score.algorithm.ts        # algo v1 versionné
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── score.client.ts
│   ├── discovery/                        # FR25–31
│   │   ├── components/
│   │   │   ├── OngSearchFilters.vue
│   │   │   ├── OngListCard.vue
│   │   │   └── OngPublicProfile.vue
│   │   ├── services/
│   │   │   ├── discovery.queries.ts
│   │   │   ├── discovery.mapper.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── discovery.client.ts
│   ├── payments/                         # FR32–37
│   │   ├── components/
│   │   │   ├── SubscriptionStatus.vue
│   │   │   ├── PaymentInitForm.vue
│   │   │   └── TransactionHistory.vue
│   │   ├── composables/
│   │   │   └── useSubscription.client.ts
│   │   ├── services/
│   │   │   ├── payments.queries.ts
│   │   │   ├── payments.mutations.ts     # séquence canonique obligatoire
│   │   │   ├── payments.mapper.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── subscription.client.ts
│   ├── audit-trail/                      # FR38–42
│   │   ├── components/
│   │   │   ├── AuditLogViewer.vue
│   │   │   └── IntegrityProof.vue
│   │   ├── services/
│   │   │   ├── audit.queries.ts
│   │   │   ├── audit.mapper.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   ├── communication/                    # FR43–46
│   │   ├── components/
│   │   │   ├── NotificationBell.vue
│   │   │   └── BackofficeMessageThread.vue
│   │   ├── services/
│   │   │   ├── messages.queries.ts
│   │   │   ├── messages.mutations.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   └── admin/                            # FR47–51
│       ├── components/
│       │   ├── AdminDashboard.vue
│       │   ├── AlgorithmVersionManager.vue
│       │   └── OpsAlertsPanel.vue
│       ├── services/
│       │   ├── admin.queries.ts
│       │   ├── admin.mutations.ts
│       │   ├── types.ts
│       │   └── index.ts
│       └── stores/
│           └── admin.client.ts
├── pages/
│   ├── index.vue                         # SSR — landing publique
│   ├── ongs/
│   │   ├── index.vue                     # SSR + cache Nitro 1h
│   │   └── [id].vue                      # SSR
│   ├── auth/
│   │   ├── login.vue
│   │   └── reset-password.vue
│   ├── dashboard/                        # CSR — middleware: auth + agent-only
│   │   ├── index.vue
│   │   ├── profil.vue
│   │   ├── documents.vue
│   │   ├── score.vue
│   │   ├── paiements.vue
│   │   └── messages.vue
│   ├── bailleurs/                        # CSR — middleware: auth + partner-only
│   │   ├── index.vue
│   │   └── favoris.vue
│   └── backoffice/                       # CSR — middleware: auth + backoffice-only
│       ├── index.vue
│       ├── dossiers/
│       │   ├── index.vue
│       │   └── [id].vue
│       ├── score/
│       │   └── algorithmes.vue
│       └── alertes.vue
├── layouts/
│   ├── default.vue
│   ├── dashboard.vue
│   ├── bailleurs.vue
│   └── backoffice.vue
├── middleware/
│   ├── auth.ts
│   ├── agent-only.ts
│   ├── partner-only.ts
│   └── backoffice-only.ts
├── composables/
│   ├── useSupabase.client.ts
│   ├── useCurrentUser.client.ts
│   └── useToast.ts
├── types/
│   ├── schemas/
│   │   ├── payment.schema.ts             # Zod partagé client + serveur
│   │   ├── ong.schema.ts
│   │   └── score.schema.ts
│   ├── pagination.ts                     # PaginatedResponse<T>
│   └── index.ts
├── lib/
│   └── constants.ts
└── tests/
    ├── unit/
    │   ├── _state-machine.template.spec.ts
    │   └── features/
    └── e2e/
        └── rls-matrix.spec.ts
```

---

### Mapping FRs → Features

| Feature | FRs | Route principale | Middleware |
|---------|-----|-----------------|------------|
| `auth` | FR1–5 | `/auth/*` | aucun |
| `ong-profile` | FR6–12 | `/dashboard/profil` | `auth` + `agent-only` |
| `certification` | FR13–19 | `/backoffice/dossiers` | `auth` + `backoffice-only` |
| `transparency-score` | FR20–24 | `/dashboard/score`, `/ongs/[id]` | public (read) / `auth` (write) |
| `discovery` | FR25–31 | `/ongs`, `/bailleurs` | public + `partner-only` (favoris) |
| `payments` | FR32–37 | `/dashboard/paiements` | `auth` + `agent-only` |
| `audit-trail` | FR38–42 | `/backoffice`, `/ongs/[id]` | `backoffice-only` (write) |
| `communication` | FR43–46 | `/dashboard/messages` | `auth` |
| `admin` | FR47–51 | `/backoffice/index` | `auth` + `backoffice-only` |

---

### Frontières SSR / CSR

| Zone | Rendu | Cache |
|------|-------|-------|
| `/`, `/ongs/*` | SSR | Nitro 1h (données publiques) |
| `/dashboard/*`, `/bailleurs/*`, `/backoffice/*` | CSR | Aucun |
| `server/api/webhooks/*` | Nitro serverless | `Cache-Control: no-store` |

---

### Flux de Données Principal

```
Vanilla Pay ──► vanilla-pay.post.ts
               └─► payment.service.ts (séquence canonique)
                   ├─► financial_transactions + audit Merkle  [atomique]
                   ├─► score.service.ts → recalcul Score      [async]
                   ├─► email.service.ts → Brevo               [async]
                   └─► ops_alerts si timeout                  [async]
```

---

### Intégrations Externes

| Service | Point d'entrée | Variable |
|---------|---------------|----------|
| Vanilla Pay | `server/api/webhooks/vanilla-pay.post.ts` | `VANILLA_PAY_SECRET` |
| Brevo | `server/services/email.service.ts` | `BREVO_API_KEY` |
| Supabase | `composables/useSupabase.client.ts` | `SUPABASE_URL` + `SUPABASE_ANON_KEY` |
| Sentry | `nuxt.config.ts` | `SENTRY_DSN` |
| Playwright PDF | Supabase Edge Function | `SUPABASE_SERVICE_ROLE_KEY` |

---

## Résultats de Validation Architecturale

### Cohérence ✅

**Compatibilité des décisions :** toutes les décisions sont mutuellement compatibles. TypeScript permissif global + `tsconfig.strict.json` sur périmètres financiers — patterns composés Nuxt supportés. Vanilla Pay webhook Nitro stateless + pg_cron zombie recovery — mécanismes orthogonaux sans conflit. `algorithm_versions` en base — compatible contrainte Netlify build-time. Custom JWT claims `app_metadata` + RLS — pattern standard Supabase.

**Cohérence patterns ↔ décisions :** `ServiceError` + `createError()` cohérent avec `{ data, error: null }`. `PaginatedResponse<T>` cursor-based cohérent avec audit trail append-only. Stores Pinia `$reset()` sur changement de rôle cohérent avec RLS role-aware.

### Couverture des Exigences ✅

**51 FRs — couverture complète**

| Domaine | FRs | Feature |
|---------|-----|---------|
| Auth & Comptes | FR1–5 | `features/auth` + custom JWT + middleware |
| Profil ONG | FR6–12 | `features/ong-profile` + `useStorage` + resumable upload |
| Certification | FR13–19 | `features/certification` + kanban + Brevo |
| Score Transparence | FR20–24 | `features/transparency-score` + `algorithm_versions` + `score_disputes` |
| Découverte | FR25–31 | `features/discovery` + SSR + cache Nitro 1h |
| Paiements | FR32–37 | `features/payments` + Vanilla Pay + pg_cron |
| Audit Trail | FR38–42 | `features/audit-trail` + Merkle + triggers + daily hash |
| Communication | FR43–46 | `features/communication` + Brevo |
| Admin | FR47–51 | `features/admin` + `AlgorithmVersionManager` + `OpsAlertsPanel` |

**NFRs critiques — couverture confirmée**

| NFR | Solution |
|-----|---------|
| NFR1 (< 3s 3G) | SSR + cache Nitro 1h |
| NFR2 (< 500ms) | Optimistic UI |
| NFR3 (webhook < 10s) | Route Nitro stateless |
| NFR9 (immuabilité) | Triggers PostgreSQL BEFORE UPDATE/DELETE |
| NFR10 (SHA-256 quotidien) | pg_cron + ancrage externe |
| NFR15 (500 ONGs) | Index `ong_id` + vues matérialisées |
| NFR19 (offline) | `useStorage` + `useOnline()` |
| NFR20 (retry × 3) | `payment.service.ts` + pg_cron |

### Analyse des Gaps

**Gaps importants (non bloquants) :**

- Migrations `20260502_07_indexes.sql` (index `ong_id`) et `20260502_08_materialized-views.sql` (vues Score) à ajouter
- Service d'ancrage externe du daily hash non nommé — à choisir en implémentation (OpenTimestamps, endpoint public Paika)
- Pattern de révocation JWT multi-onglet back_office à couvrir dans la story `auth` setup

**Gaps mineurs (différables) :**
- Template composant 4 états (loading/error/empty/success) non formalisé en code
- Convention de nommage des Supabase Edge Functions non définie

### Checklist de Complétude

**Analyse des Exigences**

- [x] Contexte projet analysé exhaustivement
- [x] Échelle et complexité évaluées (HAUTE — 4 sous-systèmes critiques)
- [x] Contraintes techniques identifiées (stack brownfield, BCRM, FATF, RGPD)
- [x] Préoccupations transversales mappées (RLS, idempotence, SSR/client, cache)

**Décisions Architecturales**

- [x] Décisions critiques documentées (JWT, Vanilla Pay, Merkle, Score governance)
- [x] Stack technique complète spécifiée
- [x] Patterns d'intégration définis (Vanilla Pay, Brevo, PDF, monitoring)
- [x] Performance adressée (SSR, cache, optimistic UI, NFR1–5)

**Patterns d'Implémentation**

- [x] Conventions de nommage établies
- [x] Patterns de structure définis (feature-based, séquence canonique mutations)
- [x] Patterns de communication spécifiés (ServiceError, PaginatedResponse, side effects)
- [x] Patterns de processus documentés (state machine, tests, error handling, cache)

**Structure Projet**

- [x] Arborescence complète définie (9 features + server + pages + middleware + tests)
- [x] Frontières établies (SSR/CSR, Nitro/client, atomique/async)
- [x] Points d'intégration mappés
- [x] Mapping FRs → structure complet

### Résultat Global

**Statut : READY FOR IMPLEMENTATION**
**Niveau de confiance : Élevé**

**Points forts :**
- Défense en profondeur à toutes les couches (RLS + middleware + Zod + ServiceError)
- Séquence canonique des mutations critiques — élimine la principale source de conflits inter-agents
- Gouvernance du Score architecturée dès le MVP — crédibilité bailleurs institutionnels
- Vanilla Pay unifie les 3 opérateurs mobile money — réduction de la surface réglementaire BCRM

**Axes d'amélioration futurs :**
- Messagerie temps réel Supabase Realtime (Growth phase)
- API publique versionnée v1 (Growth phase)
- Staging environment isolé (post-lancement)
- Spécification du service d'ancrage externe du hash

### Handoff Implémentation

**Instructions pour les agents IA :**

- Lire ce document intégralement avant toute implémentation
- Respecter la séquence canonique des mutations (étape 7 hors transaction obligatoire)
- Utiliser `insertAuditEntry()` pour toute écriture dans `financial_transactions`
- Déclencher `triggerScoreRecalculation()` via `ScoreTriggerEvent` typé uniquement
- Couvrir les state machines avec le template de test obligatoire

**Première priorité d'implémentation :**
Setup ESLint guard + `tsconfig.strict.json` + migrations Supabase (steps 1–6) → custom JWT claims → puis features dans l'ordre de la séquence d'implémentation documentée.
