import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home3DigitalReadiness() {
  return (
    <section className="home3-readiness">
      <div className="home3-readiness__inner">
        <div className="home3-readiness__text">
          <p className="home3-readiness__eyebrow mb-3 text-sm font-medium">
            Besplatan alat
          </p>
          <h2 className="home3-readiness__title text-[40px] leading-[1.2] font-medium tracking-[-1.1px] mb-4">
            Gde vaša ordinacija najviše gubi vreme?
          </h2>
          <p className="home3-readiness__lede text-[16px] leading-[1.65] mb-6">
            Odgovorite na 12 kratkih pitanja i dobijte pregled oblasti koje
            najviše utiču na organizaciju: kartoni, termini, zalihe, tim i
            analitika. Bez registracije, rezultat odmah.
          </p>

          <Link
            href="/alati/digitalna-spremnost-ordinacije"
            className="home3-btn-cta home3-readiness__cta"
          >
            <span>Proverite digitalnu spremnost</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
