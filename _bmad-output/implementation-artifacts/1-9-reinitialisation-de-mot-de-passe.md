# Story 1.9 : Réinitialisation de Mot de Passe (FR3)

Status: review

## Story

En tant qu'utilisateur ayant perdu son mot de passe,
je veux recevoir un lien de réinitialisation par email,
afin de récupérer l'accès à mon compte sans contacter le support.

## Acceptance Criteria

1. La page `/auth/forgot` existe avec un champ email et un bouton d'envoi
2. Le message affiché après soumission est identique que l'email existe ou non (pas de user enumeration)
3. Un email de réinitialisation avec lien valable 1h est envoyé via Supabase Auth
4. Le lien redirige vers `/auth/reset-password` avec le token de récupération dans l'URL
5. La page `/auth/reset-password` affiche un formulaire nouveau mot de passe + confirmation
6. Après réinitialisation réussie, l'utilisateur est redirigé vers `/auth/login`
7. Un lien expiré ou déjà utilisé affiche un message d'erreur explicite avec option de renvoyer un nouveau lien
8. La validation est on-blur par champ — on-submit révèle tous les invalides (UX-DR22)
9. `bun run dev` démarre sans erreur

## Tasks / Subtasks

- [x] **T1 — `updatePassword()` dans authService.ts** (AC: 5, 6)
  - [x] Ajouté dans `useAuthService()` — appelle `supabase.auth.updateUser({ password })`
  - [x] Validation ≥ 8 caractères + `getReadableError()`
  - [x] Exporté dans le return de `useAuthService()`

- [x] **T2 — Composant `ForgotPassword.client.vue`** (AC: 1, 2, 3)
  - [x] Champ email + bouton + état loading
  - [x] Message succès identique quelle que soit la réponse (anti user enumeration)
  - [x] État "soumis" avec option "Renvoyer un lien"
  - [x] Lien retour connexion via `@back-to-login`

- [x] **T3 — Page `pages/auth/forgot.vue`** (AC: 1)
  - [x] Structure identique à Login.vue (bouton retour accueil, ClientOnly)
  - [x] `definePageMeta({ middleware: ['guest-client'] })`

- [x] **T4 — Composant `ResetPassword.client.vue`** (AC: 5, 6, 7, 8)
  - [x] Détection session Supabase au montage (gère token hash/PKCE automatiquement)
  - [x] 4 états : loading / valid / invalid / success
  - [x] Token absent/expiré → message erreur + bouton "Demander un nouveau lien"
  - [x] Formulaire mot de passe + confirmation avec validation on-blur (UX-DR22)
  - [x] on-submit révèle tous les champs invalides
  - [x] Succès → `navigateTo('/auth/login')`

- [x] **T5 — Page `pages/auth/reset-password.vue`** (AC: 4, 5)
  - [x] Pas de middleware guest (page accessible depuis email de récupération)
  - [x] `layout: false` pour page standalone

- [x] **T6 — Vérification finale** (AC: 9)
  - [x] `Login.vue` `@forgot-password` → `/auth/forgot` ✅ (déjà en place, pas modifié)
  - [x] `npm run dev` (Node 22) → démarre sans erreur ✅

## Dev Notes

### Service existant — NE PAS réimplémenter

`resetPassword()` **existe déjà** dans `features/auth/services/authService.ts` (ligne ~350) :
```typescript
const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  return { error: error ? getReadableError(error.message) : null }
}
```
→ **Ne pas recréer cette fonction.** Appeler `useAuthService().resetPassword(email)` directement.

### Flux Supabase password reset (PKCE mode)

Le plugin `plugins/supabase.client.ts` configure Supabase avec `flowType: 'pkce'`. Le flux est :
1. `resetPasswordForEmail()` → Supabase envoie un email avec lien vers `/auth/reset-password`
2. Le lien contient soit un hash `#access_token=...&type=recovery` (legacy), soit un param `?code=...` (PKCE)
3. Sur `/auth/reset-password`, Supabase SDK gère automatiquement la session au montage via `onAuthStateChange`
4. Attendre l'événement `PASSWORD_RECOVERY` ou appeler `supabase.auth.getSession()` pour confirmer la session
5. Appeler `supabase.auth.updateUser({ password: newPassword })` pour changer le mot de passe

