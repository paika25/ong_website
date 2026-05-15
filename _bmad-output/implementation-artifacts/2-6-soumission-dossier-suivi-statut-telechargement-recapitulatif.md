# Story 2.6 : Soumission Dossier, Suivi Statut & Téléchargement Récapitulatif

Status: in-progress

## Story

En tant que `user_agent`,
je veux soumettre mon dossier et suivre son état de vérification en temps réel,
afin d'être informé de l'avancement sans avoir à contacter le back-office.

## Acceptance Criteria

1. Modal de confirmation s'affiche avant soumission avec résumé du dossier (UX-DR23)
2. Après confirmation, `POST /api/ongs/:id/submit` passe le statut à `submitted`
3. Le serveur appelle le stub `sendTransactionalEmail('signup_confirmation', ...)`
4. `DashboardAgentOng` affiche le statut temps réel via Supabase Realtime
5. Statuts affichés : Soumis / En révision / Complément requis / ✓ Vérifié / Rejeté
6. Header contextuel : % complétude + score actuel (UX-DR11)
7. Skeleton loader pendant le chargement du statut (UX-DR15)
8. CTA "Télécharger le récapitulatif" → page `/ongs/:id/recap` HTML imprimable
9. `bun run dev` démarre sans erreur

## Tasks / Subtasks

- [x] **T1 — Extension statuts ONG + migration** (AC: 2, 5)
  - [x] Étendre type ONG : `submitted | under_review | complement_required | verified | rejected`
  - [x] Migration SQL `20260509_09_ong-status-submitted.sql`
- [x] **T2 — `nuxt.config.ts` : `supabaseServiceRoleKey` privé** (AC: 2)
- [x] **T3 — Middleware auth : rôle optionnel hors back-office** (AC: 2)
  - [x] Role requis uniquement pour `/api/back-office/*` — autres routes : JWT valide suffit
- [x] **T4 — `server/api/ongs/[id]/submit.post.ts`** (AC: 2, 3)
  - [x] Vérifier ownership (`account_id = context.userId`)
  - [x] `UPDATE ongs SET status = 'submitted'`
  - [x] Appel `sendTransactionalEmail` stub (fire & forget)
- [x] **T5 — `OngDossierStepper` : modal confirmation + appel API** (AC: 1, 2)
  - [x] `UModal` avec résumé (nomOng, score, docs présents)
  - [x] Appel `/api/ongs/:id/submit` avec Bearer token session
  - [x] Toast succès + emit `completed`
- [x] **T6 — `DashboardAgentOng` refactor** (AC: 4, 5, 6, 7)
  - [x] Charge son propre ONG (plus de prop depuis parent)
  - [x] Supabase Realtime subscription sur statut
  - [x] Skeleton loader × 3 lignes pendant chargement
  - [x] Barre de complétude (champs ONG remplis)
  - [x] Tous les statuts avec labels et couleurs
  - [x] Lien "Télécharger le récapitulatif"
- [x] **T7 — `pages/dashboard.vue`** : supprimer `userOng` prop passé à `DashboardAgentOng`
- [x] **T8 — `pages/ongs/[id]/recap.client.vue`** (AC: 8)
  - [x] Chargement ONG depuis Supabase client
  - [x] Layout imprimable + bouton `window.print()`
- [x] **T9 — Vérification** (AC: 9)

## Dev Notes

### Statuts ONG étendus

```
pending              → En cours de création
submitted            → Soumis
under_review         → En révision
complement_required  → Complément requis
active | verified    → ✓ Vérifié
rejected             → Rejeté
inactive             → Inactif
```

### Complétude % (dashboard)

```
name présent         : +20
description ≥ 20c    : +20
location présent     : +15
email présent        : +15
projects.length > 0  : +15
phone présent        : +15
```

### Realtime Supabase

Requiert l'activation Realtime sur la table `ongs` dans Dashboard Supabase → Database → Replication.

### NUXT_SUPABASE_SERVICE_ROLE_KEY

Variable d'environnement privée côté serveur. Ajouter dans `.env` et Netlify env vars.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Completion Notes List

- Middleware auth relaxé : rôle uniquement obligatoire pour `/api/back-office/*`, autres routes acceptent JWT valide sans rôle (fallback si migration 07 pas encore appliquée).
- Submit endpoint utilise Supabase admin client avec service role key.
- `DashboardAgentOng` refactorisé pour charger son propre ONG et gérer Realtime — `pages/dashboard.vue` n'a plus besoin de passer `userOng`.
- Recap page en `.client.vue` (auth + `getOngById` sont client-only).

### File List

- `features/ong/type/index.ts` — modifié (statuts étendus)
- `supabase/migrations/20260509_09_ong-status-submitted.sql` — nouveau
- `nuxt.config.ts` — modifié (`supabaseServiceRoleKey` privé)
- `server/middleware/auth.ts` — modifié (rôle optionnel hors back-office)
- `server/api/ongs/[id]/submit.post.ts` — nouveau
- `features/ong-profile/components/OngDossierStepper.vue` — modifié (modal + API call)
- `features/ong/components/DashboardAgentOng.vue` — refactorisé
- `pages/dashboard.vue` — modifié (suppression userOng prop)
- `pages/ongs/[id]/recap.client.vue` — nouveau

### Change Log

- 2026-05-11 : Story créée et implémentée (AG: claude-sonnet-4-6)
