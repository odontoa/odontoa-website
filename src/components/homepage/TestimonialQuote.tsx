'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/shared/Reveal';

interface Quote {
  text: string;
  name: string;
  practice: string;
  /* null = nema fotografije, prikazuju se inicijali u accent tintu */
  photo: string | null;
  initials: string;
}

const QUOTES: Quote[] = [
  /* Odobren citat, tekst je njen (jedina izmena: „App-u“ -> „aplikaciju“). */
  {
    text: 'Na aplikaciju smo se, čini mi se, navikli svi u ordinaciji u jednom danu. Jednostavno je i brzo, a završava mnogo dodatnog posla sa papirima i štedi vreme. Često mi se desi da me pacijent pozove dok nisam u ordinaciji i mnogo znači što mogu odmah sa telefona da pogledam raspored i zakažem termin, umesto da negde zapisujem pa posle prepisujem.',
    name: 'Dr Bojana Radošević',
    practice: 'Stomatološka ordinacija Dental Centar BP',
    photo: '/images/testimonials/dr-bojana-radosevic.png',
    initials: 'BR',
  },
  /* Fotografija iz ordinacije. Ranija studijska (ljubičasta) verzija ostaje kao rezerva:
     /images/testimonials/dr-zeljko-sladoje.png */
  {
    text: 'Najviše mi znači to što su termini sada konzistentni. Pacijenti dobiju podsetnik i dođu na vreme, pa ja ne provodim dobar deo dana krpeći raspored. Mala stvar, ali meni je promenila kako izgleda radni dan.',
    name: 'Dr Željko Sladoje',
    practice: 'Specijalistička stomatološka ordinacija Orto-osmeh',
    photo: '/images/testimonials/dr-zeljko-sladoje-ordinacija.png',
    initials: 'ŽS',
  },
];

/* Minimalan horizontalni pomak (px) da se prevlačenje računa kao swipe */
const SWIPE_MIN = 40;

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

/*
  Iskustva pilot ordinacija: jedan citat vidljiv u jednom trenutku, bez automatskog
  smenjivanja (citati su dugi, ne smeju da pobegnu dok se čitaju). Svi citati su u DOM-u,
  naslagani u istu ćeliju grida, pa sekcija ima visinu najdužeg i ništa ispod se ne
  pomera pri promeni. Strelice su u redu sa eyebrow-om, na fiksnom mestu bez obzira na
  dužinu citata; na telefonu radi i prevlačenje levo/desno.
  Desktop: citat levo, fotografija + ime + ordinacija kao jedna celina desno.
  Mobilni: mala fotografija u redu sa imenom ispod citata.
*/
export default function TestimonialQuote() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = (step: number) => setActive((i) => (i + step + QUOTES.length) % QUOTES.length);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  /* Samo jasno horizontalno prevlačenje; vertikalni skrol stranice ostaje netaknut. */
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <section className="testimonial-quote" aria-roledescription="carousel" aria-label="Iskustva">
      <Reveal className="testimonial-quote__inner">
        <div className="testimonial-quote__body">
          <div className="testimonial-quote__head">
            <p className="testimonial-quote__eyebrow">
              <span className="testimonial-quote__dash" aria-hidden="true" />
              Iskustva
            </p>
            {QUOTES.length > 1 && (
              <div className="testimonial-quote__nav">
                <button
                  type="button"
                  className="testimonial-quote__nav-btn"
                  aria-label="Prethodno iskustvo"
                  onClick={() => go(-1)}
                >
                  <Chevron dir="prev" />
                </button>
                <button
                  type="button"
                  className="testimonial-quote__nav-btn"
                  aria-label="Sledeće iskustvo"
                  onClick={() => go(1)}
                >
                  <Chevron dir="next" />
                </button>
              </div>
            )}
          </div>

          <div
            className="testimonial-quote__slides"
            aria-live="polite"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {QUOTES.map((quote, i) => (
              <figure
                key={quote.name}
                className={`testimonial-quote__slide${i === active ? ' is-active' : ''}`}
                aria-hidden={i !== active}
                aria-roledescription="slide"
                aria-label={`${i + 1} od ${QUOTES.length}`}
              >
                <blockquote className="testimonial-quote__text">{`„${quote.text}“`}</blockquote>

                {/* Na desktopu vizuelno sakriveno (ime je ispod fotografije desno), ali ostaje
                    za čitač ekrana; na mobilnom je ovo jedini potpis. */}
                <figcaption className="testimonial-quote__attribution">
                  <span className="testimonial-quote__rule" aria-hidden="true" />
                  <div className="testimonial-quote__person">
                    {quote.photo ? (
                      <Image
                        src={quote.photo}
                        alt={quote.name}
                        width={56}
                        height={56}
                        className="testimonial-quote__photo testimonial-quote__photo--inline"
                      />
                    ) : (
                      <div className="testimonial-quote__avatar testimonial-quote__avatar--inline">
                        <span className="testimonial-quote__initials" aria-hidden="true">
                          {quote.initials}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="testimonial-quote__name">{quote.name}</p>
                      <p className="testimonial-quote__practice">{quote.practice}</p>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="testimonial-quote__media" aria-hidden="true">
          {QUOTES.map((quote, i) => (
            <div
              key={quote.name}
              className={`testimonial-quote__media-item${i === active ? ' is-active' : ''}`}
            >
              {quote.photo ? (
                <Image
                  src={quote.photo}
                  alt=""
                  width={240}
                  height={240}
                  className="testimonial-quote__photo testimonial-quote__photo--large"
                />
              ) : (
                <div className="testimonial-quote__avatar testimonial-quote__avatar--large">
                  <span className="testimonial-quote__initials">{quote.initials}</span>
                </div>
              )}
              <p className="testimonial-quote__name">{quote.name}</p>
              <p className="testimonial-quote__practice">{quote.practice}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
