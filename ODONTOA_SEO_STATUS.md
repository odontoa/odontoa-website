# Odontoa SEO Status Rezime

**Datum:** 2025-01-27  
**Projekat:** Odontoa Website  
**Status:** Production-ready sa nekoliko stavki koje čekaju pravu domenu

---

## ✅ DONE - Već implementirano

### 1. Domen + Canonical
- ✅ Canonical domen postavljen (`https://odontoa.com`)
- ✅ Canonical tag na blog postovima (dinamičke stranice)
- ✅ Canonical tag na statičkim stranicama
- ✅ 301 redirecti konfigurisani u `next.config.js`

### 2. Crawl & Indexing
- ✅ `robots.txt` postavljen u `public/robots.txt`
- ✅ `sitemap.xml` automatski generisan (`src/app/sitemap.ts`)
- ✅ `llms.txt` API route (`src/app/api/llms/route.ts`)
- ✅ Svi fajlovi vraćaju 200 status kod

### 3. Metadata Standard
- ✅ Title i meta description na svim stranicama
- ✅ OG tagovi implementirani
- ✅ Twitter Card tagovi implementirani
- ✅ noindex implementiran (kontrolisan kroz Sanity `noindex` polje)

### 4. Structured Data (JSON-LD)
- ✅ Centralizovana schema generacija (`src/lib/structured-data/blog-jsonld.ts`)
- ✅ WebPage + BreadcrumbList + Article + FAQPage schema
- ✅ **ISO 8601 format:** `datePublished` i `dateModified` koriste `.toISOString()`
- ✅ **Article.image obavezan:** postoji i koristi absolute URL
- ✅ **author.url obavezan:** postoji i koristi absolute URL
- ✅ **inLanguage definisan:** "sr" u svim schema objektima
- ✅ FAQ mora biti vidljiv u sadržaju (validacija u `SeoJsonLd.tsx`)

