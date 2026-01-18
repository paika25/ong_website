# 📚 Documentation - ONG Platform

Bienvenue dans la documentation complète du projet **ONG Platform**.

**Version**: 1.1 | **Dernière mise à jour**: 18 Janvier 2026

---

## 🆕 Changements récents (v1.1 - 18 Jan 2026)

### Dashboard personnalisé par rôle
Le dashboard affiche maintenant un contenu **spécifique selon le type d'utilisateur** :

- **👥 Agent (`user_agent`)** : 
  - Vue détaillée de **son ONG unique** (1 agent = 1 ONG)
  - Statistiques : Bénévoles, Projets actifs, Transparence
  - Actions : "Voir page publique" + "Gérer mon ONG"
  - État vide avec bouton "Créer mon ONG" si pas encore créée

- **💝 Partenaire (`user_partner`)** :
  - Section "Mes Dons" avec tableau complet
  - Colonnes : Date, ONG, Projet, Montant, Statut
  - Total des dons affiché en temps réel
  - Historique bénévolat (à venir)

### Modèle 1 agent = 1 ONG
Chaque agent ne peut créer et gérer qu'**une seule ONG**, simplifiant la gestion et évitant la complexité.

---

## 📋 Index des documents

### 🗺️ User Flow & Navigation

| Document | Description | Audience |
|----------|-------------|----------|
| **[USER_FLOW.md](./USER_FLOW.md)** | Documentation complète du user flow avec tous les détails | Équipe complète, Product Owners |
| **[USER_FLOW_VISUAL.md](./USER_FLOW_VISUAL.md)** | Diagrammes visuels et schémas ASCII des parcours | Designers, Développeurs |
| **[USER_FLOW_QUICK_REF.md](./USER_FLOW_QUICK_REF.md)** | Guide de référence rapide pour l'équipe dev | Développeurs |

### 🔧 Guides techniques

| Document | Description | Audience |
|----------|-------------|----------|
| **[SUPABASE_FIX.md](./SUPABASE_FIX.md)** | Guide de résolution des problèmes Supabase | Développeurs |
| **[../middleware/README.md](../middleware/README.md)** | Documentation des middleware | Développeurs |
| **[../middleware/MIGRATION.md](../middleware/MIGRATION.md)** | Guide de migration middleware | Développeurs |
| **[../composables/README.md](../composables/README.md)** | Documentation des composables | Développeurs |

---

## 🎯 Quick Start

### Pour les nouveaux développeurs

1. **Comprendre l'architecture**
   - Lire [USER_FLOW.md](./USER_FLOW.md) section "Architecture des features"
   - Parcourir [USER_FLOW_VISUAL.md](./USER_FLOW_VISUAL.md) pour les diagrammes

2. **Setup environnement**
   ```bash
   # Installer les dépendances
   bun install
   
   # Variables d'environnement (.env)
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   
   # Démarrer le serveur
   bun run dev
   ```

3. **Référence rapide**
   - Consulter [USER_FLOW_QUICK_REF.md](./USER_FLOW_QUICK_REF.md) pour les patterns

4. **Debug Supabase**
   - Si problème de connexion → [SUPABASE_FIX.md](./SUPABASE_FIX.md)

---

## 📖 Structure de la documentation

```
docs/
├── README.md                    # Ce fichier (index)
├── USER_FLOW.md                 # User flow complet (6000+ lignes)
├── USER_FLOW_VISUAL.md          # Diagrammes visuels
├── USER_FLOW_QUICK_REF.md       # Référence rapide
└── SUPABASE_FIX.md              # Guide Supabase

middleware/
├── README.md                    # Doc middleware
└── MIGRATION.md                 # Migration guide

composables/
└── README.md                    # Doc composables
```

---

## 🎯 Par rôle

### Product Owner / Chef de projet
**Lire en priorité** :
1. [USER_FLOW.md](./USER_FLOW.md) - Vue d'ensemble complète
2. [USER_FLOW_VISUAL.md](./USER_FLOW_VISUAL.md) - Parcours utilisateurs
3. Section "Évolutions futures" dans USER_FLOW.md

### Designer / UX
**Lire en priorité** :
1. [USER_FLOW_VISUAL.md](./USER_FLOW_VISUAL.md) - Tous les diagrammes
2. Section "Responsive & UX" dans USER_FLOW.md
3. Section "États d'interface" dans USER_FLOW_VISUAL.md

### Développeur Frontend
**Lire en priorité** :
1. [USER_FLOW_QUICK_REF.md](./USER_FLOW_QUICK_REF.md) - Référence rapide
2. [../middleware/README.md](../middleware/README.md) - Middleware
3. [../composables/README.md](../composables/README.md) - Composables
4. [SUPABASE_FIX.md](./SUPABASE_FIX.md) - Si problèmes

### QA / Testeur
**Lire en priorité** :
1. [USER_FLOW.md](./USER_FLOW.md) - Section "Scénarios d'usage"
2. [USER_FLOW_VISUAL.md](./USER_FLOW_VISUAL.md) - Flows par rôle
3. Section "Points d'entrée utilisateur" dans USER_FLOW.md

---

## 🚀 Concepts clés

### Types d'utilisateurs
- **Anonymous** : Visiteur non connecté (lecture seule)
- **User Partner** : Partenaire/Donateur (suivre ONGs, donner, voir historique dons)
- **User Agent** : Responsable d'ONG (**1 agent = 1 ONG**, créer/gérer son organisation unique)

### Architecture
- **Nuxt 3** : SSR/Hybrid rendering
- **Supabase** : Backend (Auth + Database)
- **Pinia** : State management
- **Feature-based** : Code organisé par feature (`features/`)
- **Dashboard dynamique** : Contenu adapté selon le rôle de l'utilisateur

