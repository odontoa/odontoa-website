import type { RecnikDataset } from './types';

/* SAMO ZA TEST BUILD: neutralni placeholder podaci za proveru sablona, rute, sitemap-a i
   JSON-LD-a kad je pravi dataset prazan. Nisu medicinski sadrzaj.

   Ukljucuju se iskljucivo sa RECNIK_FIXTURES=1 (vidi src/lib/content/recnik/index.ts),
   a na Vercel produkciji ta kombinacija rusi build. Ne prebacivati u data/. */
export const RECNIK_FIXTURES: RecnikDataset = {
  sources: [
    {
      id: 'fixture-izvor',
      title: 'Testni izvor (fixture)',
      publisher: 'Odontoa test',
      url: 'https://example.org/odontoa-fixture',
      sourceType: 'other',
      tier: 'C',
      accessedAt: '2026-10-06',
    },
  ],
  reviewers: [
    {
      id: 'fixture-recenzent',
      name: 'Testni recenzent',
      title: 'fixture',
      active: true,
    },
  ],
  terms: [
    {
      id: 'fixture-0001',
      slug: 'test-pojam-a',
      medicalCanonicalTerm: 'Test pojam A',
      publicTitle: 'Test pojam A (fixture)',
      shortDefinition: 'Placeholder definicija za testiranje šablona rečnika. Nije medicinski sadržaj.',
      aliases: [
        { value: 'TPA', type: 'abbreviation', medicallyVerified: true, sourceIds: ['fixture-izvor'] },
        { value: 'testni izraz', type: 'seo-alias', medicallyVerified: false },
      ],
      categoryId: 'anatomija',
      clusterId: 'fixture-klaster',
      verification: { status: 'verified', tier: 'C', sourceIds: ['fixture-izvor'], verifiedAt: '2026-10-06' },
      clinicalReview: { status: 'approved', reviewerId: 'fixture-recenzent', reviewedAt: '2026-10-06' },
      publicationStatus: 'published',
      sourceIds: ['fixture-izvor'],
      publishedAt: '2026-10-06T10:00:00.000Z',
      updatedAt: '2026-10-06T12:00:00.000Z',
      seo: {
        seoTitle: 'Test pojam A',
        metaDescription: 'Placeholder meta opis za proveru metadata, canonical-a i Open Graph podataka na stranici pojma.',
        seoEntryTerm: 'test pojam a',
        searchAliases: ['fixture pretraga'],
      },
      article: [
        { type: 'p', text: 'Placeholder pasus za proveru prikaza članka.' },
        { type: 'h2', text: 'Placeholder podnaslov' },
        {
          type: 'p',
          text: [
            'Interni link ka ',
            { type: 'term', termId: 'fixture-0002', text: 'drugom test pojmu' },
            ', ka ',
            { type: 'link', href: '/funkcionalnosti/zakazivac-termina', text: 'funkcionalnosti' },
            ' i citat ',
            { type: 'cite', sourceId: 'fixture-izvor' },
            '.',
          ],
        },
        { type: 'ul', items: ['Prva stavka', [{ type: 'link', href: '/za/nepostojeca', text: 'skrivena ruta' }]] },
      ],
      faqs: [{ question: 'Placeholder pitanje?', answer: 'Placeholder odgovor.' }],
      links: {
        relatedTermIds: ['fixture-0002'],
        featureSlugs: ['zakazivac-termina', 'karton-i-odontogram'],
        blogSlugs: ['nepostojeci-post'],
        landingPaths: ['/za/ordinacije'],
        ctaId: 'demo',
      },
    },
    {
      id: 'fixture-0002',
      slug: 'test-pojam-b',
      medicalCanonicalTerm: 'Test pojam B',
      publicTitle: 'Test pojam B',
      shortDefinition: 'Druga placeholder definicija za proveru povezanih pojmova.',
      categoryId: 'endodoncija',
      verification: { status: 'verified', sourceIds: ['fixture-izvor'] },
      clinicalReview: { status: 'approved' },
      publicationStatus: 'published',
      sourceIds: ['fixture-izvor'],
      publishedAt: '2026-10-06T10:00:00.000Z',
      seo: {
        seoTitle: 'Test pojam B',
        metaDescription: 'Placeholder meta opis za drugi testni pojam rečnika, za proveru veza i sitemap-a.',
      },
      article: [{ type: 'p', text: 'Placeholder pasus.' }],
      links: { relatedTermIds: ['fixture-0001'] },
    },
    {
      id: 'fixture-0003',
      slug: 'test-pojam-nacrt',
      medicalCanonicalTerm: 'Test pojam nacrt',
      publicTitle: 'Test pojam nacrt',
      shortDefinition: 'Nacrt: ne sme se pojaviti na sajtu.',
      categoryId: 'protetika',
      verification: { status: 'unverified', sourceIds: [] },
      clinicalReview: { status: 'pending' },
      publicationStatus: 'draft',
      sourceIds: [],
      seo: { seoTitle: '', metaDescription: '' },
      article: [],
    },
  ],
};
