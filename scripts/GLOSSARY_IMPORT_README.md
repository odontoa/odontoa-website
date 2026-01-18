# 📖 Glossary Terms Import Guide

## ⚠️ VAŽNO: Schema Sync

**Ovaj script MORA biti ažuriran kada se menja `sanity/schemaTypes/glossaryTerm.ts`!**

Pre bilo koje promene u schema, proveri:
- 📋 `scripts/SCHEMA_SYNC_CHECKLIST.md` - detaljna checklist
- 🔄 Ažuriraj `scripts/importGlossaryTerms.ts` pre svake promene schema

## Kako koristiti import script

### 1. Priprema JSON fajla

Kreiraj JSON fajl sa pojmovima u formatu iz `glossary-terms-template.json`:

```json
[
  {
    "term": "Naziv termina",
    "slug": "naziv-termina", // opciono, automatski se generiše ako nije naveden
    "definition": "Kratka definicija (60-200 karaktera)",
    "category": "Opšta stomatologija", // opciono
    "fullArticle": "Detaljno objašnjenje...", // opciono
    "seoTitle": "SEO naslov", // opciono
    "metaDescription": "SEO opis", // opciono
    "noindex": false // opciono, default false
  }
]
```

### 2. Validne kategorije

- `Opšta stomatologija`
- `Preventivna i dečja stomatologija`
- `Bolesti zuba i endodoncija`
- `Stomatološka protetika`
- `Parodontologija i oralna medicina`
- `Ortopedija vilica (Ortodoncija)`
- `Oralna hirurgija`
- `Maksilofacijalna hirurgija`

### 3. Pokretanje importa

```bash
npm run import:glossary <path-to-json-file> [--dry-run]
```

**Primeri:**
```bash
# Real import
npm run import:glossary scripts/my-glossary-terms.json

# Dry-run (simulacija bez promena)
npm run import:glossary -- --dry-run scripts/my-glossary-terms.json
```

**Dry-run mod:**
- Simulira import bez pisanja u Sanity
- Prikazuje koliko bi se kreirało, ažuriralo ili preskočilo
- Korisno za proveru pre importa velikog broja termina (300-1000+)
- Prikazuje koja polja bi se menjala za update slučajeve

### 4. Rezultat

Script će:
- ✅ Validirati sve termine pre importa
- ✅ Kreirati termine koji ne postoje
- ✅ Preskočiti termine koji već postoje (bez duplikata)
- ✅ Prikazati summary sa brojem kreiranih/preskočenih/errora

## Obavezna polja

- `term` - Naziv termina (obavezno)
- `definition` - Kratka definicija (obavezno, 60-200 karaktera)

## Opciona polja

- `slug` - URL-friendly verzija (auto-generiše se ako nije naveden)
- `category` - Kategorija termina
- `fullArticle` - Detaljno objašnjenje (plain text, konvertuje se u PortableText)
- `seoTitle` - SEO naslov
- `metaDescription` - SEO opis
- `noindex` - Da li da se indeksira (default: false)

## Primer za 300 pojmova

Kada budeš spreman da dodaš 300 pojmova:

1. Pripremi JSON fajl sa svim pojmovima
2. Proveri da svi imaju `term` i `definition` (60-200 karaktera)
3. Pokreni: `npm run import:glossary scripts/glossary-300-terms.json`
4. Script će automatski:
   - Validirati sve
   - Kreirati sve koji ne postoje
   - Preskočiti duplikate

## Sigurnost

- Script koristi `createIfNotExists` - bezbedno za re-run
- Deterministički `_id` baziran na slug-u - nema duplikata
- Validacija pre importa - greške se hvataju rano
- Sve polja se automatski popunjavaju (publishedAt, updatedAt, itd.)

### Token Security

**⚠️ VAŽNO: Token Hygiene**

- `SANITY_WRITE_TOKEN` se koristi **samo** u import script-u, nikad u runtime kodu
- **Posle importa, rotiraj ili obriši token** za maksimalnu sigurnost
- Token nikad ne ide u version control (`.env.local` je u `.gitignore`)
- Ako token bude kompromitovan, odmah ga revokuj u Sanity dashboard-u

**Kako rotirati token:**
1. Idite u [Sanity Manage](https://sanity.io/manage)
2. Odaberite projekat
3. API → Tokens
4. Obrišite stari token
5. Kreirajte novi token sa "Editor" permissions
6. Ažurirajte `SANITY_WRITE_TOKEN` u `.env.local`

## Troubleshooting

**Error: Missing SANITY_WRITE_TOKEN**
- Dodaj `SANITY_WRITE_TOKEN` u `.env.local`
- Token mora imati "Editor" permissions u Sanity dashboard-u
- Token se koristi **samo** za import script, nikad u runtime kodu

**Error: Definition too short/long**
- Definition mora biti između 60 i 200 karaktera
- Proveri sve termine u JSON fajlu

**Error: Invalid category**
- Koristi samo validne kategorije iz liste
- Ili ostavi prazno (bez kategorije)
