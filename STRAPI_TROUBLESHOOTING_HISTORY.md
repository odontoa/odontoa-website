# 🔬 Strapi Cloud Schema Sync - Test Istorija i Analiza

## 📅 Datum: 28. Oktobar 2025

---

## 🎯 CILJ ZADATKA

Omogućiti da se nova polja iz `schema.json` fajlova prikazuju u Strapi Cloud admin panelu nakon deploya:

### Nova Polja:
- ✅ `key_takeaways` (repeatable component: blog.key-takeaway)
- ✅ `faq_items` (repeatable component: blog.faq-item)
- ✅ `cta_footer_*` polja (enabled, headline, subtext, button_label, button_url)
- ✅ `seo_title`, `seo_description`, `og_image`
- ✅ `breadcrumb_label`
- ✅ `geo_focus` (enumeration)
- ✅ `structured_data_override` (JSON)

---

## 📋 ISPROBANI KORACI (Pre Moje Analize)

### ❌ Pokušaj 1: Clean Build + Force Commit

**Šta je urađeno**:
```bash
# Clean cache i build folderi
rm -rf .cache .next build dist

# Force commit i push
git add .
git commit -m "feat: force schema sync"
git push origin main --force
```

**Rezultat**: ❌ Nova polja se nisu pojavila u Strapi Cloud admin panelu

**Razlog neuspeha**: Strapi Cloud ne čita fajlove iz Next.js projekta

---

### ❌ Pokušaj 2: Ručno Trigger Deployment u Strapi Cloud

**Šta je urađeno**:
1. Login u Strapi Cloud Dashboard
2. Klik na "Trigger Deployment" dugme
3. Čekanje 2-5 minuta da se deployment završi

**Rezultat**: ❌ Deployment uspešan, ali nova polja nisu vidljiva

**Razlog neuspeha**: Strapi Cloud deploy-uje iz povezanog repo-a koji verovatno nije ažuriran ili ne postoji

---

### ❌ Pokušaj 3: Kreiranje config/api/.../schema.json Fajlova

**Šta je urađeno**:
```bash
# Kreirani config folderi za schema sync
mkdir -p config/api/article
cp src/api/article/content-types/article/schema.json config/api/article/schema.json

mkdir -p config/api/blog/components/key-takeaway
mkdir -p config/api/blog/components/faq-item
cp src/components/blog/key-takeaway/schema.json config/api/blog/components/key-takeaway/
cp src/components/blog/faq-item/schema.json config/api/blog/components/faq-item/

git add config/
git commit -m "feat: add config schema files for Strapi sync"
git push origin main
```

**Rezultat**: ❌ Nova polja se nisu pojavila u Strapi Cloud admin panelu

**Razlog neuspeha**: Strapi Cloud očekuje schema fajlove u **Strapi backend projektu**, ne u Next.js frontend projektu

---

### ❌ Pokušaj 4: Uklanjanje cms-strapi Foldera

**Šta je urađeno**:
```bash
# Uklonjen cms-strapi folder (stari lokalni Strapi setup)
rm -rf cms-strapi
git add .
git commit -m "chore: remove cms-strapi folder"
git push origin main
```

**Rezultat**: ❌ Bez efekta na Strapi Cloud

**Razlog neuspeha**: Uklanjanje lokalnog foldera ne utiče na Strapi Cloud instancu

---

## 🔍 MOJA ANALIZA (Nova)

### ✅ Analiza 1: Provera Strukture Projekta

**Akcija**:
```bash
# Provereni fajlovi
- src/api/article/content-types/article/schema.json
- config/api/article/schema.json
- src/components/blog/key-takeaway/schema.json
- src/components/blog/faq-item/schema.json
- package.json
```

**Nalazi**:
- ✅ Svi schema fajlovi postoje i validni su
- ✅ Schema.json fajlovi u `src/api/` i `config/api/` su identični
- ✅ Komponente su pravilno strukturirane
- ❌ **ALI**: Ovo je Next.js projekat, ne Strapi projekat!

---

### ✅ Analiza 2: Identifikacija Arhitekture

**Nalaz**:
```
TRENUTNA ARHITEKTURA:
┌─────────────────────────────────┐
│  odontoa/odontoa-website        │
│  (Next.js Frontend)             │
│  - src/api/article/schema.json  │ ← Schema fajlovi tu
│  - config/api/article/...       │
└─────────────────────────────────┘
         ↓ (REST API pozivi)
┌─────────────────────────────────┐
│  Strapi Cloud                   │
│  (inspiring-chocolate-...)      │
│  - Odvojeni backend             │
│  - NE ČITA fajlove iz Next.js!  │ ← Problem!
└─────────────────────────────────┘
```

