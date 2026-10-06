import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import FeatureBlocks, { toneAfterBlocks } from './blocks';
import {
  getRelatedFeaturePages,
  type FeaturePageData,
} from '@/lib/content/funkcionalnosti';

/**
 * Template stranice funkcionalnosti.
 *
 * Sest funkcionalnosti + AI asistent su instance ove komponente sa razlicitim
 * podacima. Dizajn se menja ovde, na jednom mestu.
 *
 * Wrapper .site-page je obavezan: --stellar-* tokeni i --font-display su
 * definisani na njemu, ne na :root. Bez njega stranica ostaje bez boja i fonta.
 */

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function BackIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13 8H3m0 0l4-4M3 8l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureVisual({ visual }: { visual?: FeaturePageData['visual'] }) {
  return (
    <Reveal delay={0.12} className="page-visual">
      <div className="page-visual__frame">
        <div className="page-visual__bar" aria-hidden="true">
          <span className="page-visual__dot" />
          <span className="page-visual__dot" />
          <span className="page-visual__dot" />
        </div>
        <div
          className="page-visual__body"
          /* Uz 'contain' pozadina okvira preuzima boju ivice slike, da se spoj
             ispod slike ne vidi. */
          style={visual?.bg ? { background: visual.bg } : undefined}
        >
          {visual ? (
            /* Dimenzije dolaze iz podataka, po slici, da nema pomeranja layouta.
               Prikaz kontrolise CSS: fiksna visina okvira + object-fit cover,
               pa se donji deo slike odseca. */
            <Image
              className={
                visual.fit === 'contain'
                  ? 'page-visual__img page-visual__img--contain'
                  : 'page-visual__img'
              }
              src={visual.src}
              alt={visual.alt}
              width={visual.width}
              height={visual.height}
              priority
            />
          ) : (
            /* Placeholder dok ne stignu pravi screenshotovi.
               Kad se popuni polje `visual` u podacima, ova grana nestaje sama. */
            <div className="page-visual__placeholder">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M4 17l4.5-4.5 3 3 3.5-3.5L20 16"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="page-visual__placeholder-label">Prikaz funkcionalnosti</p>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function FeaturePage({ page }: { page: FeaturePageData }) {
  const related = getRelatedFeaturePages(page.slug);
  /* Podloga se cita iz tipa poslednjeg bloka, ne iz njihovog broja, da se dve
     iste podloge ne dodirnu bez obzira na to koje blokove stranica ima. */
  const relatedTone = toneAfterBlocks(page.body);

  return (
    <>
      {/* ── Hero stranice ── */}
      <section className="page-hero">
        <div className="page-hero__inner">
          <Reveal>
            <Link href="/funkcionalnosti" className="page-hero__eyebrow">
              <BackIcon />
              Funkcionalnosti
            </Link>
            <h1 className="page-hero__title">{page.title}</h1>
            <p className="page-hero__lead">{page.lead}</p>
            {/* Iste klase kao CTA u heroju pocetne, da dugmad budu identicna. */}
            <div className="page-hero__actions">
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

        {/* ── Vizual funkcionalnosti ── */}
        <FeatureVisual visual={page.visual} />
      </section>

      {/* ── Telo: blokovi iz podataka ── */}
      <FeatureBlocks blocks={page.body} />

      {/* ── Srodne funkcionalnosti ── */}
      <section
        className={`page-section page-section--related${
          relatedTone === 'alt' ? ' page-section--alt' : ''
        }`}
      >
        <div className="page-section__inner">
          <Reveal>
            <p className="page-section__eyebrow">
              <span className="page-section__dash" aria-hidden="true" />
              Dalje
            </p>
            <h2 className="page-section__title">Ostale funkcionalnosti</h2>
          </Reveal>
          <div className="page-related__grid">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.04}>
                <Link
                  href={`/funkcionalnosti/${item.slug}`}
                  className="page-related__card"
                >
                  {item.navTitle}
                  <ArrowIcon />
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
    </>
  );
}
