# CMS Rules and Publishing Workflow

Source of truth for all Sanity CMS content operations at Odontoa.
For engineers and content editors.

---

## Purpose of the CMS System

**Sanity controls:**
- Blog post content, metadata, and SEO fields
- Glossary term content, metadata, and SEO fields
- Author profiles
- Tags/categories
- FAQ content per page
- noindex flags
- Optional SEO overrides (seoTitle, seoDescription, canonicalUrl)
- Schema override JSON (advanced, exception-only)

**The frontend generates automatically:**
- HTML metadata (title, description, OG, Twitter cards)
- JSON-LD structured data (WebPage, BreadcrumbList, Article, FAQPage)
- Canonical URLs (from baseUrl + slug, unless overridden)
- Sitemap entries (dynamic, filtered by noindex)
- robots.txt (dynamic per environment)
- llms.txt (dynamic with blog/glossary content)
- Reading time calculation
- Breadcrumb navigation

**Must NEVER be manually duplicated:**
- JSON-LD schema (auto-generated from Sanity fields; use schemaOverrideJson only as exception)
- Metadata (auto-generated from seoTitle/seoDescription with fallbacks to title/excerpt)
- Sitemap entries (auto-fetched from Sanity)
- Canonical URL (auto-generated unless custom override is needed)

---

## Content Model Rules

### Blog Post (`blogPost`)

**Required fields:**
| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| title | string | Required | Page h1 and default SEO title |
| slug | slug | Required, auto from title, max 96 | URL path: /blogovi/{slug} |
| excerpt | text | Required, 60-200 chars (80+ recommended) | Default meta description |
| coverImage | image | Required | OG image, recommended 1200x630 |
| coverImageAlt | string | Required when coverImage exists | Accessibility and image SEO |
| publishedAt | datetime | Required | datePublished in schema |
| author | reference -> author | Required | Article schema author |
| content | array (blocks + images) | Required, min 1 | Page body content |
| faqs | array of {question, answer} | Required, min 3, max 8 | Visible FAQ + FAQPage schema |

**Optional fields:**
| Field | Type | Notes |
|-------|------|-------|
| updatedAt | datetime | Falls back to publishedAt if empty |
| featured | boolean | Enables hero/pinned display |
| featuredSlot | "hero" / "pinned" | Required if featured=true |
| pinnedRank | number 1-3 | Order for pinned articles |
| tags | reference[] -> tag | Tag filtering and internal links |
| relatedGlossaryTerms | reference[] -> glossaryTerm | Cross-links to glossary |
| seoTitle | string, max 60 | Overrides title for search |
| seoDescription | text, max 160 | Overrides excerpt for search |
| canonicalUrl | url | Overrides auto-generated canonical |
| noindex | boolean | Hides from Google, sitemap, blog list |
| authorUrl | url | Fallback if author has no URL |
| breadcrumbLabel | string | Hidden, default "Blogovi" |
| schemaOverrideJson | text | Advanced: replaces auto-generated JSON-LD |

### Author Rules
- Each author document must have a `url` field set (used in Article schema)
- If author.url is empty, the system falls back to authorUrl on the post, then to /o-nama
- Author name appears in Article schema and on the page

### FAQ Rules
- Minimum 3 FAQ items per blog post (enforced by Sanity validation)
- Maximum 8 FAQ items
- Each item must have a question (string) and answer (PortableText)
- FAQ visible section and JSON-LD FAQPage use the SAME data (1:1 match guaranteed)
- FAQ schema is ONLY included in JSON-LD when FAQs exist

### Image + Alt Text Rules
- coverImage is required for blog posts
- coverImageAlt is required when coverImage exists
- Images should be 1200x630 for optimal OG display
- Alt text should describe the image content, not repeat the title
- Image URLs are built via `urlFor()` from Sanity CDN (absolute URLs)

### Slug Rules
- Auto-generated from title, max 96 characters
- Must be unique within document type (Sanity enforces)
- Cannot be changed after publish without redirect planning
- Used in: URL path, canonical URL, sitemap, internal links

### Canonical Rules
- Auto-generated: `https://odontoa.com/blogovi/{slug}` or `https://odontoa.com/recnik/{slug}`
- Override only when content is syndicated or moved
- Must be an absolute URL if overridden

### noindex Rules
- Default: false (content is indexed)
- When true: page gets `noindex, nofollow` robots meta
- When true: excluded from sitemap
- When true: excluded from blog list page (allBlogPostsQuery filters noindex)
- When true: excluded from featured posts queries
- Use for: test content, draft previews, temporary pages

### Internal Linking Rules
- Blog posts can reference glossary terms via `relatedGlossaryTerms`
- Glossary terms can reference blog posts via `relatedBlogPosts`
- Glossary terms can reference other glossary terms via `relatedTerms`
- Tags link blog posts to tag pages (/blogovi/tag/{slug})
- All cross-references are rendered as clickable links on the frontend

---

## Structured Data Rules

### Schema types used
Every blog post and glossary term page generates a combined JSON-LD array:
```
[WebPage, BreadcrumbList, Article, FAQPage?]
```

