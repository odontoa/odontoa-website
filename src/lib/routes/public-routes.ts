import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import { isInternalRoute, isSectionHidden } from '@/lib/config/hidden-sections';

/* Da li interna putanja vodi na javnu stranicu koja postoji. Koristi se pre renderovanja
   linkova iz sadrzaja (recnik, buduci landing-i): link ka skrivenoj ili nepostojecoj
   stranici se ne renderuje kao link.

   Recnik (/recnik/...) i blog postovi (/blogovi/<slug>) se ovde ne proveravaju: pojmovi se
   razresavaju po id-ju u src/lib/content/recnik, a blog postovi po slugu iz Sanity-ja. */

const STATIC_PUBLIC_PATHS = new Set([
  '/',
  '/funkcionalnosti',
  '/kontakt',
  '/demo',
  '/register',
  '/politika-privatnosti',
  '/uslovi-koriscenja',
  '/gdpr',
  '/pomoc-i-pravno',
  '/o-nama',
  '/alati',
  '/alati/digitalna-spremnost-ordinacije',
  '/alati/kalkulator-ustede-vremena',
  '/alati/checklist-prelazak-na-digitalni-karton',
  '/blogovi',
]);

const FEATURE_PATHS = new Set(FEATURE_PAGES.map((p) => `/funkcionalnosti/${p.slug}`));

/* /za/... landing stranice jos ne postoje. Kad nastanu, upisuju se ovde (ili se ovaj niz
   gradi iz njihovog izvora podataka), i linkovi iz recnika se automatski pojavljuju. */
export type LandingPage = { path: string; title: string };
const LANDING_PAGES: LandingPage[] = [];
const LANDING_PATHS = new Set(LANDING_PAGES.map((p) => p.path));

export function getLandingPage(path: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.path === path);
}

function stripQueryAndHash(path: string): string {
  return path.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
}

export function isInternalHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

export function isPublicPath(href: string): boolean {
  if (!isInternalHref(href)) return false;
  const path = stripQueryAndHash(href);
  if (isSectionHidden(path) || isInternalRoute(path)) return false;
  return STATIC_PUBLIC_PATHS.has(path) || FEATURE_PATHS.has(path) || LANDING_PATHS.has(path);
}

export function getFeatureBySlug(slug: string) {
  return FEATURE_PAGES.find((p) => p.slug === slug);
}
