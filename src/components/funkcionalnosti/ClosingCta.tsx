import Link from 'next/link';
import { Check } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';

/* Samo tvrdnje koje vec postoje na sajtu (pocetna, /register). */
const FACTS = ['Nalog za nekoliko minuta', 'Mogućnost uvoza postojećih pacijenata', '30 dana besplatno'];

/**
 * Zavrsni CTA (V4, tamna traka): puna sirina, isti tamni gradijent i purpurni sjaj kao
 * Readiness sekcija na pocetnoj. Copy levo, akcija i trust poruke desno.
 * Traka je tamna nezavisno od sekcije iznad, pa ne prima njen ton.
 * Koriste ga /funkcionalnosti i svih sedam stranica funkcionalnosti; recnik ima svoj .page-cta.
 */
export default function ClosingCta() {
  return (
    <section className="fp-cta">
      <Reveal>
        <div className="fp-cta__inner">
          <div className="fp-cta__text">
            <h2 className="fp-cta__title">Probaj na svojoj ordinaciji</h2>
            <p className="fp-cta__lead">
              Napravi nalog za nekoliko minuta ili nam se javi, pa da zajedno prođemo kroz sistem.
            </p>
          </div>
          <div className="fp-cta__side">
            {/* Jedna akcija na kraju stranice; link za demo ostaje u heru stranice. */}
            <div className="fp-cta__actions">
              <Link href="/register" className="hero__btn hero__btn--primary">
                Započni besplatno
              </Link>
            </div>
            <ul className="fp-cta__facts">
              {FACTS.map((f) => (
                <li key={f}>
                  <span aria-hidden="true">
                    <Check size={12} strokeWidth={2.4} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
