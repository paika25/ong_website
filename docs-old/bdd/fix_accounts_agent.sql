-- ============================================================
-- FIX : Comptes agent ONG manquants ou avec mauvais type
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================================

-- Étape 1 : S'assurer que le trigger de création de compte est bien déployé
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.accounts (
    id, email, account_type, first_name, last_name, company_name,
    bio, location, website, verified, created_at, updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'user_partner'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'location',
    NEW.raw_user_meta_data->>'website',
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Étape 2 : Corriger les comptes dont l'id ne correspond pas à l'auth user (email en double)
-- Cas : accounts a un email mais un uuid différent de auth.users → mettre à jour l'id en cascade
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT u.id AS auth_id, a.id AS acc_id
    FROM auth.users u
    JOIN public.accounts a ON a.email = u.email AND a.id != u.id
  LOOP
    -- Mettre à jour les tables référençantes d'abord
    UPDATE public.ongs SET account_id = r.auth_id WHERE account_id = r.acc_id;
    UPDATE public.agent_ong_managers SET agent_account_id = r.auth_id WHERE agent_account_id = r.acc_id;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'donations') THEN
      UPDATE public.donations SET donor_account_id = r.auth_id WHERE donor_account_id = r.acc_id;
    END IF;
    -- Mettre à jour l'id du compte
    UPDATE public.accounts SET id = r.auth_id, updated_at = NOW() WHERE id = r.acc_id;
  END LOOP;
END $$;

-- Étape 2b : Insérer les comptes vraiment manquants (ni par id ni par email)
INSERT INTO public.accounts (
  id, email, account_type, first_name, last_name, company_name,
  bio, location, website, verified, created_at, updated_at
)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'account_type', 'user_partner'),
  u.raw_user_meta_data->>'first_name',
  u.raw_user_meta_data->>'last_name',
  u.raw_user_meta_data->>'company_name',
  u.raw_user_meta_data->>'bio',
  u.raw_user_meta_data->>'location',
  u.raw_user_meta_data->>'website',
  u.email_confirmed_at IS NOT NULL,
  u.created_at,
  NOW()
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.accounts a WHERE a.id = u.id)
  AND NOT EXISTS (SELECT 1 FROM public.accounts a WHERE a.email = u.email)
ON CONFLICT DO NOTHING;

-- Étape 3 : Corriger le account_type pour ceux qui devraient être user_agent
UPDATE public.accounts a
SET account_type = 'user_agent', updated_at = NOW()
FROM auth.users u
WHERE a.id = u.id
  AND u.raw_user_meta_data->>'account_type' = 'user_agent'
  AND a.account_type != 'user_agent';

-- Étape 4 : S'assurer que les politiques RLS existent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'Users can insert own account'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own account" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'Users can read own account'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can read own account" ON public.accounts FOR SELECT USING (auth.uid() = id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'Users can update own account'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update own account" ON public.accounts FOR UPDATE USING (auth.uid() = id)';
  END IF;
END $$;

-- Vérification finale
SELECT
  a.id,
  a.email,
  a.account_type,
  u.raw_user_meta_data->>'account_type' AS meta_account_type,
  CASE WHEN a.account_type = (u.raw_user_meta_data->>'account_type') THEN '✅ OK' ELSE '❌ MISMATCH' END AS status
FROM public.accounts a
JOIN auth.users u ON a.id = u.id
ORDER BY a.created_at DESC;
