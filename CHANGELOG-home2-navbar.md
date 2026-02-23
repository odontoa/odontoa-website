# Changelog: Home2 Navbar Simplification

## Summary
Simplified navbar on `/home2` only: fewer links, reduced visual noise, cleaner premium feel. Main homepage (`/`) unchanged.

---

## Files Changed

### `src/components/Navigation.tsx`
- **Added** `usePathname` from `next/navigation` for route detection
- **Added** `HOME2_MENU_ITEMS`: Početna, Blogovi, Kontakt (3 links only)
- **Added** `FULL_MENU_ITEMS` (renamed from inline array) for default/main site
- **Logic**: When `pathname === '/home2'`, use `HOME2_MENU_ITEMS`; otherwise use `FULL_MENU_ITEMS`
- **Reduced height on /home2**: `py-2 lg:py-3` (vs default `py-3 lg:py-4`)
- **Tighter link spacing on /home2**: `lg:gap-5` (vs default `lg:gap-7`)
- **Added** `data-home2` attribute on nav for potential future styling
- **Mobile**: Hamburger menu shows same simplified 3 links + "Uloguj se" CTA on /home2

### No changes to:
- `src/app/globals.css` (--nav-h stays 72px)
- `src/components/hero/HeroV2.tsx` (pt-24 / max-w-7xl already compatible)
- Routing, SEO, or other pages

---

## QA Checklist

| Viewport | Check |
|----------|-------|
| **375px** (mobile) | Hamburger opens; shows Početna, Blogovi, Kontakt + "Uloguj se"; no Home2/O nama/Rečnik |
| **375px** | HeroV2 content visible below nav; no overlap |
| **768px** | Same as mobile; nav bar slightly shorter on /home2 |
| **1024px** (desktop) | 3 center links (Početna, Blogovi, Kontakt) with tighter spacing; CTA "Uloguj se" right |
| **1024px** | Nav height smaller than on main `/` page |
| **1024px** | HeroV2 aligns under nav; no gap, no overlap |
| **Cross-check** | Visit `/` — full navbar (6 items) unchanged |
| **Cross-check** | Visit `/home2` — simplified navbar (3 items) |
