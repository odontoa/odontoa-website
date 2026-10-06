/* npm run recnik:test
   Strukturalni test recnika nad testnim datasetom (fixtures.ts, RECNIK_FIXTURES=1):
   publication gate, sazeci za /recnik, veze, validator (pozitivni i negativni slucajevi),
   JSON-LD graf (jedan @context, razresive @id reference, canonical host) i sitemap/llms.
   Ne pise nista na disk. */

process.env.RECNIK_FIXTURES = '1';

type Check = { name: string; ok: boolean; detail?: string };
const checks: Check[] = [];
const check = (name: string, ok: boolean, detail?: string) => checks.push({ name, ok, detail });

async function main() {
  // Dinamicki import: RECNIK_FIXTURES mora biti postavljen pre ucitavanja dataseta.
  const recnik = await import('@/lib/content/recnik');
  const { validateRecnik } = await import('@/lib/content/recnik/validate');
  const { RECNIK_FIXTURES } = await import('@/lib/content/recnik/fixtures');
  const jsonld = await import('@/lib/structured-data/glossary-jsonld');
  const { SITE_URL } = await import('@/lib/config/site-url');
  const { isSectionHidden } = await import('@/lib/config/hidden-sections');

  /* ── Dataset i publication gate ── */
  const base = validateRecnik(RECNIK_FIXTURES);
  check('fixtures: validacija bez gresaka', base.errors.length === 0, JSON.stringify(base.errors));

  const published = recnik.getPublishedTerms().map((t) => t.id);
  check('nacrt nije javan', !published.includes('fixture-0003'), published.join(','));
  check('dva javna pojma', published.length === 2, published.join(','));
  check('nacrt nema stranicu', recnik.getPublishedTermBySlug('test-pojam-nacrt') === undefined);

  /* ── Sazeci za /recnik ── */
  const summaries = recnik.getTermSummaries();
  const leaked = summaries.flatMap((s) => Object.keys(s)).filter((k) => ['article', 'faqs', 'sourceIds', 'seo', 'verification'].includes(k));
  check('sazetak bez clanka/FAQ/izvora', leaked.length === 0, leaked.join(','));
  check('sazetak ima aliase za pretragu', summaries.find((s) => s.id === 'fixture-0001')!.searchAliases.includes('fixture pretraga'));
  check('firstLetter digraf', recnik.firstLetter('Njega') === 'Nj' && recnik.firstLetter('džep') === 'Dž' && recnik.firstLetter('3D') === '#');

  /* ── Veze ── */
  const termA = recnik.getPublishedTermById('fixture-0001')!;
  const links = recnik.getTermLinks(termA);
  check('related: samo postojeci javni pojmovi', links.relatedTerms.map((t) => t.id).join() === 'fixture-0002');
  check('features razreseni', links.features.map((f) => f.slug).join() === 'zakazivac-termina,karton-i-odontogram');
  check('nepostojeci /za landing se preskace', links.landingPages.length === 0);
  check('blog veze prazne dok je blog sakriven', !isSectionHidden('/blogovi') || links.blogSlugs.length === 0);
  check('CTA iz registra', links.cta.id === 'demo');

  /* ── Alternate names / MeSH ── */
  const alt = recnik.getVerifiedAlternateNames(termA);
  check('alternateName samo verifikovani', alt.join() === 'TPA', alt.join());

  /* ── Validator: negativni slucajevi ── */
  const clone = () => JSON.parse(JSON.stringify(RECNIK_FIXTURES)) as typeof RECNIK_FIXTURES;
  const expectError = (name: string, mutate: (d: typeof RECNIK_FIXTURES) => void, pattern: RegExp) => {
    const d = clone();
    mutate(d);
    const { errors } = validateRecnik(d);
    check(`validator greska: ${name}`, errors.some((e) => pattern.test(e.message)), JSON.stringify(errors.map((e) => e.message)));
  };
  const expectWarning = (name: string, mutate: (d: typeof RECNIK_FIXTURES) => void, pattern: RegExp) => {
    const d = clone();
    mutate(d);
    const { warnings } = validateRecnik(d);
    check(`validator upozorenje: ${name}`, warnings.some((e) => pattern.test(e.message)), JSON.stringify(warnings.map((e) => e.message)));
  };
  expectError('dupli id', (d) => (d.terms[1].id = d.terms[0].id), /Dupli id/);
  expectError('dupli slug', (d) => (d.terms[1].slug = d.terms[0].slug), /Dupli slug/);
  expectError('nepostojeca kategorija', (d) => (d.terms[0].categoryId = 'nema'), /categoryId/);
  expectError('nepostojeci related', (d) => (d.terms[0].links!.relatedTermIds = ['nema']), /Povezani pojam "nema"/);
  expectError('dupli canonical', (d) => (d.terms[1].seo.canonicalPath = '/recnik/test-pojam-a'), /canonical path/);
  expectError('bez medicalCanonicalTerm', (d) => (d.terms[0].medicalCanonicalTerm = ''), /medicalCanonicalTerm/);
  expectError('bez shortDefinition', (d) => (d.terms[0].shortDefinition = ''), /shortDefinition/);
  expectError('bez izvora', (d) => (d.terms[0].sourceIds = []), /bez izvora/);
  expectError('nije verifikovan', (d) => (d.terms[0].verification.status = 'partial'), /verification\.status/);
  expectError('nije odobren', (d) => (d.terms[0].clinicalReview.status = 'pending'), /clinicalReview\.status/);
  expectError('nepostojeca OG slika', (d) => (d.terms[0].seo.ogImage = { src: '/images/nema.png', alt: 'x', width: 1, height: 1 }), /ne postoji u public/);
  expectError('nepostojeci izvor', (d) => (d.terms[0].sourceIds = ['nema']), /Izvor "nema"/);
  expectError('verified-synonym bez verifikacije', (d) => (d.terms[0].aliases![0] = { value: 'x', type: 'verified-synonym', medicallyVerified: false }), /verified-synonym/);
  expectWarning('dug SEO title', (d) => (d.terms[0].seo.seoTitle = 'x'.repeat(80)), /seoTitle ima/);
  expectWarning('kratak meta description', (d) => (d.terms[0].seo.metaDescription = 'kratko'), /metaDescription ima samo/);
  expectWarning('deljen alias', (d) => (d.terms[1].aliases = [{ value: 'TPA', type: 'abbreviation', medicallyVerified: true }]), /postoji na vise pojmova/);
  expectWarning('SEO kolizija', (d) => (d.terms[1].seo.seoEntryTerm = 'test pojam a'), /SEO kolizija/);
  expectWarning('orphan', (d) => { d.terms[0].links!.relatedTermIds = []; d.terms[1].links!.relatedTermIds = []; }, /orphan/);

  /* ── JSON-LD ── */
  const graphs = {
    term: jsonld.buildGlossaryTermJsonLd({
      term: termA,
      category: recnik.getCategoryById(termA.categoryId),
      sources: recnik.getTermSources(termA),
      reviewer: recnik.getTermReviewer(termA),
      breadcrumbs: [
        { name: 'Početna', path: '/' },
        { name: 'Rečnik', path: '/recnik' },
        { name: termA.publicTitle, path: '/recnik/test-pojam-a' },
      ],
      faqs: termA.faqs ?? [],
      imageUrl: `${SITE_URL}/images/og/odontoa-default.png`,
    }),
    index: jsonld.buildGlossaryIndexJsonLd('opis'),
    category: jsonld.buildGlossaryCategoryJsonLd(recnik.getCategoryById('anatomija')!, 'opis'),
  };

  for (const [name, graph] of Object.entries(graphs)) {
    const text = JSON.stringify(graph);
    check(`${name}: jedan @context`, (text.match(/"@context"/g) ?? []).length === 1);
    check(`${name}: @graph`, Array.isArray(graph['@graph']));
    const ids = graph['@graph'].map((n) => n['@id']).filter(Boolean) as string[];
    check(`${name}: jedinstveni @id`, new Set(ids).size === ids.length, ids.join(' '));
    const refs = [...text.matchAll(/\{"@id":"([^"]+)"\}/g)].map((m) => m[1]);
    const dangling = refs.filter((r) => !ids.includes(r));
    check(`${name}: sve @id reference razresive`, dangling.length === 0, dangling.join(' '));
    const urls = [...text.matchAll(/"(https?:\/\/[^"]+)"/g)].map((m) => m[1]).filter((u) => u.includes('odontoa.com'));
    const wrongHost = urls.filter((u) => !u.startsWith(SITE_URL));
    check(`${name}: canonical host`, wrongHost.length === 0, wrongHost.join(' '));
  }

  const nodes = graphs.term['@graph'];
  const page = nodes.find((n) => n['@type'] === 'MedicalWebPage')!;
  const term = nodes.find((n) => n['@type'] === 'DefinedTerm')!;
  check('term: MedicalWebPage sa mainEntity DefinedTerm', (page.mainEntity as { '@id': string })['@id'] === term['@id']);
  check('term: DefinedTerm.name = medicalCanonicalTerm', term.name === termA.medicalCanonicalTerm);
  check('term: alternateName bez SEO aliasa', JSON.stringify(term.alternateName) === '["TPA"]');
  check('term: bez termCode/sameAs bez exact MeSH', !('termCode' in term) && !('sameAs' in term));
  check('term: inDefinedTermSet', (term.inDefinedTermSet as { '@id': string })['@id'] === jsonld.DEFINED_TERM_SET_ID);
  check('term: citation = vidljivi izvori', Array.isArray(page.citation) && (page.citation as unknown[]).length === 1);
  check('term: reviewedBy + lastReviewed', Boolean(page.reviewedBy) && page.lastReviewed === '2026-10-06');
  check('term: autor je Organization', JSON.stringify(page.author).includes('#organization'));
  check('term: FAQPage 1:1', JSON.stringify(nodes.find((n) => n['@type'] === 'FAQPage')).includes('Placeholder pitanje?'));
  check('term: nema QAPage', !JSON.stringify(nodes).includes('QAPage'));

  /* ── Sitemap i llms ── */
  const { default: sitemap } = await import('../src/app/sitemap');
  const entries = await sitemap();
  const wrongHost = entries.filter((e) => !e.url.startsWith(SITE_URL));
  check('sitemap: canonical host', wrongHost.length === 0, wrongHost.map((e) => e.url).join(' '));
  check('sitemap: bez nacrta', !entries.some((e) => e.url.includes('test-pojam-nacrt')));
  check('sitemap: recnik samo kad nije sakriven', isSectionHidden('/recnik') ? !entries.some((e) => e.url.includes('/recnik')) : true);
  check('sitemap: staticne stranice bez lastModified', entries.filter((e) => !e.url.includes('/recnik/')).every((e) => !e.lastModified));

  const { GET } = await import('../src/app/api/llms/route');
  const llms = await (await GET()).text();
  check('llms: canonical host', !/https:\/\/odontoa\.com/.test(llms));
  check('llms: bez placeholder telefona', !llms.includes('123 4567'));
  check('llms: recnik samo kad je javan', isSectionHidden('/recnik') ? !llms.includes('/recnik') : true);

  /* ── Izvestaj ── */
  const failed = checks.filter((c) => !c.ok);
  for (const c of checks) console.log(`${c.ok ? 'OK  ' : 'FAIL'} ${c.name}${!c.ok && c.detail ? `\n     ${c.detail}` : ''}`);
  console.log(`\n${checks.length - failed.length}/${checks.length} provera prolazi.`);
  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
