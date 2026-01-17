# 📚 Composables Documentation

## `useSupabase.client.ts`

**Type:** Client-only composable

### Description
Composable simplifié pour accéder au client Supabase. Retourne **uniquement** l'instance créée par le plugin `plugins/supabase.client.ts`.

### Caractéristiques
- ✅ **Client-only** : Ne s'exécute jamais côté serveur
- ✅ **Single source of truth** : Utilise toujours l'instance du plugin
- ✅ **Debug complet** : Logs détaillés avec timestamps
- ✅ **Storage personnalisé** : localStorage + cookies via le plugin

### Usage

```typescript
// Dans un composant ou une page
const supabase = useSupabase()

if (supabase) {
  const { data } = await supabase.from('ongs').select('*')
}
```

### Debug

Tous les logs sont préfixés par `[useSupabase:TIMESTAMP]` :

```
[useSupabase:2026-01-17T...] Entering useSupabase()
[useSupabase:2026-01-17T...] nuxtApp keys [...]
[useSupabase:2026-01-17T...] ✅ Using supabase instance from Nuxt plugin
```

### Architecture

```
┌─────────────────────────────────────────┐
│  plugins/supabase.client.ts             │
│  - Crée l'instance Supabase             │
│  - Configure storage (localStorage +    │
│    cookies)                              │
│  - Configure auth (PKCE, autoRefresh)   │
│  - Écoute onAuthStateChange             │
└─────────────────────────────────────────┘
              ↓
              │ nuxtApp.$supabase
              ↓
┌─────────────────────────────────────────┐
│  composables/useSupabase.client.ts      │
│  - Retourne nuxtApp.$supabase           │
│  - Logs de debug                        │
└─────────────────────────────────────────┘
              ↓
              │ const supabase = useSupabase()
              ↓
┌─────────────────────────────────────────┐
│  Composants / Pages / Services          │
│  - Utilise l'instance Supabase          │
│  - Appels API authentifiés              │
└─────────────────────────────────────────┘
```

### Helpers

#### `checkSupabaseConnection()`
Test la connexion à Supabase en récupérant un enregistrement de test.

```typescript
const isConnected = await checkSupabaseConnection()
// ✅ Supabase connected successfully
```

---

## `useAuth.ts`

**Type:** Universal composable (mais utilise un store client)

### Description
Orchestration de l'authentification. Utilise `useAuthStore()` et `useSupabase()`.

### Usage

```typescript
const { checkSession, logout } = useAuth()

// Vérifier la session au montage
onMounted(async () => {
  await checkSession()
})
```

---

## `useColorMode.client.ts`

**Type:** Client-only composable

### Description
Gestion du dark/light mode avec persistence localStorage + manipulation DOM.

### Usage

```typescript
const { colorMode, setColorMode } = useAppColorMode()

setColorMode('dark')
```
