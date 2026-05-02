-- 1. Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ong-documents', 'ong-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Table
CREATE TABLE IF NOT EXISTS ong_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ong_id UUID NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('legal', 'activity')),
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ong_documents_ong_id ON ong_documents(ong_id);

ALTER TABLE ong_documents ENABLE ROW LEVEL SECURITY;

-- 3. Policies table
CREATE POLICY "Documents viewable by everyone"
  ON ong_documents FOR SELECT USING (true);

CREATE POLICY "Auth insert documents"
  ON ong_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete documents"
  ON ong_documents FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Policies storage
CREATE POLICY "Public read ong-documents"
  ON storage.objects FOR SELECT USING (bucket_id = 'ong-documents');

CREATE POLICY "Auth insert ong-documents"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ong-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete ong-documents"
  ON storage.objects FOR DELETE USING (bucket_id = 'ong-documents' AND auth.role() = 'authenticated');