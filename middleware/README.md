# 🛡️ Middleware Documentation

Tous les middlewares sont **CLIENT-ONLY** (`.client.ts`) car ils utilisent :
- `useAuthStore()` qui accède à `localStorage`
- `useSupabase()` qui utilise le plugin client
- Navigation client avec `navigateTo()`

⚠️ **Important**: Nuxt transforme automatiquement les noms de fichiers `.client.ts` en ajoutant `-client` au nom du middleware.

## 📚 Middlewares disponibles

### `auth.client.ts` → middleware: `'auth-client'`
**Type:** Client-only route middleware  
**Objectif:** Protéger les pages qui nécessitent une connexion

#### Fonctionnement
1. Vérifie si la page est publique (whitelist)
2. Vérifie `authStore.isConnected`
3. Vérifie la session Supabase
4. Redirige vers `/auth/login` si non connecté

#### Pages publiques (whitelist)
```typescript
[
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/auth/forgot',
  '/auth/reset-password',
  '/about',
  '/contact',
  '/ongs',
  '/ongs/*'  // Toutes les pages ONG
]
```

#### Usage
```vue
<script setup>
definePageMeta({
  middleware: ['auth-client']  // ⚠️ Notez le '-client'
})
</script>
```

#### Exemple : Page Dashboard
```vue
<!-- pages/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: ['auth-client']
})

// L'utilisateur est garanti connecté ici
const authStore = useAuthStore()
console.log(authStore.currentUser) // ✅ Jamais null
</script>
```

---

### `guest.client.ts` → middleware: `'guest-client'`
**Type:** Client-only route middleware  
**Objectif:** Réserver les pages aux utilisateurs NON connectés

#### Fonctionnement
1. Vérifie `authStore.isConnected`
2. Vérifie la session Supabase
3. Redirige vers `/dashboard` si déjà connecté
4. Supporte le paramètre `?redirect=` pour redirection personnalisée

#### Usage
```vue
<script setup>
definePageMeta({
  middleware: ['guest-client']  // ⚠️ Notez le '-client'
})
</script>
```

#### Exemple : Page Login
```vue
<!-- pages/auth/Login.vue -->
<script setup>
definePageMeta({
  middleware: ['guest-client']
})

// Si l'utilisateur est déjà connecté, 
// il est automatiquement redirigé vers /dashboard
</script>
```

#### Redirection personnalisée
```
/auth/login?redirect=/profil
→ Après login, redirige vers /profil au lieu de /dashboard
```

---

### `agent-only.client.ts` → middleware: `'agent-only-client'`
**Type:** Client-only route middleware  
**Objectif:** Réserver les pages aux agents ONG uniquement

#### Fonctionnement
1. Vérifie l'authentification (récupère la session si nécessaire)
2. Vérifie `authStore.isAgent`
3. Redirige vers `/dashboard` si pas agent

#### Usage
```vue
<script setup>
definePageMeta({
  middleware: ['auth-client', 'agent-only-client']  // ⚠️ Combiner avec 'auth-client'
})
</script>
```

#### Exemple : Page gestion ONG
```vue
<!-- pages/ongs/manage.vue -->
<script setup>
definePageMeta({
  middleware: ['auth-client', 'agent-only-client']
})

// Seuls les agents ONG peuvent accéder ici
const authStore = useAuthStore()
console.log(authStore.currentUser.accountType) // 'user_agent'
</script>
```

---

### `partner-only.client.ts` → middleware: `'partner-only-client'`
**Type:** Client-only route middleware  
**Objectif:** Réserver les pages aux partenaires uniquement

#### Fonctionnement
1. Vérifie l'authentification (récupère la session si nécessaire)
2. Vérifie `authStore.isPartner`
3. Redirige vers `/dashboard` si pas partenaire

#### Usage
```vue
<script setup>
definePageMeta({
  middleware: ['auth-client', 'partner-only-client']  // ⚠️ Combiner avec 'auth-client'
})
</script>
```

#### Exemple : Page donations partenaire
```vue
<!-- pages/donations/manage.vue -->
<script setup>
definePageMeta({
  middleware: ['auth-client', 'partner-only-client']
})

// Seuls les partenaires peuvent accéder ici
const authStore = useAuthStore()
console.log(authStore.currentUser.accountType) // 'partner'
</script>
```

---

