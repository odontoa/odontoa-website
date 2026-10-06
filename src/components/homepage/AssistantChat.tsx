'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/*
  Animirana demonstracija asistenta. Sekvenca kreće jednom, kad panel uđe u viewport:
  pitanje (desno) -> tri tačkice (levo) -> odgovor (levo), tri para redom, svi ostaju vidljivi.
  Izgled prati panel asistenta sa stranice /funkcionalnosti/ai-asistent.

  Svi baloni su UVEK u DOM-u i otkrivaju se samo klasom `is-in`, a balon sa tačkicama je
  absolute u svom slotu. Zato panel ima punu visinu od prvog frejma i ništa ispod sekcije
  ne poskakuje tokom animacije.
*/

const ICON_SEND = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3.7 3.3 21 12 3.7 20.7 6.5 12z" />
    <path d="M6.5 12H13" />
  </svg>
);

const Mark = () => <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={16} height={16} />;

/* [levo, desno, desno je opis (ne iznos)] */
type Line = [string, string, 'note'?];

/*
  Sva tri para su iz ugla doktorke i pokrivaju tri domena: termini, rate, laboratorija.
  Isti jezik kao panel na stranici AI asistenta: ko pita, odgovor iz podataka ordinacije,
  prelaz na postojeci ekran. Imena i iznosi se slazu sa ostatkom pocetne
  (Marko Petrovic u kalendaru, DentalTeh u Finansijama).
*/
const SCRIPT: { q: string; intro: string; lines: Line[]; action: string }[] = [
  {
    q: 'Koliko termina imam sutra?',
    intro: 'Sutra imaš 6 termina. Prvi:',
    lines: [['09:00 · Sanja Ilić', 'kontrola', 'note']],
    action: 'Otvori kalendar',
  },
  {
    q: 'Ko nije isplatio sve rate za fiksni aparat?',
    intro: 'Jedan pacijent, Marko Petrović:',
    lines: [
      ['Ostale rate', '3 od 12', 'note'],
      ['Preostalo', '21.000 RSD'],
    ],
    action: 'Otvori karton',
  },
  {
    q: 'Koliko sam platio DentalTeh ovog meseca, a koliko dugujem?',
    intro: 'DentalTeh, jul:',
    lines: [
      ['Plaćeno', '39.800 RSD'],
      ['Ostalo dugovanje', '2.500 RSD'],
    ],
    action: 'Otvori tehniku',
  },
];

const TOTAL_STEPS = SCRIPT.length * 3;

/* Ritam u ms: [pitanje, tačkice, odgovor] po paru. Ukupno ~4,3s - dovoljno da se pročita
   kao razgovor, dovoljno kratko da se ne čeka između poruka. */
const DELAYS = [340, 300, 780, 380, 300, 780, 380, 300, 780];

export default function AssistantChat() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    /* Reduced motion: konačno stanje odmah, tačkice se nikad ne prikažu. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(TOTAL_STEPS);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const play = (next: number) => {
      if (next > TOTAL_STEPS) return;
      timer = setTimeout(() => {
        setStep(next);
        play(next + 1);
      }, DELAYS[next - 1]);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        play(1);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="assistant__panel" ref={panelRef}>
      <div className="assistant__panel-head">
        <span className="assistant__avatar">
          <Mark />
        </span>
        <span>
          <span className="assistant__panel-title">Odontoa asistent</span>
          <span className="assistant__panel-sub">odgovara iz podataka: Centar dentalne medicine Videnta</span>
        </span>
      </div>

      <div className="assistant__log">
        {SCRIPT.map((pair, i) => {
          const questionIn = step >= 3 * i + 1;
          const typingIn = step === 3 * i + 2;
          const answerIn = step >= 3 * i + 3;

          return (
            <div key={pair.q} className="assistant__pair">
              <div className={`assistant__msg assistant__msg--q${questionIn ? ' is-in' : ''}`}>
                <span className="assistant__who">
                  <i>JS</i>
                  dr Jelena Savić
                </span>
                <div className="assistant__bubble assistant__bubble--q">{pair.q}</div>
              </div>

              <div className="assistant__slot">
                <div className={`assistant__msg assistant__msg--a${answerIn ? ' is-in' : ''}`}>
                  <span className="assistant__who">
                    <Mark />
                    Odontoa asistent
                  </span>
                  <div className="assistant__bubble assistant__bubble--a">
                    {pair.intro}
                    {pair.lines.map(([l, r, note]) => (
                      <span key={l} className="assistant__line">
                        <span>{l}</span>
                        {note ? <span className="assistant__note">{r}</span> : <b>{r}</b>}
                      </span>
                    ))}
                    <span className="assistant__action">{pair.action}</span>
                  </div>
                </div>
                <div
                  className={`assistant__typing${typingIn ? ' is-in' : ''}`}
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dekorativna traka - nije <input>, pa nije fokusabilna niti obećava interakciju. */}
      <div className="assistant__prompt" aria-hidden="true">
        <span className="assistant__prompt-text">Pitaj o pacijentima, terminima ili naplati…</span>
        <span className="assistant__prompt-btn">{ICON_SEND}</span>
      </div>
    </div>
  );
}
