import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

/* Ikone su inline SVG kao u ostalim home4 sekcijama (boju nasledjuju iz parenta) */
const ICON_CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ICON_SPARK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3v3M12 18v3M4.9 7.4l2.1 2.1M17 14.5l2.1 2.1M3 12h3M18 12h3M4.9 16.6l2.1-2.1M17 9.5l2.1-2.1" />
  </svg>
);

const ICON_LOCK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

const ICON_SHIELD = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6L12 3z" />
  </svg>
);

/* Kratke labele: detalji za tehniku i finansije su u Home4Finance sekciji iznad,
   ovde svaka stavka staje u jedan red pa lista ostaje prozracna.
   Prve tri (neograniceno) idu na vrh; lista se puni po kolonama pa ostaju
   grupisane na vrhu leve kolone. Ako se broj stavki menja, promeni i
   grid-template-rows u .home4-pricing__features. */
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
  'Neograničeni SMS',
  'Neograničeni email',
  'AI asistent',
  'Šabloni dokumenata',
  'Uloge i pristup',
  'Azure infrastruktura',
];

export default function Home4Pricing() {
  return (
    <section className="home4-pricing">
      <div className="home4-pricing__inner">
        <Reveal>
          <div className="home4-pricing__head">
            <p className="home4-pricing__eyebrow">Cena</p>
            <h2 className="home4-h2">Jedan paket. Sve unutra.</h2>
            <p className="home4-pricing__lede">
              Bez skrivenih nivoa. Plaćaš jednu cenu i dobijaš ceo sistem.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="home4-pricing__card">
            <span className="home4-pricing__badge">
              {ICON_SPARK}
              Uvodna cena za prvih 100 ordinacija
            </span>

            <h3 className="home4-pricing__plan">Kompletan paket</h3>

            <p className="home4-pricing__price">
              <span className="home4-pricing__amount">12 EUR</span>
              <span className="home4-pricing__per">/ mes</span>
            </p>
            {/* Mehanika naplate stoji uz cenu; founding obecanje je u lock redu ispod */}
            <p className="home4-pricing__billing">Plaća se godišnje (144 EUR)</p>

            <p className="home4-pricing__lock">
              <span className="home4-pricing__lock-icon">{ICON_LOCK}</span>
              <span>
                Cena ti ostaje 12 EUR zauvek. Kad kasnije poraste, tvoja se ne menja.
              </span>
            </p>

            <div className="home4-pricing__divider" />

            <ul className="home4-pricing__features">
              {FEATURES.map((feature) => (
                <li key={feature} className="home4-pricing__feature">
                  <span className="home4-pricing__feature-icon">{ICON_CHECK}</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="home4-pricing__divider" />

            <Link href="/register" className="home4-btn-cta home4-pricing__cta">
              <span>Započni besplatno</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <p className="home4-pricing__micro">30 dana besplatno</p>
            <p className="home4-pricing__note">Mesečno plaćanje: 49 EUR / mes</p>

            {/* HIPAA se odnosi na Azure kao infrastrukturu, ne na aplikaciju.
                Zato "HIPAA infrastruktura (Azure)", a ne golo "HIPAA compliant". */}
            <p className="home4-pricing__compliance">
              <span className="home4-pricing__compliance-icon">{ICON_SHIELD}</span>
              <span>GDPR usklađeno</span>
              <span className="home4-pricing__compliance-sep"> · </span>
              <span className="home4-pricing__compliance-hipaa">HIPAA infrastruktura (Azure)</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="home4-pricing__footer">
            <span>Više ordinacija ili grupa praksi? Custom cena po dogovoru.</span>
            <Link href="/kontakt" className="home4-pricing__footer-link">
              <span>Kontaktiraj nas</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
