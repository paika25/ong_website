-- ============================================================
-- FIX: infinite recursion in agent_ong_managers RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1) Drop the broken policies
DROP POLICY IF EXISTS "Gestionnaires voient les managers de leurs ONGs" ON agent_ong_managers;
DROP POLICY IF EXISTS "Propriétaires peuvent ajouter des gestionnaires" ON agent_ong_managers;

-- 2) Recreate SELECT policy without self-referencing subquery
--    An agent can see their own rows, OR rows for ONGs they own (via ongs.account_id)
CREATE POLICY "Gestionnaires voient les managers de leurs ONGs"
  ON agent_ong_managers FOR SELECT
  USING (
    auth.uid() = agent_account_id
    OR ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
    )
  );

-- 3) Recreate INSERT policy: only the ONG owner (ongs.account_id) can add managers
CREATE POLICY "Propriétaires peuvent ajouter des gestionnaires"
  ON agent_ong_managers FOR INSERT
  WITH CHECK (
    ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
    )
  );

-- 4) Add UPDATE/DELETE policies for completeness
CREATE POLICY "Propriétaires peuvent modifier des gestionnaires"
  ON agent_ong_managers FOR UPDATE
  USING (
    ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
    )
  );

CREATE POLICY "Propriétaires peuvent supprimer des gestionnaires"
  ON agent_ong_managers FOR DELETE
  USING (
    ong_id IN (
      SELECT id FROM ongs WHERE account_id = auth.uid()
    )
  );
