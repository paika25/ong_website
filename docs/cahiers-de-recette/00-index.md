# Cahiers de Recette — Plateforme Paika ONG

## Fichiers

| # | Fichier | Profil | Cas |
|---|---|---|---|
| 01 | [01-guest.md](./01-guest.md) | Visiteur non connecté | Navigation publique, accès ONGs, protections |
| 02 | [02-user-partner.md](./02-user-partner.md) | Partenaire / Donateur | Dashboard dons, profil, restrictions rôle |
| 03 | [03-user-agent.md](./03-user-agent.md) | Agent ONG | Dashboard agent, ONG CRUD, score, visibilité |
| 04 | [04-admin.md](./04-admin.md) | Administrateur back-office | Pipeline vérification, gestion ONGs, dons, historique |
| 05 | [05-securite-acces.md](./05-securite-acces.md) | Tous profils | RLS croisés, isolation multi-tenant, triggers |
| 06 | [06-authentification.md](./06-authentification.md) | Tous profils | Inscription, connexion, forgot, reset, account settings |

---

## Comptes de test à préparer

| Alias | Email | Rôle | Données requises |
|---|---|---|---|
| GUEST | — | Non connecté | — |
| PARTNER_A | partner-a@test.paika.dev | `user_partner` | Au moins 2 dons enregistrés |
| PARTNER_B | partner-b@test.paika.dev | `user_partner` | Au moins 1 don (différent de A) |
| AGENT_A | agent-a@test.paika.dev | `user_agent` | Possède ONG_A (status=active) |
| AGENT_B | agent-b@test.paika.dev | `user_agent` | Sans ONG au départ |
| ADMIN | admin@test.paika.dev | `back_office` | Compte back-office avec accès admin |

---

## Conventions

**Criticité**
- `P1` — Bloquant : faille de sécurité ou fonctionnalité principale cassée
- `P2` — Majeur : dégradation notable, flux partiel
- `P3` — Mineur : cosmétique, cas marginal

**Statut**
- `[ ]` À tester
- `[x]` Passé
- `[!]` Échoué — décrire l'écart en commentaire sous le cas

**Environnement cible** : `https://paika-ong.netlify.app`  
**Navigateurs** : Chrome 120+, Firefox 120+, Safari 17+, Chrome mobile (Android)
