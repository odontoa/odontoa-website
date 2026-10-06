import { z } from 'zod';
import {
  ALIAS_TYPES,
  CLINICAL_REVIEW_STATUSES,
  CTA_IDS,
  MESH_MATCHES,
  PUBLICATION_STATUSES,
  SOURCE_TIERS,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
} from './types';

/* Sema JSON-a za scripts/import-recnik-json.ts (format: docs/RECNIK_IMPORT_FORMAT.md).
   Koristi je samo import skripta, ne i sajt. Mora da prati tipove u types.ts (enumi se
   dele direktno); repo nema strictNullChecks, pa z.ZodType<RecnikTerm> anotacija ne radi.
   .strict() odbija nepoznata polja (greske u nazivu polja se ne gube tiho). */

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'mora biti ISO 8601 datum');

const image = z
  .object({
    src: z.string().startsWith('/'),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();

const inline = z.union([
  z.string(),
  z.object({ type: z.literal('term'), termId: z.string().min(1), text: z.string().min(1) }).strict(),
  z.object({ type: z.literal('link'), href: z.string().min(1), text: z.string().min(1) }).strict(),
  z.object({ type: z.literal('cite'), sourceId: z.string().min(1), text: z.string().optional() }).strict(),
]);

const richText = z.union([z.string(), z.array(inline)]);

const block = z.union([
  z.object({ type: z.literal('p'), text: richText }).strict(),
  z.object({ type: z.literal('h2'), text: z.string().min(1) }).strict(),
  z.object({ type: z.literal('h3'), text: z.string().min(1) }).strict(),
  z.object({ type: z.literal('ul'), items: z.array(richText) }).strict(),
  z.object({ type: z.literal('ol'), items: z.array(richText) }).strict(),
]);

export const sourceSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    publisher: z.string().min(1),
    url: z.string().url().optional(),
    sourceType: z.enum(SOURCE_TYPES),
    tier: z.enum(SOURCE_TIERS).optional(),
    accessedAt: isoDate.optional(),
  })
  .strict();

export const reviewerSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    title: z.string().min(1),
    profileUrl: z.string().url().optional(),
    sameAs: z.array(z.string().url()).optional(),
    active: z.boolean(),
  })
  .strict();

export const termSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    medicalCanonicalTerm: z.string(),
    publicTitle: z.string(),
    shortDefinition: z.string(),
    latinTerm: z.string().optional(),
    meshPreferredTerm: z.string().optional(),
    meshId: z.string().optional(),
    meshUrl: z.string().url().optional(),
    meshMatch: z.enum(MESH_MATCHES).optional(),
    aliases: z
      .array(
        z
          .object({
            value: z.string().min(1),
            type: z.enum(ALIAS_TYPES),
            medicallyVerified: z.boolean(),
            sourceIds: z.array(z.string()).optional(),
          })
          .strict(),
      )
      .optional(),
    categoryId: z.string().min(1),
    clusterId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    verification: z
      .object({
        status: z.enum(VERIFICATION_STATUSES),
        tier: z.enum(SOURCE_TIERS).optional(),
        sourceIds: z.array(z.string()),
        verifiedAt: isoDate.optional(),
      })
      .strict(),
    clinicalReview: z
      .object({
        status: z.enum(CLINICAL_REVIEW_STATUSES),
        reviewerId: z.string().optional(),
        reviewedAt: isoDate.optional(),
      })
      .strict(),
    publicationStatus: z.enum(PUBLICATION_STATUSES),
    sourceIds: z.array(z.string()),
    publishedAt: isoDate.optional(),
    updatedAt: isoDate.optional(),
    seo: z
      .object({
        primaryKeyword: z.string().optional(),
        seoTitle: z.string(),
        metaDescription: z.string(),
        seoEntryTerm: z.string().optional(),
        searchAliases: z.array(z.string()).optional(),
        canonicalPath: z.string().optional(),
        noindex: z.boolean().optional(),
        ogImage: image.optional(),
      })
      .strict(),
    coverImage: image.optional(),
    article: z.array(block),
    faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) }).strict()).optional(),
    links: z
      .object({
        relatedTermIds: z.array(z.string()).optional(),
        blogSlugs: z.array(z.string()).optional(),
        featureSlugs: z.array(z.string()).optional(),
        landingPaths: z.array(z.string()).optional(),
        ctaId: z.enum(CTA_IDS).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const importFileSchema = z
  .object({
    sources: z.array(sourceSchema).optional(),
    reviewers: z.array(reviewerSchema).optional(),
    terms: z.array(termSchema).optional(),
  })
  .strict();

