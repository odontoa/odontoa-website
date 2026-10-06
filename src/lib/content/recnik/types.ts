/* Tipovi code-driven recnika. Format za import je opisan u docs/RECNIK_IMPORT_FORMAT.md.

   Medicinska terminologija i SEO jezik su namerno odvojeni:
   - medicalCanonicalTerm: strucni, verifikovani naziv pojma (DefinedTerm.name),
   - publicTitle: naslov stranice (H1) za citaoca,
   - seo.primaryKeyword / seo.seoEntryTerm: izrazi kojima ljudi pretrazuju.
   Nijedno od ovih polja se ne izvodi automatski iz drugog. */

/* ── Enumi ─────────────────────────────────────────────────────────────── */

export const PUBLICATION_STATUSES = ['draft', 'ready-for-review', 'published', 'hold'] as const;
export type RecnikPublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const VERIFICATION_STATUSES = ['verified', 'partial', 'unverified'] as const;
export type RecnikVerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const CLINICAL_REVIEW_STATUSES = ['pending', 'approved', 'changes-required'] as const;
export type RecnikClinicalReviewStatus = (typeof CLINICAL_REVIEW_STATUSES)[number];

export const SOURCE_TIERS = ['A', 'B', 'C'] as const;
export type RecnikSourceTier = (typeof SOURCE_TIERS)[number];

/** verified-synonym: isti medicinski pojam (sme u schema alternateName ako je medicallyVerified).
 *  seo-alias / lay-term: kako ljudi pretrazuju; nikad ne ide u alternateName.
 *  abbreviation: skracenica istog pojma. english: engleski naziv. */
export const ALIAS_TYPES = ['verified-synonym', 'seo-alias', 'lay-term', 'abbreviation', 'english'] as const;
export type RecnikAliasType = (typeof ALIAS_TYPES)[number];

/** Odnos naseg pojma prema MeSH deskriptoru. Samo 'exact' daje termCode i sameAs u schema-i. */
export const MESH_MATCHES = ['exact', 'close', 'broader', 'narrower', 'related'] as const;
export type RecnikMeshMatch = (typeof MESH_MATCHES)[number];

export const SOURCE_TYPES = [
  'terminology',
  'guideline',
  'textbook',
  'journal-article',
  'professional-body',
  'regulation',
  'encyclopedia',
  'other',
] as const;
export type RecnikSourceType = (typeof SOURCE_TYPES)[number];

export const CTA_IDS = ['default', 'demo'] as const;
export type RecnikCtaId = (typeof CTA_IDS)[number];

/* ── Registri ──────────────────────────────────────────────────────────── */

export interface RecnikSource {
  /** Stabilan ID, npr. "mesh", "fdi-glossary". Termini ga referenciraju preko sourceIds. */
  id: string;
  title: string;
  publisher: string;
  /** Javni link. Izostaje samo kod izvora koji nemaju URL (npr. stampani udzbenik). */
  url?: string;
  sourceType: RecnikSourceType;
  tier?: RecnikSourceTier;
  /** ISO datum (YYYY-MM-DD) kada je URL poslednji put proveren. */
  accessedAt?: string;
}

export interface RecnikReviewer {
  id: string;
  name: string;
  /** Zvanje / titula, npr. "dr stom., specijalista endodoncije". */
  title: string;
  /** Javna profil stranica. Bez nje se ime prikazuje bez linka. */
  profileUrl?: string;
  /** Javni profili (komora, LinkedIn...) za schema sameAs. */
  sameAs?: string[];
  /** Neaktivan recenzent se ne prikazuje na sajtu. */
  active: boolean;
}

export interface RecnikCategory {
  id: string;
  /** URL segment za /recnik/kategorija/[slug]. */
  slug: string;
  title: string;
  /** Kratak opis za stranicu kategorije. Izostavljen dok ne postoji odobren tekst. */
  shortDescription?: string;
  order: number;
  seoTitle?: string;
  metaDescription?: string;
  /** Stranica kategorije je noindex dok ovo nije true (i dok ne postoje seoTitle/metaDescription). */
  indexable?: boolean;
}

/* ── Sadrzaj ───────────────────────────────────────────────────────────── */

/** Deo teksta: obican tekst ili link. Linkovi ka skrivenim/nepostojecim stranicama se
 *  renderuju kao obican tekst. */
export type RecnikInline =
  | string
  /** Link ka drugom pojmu iz recnika (po stabilnom id-ju, ne po slugu). */
  | { type: 'term'; termId: string; text: string }
  /** Interna putanja ("/funkcionalnosti/...") ili spoljni https link. */
  | { type: 'link'; href: string; text: string }
  /** Citat izvora iz registra; prikazuje se kao link ka izvoru. */
  | { type: 'cite'; sourceId: string; text?: string };

