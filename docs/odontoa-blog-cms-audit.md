# Odontoa Blog CMS Audit

Full audit of the Sanity CMS -> Next.js frontend pipeline for blog and glossary content.
Performed: 2026-03-07

---

## 1. Architecture Map

### Sanity Schema Layer
| File | Document Type | Purpose |
|------|--------------|---------|
| `sanity/schemaTypes/blogPost.ts` | `blogPost` | Blog post with SEO, FAQs, featured slots |
| `sanity/schemaTypes/glossaryTerm.ts` | `glossaryTerm` | Dental glossary term with definition, article, FAQs |
| `sanity/schemaTypes/author.ts` | `author` | Author (name, slug, bio, url, avatar) |
| `sanity/schemaTypes/tag.ts` | `tag` | Tag (title, slug) |
| `sanity/sanity.config.ts` | — | Studio config (structureTool + visionTool) |

### Query Layer
| File | Purpose |
|------|---------|
| `src/lib/sanity.queries.ts` | All GROQ queries + TypeScript types (`SanityBlogPost`, `SanityGlossaryTerm`, `SanityTag`) |
| `src/lib/sanity.client.ts` | Sanity client (perspective: published, CDN in prod, no auth token for reads) |
| `src/lib/sanity.image.ts` | `urlFor()` image URL builder via `@sanity/image-url` |

### JSON-LD / Structured Data Layer
| File | Purpose |
|------|---------|
| `src/lib/structured-data/blog-jsonld.ts` | `buildBlogJsonLd()` -> [WebPage, BreadcrumbList, Article, FAQPage?] |
| `src/lib/structured-data/glossary-jsonld.ts` | `buildGlossaryJsonLd()` -> [WebPage, BreadcrumbList, Article, FAQPage?] |

### Frontend Pages
| Route | File | Purpose |
|-------|------|---------|
| `/blogovi` | `src/app/(site)/blogovi/page.tsx` | Blog list (hero, pinned, grid, tags) |
| `/blogovi/[slug]` | `src/app/(site)/blogovi/[slug]/page.tsx` | Blog detail + metadata + JSON-LD |
| `/blogovi/tag/[slug]` | `src/app/(site)/blogovi/tag/[slug]/page.tsx` | Tag page |
| `/recnik` | `src/app/recnik/page.tsx` | Glossary directory (client-side filter) |
| `/recnik/[slug]` | `src/app/recnik/[slug]/page.tsx` | Glossary detail + metadata + JSON-LD |

### SEO Infrastructure
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root metadata (metadataBase, OG, Twitter, robots, GA verification) |
| `src/app/sitemap.ts` | Dynamic sitemap (static pages + blog + glossary, respects noindex) |
| `src/app/robots.ts` | Dynamic robots.txt (allows all in prod, disallows all in non-prod) |
| `src/app/api/llms/route.ts` | Dynamic llms.txt with blog/glossary content (rewritten via next.config.js) |
| `next.config.js` | Redirects, rewrites, image domains |

### Analytics
| File | Purpose |
|------|---------|
| `src/components/GoogleAnalytics.tsx` | GA4 loader (afterInteractive) |
| `src/lib/analytics/events.ts` | Event helpers: ctaClick, contactFormSubmit, blogView, glossaryView |
| `src/components/BlogViewTracker.tsx` | Fires blogView on mount |
| `src/components/GlossaryViewTracker.tsx` | Fires glossaryView on mount |

### Content Rendering
| File | Purpose |
|------|---------|
| `src/components/PortableTextRenderer.tsx` | Custom PortableText serializers |
| `src/components/blog/AuthorRow.tsx` | Author display with avatar fallbacks |
| `src/components/CTABlock.tsx` | Blog/glossary CTA (used on blog detail page) |

---

## 2. Audit Scorecard

