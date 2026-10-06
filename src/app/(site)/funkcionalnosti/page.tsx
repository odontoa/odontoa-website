import type { Metadata } from 'next';
import Reveal from '@/components/shared/Reveal';
import { buildToolJsonLd } from '@/lib/structured-data/tool-jsonld';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import ClosingCta from '@/components/funkcionalnosti/ClosingCta';
import ProductIndex, { type IndexItem } from '@/components/funkcionalnosti/ProductIndex';
import { FEATURE_VISUALS, FeatureDetail } from '@/components/funkcionalnosti/visuals';
import { displayFont } from '../display-font';
/* site.css nosi --stellar-* tokene na .site-page wrapperu. */
import '../site.css';
import './feature-page.css';

const TITLE = 'Funkcionalnosti za stomatološke ordinacije | Odontoa';
const DESCRIPTION =
  'Zakazivanje, digitalni karton, RTG snimci, zubna tehnika, dokumentacija, finansije i AI asistent. Sve što ordinacija koristi svakodnevno, u jednom sistemu.';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://odontoa.com';
  const url = `${baseUrl}/funkcionalnosti`;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: TITLE,
      description: DESCRIPTION,
      siteName: 'Odontoa',
      locale: 'sr_RS',
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function FunkcionalnostiIndexPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://odontoa.com';
  const url = `${baseUrl}/funkcionalnosti`;

  const jsonLd = buildToolJsonLd({
    name: 'Funkcionalnosti',
    description: DESCRIPTION,
    url,
    baseUrl,
    breadcrumbs: [
      { name: 'Početna', url: baseUrl },
      { name: 'Funkcionalnosti', url },
    ],
  });

  /* Nazivi i opisi su isti kao na stranicama; detalji proizvoda se renderuju ovde
     (na serveru) i prosledjuju indeksu, koji na desktopu prikazuje jedan po jedan. */
  const items: IndexItem[] = FEATURE_PAGES.map((p) => ({
    slug: p.slug,
    name: p.navTitle,
    desc: p.shortDesc,
    title: p.title,
    frontWidth: FEATURE_VISUALS[p.slug]?.layout.frontWidth ?? 600,
    frontHeight: FEATURE_VISUALS[p.slug]?.layout.frontHeight ?? 400,
    focusX: FEATURE_VISUALS[p.slug]?.layout.focusX ?? 0.5,
    mobileMin: FEATURE_VISUALS[p.slug]?.layout.mobileMin,
  }));
  const details = Object.fromEntries(FEATURE_PAGES.map((p) => [p.slug, <FeatureDetail key={p.slug} slug={p.slug} />]));

  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero kataloga ── */}
      <section className="page-hero page-hero--plain page-hero--index">
        <div className="page-hero__inner">
          <Reveal>
            <p className="page-hero__eyebrow">Funkcionalnosti</p>
            <h1 className="page-hero__title">Sve što ordinacija koristi, u jednom sistemu</h1>
            <p className="page-hero__lead">
              Od zakazivanja i digitalnog kartona do zubne tehnike, dokumentacije i
              finansija. Izaberi funkcionalnost da vidiš kako radi.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── L5: lista svih sedam (server HTML) + jedan product canvas ── */}
      <section className="pi-section">
        <div className="pi-section__inner">
          <ProductIndex items={items} details={details} />
        </div>
      </section>

      {/* ── Zavrsni CTA: ugnjezdena ploca, isti kao na stranicama funkcionalnosti ── */}
      <ClosingCta />
    </div>
  );
}
