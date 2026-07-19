import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function Home4DigitalReadiness() {
  return (
    <section className="home4-readiness">
      <div className="home4-readiness__inner">
        <Reveal>
        <div className="home4-readiness__text">
          <p className="home4-readiness__eyebrow mb-3 text-sm font-medium">
            Besplatan alat
          </p>
          <h2 className="home4-h2 home4-readiness__title" style={{ marginBottom: 16 }}>
            Gde vaša ordinacija najviše gubi vreme?
          </h2>
          <p className="home4-readiness__lede text-[16px] leading-[1.65] mb-6">
            Odgovorite na 12 kratkih pitanja i dobijte pregled oblasti koje
            najviše utiču na organizaciju: kartoni, termini, zalihe, tim i
            analitika. Bez registracije, rezultat odmah.
          </p>

          <Link
            href="/alati/digitalna-spremnost-ordinacije"
            className="home4-btn-cta home4-readiness__cta"
          >
            <span>Proverite digitalnu spremnost</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