**Ključni nalaz**: **Strapi Cloud NE može da čita schema fajlove iz Next.js projekta jer su to dva odvojena projekta!**

---

### ✅ Analiza 3: Strapi Cloud Git Integration

**Pitanja za proveru**:
1. ❓ Da li je Strapi Cloud povezan sa GitHub repo-om?
2. ❓ Ako jeste, koji repo je povezan?
3. ❓ Da li postoji odvojeni `odontoa-strapi-backend` repo?

**Očekivane opcije**:
- **Opcija A**: Strapi Cloud nije povezan sa GitHub-om (ručna konfiguracija)
- **Opcija B**: Strapi Cloud je povezan sa `odontoa/odontoa-website` (pogrešan repo)
- **Opcija C**: Postoji odvojeni Strapi repo ali nije ažuriran

**Preporuka**: Proveri u Strapi Cloud Dashboard → Settings → Git Integration

---

## ✅ REŠENJA - 3 Pristupa

### 🎯 REŠENJE 1: Kreiranje Odvojenog Strapi Backend Repo (DUGOROČNO)

**Prednosti**:
- ✅ Automatski deployment kada push-uješ promene
- ✅ Verzioniranje schema promena
- ✅ CI/CD workflow
- ✅ Tim može da saradjuje na schemi

**Mane**:
- ⏱️ Zahteva vreme za setup (1-2h)
- 🔧 Inicijalna konfiguracija

**Kada koristiti**: Kada želiš profesionalan, održiv setup

**Detaljni koraci**: Vidi `STRAPI_CLOUD_DIJAGNOZA_I_RESENJE.md` → REŠENJE 1

---

### 🎯 REŠENJE 2: Strapi Cloud CLI Transfer (SREDNJE SLOŽENO)

**Prednosti**:
- 🚀 Brže od kreiranja novog repo-a
- 🔄 Možeš export/import schema

**Mane**:
- ❌ Strapi Cloud ne podržava direktan CLI import
- 🔧 Zahteva lokalni Strapi setup
- ⚠️ Nije održivo dugoročno

**Kada koristiti**: Ako ne možeš da kreiraš novi repo ali imaš pristup lokalnoj mašini

**Status**: **NE PREPORUČUJE SE** za Strapi Cloud (bolje za self-hosted Strapi)

---

### 🎯 REŠENJE 3: Ručno Dodavanje Polja (BRZI FALLBACK)

**Prednosti**:
- ⚡ Odmah radi (30 minuta)
- 🎯 Ne zahteva git/deployment setup
- ✅ Testiraš funkcionalnost odmah

**Mane**:
- 🔧 Ručni rad za svaku promenu
- ❌ Nema verzioniranja
- 📝 Moraš da pamtiš šta si dodao

**Kada koristiti**: 
- **ODMAH** - da razblokiraš tim i počneš da koristiš nova polja
- Dok pripremaš dugoročno rešenje (REŠENJE 1)

**Detaljni koraci**: Vidi `STRAPI_CLOUD_DIJAGNOZA_I_RESENJE.md` → REŠENJE 3

---

## 🧪 TEST PLAN - Šta Treba Testirati

### Test 1: Komponente Vidljive u Content-Type Builder

**Očekivani rezultat**:
```
Content-Type Builder → Components → blog
├── key-takeaway
│   └── point (Text, required)
└── faq-item
    ├── question (String, max 200, required)
    └── answer (Text, max 1000, required)
```

**Test komande**:
```bash
# 1. Login u Strapi Cloud admin
# 2. Idi na Content-Type Builder
# 3. Proveri sekciju "Components"
# 4. Verifikuj da postoje blog.key-takeaway i blog.faq-item
```

**Status**: ⏳ Čeka implementaciju

---

### Test 2: Polja Vidljiva u Article Content Type

**Očekivani rezultat**:
```
Content-Type Builder → Article → Fields:
├── ... postojeća polja ...
├── key_takeaways (Component: blog.key-takeaway, repeatable)
├── faq_items (Component: blog.faq-item, repeatable)
├── cta_footer_enabled (Boolean, default: false)
├── cta_footer_headline (String)
├── cta_footer_subtext (Text)
├── cta_footer_button_label (String)
├── cta_footer_button_url (String)
├── seo_title (String)
├── seo_description (Text)
├── og_image (Media: images)
├── breadcrumb_label (String)
├── geo_focus (Enumeration: Srbija, Balkan, Regionalno)
└── structured_data_override (JSON)
```

