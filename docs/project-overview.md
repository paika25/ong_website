# Paika ONG Platform — Vue d'ensemble du projet

**Version :** Phase 1 (MMP — Minimum Marketable Product)
**Date :** 2026-05-13
**Statut :** En production (Netlify)

---

## Résumé exécutif

Paika ONG Platform est une plateforme web de certification et de mise en valeur des ONG à Madagascar. Elle permet aux organisations de constituer un dossier numérique complet, de le soumettre à un back-office pour certification, et d'être visibles auprès des partenaires et bailleurs de fonds.

La plateforme couvre trois domaines :
1. **Coffre-fort documentaire** — les agents ONG constituent et soumettent leur dossier en 5 étapes.
2. **Back-office de certification** — un pipeline Kanban permet aux opérateurs de valider, rejeter ou demander des compléments.
3. **Score de transparence** — un algorithme calcule un score basé sur 5 critères de complétude et de conformité.

---

## Stack technologique

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| Framework full-stack | Nuxt 3 | ^3.14 |
| Runtime serveur | Nitro (Netlify preset) | incl. Nuxt |
| Langage | TypeScript | strict |
| UI Framework | Vue 3 (Composition API) | incl. Nuxt |
| Composants UI | Nuxt UI | ^2.20 |
| CSS | Tailwind CSS | ^3 |
| État global | Pinia | ^0.6 |
| Base de données | Supabase (PostgreSQL + RLS) | hosted |
| Auth | Supabase Auth + JWT custom claims | — |
| Paiements | Stripe | ^17 |
| Email transactionnel | Brevo (stub) | — |
| Déploiement | Netlify | — |
| Tests | Vitest | ^3 |

---

## Type d'architecture

**Monolithe Nuxt full-stack** — frontend et API dans le même dépôt.

- **Frontend** : Vue 3 + Nuxt pages/layouts/components
- **Backend** : Nitro API handlers (`server/api/`)
- **Base de données** : Supabase hébergé (PostgreSQL + PostgREST + Auth + Realtime + Storage)

---

## Rôles utilisateurs

| Rôle JWT (`app_metadata.role`) | Accès |
|-------------------------------|-------|
| `user_agent` | Crée et gère son ONG, soumet son dossier, échange avec le back-office |
| `user_partner` | Parcourt les ONGs, effectue des dons |
| `back_office` / `admin` | Valide/rejette les dossiers, accède au back-office complet |

---

## Machine d'états ONG

```
pending → submitted → under_review → verified
                                   ↘ rejected
                                   ↘ complement_required → (resubmit) → submitted
verified → active
verified → suspended → (reactivate) → verified
any     → inactive
```

Chaque transition passe obligatoirement par `ong-status.service.ts` et génère une entrée dans `audit_trail`.

---

## Épics implémentées (Phase 1)

| Epic | Contenu |
|------|---------|
| **Epic 1 — Auth & Sécurité** | JWT custom claims, middleware SSR universel, rôles RLS |
| **Epic 2 — Coffre-fort documentaire** | Stepper 5 étapes, URL par step, restore Supabase, visibilité sections, soumission + récapitulatif |
| **Epic 3 — Back-office certification** | PipelineKanban, endpoints validate/reject/complement/suspend/start-review, audit trail |
| **Epic 4 — Score & UX** | score.service.ts (5 critères), ScoreTransparenceWidget, tableau de bord agent |

---

## Variables d'environnement

| Variable | Obligatoire | Usage |
|----------|------------|-------|
| `NUXT_PUBLIC_SUPABASE_URL` | ✅ | URL Supabase |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clé publique Supabase |
| `NUXT_SUPABASE_SERVICE_ROLE_KEY` | ⚠️ non configuré | Bypass RLS (score recalc) |
| `NUXT_STRIPE_SECRET_KEY` | ✅ | Paiements Stripe |
| `NUXT_STRIPE_WEBHOOK_SECRET` | ✅ | Vérification webhooks Stripe |
| `NUXT_PUBLIC_APP_URL` | ✅ | URL publique de l'app |

> ⚠️ Sans `NUXT_SUPABASE_SERVICE_ROLE_KEY`, le recalcul automatique du score est désactivé. L'audit trail fonctionne via la fonction RPC `insert_audit_entry` (SECURITY DEFINER).
