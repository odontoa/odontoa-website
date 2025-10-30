# 🚀 BRZI VODIČ - Ručno Dodavanje Polja u Strapi Cloud

## ⏱️ Vreme: 30 minuta
## 🎯 Cilj: Odmah razblokirati tim da može da koristi nova polja

---

## 📋 PRE NEGO ŠTO POČNEŠ

**Potrebno ti je**:
- ✅ Pristup Strapi Cloud admin panelu
- ✅ URL: https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/admin
- ✅ Admin kredencijali (email/password)

**Proveri**:
- [ ] Možeš da se uloguješ
- [ ] Vidiš "Content-Type Builder" u levom sidebaru
- [ ] Imaš admin permisije

---

## KORAK 1: Kreiraj Key Takeaway Komponentu (5 min)

### 1.1. Otvori Content-Type Builder
- Klikni **"Content-Type Builder"** u levom sidebaru
- Scroll dole do sekcije **"COMPONENTS"**

### 1.2. Kreiraj novu komponentu
- Klikni **"Create new component"** (plavi dugme)

### 1.3. Popuni detalje
```
Display name:     Key Takeaway
Category:         blog
Icon:             (izaberi neki icon, nije bitno)
```

- Klikni **"Continue"**

### 1.4. Dodaj polje "point"
- Type: **Text** (klikni na "Text" ikonicu)
- Name: `point`
- Type: **Long text**
- Advanced settings:
  - Required field: ✅ (čekiraj)
- Klikni **"Finish"**

### 1.5. Sačuvaj
- Klikni **"Save"** (zeleni dugme desno gore)

**✅ Checkpoint**: Proveri da vidiš `blog.key-takeaway` u sekciji Components

---

## KORAK 2: Kreiraj FAQ Item Komponentu (5 min)

### 2.1. Ponovi proces
- Content-Type Builder → **"Create new component"**

### 2.2. Popuni detalje
```
Display name:     FAQ Item
Category:         blog
Icon:             (izaberi neki icon)
```

- Klikni **"Continue"**

### 2.3. Dodaj prvo polje "question"
- Type: **Text** (klikni na "Text" ikonicu, ali izaberi **Short text**)
- Name: `question`
- Type: **Short text**
- Advanced settings:
  - Required field: ✅
  - Maximum length: `200`
- Klikni **"Add another field"** (ne "Finish" još!)

### 2.4. Dodaj drugo polje "answer"
- Type: **Text** (izaberi **Long text**)
- Name: `answer`
- Type: **Long text**
- Advanced settings:
  - Required field: ✅
  - Maximum length: `1000`
- Klikni **"Finish"**

### 2.5. Sačuvaj
- Klikni **"Save"** (zeleni dugme)

**✅ Checkpoint**: Proveri da vidiš `blog.faq-item` u sekciji Components

---

## KORAK 3: Dodaj Polja u Article Content Type (15 min)

### 3.1. Otvori Article za edit
- Content-Type Builder → Scroll gore do **"COLLECTION TYPES"**
- Klikni na **"Article"**
- Desno će se otvoriti lista postojećih polja

### 3.2. Dodaj Key Takeaways polje

**Klikni "Add another field"**

- Type: **Component** (ikonfica sa kockicama)
- Popup će se otvoriti:
  ```
  Name:              key_takeaways
  Select a component: blog.key-takeaway
  Type:              ✅ Repeatable component (NE Single component!)
  ```
- Advanced settings:
  - Required field: ❌ (NE čekiraj, nije required)
- Klikni **"Finish"**

### 3.3. Dodaj FAQ Items polje

**Klikni "Add another field"** (ponovo)

- Type: **Component**
- Popup:
  ```
  Name:              faq_items
  Select a component: blog.faq-item
  Type:              ✅ Repeatable component
  ```
- Required field: ❌
- Klikni **"Finish"**

### 3.4. Dodaj CTA Footer polja

**Dodaj 5 polja (jedan po jedan)**:

**1. cta_footer_enabled**
- Type: **Boolean**
- Name: `cta_footer_enabled`
- Default value: `false`
- Klikni **"Finish"**

**2. cta_footer_headline**
- Type: **Text** → **Short text**
- Name: `cta_footer_headline`
- Klikni **"Finish"**

**3. cta_footer_subtext**
- Type: **Text** → **Long text**
- Name: `cta_footer_subtext`
- Klikni **"Finish"**

**4. cta_footer_button_label**
- Type: **Text** → **Short text**
- Name: `cta_footer_button_label`
- Klikni **"Finish"**

**5. cta_footer_button_url**
- Type: **Text** → **Short text**
- Name: `cta_footer_button_url`
- Klikni **"Finish"**

### 3.5. Dodaj SEO polja

**1. seo_title**
- Type: **Text** → **Short text**
- Name: `seo_title`
- Klikni **"Finish"**

**2. seo_description**
- Type: **Text** → **Long text**
- Name: `seo_description`
- Klikni **"Finish"**

