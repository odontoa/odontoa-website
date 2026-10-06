import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';

/* Samo tvrdnje koje vec postoje na sajtu (pocetna, /register). */
const FACTS = ['Nalog za nekoliko minuta', 'Pacijente uvozimo mi', '30 dana besplatno'];

/**
 * Zavrsni CTA (C3, ugnjezdena ploca): lavanda okvir i bela ploca, isti jezik kao
 * kartica Finansija na pocetnoj. Stoji u nastavku sekcije iznad, zato prima njen ton.
 * Koriste ga /funkcionalnosti i svih sedam stranica funkcionalnosti; recnik ima svoj .page-cta.
 */
export default function ClosingCta({ tone = 'white' }: { tone?: 'white' | 'alt' }) {
  return (
    <section className={`fp-cta${tone === 'alt' ? ' fp-cta--alt' : ''}`}>
      <Reveal>
        <div className="fp-cta__frame">
          <div className="fp-cta__plate">
            <div className="fp-cta__text">
              <h2 className="fp-cta__title">Probaj na svojoj ordinaciji</h2>
              <p className="fp-cta__lead">
                Napravi nalog za nekoliko minuta ili nam se javi, pa da zajedno prođemo kroz sistem.
              </p>
              <div className="fp-cta__actions">
                <Link href="/register" className="hero__btn hero__btn--primary">
                  Započni besplatno
                </Link>
                <Link href="/demo" className="fp-cta__demo">
                  Zakaži demo
                  <ArrowRight size={15} strokeWidth={2} aria-hidden />
                </Link>
              </div>
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
