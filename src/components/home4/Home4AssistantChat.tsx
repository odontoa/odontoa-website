'use client';

import { useEffect, useRef, useState } from 'react';

/*
  Animirana demonstracija asistenta. Sekvenca kreće jednom, kad panel uđe u viewport:
  pitanje (desno) -> tri tačkice (levo) -> odgovor (levo), tri para redom, svi ostaju vidljivi.

  Svi baloni su UVEK u DOM-u i otkrivaju se samo klasom `is-in`, a balon sa tačkicama je
  absolute u svom slotu. Zato panel ima punu visinu od prvog frejma i ništa ispod sekcije
  ne poskakuje tokom animacije.
*/

const ICON_SPARK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M18.4 15.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" />
  </svg>
);

const ICON_ARROW = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

/* Sva tri para su iz ugla vlasnika ordinacije i pokrivaju tri domena: termini, rate, dobavljači. */
const SCRIPT = [
  {
    q: 'Koliko termina imam sutra?',
    a: 'Sutra imaš 6 termina, prvi u 09:00, Aleksandra Božić, kontrola.',
  },
  {
    q: 'Ko nije isplatio sve rate za fiksni aparat?',
    a: 'Marko Petrović, ostale 3 od 12 rata, 21.000 RSD.',
  },
  {
    q: 'Koliko sam platio DentalTeh ovog meseca, a koliko dugujem?',
    a: 'Plaćeno 39.800 RSD, ostalo dugovanje 2.500 RSD.',
  },
];

const TOTAL_STEPS = SCRIPT.length * 3;

/* Ritam u ms: [pitanje, tačkice, odgovor] po paru. Ukupno ~4,3s - dovoljno da se pročita
   kao razgovor, dovoljno kratko da se ne čeka između poruka. */
const DELAYS = [340, 300, 780, 380, 300, 780, 380, 300, 780];

export default function Home4AssistantChat() {
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
    <div className="home4-assistant__panel" ref={panelRef}>
      <div className="home4-assistant__panel-head">
        <span className="home4-assistant__avatar">{ICON_SPARK}</span>
        <span className="home4-assistant__panel-title">Odontoa asistent</span>
      </div>

      <div className="home4-assistant__log">
        {SCRIPT.map((pair, i) => {
          const questionIn = step >= 3 * i + 1;
          const typingIn = step === 3 * i + 2;
          const answerIn = step >= 3 * i + 3;

          return (
            <div key={pair.q} className="home4-assistant__pair">
              <div className="home4-assistant__row">
                <div
                  className={`home4-assistant__bubble home4-assistant__bubble--q${questionIn ? ' is-in' : ''}`}
                >
                  {pair.q}
                </div>
              </div>

              <div className="home4-assistant__slot">
                <div
                  className={`home4-assistant__bubble home4-assistant__bubble--a${answerIn ? ' is-in' : ''}`}
                >
                  {pair.a}
                </div>
                <div
                  className={`home4-assistant__typing${typingIn ? ' is-in' : ''}`}
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
      <div className="home4-assistant__prompt" aria-hidden="true">
        <span className="home4-assistant__prompt-text">Pitaj asistenta…</span>
        <span className="home4-assistant__prompt-btn">{ICON_ARROW}</span>
      </div>
    </div>
  );
}
