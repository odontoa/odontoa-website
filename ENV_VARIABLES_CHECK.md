# Environment Variables Check

## Required Production Environment Variables

### 1. Google Analytics 4 (GA4)

**Variable:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Status in Code:**
- ✅ **Wired in:** `src/components/GoogleAnalytics.tsx` (line 6)
- ✅ **Logic:** Component checks if `gaId` exists, returns `null` if not set (graceful degradation)
- ✅ **Usage:** Scripts load only if env variable is present

**How to verify:**
```bash
# In production, check that this env variable exists:
echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
# Should output: G-XXXXXXXXXX
```

**Where to set (Vercel):**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
3. Select environment: Production (and Preview if needed)
4. Redeploy

**Verification:**
- Open production site → View page source
- Search for `gtag/js?id=G-` → Should find GA4 script
- Check GA4 Real-Time report → Should see visits

---

### 2. Google Search Console Verification

**Variable:** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

**Status in Code:**
- ✅ **Wired in:** `src/app/layout.tsx` (line 64)
- ✅ **Logic:** Uses `|| undefined` - if not set, verification tag is not added (graceful degradation)
- ✅ **Usage:** Added to root layout metadata

**How to verify:**
```bash
# In production, check that this env variable exists:
echo $NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
# Should output: verification-code-from-gsc
```

**Where to set (Vercel):**
1. Get verification code from Google Search Console:
   - GSC → Property Settings → Ownership verification
   - Choose "HTML tag" method
   - Copy the `content` value from meta tag
2. Vercel Dashboard → Project → Settings → Environment Variables
3. Add: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = `verification-code`
4. Select environment: Production
5. Redeploy
6. Go back to GSC and click "Verify"

**Verification:**
- View page source on production homepage
- Search for `google-site-verification` → Should find meta tag
- GSC should show "Verified" status

---

### 3. Site URL (Optional but Recommended)

**Variable:** `NEXT_PUBLIC_SITE_URL`

**Status in Code:**
- ✅ **Wired in:** `src/app/(site)/blogovi/[slug]/page.tsx` (line 51)
- ✅ **Logic:** Falls back to `"https://odontoa.com"` if not set
- ✅ **Usage:** Used for canonical URLs and OG images

**Current behavior:** Hardcoded fallback to `https://odontoa.com` works, but env variable allows flexibility.

---

## Code Locations

1. **GA4:** `src/components/GoogleAnalytics.tsx:6`
2. **GSC Verification:** `src/app/layout.tsx:64`
3. **Site URL:** `src/app/(site)/blogovi/[slug]/page.tsx:51`

## Production Checklist

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel production env
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set in Vercel production env (after GSC verification)
- [ ] Both variables visible in Vercel → Settings → Environment Variables
- [ ] Redeploy after adding env variables
- [ ] Verify GA4 script loads on production (view page source)
- [ ] Verify GSC verification tag exists on production (view page source)
- [ ] Test GA4 Real-Time report shows visits
- [ ] Test GSC verification completes successfully
