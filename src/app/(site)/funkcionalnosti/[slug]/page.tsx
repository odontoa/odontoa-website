import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FeaturePage from '@/components/funkcionalnosti/FeaturePage';
import { buildToolJsonLd } from '@/lib/structured-data/tool-jsonld';
import JsonLd from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo/metadata';
import { FEATURE_PAGES, getFeaturePage } from '@/lib/content/funkcionalnosti';
import { displayFont } from '../../display-font';
/* site.css nosi definiciju --stellar-* tokena na .site-page wrapperu.
   Bez njega feature-page.css nema nijednu boju. */
import '../../site.css';
import '../feature-page.css';

type Params = { params: { slug: string } };

/** Svih sedam stranica se prerenderuje u build-u. */
export function generateStaticParams() {
  return FEATURE_PAGES.map((p) => ({ slug: p.slug }));
}

/** Nepoznat slug je 404, ne pokusaj SSR-a. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = getFeaturePage(params.slug);
  if (!page) {
    return { title: 'Stranica nije pronađena | Odontoa' };
  }

  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: `/funkcionalnosti/${page.slug}`,
  });
}

export default function FunkcionalnostPage({ params }: Params) {
  const page = getFeaturePage(params.slug);
  if (!page) {
    notFound();
  }

  const path = `/funkcionalnosti/${page.slug}`;

  /* FAQ blokovi iz tela postaju FAQPage schema, da se pitanja mogu prikazati
     u rezultatima pretrage. Stranice bez FAQ bloka je jednostavno nemaju. */
  const faqs = page.body
    .filter((b): b is Extract<typeof b, { type: 'faq' }> => b.type === 'faq')
    .flatMap((b) => b.items.map((i) => ({ question: i.q, answer: i.a })));

  const jsonLd = buildToolJsonLd({
    name: page.title,
    description: page.seo.description,
    path,
    breadcrumbs: [
      { name: 'Početna', path: '/' },
      { name: 'Funkcionalnosti', path: '/funkcionalnosti' },
      { name: page.navTitle, path },
    ],
    faqs: faqs.length > 0 ? faqs : undefined,
    includeSoftware: true,
  });

  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <JsonLd data={jsonLd} />
      <FeaturePage page={page} />
    </div>
  );
}
