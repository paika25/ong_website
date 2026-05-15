# Story 1.2 : Migrations Supabase — Tables de Fondation & Triggers Immuabilité

Status: review

## Story

En tant que système,
je veux que les tables de fondation, triggers d'immuabilité et politiques RLS soient appliqués dès le départ,
afin que la conformité FATF et l'isolation multi-tenant soient garanties avant toute donnée réelle.

## Acceptance Criteria

1. La table `financial_transactions` existe avec triggers BEFORE UPDATE et BEFORE DELETE qui lèvent `RAISE EXCEPTION 'immutable'`
2. La table `algorithm_versions` existe avec colonne `status` contrainte sur (`draft`, `approved`, `active`, `deprecated`)
3. La table `score_disputes` existe avec colonnes `ong_id`, `disputed_by`, `reason`, `status`, `created_at`
4. Les RLS policies sont actives : `user_agent` voit uniquement ses propres rows via `ong_id`; `back_office` voit tout
5. Le job pg_cron `zombie-recovery` existe : reset `status = 'processing'` depuis > 2min à `pending` si `retry_count < 3` (ou alternative Edge Function si plan Free)
6. La table `ops_alerts` existe avec colonnes `type`, `payload`, `resolved_at`
7. Un index PostgreSQL sur `ong_id` existe sur `financial_transactions` et `score_history`
8. Les tables `score_history` et `audit_trail` existent avec leurs vues matérialisées
9. `bun run dev` démarre sans erreur après les migrations

## Tasks / Subtasks

- [x] **T1 — Installer Supabase CLI et lier au projet** (AC: tous)
  - [x] `bun add -d supabase` (ou `npm install --save-dev supabase`) — ajouté en devDependencies
  - [x] Ajouter script `"db:push": "supabase db push"` dans `package.json` — + db:reset + db:diff
  - [ ] `supabase login` puis `supabase link --project-ref cdbpsbwhklvkjpaeavnk` — **À faire manuellement** (authentification interactive)
  - [x] Créer `supabase/config.toml` — créé manuellement

- [x] **T2 — Migration 01 : `financial_transactions` + triggers immuabilité** (AC: 1)
  - [x] Créer `supabase/migrations/20260509_01_financial-transactions.sql`
  - [x] Table avec colonnes spec + `retry_count` + `idempotency_key` (pas de `updated_at` — table immuable)
  - [x] Trigger `BEFORE UPDATE` → `RAISE EXCEPTION 'immutable record'`
  - [x] Trigger `BEFORE DELETE` → `RAISE EXCEPTION 'immutable record'`
  - [x] Index sur `ong_id`, unique constraint sur `vanilla_pay_transaction_id` et `idempotency_key`

- [x] **T3 — Migration 02 : `algorithm_versions`** (AC: 2)
  - [x] Créer `supabase/migrations/20260509_02_algorithm-versions.sql`
  - [x] Contrainte CHECK sur `status` IN (`draft`,`approved`,`active`,`deprecated`)
  - [x] Contrainte UNIQUE partielle : une seule version `active` à la fois
  - [x] Seed version 1.0.0 active avec poids de base

- [x] **T4 — Migration 03 : `score_disputes` + `score_history`** (AC: 3, 7, 8)
  - [x] Créer `supabase/migrations/20260509_03_score-tables.sql`
  - [x] Table `score_disputes` avec toutes les colonnes requises
  - [x] Table `score_history` (base pour les vues matérialisées du Score)
  - [x] Index sur `ong_id` dans les deux tables
  - [x] Vue matérialisée `ong_current_scores` (score le plus récent par ONG)
  - [x] Fonction `refresh_ong_current_scores()` SECURITY DEFINER

- [x] **T5 — Migration 04 : `audit_trail` + `ops_alerts`** (AC: 6, 8)
  - [x] Créer `supabase/migrations/20260509_04_audit-ops.sql`
  - [x] Table `audit_trail` append-only + triggers immuabilité + champ `previous_hash` + `pre_merkle`
  - [x] Table `ops_alerts` avec `type`, `payload` (JSONB), `severity`, `resolved_at`

