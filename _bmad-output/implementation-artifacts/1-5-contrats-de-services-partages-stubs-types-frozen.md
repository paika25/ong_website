# Story 1.5 : Contrats de Services Partagés (Stubs Typés Frozen)

Status: review

## Story

En tant que développeur,
je veux que tous les services partagés exposent leurs interfaces publiques dès Epic 1,
afin que les epics suivants puissent être développés sans conflit de merge sur les fichiers de services.

## Acceptance Criteria

1. `server/services/audit.service.ts` exporte `insertAuditEntry(entry: AuditEntry): Promise<void>` — body `throw new ServiceError('NOT_IMPLEMENTED', 'audit')`
2. `server/services/score.service.ts` exporte `triggerScoreRecalculation(ongId: string, event: ScoreTriggerEvent, context: ScoreContext): Promise<void>` — body stub
3. `server/services/payment.service.ts` exporte `processPayment(payload: PaymentPayload): Promise<PaymentResult>` — body stub
4. `server/services/email.service.ts` exporte `sendTransactionalEmail(template: EmailTemplate, to: string, data: Record<string, unknown>): Promise<void>` — body stub
5. `server/utils/errors.ts` exporte `ServiceError` avec codes `NOT_FOUND | VALIDATION | FORBIDDEN | CONFLICT | WEBHOOK_FAILED | NOT_IMPLEMENTED`
6. `types/pagination.ts` exporte `PaginatedResponse<T>` avec `data: T[]`, `cursor: string | null`, `total: number`
7. `types/schemas/payment.schema.ts`, `ong.schema.ts`, `score.schema.ts` existent avec les types Zod de base
8. `server/api/webhooks/vanilla-pay.post.ts` existe avec un router dispatching vers handlers stubs (`subscription.payment`, `donation.payment`) — chaque handler retourne `{ received: true }`
9. `bun run dev` démarre sans erreur après tous les fichiers créés

## Tasks / Subtasks

- [x] **T1 — `server/utils/errors.ts` : classe ServiceError** (AC: 1–4, 5)
  - [x] Créer `server/utils/errors.ts` avec classe `ServiceError extends Error`
  - [x] Codes : `NOT_FOUND | VALIDATION | FORBIDDEN | CONFLICT | WEBHOOK_FAILED | NOT_IMPLEMENTED`
  - [x] Map codes → statuts HTTP dans `codeToStatus`

- [x] **T2 — `types/pagination.ts` : PaginatedResponse<T>** (AC: 6)
  - [x] Créer `types/pagination.ts` avec interface `PaginatedResponse<T>`
  - [x] Champs : `data: T[]`, `cursor: string | null`, `total: number`

- [x] **T3 — `types/schemas/` : schémas Zod partagés** (AC: 7)
  - [x] Créer `types/schemas/ong.schema.ts`
  - [x] Créer `types/schemas/payment.schema.ts` — PaymentPayload, PaymentResult, VanillaPayWebhook, états machine
  - [x] Créer `types/schemas/score.schema.ts` — ScoreTriggerEvent, ScoreContext, AuditEntry

- [x] **T4 — `server/services/audit.service.ts` : stub** (AC: 1)
  - [x] Créer `server/services/audit.service.ts`
  - [x] Exporter `insertAuditEntry(entry: AuditEntry): Promise<void>` — throw NOT_IMPLEMENTED

- [x] **T5 — `server/services/score.service.ts` : stub** (AC: 2)
  - [x] Créer `server/services/score.service.ts`
  - [x] Exporter `triggerScoreRecalculation(ongId, event, context): Promise<void>` — throw NOT_IMPLEMENTED

- [x] **T6 — `server/services/payment.service.ts` : stub** (AC: 3)
  - [x] Créer `server/services/payment.service.ts`
  - [x] Exporter `processPayment(payload: PaymentPayload): Promise<PaymentResult>` — throw NOT_IMPLEMENTED

- [x] **T7 — `server/services/email.service.ts` : stub** (AC: 4)
  - [x] Créer `server/services/email.service.ts`
  - [x] Exporter `sendTransactionalEmail(template, to, data): Promise<void>` — throw NOT_IMPLEMENTED
  - [x] `EmailTemplate` type défini avec 10 templates (certification, badge, paiement, email auth…)

- [x] **T8 — `server/api/webhooks/vanilla-pay.post.ts` : router skeleton** (AC: 8)
  - [x] Créer `server/api/webhooks/vanilla-pay.post.ts`
  - [x] Validation Zod du body entrant via `VanillaPayWebhookSchema`
  - [x] Dispatcher `subscription.payment` et `donation.payment` → `{ received: true }`
  - [x] Événements inconnus → `{ received: true, status: 'unhandled' }` (forward-compat)
  - [x] `ServiceError` → `createError()` (seul endroit autorisé per architecture)

- [x] **T9 — Vérification finale** (AC: 9)
  - [x] `npm run dev` (Node 22) → Nitro compile server/ sans erreur ✅

## Dev Notes

### Architecture obligatoire — règles non négociables

