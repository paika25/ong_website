# Guide de déploiement — Paika ONG Platform

**Date :** 2026-05-13
**Plateforme :** Netlify
**Runtime serveur :** Nitro (preset `netlify`)

---

## Infrastructure

```
Netlify (Edge Functions + CDN)
    │
    ├── Pages Nuxt (SSR/SSG)
    ├── Nitro API Functions (/api/*)
    │
Supabase (hébergé)
    ├── PostgreSQL + PostgREST
    ├── Auth (JWT)
    ├── Realtime (WebSocket)
    └── Storage (documents ONG)
    │
Stripe (paiements)
```

---

## Déploiement sur Netlify

### 1. Build

```bash
npm run build
# Génère .output/ avec le preset netlify
```

### 2. Variables d'environnement Netlify

À configurer dans **Site settings > Environment variables** :

| Variable | Valeur |
|----------|--------|
| `NUXT_PUBLIC_SUPABASE_URL` | URL Supabase |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase |
| `NUXT_STRIPE_SECRET_KEY` | `sk_live_...` |
| `NUXT_STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `NUXT_PUBLIC_APP_URL` | `https://paika.mg` |

> `NUXT_SUPABASE_SERVICE_ROLE_KEY` : optionnel — active le recalcul automatique du score.

### 3. Webhook Stripe

Configurer dans le Dashboard Stripe :
- URL : `https://paika.mg/api/webhooks/stripe`
- Événements : `checkout.session.completed`, `payment_intent.payment_failed`

---

## Migrations base de données

Avant chaque déploiement majeur, appliquer les nouvelles migrations :

```bash
# Via CLI (si configuré)
npx supabase db push

# Ou manuellement dans Supabase SQL Editor
# Copier le contenu de supabase/migrations/XXXXX_nom.sql
```

**Migrations critiques pour un setup initial :**
1. Toutes de 01 à 17 dans l'ordre

---

## Checklist de déploiement

- [ ] Variables d'environnement configurées sur Netlify
- [ ] Migrations SQL appliquées dans Supabase (jusqu'à 17)
- [ ] Compte admin configuré (`app_metadata.role = 'admin'`)
- [ ] Webhook Stripe pointant vers la bonne URL
- [ ] `get_user_role()` testée sur un compte admin (retourne `'admin'`)
- [ ] `insert_audit_entry()` présente dans les fonctions Supabase
- [ ] RLS policies actives sur toutes les tables

---

## Monitoring

- **Logs Nitro** : Dashboard Netlify > Functions > Logs
- **Erreurs audit** : filtrer les logs sur `[ong-status] audit trail failed`
- **Erreurs emails** : filtrer sur `[ong-status] email failed`
- **RLS bloqué** : erreur Supabase `new row violates row-level security policy`

---

## Rollback

En cas de problème :
1. Revenir au commit précédent via Netlify (Deploys > Publish deploy)
2. Si migration SQL problématique : les migrations sont idempotentes, pas de rollback automatique — corriger manuellement