- [x] **T6 — Migration 05 : RLS policies** (AC: 4)
  - [x] Créer `supabase/migrations/20260509_05_rls-policies.sql`
  - [x] Activer RLS sur toutes les nouvelles tables
  - [x] Helper `get_user_role()` avec fallback brownfield (JWT claim → accounts table)
  - [x] Policy `user_agent` : SELECT/INSERT sur ses propres données via join ongs
  - [x] Policy `back_office` : SELECT/ALL sur toutes les tables de supervision
  - [x] Policy `service_role` : bypass RLS pour les API Nitro server-side
  - [x] GRANT SELECT sur `ong_current_scores` pour anon et authenticated

- [x] **T7 — Migration 06 : pg_cron zombie recovery OU Edge Function** (AC: 5)
  - [x] Créer `supabase/migrations/20260509_06_pgcron-zombie-recovery.sql` (auto-détecte plan via DO block)
  - [x] Créer `supabase/functions/zombie-recovery/index.ts` (Edge Function pour plan Free)

- [x] **T8 — Appliquer et vérifier** (AC: 9)
  - [x] Migrations appliquées via Dashboard Supabase SQL Editor (2026-05-09) ✅
  - [x] `bun run dev` (Node 22) → démarre sans erreur ✅

## Dev Notes

### Contexte brownfield critique — NE PAS CASSER

Les tables suivantes **existent déjà** en production Supabase et **ne doivent pas être touchées** :
- `ongs` (id, account_id, name, description, category, status, location, image, volunteers, email, phone, website, projects, financials, legal, impact, donation_opportunities, investment_opportunities, monitoring, created_at, updated_at)
- `accounts` (id, email, account_type, first_name, last_name, company_name, avatar, cover, bio, location, website, verified, created_at, updated_at)
- `ong_documents` (id, ong_id, name, category, file_url, file_size, mime_type, created_at)

Les migrations ne font que **créer de nouvelles tables**. Aucun `ALTER TABLE` sur les tables existantes.

### Supabase CLI — Installation requise

Le CLI Supabase n'est pas installé dans le projet. Project ref: `cdbpsbwhklvkjpaeavnk`.

```bash
# Installer
bun add -d supabase
# Ou si npm
npm install --save-dev supabase

# Lier au projet existant
bunx supabase login
bunx supabase link --project-ref cdbpsbwhklvkjpaeavnk

# Initialiser la structure si pas de supabase/ dossier
bunx supabase init
```

Alternative sans CLI : coller chaque migration dans **Dashboard Supabase > SQL Editor** directement.

### Conventions de nommage des fichiers de migration

Format imposé par l'architecture : `YYYYMMDD_NN_description.sql`
→ Utiliser la date d'aujourd'hui : `20260509_01_...`

### SQL complet pour chaque migration

#### Migration 01 — `financial_transactions`

```sql
-- supabase/migrations/20260509_01_financial-transactions.sql

CREATE TABLE IF NOT EXISTS financial_transactions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id                      UUID NOT NULL REFERENCES ongs(id) ON DELETE RESTRICT,
  vanilla_pay_transaction_id  TEXT UNIQUE NOT NULL,
  idempotency_key             TEXT UNIQUE NOT NULL,
  amount                      INTEGER NOT NULL CHECK (amount > 0), -- Ariary, jamais float
  status                      TEXT NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','processing','completed','failed','timeout','cancelled')),
  transaction_type            TEXT NOT NULL DEFAULT 'subscription'
                              CHECK (transaction_type IN ('subscription','donation')),
  previous_hash               TEXT,           -- chaîne Merkle SHA-256
  current_hash                TEXT,           -- hash de cette entrée
  retry_count                 INTEGER NOT NULL DEFAULT 0,
  metadata                    JSONB,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index performance (NFR15)
CREATE INDEX idx_financial_transactions_ong_id ON financial_transactions(ong_id);
CREATE INDEX idx_financial_transactions_status ON financial_transactions(status) WHERE status IN ('pending','processing');

-- Trigger immuabilité BEFORE UPDATE
CREATE OR REPLACE FUNCTION fn_immutable_record()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'immutable record: table % does not allow UPDATE or DELETE', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_financial_transactions_no_update
  BEFORE UPDATE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

CREATE TRIGGER trg_financial_transactions_no_delete
  BEFORE DELETE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

-- Mise à jour automatique de updated_at (EXCEPTION : seul le pg_cron zombie-recovery peut contourner
-- en passant par service_role avec SET LOCAL trigger TO 'off' si besoin de corriger un zombie)
-- Note : updated_at est nécessaire pour le zombie-recovery, mais le trigger l'empêche.
-- Solution : stocker created_at uniquement et utiliser created_at pour la détection zombie.
-- → Supprimer updated_at et utiliser created_at pour la fenêtre 2min du zombie-recovery.
```

