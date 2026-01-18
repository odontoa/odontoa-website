# **SEO, GEO and AI Launch Checklist (EN)**

## **Purpose**

This checklist is the standard we use to ensure every website is ready for:

* Google SEO and Rich Results  
* AI crawlers and LLM discoverability (GEO)  
* Programmatic SEO scaling  
* Reliable conversion measurement

## **How to use**

1. Go through sections in order. Do not skip the "Launch Gate".  
2. Complete **Pre-launch** items first (code and configuration), then **Post-launch** items (Google tools and production checks).  
3. Mark every item as **TODO** or **DONE**.  
4. If an item is not applicable, mark **DONE** and add a short note.

## **Non-negotiables (must-pass)**

* The canonical domain is unique and redirects are correct.  
* **/robots.txt**, **/sitemap.xml** and **/llms.txt** work in production and return **200**.  
* There are no duplicate **JSON-LD** blocks on a page.  
* If **FAQ schema** exists, the FAQ must also exist in visible content (1:1).  
* **GA4** works and key events show up in **Realtime**.

## **1\) Domain and canonical**

### **1.1 Single canonical domain (Pre-launch)**

**What we do:** Choose one domain version (https and either www or non-www) as canonical.

**Why it matters:** Prevents duplicate content and preserves SEO authority.

**How to verify:** Open different domain variants and confirm they all resolve to the canonical version.

**Status:** ☐ TODO ☐ DONE

### **1.2 Redirects to canonical (Pre-launch)**

**What we do:** Redirect all domain variants to the canonical (www, non-www, http).

**Why it matters:** Google and AI crawlers get a single source of truth for URLs.

**How to verify:** Test multiple domain variants and confirm the final URL is always the same. Check the redirect HTTP status code, it should be 301\.

**Status:** ☐ TODO ☐ DONE

### **1.3 Canonical URL on all indexable pages (Pre-launch)**

**What we do:** Every page that should be indexed has a canonical URL.

**Why it matters:** Helps Google pick the correct version and prevents duplicates.

**How to verify:** Check canonical on both static and dynamic pages (especially blog posts and glossary terms) and confirm it matches the correct final URL.

**Status:** ☐ TODO ☐ DONE

## **2\) Crawl and indexing basics**

### **2.1 robots.txt (Pre-launch)**

**What we do:** Publish a robots.txt that does not block important pages and includes the sitemap link.

**Why it matters:** Without this, Google and AI crawlers may crawl incorrectly or miss content.

**How to verify:** Open /robots.txt and confirm it includes a Sitemap line. Confirm it does not block key sections such as /blog, /glossary, or other critical routes.

**Status:** ☐ TODO ☐ DONE

### **2.2 sitemap.xml (Pre-launch)**

**What we do:** Generate a sitemap.xml that covers all important public pages and updates automatically.

**Why it matters:** Speeds up indexing and provides Google with a site map.

**How to verify:** Open /sitemap.xml and confirm URLs are complete and do not include test or private routes.

**Status:** ☐ TODO ☐ DONE

### **2.3 llms.txt (Pre-launch)**

**What we do:** Publish an llms.txt that clearly explains who we are, what we do, who it is for, and key links.

**Why it matters:** Helps AI systems accurately understand the product and the site content.

**How to verify:** Open /llms.txt and confirm the description matches the product and that links point to the correct pages.

**Status:** ☐ TODO ☐ DONE

### **2.4 Production 200 checks (Post-launch)**

**What we do:** Confirm robots, sitemap and llms endpoints work in production without errors.

**Why it matters:** Everything above is useless if these endpoints fail in the real environment.

**How to verify:** Open /robots.txt, /sitemap.xml and /llms.txt on production and confirm they return 200\.

**Status:** ☐ TODO ☐ DONE

## **3\) SEO metadata standard**

### **3.1 Title and meta description per page (Pre-launch)**

**What we do:** Every page has a unique title and meta description.

**Why it matters:** Directly impacts CTR and indexing quality.

**How to verify:** Check key pages to ensure title and description are not empty or duplicated. Check length guidance: title up to about 60 characters, meta description up to about 160\.

**Status:** ☐ TODO ☐ DONE

### **3.2 OpenGraph and Twitter meta (Pre-launch)**

**What we do:** Add OG and Twitter metadata for link sharing.

**Why it matters:** Improves preview quality and click-through rate when links are shared.

