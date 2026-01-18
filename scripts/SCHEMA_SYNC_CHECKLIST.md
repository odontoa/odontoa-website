# 🔄 Schema Sync Checklist

**VAŽNO:** Svaki put kada se menja `sanity/schemaTypes/glossaryTerm.ts`, **MORA** se ažurirati i `scripts/importGlossaryTerms.ts`.

## ✅ Checklist za promene u Schema

Kada dodaješ/uklanjaš/menjaš polja u `glossaryTerm.ts`, proveri:

### 1. Obavezna polja (required)
- [ ] Dodato u `GlossaryTermInput` interface?
- [ ] Dodato u `validateTerm()` funkciju?
- [ ] Dodato u `createTermDocument()` funkciju?
- [ ] Dodato u template JSON (`glossary-terms-template.json`)?
- [ ] Ažuriran README sa novim obaveznim poljem?

### 2. Opciona polja (optional)
- [ ] Dodato u `GlossaryTermInput` interface?
- [ ] Dodato u `createTermDocument()` funkciju (sa proverom `if (termData.field)`)?
- [ ] Dodato u template JSON kao opciono?
- [ ] Ažuriran README sa novim opcionim poljem?

### 3. Validacija
- [ ] Dodata validacija u `validateTerm()` ako je potrebna?
- [ ] Dodata u `VALID_CATEGORIES` ako je kategorija?
- [ ] Dodata provera dužine/format ako je potrebna?

### 4. Konverzija tipova
- [ ] Ako je `fullArticle` ili slično (PortableText), da li je konverzija dodata?
- [ ] Ako je `date` ili `datetime`, da li se pravilno parsira?
- [ ] Ako je `reference`, da li se pravilno kreira?

### 5. Dokumentacija
- [ ] Ažuriran `scripts/GLOSSARY_IMPORT_README.md`?
- [ ] Ažuriran `scripts/glossary-terms-template.json`?
- [ ] Dodat komentar u script-u gde je promena?

## 📋 Trenutna polja u Schema

### Obavezna polja
- ✅ `term` (string, required)
- ✅ `slug` (slug, required, auto-generated)
- ✅ `definition` (text, required, 60-200 chars)
- ✅ `publishedAt` (datetime, required, auto-set)

### Opciona polja
- ✅ `category` (string, from list)
- ✅ `fullArticle` (array of blocks, converted from plain text)
- ✅ `seoTitle` (string, max 60)
- ✅ `metaDescription` (text, max 160)
- ✅ `noindex` (boolean, default false)
- ⚠️ `tags` (array of references) - **NISU podržani u import script-u**
- ⚠️ `relatedTerms` (array of references) - **NISU podržani u import script-u**
- ⚠️ `author` (reference) - **NISU podržani u import script-u**
- ⚠️ `authorUrl` (url) - **NISU podržani u import script-u**
- ⚠️ `coverImage` (image) - **NISU podržani u import script-u**
- ⚠️ `coverImageAlt` (string) - **NISU podržani u import script-u**
- ⚠️ `canonicalUrl` (url) - **NISU podržani u import script-u**
- ⚠️ `faqs` (array) - **NISU podržani u import script-u**
- ⚠️ `updatedAt` (datetime) - **Auto-set, ne treba u JSON-u**

## 🚨 Polja koja NISU podržana u import script-u

Ova polja se **ne mogu** importovati kroz JSON (zahtevaju reference ili slike):
- `tags` - zahteva reference na tag dokumente
- `relatedTerms` - zahteva reference na druge glossary term dokumente
- `author` - zahteva reference na author dokumente
- `coverImage` - zahteva upload slike
- `faqs` - kompleksna struktura, bolje kroz Studio

**Ako treba da se dodaju:**
1. Dodaj u `GlossaryTermInput` interface
2. Implementiraj logiku za kreiranje reference/upload
3. Ažuriraj dokumentaciju

## 🔍 Kako proveriti da li je sve usklađeno

1. Otvori `sanity/schemaTypes/glossaryTerm.ts`
2. Proveri sva polja u `fields` array
3. Otvori `scripts/importGlossaryTerms.ts`
4. Proveri da li su sva obavezna polja u:
   - `GlossaryTermInput` interface
   - `validateTerm()` funkciji
   - `createTermDocument()` funkciji
5. Proveri da li su sva opciona polja u:
   - `GlossaryTermInput` interface
   - `createTermDocument()` funkciji (sa `if` proverom)

## 📝 Primer: Kako dodati novo polje

### Scenario: Dodaješ novo polje `exampleField` (string, optional)

1. **U Schema** (`glossaryTerm.ts`):
```typescript
defineField({
  name: "exampleField",
  title: "Example Field",
  type: "string",
})
```

2. **U Import Script** (`importGlossaryTerms.ts`):

a) Dodaj u interface:
```typescript
interface GlossaryTermInput {
  // ... postojeća polja
  exampleField?: string;
}
```

b) Dodaj u `createTermDocument()`:
```typescript
if (termData.exampleField) {
  doc.exampleField = termData.exampleField.trim();
}
```

c) Dodaj u template JSON:
```json
{
  "term": "...",
  "exampleField": "example value" // opciono
}
```

3. **Ažuriraj README** sa novim poljem

4. **Označi u checklist-u** da je završeno ✅
