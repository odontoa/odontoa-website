# Rečnik: format za import

> Tehnički contract (polja, tipovi, enumi, validacija). **Pravila sadržaja** (izvori, aliasi, MeSH, tok objave, kanibalizacija, procedura importa) su u [`RECNIK_CONTENT_RULES.md`](./RECNIK_CONTENT_RULES.md), koji je obavezan pre svakog unosa ili importa.

Rečnik je code-driven. Izvor istine su TypeScript fajlovi u repou, ne Sanity. Pojmovi se unose iz JSON exporta (npr. iz Excel/JSON research mastera) skriptom koja validira podatke i upisuje ih u repo.

```
src/lib/content/recnik/
  types.ts            tipovi (RecnikTerm, RecnikSource, RecnikReviewer, ...)
  categories.ts       registar kategorija (RECNIK_CATEGORIES)
  ctas.ts             registar završnih CTA-ova
  data/sources.ts     registar izvora            (generiše import)
  data/reviewers.ts   registar recenzenata        (generiše import)
  data/terms/<categoryId>.ts   pojmovi po kategoriji (generiše import)
  data/terms/index.ts          spisak fajlova       (generiše import)
  index.ts            javni API (jedini modul koji sajt uvozi)
  validate.ts         pravila validacije
  import-schema.ts    zod šema ovog formata
```

## Tok rada

```bash
npm run recnik:import -- putanja/export.json --dry-run   # provera i izveštaj, bez upisa
npm run recnik:import -- putanja/export.json             # upis (staje na svaki konflikt)
npm run recnik:import -- putanja/export.json --overwrite # postojeći id-jevi se zamenjuju
npm run recnik:validate                                  # ista provera koja radi u build-u
npm run build
```

Import:
1. proverava oblik JSON-a (nepoznata polja su greška, da se greška u nazivu polja ne izgubi);
2. spaja ulaz sa postojećim podacima po `id`-ju. Isti sadržaj se preskače. Drugačiji sadržaj je **konflikt** i ništa se ne upisuje bez `--overwrite`. Slug koji već koristi drugi pojam je uvek greška;
3. validira ceo spojeni dataset. Bilo koja greška znači da se ništa ne upisuje;
4. upisuje fajlove. Termin, definicija i tekst se **nikad** ne menjaju niti „ispravljaju“.

Build (`prebuild` i `generateStaticParams`) pokreće isti validator. Dataset sa greškom ne može da se deploy-uje.

## Struktura fajla

```json
{
  "sources":   [ /* RecnikSource */ ],
  "reviewers": [ /* RecnikReviewer */ ],
  "terms":     [ /* RecnikTerm */ ]
}
```

Sva tri niza su opciona. Izvori i recenzenti se mogu uvoziti i zasebno.

Datumi su u ISO 8601 formatu: `2026-10-06` ili `2026-10-06T10:00:00.000Z`.

## Neutralan primer

Primer pokazuje samo **oblik** podataka. Vrednosti su placeholder tekst, nisu medicinski sadržaj.