**How to verify:** Confirm the page has an OG title, description and image.

**Status:** ☐ TODO ☐ DONE

### **3.3 noindex rule (Pre-launch)**

**What we do:** Use noindex only for test, duplicate or temporary pages.

**Why it matters:** Prevents accidentally removing important pages from search indexes.

**How to verify:** Confirm key pages are not marked as noindex.

**Status:** ☐ TODO ☐ DONE

## **4\) Structured data and Google Rich Results**

### **4.1 One central schema per page (Pre-launch)**

**What we do:** Render a single JSON-LD schema output per page and prevent duplicates.

**Why it matters:** Duplicates trigger Rich Results errors and confuse crawlers.

**How to verify:** Confirm the schema is present only once.

**Status:** ☐ TODO ☐ DONE

### **4.2 Required schema blocks (Pre-launch)**

**What we do:** Standard blocks are WebPage, BreadcrumbList, Article (for content), and FAQPage (when FAQ exists).

**Why it matters:** Increases Rich Results eligibility and improves AI extraction.

**How to verify:** Blog pages include Article. Pages with FAQ include FAQPage. BreadcrumbList has at least 3 items (Home → Section → Page). Article must include: headline, author.url (absolute URL), image (absolute URL), datePublished (ISO 8601), inLanguage.

Note: All schema dates (datePublished, dateModified) must be ISO 8601 with timezone.

**Status:** ☐ TODO ☐ DONE

### **4.3 FAQ hard rule (Pre-launch)**

**What we do:** Use FAQ schema only if the FAQ is visible on the page and content matches 1:1.

**Why it matters:** Google may reject FAQ rich snippets if FAQ is not visible or does not match schema.

**How to verify:** Compare visible FAQ and FAQ in schema. They must match exactly.

**Status:** ☐ TODO ☐ DONE

### **4.4 Breadcrumb hard rule (Pre-launch)**

**What we do:** Breadcrumb schema must match real navigation and URL structure.

**Why it matters:** Incorrect breadcrumbs create Rich Results errors and send wrong signals.

**How to verify:** Breadcrumb path is real and links point to correct pages. Breadcrumb labels in schema match what is visible on the page (1:1).

**Status:** ☐ TODO ☐ DONE

### **4.5 Rich Results testing (Post-launch)**

**What we do:** Test representative pages (home, a blog post, a glossary term).

**Why it matters:** Catches issues before they impact visibility.

**How to verify:** Rich Results tests show no critical errors.

**Status:** ☐ TODO ☐ DONE

## **5\) Google Search Console (GSC)**

### **5.1 Domain verification (Post-launch)**

**What we do:** Verify domain ownership in Google Search Console.

**Why it matters:** Without GSC you cannot control indexing or receive critical warnings.

**How to verify:** The property is Verified and matches the canonical domain.

**Status:** ☐ TODO ☐ DONE

### **5.2 Sitemap submission (Post-launch)**

**What we do:** Submit the sitemap in GSC.

**Why it matters:** Speeds indexing and reveals sitemap issues.

**How to verify:** Status is Success and URL count makes sense.

**Status:** ☐ TODO ☐ DONE

### **5.3 Monitoring: Coverage and Enhancements (Post-launch)**

**What we do:** Monitor Coverage and Enhancements for indexing and rich results issues.

**Why it matters:** Early detection prevents long-term visibility loss.

**How to verify:** No growing Error items and no critical Enhancements errors.

**Status:** ☐ TODO ☐ DONE

### **5.4 Request indexing for key pages (Post-launch)**

**What we do:** Request indexing for the most important pages after launch or major updates.

**Why it matters:** Speeds up index entry when timing matters.

**How to verify:** In GSC use URL Inspection and Request Indexing for the homepage, main landing pages, and new content. Confirm the request is submitted.

**Status:** ☐ TODO ☐ DONE

## **6\) Analytics and conversions (GA4)**

### **6.1 GA4 works in production (Pre-launch)**

**What we do:** Configure GA4 so it measures visits in production.

**Why it matters:** Without measurement there is no growth control and no SEO ROI proof.

**How to verify:** In GA4 Realtime you can see your visit when you open the site.

**Status:** ☐ TODO ☐ DONE

### **6.2 Key events (Pre-launch)**

**What we do:** Track a minimal set of events that map to business outcomes (CTA click, contact, demo, views).

