# 🚀 Brzo Rešavanje Storage Problema

## 🎯 **Problem:**
- Upload slika ne radi
- "Uploading..." se ne zaustavlja
- Bucket `blog-images` ne postoji

## ✅ **Rešenje (5 minuta):**

### **Korak 1: Idite na Supabase Dashboard**
1. Otvorite [supabase.com](https://supabase.com)
2. Ulogujte se i otvorite projekat `bjbfmddrekjmactytaky`

### **Korak 2: Pokrenite SQL skriptu**
1. Idite na **"SQL Editor"** u levom meniju
2. Kopirajte sledeći kod:

```sql
-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB
  ARRAY['image/*']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create RLS policies for blog-images bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images');
```

3. Kliknite **"Run"** da pokrenete skriptu

### **Korak 3: Testiranje**
1. Refresh admin panel stranicu
2. Pokušajte upload slike u "Featured Image"
3. Trebalo bi da radi bez greške

## 🧪 **Provera da li radi:**

Pokrenite test skriptu:
```bash
node test-storage-bucket.mjs
```

**Očekivani rezultat:**
```
✅ blog-images bucket found!
✅ Upload test successful!
✅ Test file cleaned up successfully
```

## 🎉 **Nakon uspešnog pokretanja:**

Upload funkcionalnost će raditi u:
- ✅ **BlogForm Featured Image**
- ✅ **RichTextEditor**
- ✅ **Admin Panel**

**Vreme potrebno: 5 minuta** ⏱️

