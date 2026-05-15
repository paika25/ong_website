# Documentation — Paika ONG Platform

**Générée le :** 2026-05-13
**Mode :** initial_scan (deep)
**Branche courante :** MMP/phase1

---

## Vue d'ensemble du projet

- **Type :** Monolithe Nuxt 3 full-stack
- **Langage :** TypeScript
- **Architecture :** Feature-based (DDD-lite) + Nitro API + Supabase
- **Déploiement :** Netlify

---

## Navigation rapide

### Documentation générée

| Document | Description |
|----------|-------------|
| [Vue d'ensemble](./project-overview.md) | Stack, rôles, épics, variables d'environnement |
| [Architecture](./architecture.md) | Patterns, couches, flux de requête, auth, Realtime |
| [Arborescence](./source-tree-analysis.md) | Arbre annoté complet du projet |
| [Contrats API](./api-contracts.md) | Tous les endpoints Nitro avec payloads et réponses |
| [Modèles de données](./data-models.md) | Schéma PostgreSQL, RLS, fonctions SECURITY DEFINER |
| [Inventaire composants](./component-inventory.md) | Tous les composants Vue par feature + hiérarchie typo |
| [Guide de développement](./development-guide.md) | Setup local, commandes, conventions, migrations |
| [Guide de déploiement](./deployment-guide.md) | Netlify, Supabase, Stripe, checklist |

---

## Démarrage rapide

```bash
# Setup local
npm install
cp .env.example .env   # Remplir les variables
npm run dev            # → http://localhost:3000

# Appliquer les migrations Supabase
npx supabase db push   # ou copier dans SQL Editor
```

Voir [Guide de développement](./development-guide.md) pour le détail.

---

## Points critiques à connaître

| Sujet | Où regarder |
|-------|------------|
| Machine d'états ONG | `server/services/ong-status.service.ts` |
| Audit trail (persistance) | `docs/data-models.md` + migration 17 |
| Rôles JWT | `server/middleware/auth.ts` + migration 16 |
| Score transparence | `server/services/score.service.ts` |
| Widget messagerie flottant | `features/ong/components/DashboardFloatingChat.vue` |
| Layout uniforme | `layouts/default.vue` + pages avec `layout: false` |

---

## Gaps connus (à implémenter)

| Gap | Description |
|-----|-------------|
| Email Brevo | `email.service.ts` est un stub — emails non envoyés |
| Score gate | Bouton "Soumettre" désactivé si score = 0 (nécessite `NUXT_SUPABASE_SERVICE_ROLE_KEY`) |
| Notification Realtime agent | L'agent n'est pas notifié en temps réel des changements de statut |
| Resubmit avec message back-office | Le message du back-office n'est pas affiché à l'agent avant resoumission |