export type RecnikRichText = string | RecnikInline[];

export type RecnikBlock =
  | { type: 'p'; text: RecnikRichText }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: RecnikRichText[] }
  | { type: 'ol'; items: RecnikRichText[] };

/** Odgovor je obican tekst: isti niz gradi vidljiv FAQ i FAQPage JSON-LD (1:1). */
export interface RecnikFaq {
  question: string;
  answer: string;
}

export interface RecnikImage {
  /** Putanja u public/, npr. "/images/recnik/<slug>.jpg". */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface RecnikAlias {
  value: string;
  type: RecnikAliasType;
  /** Da li je potvrdjeno da je alias isti medicinski pojam. */
  medicallyVerified: boolean;
  sourceIds?: string[];
}

export interface RecnikLinks {
  /** ID-jevi drugih pojmova (ne slugovi). */
  relatedTermIds?: string[];
  /** Slugovi blog postova (Sanity). Prikazuju se samo kad je blog javan i post postoji. */
  blogSlugs?: string[];
  /** Slugovi iz src/lib/content/funkcionalnosti.ts. */
  featureSlugs?: string[];
  /** Buduce /za/... landing stranice. Prikazuju se tek kad ruta postoji. */
  landingPaths?: string[];
  /** Zavrsni CTA (src/lib/content/recnik/ctas.ts). Podrazumevano "default". */
  ctaId?: RecnikCtaId;
}

export interface RecnikSeo {
  primaryKeyword?: string;
  /** <title> bez sufiksa " – Odontoa Rečnik". */
  seoTitle: string;
  metaDescription: string;
  /** Javni izraz kojim korisnik najcesce ulazi na stranicu (GA: seo_entry_term). */
  seoEntryTerm?: string;
  /** Dodatni izrazi samo za pretragu na /recnik. Nisu sinonimi i ne idu u schema. */
  searchAliases?: string[];
  /** Pregazi canonical (podrazumevano /recnik/<slug>). Termin sa drugim canonical-om nije u sitemap-u. */
  canonicalPath?: string;
  noindex?: boolean;
  ogImage?: RecnikImage;
}

export interface RecnikTerm {
  /* Identity */
  /** Stabilan interni ID koncepta. Ne menja se kad se promeni slug ili naslov. */
  id: string;
  slug: string;
  medicalCanonicalTerm: string;
  publicTitle: string;
  /** Answer-first definicija: lead na stranici i DefinedTerm.description. */
  shortDefinition: string;

  /* External terminology */
  latinTerm?: string;
  meshPreferredTerm?: string;
  meshId?: string;
  meshUrl?: string;
  meshMatch?: RecnikMeshMatch;

  aliases?: RecnikAlias[];

  /* Taxonomy */
  categoryId: string;
  clusterId?: string;
  tags?: string[];

  /* Verifikacija terminologije */
  verification: {
    status: RecnikVerificationStatus;
    tier?: RecnikSourceTier;
    sourceIds: string[];
    /** ISO datum. */
    verifiedAt?: string;
  };

  /* Strucni (klinicki) pregled */
  clinicalReview: {
    status: RecnikClinicalReviewStatus;
    reviewerId?: string;
    /** ISO datum. */
    reviewedAt?: string;
  };

  publicationStatus: RecnikPublicationStatus;

  /** Izvori prikazani u bloku "Izvori i literatura". */
  sourceIds: string[];

  /** ISO 8601. Obavezno za objavljen termin. */
  publishedAt?: string;
  /** ISO 8601. Ako ne postoji, vazi publishedAt. */
  updatedAt?: string;

  seo: RecnikSeo;

  coverImage?: RecnikImage;
  article: RecnikBlock[];
  faqs?: RecnikFaq[];
  links?: RecnikLinks;
}

/** Lagan oblik za /recnik (pretraga, filteri, abeceda). Bez clanka, FAQ-a i izvora. */
export interface RecnikTermSummary {
  id: string;
  slug: string;
  publicTitle: string;
  medicalCanonicalTerm: string;
  shortDefinition: string;
  categoryId: string;
  /** Aliasi i seo.searchAliases, samo za pretragu. */
  searchAliases: string[];
  firstLetter: string;
}

export interface RecnikDataset {
  terms: RecnikTerm[];
  sources: RecnikSource[];
  reviewers: RecnikReviewer[];
}
