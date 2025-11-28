-- Add file_url to materials table
ALTER TABLE materials ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Create storage bucket for materials if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload to materials bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials' AND auth.uid() = owner);

-- Policy to allow authenticated users to view their own materials
CREATE POLICY "Allow authenticated view"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materials' AND auth.uid() = owner);
