# 📋 User Flow - Quick Reference

Guide de référence rapide pour l'équipe de développement.

**Dernière mise à jour** : 18 Janvier 2026 - v1.1

---

## 🎯 Routes actuelles

### ✅ Implémentées

| Route | Protection | Description | Composant principal |
|-------|-----------|-------------|-------------------|
| `/` | Public | Liste des ONGs | `OngList.client.vue` |
| `/ongs/[id]` | Public | Détail d'une ONG | `OngDetail.client.vue` |
| `/auth/login` | Guest only | Connexion | `Login.client.vue` |
| `/auth/signup` | Guest only | Inscription | `Signup.client.vue` |
| `/auth/callback` | Public | Callback OAuth | - |
| `/dashboard` | Auth required | **Dashboard dynamique selon rôle** | - |
| `/profil` | Auth required | Profil utilisateur | `Profil.client.vue` |

**Note Dashboard** : Affiche un contenu différent selon `accountType` :
- **Agent** (`user_agent`) : Vue détaillée de son ONG unique avec stats et gestion
- **Partenaire** (`user_partner`) : Liste de ses dons et bénévolat

### ⏳ À implémenter

| Route suggérée       | Protection    | Priorité  | Description              |
|----------------------|---------------|-----------|--------------------------|
| `/ongs/create`       | Agent only    | 🔴 HIGH   | Créer son ONG unique     |
| `/ongs/[id]/edit`    | Agent owner   | 🔴 HIGH   | Modifier son ONG         |
| `/my-donations`      | Partner only  | 🟡 MEDIUM | Historique dons détaillé |
| `/favorites`         | Partner only  | 🟡 MEDIUM | ONGs suivies             |
| `/auth/forgot`       | Guest only    | 🟡 MEDIUM | Mot de passe oublié      |
| `/settings`          | Auth required | 🟢 LOW    | Paramètres compte        |
| `/projects`          | Public        | 🟢 LOW    | Liste projets            |
| `/search`            | Public        | 🟢 LOW    | Recherche avancée        |

---

## 👥 Types d'utilisateurs

### Anonymous (Visiteur)
- ✅ Voir liste ONGs
- ✅ Voir détails ONG
- ❌ Actions nécessitant connexion

### User Partner (Partenaire) 💝
- ✅ Toutes actions Anonymous
- ✅ Suivre des ONGs
- ✅ Faire des dons
- ✅ Gérer son profil
- ✅ **Dashboard** : Liste de ses dons avec tableau détaillé
- ❌ Créer/modifier ONGs

### User Agent (Responsable) 🏢
- ✅ Toutes actions Partner
- ✅ Créer **une seule ONG** (1 agent = 1 ONG)
- ✅ Gérer son ONG unique
- ✅ Statistiques avancées de son ONG
- ✅ **Dashboard** : Vue détaillée de son ONG avec stats (bénévoles, projets, transparence)

---

## 🛡️ Middleware

| Fichier                  | Usage            | Vérifie                          |
|--------------------------|------------------|----------------------------------|
| `auth.client.ts`         | Routes protégées | `isAuthenticated === true`       |
| `guest.client.ts`        | Login/Signup     | `isAuthenticated === false`      |
| `agent-only.client.ts`   | Gestion ONGs     | `accountType === 'user_agent'`   |
| `partner-only.client.ts` | Pages partenaire | `accountType === 'user_partner'` |

**Usage dans une page** :
```vue
<script setup>
definePageMeta({
  middleware: ['auth-client']  // ou ['guest-client'], ['agent-only-client']
})
</script>
```

---

## 🎨 Composants clés

### Layout
- `Header.vue` - Navigation globale
- `Footer.client.vue` - Pied de page

### Auth
- `Login.client.vue` - Formulaire connexion
- `Signup.client.vue` - Formulaire inscription
- `UserHeader.client.vue` - Widget utilisateur (Header)

### ONG
- `OngList.client.vue` - Liste + filtres
- `OngListFilter.vue` - Filtres de recherche
- `Card.vue` - Card ONG individuelle
- `OngDetail.client.vue` - Page détail complète
- `OngProfile.client.vue` - Profil public ONG

### User
- `Profil.client.vue` - Profil éditable

---

## 🔄 Flows principaux