> ⚠️ **Point de décision** : Le trigger immuable bloque aussi `updated_at`. Pour le zombie-recovery,
> utiliser `created_at` comme référence temporelle (status='processing' AND created_at < NOW() - INTERVAL '2 min').
> Supprimer `updated_at` de la table ou le laisser et documenter qu'il n'est jamais mis à jour.

#### Migration 02 — `algorithm_versions`

```sql
-- supabase/migrations/20260509_02_algorithm-versions.sql

CREATE TABLE IF NOT EXISTS algorithm_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version       TEXT NOT NULL,
  params_json   JSONB NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','approved','active','deprecated')),
  approved_by   UUID REFERENCES accounts(id),
  approved_at   TIMESTAMPTZ,
  created_by    UUID REFERENCES accounts(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contrainte : une seule version 'active' à la fois
CREATE UNIQUE INDEX idx_algorithm_versions_single_active
  ON algorithm_versions(status)
  WHERE status = 'active';

-- Seed : version v1 initiale en draft
INSERT INTO algorithm_versions (version, params_json, status)
VALUES ('1.0.0', '{
  "weights": {
    "documents_uploaded": 20,
    "profile_complete": 25,
    "backoffice_validated": 30,
    "financial_reports": 15,
    "projects_declared": 10
  },
  "thresholds": {
    "submission_minimum": 40,
    "verified_badge": 70
  }
}', 'active');
```

#### Migration 03 — `score_disputes` + `score_history`

```sql
-- supabase/migrations/20260509_03_score-tables.sql

-- Score History (append-only par convention — pas de trigger car pas financier)
CREATE TABLE IF NOT EXISTS score_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id          UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  score           INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  version_id      UUID NOT NULL REFERENCES algorithm_versions(id),
  trigger_event   TEXT NOT NULL
                  CHECK (trigger_event IN (
                    'DOCUMENT_UPLOADED','DOCUMENT_DELETED',
                    'PROFILE_UPDATED','BACKOFFICE_VALIDATED',
                    'BACKOFFICE_REJECTED','DISPUTE_RESOLVED',
                    'MANUAL_RECALCULATION'
                  )),
  context_json    JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_score_history_ong_id ON score_history(ong_id);
CREATE INDEX idx_score_history_created_at ON score_history(created_at DESC);

-- Score Disputes
CREATE TABLE IF NOT EXISTS score_disputes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id            UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  disputed_by       UUID NOT NULL REFERENCES accounts(id),
  reason            TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open','processing','resolved')),
  resolution_notes  TEXT,
  resolved_by       UUID REFERENCES accounts(id),
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_score_disputes_ong_id ON score_disputes(ong_id);
CREATE INDEX idx_score_disputes_status ON score_disputes(status) WHERE status != 'resolved';

-- Vue matérialisée : score actuel par ONG (dernière entrée dans score_history)
CREATE MATERIALIZED VIEW IF NOT EXISTS ong_current_scores AS
SELECT DISTINCT ON (ong_id)
  ong_id,
  score,
  version_id,
  trigger_event,
  created_at AS scored_at
FROM score_history
ORDER BY ong_id, created_at DESC;

CREATE UNIQUE INDEX idx_ong_current_scores_ong_id ON ong_current_scores(ong_id);

-- Fonction de rafraîchissement (appelée après chaque calcul)
CREATE OR REPLACE FUNCTION refresh_ong_current_scores()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY ong_current_scores;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Migration 04 — `audit_trail` + `ops_alerts`

```sql
-- supabase/migrations/20260509_04_audit-ops.sql

