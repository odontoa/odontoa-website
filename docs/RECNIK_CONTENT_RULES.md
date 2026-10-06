# Rečnik: pravila sadržaja

> **Obavezno pre svakog unosa, importa, izmene, validacije ili objave pojma u Odontoa rečniku.**
>
> Ovaj dokument kaže **zašto i po kojim pravilima** se podaci mapiraju i objavljuju.
> Tehnički format (polja, tipovi, enumi, primer JSON-a) je u [`RECNIK_IMPORT_FORMAT.md`](./RECNIK_IMPORT_FORMAT.md).
> Ako se dokumenti razlikuju, za oblik podataka važi `RECNIK_IMPORT_FORMAT.md` i kod, a za sadržaj i odluke važi ovaj dokument.

Važi za ljude, Claude i druge AI alate, i za `scripts/import-recnik-json.ts`.

---

## 1. Zlatno pravilo

Rečnik je **medicinski, stručni sadržaj zasnovan na izvorima**.

- **SEO** određuje kako korisnik traži pojam, pa time i kako formulišemo javni naslov i slug.
- **Medicinski izvori** određuju šta pojam tačno znači, da li je naziv ili sinonim validan i šta sme da se tvrdi.

**SEO keyword nikada ne sme automatski postati medicinski sinonim ili canonical termin.**

```
medicalCanonicalTerm  ≠  publicTitle  ≠  seo.primaryKeyword  ≠  seo.seoEntryTerm
```

Ova četiri polja mogu imati istu vrednost, ali to mora biti **namerna odluka**, nikad automatsko kopiranje. Kod nijedno od njih ne izvodi iz drugog.

| Polje | Šta je | Ko odlučuje |
|---|---|---|
| `medicalCanonicalTerm` | Stručni, verifikovani naziv koncepta (`DefinedTerm.name` u schema-i) | Izvori |
| `publicTitle` | H1 stranice, za čitaoca | Urednik/SEO, u granicama izvora |
| `seo.primaryKeyword` | Glavna ključna reč stranice | SEO |
| `seo.seoEntryTerm` | Javni izraz kojim korisnik ulazi na stranicu (GA `seo_entry_term`) | SEO |

## 2. Zabranjeno ponašanje

Claude, bilo koji AI alat, importer ni urednik **NE SME** da:

- izmisli medicinski termin;
- sam prevede stručni termin i predstavi prevod kao verifikovan;
- napravi novi medicinski sinonim iz SEO keyword-a;
- pretpostavi da dva slična izraza znače isti medicinski koncept;
- „ispravi“ termin ili definiciju iz sopstvenog znanja;
- pretvori `seo-alias` ili `lay-term` u `verified-synonym` bez izvora;
- promeni MeSH poklapanje (`meshMatch`) samo zato što naziv izgleda slično;
- označi `clinicalReview.status: "approved"` ako stvarni recenzent nije odobrio sadržaj;
- objavi pojam samo da bi prošao validator;
- izmisli recenzenta, autora, izvor, datum ili citat;
- reši SEO koliziju spajanjem medicinski različitih koncepata.

**Ako podatak nije potvrđen**, ostaje prazan, odnosno sa statusom `pending`, `partial`, `unverified` ili `hold`, šta god odgovara stvarnom stanju. Prazno polje je ispravno, a izmišljeno nije.

Importer i validator **nikad ne menjaju podatke**. Ako nađu problem, prijavljuju ga, a ispravka se radi u izvornom research masteru, ne u repou i ne „usput“.

## 3. Izvori

Svaki ozbiljan medicinski ili terminološki podatak mora imati izvor: naziv pojma, definicija, sinonim, MeSH poklapanje i tvrdnje u tekstu.

Prioritet izvora (`tier`):

| Tier | Značenje |
|---|---|
| **A** | Tačan zvanični terminološki ili standardni izvor |
| **B** | Zvanični srpski institucionalni, akademski ili regulatorni izvor |
| **C** | Regionalni akademski ili profesionalni izvor, kada je terminološki i značenjski kompatibilan |

- **MeSH** je osnovni međunarodni taksonomski i referentni sloj kada postoji odgovarajući koncept.
- **Wikidata, SEO i SERP podaci** pomažu u istraživanju i pronalaženju aliasa, ali **sami po sebi nisu dokaz medicinskog značenja**.
- **Search query i SERP formulacija** su SEO signal, ne medicinska verifikacija.

Svaki izvor se unosi jednom u registar izvora i referencira po `id`-ju. U `term.sourceIds` idu izvori koji se prikazuju na stranici u bloku „Izvori i literatura“. U JSON-LD-u kao `citation` ide **isti** spisak: schema prikazuje samo ono što je vidljivo korisniku.

