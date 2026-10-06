import { MetadataRoute } from 'next';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import { getIndexableTerms } from '@/lib/content/recnik';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { isComingSoon, isOpenInComingSoon } from '@/lib/config/site-mode';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://odontoa.com';

  // Static pages (bez privremeno sakrivenih sekcija, src/lib/config/hidden-sections.ts)
  const allStaticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/o-nama`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recnik`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alati`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alati/digitalna-spremnost-ordinacije`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alati/kalkulator-ustede-vremena`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alati/checklist-prelazak-na-digitalni-karton`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/funkcionalnosti`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Mapirano iz FEATURE_PAGES, da se sitemap ne moze razici od sadrzaja
    // kada se doda nova stranica funkcionalnosti.
    ...FEATURE_PAGES.map((page) => ({
      url: `${baseUrl}/funkcionalnosti/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/politika-privatnosti`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/uslovi-koriscenja`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gdpr`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const staticPages = allStaticPages.filter((page) => !isSectionHidden(new URL(page.url).pathname));

  /* Coming-soon: samo stranice koje su tada stvarno dostupne (ostale vode 302 na "/"). */
  if (isComingSoon()) {
    return staticPages.filter((page) => isOpenInComingSoon(new URL(page.url).pathname));
  }

  /* Blog je privremeno sakriven do content launcha: ni /blogovi ni clanci ne ulaze u sitemap.
     Vratiti zajedno sa blogom (Sanity: allBlogPostsQuery). */

  // Recnik: lokalni izvor (src/lib/content/recnik.ts), bez neobjavljenih i noindex termina
  const glossaryPages: MetadataRoute.Sitemap = (isSectionHidden('/recnik') ? [] : getIndexableTerms()).map((term) => ({
    url: `${baseUrl}/recnik/${term.slug}`,
    lastModified: new Date(term.updatedAt || term.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...glossaryPages];
}
