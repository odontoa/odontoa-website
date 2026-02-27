# 🚀 Migration Guide - Enhanced CMS

## 📋 Overview

Ovaj vodič pokazuje kako da pokrenete migraciju za napredni CMS sistem sa svim novim funkcionalnostima.

## 🔧 Pre-requisites

1. **Supabase CLI** instaliran
2. **Node.js 20+** (preporučeno za Supabase kompatibilnost)
3. **Supabase projekat** konfigurisan
4. **Environment variables** postavljeni

## 🚀 Pokretanje migracije

### Opcija 1: Supabase CLI (Preporučeno)

```bash
# Navigate to project root
cd /path/to/odontoa-website

# Push migration to remote Supabase project
supabase db push

# Verify migration
supabase db diff
```

### Opcija 2: Direct SQL Execution

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f supabase/migrations/20250125000007_enhanced_cms_schema.sql
```

### Opcija 3: Supabase Dashboard

1. Otvorite [Supabase Dashboard](https://supabase.com/dashboard)
2. Idite na vaš projekat
3. Navigate to **SQL Editor**
4. Kopirajte sadržaj `supabase/migrations/20250125000007_enhanced_cms_schema.sql`
5. Pokrenite SQL komande

## ✅ Verifikacija migracije

### Provera novih polja

```sql
-- Provera blogs tabele
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blogs' 
AND column_name IN ('summary', 'image_url', 'alt_text', 'related_glossary_terms', 'views_count', 'reading_time', 'seo_score', 'last_modified');

-- Provera glossary tabele
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'glossary' 
AND column_name IN ('why_it_matters', 'related_blog_posts', 'views_count', 'category', 'difficulty_level', 'seo_score', 'last_modified');
```

### Provera novih tabela

```sql
-- Provera topic_clusters tabele
SELECT * FROM public.topic_clusters LIMIT 5;

-- Provera content_analytics tabele
SELECT * FROM public.content_analytics LIMIT 5;
```

### Provera funkcija

```sql
-- Test reading time calculation
SELECT calculate_reading_time('Ovo je test sadržaj za proveru funkcije kalkulacije vremena čitanja.');

-- Test SEO score calculation
SELECT calculate_seo_score(
  'Test naslov', 
  'Test sadržaj sa dovoljno reči za testiranje SEO score kalkulacije', 
  'Test sažetak', 
  'https://example.com/image.jpg', 
  ARRAY['test', 'seo', 'optimizacija']
);
```

## 🔍 Troubleshooting

### Česti problemi

1. **Permission denied**
   ```bash
   # Proverite da li imate admin pristup
   supabase status
   ```

2. **Connection timeout**
   ```bash
   # Proverite internet konekciju i Supabase status
   supabase projects list
   ```

3. **Migration already applied**
   ```bash
   # Proverite postojeće migracije
   supabase migration list
   ```

### Rollback (ako je potrebno)

```bash
# Reset database to previous state
supabase db reset

# Ili pokrenite prethodnu migraciju
supabase db push --include-all
```

## 📊 Post-migration checklist

- [ ] **Database schema** - sve tabele i polja su kreirana
- [ ] **Indexes** - performanse su optimizovane
- [ ] **RLS policies** - sigurnost je konfigurisana
- [ ] **Functions** - utility funkcije rade
- [ ] **Triggers** - automatski update-ovi rade
- [ ] **Default data** - topic clusters su kreirani
- [ ] **Permissions** - svi korisnici imaju pristup

## 🧪 Testing

### Test kreiranja bloga

1. Idite na `/admin-panel`
2. Kliknite "Kreiraj Novi Blog Post"
3. Popunite sva polja
4. Proverite da li se prikazuje SEO score
5. Sačuvajte blog

### Test kreiranja glossary terma

1. Idite na `/admin-panel`
2. Kliknite "Kreiraj Novi Termin"
3. Popunite sva polja
4. Proverite da li se prikazuje reading time
5. Sačuvajte termin

### Test API endpoint-a

```bash
# Test related glossary terms API
curl "http://localhost:3004/api/glossary/related?terms=test-term"
```

## 🎯 Sledeći koraci

1. **Testirajte sve funkcionalnosti** u admin panelu
2. **Proverite SEO meta tagove** na frontend stranicama
3. **Testirajte CTA blokove** na blog i glossary stranicama
4. **Proverite topic clustering** funkcionalnost
5. **Testirajte analytics** (view counting)

## 📞 Support

Ako imate problema sa migracijom:

1. Proverite **Supabase status** na [status.supabase.com](https://status.supabase.com)
2. Pogledajte **Supabase logs** u dashboard-u
3. Kontaktirajte **development tim**

---

**Migration Version**: 20250125000007_enhanced_cms_schema.sql  
**Last Updated**: January 25, 2025  
**Status**: Ready for Production ✅ 