```json
{
  "sources": [
    {
      "id": "izvor-primer",
      "title": "<naziv izvora>",
      "publisher": "<izdavač>",
      "url": "https://example.org/<putanja>",
      "sourceType": "terminology",
      "tier": "A",
      "accessedAt": "2026-10-06"
    }
  ],
  "reviewers": [
    {
      "id": "recenzent-primer",
      "name": "<ime i prezime>",
      "title": "<zvanje / specijalizacija>",
      "profileUrl": "https://example.org/<profil>",
      "sameAs": ["https://example.org/<javni-profil>"],
      "active": true
    }
  ],
  "terms": [
    {
      "id": "rk-0001",
      "slug": "primer-pojma",
      "medicalCanonicalTerm": "<stručni naziv pojma>",
      "publicTitle": "<naslov stranice za čitaoca>",
      "shortDefinition": "<kratka, verifikovana definicija u jednoj do dve rečenice>",
      "latinTerm": "<latinski naziv, ako postoji>",
      "meshPreferredTerm": "<MeSH preferred term>",
      "meshId": "<MeSH ID>",
      "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=<MeSH ID>",
      "meshMatch": "exact",
      "aliases": [
        { "value": "<sinonim>", "type": "verified-synonym", "medicallyVerified": true, "sourceIds": ["izvor-primer"] },
        { "value": "<izraz koji ljudi pretražuju>", "type": "lay-term", "medicallyVerified": false }
      ],
      "categoryId": "endodoncija",
      "clusterId": "<klaster>",
      "tags": ["<tag>"],
      "verification": {
        "status": "verified",
        "tier": "A",
        "sourceIds": ["izvor-primer"],
        "verifiedAt": "2026-10-06"
      },
      "clinicalReview": {
        "status": "approved",
        "reviewerId": "recenzent-primer",
        "reviewedAt": "2026-10-06"
      },
      "publicationStatus": "published",
      "sourceIds": ["izvor-primer"],
      "publishedAt": "2026-10-06T10:00:00.000Z",
      "updatedAt": "2026-10-06T10:00:00.000Z",
      "seo": {
        "primaryKeyword": "<glavna ključna reč>",
        "seoTitle": "<title bez sufiksa ' – Odontoa Rečnik'>",
        "metaDescription": "<meta opis, oko 120–160 znakova>",
        "seoEntryTerm": "<javni izraz kojim se ulazi na stranicu>",
        "searchAliases": ["<dodatni izraz za pretragu na /recnik>"],
        "noindex": false
      },
      "coverImage": { "src": "/images/recnik/primer-pojma.jpg", "alt": "<opis slike>", "width": 1200, "height": 630 },
      "article": [
        { "type": "p", "text": "<pasus>" },
        { "type": "h2", "text": "<podnaslov>" },
        {
          "type": "p",
          "text": [
            "<tekst pre linka> ",
            { "type": "term", "termId": "rk-0002", "text": "<tekst linka ka drugom pojmu>" },
            ", ",
            { "type": "link", "href": "/funkcionalnosti/karton-i-odontogram", "text": "<tekst linka>" },
            " ",
            { "type": "cite", "sourceId": "izvor-primer" }
          ]
        },
        { "type": "ul", "items": ["<stavka>", "<stavka>"] }
      ],
      "faqs": [
        { "question": "<pitanje>", "answer": "<odgovor, običan tekst>" }
      ],
      "links": {
        "relatedTermIds": ["rk-0002"],
        "featureSlugs": ["karton-i-odontogram"],
        "blogSlugs": ["<sanity-slug-posta>"],
        "landingPaths": ["/za/<landing>"],
        "ctaId": "default"
      }
    }
  ]
}
```

## Polja pojma (`RecnikTerm`)

### Obavezna za svaki zapis

| Polje | Tip | Napomena |
|---|---|---|
| `id` | string | Stabilan ID koncepta (npr. `rk-0001`). Ne menja se kad se promeni slug ili naslov. Reference (`relatedTermIds`, `termId`) koriste `id`. |
| `slug` | string | URL segment: mala slova, cifre i crtice, **bez dijakritike** (`/recnik/<slug>`). Jedinstven. |
| `medicalCanonicalTerm` | string | Stručni, verifikovani naziv pojma. Postaje `DefinedTerm.name`. |
| `publicTitle` | string | H1 stranice. Može se razlikovati od stručnog naziva. |
| `shortDefinition` | string | Answer-first definicija: lead na stranici i `DefinedTerm.description`. |
| `categoryId` | string | ID iz `RECNIK_CATEGORIES` (vidi dole). |
| `verification` | object | Vidi „Verifikacija“. |
| `clinicalReview` | object | Vidi „Stručni pregled“. |
| `publicationStatus` | enum | `draft`, `ready-for-review`, `published`, `hold`. |
| `sourceIds` | string[] | Izvori prikazani u bloku „Izvori i literatura“. Može biti prazan za nacrt. |
| `seo.seoTitle`, `seo.metaDescription` | string | Mogu biti `""` za nacrt. |
| `article` | block[] | Može biti `[]`. |

`medicalCanonicalTerm`, `publicTitle`, `seo.primaryKeyword` i `seo.seoEntryTerm` su četiri različite stvari. Nijedno polje se ne izvodi automatski iz drugog.

### Opciona

