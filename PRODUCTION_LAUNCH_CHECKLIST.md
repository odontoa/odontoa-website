# Production Launch Checklist - SEO, GEO i AI

Ovaj dokument sadrži korak-po-korak instrukcije za post-launch provere i konfiguracije koje zahtevaju ručne akcije ili pristup Google alatima.

## ✅ Pre-Launch (Već implementirano u kodu)

Sledeće stavke su već implementirane i ne zahtevaju dodatne akcije:

- ✅ Canonical domen (`https://odontoa.com`)
- ✅ Middleware za redirecte (www → non-www, http → https)
- ✅ robots.txt, sitemap.xml, llms.txt endpointi
- ✅ SEO metadata (title, description, OG, Twitter)
- ✅ JSON-LD structured data (WebPage, BreadcrumbList, Article, FAQPage)
- ✅ GA4 tracking i eventi
- ✅ GSC verification code podrška

---

## 🔴 Prioritet 1: Pre-Launch Testiranje (Pre deploy-a)

### 1. Testiranje Redirecta

**Nakon deploy-a na produkciju, testiraj:**

```bash
# Test www → non-www redirect (301)
curl -I https://www.odontoa.com
# Očekivano: HTTP/1.1 301 Moved Permanently
# Očekivano: Location: https://odontoa.com

# Test http → https redirect (301)
curl -I http://odontoa.com
# Očekivano: HTTP/1.1 301 Moved Permanently
# Očekivano: Location: https://odontoa.com

# Test kombinovani redirect
curl -I http://www.odontoa.com
# Očekivano: HTTP/1.1 301 Moved Permanently
# Očekivano: Location: https://odontoa.com
```

**Status:** ☐ TODO ☐ DONE

**Napomena:** Ako redirecti ne rade, proveri Vercel Domain Settings ili hosting konfiguraciju.

---

### 2. Testiranje SEO Endpointa

**Testiraj da svi endpointi vraćaju 200:**

```bash
# Test robots.txt
curl -I https://odontoa.com/robots.txt
# Očekivano: HTTP/1.1 200 OK
# Očekivano: Content-Type: text/plain

# Test sitemap.xml
curl -I https://odontoa.com/sitemap.xml
# Očekivano: HTTP/1.1 200 OK
# Očekivano: Content-Type: application/xml

# Test llms.txt
curl -I https://odontoa.com/llms.txt
# Očekivano: HTTP/1.1 200 OK
# Očekivano: Content-Type: text/plain
```

**Proveri i sadržaj:**

```bash
# Proveri da robots.txt sadrži Sitemap link
curl https://odontoa.com/robots.txt | grep -i sitemap
# Očekivano: Sitemap: https://odontoa.com/sitemap.xml

# Proveri da sitemap.xml sadrži URL-ove
curl https://odontoa.com/sitemap.xml | head -20
# Očekivano: XML sa URL-ovima

# Proveri da llms.txt sadrži opis
curl https://odontoa.com/llms.txt | head -10
# Očekivano: Tekstualni opis Odontoa platforme
```

**Status:** ☐ TODO ☐ DONE

---

## 🟡 Prioritet 2: Post-Launch - Prvi dan

### 3. Google Search Console (GSC) Verifikacija

**Korak 1: Dodaj Environment Varijablu**

1. Otvori **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Dodaj novu varijablu:
   - **Name:** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - **Value:** (verification code iz GSC - vidi Korak 2)
   - **Environment:** Production (i Preview ako želiš)
3. **Redeploy** aplikaciju

**Korak 2: Verifikacija u Google Search Console**

1. Otvori [Google Search Console](https://search.google.com/search-console)
2. Klikni **"Add Property"** → Izaberi **"Domain"** (ne "URL prefix")
3. Unesi: `odontoa.com`
4. Izaberi metodu verifikacije: **"HTML tag"**
5. Kopiraj `content` vrednost iz meta taga (npr. `abc123def456...`)
6. Dodaj tu vrednost u Vercel env varijable (Korak 1)
7. Redeploy aplikaciju
8. Vrati se u GSC i klikni **"Verify"**

**Provera:**

```bash
# Proveri da verification tag postoji u HTML-u
curl https://odontoa.com | grep -i "google-site-verification"
# Očekivano: <meta name="google-site-verification" content="abc123...">
```

**Status:** ☐ TODO ☐ DONE

---

### 4. GSC Sitemap Submit

**Nakon verifikacije domena:**

1. Otvori **Google Search Console** → **Sitemaps** (u levom meniju)
2. U polje "Add a new sitemap" unesi: `sitemap.xml`
3. Klikni **"Submit"**
4. Proveri status - treba da pokazuje **"Success"** nakon nekoliko minuta
5. Proveri broj URL-ova - treba da odgovara stvarnom broju stranica

**Status:** ☐ TODO ☐ DONE

---

### 5. Google Rich Results Test

**Testiraj ključne stranice:**

1. Otvori [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Testiraj sledeće URL-ove:

   **a) Homepage:**
   - URL: `https://odontoa.com`
   - Očekivano: WebPage + BreadcrumbList schema
   - Status: ☐ TODO ☐ DONE

   **b) Blog Post:**
   - URL: `https://odontoa.com/blogovi/[neki-post-slug]`
   - Očekivano: WebPage + BreadcrumbList + Article + FAQPage schema
   - Status: ☐ TODO ☐ DONE

   **c) Glossary Term:**
   - URL: `https://odontoa.com/recnik/[neki-term-slug]`
   - Očekivano: WebPage + BreadcrumbList + Article + FAQPage schema
   - Status: ☐ TODO ☐ DONE

