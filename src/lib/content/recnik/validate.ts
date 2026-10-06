import { existsSync } from 'node:fs';
import path from 'node:path';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import { isInternalHref, isPublicPath } from '@/lib/routes/public-routes';
import { RECNIK_CATEGORIES } from './categories';
import {
  ALIAS_TYPES,
  CLINICAL_REVIEW_STATUSES,
  CTA_IDS,
  MESH_MATCHES,
  PUBLICATION_STATUSES,
  SOURCE_TIERS,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
  type RecnikDataset,
  type RecnikImage,
  type RecnikRichText,
  type RecnikTerm,
} from './types';

/* Validacija recnika. Pokrece se u build-u (prebuild: npm run recnik:validate, i
   ensureRecnikValid() u generateStaticParams/sitemap-u) i pri importu.

   Greske (errors) ruse build. Upozorenja (warnings) se samo prijavljuju.
   Validator nikad ne menja podatke. */

export type RecnikIssue = { termId?: string; message: string };

export type RecnikStats = {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, { total: number; published: number }>;
  missingReview: string[];
  missingSources: string[];
  sharedAliases: { alias: string; termIds: string[] }[];
};

export type RecnikValidationResult = {
  errors: RecnikIssue[];
  warnings: RecnikIssue[];
  stats: RecnikStats;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/;

const SEO_TITLE_MAX = 60;
const META_DESCRIPTION_MIN = 70;
const META_DESCRIPTION_MAX = 160;

function isValidDate(value: string | undefined): boolean {
  return !value || (ISO_DATE_RE.test(value) && !Number.isNaN(Date.parse(value)));
}

function publicFileExists(src: string): boolean {
  return existsSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('sr');
}

export function termCanonicalPath(term: RecnikTerm): string {
  return term.seo?.canonicalPath || `/recnik/${term.slug}`;
}

/* Svi inline delovi (linkovi, citati) iz clanka. */
function inlinesOf(text: RecnikRichText) {
  return typeof text === 'string' ? [] : text.filter((part) => typeof part !== 'string');
}

function richTextsOf(term: RecnikTerm): RecnikRichText[] {
  const out: RecnikRichText[] = [];
  for (const block of term.article ?? []) {
    if (block.type === 'p') out.push(block.text);
    if (block.type === 'ul' || block.type === 'ol') out.push(...block.items);
  }
  return out;
}

export function validateRecnik(dataset: RecnikDataset): RecnikValidationResult {
  const errors: RecnikIssue[] = [];
  const warnings: RecnikIssue[] = [];
  const error = (termId: string | undefined, message: string) => errors.push({ termId, message });
  const warn = (termId: string | undefined, message: string) => warnings.push({ termId, message });

  const { terms, sources, reviewers } = dataset;
  const categoryIds = new Set(RECNIK_CATEGORIES.map((c) => c.id));
  const featureSlugs = new Set(FEATURE_PAGES.map((p) => p.slug));

  /* ── Registri ── */
  const sourceIds = new Set<string>();
  for (const s of sources) {
    if (sourceIds.has(s.id)) error(undefined, `Izvor "${s.id}": dupli id.`);
    sourceIds.add(s.id);
    if (!s.title?.trim() || !s.publisher?.trim()) error(undefined, `Izvor "${s.id}": nedostaje title ili publisher.`);
    if (!SOURCE_TYPES.includes(s.sourceType)) error(undefined, `Izvor "${s.id}": nepoznat sourceType "${s.sourceType}".`);
    if (s.tier && !SOURCE_TIERS.includes(s.tier)) error(undefined, `Izvor "${s.id}": nepoznat tier "${s.tier}".`);
    if (s.url && !/^https?:\/\//.test(s.url)) error(undefined, `Izvor "${s.id}": url mora biti apsolutan (http/https).`);
    if (!isValidDate(s.accessedAt)) error(undefined, `Izvor "${s.id}": accessedAt nije ISO datum.`);
  }

  const reviewerById = new Map<string, (typeof reviewers)[number]>();
  for (const r of reviewers) {
    if (reviewerById.has(r.id)) error(undefined, `Recenzent "${r.id}": dupli id.`);
    reviewerById.set(r.id, r);
    if (!r.name?.trim() || !r.title?.trim()) error(undefined, `Recenzent "${r.id}": nedostaje name ili title.`);
  }

  /* ── Jedinstvenost ── */
  const termById = new Map<string, RecnikTerm>();
  const idsBySlug = new Map<string, string>();
  const idsByCanonical = new Map<string, string>();
  for (const term of terms) {
    if (termById.has(term.id)) error(term.id, `Dupli id "${term.id}".`);
    termById.set(term.id, term);

    if (!SLUG_RE.test(term.slug)) error(term.id, `Slug "${term.slug}" nije u formatu mala-slova-i-crtice (bez dijakritike).`);
    if (idsBySlug.has(term.slug)) error(term.id, `Dupli slug "${term.slug}" (vec ga koristi ${idsBySlug.get(term.slug)}).`);
    idsBySlug.set(term.slug, term.id);

    const canonical = termCanonicalPath(term);
    if (idsByCanonical.has(canonical)) {
      error(term.id, `Dupli canonical path "${canonical}" (vec ga koristi ${idsByCanonical.get(canonical)}).`);
    }
    idsByCanonical.set(canonical, term.id);
  }

  const isPublished = (t: RecnikTerm | undefined) => t?.publicationStatus === 'published';
  const referencedTermIds = new Set<string>();

  /* ── Po terminu ── */
  for (const term of terms) {
    const id = term.id;
    const published = isPublished(term);

    if (!PUBLICATION_STATUSES.includes(term.publicationStatus)) {
      error(id, `Nepoznat publicationStatus "${term.publicationStatus}".`);
    }
    if (!VERIFICATION_STATUSES.includes(term.verification?.status)) {
      error(id, `Nepoznat verification.status "${term.verification?.status}".`);
    }
    if (term.verification?.tier && !SOURCE_TIERS.includes(term.verification.tier)) {
      error(id, `Nepoznat verification.tier "${term.verification.tier}".`);
    }
    if (!CLINICAL_REVIEW_STATUSES.includes(term.clinicalReview?.status)) {
      error(id, `Nepoznat clinicalReview.status "${term.clinicalReview?.status}".`);
    }

    if (!categoryIds.has(term.categoryId)) error(id, `categoryId "${term.categoryId}" ne postoji u RECNIK_CATEGORIES.`);

    /* Datumi */
    for (const [field, value] of [
      ['publishedAt', term.publishedAt],
      ['updatedAt', term.updatedAt],
      ['verification.verifiedAt', term.verification?.verifiedAt],
      ['clinicalReview.reviewedAt', term.clinicalReview?.reviewedAt],
    ] as const) {
      if (!isValidDate(value)) error(id, `${field} "${value}" nije ISO 8601 datum.`);
    }

    /* Reference na izvore */
    const refSources = [
      ...(term.sourceIds ?? []),
      ...(term.verification?.sourceIds ?? []),
      ...(term.aliases ?? []).flatMap((a) => a.sourceIds ?? []),
      ...richTextsOf(term).flatMap(inlinesOf).flatMap((p) => (p.type === 'cite' ? [p.sourceId] : [])),
    ];
    for (const sid of refSources) {
      if (!sourceIds.has(sid)) error(id, `Izvor "${sid}" ne postoji u RECNIK_SOURCES.`);
    }

    /* Recenzent */
    const reviewerId = term.clinicalReview?.reviewerId;
    if (reviewerId) {
      const reviewer = reviewerById.get(reviewerId);
      if (!reviewer) error(id, `Recenzent "${reviewerId}" ne postoji u RECNIK_REVIEWERS.`);
      else if (!reviewer.active) warn(id, `Recenzent "${reviewerId}" nije aktivan i nece biti prikazan.`);
    }
    if (published && term.clinicalReview?.status === 'approved' && !reviewerId) {
      warn(id, 'Strucni pregled je "approved" bez reviewerId: recenzent se nece prikazati.');
    }

    /* Aliasi */
    for (const alias of term.aliases ?? []) {
      if (!alias.value?.trim()) error(id, 'Alias bez vrednosti.');
      if (!ALIAS_TYPES.includes(alias.type)) error(id, `Alias "${alias.value}": nepoznat type "${alias.type}".`);
      if (alias.type === 'verified-synonym' && !alias.medicallyVerified) {
        error(id, `Alias "${alias.value}" je verified-synonym, a medicallyVerified je false.`);
      }
    }

    /* MeSH */
    if (term.meshMatch && !MESH_MATCHES.includes(term.meshMatch)) error(id, `Nepoznat meshMatch "${term.meshMatch}".`);
    if (term.meshMatch === 'exact' && !term.meshId) error(id, 'meshMatch je "exact", a meshId nedostaje.');
    if (term.meshUrl && !/^https:\/\//.test(term.meshUrl)) error(id, 'meshUrl mora biti https URL.');
    if ((term.meshId || term.meshUrl) && !term.meshMatch) {
      warn(id, 'MeSH podaci bez meshMatch: termCode/sameAs se nece koristiti u schema-i.');
    }

    /* Slike */
    const checkImage = (field: string, img?: RecnikImage) => {
      if (!img) return;
      if (!img.src?.startsWith('/')) error(id, `${field}.src mora biti putanja u public/ (pocinje sa "/").`);
      else if (!publicFileExists(img.src)) error(id, `${field}.src "${img.src}" ne postoji u public/.`);
      if (!img.alt?.trim()) error(id, `${field}.alt nedostaje.`);
      if (!(img.width > 0) || !(img.height > 0)) error(id, `${field}: width/height moraju biti pozitivni brojevi.`);
    };
    checkImage('coverImage', term.coverImage);
    checkImage('seo.ogImage', term.seo?.ogImage);

    /* Canonical */
    const canonical = term.seo?.canonicalPath;
    if (canonical && !canonical.startsWith('/') && !/^https:\/\//.test(canonical)) {
      error(id, 'seo.canonicalPath mora biti putanja ("/...") ili https URL.');
    }

    /* Veze */
    const links = term.links ?? {};
    for (const rid of links.relatedTermIds ?? []) {
      const related = termById.get(rid);
      referencedTermIds.add(rid);
      if (!related) error(id, `Povezani pojam "${rid}" ne postoji.`);
      else if (rid === id) error(id, 'Pojam je povezan sam sa sobom.');
      else if (published && !isPublished(related)) warn(id, `Povezani pojam "${rid}" nije objavljen i nece biti prikazan.`);
    }
    for (const slug of links.featureSlugs ?? []) {
      if (!featureSlugs.has(slug)) error(id, `Funkcionalnost "${slug}" ne postoji u FEATURE_PAGES.`);
    }
    for (const lp of links.landingPaths ?? []) {
      if (!lp.startsWith('/za/')) warn(id, `landingPaths "${lp}" ne pocinje sa /za/.`);
      else if (!isPublicPath(lp)) warn(id, `Landing "${lp}" jos ne postoji; link se ne prikazuje.`);
    }
    if (links.ctaId && !CTA_IDS.includes(links.ctaId)) error(id, `Nepoznat ctaId "${links.ctaId}".`);

    for (const part of richTextsOf(term).flatMap(inlinesOf)) {
      if (part.type === 'term') {
        referencedTermIds.add(part.termId);
        if (!termById.has(part.termId)) error(id, `Link u clanku ka pojmu "${part.termId}" koji ne postoji.`);
      }
      if (part.type === 'link') {
        if (part.href.startsWith('/recnik/')) {
          error(id, `Link "${part.href}": linkove ka recniku pisati kao { type: 'term', termId }.`);
        } else if (isInternalHref(part.href)) {
          if (!isPublicPath(part.href)) warn(id, `Link "${part.href}" vodi na skrivenu/nepostojecu stranicu; prikazuje se kao tekst.`);
        } else if (!/^https:\/\//.test(part.href)) {
          error(id, `Link "${part.href}" mora biti interna putanja ili https URL.`);
        }
      }
    }

    /* Publication gate: objavljen pojam mora biti potpun, verifikovan i strucno pregledan. */
    if (published) {
      if (!term.medicalCanonicalTerm?.trim()) error(id, 'Objavljen pojam bez medicalCanonicalTerm.');
      if (!term.publicTitle?.trim()) error(id, 'Objavljen pojam bez publicTitle.');
      if (!term.shortDefinition?.trim()) error(id, 'Objavljen pojam bez shortDefinition.');
      if (!term.sourceIds?.length) error(id, 'Objavljen pojam bez izvora (sourceIds).');
      if (term.verification?.status !== 'verified') {
        error(id, `Objavljen pojam sa verification.status "${term.verification?.status}" (mora "verified").`);
      }
      if (term.clinicalReview?.status !== 'approved') {
        error(id, `Objavljen pojam sa clinicalReview.status "${term.clinicalReview?.status}" (mora "approved").`);
      }
      if (!term.publishedAt) error(id, 'Objavljen pojam bez publishedAt.');
      if (!term.seo?.seoTitle?.trim()) error(id, 'Objavljen pojam bez seo.seoTitle.');
      if (!term.seo?.metaDescription?.trim()) error(id, 'Objavljen pojam bez seo.metaDescription.');

      const seoTitle = term.seo?.seoTitle ?? '';
      if (seoTitle.length > SEO_TITLE_MAX) warn(id, `seo.seoTitle ima ${seoTitle.length} znakova (preporuka do ${SEO_TITLE_MAX}).`);
      const meta = term.seo?.metaDescription ?? '';
      if (meta && meta.length < META_DESCRIPTION_MIN) warn(id, `seo.metaDescription ima samo ${meta.length} znakova.`);
      if (meta.length > META_DESCRIPTION_MAX) warn(id, `seo.metaDescription ima ${meta.length} znakova (preko ${META_DESCRIPTION_MAX}).`);
    }
  }

  /* ── Preseci izmedju pojmova ── */
  const aliasOwners = new Map<string, Set<string>>();
  const keywordOwners = new Map<string, Set<string>>();
  for (const term of terms) {
    for (const alias of term.aliases ?? []) {
      const key = normalize(alias.value);
      if (!aliasOwners.has(key)) aliasOwners.set(key, new Set());
      aliasOwners.get(key)!.add(term.id);
    }
    for (const kw of [term.seo?.primaryKeyword, term.seo?.seoEntryTerm]) {
      if (!kw?.trim()) continue;
      const key = normalize(kw);
      if (!keywordOwners.has(key)) keywordOwners.set(key, new Set());
      keywordOwners.get(key)!.add(term.id);
    }
  }
  const sharedAliases = [...aliasOwners.entries()]
    .filter(([, ids]) => ids.size > 1)
    .map(([alias, ids]) => ({ alias, termIds: [...ids] }));
  for (const { alias, termIds } of sharedAliases) {
    warn(undefined, `Alias "${alias}" postoji na vise pojmova: ${termIds.join(', ')}.`);
  }
  for (const [kw, ids] of keywordOwners) {
    if (ids.size > 1) warn(undefined, `SEO kolizija: "${kw}" je primaryKeyword/seoEntryTerm za vise pojmova: ${[...ids].join(', ')}.`);
  }
  for (const term of terms) {
    if (!isPublished(term)) continue;
    const hasOutgoing = (term.links?.relatedTermIds ?? []).length > 0;
    if (!hasOutgoing && !referencedTermIds.has(term.id)) warn(term.id, 'Pojam nema povezane pojmove (orphan).');
  }

  /* ── Statistika ── */
  const byStatus: Record<string, number> = Object.fromEntries(PUBLICATION_STATUSES.map((s) => [s, 0]));
  const byCategory: RecnikStats['byCategory'] = {};
  for (const term of terms) {
    byStatus[term.publicationStatus] = (byStatus[term.publicationStatus] ?? 0) + 1;
    const c = (byCategory[term.categoryId] ??= { total: 0, published: 0 });
    c.total += 1;
    if (isPublished(term)) c.published += 1;
  }

  return {
    errors,
    warnings,
    stats: {
      total: terms.length,
      byStatus,
      byCategory,
      missingReview: terms.filter((t) => t.clinicalReview?.status !== 'approved').map((t) => t.id),
      missingSources: terms.filter((t) => !t.sourceIds?.length).map((t) => t.id),
      sharedAliases,
    },
  };
}

export function formatIssues(issues: RecnikIssue[]): string {
  return issues.map((i) => `  - ${i.termId ? `[${i.termId}] ` : ''}${i.message}`).join('\n');
}

export function formatStats(stats: RecnikStats): string {
  const lines = [
    `Ukupno pojmova: ${stats.total}`,
    `  published: ${stats.byStatus.published ?? 0}`,
    `  draft: ${stats.byStatus.draft ?? 0}`,
    `  ready-for-review: ${stats.byStatus['ready-for-review'] ?? 0}`,
    `  hold: ${stats.byStatus.hold ?? 0}`,
    'Po kategoriji (ukupno / objavljeno):',
    ...Object.entries(stats.byCategory)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, c]) => `  ${id}: ${c.total} / ${c.published}`),
    `Bez odobrenog strucnog pregleda: ${stats.missingReview.length}${stats.missingReview.length ? ` (${stats.missingReview.join(', ')})` : ''}`,
    `Bez izvora: ${stats.missingSources.length}${stats.missingSources.length ? ` (${stats.missingSources.join(', ')})` : ''}`,
    `Deljeni aliasi: ${stats.sharedAliases.length}${
      stats.sharedAliases.length ? `\n${stats.sharedAliases.map((a) => `  "${a.alias}": ${a.termIds.join(', ')}`).join('\n')}` : ''
    }`,
  ];
  return lines.join('\n');
}