```typescript
// Pattern à utiliser dans ResetPassword.client.vue
onMounted(async () => {
  const supabase = useSupabase()
  if (!supabase) return

  // Supabase SDK détecte automatiquement le token dans l'URL
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    // Token absent/expiré → afficher erreur
    tokenState.value = 'invalid'
    return
  }

  // Vérifier que c'est bien une session de récupération
  // (pas une session normale d'utilisateur connecté)
  tokenState.value = 'valid'
})
```

### Patterns UX existants à respecter

**Structure des pages auth (copier depuis Login.vue) :**
```vue
<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 bg-background relative">
    <!-- Bouton retour à l'accueil (même SVG que Login.vue) -->
    <NuxtLink to="/" class="absolute top-6 left-6 ...">...</NuxtLink>
    <ClientOnly>
      <MonComposant @event="handler" />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['guest-client'] })
</script>
```

**Composants UI disponibles (`@nuxt/ui`) :**
- `UInput`, `UButton`, `UFormGroup`, `UCheckbox`
- Couleur erreur : `:color="errors.field ? 'red' : 'primary'"`
- Loading bouton : `:loading="isLoading"` `:disabled="isLoading"`

**Validation UX-DR22 :**
```typescript
// on-blur : valider le champ touché
const handleBlur = (field: string) => {
  validateField(field)
}
// on-submit : révéler TOUS les champs invalides
const handleSubmit = () => {
  validateAll()  // marque tous les champs touchés
  if (!isValid.value) return
  // ... soumettre
}
```

**Mot de passe ≥ 8 caractères** (cohérent avec authService.ts signUp validation).

### Fichiers existants — NE PAS CASSER

| Fichier | Ce qui existe | Ce que cette story ne touche PAS |
|---|---|---|
| `features/auth/services/authService.ts` | `resetPassword()` déjà impl. | Ajouter seulement `updatePassword()` à la fin de `useAuthService()` |
| `features/auth/components/Login.client.vue` | Émet `@forgot-password` → `/auth/forgot` | Ne pas modifier |
| `pages/auth/Login.vue` | `onForgotPassword()` → `navigateTo('/auth/forgot')` | Ne pas modifier |
| `pages/auth/callback.vue` | Gère les tokens OAuth génériques | Ne pas modifier |

### Nouveaux fichiers à créer

```
features/auth/components/
├── ForgotPassword.client.vue   ← nouveau
└── ResetPassword.client.vue    ← nouveau

pages/auth/
├── forgot.vue                  ← nouveau
└── reset-password.vue          ← nouveau
```

### Project Structure Notes

- Middleware `guest-client` sur `/auth/forgot` (utilisateur non connecté)
- **PAS** de middleware sur `/auth/reset-password` (utilisateur non connecté, arrive depuis email)
- Les fichiers `.client.vue` dans `features/` sont des composants client-only (SSR-safe via `<ClientOnly>`)

### References

- [Source: features/auth/services/authService.ts#350] — `resetPassword()` déjà implémenté
- [Source: pages/auth/Login.vue] — pattern page auth (structure, middleware, ClientOnly)
- [Source: features/auth/components/Login.client.vue] — pattern composant auth (@nuxt/ui, validation)
- [Source: plugins/supabase.client.ts] — flowType PKCE configuré
- [Source: epics.md#Story 1.9] — ACs complets

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `reset-password.vue` utilise `layout: false` (pas de middleware guest) car l'utilisateur arrive depuis un lien email sans session normale.
- Supabase SDK gère automatiquement le token PKCE dans l'URL — pas besoin de le parser manuellement.

### Completion Notes List

- `updatePassword()` ajouté à `authService.ts` — seule modification d'un fichier existant.
- Anti user enumeration : `ForgotPassword.client.vue` affiche toujours le même message succès, qu'il y ait ou non un compte pour l'email.
- `ResetPassword.client.vue` gère 4 états : loading (détection token) → valid (formulaire) → invalid (token expiré/absent) → success.

### File List

- `features/auth/services/authService.ts` — modifié (ajout `updatePassword()`)
- `features/auth/components/ForgotPassword.client.vue` — nouveau
- `features/auth/components/ResetPassword.client.vue` — nouveau
- `pages/auth/forgot.vue` — nouveau
- `pages/auth/reset-password.vue` — nouveau
