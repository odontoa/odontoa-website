/* Recnik: javni API (samo server).

   Ovo je jedini modul koji ostatak aplikacije uvozi. Stranice, sitemap, llms.txt i JSON-LD
   ne citaju data/ fajlove direktno. Klijentske komponente uvoze samo tipove (`import type`)
   i dobijaju RecnikTermSummary kao prop. validate.ts koristi node:fs, pa slucajan import
   ovog modula u klijentsku komponentu pada u build-u.

   Izvor istine: src/lib/content/recnik/data/ (format: docs/RECNIK_IMPORT_FORMAT.md).
   Sanity glossaryTerm sema je legacy i ne koristi se. */

import { FEATURE_PAGES, type FeaturePageData } from '@/lib/content/funkcionalnosti';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { getLandingPage, isPublicPath, type LandingPage } from '@/lib/routes/public-routes';
import { RECNIK_CATEGORIES } from './categories';
import { RECNIK_CTAS, type RecnikCta } from './ctas';
import { RECNIK_REVIEWERS } from './data/reviewers';
import { RECNIK_SOURCES } from './data/sources';
import { TERM_FILES } from './data/terms';
import { RECNIK_FIXTURES } from './fixtures';
import type {
  RecnikCategory,
  RecnikDataset,
  RecnikReviewer,
  RecnikSource,
  RecnikTerm,
  RecnikTermSummary,
} from './types';
import { formatIssues, termCanonicalPath, validateRecnik, type RecnikValidationResult } from './validate';

export type {
  RecnikAlias,
  RecnikBlock,
  RecnikCategory,
  RecnikFaq,
  RecnikImage,
  RecnikInline,
  RecnikReviewer,
  RecnikRichText,
  RecnikSource,
  RecnikTerm,
  RecnikTermSummary,
} from './types';
export { RECNIK_CATEGORIES } from './categories';

/* ── Dataset ───────────────────────────────────────────────────────────── */

/* RECNIK_FIXTURES=1 zamenjuje pravi dataset testnim (samo za lokalni test build). */
function loadDataset(): RecnikDataset {
  if (process.env.RECNIK_FIXTURES === '1') {
    if (process.env.VERCEL_ENV === 'production') {
      throw new Error('RECNIK_FIXTURES=1 nije dozvoljen na produkcionom deploy-u.');
    }
    return RECNIK_FIXTURES;
  }
  return { terms: TERM_FILES.flat(), sources: RECNIK_SOURCES, reviewers: RECNIK_REVIEWERS };
}

const DATASET = loadDataset();

export function getRecnikDataset(): RecnikDataset {
  return DATASET;
}

let validation: RecnikValidationResult | null = null;

export function getRecnikValidation(): RecnikValidationResult {
  validation ??= validateRecnik(DATASET);
  return validation;
}

/** Rusi build ako dataset ima gresaka. Poziva se iz generateStaticParams, sitemap-a i llms-a. */
export function ensureRecnikValid(): void {
  const { errors } = getRecnikValidation();
  if (errors.length > 0) {
    throw new Error(`Recnik ima ${errors.length} gresaka (npm run recnik:validate):\n${formatIssues(errors)}`);
  }
}

/* ── Pojmovi ───────────────────────────────────────────────────────────── */

const sourceById = new Map(DATASET.sources.map((s) => [s.id, s]));
const reviewerById = new Map(DATASET.reviewers.map((r) => [r.id, r]));
const categoryById = new Map(RECNIK_CATEGORIES.map((c) => [c.id, c]));
const categoryBySlug = new Map(RECNIK_CATEGORIES.map((c) => [c.slug, c]));

/* Drugi sloj zastite pored validatora: pojam je javan samo ako prolazi publication gate,
   cak i kad bi validacija bila preskocena. */
export function isPublicTerm(term: RecnikTerm): boolean {
  return (
    term.publicationStatus === 'published' &&
    term.verification?.status === 'verified' &&
    term.clinicalReview?.status === 'approved' &&
    (term.sourceIds?.length ?? 0) > 0 &&
    Boolean(term.medicalCanonicalTerm?.trim()) &&
    Boolean(term.shortDefinition?.trim()) &&
    Boolean(term.publishedAt) &&
    categoryById.has(term.categoryId)
  );
}

const PUBLISHED_TERMS = DATASET.terms
  .filter(isPublicTerm)
  .sort((a, b) => a.publicTitle.localeCompare(b.publicTitle, 'sr'));
const publishedById = new Map(PUBLISHED_TERMS.map((t) => [t.id, t]));
const publishedBySlug = new Map(PUBLISHED_TERMS.map((t) => [t.slug, t]));

export function getTermPath(term: Pick<RecnikTerm, 'slug'>): string {
  return `/recnik/${term.slug}`;
}

export { termCanonicalPath };

/** Javni pojmovi (prolaze publication gate), sortirani po srpskoj abecedi. */
export function getPublishedTerms(): RecnikTerm[] {
  return PUBLISHED_TERMS;
}

/** Pojmovi koji idu u sitemap i llms: javni, bez noindex, canonical je sama stranica. */
export function getIndexableTerms(): RecnikTerm[] {
  return PUBLISHED_TERMS.filter((t) => !t.seo.noindex && termCanonicalPath(t) === getTermPath(t));
}

export function getPublishedTermBySlug(slug: string): RecnikTerm | undefined {
  return publishedBySlug.get(slug);
}

export function getPublishedTermById(id: string): RecnikTerm | undefined {
  return publishedById.get(id);
}

/** Recnik je javan: sekcija nije skrivena i postoji bar jedan javni pojam. */
export function isGlossaryPublic(): boolean {
  return !isSectionHidden('/recnik') && PUBLISHED_TERMS.length > 0;
}

