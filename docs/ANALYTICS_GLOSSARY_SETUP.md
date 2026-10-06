# Analytics: rečnik i konverzije (GA4)

Kod je spreman, ali GA4 se **ne učitava** dok nije podešen `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`src/components/GoogleAnalytics.tsx`). Measurement ID se ne upisuje u kod.

Pre aktiviranja GA-a mora se rešiti saglasnost za kolačiće:
- CMP / cookie banner;
- Google Consent Mode v2 (`gtag('consent', 'default', ...)` pre `config`).

Sajt to trenutno nema, a politika privatnosti već pominje analitičke kolačiće.

Svi eventi idu kroz `trackEvent()` u `src/lib/analytics/events.ts`. Bez `window.gtag` ne rade ništa.

## Eventi rečnika

### `glossary_view`

Šalje se pri otvaranju stranice pojma (`GlossaryViewTracker`).

| Parametar | Vrednost |
|---|---|
| `page_type` | `glossary` |
| `content_id` | stabilan ID pojma (`RecnikTerm.id`) |
| `glossary_term` | `medicalCanonicalTerm`: stabilan stručni naziv (ključ koncepta) |
| `seo_entry_term` | `seo.seoEntryTerm`: javni izraz kojim se ulazi na stranicu (može biti prazno) |
| `glossary_cluster` | `clusterId` (može biti prazno) |
| `category_id` | `categoryId` |
| `page_path` | `/recnik/<slug>` |

### `select_content` (GA4 recommended)

Klik sa stranice pojma na drugi sadržaj: povezani pojam, link u tekstu, funkcionalnost, blog ili landing.

| Parametar | Vrednost |
|---|---|
| `page_type` | `glossary` |
| `content_type` | `glossary_term`, `blog_post`, `feature_page`, `landing_page` |
| `content_id` | ID cilja (id pojma, slug posta ili funkcionalnosti, putanja landinga) |
| `link_url` | putanja cilja |
| `source_glossary_term` | `medicalCanonicalTerm` pojma sa kog se klikće |
| `source_content_id` | `id` pojma sa kog se klikće |

### `cta_click`

Završni CTA na stranici pojma.

| Parametar | Vrednost |
|---|---|
| `page_type` | `glossary` |
| `cta_name` | `recnik_default` ili `recnik_demo` |
| `link_url` | `/register` ili `/demo` |
| `source_glossary_term`, `source_content_id` | kao gore |

## Konverzije

`contact_form_submit` i `demo_request` ostaju nepromenjeni. Uz svaki se sada šalje i GA4 recommended **`generate_lead`**:

| Parametar | Vrednost |
|---|---|
| `lead_source` | `contact_form` ili `demo_request` |
| `page_path` | stranica forme |

Ključni događaj (konverziju) u GA4 označiti na `generate_lead`, ne na oba eventa, da se lead ne broji dvaput.

## Ručno podešavanje u GA4

Admin → Data display → Custom definitions → **Create custom dimension**, scope **Event**:

| Dimension name | Event parameter |
|---|---|
| Page type | `page_type` |
| Content ID | `content_id` |
| Glossary term | `glossary_term` |
| SEO entry term | `seo_entry_term` |
| Glossary cluster | `glossary_cluster` |
| Category ID | `category_id` |
| Source glossary term | `source_glossary_term` |
| Source content ID | `source_content_id` |
| CTA name | `cta_name` |
| Link URL | `link_url` |
| Lead source | `lead_source` |

`content_type` i `content_id` su standardni parametri za `select_content`. Ako se koriste i van tog eventa, registrovati ih kao custom dimenzije.

Zatim:
1. Admin → Events → označiti `generate_lead` kao ključni događaj.
2. Admin → Data streams → web stream: isključiti Enhanced measurement „Outbound clicks“ samo ako duplira `select_content` u izveštajima (opciono).
3. Povezati Search Console sa GA4 property-jem (Admin → Product links).