**Arborescence des fichiers à créer (depuis l'architecture) :**
```
server/
├── services/
│   ├── audit.service.ts       ← stub insertAuditEntry()
│   ├── score.service.ts       ← stub triggerScoreRecalculation()
│   ├── payment.service.ts     ← stub processPayment()
│   └── email.service.ts       ← stub sendTransactionalEmail()
├── api/
│   └── webhooks/
│       └── vanilla-pay.post.ts  ← router skeleton
└── utils/
    └── errors.ts              ← ServiceError class

types/
├── pagination.ts              ← PaginatedResponse<T>
└── schemas/
    ├── ong.schema.ts
    ├── payment.schema.ts
    └── score.schema.ts
```

**Règle critique** : Les composants Vue n'importent JAMAIS depuis `server/`. Ces services sont server-side only (Nitro). Les fichiers `types/` sont partagés client+serveur.

**Règle ServiceError** : Les services `throw new ServiceError(...)` — jamais `createError()`. Seuls les API handlers (`server/api/*.ts`) appellent `createError()`.

**TypeScript** : Le projet est permissif globalement (`noImplicitAny=false`, `strictNullChecks=false` dans `tsconfig.json`). Les services financiers seront stricts en Story 1.1 (`tsconfig.strict.json`). Pour l'instant, typer correctement sans activer strict mode.

**Zod** : Déjà installé (`zod: ^3.25.76` dans `package.json`). Importer avec `import { z } from 'zod'`.

**Auto-imports Nuxt** : Ne PAS s'attendre aux auto-imports dans `server/`. Les fichiers `server/` doivent importer explicitement. Les fichiers `types/` sont accessibles via le path alias `~/types/`.

### Contenu exact des fichiers à créer

#### `server/utils/errors.ts`

```typescript
export type ServiceErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'WEBHOOK_FAILED'
  | 'NOT_IMPLEMENTED'

export const codeToStatus: Record<ServiceErrorCode, number> = {
  NOT_FOUND:       404,
  VALIDATION:      422,
  FORBIDDEN:       403,
  CONFLICT:        409,
  WEBHOOK_FAILED:  502,
  NOT_IMPLEMENTED: 501,
}

export class ServiceError extends Error {
  constructor(
    public code: ServiceErrorCode,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}
```

#### `types/pagination.ts`

```typescript
export interface PaginatedResponse<T> {
  data: T[]
  cursor: string | null  // cursor-based, jamais limit/offset
  total: number
}
```

Note : L'architecture spécifie `cursor` (pas `nextCursor`). L'epic AC dit `cursor: string | null`. Utiliser `cursor`.

#### `types/schemas/score.schema.ts`

Doit aligner avec la table `score_history` créée en Story 1.2 :
```typescript
import { z } from 'zod'

export const ScoreTriggerEventSchema = z.enum([
  'DOCUMENT_UPLOADED',
  'DOCUMENT_DELETED',
  'PROFILE_UPDATED',
  'BACKOFFICE_VALIDATED',
  'BACKOFFICE_REJECTED',
  'DISPUTE_RESOLVED',
  'MANUAL_RECALCULATION',
])
export type ScoreTriggerEvent = z.infer<typeof ScoreTriggerEventSchema>

export const ScoreContextSchema = z.object({
  ongId: z.string().uuid(),
  triggeredBy: z.string().uuid().optional(),
  details: z.record(z.unknown()).optional(),
})
export type ScoreContext = z.infer<typeof ScoreContextSchema>

// Aligne avec la table audit_trail (Story 1.2)
export const AuditEntrySchema = z.object({
  entityType: z.string(),
  entityId:   z.string().uuid(),
  action:     z.string(),
  performedBy: z.string().uuid().optional(),
  ongId:      z.string().uuid().optional(),
  details:    z.record(z.unknown()).optional(),
})
export type AuditEntry = z.infer<typeof AuditEntrySchema>
```

#### `types/schemas/payment.schema.ts`

Aligne avec la table `financial_transactions` (Story 1.2) :
```typescript
import { z } from 'zod'

export const TransactionStatusSchema = z.enum([
  'pending', 'processing', 'completed', 'failed', 'timeout', 'cancelled',
])
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>

export const TransactionTypeSchema = z.enum(['subscription', 'donation'])
export type TransactionType = z.infer<typeof TransactionTypeSchema>

export const PaymentPayloadSchema = z.object({
  ongId:                   z.string().uuid(),
  vanillaPayTransactionId: z.string().min(1),
  idempotencyKey:          z.string().min(1),
  amount:                  z.number().int().positive(), // Ariary
  transactionType:         TransactionTypeSchema,
  metadata:                z.record(z.unknown()).optional(),
})
export type PaymentPayload = z.infer<typeof PaymentPayloadSchema>

export const PaymentResultSchema = z.object({
  transactionId: z.string().uuid(),
  status:        TransactionStatusSchema,
  idempotencyKey: z.string(),
})
export type PaymentResult = z.infer<typeof PaymentResultSchema>

// Webhook Vanilla Pay — body entrant
export const VanillaPayWebhookSchema = z.object({
  event: z.string(),       // 'subscription.payment' | 'donation.payment'
  data:  z.record(z.unknown()),
  timestamp: z.string().optional(),
})
export type VanillaPayWebhook = z.infer<typeof VanillaPayWebhookSchema>
```

#### `types/schemas/ong.schema.ts`

Aligne avec la table `ongs` existante en brownfield :
```typescript
import { z } from 'zod'

export const OngStatusSchema = z.enum(['active', 'pending', 'inactive'])
export type OngStatus = z.infer<typeof OngStatusSchema>

export const OngCategorySchema = z.enum([
  'education', 'health', 'environment', 'social', 'culture',
])
export type OngCategory = z.infer<typeof OngCategorySchema>

export const OngBaseSchema = z.object({
  id:          z.string().uuid(),
  name:        z.string().min(1),
  description: z.string(),
  category:    OngCategorySchema,
  status:      OngStatusSchema,
  location:    z.string(),
  accountId:   z.string().uuid(),
})
export type OngBase = z.infer<typeof OngBaseSchema>
```

#### `server/api/webhooks/vanilla-pay.post.ts`

Pattern obligatoire (architecture) — `createError()` UNIQUEMENT ici, jamais dans les services :
```typescript
import { VanillaPayWebhookSchema } from '~/types/schemas/payment.schema'
import { ServiceError } from '~/server/utils/errors'

// Handlers stubs — implémentés en Story 5.1
async function handleSubscriptionPayment(_data: Record<string, unknown>) {
  return { received: true }
}
async function handleDonationPayment(_data: Record<string, unknown>) {
  return { received: true }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const parsed = VanillaPayWebhookSchema.safeParse(body)

    if (!parsed.success) {
      throw new ServiceError('VALIDATION', 'Invalid webhook payload')
    }

    const { event: webhookEvent, data } = parsed.data

    switch (webhookEvent) {
      case 'subscription.payment':
        return await handleSubscriptionPayment(data)
      case 'donation.payment':
        return await handleDonationPayment(data)
      default:
        return { received: true, event: webhookEvent, status: 'unhandled' }
    }
  } catch (err) {
    if (err instanceof ServiceError) {
      throw createError({ statusCode: 422, message: err.message })
    }
    throw createError({ statusCode: 500, message: 'INTERNAL_ERROR' })
  }
})
```

### Apprentissages de Story 1.2

- **Node.js** : Toujours utiliser `nvm use 22` avant `npm run dev` (le PATH système pointe vers Node v10).
- **Config Supabase** : `supabase/config.toml` est présent et lié au projet `cdbpsbwhklvkjpaeavnk`.
- Les tables `financial_transactions`, `audit_trail`, `score_history` sont créées — les types Zod doivent y correspondre exactement.

### Project Structure Notes

Aucun `server/` ou `types/` n'existe actuellement dans le projet — tous les fichiers sont nouveaux. Les auto-imports Nuxt ne couvrent PAS `server/` : les imports doivent être explicites dans tous les fichiers `server/`.

Le projet utilise l'alias `~/` qui résout vers la racine. Dans `server/`, utiliser `~/types/schemas/...` est valide grâce au `tsconfig.json` existant.

### References

- [Source: architecture.md#Gestion d'Erreur Inter-Couches] — `ServiceError`, `codeToStatus`, pattern API handler
- [Source: architecture.md#Arborescence des Services] — chemins exacts des fichiers
- [Source: architecture.md#Validation Layer] — Zod partagé client+serveur dans `~/types/schemas/`
- [Source: architecture.md#Pagination Standard] — `PaginatedResponse<T>` cursor-based
- [Source: epics.md#Story 1.5] — signatures exactes des fonctions exportées
- [Source: migrations/20260509_01_financial-transactions.sql] — colonnes `financial_transactions` pour aligner PaymentPayload
- [Source: migrations/20260509_04_audit-ops.sql] — colonnes `audit_trail` pour aligner AuditEntry

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Nitro compile `server/` avec les imports explicites (pas d'auto-imports). ✅
- `~/types/schemas/` accessible depuis `server/` via path alias `~/`. ✅

### Completion Notes List

- 9 fichiers créés, 0 fichier modifié.
- `VanillaPayWebhookSchema` placé dans `payment.schema.ts` car utilisé par le webhook handler.
- `EmailTemplate` type défini inline dans `email.service.ts` (10 templates couvrant certification, badge, paiement, auth).
- Le webhook retourne `{ received: true, status: 'unhandled' }` pour les events inconnus — forward-compatible avec de nouveaux events Vanilla Pay.

### File List

- `server/utils/errors.ts` — nouveau
- `server/services/audit.service.ts` — nouveau
- `server/services/score.service.ts` — nouveau
- `server/services/payment.service.ts` — nouveau
- `server/services/email.service.ts` — nouveau
- `server/api/webhooks/vanilla-pay.post.ts` — nouveau
- `types/pagination.ts` — nouveau
- `types/schemas/score.schema.ts` — nouveau
- `types/schemas/payment.schema.ts` — nouveau
- `types/schemas/ong.schema.ts` — nouveau
