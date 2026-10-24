import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import DemoPhone from './DemoPhone';

export default function DemoCtaSection() {
  return (
    <section className="demo-cta">
      <div className="demo-cta__inner">
        {/* Product stage: tonalna ploca kao u Finansijama, telefon na osi ploce i odsecen
            donjom ivicom (isti "nastavlja se" rez kao hero). SMS obavestenje je u telefonu. */}
        <Reveal delay={0.12} className="demo-cta__visual-wrap">
          <div className="demo-cta__stage">
            <div className="demo-cta__scene">
              <DemoPhone />
            </div>
          </div>
        </Reveal>

        <div className="demo-cta__text">
          <Reveal>
            <p className="demo-cta__eyebrow">Pogledaj uživo</p>
            <h2 className="section-title">Prođi kroz Odontou sa nama za 15 minuta.</h2>
            <p className="demo-cta__lead">
              Na pozivu ti pokažemo zakazivanje, karton i finansije na primeru tvoje ordinacije.
            </p>

            <div className="demo-cta__actions">
              {/* Srednji korak funnela: proizvod uzivo (postojeci /demo), trial je u zavrsnom CTA */}
              <Link href="/demo" className="btn-cta">
                Zakaži demo
              </Link>
              <span className="demo-cta__note">Bez obaveze i bez pripreme.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