### 5. Analytics (GA4)
- ✅ GA4 measurement ID iz env varijable (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- ✅ Key events implementirani (`src/lib/analytics/events.ts`):
  - `cta_click`
  - `contact_form_submit`
  - `demo_request`
  - `blog_view`
  - `glossary_view`

### 6. CMS (Sanity) Standard
- ✅ Sanity čuva samo INPUT polja
- ✅ Automatska generacija metadata + schema + sitemap
- ✅ Obavezna polja za blog: title, slug, excerpt, cover image + alt, publishedAt, FAQ min 3
- ✅ SEO override polja: seoTitle, seoDescription, canonicalUrl, noindex
- ✅ Author URL u Author dokumentu, fallback u blog postu
- ✅ schemaOverrideJson escape hatch postoji

### 7. Programmatic SEO
- ✅ Čista URL struktura (`/blogovi/[slug]`, `/recnik/[slug]`)
- ✅ Centralizovan SEO/schema generisanje
- ✅ Spremno za skaliranje bez refaktora

### 8. Launch Gate
- ✅ robots.txt, sitemap.xml, llms.txt dostupni
- ✅ Schema validna (validacija u development mode)
- ✅ GA4 radi (ako je env varijabla postavljena)
- ✅ Redirecti rade
- ✅ Nema duplikata (centralizovana generacija)

---

## 🆕 DODATO SADA

### 1. Google Search Console (GSC)
- ✅ **GSC verification code iz env varijable:**
  - Implementirano u `src/app/layout.tsx`
  - Koristi `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env varijablu
  - Ako env varijabla nije postavljena, verification tag se ne dodaje (undefined)

### 2. Google Rich Results Readiness
- ✅ **Schema requirements provereni i potvrđeni:**
  - ISO 8601 format datuma ✓
  - Article.image obavezan ✓
  - author.url obavezan ✓
  - inLanguage definisan ✓

### 3. Checklist Dokumenti
- ✅ **Ažurirani oba checklist dokumenta:**
  - `SEO_GEO_AI_Launch_Checklist_SR.md` - dodate sekcije 9 (GSC) i 10 (Rich Results)
  - `SEO_GEO_AI_Launch_Checklist_EN.md` - dodate sekcije 9 (GSC) i 10 (Rich Results)
  - Dodate must-have stavke u postojeće sekcije

---

## ⏳ ČEKA PRAVU DOMENU (Production)

### 1. Google Search Console Verification
- ⏳ **Status:** Implementirano, ali čeka pravi verification code
- **Šta treba:**
  1. Otvori Google Search Console
  2. Dodaj property za `odontoa.com`
  3. Izaberi "HTML tag" metodu verifikacije
  4. Kopiraj verification code
  5. Dodaj u `.env.local` ili production env varijable:
     ```
     NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-actual-verification-code-here
     ```
  6. Redeploy aplikaciju
  7. Klikni "Verify" u Google Search Console

### 2. Sitemap Submit u GSC
- ⏳ **Status:** Čeka GSC verifikaciju
- **Šta treba:**
  1. Nakon verifikacije domena u GSC
  2. Otvori GSC → Sitemaps
  3. Submit `https://odontoa.com/sitemap.xml`
  4. Proveri da status pokazuje "Success"

### 3. Monitoring u GSC
- ⏳ **Status:** Čeka GSC verifikaciju
- **Šta treba:**
  1. Nakon verifikacije, redovno pratiti:
     - Coverage report (indeksirane stranice, greške)
     - Enhancements (rich results status)

### 4. Rich Results Test
- ⏳ **Status:** Može se testirati odmah, ali čeka produkciju
- **Šta treba:**
  1. Nakon deploy-a na produkciju
  2. Testirati ključne stranice u Google Rich Results Test:
     - Homepage: `https://odontoa.com`
     - Blog post: `https://odontoa.com/blogovi/[slug]`
     - Glossary term: `https://odontoa.com/recnik/[slug]`
  3. Proveriti da nema grešaka (errors)

---

## 📝 Napomene

### Važne napomene o implementaciji

**1. FAQ Validacija i Frontend Implementacija**
Sanity validacija osigurava da FAQ postoji u CMS-u (minimum 3 pitanja), ali **ne može da garantuje** da su FAQ Q/A vidljivi 1:1 na frontendu. To je obaveza UI implementacije – frontend mora renderovati FAQ iz Sanity podataka tako da odgovara JSON-LD schema-i. Proverite da FAQ komponenta na stranici prikazuje identičan sadržaj kao u FAQPage schema-i.

**2. GEO/Local SEO**
`geo.region` i `geo.placename` meta tagovi su **sekundarni** signali. Pravi local SEO boost dolazi od:
- **Organization/LocalBusiness schema** sa adresom i kontakt informacijama (ako postoji fizička lokacija)
- **Google Business Profile** (ako postoji lokacija za listing)
- Lokalni backlinkovi i NAP (Name, Address, Phone) konzistentnost

**3. Generative SEO i AI Pretrage**
`llms.txt` i strukturirani podaci (JSON-LD) **pomažu** AI sistemima da razumeju sadržaj, ali rezultat u AI pretragama (ChatGPT, Perplexity, itd.) zavisi od:
- **Autoriteta domena** (backlinkovi, trust signals)
- **Kvaliteta sadržaja** (originalnost, dubina, korisnost)
- **Konzistentnog objavljivanja** (redovni, kvalitetni članci)
- **Internih linkova** (topic clusters, related content)

Fokus treba biti na konzistentno objavljivanje kvalitetnog sadržaja + interne linkove, ne samo na tehničke optimizacije.

### Environment Varijable Potrebne za Production

```bash
# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL (već postavljen)
NEXT_PUBLIC_SITE_URL=https://odontoa.com
```

### Checklist Dokumenti

Oba checklist dokumenta su ažurirana i spremna za upotrebu:
- `SEO_GEO_AI_Launch_Checklist_SR.md` - srpska verzija
- `SEO_GEO_AI_Launch_Checklist_EN.md` - engleska verzija

Sve nove sekcije i must-have stavke su dodate prema zahtevima.

---

## ✅ Sve je Production-Ready

Sve implementacije su **production-safe** i neće lomiti postojeći behavior:
- GSC verification code se dodaje samo ako env varijabla postoji
- Ako env varijabla ne postoji, verification tag se jednostavno ne dodaje (undefined)
- Sve postojeće funkcionalnosti rade kao i pre

**Sledeći korak:** Dodati pravi GSC verification code u production env varijable kada bude dostupan.