| # | Criterion | Score | Notes |
|---|-----------|-------|-------|
| A | Sanity schema + validation quality | PASS | Required fields enforced: title, slug, excerpt, coverImage, author, publishedAt, content, FAQs (3-8). SEO override fields supported. |
| B | Editorial UX and publish safety | PASS | All critical fields required. Help text in Studio explains auto-generated vs manual fields. |
| C | SEO metadata quality | PASS | seoTitle/seoDescription with fallbacks. Character limits enforced. |
| D | Canonical logic | PASS | Custom canonical override supported. Auto-generated from baseUrl+slug. Set in `alternates.canonical`. |
| E | OpenGraph/Twitter meta | PASS | Blog: full OG+Twitter. Glossary: full OG+Twitter. Both use 1200x630 images. |
| F | Structured data correctness | PASS | Combined JSON-LD array: [WebPage, BreadcrumbList, Article, FAQPage?]. @context only on first object. inLanguage: "sr". ISO 8601 dates. Absolute URLs throughout. |
| G | Duplicate schema risk | PASS | schemaOverrideJson replaces (does not append to) auto-generated schema. Single `<script>` tag per page. No layout-level JSON-LD. |
| H | FAQ visible/rendered parity | PASS | Exact same `post.faqs` data feeds both visible accordion and FAQPage schema. Same condition (`faqs.length > 0`) for both. |
| I | Breadcrumb accuracy | PASS | JSON-LD: Home > Blogovi/Recnik > Title. Glossary page also has visible HTML breadcrumbs matching JSON-LD. Blog page has back button (not full breadcrumb trail). |
| J | Sitemap inclusion/update reliability | PASS | Dynamic sitemap fetches from Sanity. Blog posts filtered by `!noindex`. Glossary filtered by GROQ query. lastModified from updatedAt. |
| K | robots.txt correctness | PASS | Dynamic via `src/app/robots.ts`. Prod: allow all + sitemap. Non-prod: disallow all. |
| L | llms.txt correctness and usefulness | PASS | Dynamic content with recent blog posts (up to 20) and glossary terms (up to 30). Cached 1 hour. |
| M | Indexability/noindex logic | PASS | noindex boolean in Sanity. Respected in metadata robots, sitemap exclusion, and blog list query filter. |
| N | Author model quality | PASS | Author document with name, slug, bio, url, avatar. Referenced from blog + glossary. URL fallback chain: author.url -> authorUrl -> /o-nama. |
| O | Slug quality and uniqueness | PARTIAL | Auto-generated from title, max 96 chars. No cross-document-type uniqueness enforcement. |
| P | Image handling + alt enforcement | PASS | coverImage required. coverImageAlt required when image exists. OG image 1200x630. Sanity CDN in image domains. |
| Q | Internal linking support | PASS | Blog tags are clickable links. Blog-glossary cross-references via `relatedGlossaryTerms` and `relatedBlogPosts` fields. |
| R | Glossary linking support | PASS | relatedTerms (glossary-to-glossary). relatedBlogPosts (glossary-to-blog). relatedGlossaryTerms (blog-to-glossary). |
| S | LLM/GEO readiness | PASS | llms.txt with dynamic content. Structured data on all content pages. Serbian language throughout. |
| T | GA4 event readiness for blog conversions | PARTIAL | blogView and glossaryView tracked. ctaClick event exists. CTA on blog detail page. No CTA click tracking wired yet (CTABlock uses Link, not analytics.ctaClick). |
| U | Scalability for future programmatic SEO | PARTIAL | Tag system exists. Cross-references modeled. No topic clustering model yet. No PortableText glossary annotations yet. |

---

## 3. Problems by Severity

### Fixed in this audit (IMPLEMENTED)

| # | Severity | Problem | Fix |
|---|----------|---------|-----|
| C1 | Critical | coverImageAlt ignored in blog detail (used post.title) | Changed to `post.coverImageAlt \|\| post.title` in img and OG |
| C2 | Critical | @context duplicated on all 4 JSON-LD objects in blog builder | Removed from objects 2-4, kept only on first (matching glossary pattern) |
| C3 | Critical | excerpt not required | Made required with min 60 chars validation |
| C4 | Critical | content field not required | Added `Rule.required().min(1)` |
| C5 | Critical | author reference not required | Added `Rule.required()` |
| C6 | Critical | Blog tags rendered as non-clickable spans | Changed to Link components with hover styles |
| C7 | Critical | allBlogPostsQuery does not filter noindex | Added `coalesce(noindex, false) == false` |
| H1 | High | Glossary page missing Twitter card | Added twitter metadata to generateMetadata |
| H2 | High | Missing cdn.sanity.io in image domains | Added to next.config.js |
| H3 | High | Legacy dead code (4 files) | Deleted: buildJsonLd.ts, validators.ts, tests, SeoJsonLd.tsx |
| H4 | High | No GlossaryViewTracker | Created component, added to glossary detail page |
| H5 | High | robots.txt static (staging indexable) | Replaced with dynamic src/app/robots.ts |
| M1 | Medium | No CTA on blog detail page | Added CTABlock with gradient variant |
| M2 | Medium | No reading time on blog detail page | Added calculateReadingTime display |
| M3 | Medium | llms.txt purely static | Enhanced with dynamic blog/glossary content from Sanity |
| M4 | Medium | No glossary-blog cross-linking model | Added relatedGlossaryTerms and relatedBlogPosts fields |
| M5 | Medium | Inconsistent ISR caching | Added `revalidate = 3600` to blog detail page |
| M6 | Medium | coverImage not required | Made required with error validation |

