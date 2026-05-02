---
project_name: 'ong_website (Paika)'
user_name: 'Paika'
date: '2026-04-30'
status: 'complete'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
rule_count: 58
optimized_for_llm: true
---

# Project Context for AI Agents

Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Focus sur les détails non-évidents que les agents pourraient manquer.

---

## Technology Stack & Versions

- Nuxt 3.14+ / Vue 3.5+
- TypeScript 5.8+ (permissif : noImplicitAny=false, strictNullChecks=false, allowJs=true)
- @nuxt/ui 2.20+ (UI component library, global: true)
- TailwindCSS (dark mode class-based, HSL CSS custom properties)
- Pinia 2.3+ avec @pinia/nuxt (state management)
- Supabase JS 2.89+ (backend/base de données)
- VueUse 11+ avec @vueuse/nuxt (composables utilitaires)
- Zod 3.25+ (validation de schémas)
- FontAwesome 7.1+ + Lucide Vue Next 0.462+ (icônes)
- Déploiement : Netlify (Nitro preset), Node 22, npm --legacy-peer-deps
- Package manager local : bun

---

## Critical Implementation Rules

### Règles TypeScript / Langage

**Mode TypeScript permissif — respecter le niveau existant**
Ne pas activer `strict`, `strictNullChecks`, ni `noImplicitAny`. Ne jamais écrire `!` (non-null assertion) sans commentaire explicatif.

**Utilisation de `any` — cas acceptables uniquement**

```ts
// ✅ Acceptable : réponse brute Supabase non typée
const row: any = supabaseRow
// ✅ Acceptable : payload dynamique vers Supabase
const payload: any = { ...formData }
// ❌ Interdit : remplacer un type connu par any
const user: any = useCurrentUser()
```

**Auto-imports Nuxt — ne jamais importer manuellement**
`ref`, `computed`, `watch`, `useRouter`, `useRoute`, `definePageMeta`, `useFetch`, `useAsyncData`, tous les composables de `~/composables/`, et les stores Pinia sont auto-importés par Nuxt.

```ts
// ❌ INTERDIT
import { ref, computed } from 'vue'
// ✅ CORRECT — rien à importer
const count = ref(0)
```

**`<script setup lang="ts">` — obligatoire sans exception**
Pas de `defineComponent()`, pas d'Options API, pas de `<script>` sans `setup`.

**`import type` — pour tout import utilisé uniquement comme annotation**
POURQUOI : Évite les imports circulaires et réduit le bundle.

```ts
import type { ONG } from '../type'
```

**Alias de chemins — utiliser `~/` exclusivement**
`~/` et `@/` pointent tous deux vers la racine, mais `~/` est le standard du projet. Ne pas mixer.

**`defineProps` et `defineEmits` — typage générique obligatoire**

```ts
// ❌
const props = defineProps(['title', 'ongId'])
// ✅
const props = defineProps<{ title: string; ongId: string; isActive?: boolean }>()
const emit = defineEmits<{ (e: 'update', value: string): void }>()
```

**Pattern imports des services — index.ts uniquement**
Les composants importent uniquement depuis `~/features/*/services/index.ts` ou un store. Jamais depuis `queries.ts`, `mutations.ts` ou `mapper.ts` directement.

```ts
// ❌
import { getOngs } from '~/features/ong/services/ong.queries'
// ✅
import { getOngs } from '~/features/ong/services'
```

