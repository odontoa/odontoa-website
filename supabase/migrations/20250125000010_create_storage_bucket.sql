-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB
  ARRAY['image/*']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow public read access to images
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images'); 