**Test komande**:
```bash
# 1. Content-Type Builder → Article
# 2. Scroll kroz listu polja
# 3. Verifikuj da sva nova polja postoje
```

**Status**: ⏳ Čeka implementaciju

---

### Test 3: Content Manager - Kreiranje Novog Članka

**Očekivani rezultat**:
- Možeš da klikneš "Create new entry" u Content Manager → Article
- Vidiš sve nove fieldove u formi
- Možeš da dodaš Key Takeaways (repeatable - klikom na "Add an entry")
- Možeš da dodaš FAQ Items (repeatable)
- Možeš da uneseš CTA Footer podatke
- Možeš da uneseš SEO podatke

**Test scenario**:
```
1. Login → Content Manager → Article → Create new entry
2. Popuni osnovne podatke (title, slug, description)
3. Dodaj 2-3 Key Takeaways
4. Dodaj 2-3 FAQ Items
5. Popuni CTA Footer (enable + tekst + button)
6. Popuni SEO polja (title, description)
7. Upload OG image
8. Selektuj Geo Focus (npr. "Srbija")
9. Save as Draft
10. Publish
```

**Validacija**:
- ✅ Sve polja su vidljiva
- ✅ Možeš da dodaš više Key Takeaways/FAQ Items
- ✅ Možeš da save-uješ bez errora
- ✅ Možeš da publish-uješ

**Status**: ⏳ Čeka implementaciju

---

### Test 4: API - Fetch Članka sa Novim Poljima

**Očekivani rezultat**:
API vraća članak sa svim novim poljima populiranim.

**Test komande**:
```bash
# Kreiraj test članak prvo (Test 3)
# Zatim fetch preko API-ja

# Base request (populate all)
curl "https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/api/articles?populate=*" \
  -H "Accept: application/json" | jq

# Specifičan članak
curl "https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/api/articles/1?populate=*" \
  -H "Accept: application/json" | jq

# Eksplicitno populate components
curl "https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/api/articles/1?populate[key_takeaways]=*&populate[faq_items]=*&populate[og_image]=*" \
  -H "Accept: application/json" | jq
```

**Očekivani JSON response**:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Test Članak",
      "slug": "test-clanak",
      "key_takeaways": [
        { "id": 1, "point": "First takeaway" },
        { "id": 2, "point": "Second takeaway" }
      ],
      "faq_items": [
        { "id": 1, "question": "Test pitanje?", "answer": "Test odgovor" }
      ],
      "cta_footer_enabled": true,
      "cta_footer_headline": "Zakažite pregled",
      "seo_title": "Test SEO Title",
      "geo_focus": "Srbija",
      ...
    }
  }
}
```

**Validacija**:
- ✅ Nova polja su prisutna u response-u
- ✅ Components su pravilno populirani
- ✅ JSON struktura je validna

**Status**: ⏳ Čeka implementaciju

---

### Test 5: Next.js Frontend - Render Novih Polja

**Očekivani rezultat**:
Next.js aplikacija može da fetch-uje i renderuje članke sa novim poljima.

**Test fajlovi za proveru**:
```typescript
// src/app/blog2/[slug]/page.tsx ili gde god renderuješ članke

// Primer fetching koda
const article = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`
).then(res => res.json());

// Proveri da možeš da pristupiš:
article.data.attributes.key_takeaways
article.data.attributes.faq_items
article.data.attributes.cta_footer_headline
article.data.attributes.seo_title
```

**Test scenario**:
```bash
# 1. Pokreni Next.js dev server
npm run dev

# 2. Pristupi test članku
# http://localhost:3000/blog2/test-clanak

# 3. Proveri da se renderuju:
#    - Key Takeaways sekcija
#    - FAQ sekcija
#    - CTA Footer (ako enabled)
#    - SEO meta tags u <head>
```

**Validacija**:
- ✅ Članak se učitava bez errora
- ✅ Nova polja su dostupna u response-u
- ✅ UI komponente renderuju nova polja
- ✅ SEO meta tags su pravilni

**Status**: ⏳ Čeka implementaciju

---

## 🐛 DEBUGGING CHECKLIST

Ako nešto ne radi nakon implementacije, proveri sledeće:

### Debug 1: Komponente se ne vide u Content-Type Builder