**`~/lib/supabase.ts` — INTERDIT dans tout code nouveau**
POURQUOI : Deprecated. Crée une seconde instance Supabase (deux sessions, deux états d'auth divergents). Utiliser uniquement `useSupabase()` depuis `~/composables/useSupabase.client.ts`.

**`useAsyncData` — key unique et contextualisée**

```ts
// ❌ Key dupliquée → cache Nuxt mélangé entre pages
await useAsyncData('ong-data', fetchOng)
// ✅
await useAsyncData(`ong-${route.params.id}`, () => getOngById(route.params.id as string))
```

**Pattern gestion d'erreur dans les services — template standard**

```ts
async function fetchOngData(id: string): Promise<ONG | null> {
  if (!import.meta.client) return mockOngs.find(o => o.id === id) ?? null
  try {
    const supabase = useSupabase()
    if (!supabase) return mockOngs.find(o => o.id === id) ?? null
    const { data, error } = await supabase.from('ongs').select('*').eq('id', id).single()
    if (error) throw error
    return fromSupabaseRow(data)
  } catch (err) {
    console.error('[fetchOngData]', err)
    return mockOngs.find(o => o.id === id) ?? null
  }
}
```

**Toujours destructurer `{ data, error }` sur les appels Supabase**

```ts
// ❌
const { data } = await supabase.from('ongs').select('*')
// ✅
const { data, error } = await supabase.from('ongs').select('*')
if (error) { console.error('[service]', error.message); return fallback }
```

**JSDoc — obligatoire sur les fonctions exportées des services**

```ts
/**
 * Récupère une ONG par son ID depuis Supabase.
 * Retourne les données mock en cas d'erreur ou en SSR.
 */
export async function getOngById(id: string): Promise<ONG | null> { ... }
```

---

### Règles Framework — Nuxt 3 / Vue 3 / Architecture

**Stratégie de data fetching — règle normalisée**

- `useFetch()` → données liées à la route, déclenchées au rendu (SSR + client)
- `useAsyncData()` → clé de cache manuelle ou composition de plusieurs sources
- `$fetch` direct → uniquement dans les event handlers (`onClick`, `onSubmit`)
- Jamais `fetch()` natif au top-level d'un composant Vue (bypass cache Nuxt)
- Jamais `fetch()` dans `onMounted` (données invisibles au SSR, hydration mismatch)

**Contrainte SSR/Client — règle fondamentale**

- Fichiers suffixés `.client.ts` / `.client.vue` = exécution client uniquement
- `import.meta.client` obligatoire avant tout accès à `window`, `document`, ou Supabase
- Les données retournées par les mappers doivent être JSON-safe (pas de `Date`, `Map`, instances de classe)

**Pinia — pattern obligatoire**

- Setup-style (Composition API) uniquement — jamais Options API
- Fichiers de store suffixés `.client.ts` (ex: `auth.client.ts`)
- `useXStore()` uniquement dans `setup()` ou un composable — jamais au top-level d'un module `.ts` (crash SSR silencieux)
- Tout store qui charge depuis Supabase expose une action `hydrate()` appelée dans `onMounted()`

**Middleware par rôle — ordre d'exécution obligatoire**

```ts
// ✅ TOUJOURS dans cet ordre — auth DOIT précéder le check de rôle
definePageMeta({ middleware: ['auth', 'agent-only'] })
// ❌ role-check seul — auth non-vérifiée
definePageMeta({ middleware: ['agent-only'] })
```

**`definePageMeta` — compiler macro, top-level non-conditionnel**

```ts
// ❌ sera ignoré silencieusement
if (isAdmin) { definePageMeta({ middleware: 'auth' }) }
// ✅
definePageMeta({ middleware: ['auth', 'agent-only'], layout: 'dashboard' })
```

**Mapper Supabase — frontière de sécurité des types**
Toute donnée Supabase (snake_case) DOIT passer par `fromSupabaseRow()` avant d'entrer dans un store ou composant.

**Composables — contrat de naming et de retour**

- Naming : `use[Feature][Noun].ts` — préfixe `use` obligatoire
- Return shape : toujours un objet nommé `{ data, loading, error, refresh }` — jamais un tableau
- Appelé uniquement au top-level de `setup()` — jamais dans un handler ou lifecycle imbriqué
- `onUnmounted` obligatoire pour tout watcher/interval/subscription

**Pièges Vue 2 / React — règles anti-régression**

```ts
// M-01 : pas de .value dans le template
// ❌ <p>{{ count.value }}</p>  ✅ <p>{{ count }}</p>

// M-02 : reactive() ne se destructure pas — perd la réactivité
// ❌ const { name } = reactive({ name: 'ONG' })
// ✅ const { name } = toRefs(reactive({ name: 'ONG' }))

// M-03 : watch sur ref — passer la ref, pas .value
// ❌ watch(count.value, ...)  ✅ watch(count, ...)

// M-04 : v-model sur composant = modelValue + update:modelValue (pas value/input)
// M-05 : jamais de mutation directe de prop — émettre ou copier localement
// M-06 : window/document toujours derrière import.meta.client
```

**Redirections post-authentification**

- Login `user_agent` → `/dashboard`
- Login `user_partner` → `/ongs`
- Accès non-auth → `/auth/login?redirect=[url]`

**États d'interface — 4 états obligatoires pour tout composant qui fetch**

| État | Pattern attendu |
|---|---|
| `loading` | `<PageSkeleton />` ou `<CardSkeleton />` |
| `error` | message + action retry |
| `empty` | illustration + CTA contextuel |
| `success` | contenu normal |

Jamais de `v-if="data"` sans gérer `!data && !loading`.

**Gestion des 404**
Utiliser `throw createError({ statusCode: 404 })` → déclenche `error.vue` global. Jamais de 404 inline avec `v-if`.

**Pièges Netlify/Nitro**

- Variables `NUXT_PUBLIC_*` injectées au **build** — tout changement = redéploiement obligatoire
- Routes API avec données utilisateur : `Cache-Control: no-store` obligatoire
- Redirects : middleware Nuxt uniquement, jamais `_redirects` Netlify (bypasse l'auth)

**Couleurs et thème**
Jamais de couleur hex/rgb hardcodée — uniquement les variables CSS du thème (`bg-background`, `text-foreground`, `bg-primary`). Dark mode activé par défaut.

---

### Règles de Tests

**Stack** : `vitest` + `@nuxt/test-utils` + `@vue/test-utils` — jamais Jest.

**Priorité de couverture** :
1. Mappers (`features/*/services/*.mapper.ts`) — 100% branches obligatoires
2. Services Supabase — mockés via `vi.mock`, rôles testés séparément
3. Composables — après stabilisation des services
4. Composants — uniquement ceux avec logique métier non-triviale

**Règles agents** :
- `R-TEST-01` — Red before green : test qui échoue avant l'implémentation
- `R-TEST-02` — Co-localisation : `ong.queries.spec.ts` dans le même dossier que `ong.queries.ts`
- `R-TEST-03` — Aucun appel réseau réel : `vi.mock` obligatoire sur tout appel Supabase
- `R-TEST-04` — Coverage gates : mappers 100% branches, services 80% lignes
- `R-TEST-05` — Deux `describe` séparés pour `user_agent` et `user_partner`
- `R-TEST-06` — Fixtures depuis `features/*/data/` — jamais de données inline dans les tests
- `R-TEST-07` — Pas de snapshot tests (projet en transition UI)
- `R-TEST-08` — `scripts/test-supabase.js` = debug local uniquement, pas une validation de PR

**Validations non-négociables avant production** :
- Isolation des données par ONG testée via matrice de permissions (vrais utilisateurs staging)
- Score de Transparence immuable par l'ONG elle-même + audit trail complet
- Idempotence des paiements (webhook rejoué ≠ doublon de transaction)
- Statut de transaction traçable (en attente / complété / échoué)

**Règle absolue** : zéro déploiement sans tests RLS verts. Tests sandbox des providers de paiement obligatoires avant activation en prod.

---

### Qualité de Code & Style

**Nommage des fichiers** :
- Composants Vue : PascalCase (`OngDetailHeader.vue`)
- Client-only : suffixe `.client.vue` / `.client.ts`
- Composables : `use[Feature][Noun].ts` — préfixe `use` obligatoire
- Services : `[feature].[rôle].ts` (`ong.queries.ts`, `ong.mutations.ts`)
- Constantes de config : `SCREAMING_SNAKE_CASE`

**Nommage des variables** :
- camelCase : variables, fonctions — PascalCase : interfaces, types, composants
- Préfixe `on` pour handlers, `is`/`can`/`has`/`should` pour booléens
- Collections : pluriels explicites (`ongs`, `donations`)

**Structure interne fichiers Vue — ordre obligatoire** :

```vue
<script setup lang="ts">
// 1. import type  2. defineProps/defineEmits  3. Composables/stores
// 4. State local  5. Computed  6. Watchers  7. Lifecycle hooks
// 8. Handlers (préfixe `on`)  9. Fonctions utilitaires locales
</script>
<template>...</template>
<style scoped>/* TOUJOURS scoped dans les features */</style>
```

**Responsabilités strictes des services** :
- `queries.ts` → SELECT uniquement (max 150 lignes)
- `mutations.ts` → INSERT/UPDATE/DELETE uniquement (max 150 lignes)
- `mapper.ts` → transformation snake_case ↔ camelCase uniquement
- `types.ts` → interfaces pures, zéro logique
- `index.ts` → re-exports uniquement, aucune logique
- Store Pinia : ne fait jamais de `$fetch` direct — stocke uniquement

**Limites de taille — signal d'alarme** :
- Composant Vue : 200 lignes max | Service : 150 lignes max | Composable : 100 lignes max

**Anti-patterns de performance** :

```ts
// ❌ v-for avec index  ✅ v-for avec :key="ong.id"
// ❌ watch(store, handler, { deep: true })  ✅ watch(() => store.prop, handler)
// ❌ méthode dans template  ✅ computed()
```

**Imports croisés entre features** : interdit sauf via `~/types/` ou `~/lib/`.

**Protocole fichiers dépréciés** :

```ts
/** @deprecated Depuis 2026-04. Utiliser ~/features/ong/services. */
```

Nouveau code : INTERDIT d'importer un fichier `@deprecated`.

**Conventions de commentaires** :

```ts
// WHY: validation côté client = moins de latence sur mobile Madagascar
// EDGE CASE: Supabase retourne null si ONG archivée — pas une erreur
// TODO(auth): ajouter rate limiting - bloque sprint 5
// FIXME(perf): requête N+1 sur donations - voir PR #42
```

---

### Workflow de Développement

**Branches** : `main` (prod, auto-deploy Netlify) → `dev` (actif) → `feature/[scope]-[desc]` (depuis dev).

**Format commits** : `type(scope): description` — types : `fix | feat | refactor | docs | chore`.

**Interdits absolus en Git** :

```bash
# ❌ JAMAIS
git push --force origin main
git push --force origin dev
git rebase -i origin/main
git reset --hard origin/main
git add -A  # risque d'inclure .env, binaires
```

**Checklist pré-merge vers `main`** :
- `npm run lint` → 0 erreurs
- `npm run build --legacy-peer-deps` → succès
- Aucun `.env`, credentials, binaire >1MB dans le diff
- Variables Netlify changées → secrets mis à jour avant le merge

**Migrations Supabase** — tout changement de schéma versionné dans `/supabase/migrations/YYYYMMDD_HH_description.sql` avant déploiement. Checklist : migration SQL écrite → RLS testée en staging → code Nuxt compatible → documenté dans la PR. Si une case vide → merge bloqué.

**Niveaux de review** :

| Changement | Review |
|---|---|
| Auth, données utilisateur, logique métier | Approfondie (2 personnes) |
| RLS Supabase, paiements | Approfondie obligatoire |
| Visuels sans logique métier | Rapide (~10 min) |
| Lint, formatting | Automatisé |

**Feature flags** : env vars Netlify pour activer/désactiver les features sensibles sans revert Git.

---

### Règles Critiques à Ne Pas Manquer

Ces règles causent des bugs silencieux ou des failles de sécurité si ignorées :

1. **`~/lib/supabase.ts` = INTERDIT** — deux instances Supabase = deux états d'auth divergents
2. **`import.meta.client` avant tout appel Supabase** — crash SSR garanti sinon
3. **`useXStore()` jamais au top-level d'un module** — crash SSR silencieux
4. **Mapper obligatoire avant store/composant** — row brute Supabase dans l'UI = bug de type non détecté
5. **Middleware `auth` toujours avant `agent-only`/`partner-only`** — route non protégée sinon
6. **`useAsyncData` key unique** — cache Nuxt contaminé entre pages si key dupliquée
7. **Migrations Supabase versionnées avant déploiement** — schéma et code désynchronisés = crash prod
8. **RLS testée sur staging avant prod** — faille de sécurité non détectable autrement
9. **`definePageMeta` non-conditionnel** — ignoré silencieusement si dans un `if`
10. **Jamais de couleur hardcodée** — dark mode cassé sur certains composants

---

## Usage Guidelines

**Pour les agents IA** :
- Lire ce fichier entièrement avant d'implémenter du code
- En cas de doute, préférer l'option la plus restrictive
- Les règles marquées INTERDIT/JAMAIS sont non-négociables
- Si un pattern existant dans le code contredit ce fichier, signaler le conflit plutôt que de copier le pattern

**Pour les humains** :
- Mettre à jour ce fichier lors de changements de stack ou de conventions
- Supprimer les règles devenues évidentes avec la maturité du projet
- Révision recommandée à chaque fin de phase (Phase 1 → Phase 2 → Phase 3)

Dernière mise à jour : 2026-04-30
