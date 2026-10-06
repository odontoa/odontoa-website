import { absoluteUrl } from '@/lib/config/site-url';
import {
  type JsonLdNode,
  organizationNode,
  organizationRef,
  softwareApplicationNode,
  websiteNode,
  websiteRef,
} from './site-entities';

/* Jedan JSON-LD dokument po stranici: jedan @context i @graph sa site-wide entitetima
   (Organization, WebSite, opciono SoftwareApplication) i cvorovima same stranice.
   Cvorovi se povezuju preko @id (`<url>#webpage`, `<url>#breadcrumb`, ...). */

export type BreadcrumbItem = { name: string; path: string };
export type FaqItem = { question: string; answer: string };

export type JsonLdGraph = { '@context': 'https://schema.org'; '@graph': JsonLdNode[] };

export function webPageId(path: string) {
  return `${absoluteUrl(path)}#webpage`;
}

export function breadcrumbNode(path: string, items: BreadcrumbItem[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/* FAQ mora biti 1:1 sa vidljivim pitanjima na stranici (isti niz se renderuje i ovde). */
export function faqNode(path: string, faqs: FaqItem[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    isPartOf: { '@id': webPageId(path) },
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

type BuildPageGraphInput = {
  path: string;
  name: string;
  description: string;
  /** WebPage, CollectionPage, MedicalWebPage... */
  pageType?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  datePublished?: string;
  dateModified?: string;
  /** Dodatna polja na WebPage cvoru (mainEntity, about, reviewedBy, citation...). */
  pageFields?: JsonLdNode;
  /** Dodatni cvorovi u grafu (npr. DefinedTerm, DefinedTermSet). */
  extraNodes?: JsonLdNode[];
  /** SoftwareApplication cvor: samo na stranicama o proizvodu. */
  includeSoftware?: boolean;
};

export function buildPageGraph({
  path,
  name,
  description,
  pageType = 'WebPage',
  breadcrumbs,
  faqs,
  datePublished,
  dateModified,
  pageFields,
  extraNodes = [],
  includeSoftware = false,
}: BuildPageGraphInput): JsonLdGraph {
  const url = absoluteUrl(path);
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  const page: JsonLdNode = {
    '@type': pageType,
    '@id': webPageId(path),
    url,
    name,
    description,
    inLanguage: 'sr',
    isPartOf: websiteRef,
    publisher: organizationRef,
    ...(hasBreadcrumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...pageFields,
  };

  const graph: JsonLdNode[] = [organizationNode(), websiteNode()];
  if (includeSoftware) graph.push(softwareApplicationNode());
  graph.push(page);
  if (hasBreadcrumbs) graph.push(breadcrumbNode(path, breadcrumbs!));
  if (faqs && faqs.length > 0) graph.push(faqNode(path, faqs));
  graph.push(...extraNodes);

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* Bezbedno ugradjivanje u <script type="application/ld+json">: `<` se escape-uje da tekst
   iz podataka ne moze da zatvori script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