## 4. Aliasi

Svaki alias mora imati tačan `type`. Tip opisuje **dokazani odnos sa konceptom**, ne koliko je izraz popularan.

| `type` | Pravilo | Pretraga na `/recnik` | Schema `alternateName` |
|---|---|---|---|
| `verified-synonym` | Isti medicinski koncept, medicinski potvrđen. Obavezno `medicallyVerified: true` (validator inače javlja grešku). Navesti `sourceIds` kad potvrda dolazi iz izvora. | Da | Da |
| `abbreviation` | Samo stvarna skraćenica **istog** koncepta. | Da | Da, ako je `medicallyVerified: true` |
| `english` | Engleski izraz. Ne znači da je srpski canonical njegov direktan prevod. | Da | Ne |
| `seo-alias` | Izraz koji ljudi traže; ne mora biti medicinski sinonim. | Da | **Nikad** |
| `lay-term` | Pacijentski ili laički izraz, za pretragu, UX i eventualno objašnjenje. | Da | **Nikad** |

`seo.searchAliases` su dodatni izrazi samo za pretragu na `/recnik`. Nisu sinonimi i ne idu u schema.

Isti alias na više pojmova validator prijavljuje kao upozorenje. Takav slučaj treba razrešiti po izvorima (vidi „Kanibalizacija“), ne brisanjem koncepta.

## 5. MeSH

- `meshMatch: "exact"` se koristi **samo kada je koncept stvarno isti**.
- `close`, `broader`, `narrower` i `related` ostaju tačno to što jesu. Ne „podižu“ se na `exact`.
- `termCode` (MeSH ID) i `sameAs` (MeSH URL) se u schema-i pojavljuju samo uz `meshMatch: "exact"` i `verification.status: "verified"`. Tako je urađeno u kodu i ne sme se zaobilaziti.
- `meshId`, `meshUrl`, `termCode` i `sameAs` se **ne koriste da bi stranica izgledala bolje optimizovano**.
- Semantičko poklapanje se nikad ne menja zbog SEO-a.

## 6. Tok objave

```
draft
  → verifikacija terminologije i izvora   (verification.status: verified)
  → ready-for-review
  → stručni (klinički) pregled            (clinicalReview.status: approved)
  → published
```

`hold` znači da pojam nije spreman. Ne zaobilazi se.

**Za objavu (`publicationStatus: "published"`) mora važiti sve od sledećeg:**

| Uslov | Ko proverava |
|---|---|
| `verification.status = "verified"` | validator (build pada) |
| Bar jedan postojeći izvor u `sourceIds` | validator |
| `clinicalReview.status = "approved"` | validator |
| Stvarni recenzent je zaista odobrio sadržaj | **čovek**; validator to ne može da zna |
| `medicalCanonicalTerm`, `publicTitle`, `shortDefinition`, `seo.seoTitle`, `seo.metaDescription`, `publishedAt` postoje | validator |
| `recnik:validate` prolazi bez grešaka | build |
| Nema nerešenog semantičkog ili kanibalizacijskog problema koji bi pogrešno predstavio koncept | **čovek**; validator samo upozorava na kolizije |

Prolazak validatora je **neophodan, ali nije dovoljan** uslov za objavu. Validator proverava strukturu i statuse, a ne medicinsku tačnost.

Recenzent se na stranici prikazuje („Stručno pregledao/la …“) samo ako postoji u registru recenzenata, ima `active: true` i pojam ima njegov `reviewerId`. Ako recenzent nije stvarno definisan, ne prikazuje se ništa i ne izmišlja se.

## 7. Definicija i tekst

- **Javni tekst mora biti originalno napisan.** Nema masovnog kopiranja iz MeSH scope note-a, ISO standarda, ADA glossary-a, knjiga ni tuđih sajtova.
- **Medicinske činjenice ostaju unutar onoga što izvori podržavaju.** Ako izvor ne podržava tvrdnju, tvrdnja se ne dodaje.

Rečnik nije blog. Struktura stranice:
1. **answer-first**: kratka, jasna definicija (`shortDefinition`);
2. potrebno objašnjenje (`article`), onoliko koliko pojam zahteva;
3. povezani pojmovi;
4. FAQ, **samo gde postoji stvarna namera korisnika** (ne izmišljena pitanja radi SEO-a);
5. izvori.

Tekst se ne naduvava na 2.000 reči zbog SEO-a.

## 8. SEO pravila

SEO **sme** da menja:
- `publicTitle`;
- `slug`;
- `seo.primaryKeyword`;
- `seo.seoEntryTerm`;
- `seo.seoTitle`;
- `seo.metaDescription`;
- prioritete FAQ-a;
- redosled objavljivanja.

