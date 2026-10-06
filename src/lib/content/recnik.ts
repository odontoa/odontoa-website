/* Recnik: lokalni izvor istine (bez CMS-a).
   Od 4. okt 2026 recnik ne cita Sanity; Sanity glossaryTerm sema je legacy i ne koristi se
   za prikaz ni build. Blog ostaje na Sanity-ju. Dok je recnik prazan, sekcija je sakrivena
   (src/lib/config/hidden-sections.ts).

   Novi termin: dodaj objekat u RECNIK_TERMS. published: false ga drzi van sajta, sitemapa i llms.txt.
   Slika ide u public/images/recnik/<slug>.jpg (1200x630, koristi se i kao OG slika). */

export type RecnikBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

export type RecnikFaq = { question: string; answer: string };

export type RecnikTerm = {
  slug: string;
  term: string;
  /** Kratka definicija: lead na stranici termina, meta description ako nema metaDescription. */
  definition: string;
  category: string;
  /** false = ne prikazuje se nigde (stranica, lista, sitemap, llms). */
  published: boolean;
  /** ISO 8601 */
  publishedAt: string;
  /** ISO 8601. Ako ne postoji, vazi publishedAt. */
  updatedAt?: string;
  author: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  coverImage?: { src: string; alt: string; width: number; height: number };
  /** Slugovi drugih termina. Neobjavljeni se preskacu pri prikazu. */
  relatedTerms?: string[];
  article: RecnikBlock[];
  /** Mora biti 1:1 sa FAQPage JSON-LD (gradi se iz istog niza). */
  faqs?: RecnikFaq[];
};

/* Prazno do unosa pravih termina. Termini preneti iz Sanity-ja (Abrazija, Bopsija, Testni termin)
   bili su testni sadrzaj i uklonjeni su 4. okt 2026; Sanity dokumenti nisu dirani. */
export const RECNIK_TERMS: RecnikTerm[] = [];

const bySlug = new Map(RECNIK_TERMS.map((t) => [t.slug, t]));

/** Javni termini, sortirani po nazivu (srpska abeceda). */
export function getPublishedTerms(): RecnikTerm[] {
  return RECNIK_TERMS.filter((t) => t.published).sort((a, b) => a.term.localeCompare(b.term, 'sr'));
}

/** Javni termini koji ulaze u sitemap i llms.txt (bez noindex). */
export function getIndexableTerms(): RecnikTerm[] {
  return getPublishedTerms().filter((t) => !t.noindex);
}

export function getPublishedTerm(slug: string): RecnikTerm | undefined {
  const term = bySlug.get(slug);
  return term && term.published ? term : undefined;
}

/** Povezani termini u zadatom redosledu, samo javni. */
export function getRelatedTerms(term: RecnikTerm): RecnikTerm[] {
  return (term.relatedTerms ?? [])
    .map((slug) => getPublishedTerm(slug))
    .filter((t): t is RecnikTerm => Boolean(t));
}
