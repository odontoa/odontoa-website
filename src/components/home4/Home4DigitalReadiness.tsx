import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import Reveal from './Reveal';

/* Oblasti i procenti prate ono sto test stvarno meri (vidi src/components/alati/quiz-data.ts).
   Peta oblast, "Tim i interna organizacija", izostavljena je da panel ostane citljiv.
   Napomena: kad se u testu Zalihe zamene Zubnom tehnikom, azurirati i ovde. */
const RESULT_BARS = [
  { label: 'Kartoni pacijenata', percent: 80 },
  { label: 'Zakazivanje', percent: 40 },
  { label: 'Zalihe i materijal', percent: 60 },
  { label: 'Analitika', percent: 20 },
];

/* Nivo i "najslabije" tag se izvode iz procenata, da niz ostane jedini izvor istine. */
const levelFor = (percent: number) =>
  percent >= 70 ? 'hi' : percent >= 40 ? 'mid' : 'low';
const WEAKEST = Math.min(...RESULT_BARS.map((bar) => bar.percent));

/* Gauge: polukrug poluprecnika 82 u viewBox-u 200x112 (isti luk kao u referenci).
   Duzina popune se racuna iz istog SCORE iz kog se ispisuje broj, pa broj i luk
   ne mogu da se raziđu. */
const SCORE = 55;
const GAUGE_R = 82;
const GAUGE_ARC = Math.PI * GAUGE_R;

export default function Home4DigitalReadiness() {
  return (
    <section className="home4-readiness">
      <div className="home4-readiness__inner">
        {/* Klasa stoji na Reveal-u, ne na __text divu: Reveal je taj koji je stvarna
            grid stavka, pa se order hvata za njega. */}
        <Reveal className="home4-readiness__col-text">
        <div className="home4-readiness__text">
          <p className="home4-readiness__eyebrow mb-3 text-sm font-medium">
            Besplatan alat
          </p>
          <h2 className="home4-h2 home4-readiness__title" style={{ marginBottom: 16 }}>
            Gde ti ordinacija najviše gubi vreme?
          </h2>
          <p className="home4-readiness__lede text-[16px] leading-[1.65] mb-6">
            Za 2 minuta saznaj gde ti ordinacija gubi vreme i novac. Kratak test,
            bez registracije, rezultat odmah.
          </p>

          <Link
            href="/alati/digitalna-spremnost-ordinacije"
            className="home4-btn-cta home4-readiness__cta"
          >
            <span>Proveri digitalnu spremnost</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        </Reveal>

        <div className="home4-readiness__visual">
          <Reveal delay={0.12}>
          {/* Staklo umesto bele kartice: bela povrsina bi presekla tamni ritam sekcije
              i sudarila se sa purpurnim radialom koji stoji tacno iza panela. */}
          <div className="home4-readiness__panel">
            <div className="home4-readiness__panel-head">
              <div className="home4-readiness__panel-top">
                <span className="home4-readiness__panel-tag">Primer rezultata</span>
                <span className="home4-readiness__panel-band">Delimično digitalno</span>
              </div>

              <div className="home4-readiness__gauge">
                <div className="home4-readiness__gauge-wrap">
                  {/* stopColor atributi su fallback za pretrazivace bez color-mix,
                      isti obrazac kao dupla box-shadow deklaracija na .home4-fin__card.
                      Prava boja dolazi iz CSS-a (stop-color na klasama ispod). */}
                  <svg viewBox="0 0 200 112" aria-hidden="true">
                    <defs>
                      <linearGradient id="home4-readiness-gauge" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b6ff0" className="home4-readiness__gauge-stop-a" />
                        <stop offset="55%" stopColor="#6e51e0" className="home4-readiness__gauge-stop-b" />
                        <stop offset="100%" stopColor="#5a3ec8" className="home4-readiness__gauge-stop-c" />
                      </linearGradient>
                    </defs>
                    <path
                      className="home4-readiness__gauge-track"
                      d="M18,102 A82,82 0 0 1 182,102"
                      fill="none"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      className="home4-readiness__gauge-fill"
                      d="M18,102 A82,82 0 0 1 182,102"
                      fill="none"
                      stroke="url(#home4-readiness-gauge)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(GAUGE_ARC * SCORE) / 100} ${GAUGE_ARC}`}
                    />
                  </svg>
                  <div className="home4-readiness__gauge-num">
                    <b>{SCORE}</b>
                    <span>od 100</span>
                  </div>
                </div>
                <p className="home4-readiness__gauge-cap">Ima prostora za napredak</p>
              </div>
            </div>

            <ul className="home4-readiness__bars">
              {RESULT_BARS.map(({ label, percent }) => (
                <li
                  key={label}
                  className={`home4-readiness__bar is-${levelFor(percent)}`}
                >
                  <div className="home4-readiness__bar-row">
                    <span className="home4-readiness__bar-label">{label}</span>
                    {percent === WEAKEST && (
                      <span className="home4-readiness__bar-tag">najslabije</span>
                    )}
                    <span className="home4-readiness__bar-value">{percent}%</span>
                  </div>
                  <div className="home4-readiness__bar-track" aria-hidden="true">
                    <span
                      className="home4-readiness__bar-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="home4-readiness__panel-foot">
              <span className="home4-readiness__panel-foot-icon">
                <Info size={16} aria-hidden="true" />
              </span>
              <span>
                Dobijaš <b>konkretne sledeće korake</b> za svaku oblast, poređane po
                hitnosti.
              </span>
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
