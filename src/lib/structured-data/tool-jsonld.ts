import { buildPageGraph, type BreadcrumbItem, type FaqItem } from './page-graph';
import { SOFTWARE_ID } from './site-entities';

/* JSON-LD za stranice funkcionalnosti i alata: WebPage + BreadcrumbList (+ FAQPage),
   u zajednickom @graph-u sa Organization/WebSite (src/lib/structured-data/page-graph.ts). */

interface BuildToolJsonLdParams {
  name: string;
  description: string;
  /** Putanja stranice, npr. "/funkcionalnosti/zakazivac-termina". */
  path: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FaqItem[];
  datePublished?: string;
  dateModified?: string;
  /** Stranice o proizvodu nose i SoftwareApplication cvor. */
  includeSoftware?: boolean;
}

export function buildToolJsonLd({
  name,
  description,
  path,
  breadcrumbs,
  faqs,
  datePublished,
  dateModified,
  includeSoftware,
}: BuildToolJsonLdParams) {
  return buildPageGraph({
    path,
    name,
    description,
    breadcrumbs,
    faqs,
    datePublished,
    dateModified,
    includeSoftware,
    /* Stranica o proizvodu: WebPage je "o" SoftwareApplication entitetu. */
    ...(includeSoftware ? { pageFields: { about: { '@id': SOFTWARE_ID } } } : {}),
  });
}