### Middleware
- `auth.client.ts` : Protège routes (connecté requis)
- `guest.client.ts` : Accès non-connectés uniquement
- `agent-only.client.ts` : Réservé aux agents (gestion ONG)
- `partner-only.client.ts` : Réservé aux partenaires (favoris, dons)

### Naming conventions
- `.client.vue` / `.client.ts` : Code client-only
- `.server.ts` : Code server-only
- `.vue` / `.ts` : Code universel (SSR + client)

---

## 📊 Statistiques du projet

### Pages implémentées
- ✅ 7 pages fonctionnelles
- ✅ Dashboard avec 2 vues distinctes (agent/partenaire)
- ⏳ 6 pages planifiées

### Features
- ✅ Auth (login, signup, session)
- ✅ ONGs (liste, détail, recherche)
- ✅ User (profil, dashboard personnalisé)
- ✅ Dashboard Agent (vue ONG unique avec stats)
- ✅ Dashboard Partenaire (historique dons)
- ⏳ Gestion ONG (create, edit)
- ⏳ Favoris/Suivi
- ⏳ Système de dons complet

### Middleware
- ✅ 4 middleware fonctionnels
- 📝 Documentation complète

### Composants
- ✅ 15+ composants réutilisables
- 📁 Organisation feature-based

---

## 🔄 Processus de mise à jour

### Quand mettre à jour cette doc ?

1. **Nouvelle page créée**
   - Ajouter à la section "Routes" dans USER_FLOW.md
   - Ajouter au diagramme dans USER_FLOW_VISUAL.md
   - Ajouter checklist dans USER_FLOW_QUICK_REF.md

2. **Nouveau middleware**
   - Documenter dans middleware/README.md
   - Ajouter section dans USER_FLOW.md
   - Ajouter exemple dans USER_FLOW_QUICK_REF.md

3. **Nouveau composable**
   - Documenter dans composables/README.md
   - Ajouter dans USER_FLOW_QUICK_REF.md

4. **Changement de flow**
   - Mettre à jour USER_FLOW.md (section concernée)
   - Mettre à jour diagrammes dans USER_FLOW_VISUAL.md
   - Mettre à jour la date "Dernière mise à jour"

### Template commit message
```
docs: update user flow for [feature]

- Add [new page/component/middleware]
- Update [section] in USER_FLOW.md
- Update diagram in USER_FLOW_VISUAL.md
```

---

## 🐛 Problèmes courants

### "Requêtes Supabase bloquées"
→ Voir [SUPABASE_FIX.md](./SUPABASE_FIX.md)

### "Middleware ne fonctionne pas"
→ Voir [middleware/README.md](../middleware/README.md) section "Troubleshooting"

### "Composant client ne s'affiche pas"
→ Wrapper dans `<ClientOnly>` et vérifier import

### "Session perdue au refresh"
→ Vérifier localStorage + Supabase session

---

## 📞 Support

### Questions ?

1. **Check docs** : Chercher dans les fichiers ci-dessus
2. **Check code** : Exemples dans `features/` et `pages/`
3. **Check console** : Logs de debug disponibles
4. **Ask team** : Slack/Discord/Email

### Contribuer à la doc

1. Fork/Branch
2. Modifier les docs concernées
3. Tester que les liens fonctionnent
4. Commit avec message descriptif
5. PR avec description claire

---

## 🎯 Roadmap documentation

### ✅ Fait
- [x] User flow complet
- [x] Diagrammes visuels
- [x] Quick reference
- [x] Middleware docs
- [x] Composables docs
- [x] Supabase troubleshooting

### ⏳ À faire
- [ ] API documentation (endpoints Supabase)
- [ ] Component storybook
- [ ] E2E test scenarios
- [ ] Performance guidelines
- [ ] Security best practices
- [ ] Deployment guide

---

## 📅 Changelog

### 2026-01-18 v1.1 (Mise à jour majeure)
- 🎨 **Dashboard redesign** : Vue personnalisée selon rôle utilisateur
- 🏢 Agent : Dashboard avec ONG unique (stats + gestion)
- 💝 Partenaire : Dashboard avec historique dons
- 📊 Modèle "1 agent = 1 ONG" implémenté
- 📝 Documentation mise à jour (USER_FLOW, VISUAL, QUICK_REF)
- ✨ Statistiques ONG : Bénévoles, Projets, Transparence
- 🎯 États vides avec messages d'encouragement

### 2026-01-18 v1.0
- ✨ Création documentation complète user flow
- 📝 Ajout diagrammes visuels
- 📚 Création quick reference guide
- 🎯 Index centralisé (ce fichier)

### 2026-01-15
- 🔧 Documentation fix Supabase
- 📝 Migration guide middleware

### 2026-01-10
- 📚 Documentation middleware
- 📚 Documentation composables

---

## 📜 License

Ce projet est privé. Documentation à usage interne uniquement.

---

**📅 Dernière mise à jour** : 18 Janvier 2026  
**👤 Maintenu par** : Équipe Dev ONG Platform  
**📧 Contact** : [Votre email]

---

## 🎉 Quick Links

- [📖 User Flow Complet](./USER_FLOW.md)
- [🎨 Diagrammes Visuels](./USER_FLOW_VISUAL.md)
- [⚡ Référence Rapide](./USER_FLOW_QUICK_REF.md)
- [🔧 Fix Supabase](./SUPABASE_FIX.md)
- [🛡️ Middleware](../middleware/README.md)
- [🪝 Composables](../composables/README.md)

**Happy coding! 🚀**
