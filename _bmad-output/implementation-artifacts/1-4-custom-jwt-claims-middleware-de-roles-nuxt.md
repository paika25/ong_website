# Story 1.4 : Custom JWT Claims & Middleware de Rôles Nuxt

Status: review

## Story

En tant que système,
je veux que le rôle utilisateur soit encodé dans le JWT via `app_metadata` et vérifié côté serveur,
afin que les pages protégées soient inaccessibles sans le bon rôle, en SSR comme en CSR.

## Acceptance Criteria

1. Le trigger Postgres `set_user_role_claim` encode `app_metadata.role` dans le JWT à l'inscription
2. Les utilisateurs existants ont leur `app_metadata.role` rempli via backfill
3. `middleware/auth.ts` (universel) protège les pages authentifiées en SSR et CSR
4. `middleware/back-office.ts` protège les routes `/back-office/*` — rôle `back_office` requis
5. `middleware/agent-only.ts` (universel) protège les routes `/dashboard/agent/*`
6. `server/middleware/auth.ts` protège les routes API Nitro (`server/api/`)
7. Les middlewares `.client.ts` existants sont conservés (aucune régression)
8. `bun run dev` démarre sans erreur

## Tasks / Subtasks

- [x] **T1 — Trigger SQL `set_user_role_claim`** (AC: 1, 2)
- [x] **T2 — `middleware/auth.ts` universel** (AC: 3)
- [x] **T3 — `middleware/back-office.ts`** (AC: 4)
- [x] **T4 — `middleware/agent-only.ts` universel** (AC: 5)
- [x] **T5 — `server/middleware/auth.ts` Nitro** (AC: 6)
- [x] **T6 — Vérification** (AC: 7, 8)

## Dev Notes

### Ce qui existe — NE PAS CASSER

- `middleware/auth.client.ts` → `auth-client` (garder intact)
- `middleware/agent-only.client.ts` → `agent-only-client` (garder intact)
- `middleware/partner-only.client.ts` → `partner-only-client` (garder intact)
- `middleware/guest.client.ts` → `guest-client` (garder intact)

Les pages existantes utilisent les middlewares `-client`. Ne pas les modifier.

### SQL : trigger à appliquer dans le Dashboard Supabase SQL Editor

```sql
-- migration 20260509_07_jwt-role-claims.sql
```

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Completion Notes List

- Trigger `set_user_role_claim` crée en migration 07 + backfill utilisateurs existants.
- `middleware/auth.ts` universel : côté client → store Pinia + Supabase ; côté SSR → cookie `sb-*-auth-token`.
- `middleware/back-office.ts` : lit le rôle depuis `app_metadata.role` dans le JWT (disponible après migration 07).
- `middleware/agent-only.ts` : idem, remplace progressivement `agent-only.client.ts`.
- `server/middleware/auth.ts` : protège toutes les routes `/api/` Nitro, injecte `event.context.userId` et `event.context.userRole`.
- Routes publiques exclues : `/api/ongs`, `/api/webhooks/vanilla-pay`.
- **Migration 07 à appliquer manuellement** via Dashboard Supabase SQL Editor.
- **Gap SSR fermé (2026-05-10)** : 5 pages migrées des middlewares `.client` vers les universels — SSR actif sur dashboard, Profil, account/settings, ongs/new, ongs/[id]/edit.
- Les middlewares `.client.ts` sont conservés pour toute page future qui en aurait besoin (aucune régression).

### File List

- `supabase/migrations/20260509_07_jwt-role-claims.sql` — nouveau
- `middleware/auth.ts` — nouveau (universel SSR+CSR)
- `middleware/back-office.ts` — nouveau
- `middleware/agent-only.ts` — nouveau (universel SSR+CSR)
- `server/middleware/auth.ts` — nouveau (Nitro)
- `pages/dashboard.vue` — modifié (`auth-client` → `auth`)
- `pages/Profil.vue` — modifié (`auth-client` → `auth`)
- `pages/account/settings.vue` — modifié (`auth-client` → `auth`)
- `pages/ongs/new.vue` — modifié (`auth-client, agent-only-client` → `auth, agent-only`)
- `pages/ongs/[id]/edit.vue` — modifié (`auth-client, agent-only-client` → `auth, agent-only`)
