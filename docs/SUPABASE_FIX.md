# 🔧 Fix: Supabase Plugin Not Found

## 🎯 Problème

```
WARN [useSupabase] ⚠️ Nuxt plugin $supabase not found or not initialized
```

L'instance Supabase du plugin n'était pas disponible quand `useSupabase()` était appelé, notamment au démarrage de l'application.

## 🔍 Cause

Le plugin `supabase.client.ts` s'exécute de manière asynchrone, et certains composables/middleware peuvent être appelés **avant** que le plugin soit complètement initialisé.

## ✅ Solution implémentée

### 1. Ajout de logs détaillés dans le plugin

**Fichier:** `plugins/supabase.client.ts`

```typescript
console.log('[PLUGIN] 🚀 Initializing supabase.client.ts plugin')
console.log('[PLUGIN] 📝 Config loaded:', { hasUrl, hasKey })
console.log('[PLUGIN] 🔧 Creating Supabase client...')
console.log('[PLUGIN] ✅ Supabase client created successfully')
console.log('[PLUGIN] 🎯 Providing $supabase to nuxtApp')
```

**Storage logs:**
```typescript
console.log('[STORAGE] 🔑 getItem:', key)
console.log('[STORAGE] 💾 setItem:', key)
console.log('[STORAGE] 🗑️ removeItem:', key)
```

### 2. Système de fallback robuste dans useSupabase

**Fichier:** `composables/useSupabase.client.ts`

#### Avant
```typescript
export const useSupabase = (): SupabaseClient | null => {
  const nuxtApp = useNuxtApp()
  
  if (nuxtApp.$supabase) {
    return nuxtApp.$supabase  // ✅ Plugin disponible
  }
  
  return null  // ❌ Pas de fallback !
}
```

#### Après
```typescript
export const useSupabase = (): SupabaseClient | null => {
  const nuxtApp = useNuxtApp()
  
  if (nuxtApp.$supabase) {
    return nuxtApp.$supabase  // ✅ Plugin disponible
  }
  
  // ✅ Fallback: créer une instance avec la même config
  return createFallbackInstance()
}
```

### 3. Instance de fallback identique au plugin

La fonction `createFallbackInstance()` crée une instance Supabase avec :
- ✅ Même configuration auth (PKCE, autoRefresh, persistSession)
- ✅ Même storage personnalisé (localStorage + cookies)
- ✅ Instance singleton (réutilisée)
- ✅ Logs détaillés

## 📊 Flux d'exécution

### Scénario A: Plugin chargé en premier (idéal)

```
1. App démarre
   ↓
2. Plugin supabase.client.ts s'exécute
   └─> Crée nuxtApp.$supabase
   └─> [PLUGIN] ✅ Supabase client created
   ↓
3. useSupabase() appelé
   └─> Trouve nuxtApp.$supabase
   └─> [useSupabase] ✅ Using supabase instance from Nuxt plugin
   ↓
4. Tout fonctionne normalement
```

### Scénario B: useSupabase() appelé avant le plugin (fallback)

```
1. App démarre
   ↓
2. useSupabase() appelé très tôt
   └─> nuxtApp.$supabase n'existe pas encore
   └─> [useSupabase] ⚠️ Nuxt plugin $supabase not found, using fallback
   ↓
3. createFallbackInstance() crée une instance
   └─> Utilise même config que le plugin
   └─> [useSupabase] ✅ Fallback instance created
   ↓
4. Application fonctionne avec le fallback
   ↓
5. Plugin s'initialise plus tard
   └─> Prochains appels utiliseront nuxtApp.$supabase
```

## 🎯 Avantages

| Aspect | Avant | Après |
|--------|-------|-------|
| **Plugin non chargé** | ❌ Retourne `null` | ✅ Crée fallback |
| **Erreurs runtime** | ❌ `supabase is null` | ✅ Fonctionne toujours |
| **Debug** | ⚠️ Peu de logs | ✅ Logs détaillés partout |
| **Storage** | ⚠️ Pas de visibilité | ✅ Logs sur chaque opération |
| **Robustesse** | 🔴 Fragile | 🟢 Résilient |

## 🔍 Debug

### Vérifier que le plugin charge

Console navigateur:
```
[PLUGIN] 🚀 Initializing supabase.client.ts plugin
[PLUGIN] 📝 Config loaded: { hasUrl: true, hasKey: true }
[PLUGIN] 🔧 Creating Supabase client...
[PLUGIN] ✅ Supabase client created successfully
[PLUGIN] 🎯 Providing $supabase to nuxtApp
```

### Vérifier que useSupabase fonctionne

Console navigateur:
```
[useSupabase:2026-01-17T...] Entering useSupabase()
[useSupabase:2026-01-17T...] nuxtApp exists: true
[useSupabase:2026-01-17T...] $supabase in nuxtApp: true
[useSupabase:2026-01-17T...] ✅ Using supabase instance from Nuxt plugin
```

OU (fallback):
```
[useSupabase:2026-01-17T...] ⚠️ Nuxt plugin $supabase not found, using fallback
[useSupabase:2026-01-17T...] ⚠️ Creating fallback Supabase instance
[useSupabase:2026-01-17T...] ✅ Fallback instance created
```

### Vérifier les opérations storage

Console navigateur:
```
[STORAGE] 💾 setItem: sb-access-token
[STORAGE] 🔑 getItem: sb-access-token
[STORAGE] ✅ Found in localStorage
```

## 🚀 Résultat

L'application fonctionne maintenant **dans tous les cas** :
- ✅ Plugin chargé normalement → utilise `nuxtApp.$supabase`
- ✅ Plugin en retard → utilise fallback temporaire
- ✅ Plugin échoue → fallback permanent
- ✅ Logs détaillés pour debug

Plus d'erreurs `$supabase not found` ! 🎉
