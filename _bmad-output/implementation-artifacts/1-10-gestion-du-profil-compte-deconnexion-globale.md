# Story 1.10 : Gestion du Profil Compte & Déconnexion Globale (FR4, FR5)

Status: review

## Story

En tant qu'utilisateur authentifié,
je veux mettre à jour mes identifiants et pouvoir me déconnecter de toutes mes sessions,
afin de contrôler la sécurité de mon compte.

## Acceptance Criteria

1. La page `/account/settings` existe et est accessible aux utilisateurs connectés
2. Un email de confirmation est envoyé à la nouvelle adresse avant que le changement soit effectif
3. Le changement de mot de passe exige l'ancien mot de passe + confirmation du nouveau (≥ 8 caractères)
4. Un bouton "Se déconnecter de tous les appareils" révoque toutes les sessions via `supabase.auth.signOut({ scope: 'global' })`
5. Après déconnexion globale, l'utilisateur est redirigé vers `/auth/login`
6. Les erreurs (email déjà utilisé, mauvais ancien mot de passe) affichent des messages explicites (NFR27)
7. `bun run dev` démarre sans erreur

## Tasks / Subtasks

- [x] **T1 — `signOut({ scope: 'global' })` dans authService.ts** (AC: 4, 5)
- [x] **T2 — `updateEmail()` dans authService.ts** (AC: 2, 6)
- [x] **T3 — `verifyAndUpdatePassword()` dans authService.ts** (AC: 3, 6)
- [x] **T4 — Composant `AccountSettings.client.vue`** (AC: 1–6)
- [x] **T5 — Page `pages/account/settings.vue`** (AC: 1)
- [x] **T6 — Vérification finale** (AC: 7)

## Dev Notes

### Fichiers existants à modifier

- `features/auth/services/authService.ts` — `signOut()` à mettre à jour + 2 nouvelles fonctions
- `features/user/components/ProfilEditForm.client.vue` — NE PAS MODIFIER (gère firstName/lastName/bio/location/website, pas les credentials)

### Project Structure Notes

Nouveau dossier : `pages/account/settings.vue`
Nouveau composant : `features/auth/components/AccountSettings.client.vue`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Completion Notes List

- `signOut()` mis à jour avec `scope: 'global'` optionnel.
- `updateEmail()` utilise `supabase.auth.updateUser({ email })` — Supabase envoie automatiquement une confirmation à la nouvelle adresse.
- `verifyAndUpdatePassword()` re-authentifie d'abord via `signInWithPassword()` pour vérifier l'ancien mot de passe, puis appelle `updateUser({ password })`.
- Page `/account/settings` séparée de `/Profil` (profil public vs settings de compte).

### File List

- `features/auth/services/authService.ts` — modifié
- `features/auth/components/AccountSettings.client.vue` — nouveau
- `pages/account/settings.vue` — nouveau