## 🔄 Flux d'exécution

### Scénario 1 : Utilisateur non connecté visite `/dashboard`

```
1. CLIENT - Navigation vers /dashboard
   ↓
2. CLIENT - middleware/auth.client.ts s'exécute
   ↓
3. authStore.isConnected → false
   ↓
4. supabase.auth.getSession() → null
   ↓
5. navigateTo('/auth/login?redirect=/dashboard') ✅
   ↓
6. Redirection instantanée avant le chargement de la page
```

### Scénario 2 : Utilisateur connecté (agent) visite page partenaire

```
1. CLIENT - Navigation vers /donations/manage
   ↓
2. CLIENT - middleware/auth.client.ts s'exécute
   ├─> authStore.isConnected → true ✅
   └─> Laisse passer
   ↓
3. CLIENT - middleware/partner-only.client.ts s'exécute
   ├─> authStore.isPartner → false ❌
   └─> navigateTo('/dashboard')
   ↓
4. Redirection avec avertissement console
```

### Scénario 3 : Utilisateur connecté visite `/auth/login`

```
1. CLIENT - Navigation vers /auth/login
   ↓
2. CLIENT - middleware/guest.client.ts s'exécute
   ↓
3. authStore.isConnected → true
   ↓
4. navigateTo('/dashboard') ✅
   ↓
5. Redirection instantanée (déjà connecté)
```

---

## 🎯 Combinaisons de middlewares

### Protection simple
```vue
definePageMeta({
  middleware: ['auth-client']
})
```
→ Utilisateur doit être connecté (n'importe quel rôle)

### Protection par rôle (agent)
```vue
definePageMeta({
  middleware: ['auth-client', 'agent-only-client']
})
```
→ Utilisateur doit être connecté ET être un agent ONG

### Protection par rôle (partenaire)
```vue
definePageMeta({
  middleware: ['auth-client', 'partner-only-client']
})
```
→ Utilisateur doit être connecté ET être un partenaire

### Page publique (pas de middleware)
```vue
// Pas de definePageMeta
```
→ Accessible à tous (connectés ou non)

### Page guest uniquement
```vue
definePageMeta({
  middleware: ['guest-client']
})
```
→ Accessible uniquement aux NON connectés

---

## ⚠️ Important

### Noms des middlewares
Nuxt transforme automatiquement les fichiers `.client.ts` :
- `auth.client.ts` → `'auth-client'`
- `guest.client.ts` → `'guest-client'`
- `agent-only.client.ts` → `'agent-only-client'`
- `partner-only.client.ts` → `'partner-only-client'`

### Ordre des middlewares
```vue
// ✅ CORRECT
definePageMeta({
  middleware: ['auth-client', 'agent-only-client']
})

// ❌ INCORRECT (manque 'auth-client')
definePageMeta({
  middleware: ['agent-only-client']
})
```

Les middlewares de rôle (`agent-only-client`, `partner-only-client`) nécessitent **toujours** le middleware `auth-client` avant.

### SSR vs Client
Tous les middlewares sont `.client.ts`, donc :
- ✅ S'exécutent côté client
- ❌ Ne s'exécutent PAS côté serveur
- ⚠️ Pas de protection SSR (mais pas nécessaire pour une SPA)

### Debug
Chaque middleware affiche des warnings en console :
```javascript
console.warn('⚠️ Accès refusé - Réservé aux agents ONG')
console.warn('⚠️ Accès refusé - Réservé aux partenaires')
```

---

## 📊 Matrice de protection

| Route | Public | Auth | Guest | Agent | Partner |
|-------|--------|------|-------|-------|---------|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/ongs` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/ongs/:id` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `/auth/signup` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `/dashboard` | ❌ | ✅ | ❌ | ✅ | ✅ |
| `/profil` | ❌ | ✅ | ❌ | ✅ | ✅ |
| `/ongs/manage` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `/donations/manage` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🔧 Maintenance

### Ajouter une page publique
Modifier `middleware/auth.client.ts` :
```typescript
const publicPages = [
  '/',
  '/auth/login',
  // ... autres pages
  '/nouvelle-page-publique',  // ← Ajouter ici
]
```

### Ajouter un nouveau rôle
1. Créer `middleware/nouveau-role.client.ts`
2. Vérifier `authStore.isNouveauRole`
3. Documenter dans ce README