SEO **ne sme** da menja medicinsku istinu.

> **Google/search language determines how we enter the conversation; medical sources determine what exactly we say.**

Primer obrasca:

| | Vrednost |
|---|---|
| `medicalCanonicalTerm` | `dentalni vinir` |
| `publicTitle` | `Fasete za zube (dentalni viniri)` |

To **ne znači** da je svaka upotreba reči „faseta“ verifikovani medicinski sinonim. Status aliasa prati dokaze iz izvora (vidi „Aliasi“).

## 9. Kanibalizacija

Pre pravljenja novog URL-a proveriti:
- da li koncept već postoji;
- da li keyword već pripada drugom konceptu;
- da li je novi izraz samo alias postojećeg pojma;
- da li koncept uopšte pripada rečniku ili blogu ili komercijalnoj stranici.

Pravila:
- **Ne praviti dva glossary URL-a** samo zato što postoje dve varijante keyword-a. Varijanta ide kao alias.
- **Ne spajati dva medicinski različita koncepta** samo zato što dele keyword. Oni ostaju posebni pojmovi, a SEO kolizija se rešava kroz naslove, `seoEntryTerm` i veze.

Validator prijavljuje kao **upozorenja** isti alias na više pojmova i isti `primaryKeyword`/`seoEntryTerm` na više pojmova. Upozorenje ne rešava problem samo; odluka je ljudska i mora biti u skladu sa izvorima.

## 10. Kategorije i povezani pojmovi

- Koriste se samo postojeće vrednosti `categoryId` (spisak je u `RECNIK_IMPORT_FORMAT.md` i u `src/lib/content/recnik/categories.ts`). Nepostojeća kategorija je greška.
- **Nova kategorija se ne uvodi automatski tokom importa.** To je posebna, svesna izmena registra kategorija.
- `relatedTermIds` mora biti **semantički smislen odnos** (deo-celina, uzrok-posledica, postupak-stanje, suprotnost...), a ne nasumična lista internih linkova radi SEO-a.
- Ne povezivati svaki pojam sa svakim. Pojam bez veza validator prijavljuje kao „orphan“ upozorenje; to nije razlog za dodavanje veštačkih veza.

## 11. Procedura importa

Za **svaki** dataset, bez izuzetka:

1. Pročitati `docs/RECNIK_CONTENT_RULES.md` (ovaj dokument) i `docs/RECNIK_IMPORT_FORMAT.md`.
2. **Ne menjati ulazne podatke.** Ni terminologiju, ni tekst, ni statuse. Problem se prijavljuje, a ne ispravlja.
3. Prvo pokrenuti:
   ```bash
   npm run recnik:import -- <file> --dry-run
   ```
4. Prijaviti korisniku:
   - greške (errors);
   - upozorenja (warnings);
   - kolizije aliasa;
   - SEO kolizije;
   - nepostojeće reference (izvori, recenzenti, pojmovi, kategorije, funkcionalnosti);
   - orphan pojmove;
   - probleme sa publication gate-om;
   - konflikte sa postojećim zapisima (isti `id`, drugačiji sadržaj).
5. **Ništa ne upisivati dok korisnik ne odobri rezultat dry-run-a.**
6. Posle odobrenja:
   ```bash
   npm run recnik:import -- <file>            # --overwrite samo uz izričito odobrenje
   npm run recnik:validate
   npm run recnik:test
   npm run typecheck
   npm run build
   ```
7. **`/recnik` se ne aktivira automatski.** Aktivacija (uklanjanje `'/recnik'` iz `HIDDEN_SECTIONS` u `src/lib/config/hidden-sections.ts`) je posebna, izričita odluka korisnika.

## 12. Kratko: šta je automatski, a šta ljudska odluka

| Automatski (kod) | Ljudska odluka |
|---|---|
| Struktura, enumi, nepoznata polja, datumi, jedinstvenost `id`-jeva i slugova | Da li je pojam medicinski tačan |
| Postojanje referenci (izvori, recenzenti, pojmovi, kategorije) | Da li je sinonim zaista isti koncept |
| Publication gate (statusi, obavezna polja, izvor) | Da li je recenzent stvarno odobrio sadržaj |
| `alternateName` samo iz verifikovanih sinonima i skraćenica | Da li je MeSH poklapanje zaista `exact` |
| MeSH u schema-i samo uz `exact` + `verified` | Kako rešiti koliziju aliasa ili keyword-a |
| Upozorenja: kolizije, orphan, dužine SEO polja | Da li je pojam spreman za objavu |
| Skrivanje nepostojećih i skrivenih linkova | Aktivacija `/recnik` |
