import { MetadataRoute } from 'next';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import {
  ensureRecnikValid,
  getCategoriesWithTerms,
  getCategoryPath,
  getIndexableTerms,
  getTermPath,
  isCategoryIndexable,
  isGlossaryPublic,
} from '@/lib/content/recnik';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { isComingSoon, isOpenInComingSoon } from '@/lib/config/site-mode';
import { absoluteUrl } from '@/lib/config/site-url';

/* Samo canonical, indexable URL-ovi (canonical host iz SITE_URL).

   lastModified: statične stranice ga namerno nemaju (datum značajne izmene nije pouzdano
   poznat, a vreme build-a bi bilo netačno). Pojmovi rečnika koriste updatedAt || publishedAt. */
const STATIC_PATHS = [
  '/',
  '/funkcionalnosti',
  // Mapirano iz FEATURE_PAGES, da se sitemap ne moze razici od sadrzaja.
  ...FEATURE_PAGES.map((page) => `/funkcionalnosti/${page.slug}`),
  '/kontakt',
  '/demo',
  '/register',
  '/o-nama',
  '/alati',
  '/alati/digitalna-spremnost-ordinacije',
  '/alati/kalkulator-ustede-vremena',
  '/alati/checklist-prelazak-na-digitalni-karton',
  '/politika-privatnosti',
  '/uslovi-koriscenja',
  '/gdpr',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* Bez privremeno sakrivenih sekcija (src/lib/config/hidden-sections.ts). */
  const staticPaths = STATIC_PATHS.filter((path) => !isSectionHidden(path));

  /* Coming-soon: samo stranice koje su tada stvarno dostupne (ostale vode 302 na "/"). */
  if (isComingSoon()) {
    return staticPaths.filter((path) => isOpenInComingSoon(path)).map((path) => ({ url: absoluteUrl(path) }));
  }

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: absoluteUrl(path) }));

  /* Blog je privremeno sakriven do content launcha: ni /blogovi ni clanci ne ulaze u sitemap.
     Vratiti zajedno sa blogom (Sanity: allBlogPostsQuery). */

  /* Recnik: lokalni izvor (src/lib/content/recnik), samo objavljeni, indexable pojmovi i
     samo dok je sekcija javna. Stranice kategorija ulaze tek kad su indexable. */
  ensureRecnikValid();
  if (isGlossaryPublic()) {
    const terms = getIndexableTerms();
    if (terms.length > 0) {
      entries.push({ url: absoluteUrl('/recnik') });
      for (const category of getCategoriesWithTerms()) {
        if (isCategoryIndexable(category)) entries.push({ url: absoluteUrl(getCategoryPath(category)) });
      }
      for (const term of terms) {
        entries.push({
          url: absoluteUrl(getTermPath(term)),
          lastModified: new Date(term.updatedAt || term.publishedAt!),
        });
      }
    }
  }

  return entries;
}
