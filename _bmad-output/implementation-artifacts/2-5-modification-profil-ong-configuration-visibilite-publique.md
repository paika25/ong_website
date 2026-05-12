# Story 2.5 : Modification Profil ONG & Configuration Visibilité Publique

Status: in-progress

## Story

En tant que `user_agent`,
je veux modifier mon profil ONG à tout moment et choisir les informations visibles publiquement,
afin de maintenir mes données à jour et contrôler ma présentation aux bailleurs.

## Acceptance Criteria

1. `pages/ongs/[id]/edit.vue` remplace les `alert()` par un `UToast` 4s auto-dismiss (UX-DR13)
2. Une migration SQL ajoute `section_visibility JSONB` à la table `ongs`
3. Le type ONG TypeScript inclut `sectionVisibility?: SectionVisibility`
4. Le mapper Supabase sérialise/désérialise `section_visibility`
5. La page `/dashboard/agent/ong/visibility` permet de toggle chaque section (identite / mission / documents / projets / contacts)
6. Les toggles sont sauvegardés dans Supabase via `updateOngVisibility()`
7. Un `UToast` succès s'affiche après sauvegarde
8. Dans `OngDetail.client.vue`, les tabs documents et projects sont masqués si `sectionVisibility.documents/projets === false`
9. `bun run dev` démarre sans erreur

## Tasks / Subtasks

- [x] **T1 — `app.vue` : ajouter `<UNotifications />`** (AC: 1, 7)
- [x] **T2 — Migration SQL `section_visibility`** (AC: 2)
- [x] **T3 — Type ONG + Mapper** (AC: 3, 4)
  - [x] Ajouter `SectionVisibility` interface dans `features/ong/type/index.ts`
  - [x] Mapper `section_visibility` ↔ `sectionVisibility` dans `ong.mapper.ts`
- [x] **T4 — `updateOngVisibility()` dans `ong.mutations.ts`** (AC: 6)
- [x] **T5 — Edit page : UToast + UNotifications** (AC: 1)
  - [x] Remplacer tous les `alert()` par `useToast().add()`
- [x] **T6 — Page `/dashboard/agent/ong/visibility`** (AC: 5, 6, 7)
  - [x] Créer dossier `pages/dashboard/agent/ong/`
  - [x] Toggle par section + bouton Enregistrer
  - [x] `UToast` succès/erreur
  - [x] Lien depuis `pages/ongs/[id]/edit.vue`
- [x] **T7 — `OngDetail.client.vue` : masquer tabs selon visibilité** (AC: 8)
- [x] **T8 — Vérification** (AC: 9)

## Dev Notes

### Sections de visibilité

```typescript
export interface SectionVisibility {
  identite: boolean   // nom, adresse, contacts de base
  mission: boolean    // mission, secteurs, zones
  documents: boolean  // documents justificatifs uploadés
  projets: boolean    // liste des projets
  contacts: boolean   // responsable légal, communication
}
```

### Default visibility : tout à `true` (tout public)

### RLS enforcement

Pour MVP : filtrage client-side dans `OngDetail`. RLS Postgres complet reporté — nécessiterait Column Level Security ou vue filtrée, hors scope story 2.5.

### Score recalculation

Différé à Story 4.1 — le service `score.service.ts` existe en stub. Appel ajouté en commentaire dans `saveChanges`.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Completion Notes List

- `<UNotifications />` ajouté dans `app.vue` pour que les toasts s'affichent globalement.
- Migration 08 à appliquer manuellement via Supabase Dashboard SQL Editor.
- `updateOngVisibility()` fonction dédiée (n'utilise pas `OngFormPayload`) pour éviter pollution des types existants.
- `pages/ongs/[id]/edit.vue` : tous les `alert()` remplacés par `useToast()`.
- Visibilité appliquée côté client dans `OngDetail` — tabs `documents` et `projects` masqués si désactivés.
- Lien "Configurer la visibilité" ajouté dans la page edit.

### File List

- `app.vue` — modifié (`<UNotifications />` ajouté)
- `supabase/migrations/20260509_08_ong-section-visibility.sql` — nouveau
- `features/ong/type/index.ts` — modifié (`SectionVisibility` + champ dans ONG)
- `features/ong/services/ong.mapper.ts` — modifié (map section_visibility)
- `features/ong/services/ong.mutations.ts` — modifié (`updateOngVisibility`)
- `features/ong/services/index.ts` — modifié (export `updateOngVisibility`)
- `pages/ongs/[id]/edit.vue` — modifié (alert → useToast)
- `pages/dashboard/agent/ong/visibility.vue` — nouveau
- `features/ong/components/OngDetail.client.vue` — modifié (tabs filtrés)

### Change Log

- 2026-05-11 : Story créée et implémentée (AG: claude-sonnet-4-6)
