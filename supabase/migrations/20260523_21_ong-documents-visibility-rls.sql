-- =============================================================================
-- Migration 21 : ong_documents — colonne visibility + RLS stricte
--
-- POURQUOI :
--   - La table n'avait pas de distinction public/privé : tous les documents
--     étaient accessibles à tout le monde (RLS = true).
--   - INSERT/DELETE n'était pas restreint à l'ONG propriétaire.
--   - Le bucket Storage n'était pas protégé en suppression.
--
-- APRÈS :
--   visibility = 'public'   → lisible par tous (y compris anonymes)
--   visibility = 'partners' → lisible par tout user authentifié
--   visibility = 'private'  → lisible uniquement par les membres de l'ONG + back_office
--   INSERT/DELETE            → uniquement par les membres de l'ONG (account_id ou agent_ong_managers)
-- =============================================================================

-- ── 1. Créer la table si elle n'existe pas encore (brownfield) ──────────────
CREATE TABLE IF NOT EXISTS ong_documents (
  id         UUID     DEFAULT gen_random_uuid() PRIMARY KEY,
  ong_id     UUID     NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  name       TEXT     NOT NULL,
  category   TEXT     NOT NULL CHECK (category IN ('legal', 'activity')),
  file_url   TEXT     NOT NULL,
  file_size  INTEGER  NOT NULL,
  mime_type  TEXT     NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ong_documents_ong_id ON ong_documents(ong_id);

ALTER TABLE ong_documents ENABLE ROW LEVEL SECURITY;

-- ── 2. Colonne visibility ────────────────────────────────────────────────────
ALTER TABLE ong_documents
  ADD COLUMN IF NOT EXISTS visibility TEXT
  NOT NULL DEFAULT 'public'
  CHECK (visibility IN ('public', 'partners', 'private'));

-- Backfill : documents existants → public (comportement précédent)
UPDATE ong_documents SET visibility = 'public' WHERE visibility IS NULL;

-- ── 3. Helper : membre d'une ONG (propriétaire OU co-gestionnaire) ──────────
CREATE OR REPLACE FUNCTION is_ong_member(p_ong_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM ongs
    WHERE id = p_ong_id AND account_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM agent_ong_managers
    WHERE ong_id = p_ong_id AND agent_account_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── 4. Remplacer les anciennes policies permissives ──────────────────────────
DROP POLICY IF EXISTS "Documents viewable by everyone" ON ong_documents;
DROP POLICY IF EXISTS "Auth insert documents"          ON ong_documents;
DROP POLICY IF EXISTS "Auth delete documents"          ON ong_documents;

-- ── 5. Nouvelles policies SELECT par visibilité ──────────────────────────────

-- Documents publics : visibles par tous (y compris anonymes)
CREATE POLICY "doc_public_select" ON ong_documents
  FOR SELECT USING (visibility = 'public');

-- Documents partenaires : visibles par tout utilisateur authentifié
CREATE POLICY "doc_partners_select" ON ong_documents
  FOR SELECT USING (
    visibility = 'partners'
    AND auth.role() = 'authenticated'
  );

-- Documents privés : membres de l'ONG ou back_office uniquement
CREATE POLICY "doc_private_select" ON ong_documents
  FOR SELECT USING (
    visibility = 'private'
    AND (is_ong_member(ong_id) OR get_user_role() = 'back_office')
  );

-- Back-office voit tout (toutes visibilités)
CREATE POLICY "doc_backoffice_select_all" ON ong_documents
  FOR SELECT USING (get_user_role() = 'back_office');

-- ── 6. Policies INSERT / DELETE strictes par ownership ───────────────────────

-- Seul un membre de l'ONG peut ajouter un document
CREATE POLICY "doc_member_insert" ON ong_documents
  FOR INSERT WITH CHECK (is_ong_member(ong_id));

-- Seul un membre de l'ONG peut supprimer un de ses documents
CREATE POLICY "doc_member_delete" ON ong_documents
  FOR DELETE USING (is_ong_member(ong_id));

-- Service role bypass (migrations, webhooks)
CREATE POLICY "doc_service_role_all" ON ong_documents
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 7. Storage : corriger la policy DELETE ───────────────────────────────────
-- Le chemin dans le bucket est : {ong_id}/{category}/{timestamp}-{filename}
-- On vérifie que l'utilisateur est membre de l'ONG dont l'ID est le premier segment.

DROP POLICY IF EXISTS "Auth delete ong-documents" ON storage.objects;

CREATE POLICY "storage_doc_delete_owner" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'ong-documents'
    AND (
      -- Propriétaire direct
      EXISTS (
        SELECT 1 FROM ongs o
        WHERE o.account_id = auth.uid()
          AND starts_with(name, o.id::text || '/')
      )
      OR
      -- Co-gestionnaire
      EXISTS (
        SELECT 1 FROM agent_ong_managers m
        WHERE m.agent_account_id = auth.uid()
          AND starts_with(name, m.ong_id::text || '/')
      )
      OR
      -- Back-office
      get_user_role() = 'back_office'
    )
  );