**Why it matters:** Enables conversion optimization and user behavior insight.

**How to verify:** In Realtime or Debug you see an event when you click a CTA or submit a form.

**Status:** ☐ TODO ☐ DONE

### **6.3 Conversions in GA4 (Post-launch)**

**What we do:** Mark the most important events as conversions in GA4.

**Why it matters:** Conversions are the foundation for KPIs and reporting.

**How to verify:** In GA4 conversions, the selected events are enabled and counted.

**Status:** ☐ TODO ☐ DONE

## **7\) CMS standard (Sanity) for blog and glossary**

### **7.1 Sanity as input, site as generator (Pre-launch)**

**What we do:** CMS stores content and SEO inputs, while the site auto-generates metadata, schema and sitemap.

**Why it matters:** Reduces manual work, errors and technical debt.

**How to verify:** Publish a test post and confirm it appears on the site, in sitemap, and has schema.

**Status:** ☐ TODO ☐ DONE

### **7.2 Required blog fields (Pre-launch)**

**What we do:** Required: title, slug, excerpt, cover image and alt, publish date, FAQ minimum 3\.

**Why it matters:** Ensures consistent quality and Rich Results readiness.

**How to verify:** Try publishing without these fields and confirm validation blocks publication. Confirm FAQs are visible in the HTML content, not only in schema.

**Status:** ☐ TODO ☐ DONE

### **7.3 SEO override fields (Pre-launch)**

**What we do:** Use seoTitle, metaDescription, canonical override and noindex when needed.

**Why it matters:** Gives control without code changes.

**How to verify:** Set an override on one post and confirm it is reflected on the page.

**Status:** ☐ TODO ☐ DONE

### **7.4 Author URL rule (Pre-launch)**

**What we do:** Store author URL on the Author document. A blog post level authorUrl is a fallback only.

**Why it matters:** Avoids duplication and keeps author data consistent.

**How to verify:** Confirm the author link is generated from the Author document when available.

**Status:** ☐ TODO ☐ DONE

### **7.5 Schema override as exception (Pre-launch)**

**What we do:** Use schema override rarely, only when the standard schema cannot cover a case.

**Why it matters:** Reduces duplication and schema errors.

**How to verify:** If override is active, confirm there are no duplicate schema blocks.

**Status:** ☐ TODO ☐ DONE

## **8\) Sanity Integration Best Practices (Pre-launch)**

### **8.1 Central Sanity Client Setup**

**What we do:** Use a single central Sanity client in `src/lib/sanity.client.ts` with `@sanity/client`, `perspective: "published"`, no token in runtime, and `useCdn` based on NODE_ENV.

**Why it matters:** Ensures consistency, security (no tokens in runtime), and optimal performance (CDN in production).

**How to verify:** Confirm that `sanityClient` from `@/lib/sanity.client` is used everywhere (blog + glossary + sitemap), there are no inline client functions, and no tokens in runtime code.

**Status:** ☐ TODO ☐ DONE

### **8.2 Query Optimization for Performance**

**What we do:** Create lightweight "directory" query for lists (only needed fields), "full" query for detail pages, and a separate "sitemap" query with minimal fields and GROQ filters.

**Why it matters:** Reduces payload and speeds up loading when lists grow (500+ terms). Sitemap query with GROQ filters is more efficient than JavaScript filters.

**How to verify:** Confirm directory query returns only `term`, `slug`, `category`, `publishedAt`, `updatedAt` (without `fullArticle`, `faqs`, `coverImage`). Confirm sitemap query filters `coalesce(noindex, false) == false` directly in GROQ.

**Status:** ☐ TODO ☐ DONE

### **8.3 Cache Control for Faster Updates**

**What we do:** List pages have `revalidate: 300` (5 min) in production for faster updates, detail pages `revalidate: 3600` (1 hour) because new slugs render immediately. Development uses `revalidate: 0`.

**Why it matters:** New terms/posts are visible faster without rebuild, and detail pages use ISR caching for performance.

**How to verify:** Confirm `/recnik` and `/blogovi` have `revalidate: 300` in production, and `/recnik/[slug]` and `/blogovi/[slug]` have `revalidate: 3600`. Confirm detail pages don't have `generateStaticParams` (dynamic rendering).

**Status:** ☐ TODO ☐ DONE

### **8.4 Token Security**