**3. og_image**
- Type: **Media** (slika ikonfica)
- Name: `og_image`
- Type: **Single media**
- Advanced settings:
  - Allowed types: ✅ Images (samo čekiraj Images)
- Klikni **"Finish"**

### 3.6. Dodaj ostala polja

**1. breadcrumb_label**
- Type: **Text** → **Short text**
- Name: `breadcrumb_label`
- Klikni **"Finish"**

**2. geo_focus**
- Type: **Enumeration** (dropdown ikonfica)
- Name: `geo_focus`
- Values (dodaj jednu po jednu):
  - `Srbija`
  - `Balkan`
  - `Regionalno`
- Klikni **"Finish"**

**3. structured_data_override**
- Type: **JSON**
- Name: `structured_data_override`
- Klikni **"Finish"**

### 3.7. SAČUVAJ SVE

**⚠️ VAŽNO**: Klikni **"Save"** dugme (zeleni, desno gore)

- Strapi će možda prikazati poruku o restartu
- Klikni **"Confirm"** ili **"Yes, restart"**
- Sačekaj 30-60 sekundi

**✅ Checkpoint**: Proveri da vidiš sva nova polja u Article listi polja

---

## KORAK 4: Proveri u Content Manager (3 min)

### 4.1. Otvori Content Manager
- Klikni **"Content Manager"** u levom sidebaru
- Klikni na **"Article"** (pod Collection types)

### 4.2. Kreiraj test entry
- Klikni **"Create new entry"** (plavi dugme desno gore)

### 4.3. Scroll i proveri nova polja
Trebalo bi da vidiš:
- [ ] **Key Takeaways** sekciju (sa "Add an entry" dugmetom)
- [ ] **FAQ Items** sekciju (sa "Add an entry" dugmetom)
- [ ] **CTA Footer** polja (enabled, headline, subtext, button label, button url)
- [ ] **SEO** polja (seo_title, seo_description, og_image upload)
- [ ] **Breadcrumb Label** polje
- [ ] **Geo Focus** dropdown (Srbija, Balkan, Regionalno)
- [ ] **Structured Data Override** JSON editor

### 4.4. Testiraj Key Takeaways
- Klikni **"Add an entry"** pod Key Takeaways
- Unesi neki tekst u "Point" polje
- Klikni **"Add an entry"** ponovo
- Unesi još jedan point
- Trebalo bi da vidiš 2 entry-ja

### 4.5. Testiraj FAQ Items
- Klikni **"Add an entry"** pod FAQ Items
- Unesi "Question" i "Answer"
- Dodaj još jedan FAQ item

**✅ Checkpoint**: Ako možeš da dodaš Key Takeaways i FAQ Items, sve radi!

---

## KORAK 5: Kreiraj Test Članak (5 min)

### 5.1. Popuni osnovne podatke
```
Title:        Test Članak - Nova Polja
Slug:         test-clanak-nova-polja (automatski)
Description:  Test description za proveru novih polja
```

### 5.2. Dodaj Key Takeaways (2-3)
```
Point 1: Ovo je prvi key takeaway
Point 2: Ovo je drugi key takeaway
Point 3: Ovo je treći key takeaway
```

### 5.3. Dodaj FAQ Items (2-3)
```
FAQ 1:
  Question: Kako da zakažem pregled?
  Answer: Pozovite nas na 011-123-4567 ili zakažite online.

FAQ 2:
  Question: Da li prihvatate osiguranje?
  Answer: Da, prihvatamo sve vrste zdravstvenog osiguranja.
```

### 5.4. Popuni CTA Footer
```
CTA Footer Enabled:        ✅ (čekiraj)
CTA Footer Headline:       Zakažite besplatan pregled
CTA Footer Subtext:        Pozovite nas danas i saznajte kako možemo pomoći
CTA Footer Button Label:   Zakažite sada
CTA Footer Button URL:     /kontakt
```

### 5.5. Popuni SEO polja
```
SEO Title:        Test Članak - Dentista Blog
SEO Description:  Ovo je test članak za proveru novih SEO polja u Strapi CMS-u
```

### 5.6. Selektuj Geo Focus
```
Geo Focus:  Srbija
```

### 5.7. Save
- **NE publikuj još!** Samo **"Save"** (čuva kao Draft)
- Klikni **"Save"** dugme

**✅ Checkpoint**: Članak je sačuvan bez errora

---

## KORAK 6: Proveri API Response (3 min)

### 6.1. Publish test članak
- Otvori test članak koji si kreirao
- Klikni **"Publish"** dugme (desno gore)
- Confirm

### 6.2. Testiraj API sa curl

Otvori terminal i pokreni:

```bash
curl "https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/api/articles?populate=*" | jq
```

**Ako nemaš jq** (prettify JSON):
```bash
curl "https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/api/articles?populate=*"
```

### 6.3. Proveri response