| Polje | Napomena |
|---|---|
| `latinTerm` | Prikazuje se ispod definicije. |
| `meshPreferredTerm`, `meshId`, `meshUrl` | MeSH podaci. |
| `meshMatch` | `exact`, `close`, `broader`, `narrower`, `related`. Samo `exact` (uz `verification.status: verified`) daje `termCode` i `sameAs` u schema-i. |
| `aliases` | Vidi „Aliasi“. |
| `clusterId`, `tags` | Taksonomija; `clusterId` ide u GA (`glossary_cluster`). |
| `publishedAt` | **Obavezno za `published`.** |
| `updatedAt` | Ako ne postoji, važi `publishedAt`. Ide u sitemap `lastmod`. |
| `seo.primaryKeyword`, `seo.seoEntryTerm` | Interni SEO podaci. `seoEntryTerm` ide u GA (`seo_entry_term`). |
| `seo.searchAliases` | Samo za pretragu na `/recnik`. Nisu sinonimi i ne idu u schema. |
| `seo.canonicalPath` | Pregazi canonical. Pojam sa drugim canonical-om nije u sitemap-u. |
| `seo.noindex` | Stranica postoji, ali nije u indeksu, sitemap-u ni llms.txt. |
| `seo.ogImage`, `coverImage` | `{ src, alt, width, height }`, fajl mora postojati u `public/`. Slike pojmova idu u `public/images/recnik/<slug>.jpg` (1200×630). Bez slike se koristi podrazumevana OG slika. |
| `faqs` | `{ question, answer }`, odgovor je običan tekst. Isti niz gradi vidljiv FAQ i FAQPage JSON-LD (1:1). |
| `links` | Vidi „Veze“. |

## Aliasi (`aliases[]`)

```
{ value, type, medicallyVerified, sourceIds? }
```

| `type` | Značenje | Ide u schema `alternateName`? |
|---|---|---|
| `verified-synonym` | Isti medicinski pojam. Zahteva `medicallyVerified: true` (inače greška). | Da |
| `abbreviation` | Skraćenica istog pojma. | Da, ako je `medicallyVerified: true` |
| `english` | Engleski naziv. | Ne |
| `seo-alias` | Izraz kojim se pretražuje; nije sinonim. | Ne |
| `lay-term` | Laički/pacijentski izraz. | Ne |

SEO ili laički izraz nikad ne postaje medicinski sinonim automatski. Svi aliasi se koriste u pretrazi na `/recnik`. Isti alias na više pojmova je upozorenje.

## Izvori (`sources[]`)

| Polje | Napomena |
|---|---|
| `id` | Stabilan ID. Na njega se pozivaju `sourceIds`, `verification.sourceIds`, `aliases[].sourceIds` i `cite`. |
| `title`, `publisher` | Obavezno. |
| `url` | Apsolutni URL. Izostavlja se samo za izvore bez URL-a (npr. štampani udžbenik). |
| `sourceType` | `terminology`, `guideline`, `textbook`, `journal-article`, `professional-body`, `regulation`, `encyclopedia`, `other` |
| `tier` | `A`, `B`, `C` (opciono) |
| `accessedAt` | Datum provere URL-a (opciono). |

Izvori iz `term.sourceIds` se prikazuju na stranici („Izvori i literatura“). Isti spisak je `citation` u JSON-LD-u: schema prikazuje samo ono što je vidljivo.

## Verifikacija terminologije (`verification`)

```
{ status: verified | partial | unverified, tier?: A | B | C, sourceIds: string[], verifiedAt? }
```

Opisuje da li je **terminologija** (naziv, definicija, sinonimi) potvrđena izvorima.

## Stručni pregled (`clinicalReview`)

```
{ status: pending | approved | changes-required, reviewerId?, reviewedAt? }
```

Na stranici se prikazuje „Stručno pregledao/la: <ime>, <zvanje> · <datum>“, ali samo ako je `status: approved`, recenzent postoji u registru i `active: true`. Bez recenzenta se ne prikazuje ništa.

## Recenzenti (`reviewers[]`)

```
{ id, name, title, profileUrl?, sameAs?, active }
```

## Publication gate

Pojam je javan (stranica, `/recnik`, sitemap, llms.txt) samo ako ima `publicationStatus: "published"` **i** ispunjava sve uslove ispod. Ako ne ispunjava, build pada:

- `medicalCanonicalTerm`, `publicTitle`, `shortDefinition` nisu prazni;
- `sourceIds` ima bar jedan postojeći izvor;
- `verification.status === "verified"`;
- `clinicalReview.status === "approved"`;
- `publishedAt` postoji;
- `seo.seoTitle` i `seo.metaDescription` nisu prazni;
- `categoryId` postoji.

`draft`, `ready-for-review` i `hold` se nikad ne prikazuju.

