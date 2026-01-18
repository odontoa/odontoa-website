# Post-Launch Test List

## Production Verification Checklist

### 1. Non-Negotiables (Must-Pass)

- [ ] **robots.txt, sitemap.xml, llms.txt return 200**
  - Test: `curl -I https://odontoa.com/robots.txt` → Should be 200
  - Test: `curl -I https://odontoa.com/sitemap.xml` → Should be 200
  - Test: `curl -I https://odontoa.com/llms.txt` → Should be 200

- [ ] **No duplicate JSON-LD blocks**
  - Test: View page source on any page → Search "application/ld+json" → Should find only ONE script tag

- [ ] **FAQ visible in content (1:1 match)**
  - Test: Open blog post with FAQ → Compare FAQ in schema vs visible HTML → Must match exactly

- [ ] **GA4 works and events visible in Realtime**
  - Test: Visit site → Open GA4 Real-Time report → Should see visit
  - Test: Click CTA → Should see `cta_click` event in Realtime

---

### 2. Domain & Redirects

- [ ] **www redirects to non-www (301)**
  - Test: `curl -I https://www.odontoa.com` → Should be 301 → `https://odontoa.com`

- [ ] **http redirects to https (301)**
  - Test: `curl -I http://odontoa.com` → Should be 301 → `https://odontoa.com`

- [ ] **Canonical domain is consistent**
  - Test: Visit `www.odontoa.com` → Final URL should be `https://odontoa.com`
  - Test: View page source → Canonical tag should show `https://odontoa.com`

---

### 3. Rich Results Test (Google Rich Results Test)

**Test these 3 URLs:**

1. **Homepage:**
   - URL: `https://odontoa.com`
   - Expected: WebPage + BreadcrumbList schemas
   - Tool: https://search.google.com/test/rich-results

2. **Blog Post:**
   - URL: `https://odontoa.com/blogovi/[any-published-slug]`
   - Expected: WebPage + BreadcrumbList + Article + FAQPage schemas
   - Tool: https://search.google.com/test/rich-results

3. **Glossary Term:**
   - URL: `https://odontoa.com/recnik/[any-published-slug]`
   - Expected: WebPage + BreadcrumbList + Article + FAQPage schemas
   - Tool: https://search.google.com/test/rich-results

**Acceptable results:**
- ✅ No errors (red)
- ⚠️ Warnings (yellow) are OK
- ✅ All expected schema types detected

---

### 4. Google Search Console

- [ ] **Domain verified**
  - Test: GSC → Property Settings → Should show "Verified"
  - Test: View page source → Should have `google-site-verification` meta tag

- [ ] **Sitemap submitted and status "Success"**
  - Test: GSC → Sitemaps → `https://odontoa.com/sitemap.xml` → Status should be "Success"
  - Test: URL count should match actual number of pages

- [ ] **Coverage report - no critical errors**
  - Test: GSC → Coverage → Check for 404, 500 errors
  - Test: Valid pages count should be increasing

- [ ] **Enhancements - Rich Results status**
  - Test: GSC → Enhancements → Check FAQ, Article, Breadcrumbs status
  - Test: Should show valid rich results (no critical errors)

---

### 5. GA4 Production Check

- [ ] **GA4 script loads**
  - Test: View page source → Search `gtag/js?id=` → Should find script
  - Test: Browser DevTools → Network → Should see GA4 requests

- [ ] **Key events tracked**
  - Test: Click CTA → GA4 Realtime → Should see `cta_click`
  - Test: Submit contact form → GA4 Realtime → Should see `contact_form_submit`
  - Test: View blog post → GA4 Realtime → Should see `blog_view`

- [ ] **Events marked as conversions**
  - Test: GA4 → Admin → Events → Key events should be marked as "Conversions"
  - Test: GA4 → Reports → Conversions → Should show conversion data

---

### 6. Canonical URLs

- [ ] **All pages have canonical**
  - Test: Homepage → View source → Should have `<link rel="canonical">`
  - Test: Blog post → View source → Should have canonical pointing to correct URL
  - Test: Glossary term → View source → Should have canonical pointing to correct URL

- [ ] **Canonical URLs are absolute and correct**
  - Test: Canonical should be `https://odontoa.com/...` (not relative)
  - Test: Canonical should match final URL (no trailing slash issues)

---

### 7. Metadata Quality

- [ ] **Title and description length**
  - Test: Homepage title → Should be ≤ 60 characters
  - Test: Meta description → Should be ≤ 160 characters
  - Test: Blog post titles → Should be unique and ≤ 60 characters

- [ ] **OG and Twitter tags present**
  - Test: View page source → Should have `og:title`, `og:description`, `og:image`
  - Test: Should have `twitter:card`, `twitter:title`, `twitter:description`

---

### 8. Schema Validation

- [ ] **BreadcrumbList has minimum 3 items**
  - Test: View page source → Find BreadcrumbList in JSON-LD → Should have ≥ 3 items

- [ ] **Article schema has required fields**
  - Test: Blog post → JSON-LD → Article should have: headline, author.url, image, datePublished, inLanguage

- [ ] **Dates in ISO 8601 format**
  - Test: JSON-LD → datePublished should be `2025-01-27T10:00:00+02:00` format (not "Jan 27, 2025")

---

## Quick Test Commands

```bash
# Test redirects
curl -I https://www.odontoa.com
curl -I http://odontoa.com

# Test endpoints
curl -I https://odontoa.com/robots.txt
curl -I https://odontoa.com/sitemap.xml
curl -I https://odontoa.com/llms.txt

# Test canonical (view in browser)
# Open: https://odontoa.com/blogovi/[slug]
# View page source → Search "canonical"
```

---

## Priority Order

1. **Critical (Must fix before launch):**
   - www/non-www redirects (301)
   - robots.txt, sitemap.xml, llms.txt return 200
   - Canonical URLs on all pages
   - GA4 working

2. **Important (Fix within 24h):**
   - GSC verification
   - Sitemap submission
   - Rich Results test (no errors)

3. **Nice to have (Fix within week):**
   - Events marked as conversions
   - GSC Coverage monitoring
   - Schema enhancements
