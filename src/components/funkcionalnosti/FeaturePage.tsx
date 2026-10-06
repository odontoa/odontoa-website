import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import ClosingCta from './ClosingCta';
import FeatureBlocks, { toneAfterBlocks } from './blocks';
import { FEATURE_VISUALS, FeatureProduct } from './visuals';
import {
  FEATURE_PAGES,
  getRelatedFeaturePages,
  type FeaturePageData,
} from '@/lib/content/funkcionalnosti';

/**
 * Sistem stranica funkcionalnosti (H5 · V3 · B2 · P1 · R1).
 *
 * Svih sedam stranica su instance ove komponente; razlike su u podacima
 * (src/lib/content/funkcionalnosti.ts) i u prikazu proizvoda (./visuals).
 * Wrapper .site-page je obavezan: tokeni i --font-display su na njemu.
 */

/* Rezerva ako funkcionalnost nema nacrtan prikaz: postojeci snimak iz sadrzaja. */
function Screenshot({ visual }: { visual?: FeaturePageData['visual'] }) {
  if (!visual) return null;
  return (
    <div className="fp-shot">
      <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} priority />
    </div>
  );
}

const pageNumber = (slug: string) => String(FEATURE_PAGES.findIndex((p) => p.slug === slug) + 1).padStart(2, '0');

/* R1: tiha lista svih ostalih funkcionalnosti (isti dizajn na svih sedam stranica). */
function RelatedList({ pages }: { pages: FeaturePageData[] }) {
  return (
    <ul className="fp-rel-list">
      {pages.map((p) => (
        <li key={p.slug}>
          <Link href={`/funkcionalnosti/${p.slug}`} className="fp-rel-row">
            <span className="fp-rel-row__n" aria-hidden="true">
              {pageNumber(p.slug)}
            </span>
            <span className="fp-rel-row__name">{p.navTitle}</span>
            <span className="fp-rel-row__desc">{p.shortDesc}</span>
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden className="fp-rel-row__arrow" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function FeaturePage({ page }: { page: FeaturePageData }) {
  const hasVisual = Boolean(FEATURE_VISUALS[page.slug]);
  const relatedTone = toneAfterBlocks(page.body);

  return (
    <>
      {/* ── H5: centriran hero; detalj proizvoda ispred, aplikacija iza ── */}
      <section className="fp-hero">
        <div className="fp-hero__inner">
          <Reveal>
            <Link href="/funkcionalnosti" className="fp-hero__back">
              <ArrowLeft size={13} strokeWidth={2} aria-hidden />
              Funkcionalnosti
            </Link>
            <h1 className="fp-hero__title">{page.title}</h1>
            <p className="fp-hero__lead">{page.lead}</p>
            {/* Iste klase kao CTA u heroju pocetne, da dugmad budu identicna. */}
            <div className="fp-hero__actions">
              <Link href="/register" className="hero__btn hero__btn--primary">
                Započni besplatno
              </Link>
              <Link href="/demo" className="hero__link">
                Zakaži demo
                <ArrowRight size={15} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="fp-hero__product">
          {hasVisual ? <FeatureProduct slug={page.slug} /> : <Screenshot visual={page.visual} />}
        </div>
      </section>

      <FeatureBlocks blocks={page.body} />

      {/* ── Ostale funkcionalnosti: svih šest, isti R1 na svakoj stranici ── */}
      <section className={`fp-sec fp-sec--related${relatedTone === 'alt' ? ' fp-sec--alt' : ''}`}>
        <div className="fp-sec__inner">
          <Reveal>
            <p className="fp-sec__eyebrow">Dalje</p>
            <h2 className="fp-sec__title">Ostale funkcionalnosti</h2>
          </Reveal>
          <RelatedList pages={getRelatedFeaturePages(page.slug)} />
        </div>
      </section>

      {/* ── Zavrsni CTA: ugnjezdena ploca, u nastavku sekcije iznad ── */}
      <ClosingCta tone={relatedTone === 'alt' ? 'alt' : 'white'} />
    </>
  );
}