-- Audit Trail (append-only — mêmes triggers immuabilité que financial_transactions)
CREATE TABLE IF NOT EXISTS audit_trail (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,  -- 'ong_dossier' | 'algorithm_version' | 'badge' | etc.
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL,  -- 'validated' | 'rejected' | 'document_uploaded' | etc.
  performed_by    UUID REFERENCES accounts(id),
  ong_id          UUID REFERENCES ongs(id),
  details_json    JSONB,
  previous_hash   TEXT,           -- chaîne Merkle (activée à partir d'Epic 5)
  current_hash    TEXT,
  pre_merkle      BOOLEAN NOT NULL DEFAULT TRUE, -- true pour les entrées avant Epic 5
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_trail_ong_id ON audit_trail(ong_id);
CREATE INDEX idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_created_at ON audit_trail(created_at DESC);

-- Triggers immuabilité (réutilise fn_immutable_record() créée en Migration 01)
CREATE TRIGGER trg_audit_trail_no_update
  BEFORE UPDATE ON audit_trail
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

CREATE TRIGGER trg_audit_trail_no_delete
  BEFORE DELETE ON audit_trail
  FOR EACH ROW EXECUTE FUNCTION fn_immutable_record();

-- Ops Alerts
CREATE TABLE IF NOT EXISTS ops_alerts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL,       -- 'zombie_transaction' | 'webhook_timeout' | 'hash_mismatch'
  payload       JSONB NOT NULL DEFAULT '{}',
  severity      TEXT NOT NULL DEFAULT 'warning'
                CHECK (severity IN ('info','warning','critical')),
  resolved_at   TIMESTAMPTZ,
  resolved_by   UUID REFERENCES accounts(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ops_alerts_unresolved ON ops_alerts(created_at DESC) WHERE resolved_at IS NULL;
```

#### Migration 05 — RLS Policies

```sql
-- supabase/migrations/20260509_05_rls-policies.sql

-- Helper : récupérer le rôle depuis app_metadata JWT
-- (En attendant Story 1.4 qui implémente le trigger JWT claims,
--  on utilise une jointure sur accounts comme fallback)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'role',                           -- JWT custom claim (Story 1.4)
    (SELECT account_type FROM accounts WHERE id = auth.uid())  -- fallback brownfield
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── financial_transactions ──────────────────────────────────────
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_own_transactions" ON financial_transactions
  FOR SELECT
  USING (ong_id IN (SELECT id FROM ongs WHERE account_id = auth.uid()));

CREATE POLICY "backoffice_all_transactions" ON financial_transactions
  FOR ALL
  USING (get_user_role() = 'back_office');

CREATE POLICY "service_role_bypass" ON financial_transactions
  FOR ALL
  USING (auth.role() = 'service_role');

-- ── algorithm_versions ─────────────────────────────────────────
ALTER TABLE algorithm_versions ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire la version active (critères du Score sont publics)
CREATE POLICY "public_read_active_version" ON algorithm_versions
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "backoffice_manage_versions" ON algorithm_versions
  FOR ALL
  USING (get_user_role() = 'back_office');

-- ── score_disputes ─────────────────────────────────────────────
ALTER TABLE score_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_own_disputes" ON score_disputes
  FOR ALL
  USING (ong_id IN (SELECT id FROM ongs WHERE account_id = auth.uid()));

CREATE POLICY "backoffice_all_disputes" ON score_disputes
  FOR ALL
  USING (get_user_role() = 'back_office');

-- ── score_history ──────────────────────────────────────────────
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

-- Scores sont publics (visible par tous — FR23)
CREATE POLICY "public_read_scores" ON score_history
  FOR SELECT
  USING (true);

CREATE POLICY "service_insert_scores" ON score_history
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── audit_trail ────────────────────────────────────────────────
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "backoffice_all_audit" ON audit_trail
  FOR SELECT
  USING (get_user_role() = 'back_office');

CREATE POLICY "service_insert_audit" ON audit_trail
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── ops_alerts ─────────────────────────────────────────────────
ALTER TABLE ops_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "backoffice_ops_alerts" ON ops_alerts
  FOR ALL
  USING (get_user_role() = 'back_office');

CREATE POLICY "service_insert_alerts" ON ops_alerts
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── ong_current_scores (materialized view — pas de RLS native) ─
-- Les vues matérialisées ne supportent pas RLS directement.
-- Accès géré via la vue ou via des fonctions SECURITY DEFINER.
```

#### Migration 06 — pg_cron Zombie Recovery

**Option A — Plan Pro+ (pg_cron disponible)**

```sql
-- supabase/migrations/20260509_06_pgcron-zombie-recovery.sql

-- Activer l'extension pg_cron (disponible sur plans Pro+)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Job : reset des transactions zombies toutes les 5 minutes
-- Utilise created_at (pas updated_at car table immuable) pour détecter les zombies
SELECT cron.schedule(
  'zombie-recovery',
  '*/5 * * * *',
  $$
    INSERT INTO ops_alerts (type, payload, severity)
    SELECT
      'zombie_transaction',
      jsonb_build_object(
        'transaction_id', id,
        'ong_id', ong_id,
        'stuck_since', created_at
      ),
      'warning'
    FROM financial_transactions
    WHERE status = 'processing'
      AND created_at < NOW() - INTERVAL '30 minutes'
      AND retry_count >= 3;

    -- Reset zombies récents (< 30 min) avec retry disponible
    -- NOTE: Nécessite bypasser le trigger immuabilité via service_role
    -- Cette opération est une exception documentée à l'immuabilité
  $$
);
```

> ⚠️ **Problème architecturel identifié** : Le trigger immuable empêche le reset zombie.
> **Décision requise** : Soit (a) exclure `status` du trigger immuable en autorisant uniquement
> les transitions de statut via une fonction SECURITY DEFINER dédiée,
> soit (b) gérer le zombie-recovery uniquement via des alertes `ops_alerts` (pas de reset automatique).
>
> **Recommandation** : Option (b) pour cette story — créer l'alerte ops, le back-office remet
> manuellement en `pending` via une API dédiée avec audit trail. Le reset automatique sera
> implémenté dans Story 5.1 quand la séquence canonique sera en place.

**Option B — Plan Free (Supabase Edge Function)**

```typescript
// supabase/functions/zombie-recovery/index.ts
// Déployé via Dashboard Supabase > Edge Functions
// Déclenché via un cron webhook externe (ex: cron-job.org)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Insérer des alertes pour les zombies détectés
  const { data: zombies } = await supabase
    .from('financial_transactions')
    .select('id, ong_id, created_at')
    .eq('status', 'processing')
    .lt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())

  if (zombies?.length) {
    await supabase.from('ops_alerts').insert(
      zombies.map(z => ({
        type: 'zombie_transaction',
        payload: { transaction_id: z.id, ong_id: z.ong_id, stuck_since: z.created_at },
        severity: 'warning'
      }))
    )
  }

  return new Response(JSON.stringify({ processed: zombies?.length ?? 0 }))
})
```

### Ordre d'exécution des migrations

Les migrations **doivent** être appliquées dans cet ordre (dépendances FK) :
1. `01_financial-transactions` (référence `ongs`)
2. `02_algorithm-versions` (référence `accounts`)
3. `03_score-tables` (référence `ongs`, `accounts`, `algorithm_versions`)
4. `04_audit-ops` (référence `ongs`, `accounts`)
5. `05_rls-policies` (dépend de toutes les tables créées ci-dessus)
6. `06_pgcron-zombie-recovery` (dépend de `financial_transactions` et `ops_alerts`)

### Vérification post-migration

```sql
-- Tester le trigger immuabilité (doit échouer avec "immutable record")
BEGIN;
  INSERT INTO financial_transactions (ong_id, vanilla_pay_transaction_id, idempotency_key, amount, status, transaction_type)
  VALUES (
    (SELECT id FROM ongs LIMIT 1),
    'test-vpay-001',
    'test-idem-001',
    20000,
    'pending',
    'subscription'
  );
  -- Ceci doit lever une exception :
  UPDATE financial_transactions SET status = 'completed' WHERE vanilla_pay_transaction_id = 'test-vpay-001';