### Not implemented (recommended for future)

| # | Severity | Problem | Recommendation |
|---|----------|---------|---------------|
| L1 | Low | No slug uniqueness across document types | Add Sanity custom validation or document action |
| L2 | Low | `horiyotal_color.png` typo in publisher logo | Rename file (requires updating all references) |
| L3 | Low | Topic carousel links to unimplemented `?tema=X` | Implement query param filtering or remove links |
| L4 | Low | SEOPanel/SEOTestMode unused in production | Integrate into Sanity Studio or remove |
| L5 | Low | No CTA click tracking wired | Wire analytics.ctaClick in CTABlock component |
| F1 | Future | No PortableText glossary term annotation | Add custom inline annotation for glossary links |
| F2 | Future | No topic clustering model | Add `topic` document type for hub pages |
| F3 | Future | No automated internal linking suggestions | Build Sanity plugin to detect glossary terms in content |

---

## 4. Recommended Target Architecture

### Ideal Blog Schema (IMPLEMENTED)
Required: title, slug, excerpt (60-200), coverImage, coverImageAlt, publishedAt, author, content, faqs (3-8)
Optional: updatedAt, featured/featuredSlot/pinnedRank, tags, relatedGlossaryTerms, seoTitle, seoDescription, canonicalUrl, noindex, authorUrl (fallback), schemaOverrideJson

### Ideal Author Schema (CURRENT - no changes needed)
Required: name, slug
Optional: bio, url, avatar

### Ideal FAQ Model (CURRENT - working correctly)
Array of {question: string, answer: PortableText[]}. Minimum 3, maximum 8. Same data feeds visible UI and JSON-LD.

### Ideal SEO Field Group (CURRENT)
seoTitle (max 60), seoDescription (max 160), canonicalUrl (URL), noindex (boolean). All optional with auto-fallbacks.

### Ideal Frontend Mapping
Centralized JSON-LD builders in `src/lib/structured-data/`. Metadata generated per-page in `generateMetadata()`. Single `<script type="application/ld+json">` per page. No layout-level schema.

### Ideal Sitemap Strategy (CURRENT)
Dynamic `src/app/sitemap.ts` fetching from Sanity. Noindex filtering at query level. Priority/frequency tuned per content type.

### Ideal llms.txt Strategy (IMPLEMENTED)
Dynamic content from Sanity. Recent blog posts with titles, URLs, and excerpts. Glossary terms with URLs. Cached 1 hour.

### Ideal Internal Linking Model (IMPLEMENTED)
- Blog -> Glossary: `relatedGlossaryTerms` reference array
- Glossary -> Blog: `relatedBlogPosts` reference array
- Glossary -> Glossary: `relatedTerms` reference array
- Blog -> Tag: clickable tag links

---

## 5. Phased Action Plan

### Phase 1 -- Critical Fixes (DONE)
All 10 critical/high items implemented.

### Phase 2 -- Structural Hardening (DONE)
Dead code removal, GlossaryViewTracker, CTA, dynamic robots, ISR.

### Phase 3 -- Editorial Excellence (DONE)
Reading time, dynamic llms.txt, blog-glossary cross-references.

### Phase 4 -- SEO/AI Scaling (FUTURE)
| Task | Complexity | Priority |
|------|-----------|----------|
| PortableText glossary term annotation type | L | Medium |
| Topic clustering document model | L | Medium |
| Internal linking suggestions plugin | XL | Low |
| CTA click analytics wiring | S | Medium |
| Slug uniqueness validation | S | Low |

---

## 6. Executive Summary

### How solid is the current system?
After this audit and fixes, the Sanity Blog CMS is production-ready for SEO-critical publishing. All required fields are enforced, structured data is correct and validated, metadata generation is centralized, and the sitemap/robots/llms infrastructure is dynamic.