**Mogući uzroci**:
- ❌ Komponente nisu kreirane
- ❌ Category nije `blog` već nešto drugo
- ❌ Name nije `key-takeaway` / `faq-item` (mora biti dash, ne underscore)

**Rešenje**:
```
1. Proveri Content-Type Builder → Components
2. Ako ne vidiš blog kategoriju, kreiraj komponente ispočetka
3. Prati tačno imena iz schema.json
```

---

### Debug 2: Polja su dodata ali ne vide se u Content Manager

**Mogući uzroci**:
- ❌ Strapi server nije restartovan
- ❌ Browser cache je stari

**Rešenje**:
```
1. U Strapi Cloud: Trigger novi deployment
2. Clear browser cache: Ctrl+Shift+R (force refresh)
3. Logout pa login ponovo u admin panel
```

---

### Debug 3: API ne vraća nova polja

**Mogući uzroci**:
- ❌ Permissions nisu podešeni (Public role)
- ❌ Populate parametar nije korišćen

**Rešenje**:
```
1. Settings → Roles → Public → Article
2. Omogući find i findOne checkbox-ove
3. Save
4. Test sa curl i populate=*
```

---

### Debug 4: Next.js ne vidi nova polja

**Mogući uzroci**:
- ❌ Stari cached response
- ❌ Pogrešan Strapi URL
- ❌ API vraća polja ali Next.js ne renderuje

**Rešenje**:
```typescript
// 1. Dodaj console.log za debug
console.log('Article data:', article);

// 2. Proveri da li polja postoje
console.log('Key takeaways:', article?.data?.attributes?.key_takeaways);

// 3. Restartuj Next.js dev server
npm run dev

// 4. Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📊 TRACKING - Šta Je Urađeno

### ✅ Completed:
- [x] Analiza trenutne arhitekture projekta
- [x] Identifikacija root cause problema
- [x] Kreiran dijagnoza i rešenje dokument
- [x] Kreiran test plan i istorija
- [x] Definisana 3 rešenja sa pro/cons

### ⏳ In Progress:
- [ ] Implementacija odabranog rešenja
- [ ] Testiranje u Strapi Cloud admin panelu
- [ ] Verifikacija API response-a

### 🔜 Next Steps:
- [ ] **ODMAH**: Implementiraj REŠENJE 3 (ručno dodavanje) za brzi unblock
- [ ] **OVA NEDELJA**: Implementiraj REŠENJE 1 (odvojeni Strapi repo) za dugoročno
- [ ] **NAKON TOGA**: Migracija postojećih članaka sa novim poljima

---

## 🎯 METRICS - Šta Merimo Kao Uspeh

### Success Criteria:

1. **Admin Panel**:
   - ✅ Sva nova polja vidljiva u Content-Type Builder
   - ✅ Komponente (key-takeaway, faq-item) kreirane i vidljive
   - ✅ Content Manager prikazuje sva nova polja pri kreiranju članka

2. **API**:
   - ✅ GET `/api/articles?populate=*` vraća nova polja
   - ✅ Response time < 500ms (Strapi Cloud free tier)
   - ✅ JSON struktura validna (testirati sa JSON validator)

3. **Next.js Frontend**:
   - ✅ Blog stranica renderuje članke sa novim poljima
   - ✅ Key Takeaways i FAQ komponente se prikazuju
   - ✅ CTA Footer se prikazuje kada je enabled
   - ✅ SEO meta tags pravilno generisani

4. **Deployment Workflow**:
   - ✅ Git push → automatski Strapi Cloud deployment (ako REŠENJE 1)
   - ✅ Schema promene automatski primenjene nakon deploya
   - ✅ Deployment time < 5 minuta

---

## 📞 ESKALACIJA - Kada Kontaktirati Strapi Support

Ako nakon implementacije REŠENJA 1 i REŠENJA 3 i dalje ne radi:

### Informacije za Strapi Support:

**Subject**: Schema sync not working on Strapi Cloud - new fields not visible

**Body**:
```
Hi Strapi Team,

I'm having issues with schema synchronization on Strapi Cloud.

Project Details:
- Strapi Cloud URL: https://inspiring-chocolate-0dd8ffdae3.strapiapp.com
- Project ID: [find in Settings → General]
- Plan: Free

Issue:
I've added new fields to the Article content type and components (key-takeaway, faq-item) 
but they are not appearing in the Content-Type Builder after deployment.

What I've tried:
1. Created schema.json files in correct structure
2. Pushed to main branch
3. Triggered manual deployment (successful)
4. Cleared cache and rebuild
5. Manually added fields via Content-Type Builder UI