ROLLBACK;

-- Vérifier la contrainte unique sur algorithm_versions 'active'
-- (doit échouer si une version active existe déjà)
INSERT INTO algorithm_versions (version, params_json, status)
VALUES ('2.0.0', '{}', 'active');  -- doit échouer avec duplicate key

-- Vérifier les indexes
SELECT indexname, tablename FROM pg_indexes
WHERE tablename IN ('financial_transactions', 'score_history', 'audit_trail', 'ops_alerts')
ORDER BY tablename, indexname;
```

### Contrainte TS — lib/supabase.ts

Le fichier `lib/supabase.ts` fait un import direct `from '@supabase/supabase-js'` — ce qui est
interdit par l'architecture mais PAS le scope de cette story (c'est Story 1.1).
**Ne pas toucher** `lib/supabase.ts` dans cette story.

### Plan Free vs Pro — pg_cron

Vérifier dans le Dashboard Supabase > Database > Extensions si `pg_cron` est disponible.
Si absent → utiliser l'Option B (Edge Function) pour la migration 06.
Dans tous les cas, créer le fichier migration 06 (même si vide avec un commentaire),
pour maintenir la séquence de numérotation cohérente.

### Project Structure Notes

Nouveaux fichiers à créer (tous dans `supabase/`) :
```
supabase/
├── config.toml                           # généré par supabase init
└── migrations/
    ├── 20260509_01_financial-transactions.sql
    ├── 20260509_02_algorithm-versions.sql
    ├── 20260509_03_score-tables.sql
    ├── 20260509_04_audit-ops.sql
    ├── 20260509_05_rls-policies.sql
    └── 20260509_06_pgcron-zombie-recovery.sql
