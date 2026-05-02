INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Auth insert avatars"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update avatars"
  ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete avatars"
  ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');