import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import { buildToolJsonLd } from '@/lib/structured-data/tool-jsonld';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
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

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m0 0l-4-4m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero kataloga ── */}
      <section className="page-hero page-hero--plain">
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

      {/* ── Katalog: svih sedam, AI ukljucen ── */}
      <section className="page-section page-section--alt">
        <div className="page-section__inner">
          <div className="page-index__grid">
            {FEATURE_PAGES.map((page, i) => (
              <Reveal key={page.slug} delay={i * 0.04} style={{ height: '100%' }}>
                <Link href={`/funkcionalnosti/${page.slug}`} className="page-index__card">
                  {/* Katalog numerise po svom redosledu; za sest iz grida to je
                      isti broj kao na pocetnoj, AI dobija sledeci. */}
                  <span className="page-index__num">{`/0${i + 1}`}</span>
                  <h2 className="page-index__title">{page.navTitle}</h2>
                  <p className="page-index__desc">{page.shortDesc}</p>
                  <span className="page-index__more">
                    Saznaj više
                    <ArrowIcon />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zavrsni CTA ── */}
      <section className="page-cta">
        <div className="page-cta__inner">
          <Reveal>
            <h2 className="page-cta__title">Probaj na svojoj ordinaciji</h2>
            <p className="page-cta__lead">
              Napravi nalog za nekoliko minuta ili nam se javi, pa da zajedno prođemo kroz
              sistem.
            </p>
            <div className="page-cta__actions">
              <Link href="/register" className="hero__btn hero__btn--primary">
                Započni besplatno
              </Link>
              {/* Isti par akcija kao hero stranice: primarno /register, sekundarno /demo. */}
              <Link href="/demo" className="page-cta__ghost">
                Zakaži demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
