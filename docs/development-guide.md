# Guide de développement — Paika ONG Platform

**Date :** 2026-05-13

---

## Prérequis

| Outil | Version minimale |
|-------|----------------|
| Node.js | 18+ |
| npm | 9+ |
| Compte Supabase | — |
| Compte Stripe | — |

---

## Installation locale

```bash
# 1. Cloner le dépôt
git clone <repo-url>
cd ONG

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env
```

---

## Variables d'environnement

Fichier `.env` à la racine :

```env
# Supabase
NUXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Optionnel — active score recalc automatique
# NUXT_SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
NUXT_STRIPE_SECRET_KEY=sk_test_...
NUXT_STRIPE_WEBHOOK_SECRET=whsec_...

# App
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Commandes de développement

```bash
# Démarrer le serveur de développement (hot reload)
npm run dev
# → http://localhost:3000

# Build de production
npm run build

# Prévisualiser le build de prod
npm run preview

# Générer les types Nuxt
npm run postinstall
```

---

## Appliquer les migrations Supabase

Les migrations sont dans `supabase/migrations/`. Pour les appliquer :

```bash
# Via CLI Supabase
npx supabase db push

# Ou copier-coller dans le SQL Editor Supabase Dashboard
```

**Ordre des migrations :** 01 → 17 (toutes idempotentes — `CREATE OR REPLACE`, `CREATE TABLE IF NOT EXISTS`).

**Migration critique à appliquer en premier lors d'un nouveau setup :**
- Migration 07 : JWT custom claims (trigger sur `auth.users`)
- Migration 16 : Fix `get_user_role()` (lit `app_metadata.role`)
- Migration 17 : `insert_audit_entry()` SECURITY DEFINER (audit trail sans service_role key)

---

## Configurer le rôle admin dans Supabase

Les comptes `admin` doivent avoir `app_metadata.role = 'admin'` dans Supabase Auth :

```sql
-- Dans le SQL Editor Supabase
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'),
  '{role}', '"admin"'
)
WHERE email = 'admin@example.com';
```

---

## Architecture des branches git

| Branche | Usage |
|---------|-------|
| `main` | Production |
| `MMP/phase1` | Phase 1 (branche courante) |

---

## Structure d'un handler Nitro type

```typescript
// server/api/resource/[id]/action.post.ts
import { applyStatusTransition } from '../../../services/ong-status.service'

export default defineEventHandler(async (event) => {
  const ongId  = getRouterParam(event, 'id')
  const userId = event.context.userId          // injecté par server/middleware/auth.ts
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  const body   = await readBody(event)

  if (!ongId || !userId || !token)
    throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const result = await applyStatusTransition(ongId, 'validate', token, userId)
  if (!result.success)
    throw createError({ statusCode: 422, statusMessage: result.error })

  return { success: true, status: result.newStatus }
})
```

---

## Ajouter une transition de statut ONG

1. Ajouter l'action dans `StatusAction` type (`server/services/ong-status.service.ts`)
2. Définir la transition dans `TRANSITIONS` (from, to, auditAction, requiresComment)
3. Créer le handler Nitro (`server/api/admin/dossiers/[id]/action.post.ts`)
4. (Optionnel) Ajouter un email template dans `email.service.ts`

---

## Ajouter un critère au score

1. Modifier `server/services/score.service.ts` — ajouter le critère dans `getScoreCriteria()`
2. Créer une migration pour la nouvelle version de l'algo dans `algorithm_versions`
3. Mettre à jour `ScoreTransparenceWidget.vue` si nécessaire

---

## Tests

```bash
# Lancer les tests (Vitest)
npm run test

# Avec couverture
npx vitest --coverage
```

> Les tests unitaires sont dans `**/*.test.ts` / `**/*.spec.ts`.

---

## Conventions de code

- **TypeScript strict** — pas de `any` sauf cas légitimes (Supabase return types)
- **Composants client** — suffixe `.client.vue` pour tout ce qui utilise `window`, `localStorage`, ou des API navigateur
- **Pas de commentaires** sur le "quoi" — seulement sur le "pourquoi" quand non-obvious
- **Hierarchy typo** — voir `docs/component-inventory.md` section finale
- **Imports explicites** dans les features (pas d'auto-import magique)

---

## Points de vigilance

| Point | Action requise |
|-------|---------------|
| `NUXT_SUPABASE_SERVICE_ROLE_KEY` non configuré | Score recalc automatique désactivé |
| Policies RLS sur `ongs` | Vérifier après toute modification de schéma |
| `get_user_role()` dépend de `app_metadata.role` | Migration 07 + 16 obligatoires |
| `insert_audit_entry()` | Migration 17 obligatoire — sinon audit trail vide |
| Stripe externalisé du bundle | Ne pas modifier `externals` dans `nuxt.config.ts` |
