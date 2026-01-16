-- Fonction qui crée automatiquement un account après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.accounts (
    id,
    email,
    account_type,
    first_name,
    last_name,
    company_name,
    bio,
    location,
    website,
    verified,
    created_at,
    updated_at
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Politiques RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own account" ON public.accounts
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own account" ON public.accounts
  FOR UPDATE USING (auth.uid() = id);