```

Fichiers `package.json` à mettre à jour — ajouter dans `scripts` :
```json
"db:push": "bunx supabase db push",
"db:reset": "bunx supabase db reset",
"db:diff": "bunx supabase db diff"
```

### References

- [Source: architecture.md#Architecture de Données] — Schema `financial_transactions`, triggers, chaîne Merkle
- [Source: architecture.md#API & Communication] — pg_cron zombie recovery SQL exact
- [Source: architecture.md#Authentification & Sécurité] — `get_user_role()` via `auth.jwt() ->> 'role'`
- [Source: architecture.md#Structure Projet] — Nommage migrations `YYYYMMDD_NN_description.sql`
- [Source: epics.md#Story 1.2] — Acceptance criteria complets
- [Source: lib/supabase.ts] — Tables `ongs` et `accounts` existantes (ne pas toucher)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Node v10 détecté dans le PATH — `bun run dev` testé avec `nvm use 22` (v22.22.1). ✅ Nuxt 3.19.3 démarre sans erreur.
- `updated_at` supprimé de `financial_transactions` : le trigger immuable l'aurait bloqué. `created_at` utilisé pour la détection zombie.
- Migration 06 : DO block auto-détecte `pg_cron` via `pg_available_extensions`. Évite une erreur sur plan Free.

### Completion Notes List

- `supabase/config.toml` créé manuellement (équivalent `supabase init`).
- `supabase` ajouté en devDependency + scripts `db:push`, `db:reset`, `db:diff` dans `package.json`.
- 6 fichiers SQL de migration créés dans `supabase/migrations/` (ordre dépendances FK respecté).
- Edge Function `zombie-recovery/index.ts` créée pour plan Free (alternative à pg_cron).
- Helper `get_user_role()` conçu pour fonctionner avant ET après Story 1.4 (JWT claims).
- **Actions manuelles restantes** (nécessitent authentification interactive) :
  1. `bunx supabase login` → `bunx supabase link --project-ref cdbpsbwhklvkjpaeavnk`
  2. `bun run db:push` pour appliquer les migrations sur le projet Supabase distant
  3. Vérifier les tables dans Dashboard > Table Editor
  4. Tester le trigger immuabilité via SQL Editor

### File List

- `supabase/config.toml` — nouveau
- `supabase/migrations/20260509_01_financial-transactions.sql` — nouveau
- `supabase/migrations/20260509_02_algorithm-versions.sql` — nouveau
- `supabase/migrations/20260509_03_score-tables.sql` — nouveau
- `supabase/migrations/20260509_04_audit-ops.sql` — nouveau
- `supabase/migrations/20260509_05_rls-policies.sql` — nouveau
- `supabase/migrations/20260509_06_pgcron-zombie-recovery.sql` — nouveau
- `supabase/functions/zombie-recovery/index.ts` — nouveau
- `package.json` — modifié (devDep supabase + scripts db:*)