**Prihvatljivi rezultati:**
- ✅ Nema **errors** (crveno)
- ⚠️ **Warnings** (žuto) su OK
- ✅ Sve očekivane schema tipove detektovane

**Status:** ☐ TODO ☐ DONE

---

## 🟢 Prioritet 3: Post-Launch - Prva nedelja

### 6. GA4 Conversions Setup

**Označi ključne evente kao conversions:**

1. Otvori **Google Analytics 4** → **Admin** (donji levi ugao)
2. U sekciji **"Property"** → Klikni **"Events"**
3. Za svaki od sledećih eventa, klikni na event i uključi **"Mark as conversion"**:

   - `cta_click` - Klik na CTA dugme
   - `contact_form_submit` - Slanje kontakt forme
   - `demo_request` - Zahtev za demo
   - `blog_view` - Pregled blog posta
   - `glossary_view` - Pregled rečnika

4. Proveri da su eventi vidljivi u **Reports** → **Conversions**

**Status:** ☐ TODO ☐ DONE

---

### 7. GSC Request Indexing

**Request indexing za ključne stranice:**

1. Otvori **Google Search Console** → **URL Inspection** (gornji search bar)
2. Za svaku od sledećih stranica:
   - Unesi URL
   - Klikni **"Test URL"**
   - Ako strana nije indeksirana, klikni **"Request Indexing"**

   **Stranice za indexing:**
   - `https://odontoa.com` (homepage)
   - `https://odontoa.com/blogovi` (blog listing)
   - `https://odontoa.com/recnik` (glossary listing)
   - `https://odontoa.com/kontakt` (contact page)
   - `https://odontoa.com/o-nama` (about page)
   - Najnoviji blog postovi (3-5)
   - Najpopularniji glossary termini (3-5)

**Status:** ☐ TODO ☐ DONE

---

### 8. GSC Monitoring Setup

**Podesi monitoring za greške:**

1. Otvori **Google Search Console** → **Coverage** (u levom meniju)
2. Proveri **"Valid"** stranice - treba da se povećavaju tokom vremena
3. Proveri **"Error"** sekciju - ne bi trebalo da ima kritičnih grešaka
4. Otvori **Enhancements** → Proveri:
   - **Breadcrumbs** - treba da pokazuje validne breadcrumbs
   - **FAQ** - treba da pokazuje validne FAQ rich results
   - **Articles** - treba da pokazuje validne Article rich results

**Redovno proveravaj (jednom nedeljno):**
- Coverage report za nove greške
- Enhancements za rich results status
- Performance report za search queries

**Status:** ☐ TODO ☐ DONE

---

## 📋 Finalna Provera (Launch Gate)

Pre nego što označiš launch kao kompletan, proveri:

- [ ] Svi redirecti rade (www → non-www, http → https)
- [ ] robots.txt, sitemap.xml, llms.txt vraćaju 200
- [ ] GSC domen verifikovan
- [ ] Sitemap submit-ovan i status "Success"
- [ ] Rich Results test nema errors za ključne stranice
- [ ] GA4 radi i eventi se vide u Realtime
- [ ] Conversions označene u GA4
- [ ] Request indexing za ključne stranice u GSC
- [ ] GSC Coverage nema kritičnih grešaka

**Status:** ☐ TODO ☐ DONE

---

## 🆘 Troubleshooting

### Redirecti ne rade
- Proveri Vercel Domain Settings
- Proveri da middleware.ts nema sintaksnih grešaka
- Proveri DNS konfiguraciju

### Endpointi vraćaju 404
- Proveri da su fajlovi na pravim lokacijama:
  - `public/robots.txt`
  - `src/app/sitemap.ts`
  - `src/app/api/llms/route.ts`
- Proveri Next.js build logove za greške

### GSC verifikacija ne radi
- Proveri da je env varijabla postavljena u Production environment
- Proveri da je aplikacija redeploy-ovana nakon dodavanja env varijable
- Proveri da verification tag postoji u page source

### Rich Results test pokazuje greške
- Proveri da JSON-LD schema nema sintaksnih grešaka
- Proveri da su svi obavezni polja prisutna (Article.image, author.url, itd.)
- Proveri da su datumi u ISO 8601 formatu

---

## 📝 Reference

- [WWW Redirect Setup](./WWW_REDIRECT_SETUP.md)
- [Post-Launch Test List](./POST_LAUNCH_TEST_LIST.md)
- [Env Variables Check](./ENV_VARIABLES_CHECK.md)
- [SEO Status Document](./ODONTOA_SEO_STATUS.md)
- [SEO/GEO/AI Launch Checklist (SR)](./SEO_GEO_AI_Launch_Checklist_SR.md) - Sekcija 8: Sanity Integration Best Practices
- [SEO/GEO/AI Launch Checklist (EN)](./SEO_GEO_AI_Launch_Checklist_EN.md) - Section 8: Sanity Integration Best Practices