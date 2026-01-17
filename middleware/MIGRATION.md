# 🔄 Guide de Migration - Noms des Middlewares

## ⚠️ Changement Important

Nuxt transforme automatiquement les noms de fichiers `.client.ts` en ajoutant `-client` au nom du middleware.

## 📝 Tableau de correspondance

| Fichier | Ancien nom | Nouveau nom |
|---------|------------|-------------|
| `auth.client.ts` | `'auth'` | `'auth-client'` |
| `guest.client.ts` | `'guest'` | `'guest-client'` |
| `agent-only.client.ts` | `'agent-only'` | `'agent-only-client'` |
| `partner-only.client.ts` | `'partner-only'` | `'partner-only-client'` |

## 🔧 Migration rapide

### Rechercher et remplacer dans tout le projet

```bash
# Dans tous les fichiers .vue
grep -r "middleware: \['auth'\]" pages/
# Remplacer par: middleware: ['auth-client']

grep -r "middleware: \['guest'\]" pages/
# Remplacer par: middleware: ['guest-client']

grep -r "middleware: \['auth', 'agent-only'\]" pages/
# Remplacer par: middleware: ['auth-client', 'agent-only-client']

grep -r "middleware: \['auth', 'partner-only'\]" pages/
# Remplacer par: middleware: ['auth-client', 'partner-only-client']
```

## ✅ Fichiers déjà migrés

- ✅ `pages/Profil.vue` - `'auth'` → `'auth-client'`
- ✅ `pages/dashboard.vue` - `'auth'` → `'auth-client'`
- ✅ `pages/auth/Login.vue` - `'guest'` → `'guest-client'`
- ✅ `pages/auth/SignUp.vue` - `'guest'` → `'guest-client'`

## 🚨 Erreur typique

```
Unknown route middleware: 'auth'. 
Valid middleware: 'agent-only-client', 'auth-client', 'guest-client', 'partner-only-client'.
```

**Solution:** Ajouter `-client` au nom du middleware dans `definePageMeta()`

## 📖 Exemples

### Avant
```vue
<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>
```

### Après
```vue
<script setup>
definePageMeta({
  middleware: ['auth-client']
})
</script>
```

### Avant (avec rôle)
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'agent-only']
})
</script>
```

### Après (avec rôle)
```vue
<script setup>
definePageMeta({
  middleware: ['auth-client', 'agent-only-client']
})
</script>
```