### 1. Inscription → Dashboard
```
/auth/signup → Remplir formulaire → Validation
→ Supabase create user → Store update
→ Redirect /dashboard
```

### 2. Login → Redirection
```
Tente /profil (protégé) → Non auth → Redirect /auth/login?redirect=/profil
→ Login success → Redirect /profil (destination originale)
```

### 3. Consulter ONG → Suivre
```
/ → Liste ONGs → Click ONG → /ongs/[id] → Click "Suivre"
→ Non auth? → /auth/login?redirect=/ongs/[id]
→ Auth? → API follow → Update UI
```

### 4. Agent gère son ONG
```
Login (agent) → /dashboard → Voir son ONG
→ "Gérer mon ONG" → /ongs/[id]/edit (futur)
→ Modifier infos → Ajouter projets → Sauvegarder
→ Dashboard mis à jour avec nouvelles stats
```

### 5. Partenaire consulte ses dons
```
Login (partner) → /dashboard → Section "Mes Dons"
→ Voir tableau : Date | ONG | Projet | Montant
→ Total affiché en haut
→ Cliquer sur une ONG → /ongs/[id] pour en savoir plus
```

---

## 📊 Services API

### authService.ts
```typescript
login(credentials)      // Connexion
signUp(data)           // Inscription
logout()               // Déconnexion
getCurrentUser()       // User actuel
updateProfile(data)    // MAJ profil
```

### ongService.ts
```typescript
getOngs()                      // Liste toutes
getOngById(id)                 // Une ONG
searchOngs(query)              // Recherche
getOngsByCategory(category)    // Par catégorie
```

### userService.ts
```typescript
getUserProfile(userId)         // Profil user
updateUserProfile(data)        // MAJ profil
uploadAvatar(file)             // Upload avatar
```

---

## 🗄️ Store Pinia (auth)

```typescript
// features/auth/stores/auth.client.ts

State:
- user: User | null
- isAuthenticated: boolean
- loading: boolean

Actions:
- setUser(user)              // Définir user
- setConnected()             // Marquer connecté
- clearUser()                // Clear (logout)
- loadUserFromStorage()      // Restaurer localStorage
```

**Usage** :
```typescript
import { useAuthStore } from '~/features/auth/stores/auth.client'

const authStore = useAuthStore()

// Check auth
if (authStore.isAuthenticated) {
  // User connecté
}

// Get user data
const user = authStore.user
console.log(user.email, user.accountType)
```

---

## 🔐 Supabase

### Plugin (`plugins/supabase.client.ts`)
- Initialise client Supabase
- Écoute `onAuthStateChange`
- Fournit `$supabase` dans app

### Composable (`composables/useSupabase.client.ts`)
```typescript
import { useSupabase } from '~/composables/useSupabase.client'

const supabase = useSupabase()

if (supabase) {
  const { data, error } = await supabase
    .from('ongs')
    .select('*')
}
```

⚠️ **Important** : 
- Ne s'exécute que côté client
- Retourne `null` côté serveur
- Toujours vérifier `if (supabase)` avant utilisation

---

## 🎯 Checklist implémentation page

### Nouvelle page protégée

```vue
<template>
  <div class="min-h-screen">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <ClientOnly>
        <!-- Composant principal -->
        <MyComponent />
        
        <template #fallback>
          <!-- Loading state -->
          <div class="animate-spin">Loading...</div>
        </template>
      </ClientOnly>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import MyComponent from '~/features/my-feature/components/MyComponent.client.vue'

// Protection route
definePageMeta({
  middleware: ['auth-client']  // ou agent-only-client, etc.
})

// SEO
useHead({
  title: 'Ma Page - ONG Platform',
  meta: [
    { name: 'description', content: 'Description...' }
  ]
})
</script>
```

### Checklist
- [ ] Définir route dans `pages/`
- [ ] Ajouter middleware si protégée
- [ ] Wrapper dans `<ClientOnly>` si client-only
- [ ] Ajouter Header/Footer
- [ ] Définir meta tags (SEO)
- [ ] Créer composant dans `features/`
- [ ] Implémenter service API si nécessaire
- [ ] Ajouter au user flow docs

---

## 🚨 Patterns à suivre

