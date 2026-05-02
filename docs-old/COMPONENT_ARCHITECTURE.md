# 🏗️ Architecture des Composants - Séparation Client/Server

## 📌 Règles de nommage

### `.client.vue` - Composants Client-Only
**Quand utiliser :**
- Utilise des APIs du navigateur : `window`, `document`, `navigator`
- Accède au localStorage/sessionStorage
- Utilise `useColorMode()` de Nuxt UI
- Gère des uploads de fichiers
- Utilise des events DOM directs (click, scroll, resize)
- Nécessite le rendu côté client uniquement

**Exemples :**
```vue
// ThemeToggle.client.vue
const colorMode = useColorMode() // ❌ SSR - accède localStorage

// Profil.client.vue  
const input = document.createElement('input') // ❌ SSR - document n'existe pas
window.location.href = '/path' // ❌ SSR - window n'existe pas

// OngDetail.client.vue
navigator.share({ title: 'Titre' }) // ❌ SSR - navigator n'existe pas
```

### `.server.vue` - Composants Server-Only (rare)
**Quand utiliser :**
- Accès direct à la base de données
- Manipulation de secrets/variables d'environnement sensibles
- Opérations backend lourdes
- Jamais envoyé au client

**Exemple :**
```vue
// DatabaseStats.server.vue
const db = await connectDB()
const stats = await db.query('SELECT COUNT(*) FROM users')
```

### `.vue` - Composants Universels (SSR-compatible)
**Quand utiliser :**
- Affichage de données
- Navigation avec NuxtLink/navigateTo
- Emission d'events
- Composants de layout (Header, Footer)
- Listes, cartes, filtres

**Exemples :**
```vue
// Header.vue
<NuxtLink to="/profil">Profil</NuxtLink> // ✅ SSR-safe

// Card.vue
const emit = defineEmits(['view-details']) // ✅ SSR-safe
emit('view-details', props.ong)

// OngList.vue
const handleClick = () => {
  navigateTo(`/ongs/${id}`) // ✅ SSR-safe (auto-imported)
}
```

---

## 📂 État actuel du projet

### ✅ Composants Client (.client.vue)
```
components/
  ├── ThemeToggle.client.vue      # useColorMode (localStorage)

features/auth/components/
  ├── Login.client.vue             # Formulaires + auth
  ├── Signup.client.vue            # Formulaires + auth

features/user/components/
  ├── Profil.client.vue            # document.createElement, window.location

features/ong/components/
  ├── OngDetail.client.vue         # navigator.share, navigator.clipboard, window.location
```

### ✅ Composants Universels (.vue)
```
components/
  ├── Header.vue                   # Navigation NuxtLink
  ├── Footer.vue                   # Contenu statique

features/ong/components/
  ├── Card.vue                     # Affichage + emit
  ├── OngList.vue                  # Liste + navigateTo
  ├── OngListFilter.vue            # Filtres
```

### ⚠️ Pages (toujours .vue)
Les pages Nuxt **ne peuvent pas** avoir de suffixe `.client.vue`. Si une page utilise des APIs navigateur :
1. **Option 1 (Préféré)** : Utiliser des composables SSR-safe (`useRoute`, `navigateTo`)
2. **Option 2** : Wrapper le code dans `onMounted()` pour exécution client-only
3. **Option 3** : Extraire la logique dans un composant `.client.vue`

```vue
<!-- pages/ongs/[id].vue -->
<script setup>
import { useRoute } from '#app' // ✅ SSR-safe

const route = useRoute()
const id = route.params.id // ✅ Au lieu de window.location

const handleBack = () => {
  navigateTo('/') // ✅ Au lieu de window.location.href
}
</script>
```

---

## 🔍 Comment identifier si un composant doit être .client.vue ?

### ❌ APIs qui nécessitent .client.vue

**Window / Document :**
```js
window.location.href          // ❌
window.open()                 // ❌
window.alert()                // ❌
document.createElement()      // ❌
document.getElementById()     // ❌
document.querySelector()      // ❌
```

**Navigator :**
```js
navigator.share()             // ❌
navigator.clipboard           // ❌
navigator.geolocation         // ❌
navigator.mediaDevices        // ❌
```

**Storage :**
```js
localStorage.getItem()        // ❌
sessionStorage.setItem()      // ❌
```

