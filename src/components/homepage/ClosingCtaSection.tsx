import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';

/* Zavrsni CTA pocetne: tamna traka kao ClosingCta na stranicama funkcionalnosti
   (.fp-cta), ali centrirana: copy i jedino dugme na istoj osi, kao zavrsetak stranice.
   Bez trust liste: naslov i opis vec nose "30 dana besplatno" i "pacijente uvozimo mi",
   pa bi lista ponovila isto. */
export default function ClosingCtaSection() {
  return (
    <section className="closing-cta">
      <Reveal>
      <div className="closing-cta__inner">
        <div className="closing-cta__text">
          <p className="closing-cta__eyebrow">Počni danas</p>
          <h2 className="closing-cta__title">Probaj Odontou 30 dana besplatno.</h2>
          <p className="closing-cta__lead">Par minuta do naloga, pacijente uvozimo mi.</p>
        </div>

        {/* Zavrsni korak funnela: postojeci trial tok (/register). */}
        <div className="closing-cta__action">
          <Link href="/register" className="hero__btn hero__btn--primary closing-cta__btn">
            Započni besplatno
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