Schema files:
- src/api/article/content-types/article/schema.json
- src/components/blog/key-takeaway/schema.json
- src/components/blog/faq-item/schema.json

GitHub repo: odontoa/odontoa-strapi-backend

Deployment logs: [attach logs from Strapi Cloud → Deployments]

Can you please help identify why schema changes are not being applied?

Thank you!
```

**Attach**:
- Screenshot of Content-Type Builder (showing missing fields)
- Screenshot of Deployment logs
- Copy of schema.json files

---

## 🔄 ITERACIJA - Kako Upravljati Schema Promenama Ubuduće

### Workflow za Dodavanje Novih Polja (kada je REŠENJE 1 implementirano):

```bash
# 1. Kloniraj Strapi backend repo
cd ~/Desktop
git clone git@github.com:odontoa/odontoa-strapi-backend.git
cd odontoa-strapi-backend

# 2. Pokreni lokalno Strapi
npm install
npm run develop

# 3. Dodaj novo polje preko UI-ja (Content-Type Builder)
# Strapi automatski ažurira schema.json fajlove

# 4. Commit i push
git add src/api/article/content-types/article/schema.json
git commit -m "feat: add new field to Article"
git push origin main

# 5. Strapi Cloud automatski deploy-uje
# Proveri: Strapi Cloud Dashboard → Deployments

# 6. Test u admin panelu
# Proveri: Content Manager → Article → Create new entry

# 7. Update Next.js frontend da koristi novo polje
cd ~/Desktop/odontoa-website
# Update komponente da renderuju novo polje
git add .
git commit -m "feat: render new field from Strapi"
git push origin main
```

### Best Practices:

1. **Lokalni development prvo**:
   - Dodaj polje lokalno u Strapi (Content-Type Builder)
   - Testiraj da radi
   - Commit schema.json promene

2. **Verzioniranje**:
   - Svaka schema promena = novi commit
   - Commit message: `feat: add [field_name] to [content_type]`
   - Ne radi multiple schema promene u jednom commit-u

3. **Testing**:
   - Testiraj lokalno prvo
   - Zatim deploy na Strapi Cloud
   - Zatim ažuriraj Next.js frontend

4. **Documentation**:
   - Dokumentuj nove fieldove u README.md
   - Dodaj opis šta svako polje radi
   - Napravi screenshot UI-ja sa novim poljima

---

## 📚 REFERENCE LINKOVI

### Strapi Dokumentacija:
- [Content-Type Builder](https://docs.strapi.io/user-docs/content-type-builder)
- [Components Guide](https://docs.strapi.io/user-docs/content-type-builder/creating-components)
- [Strapi Cloud Deployment](https://docs.strapi.io/cloud/getting-started/deployment)
- [Git Integration](https://docs.strapi.io/cloud/projects/deploys)

### Debugging Resources:
- [Strapi Troubleshooting](https://docs.strapi.io/dev-docs/troubleshooting)
- [Content API Populate](https://docs.strapi.io/dev-docs/api/rest/populate-select)
- [Strapi Community Forum](https://forum.strapi.io/)

### Tools:
- [JSON Validator](https://jsonlint.com/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Postman for API testing](https://www.postman.com/)

---

## 📝 CHANGELOG

### 2025-10-28 - Initial Analysis
- ✅ Identifikovan glavni problem (arhitekturna nekompatibilnost)
- ✅ Kreirana 3 rešenja
- ✅ Napravljen test plan
- ✅ Dokumentovan troubleshooting proces

### [Datum] - Implementation Started
- [ ] Started REŠENJE 3 (ručno dodavanje)
- [ ] Created components in Strapi Cloud
- [ ] Added fields to Article content type

### [Datum] - Testing
- [ ] Test 1: Komponente vidljive ✅/❌
- [ ] Test 2: Polja vidljiva u Article ✅/❌
- [ ] Test 3: Content Manager funkcionalan ✅/❌
- [ ] Test 4: API vraća nova polja ✅/❌
- [ ] Test 5: Next.js renderuje nova polja ✅/❌

### [Datum] - Long-term Setup
- [ ] Started REŠENJE 1 (odvojeni repo)
- [ ] Created odontoa-strapi-backend repo
- [ ] Connected to Strapi Cloud
- [ ] Automated deployment working

---

**Status**: 🔬 Analiza završena → ⏳ Čeka implementaciju → 🎯 Spremno za testiranje