### Naming conventions
- **Pages** : `pages/ma-page.vue` (kebab-case)
- **Composants client** : `.client.vue` suffix
- **Composables client** : `.client.ts` suffix
- **Middleware client** : `.client.ts` suffix

### Structure feature
```
features/
└── ma-feature/
    ├── components/      # Composants Vue
    ├── composables/     # Logique réutilisable
    ├── services/        # API calls
    ├── stores/          # Pinia stores (si nécessaire)
    ├── types/           # TypeScript types
    └── data/            # Mock data (dev)
```

### API calls
```typescript
// Dans features/ma-feature/services/maFeatureService.ts

export const getItems = async () => {
  // SSR guard
  if (typeof window === 'undefined') {
    return mockData
  }
  
  const supabase = useSupabase()
  if (!supabase) return mockData
  
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
    
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error:', err)
    return mockData
  }
}
```

---

## 📝 TODO Liste

### Court terme (Sprint actuel)
- [ ] Tester le fix des requêtes Supabase (vérifier Network tab)
- [ ] Implémenter `/my-ongs` pour agents
- [ ] Créer `/ongs/create` - formulaire création ONG
- [ ] Ajouter `/auth/forgot` - reset password

### Moyen terme
- [ ] Page `/favorites` - ONGs suivies
- [ ] Système de notifications
- [ ] Page `/settings` - paramètres compte
- [ ] Améliorer filtres de recherche (multi-select)
- [ ] Upload d'images pour ONGs

### Long terme
- [ ] Système de rating/reviews ONGs
- [ ] Blog/Actualités
- [ ] Chat support en direct
- [ ] Export données (RGPD)
- [ ] Analytics dashboard (agents)

---

## 🐛 Debug rapide

### Problème : Requête Supabase bloquée
```typescript
// 1. Vérifier plugin chargé
console.log('$supabase:', nuxtApp.$supabase) // Should not be null

// 2. Vérifier client-side
console.log('Window?', typeof window !== 'undefined')

// 3. Vérifier session
const { data } = await supabase.auth.getSession()
console.log('Session:', data.session)

// 4. Network tab browser
// Doit voir requêtes vers supabase.co
```

### Problème : Middleware ne fonctionne pas
```typescript
// 1. Vérifier naming
// auth.client.ts → utiliser 'auth-client' (avec tiret!)

// 2. Vérifier store
const authStore = useAuthStore()
console.log('Auth?', authStore.isAuthenticated)

// 3. Vérifier localStorage
console.log(localStorage.getItem('user'))
```

### Problème : Composant ne s'affiche pas
```vue
<!-- 1. Wrapper dans ClientOnly si client-only -->
<ClientOnly>
  <MonComposant />
</ClientOnly>

<!-- 2. Vérifier import -->
<script setup>
// Import correct ?
import MonComposant from '~/path/to/Component.client.vue'
</script>

<!-- 3. Console errors? -->
<!-- Ouvrir F12 → Console → Vérifier erreurs -->
```

---

## 📚 Documentation liée

- `USER_FLOW.md` - Documentation complète
- `USER_FLOW_VISUAL.md` - Diagrammes visuels
- `middleware/README.md` - Doc middleware
- `middleware/MIGRATION.md` - Guide migration
- `composables/README.md` - Doc composables
- `docs/SUPABASE_FIX.md` - Fix Supabase

---

## 🤝 Contribution

### Avant de créer une nouvelle page
1. Vérifier si route existe déjà
2. Définir le type d'utilisateur (qui peut accéder?)
3. Choisir le bon middleware
4. Créer feature dans `features/`
5. Implémenter service API si besoin
6. Tester SSR (server-side rendering)
7. Mettre à jour cette doc

### Avant de créer un nouveau middleware
1. Vérifier si middleware existant peut être réutilisé
2. Nommer avec `.client.ts` si client-only
3. Documenter dans `middleware/README.md`
4. Ajouter exemples d'usage

### Avant de créer un nouveau composable
1. Vérifier si existe déjà
2. Nommer avec `.client.ts` si utilise APIs browser
3. Ajouter SSR guards si nécessaire
4. Documenter usage

---

**📅 Dernière mise à jour** : 18 Janvier 2026  
**👥 Équipe** : Dev Team  
**📋 Version** : 1.0