FAQPage is included only when FAQs exist (conditional).

### Where schema is generated
- Blog: `src/lib/structured-data/blog-jsonld.ts` -> `buildBlogJsonLd()`
- Glossary: `src/lib/structured-data/glossary-jsonld.ts` -> `buildGlossaryJsonLd()`
- Rendered as single `<script type="application/ld+json">` in each page component

### Required fields in schema
- WebPage: @context, @type, @id, url, name, description, inLanguage: "sr", datePublished, dateModified, author, publisher
- BreadcrumbList: 3+ items (Home > Section > Title)
- Article: headline, description, image, datePublished, dateModified, author (Person with url), publisher (Organization), inLanguage: "sr", mainEntityOfPage
- FAQPage: mainEntity array of Question/Answer pairs

### FAQ visible content parity
The same `post.faqs` / `term.faqs` array is used for:
1. Visible accordion UI on the page
2. FAQPage schema in JSON-LD
Both use the same condition: `faqs && faqs.length > 0`

### Duplicate JSON-LD prevention
- `@context: "https://schema.org"` appears ONLY on the first object in the array
- schemaOverrideJson REPLACES (does not append to) auto-generated schema
- No layout-level JSON-LD exists -- schema is only in page components
- Only ONE `<script type="application/ld+json">` per page

### Absolute URL requirements
All URLs in JSON-LD must be absolute:
- Page URLs: `${baseUrl}/blogovi/${slug}` or `${baseUrl}/recnik/${slug}`
- Image URLs: Sanity CDN URL or `${baseUrl}/og/odontoa-default.png`
- Author URLs: `author.url` or fallback to `${baseUrl}/o-nama`
- Publisher logo: `${baseUrl}/images/Odontoa-New-logo-pack-2026/horiyotal_color.png`

### ISO date requirements
- `datePublished`: `new Date(post.publishedAt).toISOString()`
- `dateModified`: `new Date(post.updatedAt || post.publishedAt).toISOString()`

### Author URL requirements
Author URL is required in Article schema. Fallback chain:
1. `author.url` (from Author document)
2. `post.authorUrl` (post-level fallback)
3. `${baseUrl}/o-nama` (system fallback)

---

## SEO Metadata Rules

### Title rules
- Format: `{seoTitle || title} -- Odontoa`
- seoTitle max 60 characters (enforced in Sanity)
- If seoTitle is empty, title is used

### Meta description rules
- Uses: seoDescription || excerpt || ""
- seoDescription max 160 characters (enforced in Sanity)
- If both empty, description will be empty string (bad -- excerpt is now required to prevent this)

### OG/Twitter rules
- OG type: "article" for blog and glossary
- OG image: 1200x630 from coverImage or default fallback
- OG locale: sr_RS
- Twitter card: summary_large_image
- publishedTime and modifiedTime from Sanity dates

### Canonical logic
- Set in `alternates.canonical` in Next.js metadata
- Value: `post.canonicalUrl || ${baseUrl}/blogovi/${slug}`
- Glossary: `term.canonicalUrl || ${baseUrl}/recnik/${slug}`

### Fallback rules
| Field | Fallback chain |
|-------|---------------|
| Title | seoTitle -> title |
| Description | seoDescription -> excerpt -> "" |
| Image | coverImage (Sanity CDN) -> /og/odontoa-default.png |
| Author name | author.name -> "Odontoa tim" |
| Author URL | author.url -> authorUrl -> /o-nama |
| dateModified | updatedAt -> publishedAt |

### What is auto-generated vs manually overridden
| Field | Auto | Manual override |
|-------|------|----------------|
| Title tag | From post title | seoTitle |
| Meta description | From excerpt | seoDescription |
| Canonical URL | From baseUrl + slug | canonicalUrl |
| JSON-LD | Auto-built from all fields | schemaOverrideJson (exception-only) |
| OG image | From coverImage | N/A |
| Robots | index,follow by default | noindex toggle |

---

## Editorial Publishing Workflow

### Creating a new blog post in Sanity Studio

1. **Create document**: New > Blog Post
2. **Title**: Write the article title (will auto-generate slug)
3. **Slug**: Review auto-generated slug, edit if needed
4. **Excerpt**: Write 80-200 character summary (used as meta description)
5. **Cover Image**: Upload 1200x630 image
6. **Cover Image Alt**: Write descriptive alt text
7. **Published At**: Set to current date/time
8. **Author**: Select author from dropdown
9. **Content**: Write article body using PortableText editor
   - Use H2 for main sections, H3 for subsections
   - Do NOT use H1 in body (page title is H1)
   - Add images with alt text
10. **FAQs**: Add minimum 3 FAQ items with questions and PortableText answers
11. **Tags**: Add relevant tags
12. **Related Glossary Terms**: Link to relevant glossary terms (optional)
13. **Review SEO fields**: Check seoTitle (max 60) and seoDescription (max 160) if needed
14. **Publish**

### Pre-publish checklist
- [ ] Title is descriptive and under 60 characters
- [ ] Excerpt is 80-200 characters
- [ ] Cover image uploaded (1200x630)
- [ ] Alt text written for cover image
- [ ] Author selected
- [ ] Content written with proper heading hierarchy
- [ ] Minimum 3 FAQs with substantive answers
- [ ] Tags added
- [ ] noindex is OFF

