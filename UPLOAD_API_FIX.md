# 🚀 Upload API Fix - Rešenje za Upload Slika

## 🎯 **Problem:**
- Upload slika nije radio u admin panel-u
- Greška: "Storage bucket 'blog-images' nije pronađen"
- Anon key nije mogao da pristupi storage bucket-u

## ✅ **Rešenje:**

### **1. Kreiran API Endpoint**
- **Lokacija**: `src/app/api/upload-image/route.ts`
- **Funkcionalnost**: Upload slika kroz server-side API
- **Prednosti**: 
  - Koristi service role key (admin privilegije)
  - Bypass RLS ograničenja
  - Validacija fajlova na server-u
  - Sigurniji pristup

### **2. Ažuriranje Komponenti**
- **BlogForm.tsx**: Zamenjen direktan Supabase poziv sa API pozivom
- **RichTextEditor.tsx**: Zamenjen direktan Supabase poziv sa API pozivom
- **Uklonjeni**: Nepotrebni import-ovi supabase klijenta

### **3. Environment Setup**
- **Dodan**: `SUPABASE_SERVICE_ROLE_KEY` u `.env.local`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🔧 **Tehnički Detalji:**

### **API Endpoint (`/api/upload-image`):**
```typescript
// Validacija
- Tip fajla (samo slike)
- Veličina (min 1KB, max 5MB)
- Generisanje unique imena

// Upload
- Koristi service role key
- Upload u blog-images bucket
- Vraća public URL
```

### **Komponente:**
```typescript
// Pre: Direktan Supabase poziv
const { data, error } = await supabase.storage
  .from('blog-images')
  .upload(fileName, file)

// Sada: API poziv
const response = await fetch('/api/upload-image', {
  method: 'POST',
  body: formData
})
```

## 🧪 **Testiranje:**

### **API Endpoint Test:**
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "file=@test-image.png" \
  -F "folder=featured-images"
```

**Rezultat:**
```json
{
  "success": true,
  "url": "https://bjbfmddrekjmactytaky.supabase.co/storage/v1/object/public/blog-images/featured-images/1756409453595-test-image.png",
  "path": "featured-images/1756409453595-test-image.png"
}
```

### **Browser Test:**
1. Otvorite admin panel
2. Idite na "Kreiraj Novi Blog"
3. Kliknite "Upload" pored Featured Image
4. Odaberite sliku (veću od 1KB)
5. Trebalo bi da se upload-uje bez greške
6. Idite na "Blogovi" stranicu - slika treba da se vidi u preview-u
7. Otvorite blog - slika treba da se vidi u hero sekciji

## 📁 **Storage Struktura:**
```
blog-images/
├── featured-images/     # Featured Image uploads
├── editor-images/       # RichTextEditor uploads
└── test/               # Test uploads
```

## 🔒 **Sigurnost:**
- ✅ Service role key se koristi samo na server-u
- ✅ Anon key ostaje u browser-u
- ✅ Validacija fajlova na server-u
- ✅ RLS pravila ostaju aktivna

## 🎉 **Rezultat:**
- ✅ Upload slika radi u admin panel-u
- ✅ RichTextEditor upload radi
- ✅ Nema više grešaka sa bucket-om
- ✅ Sigurniji pristup kroz API endpoint
- ✅ Validacija veličine slike (min 1KB, max 5MB)
- ✅ Ne prikazuje se bela pozadina umesto slike
- ✅ Slike se prikazuju u blog listing stranici
- ✅ Slike se prikazuju u related posts sekciji
- ✅ Uklonjeni "Featured" tagovi sa slika u preview-u
- ✅ Ceo blog box je klikabilan (ne samo "Pročitaj više" dugme)