Trebalo bi da vidiš JSON sa:
```json
{
  "data": [
    {
      "id": ...,
      "attributes": {
        "title": "Test Članak - Nova Polja",
        "key_takeaways": [
          { "id": 1, "point": "Ovo je prvi key takeaway" },
          ...
        ],
        "faq_items": [
          {
            "id": 1,
            "question": "Kako da zakažem pregled?",
            "answer": "Pozovite nas na..."
          },
          ...
        ],
        "cta_footer_enabled": true,
        "cta_footer_headline": "Zakažite besplatan pregled",
        "seo_title": "Test Članak - Dentista Blog",
        "geo_focus": "Srbija",
        ...
      }
    }
  ]
}
```

**✅ Checkpoint**: Ako vidiš nova polja u JSON-u, sve radi! 🎉

---

## KORAK 7: Proveri Permissions (VAŽNO!)

### 7.1. Otvori Settings
- Klikni **"Settings"** (ikonfica zupčanika u levom sidebaru)

### 7.2. Otvori Roles
- U sekciji **"USERS & PERMISSIONS PLUGIN"**
- Klikni **"Roles"**

### 7.3. Edituj Public role
- Klikni na **"Public"**

### 7.4. Omogući Article permissions
- Scroll do sekcije **"Article"**
- Čekiraj:
  - [ ] **find** (GET /articles)
  - [ ] **findOne** (GET /articles/:id)
- Klikni **"Save"** (desno gore)

**✅ Checkpoint**: Sada Next.js frontend može da fetch-uje članke

---

## 🎉 GOTOVO!

### Šta si postigao:
- ✅ Kreirao `blog.key-takeaway` komponentu
- ✅ Kreirao `blog.faq-item` komponentu
- ✅ Dodao sva nova polja u Article content type
- ✅ Kreirao i objavio test članak
- ✅ Verifikovao da API vraća nova polja
- ✅ Omogućio public pristup za frontend

---

## 🔜 SLEDEĆI KORACI

### Odmah (danas):
1. **Obavesti tim** da mogu da počnu da kreiraju članke sa novim poljima
2. **Test u Next.js frontend-u** - proveri da se nova polja renderuju

### Ova nedelja:
1. **Implementiraj REŠENJE 1** (odvojeni Strapi repo) za dugoročno
   - Pokreni: `./create-strapi-backend.sh`
   - Prati korake iz output-a
2. **Povezaš Strapi Cloud sa novim repo-om**
3. **Sve buduće promene radiš preko git-a**, ne ručno

---

## ⚠️ VAŽNE NAPOMENE

### Limitacije Ručnog Pristupa:
- 🔄 **Svaka promena** mora da se radi ručno u UI-ju
- 📝 **Nema verzioniranja** - teže je da trackaš promene
- 👥 **Tim koordinacija** - teže je da svi znaju šta je dodato

### Prednosti:
- ⚡ **Brzo** - odmah radi
- 🎯 **Jednostavno** - ne treba git/deployment setup
- ✅ **Testiraš funkcionalnost** pre nego što implementiraš pravi setup

---

## 🆘 AKO NEŠTO KRENE LOŠE

### Problem: Ne mogu da kreiram komponentu
**Rešenje**: Proveri da li već postoji komponenta sa istim imenom
- Content-Type Builder → Components
- Ako postoji, obriši je i kreiraj ispočetka

### Problem: Komponente nisu vidljive u Article
**Rešenje**: Proveri Category
- Mora biti tačno `blog` (malo slovo, bez space-ova)
- Ime mora biti `key-takeaway` i `faq-item` (sa crticom, ne underscore)

### Problem: Polja su dodata ali ne vide se u Content Manager
**Rešenje**: Restart Strapi
- Trigger novi deployment u Strapi Cloud Dashboard
- Sačekaj 2-3 minuta
- Clear browser cache: Ctrl+Shift+R (ili Cmd+Shift+R na Mac-u)
- Logout pa login ponovo

### Problem: API ne vraća nova polja
**Rešenje**: Proveri permissions
- Settings → Roles → Public → Article
- Omogući `find` i `findOne`
- Save

### Problem: Repeatable component je Single umesto Repeatable
**Rešenje**: Obriši polje i dodaj ponovo
- Article → Klikni na polje → Edit
- Možda ima opciju da promeniš tip
- Ako nema, obriši polje (klikni na trash ikonicu) i dodaj ponovo kao Repeatable

---

## 📚 REFERENCE

### Dokumentacija:
- [Strapi Components Guide](https://docs.strapi.io/user-docs/content-type-builder/creating-components)
- [Content-Type Builder](https://docs.strapi.io/user-docs/content-type-builder)

### Pomoć:
- Pogledaj: `STRAPI_CLOUD_DIJAGNOZA_I_RESENJE.md`
- Pogledaj: `STRAPI_TROUBLESHOOTING_HISTORY.md`

---

**✨ Srećno! Ako zapneš, javi se! 🚀**