/* ── Index (/recnik) ───────────────────────────────────────────────────── */

const DIGRAPHS = ['Dž', 'Lj', 'Nj'];

/** Slovo srpske abecede za grupisanje (digrafi Dž, Lj, Nj su posebna slova; cifra je "#"). */
export function firstLetter(title: string): string {
  const trimmed = title.trim();
  if (/^\d/.test(trimmed)) return '#';
  const two = trimmed.slice(0, 2).toLocaleLowerCase('sr');
  const digraph = DIGRAPHS.find((d) => d.toLocaleLowerCase('sr') === two);
  return digraph ?? trimmed.charAt(0).toLocaleUpperCase('sr');
}

export function toSummary(term: RecnikTerm): RecnikTermSummary {
  const searchAliases = [
    ...(term.aliases ?? []).map((a) => a.value),
    ...(term.seo.searchAliases ?? []),
  ];
  return {
    id: term.id,
    slug: term.slug,
    publicTitle: term.publicTitle,
    medicalCanonicalTerm: term.medicalCanonicalTerm,
    shortDefinition: term.shortDefinition,
    categoryId: term.categoryId,
    searchAliases: [...new Set(searchAliases)],
    firstLetter: firstLetter(term.publicTitle),
  };
}

export function getTermSummaries(): RecnikTermSummary[] {
  return PUBLISHED_TERMS.map(toSummary);
}

/* ── Kategorije ────────────────────────────────────────────────────────── */

export function getCategoryById(id: string): RecnikCategory | undefined {
  return categoryById.get(id);
}

export function getCategoryBySlug(slug: string): RecnikCategory | undefined {
  return categoryBySlug.get(slug);
}

export function getCategoryPath(category: Pick<RecnikCategory, 'slug'>): string {
  return `/recnik/kategorija/${category.slug}`;
}

export function getPublishedTermsByCategory(categoryId: string): RecnikTerm[] {
  return PUBLISHED_TERMS.filter((t) => t.categoryId === categoryId);
}

/** Kategorije sa bar jednim javnim pojmom, po redosledu iz registra. */
export function getCategoriesWithTerms(): (RecnikCategory & { termCount: number })[] {
  return [...RECNIK_CATEGORIES]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ ...c, termCount: getPublishedTermsByCategory(c.id).length }))
    .filter((c) => c.termCount > 0);
}

/** Stranica kategorije je indexable samo uz eksplicitnu odluku i odobren SEO tekst. */
export function isCategoryIndexable(category: RecnikCategory): boolean {
  return Boolean(category.indexable && category.seoTitle?.trim() && category.metaDescription?.trim());
}

/* ── Izvori, recenzent, aliasi ─────────────────────────────────────────── */

export function getSourceById(id: string): RecnikSource | undefined {
  return sourceById.get(id);
}

/** Izvori za blok "Izvori i literatura", redosledom iz term.sourceIds. */
export function getTermSources(term: RecnikTerm): RecnikSource[] {
  return term.sourceIds.map((id) => sourceById.get(id)).filter((s): s is RecnikSource => Boolean(s));
}

/** Recenzent se prikazuje samo uz odobren pregled, postojeci i aktivan zapis. */
export function getTermReviewer(term: RecnikTerm): RecnikReviewer | undefined {
  if (term.clinicalReview.status !== 'approved' || !term.clinicalReview.reviewerId) return undefined;
  const reviewer = reviewerById.get(term.clinicalReview.reviewerId);
  return reviewer?.active ? reviewer : undefined;
}

/** Samo stvarni medicinski sinonimi i skracenice istog pojma (za schema alternateName). */
export function getVerifiedAlternateNames(term: RecnikTerm): string[] {
  return (term.aliases ?? [])
    .filter((a) => a.medicallyVerified && (a.type === 'verified-synonym' || a.type === 'abbreviation'))
    .map((a) => a.value);
}

/** MeSH se koristi u schema-i (termCode, sameAs) samo za tacno poklapanje verifikovanog pojma. */
export function getExactMesh(term: RecnikTerm): { id: string; url?: string } | undefined {
  if (term.meshMatch !== 'exact' || !term.meshId || term.verification.status !== 'verified') return undefined;
  return { id: term.meshId, url: term.meshUrl };
}

/* ── Veze ──────────────────────────────────────────────────────────────── */

export type RecnikTermLinks = {
  relatedTerms: RecnikTerm[];
  features: FeaturePageData[];
  landingPages: LandingPage[];
  /** Slugovi blog postova; razresavaju se u blog-links.ts (Sanity), samo dok je blog javan. */
  blogSlugs: string[];
  cta: RecnikCta;
};

/** Samo linkovi koji vode na postojece, javne stranice. */
export function getTermLinks(term: RecnikTerm): RecnikTermLinks {
  const links = term.links ?? {};
  return {
    relatedTerms: (links.relatedTermIds ?? [])
      .map((id) => publishedById.get(id))
      .filter((t): t is RecnikTerm => Boolean(t) && t.id !== term.id),
    features: (links.featureSlugs ?? [])
      .map((slug) => FEATURE_PAGES.find((p) => p.slug === slug))
      .filter((p): p is FeaturePageData => Boolean(p) && isPublicPath(`/funkcionalnosti/${p.slug}`)),
    landingPages: (links.landingPaths ?? [])
      .filter((p) => isPublicPath(p))
      .map((p) => getLandingPage(p))
      .filter((p): p is LandingPage => Boolean(p)),
    blogSlugs: isSectionHidden('/blogovi') ? [] : links.blogSlugs ?? [],
    cta: RECNIK_CTAS[links.ctaId ?? 'default'] ?? RECNIK_CTAS.default,
  };
}