**Greške** (build pada):
- dupli `id`, slug ili canonical path;
- nepostojeći `categoryId`, izvor, recenzent, povezani pojam, `featureSlugs` ili `ctaId`;
- nevažeći datumi;
- slika navedena, a ne postoji u `public/`;
- `verified-synonym` bez verifikacije;
- `{ type: 'link' }` ka `/recnik/...` (koristiti `term`);
- link koji nije interna putanja ni `https://`.

**Upozorenja**:
- `seoTitle` duži od 60 znakova;
- `metaDescription` kraći od 70 ili duži od 160 znakova;
- alias deljen između pojmova;
- isti `primaryKeyword`/`seoEntryTerm` na više pojmova;
- pojam bez povezanih pojmova (orphan);
- link ili landing ka stranici koja još ne postoji.

## Kategorije (`categoryId`)

| `categoryId` | Naziv |
|---|---|
| `dijagnoze` | Dijagnoze |
| `anatomija` | Anatomija |
| `konzervativna-stomatologija` | Konzervativna stomatologija |
| `endodoncija` | Endodoncija |
| `parodontologija` | Parodontologija |
| `oralna-hirurgija` | Oralna hirurgija |
| `implantologija` | Implantologija |
| `protetika` | Protetika |
| `ortodoncija` | Ortodoncija |
| `radiologija` | Radiologija |
| `dentalni-materijali-i-instrumenti` | Dentalni materijali i instrumenti |
| `digitalna-stomatologija` | Digitalna stomatologija |
| `administracija-ordinacije` | Administracija ordinacije |
| `upravljanje-ordinacijom` | Upravljanje ordinacijom |

Nova kategorija se dodaje u `src/lib/content/recnik/categories.ts`. Stranica kategorije (`/recnik/kategorija/<slug>`) postoji kad kategorija ima bar jedan objavljen pojam. Noindex je dok kategorija nema `indexable: true` i odobren `seoTitle` i `metaDescription`.

## Sadržaj (`article`)

Blokovi:
- `{ "type": "p", "text": RichText }`
- `{ "type": "h2" | "h3", "text": string }`
- `{ "type": "ul" | "ol", "items": RichText[] }`

`RichText` je string ili niz delova:

| Deo | Značenje |
|---|---|
| `"tekst"` | Običan tekst. |
| `{ "type": "term", "termId", "text" }` | Link ka drugom pojmu (po `id`). Ako pojam nije javan, prikazuje se kao tekst. |
| `{ "type": "link", "href", "text" }` | Interna putanja (`/funkcionalnosti/...`) ili `https://` link. Interni link ka skrivenoj ili nepostojećoj stranici se prikazuje kao tekst. |
| `{ "type": "cite", "sourceId", "text"? }` | Citat izvora, link ka `url` izvora (podrazumevani tekst je naziv izvora). |

## Veze (`links`)

| Polje | Format | Prikaz |
|---|---|---|
| `relatedTermIds` | `id`-jevi pojmova | „Povezani termini“, samo javni pojmovi. |
| `featureSlugs` | slugovi iz `src/lib/content/funkcionalnosti.ts`: `zakazivac-termina`, `karton-i-odontogram`, `rtg-i-fotografije`, `zubna-tehnika`, `dokumentacija-i-saglasnosti`, `finansije-i-podsetnici`, `ai-asistent` | „Kako to izgleda u Odontoi“ |
| `blogSlugs` | Sanity slugovi postova | „Povezani članci“, samo dok je blog javan i post postoji (bez noindex). |
| `landingPaths` | `/za/...` | Tek kada landing stranica postoji (`src/lib/routes/public-routes.ts`). |
| `ctaId` | `default`, `demo` | Završni CTA. |

Linkovi nemaju UTM parametre. Klikovi se mere kroz GA (`docs/ANALYTICS_GLOSSARY_SETUP.md`).

## Aktivacija rečnika

1. Uvesti pojmove (bar jedan `published` koji prolazi gate).
2. Ukloniti `'/recnik'` iz `HIDDEN_SECTIONS` u `src/lib/config/hidden-sections.ts`.
3. Build i deploy. Sitemap, llms.txt, navigacija i footer se uključuju automatski.

Za lokalnu proveru šablona bez pravih podataka: `RECNIK_FIXTURES=1` učitava testne podatke iz `fixtures.ts` (nikad na produkciji; tamo build pada).