### Post-publish QA checklist
- [ ] Page loads at /blogovi/{slug}
- [ ] Title, image, content render correctly
- [ ] FAQ accordion works
- [ ] Tags are clickable links
- [ ] CTA block visible at bottom
- [ ] Check page source for valid JSON-LD
- [ ] Check /sitemap.xml includes the new post
- [ ] Check GA4 Realtime for blog_view event

---

## Engineering Workflow Rules

### Where to add or change CMS fields
- Blog schema: `sanity/schemaTypes/blogPost.ts`
- Glossary schema: `sanity/schemaTypes/glossaryTerm.ts`
- Author schema: `sanity/schemaTypes/author.ts`
- Tag schema: `sanity/schemaTypes/tag.ts`

After adding fields:
1. Update GROQ query in `src/lib/sanity.queries.ts`
2. Update TypeScript type (`SanityBlogPost` or `SanityGlossaryTerm`)
3. Update page component to render new field
4. Update this document

### Where to update mappings
- GROQ queries: `src/lib/sanity.queries.ts`
- TypeScript types: same file

### Where metadata logic lives
- Blog metadata: `src/app/(site)/blogovi/[slug]/page.tsx` -> `generateMetadata()`
- Glossary metadata: `src/app/recnik/[slug]/page.tsx` -> `generateMetadata()`
- Root metadata: `src/app/layout.tsx`

### Where schema logic lives
- Blog JSON-LD: `src/lib/structured-data/blog-jsonld.ts`
- Glossary JSON-LD: `src/lib/structured-data/glossary-jsonld.ts`

### Where sitemap logic lives
- `src/app/sitemap.ts`

### Where llms.txt logic lives
- `src/app/api/llms/route.ts` (rewritten from /llms.txt via next.config.js)

### How to safely extend the system without breaking SEO
1. Add field to Sanity schema with proper validation
2. Add to GROQ query (only the detail query that needs it)
3. Add to TypeScript type
4. If it affects metadata: update generateMetadata in the page file
5. If it affects JSON-LD: update the builder in structured-data/
6. If it affects sitemap: update sitemap.ts
7. Never add schema/metadata in layout.tsx files
8. Always use absolute URLs for any URL field in schema
9. Test with Google Rich Results Test after deploying

---

## Guardrails

### Things developers must NEVER do
- Add JSON-LD in layout.tsx (creates duplicates)
- Use relative URLs in structured data
- Hardcode dates (use Sanity's datetime fields)
- Skip the TypeScript type update when adding GROQ fields
- Put metadata generation logic in client components
- Remove noindex filtering from queries without understanding implications
- Add `@context` to more than the first JSON-LD object in the array

### Things editors must NEVER do
- Publish without excerpt (will cause empty meta description)
- Publish without cover image (will use generic fallback)
- Publish without FAQs (schema will be incomplete)
- Use schemaOverrideJson unless specifically instructed by engineering
- Set noindex on production content by accident
- Change slug after publishing without coordinating redirects

### Anti-patterns to avoid
- Duplicating schema logic across multiple files
- Adding metadata in both layout and page files for the same route
- Using `coverImage` as a URL string (always use `urlFor()` builder)
- Fetching all Sanity data when only specific fields are needed
- Hardcoding `https://odontoa.com` everywhere (use `process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com"`)

### Common failure cases
- Empty excerpt -> empty meta description in OG
- Missing author -> "Odontoa tim" fallback in schema (acceptable but not ideal)
- Missing coverImageAlt -> falls back to post.title (acceptable but not optimal)
- Invalid schemaOverrideJson -> falls back to auto-generated (logged as error)
- Sanity CDN down -> images fail to load (CDN is highly reliable)

---

## Future Extension Rules

### How to add new content types safely
1. Create schema in `sanity/schemaTypes/`
2. Register in `sanity/schemaTypes/index.ts`
3. Create GROQ queries and TypeScript types in `sanity.queries.ts`
4. Create page route in `src/app/`
5. Create JSON-LD builder in `src/lib/structured-data/`
6. Add to sitemap.ts
7. Add to llms.txt route if user-facing
8. Update this document

### How to extend blog schema
1. Add field to `sanity/schemaTypes/blogPost.ts`
2. Add to `blogPostBySlugQuery` in `sanity.queries.ts`
3. Add to `SanityBlogPost` type
4. Use in page component or JSON-LD builder as needed
5. Update this document

### How to add new schema types without duplication
- All JSON-LD builders live in `src/lib/structured-data/`
- Each page has exactly one `<script type="application/ld+json">`
- New schema types (e.g., Product, Event) should be added to the existing array returned by the builder
- Never create a second script tag on the same page

### How to preserve centralized SEO architecture
- Metadata: always in `generateMetadata()` function in page files
- JSON-LD: always via builder functions in `src/lib/structured-data/`
- Sitemap: always in `src/app/sitemap.ts`
- No SEO logic in components or utilities outside these locations
