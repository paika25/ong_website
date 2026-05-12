-- =============================================================================
-- Migration 07 : Custom JWT Claims — encode app_metadata.role dans le JWT
--
-- POURQUOI : La fonction get_user_role() (migration 05) lit d'abord
-- auth.jwt() ->> 'role'. Sans ce trigger, cette valeur est toujours NULL
-- et le fallback sur la table accounts est utilisé (plus lent + moins sécurisé).
--
-- FLUX : inscription → trigger → app_metadata.role = account_type
--        → JWT suivant contient 'role' → RLS policies utilisent auth.jwt() ->> 'role'
-- =============================================================================

-- Fonction : copie account_type → app_metadata.role lors de l'inscription
CREATE OR REPLACE FUNCTION public.set_user_role_claim()
RETURNS TRIGGER AS $$
BEGIN
  -- account_type est passé dans raw_user_meta_data via authService.ts signUp()
  -- On le copie dans raw_app_meta_data pour qu'il apparaisse dans le JWT
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object(
      'role', COALESCE(NEW.raw_user_meta_data->>'account_type', 'user_partner')
    )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger : déclenché après chaque nouvelle inscription
DROP TRIGGER IF EXISTS on_auth_user_created_set_role ON auth.users;
CREATE TRIGGER on_auth_user_created_set_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_role_claim();

-- Backfill : remplir app_metadata.role pour les utilisateurs existants
-- (ceux créés avant cette migration n'ont pas encore le claim)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT u.id, a.account_type
    FROM auth.users u
    JOIN public.accounts a ON a.id = u.id
    WHERE (u.raw_app_meta_data->>'role') IS NULL
  LOOP
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) ||
      jsonb_build_object('role', r.account_type)
    WHERE id = r.id;
  END LOOP;

  RAISE NOTICE 'Backfill JWT role claims terminé';
END;
$$;
