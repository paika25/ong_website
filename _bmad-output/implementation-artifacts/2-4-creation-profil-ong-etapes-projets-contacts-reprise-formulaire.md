# Story 2.4 : Création Profil ONG — Étapes Projets & Contacts + Reprise Formulaire

Status: in-progress

## Story

En tant que `user_agent`,
je veux remplir les étapes Projets et Contacts, et pouvoir reprendre le formulaire plus tard depuis l'étape interrompue,
afin de compléter mon dossier à mon rythme sans perdre mon travail.

## Acceptance Criteria

1. Les composants `OngStepProjets` et `OngStepContacts` sont intégrés dans `OngDossierStepper` (5 étapes complètes)
2. `pages/ongs/new.vue` utilise `OngDossierStepper` au lieu de `OwnOngForm`
3. L'URL contient `?step=<step-id>` et reflète l'étape courante
4. Au chargement de la page, si l'agent a déjà une ONG en base, les données de base sont restaurées dans le formulaire (nomOng, email, adresse, mission)
5. Si l'agent revient sur la page avec `?step=contacts`, le formulaire s'ouvre directement à l'étape Contacts
6. Un empty state s'affiche dans Projets si aucun projet ajouté (UX-DR16) — déjà présent dans `OngStepProjets`
7. Le CTA "Soumettre mon dossier" est visible après complétion de l'étape Contacts, désactivé si score < 40 ou documents obligatoires manquants
8. `bun run dev` démarre sans erreur

## Tasks / Subtasks

- [x] **T1 — Page `/ongs/new` : remplacer OwnOngForm par OngDossierStepper** (AC: 2, 3, 4)
  - [x] Importer `OngDossierStepper` dans `pages/ongs/new.vue`
  - [x] Supprimer la dépendance à `OwnOngForm` et `createOng` direct
  - [x] Appeler `getOwnerOng()` au montage → passer `ongId` à OngDossierStepper si ONG existante
  - [x] Lire `route.query.step` au montage → passer comme `initialStep`
  - [x] Écouter `step-change` → `router.replace({ query: { step } })`
  - [x] Écouter `completed` → `navigateTo('/dashboard')`

- [x] **T2 — OngDossierStepper : prop initialStep + emit step-change** (AC: 3, 5)
  - [x] Ajouter prop `initialStep?: string`
  - [x] Initialiser `currentStep` depuis `initialStep` si valide
  - [x] Ajouter `watch(currentStep, step => emit('step-change', step))`
  - [x] Ajouter `emit` type dans `defineEmits`

- [x] **T3 — OngDossierStepper : restauration Supabase** (AC: 4)
  - [x] Si `ongId` fourni ET localStorage vide → charger ONG depuis Supabase
  - [x] Remplir `identite` (nomOng, email, telephone, siteWeb, adresseSiege)
  - [x] Remplir `mission.missionPrincipale` depuis `description` ONG

- [x] **T4 — OngDossierStepper : CTA Soumettre conditionnel** (AC: 7)
  - [x] Ajouter `formCompleted = ref(false)` — vrai quand contacts terminé
  - [x] Modifier `nextStep` contacts : set `formCompleted = true` au lieu d'émettre `completed` directement
  - [x] Afficher section submit quand `formCompleted === true`
  - [x] CTA désactivé si `score < 40` ou docs obligatoires manquants
  - [x] Message d'aide sous le CTA expliquant pourquoi désactivé

- [x] **T5 — Vérification** (AC: 8)
  - [x] `bun run dev` sans erreur

## Dev Notes

### Ce qui existe — NE PAS CASSER

- `OngDossierStepper.vue` — orchestrateur 5 étapes, auto-save 30s, useOnline sync
- `OngStepProjets.vue` — étape 4 avec empty state ✅
- `OngStepContacts.vue` — étape 5 avec responsable légal + réseaux sociaux ✅
- `StepperForm.vue` — UI stepper ARIA complète ✅
- `useOngDossierForm.ts` — persistance localStorage + validation ✅
- `DashboardAgentOng.vue` — lien CTA `/ongs/new` (garder intact)
- Middlewares existants dans `pages/ongs/new.vue` : `['auth', 'agent-only']` (déjà migrés en 1.4)

### Restauration depuis Supabase

Champs mappables depuis la table `ongs` :
- `ong.name` → `identite.nomOng`
- `ong.description` → `mission.missionPrincipale`
- `ong.location` → `identite.adresseSiege`
- `ong.email` → `identite.email`
- `ong.phone` → `identite.telephone`
- `ong.website` → `identite.siteWeb`

Les champs `formeJuridique`, `numeroRecepisse`, `secteurs`, `zonesGeographiques`, `projets`, `contacts` restent en localStorage (non persistés en Supabase dans cette story).

### CTA Submit Guard

```
hasRequiredDocs = statuts OU récépissé présent dans documents[]
canSubmit = score >= 40 && hasRequiredDocs
```

Le score est un placeholder (0) jusqu'à Story 4.1. En attendant, le CTA est toujours désactivé avec message explicatif.

### REQUIRED_DOCS (depuis useOngDossierForm)

```typescript
{ key: 'statuts', required: true }
{ key: 'recepisse', required: true }
{ key: 'rapport_financier', required: false }
```

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Completion Notes List

- `pages/ongs/new.vue` réécrit pour utiliser `OngDossierStepper` — skeleton loader pendant restauration Supabase, URL step persistence, redirect vers `/dashboard` après completion.
- `OngDossierStepper.vue` mis à jour : prop `initialStep`, emit `step-change`, restauration Supabase si localStorage vide, section submit conditionnelle après étape contacts.
- Score placeholder 0 → CTA désactivé avec message "Complétez votre profil pour atteindre le score minimum de 40".
- Docs gate : vérifie la présence de docs avec mot-clé 'statuts' ou 'recepisse' dans le nom.

### File List

- `pages/ongs/new.vue` — modifié (OwnOngForm → OngDossierStepper + URL step + restore)
- `features/ong-profile/components/OngDossierStepper.vue` — modifié (initialStep + step-change + submit guard)

### Change Log

- 2026-05-11 : Story créée et implémentée (AG: claude-sonnet-4-6)