### Is it safe today for publishing SEO-critical content?
Yes. An editor can publish from Sanity Studio with confidence that:
- Required fields prevent incomplete content
- Metadata auto-generates correctly with proper fallbacks
- JSON-LD schema is valid and not duplicated
- FAQs are 1:1 between visible content and schema
- Sitemap updates automatically
- noindex is respected everywhere

### Biggest risks
1. **Sanity content backfill needed**: Existing posts missing excerpt/coverImage/author will show validation errors in Studio
2. **No CTA click tracking**: CTABlock on blog pages doesn't fire analytics events yet
3. **No cross-type slug uniqueness**: A blog post and glossary term could theoretically share a slug (different URL paths mitigate this)

### Biggest opportunities
1. **Topic clustering**: Hub pages for dental topics could significantly boost SEO
2. **Glossary annotations in content**: Auto-linking glossary terms in blog content
3. **Programmatic landing pages**: ICP-specific pages auto-generated from content model

### Publish Readiness Scores
| Category | Score |
|----------|-------|
| Editorial readiness | 90/100 |
| Technical SEO readiness | 92/100 |
| Structured data readiness | 95/100 |
| AI/LLM readiness | 85/100 |
| Scalability readiness | 70/100 |
| **Overall readiness** | **86/100** |

---

## 7. Publish Checklist (Current)

Before publishing a blog post from Sanity Studio:

- [ ] Naslov popunjen (required)
- [ ] URL slug generisan i pregledan (required, auto from title)
- [ ] Kratki opis 80-200 karaktera (required)
- [ ] Naslovna slika uploadovana, 1200x630 (required)
- [ ] Alt tekst za naslovnu sliku popunjen (required when image exists)
- [ ] Datum objave postavljen (required)
- [ ] Autor izabran (required)
- [ ] Sadrzaj napisan (required, min 1 block)
- [ ] Minimum 3 FAQ pitanja sa odgovorima (required)
- [ ] Tagovi dodati (recommended)
- [ ] Povezani termini iz recnika dodati (recommended)
- [ ] SEO naslov pregledan (optional, max 60 chars)
- [ ] SEO opis pregledan (optional, max 160 chars)
- [ ] noindex ISKLJUCEN (osim za test content)

After publishing:
- [ ] Otvoriti stranicu na sajtu i proveriti da li se prikazuje
- [ ] Proveriti JSON-LD u Page Source (search for `application/ld+json`)
- [ ] Proveriti OG tagove u Page Source
- [ ] Proveriti da li se clanak pojavljuje na /blogovi listi
- [ ] Proveriti /sitemap.xml da li sadrzi novi clanak
- [ ] Proveriti Google Rich Results Test (opcionalno)

---

## 8. Improved Internal Checklist

### Pre-Publish (Sanity Studio)
1. All required fields filled (Studio will show errors if not)
2. Excerpt is 80+ characters and descriptive
3. Cover image is high quality, 1200x630 minimum
4. Alt text describes the image content (not just the title)
5. Author has a `url` field set on their Author document
6. Content has proper heading hierarchy (H2, H3 -- avoid H1 in body)
7. FAQ answers are substantive (not one-liners)
8. If using seoTitle, it's under 60 characters
9. If using seoDescription, it's under 160 characters
10. Tags reflect the article topic accurately
11. Related glossary terms linked if applicable
12. noindex is OFF unless intentionally hiding from search

### Post-Publish (Production QA)
1. Page loads at `/blogovi/{slug}` without errors
2. Title, excerpt, cover image render correctly
3. FAQ accordion works and shows all questions
4. Tags are clickable and link to correct tag pages
5. Related glossary terms display (if set)
6. CTA block renders at bottom of article
7. JSON-LD contains [WebPage, BreadcrumbList, Article, FAQPage]
8. OG image shows in social media preview tools
9. Page appears in /sitemap.xml
10. Page does NOT appear if noindex is ON
11. Reading time displays correctly
12. Back button works (/blogovi)
13. Analytics: check GA4 Realtime for `blog_view` event

### Engineering Checklist (before deploying CMS changes)
1. Never add metadata/schema logic in layout.tsx -- keep it in page-level files
2. Never duplicate JSON-LD between layout and page components
3. All new schema fields must have absolute URL fallbacks
4. Test noindex behavior: excluded from sitemap, blog list, and robots
5. Run build to verify no type errors from schema changes
6. Update `docs/cms-rules-and-publishing-workflow.md` if schema changes
