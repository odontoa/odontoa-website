import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroDashboard from './HeroDashboard';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <p className="hero__eyebrow">Softver za vođenje stomatološke ordinacije</p>

        <h1 className="hero__title">
          Znaš šta je zakazano.
          <br />
          Šta je urađeno.
          <br />
          {/* Akcenat samo na novcu; nowrap da "naplaćeno." ne ostane sam u redu */}
          <span className="hero__title-accent">I šta je naplaćeno.</span>
        </h1>

        <p className="hero__sub">
          Izbegni nepotrebnu administraciju posle termina. Završi termin jednom, bez
          naknadnog prepisivanja.
        </p>

        {/* Jedna glavna akcija; demo je namerno slabiji tekstualni link, ne drugo dugme. */}
        <div className="hero__ctas">
          <Link href="/register" className="hero__btn hero__btn--primary">
            Započni besplatno
          </Link>
          <Link href="/demo" className="hero__link">
            Zakaži demo
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
        </div>

        {/* ── Panel: kontrolna tabla aplikacije u istom okviru (ivica, uglovi, senka),
            sa istim rezom dna i fade-om kao ranije ── */}
        <div className="hero__panel-wrap">
          <div className="hero__app">
            <HeroDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
