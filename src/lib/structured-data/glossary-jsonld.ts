import { absoluteUrl } from '@/lib/config/site-url';
import {
  getCategoryPath,
  getExactMesh,
  getTermPath,
  getVerifiedAlternateNames,
  type RecnikCategory,
  type RecnikReviewer,
  type RecnikSource,
  type RecnikTerm,
} from '@/lib/content/recnik';
import { buildPageGraph, type BreadcrumbItem, type JsonLdGraph } from './page-graph';
import { organizationRef } from './site-entities';

/* JSON-LD recnika, u istom @graph obrascu kao ostatak sajta (jedan @context).

   Pravila:
   - DefinedTerm.name je medicalCanonicalTerm, description je shortDefinition.
   - alternateName samo za medicinski verifikovane sinonime/skracenice (nikad SEO/lay aliasi).
   - termCode i sameAs (MeSH) samo kad je meshMatch "exact" i pojam verifikovan.
   - citation, reviewedBy i lastReviewed ogledaju samo ono sto je vidljivo na stranici.
   - Autor i izdavac je Organization (dok ne postoje javni profili autora). */

export const DEFINED_TERM_SET_ID = absoluteUrl('/recnik#defined-term-set');

const GLOSSARY_NAME = 'Stomatološki rečnik';

function definedTermSetNode() {
  return {
    '@type': 'DefinedTermSet',
    '@id': DEFINED_TERM_SET_ID,
    name: GLOSSARY_NAME,
    url: absoluteUrl('/recnik'),
    inLanguage: 'sr',
    publisher: organizationRef,
  };
}

function citationNode(source: RecnikSource) {
  return {
    '@type': 'CreativeWork',
    name: source.title,
    publisher: { '@type': 'Organization', name: source.publisher },
    ...(source.url ? { url: source.url } : {}),
  };
}

function reviewerNode(reviewer: RecnikReviewer) {
  return {
    '@type': 'Person',
    name: reviewer.name,
    jobTitle: reviewer.title,
    ...(reviewer.profileUrl ? { url: reviewer.profileUrl } : {}),
    ...(reviewer.sameAs?.length ? { sameAs: reviewer.sameAs } : {}),
  };
}

type TermGraphInput = {
  term: RecnikTerm;
  category?: RecnikCategory;
  sources: RecnikSource[];
  reviewer?: RecnikReviewer;
  breadcrumbs: BreadcrumbItem[];
  /** Ista FAQ lista koja je vidljiva na stranici. */
  faqs: { question: string; answer: string }[];
  imageUrl: string;
};

export function buildGlossaryTermJsonLd({
  term,
  category,
  sources,
  reviewer,
  breadcrumbs,
  faqs,
  imageUrl,
}: TermGraphInput): JsonLdGraph {
  const path = getTermPath(term);
  const url = absoluteUrl(path);
  const termId = `${url}#term`;
  const mesh = getExactMesh(term);
  const alternateNames = getVerifiedAlternateNames(term);

  const definedTerm = {
    '@type': 'DefinedTerm',
    '@id': termId,
    name: term.medicalCanonicalTerm,
    description: term.shortDefinition,
    url,
    inLanguage: 'sr',
    inDefinedTermSet: { '@id': DEFINED_TERM_SET_ID },
    ...(alternateNames.length ? { alternateName: alternateNames } : {}),
    ...(mesh ? { termCode: mesh.id } : {}),
    ...(mesh?.url ? { sameAs: mesh.url } : {}),
  };

  const reviewedAt = term.clinicalReview.reviewedAt;

  return buildPageGraph({
    path,
    name: term.publicTitle,
    description: term.seo.metaDescription || term.shortDefinition,
    pageType: 'MedicalWebPage',
    breadcrumbs,
    faqs,
    datePublished: term.publishedAt,
    dateModified: term.updatedAt || term.publishedAt,
    pageFields: {
      mainEntity: { '@id': termId },
      about: { '@id': termId },
      author: organizationRef,
      primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
      ...(category ? { keywords: category.title } : {}),
      ...(sources.length ? { citation: sources.map(citationNode) } : {}),
      ...(reviewer ? { reviewedBy: reviewerNode(reviewer) } : {}),
      ...(reviewer && reviewedAt ? { lastReviewed: reviewedAt } : {}),
    },
    extraNodes: [definedTerm, definedTermSetNode()],
  });
}

/** /recnik: CollectionPage + DefinedTermSet (bez nabrajanja svih pojmova). */
export function buildGlossaryIndexJsonLd(description: string): JsonLdGraph {
  return buildPageGraph({
    path: '/recnik',
    name: GLOSSARY_NAME,
    description,
    pageType: 'CollectionPage',
    breadcrumbs: [
      { name: 'Početna', path: '/' },
      { name: 'Rečnik', path: '/recnik' },
    ],
    pageFields: { mainEntity: { '@id': DEFINED_TERM_SET_ID } },
    extraNodes: [definedTermSetNode()],
  });
}

/** /recnik/kategorija/[slug]: CollectionPage u okviru istog DefinedTermSet-a. */
export function buildGlossaryCategoryJsonLd(category: RecnikCategory, description: string): JsonLdGraph {
  const path = getCategoryPath(category);
  return buildPageGraph({
    path,
    name: category.title,
    description,
    pageType: 'CollectionPage',
    breadcrumbs: [
      { name: 'Početna', path: '/' },
      { name: 'Rečnik', path: '/recnik' },
      { name: category.title, path },
    ],
    pageFields: { about: { '@id': DEFINED_TERM_SET_ID } },
    extraNodes: [definedTermSetNode()],
  });
}
