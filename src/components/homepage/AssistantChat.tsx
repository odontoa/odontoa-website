'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/*
  Demonstracija asistenta: jedan razgovor + predlozi pitanja. Kad panel uđe u viewport,
  podrazumevano pitanje (termini sutra) se odigra: pitanje (desno) -> tri tačkice -> odgovor.
  Klik na predlog odigra to pitanje umesto aktivnog; aktivno pitanje izlazi iz predloga.
  Izgled prati panel asistenta sa stranice /funkcionalnosti/ai-asistent.

  Svi parovi su UVEK u DOM-u, naslagani u istu ćeliju grida, a vidljiv je samo aktivni.
  Ćelija zato ima visinu najdužeg para od prvog frejma, pa se ništa ispod sekcije ne
  pomera ni tokom animacije ni kad se promeni pitanje. Svaki odgovor ima tačno dva
  podatka, pa su parovi iste visine; poravnati su gore, a eventualni višak (pitanje u
  dva reda na telefonu) ostaje ispod odgovora.
*/

const ICON_SEND = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3.7 3.3 21 12 3.7 20.7 6.5 12z" />
    <path d="M6.5 12H13" />
  </svg>
);

/* Strelica "pošalji ovo pitanje" na predlogu */
const ICON_ASK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 7v6a3 3 0 0 0 3 3h9" />
    <path d="m15 12 4 4-4 4" />
  </svg>
);

const Mark = () => <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={16} height={16} />;

/* [oznaka, vrednost] */
type Fact = [string, string];

/*
  Sva tri para su iz ugla doktorke i pokrivaju tri domena: termini, laboratorija, rate.
  Redosled je i redosled predloga ispod razgovora. Imena i iznosi se slazu sa ostatkom
  pocetne (Marko Petrovic u kalendaru, DentalTeh u Finansijama). Pitanja su dovoljno
  kratka da na desktopu stanu u jedan red balona.
*/
const SCRIPT: { q: string; intro: string; facts: [Fact, Fact]; action: string }[] = [
  {
    q: 'Koliko termina imam sutra?',
    intro: 'Sutra imaš 6 termina.',
    facts: [
      ['Prvi termin', '09:00 · Sanja Ilić'],
      ['Tretman', 'Kontrola'],
    ],
    action: 'Otvori kalendar',
  },
  {
    q: 'Koliko dugujem DentalTehu ovog meseca?',
    intro: 'DentalTeh, jul:',
    facts: [
      ['Plaćeno', '39.800 RSD'],
      ['Dugovanje', '2.500 RSD'],
    ],
    action: 'Otvori tehniku',
  },
  {
    q: 'Ko nije isplatio sve rate za fiksni aparat?',
    intro: 'Jedan pacijent, Marko Petrović:',
    facts: [
      ['Neplaćene rate', '3 od 12'],
      ['Preostalo', '21.000 RSD'],
    ],
    action: 'Otvori karton',
  },
];

/* Faze aktivnog para: 0 ništa, 1 pitanje, 2 tačkice, 3 odgovor */
const DONE = 3;

/* Ritam u ms do [pitanja, tačkica, odgovora]. Prvi prolaz čeka da se sekcija smiri,
   klik na predlog kreće odmah. */
const FIRST_RUN = [340, 640, 1420];
const ON_ASK = [60, 360, 1140];

export default function AssistantChat() {
  const panelRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = useRef(false);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(0);

  const play = (index: number, delays: number[]) => {
    /* Isti niz se prazni na mestu, da ga cleanup efekta uvek vidi. */
    timers.current.forEach(clearTimeout);
    timers.current.length = 0;
    setActive(index);

    /* Reduced motion: odgovor odmah, tačkice se nikad ne prikažu. */
    if (reducedMotion.current) {
      setPhase(DONE);
      return;
    }

    setPhase(0);
    delays.forEach((ms, i) => {
      timers.current.push(setTimeout(() => setPhase(i + 1), ms));
    });
  };

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        play(0, FIRST_RUN);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    const pending = timers.current;
    return () => {
      observer.disconnect();
      pending.forEach(clearTimeout);
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
          <span className="assistant__panel-sub">Odgovara iz podataka ordinacije</span>
        </span>
      </div>

      <div className="assistant__log" aria-live="polite">
        {SCRIPT.map((pair, i) => {
          const isActive = i === active;
          const questionIn = isActive && phase >= 1;
          const typingIn = isActive && phase === 2;
          const answerIn = isActive && phase >= DONE;

          return (
            <div key={pair.q} className={`assistant__pair${isActive ? ' is-active' : ''}`}>
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
                    <span className="assistant__facts">
                      {pair.facts.map(([label, value]) => (
                        <span key={label} className="assistant__fact">
                          <small>{label}</small>
                          <b>{value}</b>
                        </span>
                      ))}
                    </span>
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

      {/* Predlozi su pravi <button>-i: klik odigra to pitanje u panelu iznad. Za svako
          aktivno pitanje postoji jedan set predloga, svi u istoj ćeliji grida (kao parovi),
          pa kraći set ne skraćuje panel. Skriveni setovi (visibility) nisu u tab redosledu. */}
      <div className="assistant__suggest">
        {SCRIPT.map((_, set) => (
          <div key={set} className={`assistant__chips${set === active ? ' is-active' : ''}`}>
            {SCRIPT.map((pair, i) =>
              i === set ? null : (
                <button
                  key={pair.q}
                  type="button"
                  className="assistant__chip"
                  onClick={() => play(i, ON_ASK)}
                >
                  {ICON_ASK}
                  <span>{pair.q}</span>
                </button>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Dekorativna traka - nije <input>, pa nije fokusabilna niti obećava interakciju. */}
      <div className="assistant__prompt" aria-hidden="true">
        <span className="assistant__prompt-text">Pitaj o pacijentima, terminima ili naplati…</span>
        <span className="assistant__prompt-btn">{ICON_SEND}</span>
      </div>
    </div>
  );
}
