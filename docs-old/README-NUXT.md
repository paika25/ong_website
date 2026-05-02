# Portfolio Nuxt.js

Portfolio personnel développé avec Nuxt.js, Vue 3, TypeScript et Tailwind CSS avec SSR (Server-Side Rendering).

## 🚀 Migration React → Nuxt.js

Ce projet a été migré d'une application React/Vite vers Nuxt.js pour bénéficier du SSR et d'une meilleure expérience de développement Vue.js.

## 🛠 Technologies utilisées

- **Nuxt.js 3.14** - Framework Vue.js avec SSR
- **Vue 3.5** - Framework JavaScript réactif
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **@nuxt/ui** - Bibliothèque de composants UI pour Nuxt
- **Pinia** - Gestion d'état Vue 3
- **VueUse** - Collection d'utilitaires Vue Composition API
- **Lucide Vue** - Icônes

## 📦 Installation

Assurez-vous d'utiliser Node.js 22+ avec nvm :

```bash
nvm use 22
npm install
```

## 🏃‍♂️ Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Générer un site statique
npm run generate

# Prévisualiser la version de production
npm run preview
```

## 🌐 Fonctionnalités

- ✅ **SSR** - Rendu côté serveur pour de meilleures performances SEO
- ✅ **Mode sombre/clair** - Basculement automatique du thème
- ✅ **Responsive** - Design adaptatif mobile-first
- ✅ **Components Vue 3** - Composition API moderne
- ✅ **TypeScript** - Type safety complet
- ✅ **Animations CSS** - Animations fluides avec Tailwind

## 📁 Structure

```
nuxt-folio/
├── components/           # Composants Vue réutilisables
│   ├── sections/        # Sections du portfolio
│   ├── Header.vue       # En-tête de navigation
│   ├── Footer.vue       # Pied de page
│   └── ThemeToggle.vue  # Bouton de basculement de thème
├── pages/               # Pages Nuxt (routing automatique)
│   └── index.vue        # Page d'accueil
├── assets/              # Assets (CSS, images, etc.)
│   └── css/
│       └── main.css     # Styles Tailwind personnalisés
├── public/              # Fichiers statiques
├── nuxt.config.ts       # Configuration Nuxt
└── tailwind.config.ts   # Configuration Tailwind
```

## 🎨 Thèmes

Le portfolio prend en charge les modes sombre et clair avec un système de couleurs personnalisé basé sur HSL et des variables CSS.

## 📱 Sections

- **Hero** - Présentation principale
- **À propos** - Description personnelle
- **Expérience** - Historique professionnel
- **Projets** - Portfolio de projets
- **Compétences** - Stack technique
- **Réalisations** - Accomplissements
- **Formation** - Parcours académique
- **Contact** - Informations de contact

## 🔧 Configuration

Le projet est configuré avec :
- Hot Module Replacement (HMR)
- Auto-imports des composants
- Optimisation automatique des images
- Configuration ESLint/Prettier
- Support TypeScript natif

## 🚀 Déploiement

Le projet peut être déployé sur différentes plateformes :

```bash
# Build pour la production
npm run build

# Génération statique pour GitHub Pages, Netlify, etc.
npm run generate
```

Plateformes recommandées :
- **Vercel** - Déploiement automatique avec SSR
- **Netlify** - Génération statique
- **GitHub Pages** - Site statique gratuit