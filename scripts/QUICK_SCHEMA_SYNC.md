# ⚡ Quick Schema Sync Reference

**Brza provera: Da li je import script usklađen sa schema?**

## 🔍 30-sekundna provera

1. Otvori `sanity/schemaTypes/glossaryTerm.ts`
2. Proveri da li imaš novo polje koje nije u `scripts/importGlossaryTerms.ts`?
3. Ako DA → Otvori `scripts/SCHEMA_SYNC_CHECKLIST.md` i prati korake

## 📋 Trenutna usklađenost

### ✅ Podržana polja u import script-u:
- `term` ✅ (REQUIRED)
- `slug` ✅ (REQUIRED, auto-generated)
- `definition` ✅ (REQUIRED, 60-200 chars)
- `category` ✅ (OPTIONAL)
- `fullArticle` ✅ (OPTIONAL, plain text → PortableText)
- `seoTitle` ✅ (OPTIONAL, max 60)
- `metaDescription` ✅ (OPTIONAL, max 160)
- `noindex` ✅ (OPTIONAL, default false)
- `publishedAt` ✅ (REQUIRED, auto-set)
- `updatedAt` ✅ (auto-set)

### ⚠️ NISU podržana polja (zahtevaju reference/slike):
- `tags` ❌ (array of references)
- `relatedTerms` ❌ (array of references)
- `author` ❌ (reference)
- `authorUrl` ❌ (url)
- `coverImage` ❌ (image upload)
- `coverImageAlt` ❌ (string, zahteva coverImage)
- `canonicalUrl` ❌ (url)
- `faqs` ❌ (complex structure)

## 🚨 Ako dodaješ novo polje

### Obavezno polje (required):
```typescript
// 1. U importGlossaryTerms.ts - GlossaryTermInput
interface GlossaryTermInput {
  newField: string; // REQUIRED
}

// 2. U validateTerm()
if (!termData.newField) {
  errors.push(`[${index}] Missing 'newField' (REQUIRED)`);
}

// 3. U createTermDocument()
const doc = {
  // ...
  newField: termData.newField, // REQUIRED
};
```

### Opciono polje (optional):
```typescript
// 1. U importGlossaryTerms.ts - GlossaryTermInput
interface GlossaryTermInput {
  newField?: string; // OPTIONAL
}

// 2. U createTermDocument()
if (termData.newField) {
  doc.newField = termData.newField;
}
```

## 📝 Fajlovi za ažuriranje

Kada menjaš schema, ažuriraj:
1. ✅ `sanity/schemaTypes/glossaryTerm.ts` (schema)
2. ✅ `scripts/importGlossaryTerms.ts` (import logic)
3. ✅ `scripts/glossary-terms-template.json` (template)
4. ✅ `scripts/GLOSSARY_IMPORT_README.md` (docs)
5. ✅ `scripts/SCHEMA_SYNC_CHECKLIST.md` (checklist)

## 🔗 Detaljna dokumentacija

Za detaljne korake, vidi: `scripts/SCHEMA_SYNC_CHECKLIST.md`