**What we do:** `SANITY_WRITE_TOKEN` is used only in scripts (never in runtime), no `NEXT_PUBLIC_` prefix for tokens, import script has clear error message, and README documents token rotation/deletion after import.

**Why it matters:** Tokens in runtime code pose a security risk. Token rotation after bulk import is a best practice.

**How to verify:** Confirm no token has `NEXT_PUBLIC_` prefix. Confirm `src/lib/sanity.client.ts` doesn't use a token. Confirm import script uses only `SANITY_WRITE_TOKEN` and has a clear error message.

**Status:** ☐ TODO ☐ DONE

### **8.5 Indexing Security**

**What we do:** `generateMetadata` sets `robots: { index: false, follow: false }` when `noindex === true`, sitemap filters noindex terms, and JSON-LD schema respects noindex flag.

**Why it matters:** Ensures noindex terms are not in sitemap and have correct robots meta tags.

**How to verify:** Confirm a term with `noindex: true` has `robots: { index: false }` in metadata. Confirm sitemap doesn't contain noindex terms. Confirm JSON-LD schema doesn't generate for noindex pages if needed.

**Status:** ☐ TODO ☐ DONE

### **8.6 Performance Hardening for Large Lists**

**What we do:** Directory query returns only needed fields (without `fullArticle`, `faqs`, `coverImage`, etc.), sitemap query returns minimal fields (`slug`, `_updatedAt`), and bulk import is supported (batch processing per 100+).

**Why it matters:** When lists grow to 500+ terms, optimized queries significantly reduce payload and speed up loading.

**How to verify:** Confirm directory query doesn't return heavy fields. Confirm sitemap query returns only `slug` and `_updatedAt`. Test bulk import with 100+ terms and verify performance.

**Status:** ☐ TODO ☐ DONE

### **8.7 Draft Filters in GROQ Queries**

**What we do:** All GROQ queries have `!(_id in path("drafts.**"))` and `defined(publishedAt)` filters as additional security beyond `perspective: "published"`.

**Why it matters:** Double protection ensures draft documents never end up in production, even if perspective changes.

**How to verify:** Confirm all glossary and blog queries have both filters. Confirm sitemap query also has these filters.

**Status:** ☐ TODO ☐ DONE

## **9\) Programmatic SEO readiness**

### **8.1 Clean URL structure (Pre-launch)**

**What we do:** Keep URLs stable and scalable.

**Why it matters:** Programmatic SEO requires consistency and predictable patterns.

**How to verify:** Confirm there are no duplicate routes for the same content and legacy URLs work via redirects.

**Status:** ☐ TODO ☐ DONE

### **8.2 Centralized SEO and schema logic (Pre-launch)**

**What we do:** Centralize metadata and schema rules instead of scattering them across pages.

**Why it matters:** Speeds scaling and reduces errors.

**How to verify:** A rule change in one place applies consistently across all relevant pages.

**Status:** ☐ TODO ☐ DONE

## **10\) Launch Gate (must-pass)**

### **10.1 Final checks (Post-launch)**

**What we do:** Perform a final verification pass before and immediately after launch.

**Why it matters:** One missed item can block indexing or break measurement.

**How to verify:** Confirm Non-negotiables, run Rich Results tests, check GA4 Realtime, and validate GSC status.

**Status:** ☐ TODO ☐ DONE

## **Workflow: publishing a blog post (Sanity → site)**

* Editor fills in title, content, excerpt, cover image and alt, publish date, and adds 3 to 8 FAQs.  
* If needed, editor sets SEO overrides and tags.  
* Editor clicks Publish.  
* The site auto-generates metadata and schema for the page.  
* The site auto-updates sitemap and the page is ready for indexing.

## **Common pitfalls (12 most frequent)**

1. Multiple domain variants without canonical and redirects  
2. robots.txt blocks important pages  
3. sitemap.xml misses dynamic pages or is not updated  
4. llms.txt describes the wrong business type  
5. Duplicate JSON-LD on the same page  
6. FAQ schema exists but FAQ is not visible or does not match 1:1  
7. Breadcrumb schema does not match real navigation  
8. noindex accidentally enabled on important pages  
9. GA4 not working in production or events not firing  
10. GSC not verified or sitemap not submitted successfully
11. Sanity client with token in runtime code (security risk)  
12. Queries without draft filters or optimization for large lists (performance issue)