**Composables Nuxt UI :**
```js
useColorMode()                // ❌ (accède localStorage)
```

**Events DOM :**
```js
element.addEventListener()    // ❌
onScroll, onResize direct     // ❌
```

### ✅ APIs SSR-safe (peuvent rester .vue)

**Nuxt Auto-imports :**
```js
navigateTo('/path')           // ✅
useRoute()                    // ✅
useRouter()                   // ✅
useHead()                     // ✅
useFetch()                    // ✅
```

**Vue Composition API :**
```js
ref(), reactive()             // ✅
computed()                    // ✅
watch()                       // ✅
onMounted()                   // ✅ (mais le code dedans peut être client-only)
```

**Navigation :**
```vue
<NuxtLink to="/path">         <!-- ✅ -->
```

---

## 🛠️ Migration d'un composant vers .client.vue

### Étape 1 : Identifier les APIs navigateur
```bash
# Rechercher les usages problématiques
grep -r "window\." features/
grep -r "document\." features/
grep -r "navigator\." features/
grep -r "localStorage" features/
```

### Étape 2 : Renommer le fichier
```bash
mv features/ong/components/OngDetail.vue \
   features/ong/components/OngDetail.client.vue
```

### Étape 3 : Mettre à jour les imports
```vue
<!-- Avant -->
import OngDetail from '@/features/ong/components/OngDetail.vue'

<!-- Après -->
import OngDetail from '@/features/ong/components/OngDetail.client.vue'
```

### Étape 4 : Optionnel - Refactoriser pour SSR
Si possible, remplacer les APIs navigateur par des alternatives SSR-safe :

```vue
<!-- ❌ Avant (nécessite .client.vue) -->
<script setup>
const handleBack = () => {
  window.location.href = '/'
}

const shareOng = () => {
  navigator.share({ title: ong.name })
}
</script>

<!-- ✅ Après (peut rester .vue) -->
<script setup>
const handleBack = () => {
  navigateTo('/') // Auto-imported, SSR-safe
}

const shareOng = () => {
  // Extraire dans un composant ShareButton.client.vue
  // OU wrapper dans onMounted
}
</script>
```

---

## 🎯 Checklist de validation

Avant de considérer qu'un composant est SSR-compatible (.vue) :

- [ ] Ne contient AUCUN `window.`, `document.`, `navigator.`
- [ ] N'utilise pas localStorage/sessionStorage
- [ ] N'utilise pas useColorMode ou autre composable client-only
- [ ] Utilise navigateTo au lieu de window.location
- [ ] Utilise useRoute() au lieu de window.location.pathname
- [ ] Les event listeners DOM sont dans onMounted()
- [ ] Pas de manipulation directe du DOM

Si **un seul** de ces critères échoue → `.client.vue` obligatoire

---

## 📊 Tableau récapitulatif

| Composant | Type | Raison |
|-----------|------|--------|
| `Header.vue` | Universal | Navigation NuxtLink uniquement |
| `Footer.vue` | Universal | Contenu statique |
| `ThemeToggle.client.vue` | Client | useColorMode (localStorage) |
| `Login.client.vue` | Client | Formulaires + auth |
| `Signup.client.vue` | Client | Formulaires + auth |
| `Profil.client.vue` | Client | document, window, uploads |
| `Card.vue` | Universal | Affichage + emit |
| `OngList.vue` | Universal | navigateTo (SSR-safe) |
| `OngListFilter.vue` | Universal | Filtres purs |
| `OngDetail.client.vue` | Client | navigator.share, clipboard |

---

## 🚀 Avantages de cette séparation

1. **Performance** : Les composants SSR-compatibles sont rendus côté serveur → chargement initial plus rapide
2. **SEO** : Le contenu SSR est indexable par Google
3. **Clarté** : Le suffixe `.client.vue` documente explicitement les dépendances navigateur
4. **Évite les erreurs** : Plus de "window is not defined" en SSR
5. **Bundle size** : Les composants client ne sont envoyés qu'au client

---

## 📚 Ressources

- [Nuxt 3 - Client-Only Components](https://nuxt.com/docs/api/components/client-only)
- [Nuxt 3 - SSR-safe Navigation](https://nuxt.com/docs/api/utils/navigate-to)
- [Vue 3 - SSR Guide](https://vuejs.org/guide/scaling-up/ssr.html)
