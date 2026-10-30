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
            <h2 className="section-title section-title--split">
              <span className="section-title__line">Prođi kroz Odontou sa nama.</span>{' '}
              <span className="section-title__line section-title__line--muted">
                Za 15 minuta, na&nbsp;primeru tvoje ordinacije.
              </span>
            </h2>
            {/* Trajanje i "tvoja ordinacija" su u drugom redu naslova, lead ih ne ponavlja */}
            <p className="demo-cta__lead">
              Pokazaćemo ti kako Odontoa radi u praksi: zakazivanje, kartoni, finansije i još
              mnogo toga.
            </p>

            <div className="demo-cta__actions">
              {/* Srednji korak funnela: proizvod uzivo (postojeci /demo), trial je u zavrsnom CTA */}
              <Link href="/demo" className="btn-cta">
                Zakaži demo
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
