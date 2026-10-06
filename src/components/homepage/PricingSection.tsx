import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';

/* Ikone su inline SVG kao u ostalim sekcijama pocetne (boju nasledjuju iz parenta) */
const ICON_CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* Sve trenutno dostupne funkcionalnosti su ukljucene u cenu. 14 stavki, prikazane kao
   dve nezavisne kolone po 7: visina reda u jednoj koloni ne utice na drugu, pa je
   razmak izmedju svih redova isti i nijedna stavka ne ostaje sama. */
const FEATURES = [
  'Neograničeno doktora',
  'Neograničeno pacijenata',
  'Neograničeno stolica',
  'Kalendar i zakazivanje',
  'Karton i odontogram',
  'MKB-10',
  'RTG i slike',
  'Zubna tehnika',
  'Finansije',
  'SMS i email obaveštenja i podsetnici',
  'AI asistent',
  'Šabloni dokumenata',
  'Uloge i pristup',
  'Azure infrastruktura',
];

const FEATURE_COLUMNS = [
  FEATURES.slice(0, Math.ceil(FEATURES.length / 2)),
  FEATURES.slice(Math.ceil(FEATURES.length / 2)),
];

export default function PricingSection() {
  return (
    <section className="pricing">
      <div className="pricing__inner">
        <Reveal>
          <div className="pricing__head">
            <p className="pricing__eyebrow">Cena</p>
            <h2 className="section-title">Sve funkcionalnosti. Jedna cena.</h2>
            <p className="pricing__lede">
              Bez naplate po stolici i bez doplate za pojedinačne module.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="pricing__card">
            {/* Leva strana nosi samo cenu: razume se za dve sekunde */}
            <div className="pricing__side">
              <span className="pricing__badge">
                <span className="pricing__badge-dot" aria-hidden />
                Cena za rani pristup
              </span>

              <p className="pricing__price">
                <span className="pricing__amount">12 €</span>
                <span className="pricing__per">/ mesečno</span>
              </p>
              <p className="pricing__billing">
                <span>144 € godišnje ·</span> <span>naplata jednom godišnje</span>
              </p>

              <Link href="/register" className="btn-cta pricing__cta">
                <span>Započni besplatno</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {/* Desna ploca je dokaz vrednosti */}
            <div className="pricing__plate">
              <div className="pricing__plate-head">
                <h3 className="pricing__plate-title">Uključeno u cenu</h3>
                <span className="pricing__plate-count">{FEATURES.length} funkcionalnosti</span>
              </div>
              <div className="pricing__features">
                {FEATURE_COLUMNS.map((column, i) => (
                  <ul key={i} className="pricing__feature-list">
                    {column.map((feature) => (
                      <li key={feature} className="pricing__feature">
                        <span className="pricing__feature-icon">{ICON_CHECK}</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="pricing__footer">
            <span>Više ordinacija?</span>
            <Link href="/kontakt" className="pricing__footer-link">
              <span>Javi nam se</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
