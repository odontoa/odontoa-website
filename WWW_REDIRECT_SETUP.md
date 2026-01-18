# www/non-www 301 Redirect Setup

## Canonical Domain Choice

**Odontoa canonical domen:** `https://odontoa.com` (non-www)

Ovo je potvrđeno u kodu:
- `src/app/layout.tsx` - `metadataBase: new URL('https://odontoa.com')`
- Svi `baseUrl` u kodu koriste `https://odontoa.com`
- Sitemap, llms.txt i sve URL reference koriste non-www verziju

## Where to Configure Redirects

### Option 1: Vercel (Recommended)

Ako koristiš **Vercel** za hosting:

1. **Vercel Dashboard → Project Settings → Domains**
2. Dodaj oba domena:
   - `odontoa.com` (primary)
   - `www.odontoa.com` (redirect)
3. **Vercel automatski** postavlja 301 redirect sa `www.odontoa.com` → `odontoa.com`

**Vercel automatski rešava:**
- `www.odontoa.com` → `odontoa.com` (301)
- `http://odontoa.com` → `https://odontoa.com` (301)
- `http://www.odontoa.com` → `https://odontoa.com` (301)

**Provera:** Nakon deploy-a, testiraj:
```bash
curl -I http://www.odontoa.com
# Treba: HTTP/1.1 301 Moved Permanently
# Location: https://odontoa.com
```

### Option 2: DNS/Registrar Level

Ako **ne koristiš Vercel**, konfiguriši na nivou DNS-a:

1. **DNS Settings** (kod registrara domena):
   - `A` record za `odontoa.com` → Vercel IP
   - `CNAME` record za `www.odontoa.com` → `cname.vercel-dns.com` (ili tvoj hosting)

2. **Hosting Provider Settings:**
   - Dodaj redirect rule: `www.odontoa.com` → `odontoa.com` (301)

### Option 3: Next.js Middleware (Fallback) ✅ IMPLEMENTIRANO

**Status:** ✅ Middleware je već implementiran u `src/middleware.ts`

Middleware osigurava redirecte kao fallback opciju, čak i ako hosting platforma (kao što je Vercel) automatski rešava redirecte. Ovo osigurava kompatibilnost sa svim hosting platformama.

**Implementacija:**
- ✅ `src/middleware.ts` - Redirect middleware implementiran
- ✅ www.odontoa.com → odontoa.com (301)
- ✅ http → https (301) - samo u production
- ✅ Ne utiče na SEO endpoint-e (robots.txt, sitemap.xml, llms.txt)

**Napomena:** Vercel automatski rešava redirecte, ali middleware osigurava da redirecti rade i na drugim hosting platformama.

## Verification Checklist

- [ ] `www.odontoa.com` → `https://odontoa.com` (301)
- [ ] `http://odontoa.com` → `https://odontoa.com` (301)
- [ ] `http://www.odontoa.com` → `https://odontoa.com` (301)
- [ ] `https://www.odontoa.com` → `https://odontoa.com` (301)
- [ ] Svi redirecti vraćaju HTTP status **301** (ne 302)

## Testing Commands

```bash
# Test www redirect
curl -I https://www.odontoa.com
# Expected: HTTP/1.1 301 Moved Permanently
# Expected: Location: https://odontoa.com

# Test http redirect
curl -I http://odontoa.com
# Expected: HTTP/1.1 301 Moved Permanently
# Expected: Location: https://odontoa.com
```
