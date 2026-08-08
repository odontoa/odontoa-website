import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FeaturePage from '@/components/funkcionalnosti/FeaturePage';
import { buildToolJsonLd } from '@/lib/structured-data/tool-jsonld';
import { FEATURE_PAGES, getFeaturePage } from '@/lib/content/funkcionalnosti';
import { displayFont } from '../../display-font';
/* home4.css nosi definiciju --stellar-* tokena na .home4-page wrapperu.
   Bez njega feature-page.css nema nijednu boju. */
import '../../home4.css';
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://odontoa.com';
  const url = `${baseUrl}/funkcionalnosti/${page.slug}`;

  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: page.seo.title,
      description: page.seo.description,
      siteName: 'Odontoa',
      locale: 'sr_RS',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo.title,
      description: page.seo.description,
    },
  };
}

export default function FunkcionalnostPage({ params }: Params) {
  const page = getFeaturePage(params.slug);
  if (!page) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://odontoa.com';
  const url = `${baseUrl}/funkcionalnosti/${page.slug}`;

  /* FAQ blokovi iz tela postaju FAQPage schema, da se pitanja mogu prikazati
     u rezultatima pretrage. Stranice bez FAQ bloka je jednostavno nemaju. */
  const faqs = page.body
    .filter((b): b is Extract<typeof b, { type: 'faq' }> => b.type === 'faq')
    .flatMap((b) => b.items.map((i) => ({ question: i.q, answer: i.a })));

  const jsonLd = buildToolJsonLd({
    name: page.title,
    description: page.seo.description,
    url,
    baseUrl,
    breadcrumbs: [
      { name: 'Pocetna', url: baseUrl },
      { name: 'Funkcionalnosti', url: `${baseUrl}/funkcionalnosti` },
      { name: page.navTitle, url },
    ],
    faqs: faqs.length > 0 ? faqs : undefined,
  });

  return (
    <div className={`home4-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeaturePage page={page} />
    </div>
  );
}
