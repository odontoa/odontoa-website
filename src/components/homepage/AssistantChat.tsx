'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/*
  Demonstracija asistenta: jedan razgovor. Kad panel uđe u viewport, odigra se jednom:
  pitanje -> tri tačkice -> odgovor. Odgovor je običan tekst pored Odontoa znaka, sa
  jednom akcijom, bez kartica podataka i predloga pitanja.

  Odgovor je u DOM-u od prvog frejma (nevidljiv), pa panel ima konačnu visinu i ništa
  ispod sekcije se ne pomera tokom animacije.
*/

const ICON_SEND = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3.7 3.3 21 12 3.7 20.7 6.5 12z" />
    <path d="M6.5 12H13" />
  </svg>
);

const ICON_ARROW = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MARK_SRC = '/images/Odontoa-New-logo-pack-2026/favicon_color.png';

/* Faze: 0 ništa, 1 pitanje, 2 tačkice, 3 odgovor */
const DONE = 3;

/* Ritam u ms do [pitanja, tačkica, odgovora]; prvi korak čeka da se sekcija smiri. */
const RUN = [340, 640, 1420];

export default function AssistantChat() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        /* Reduced motion: odgovor odmah, tačkice se nikad ne prikažu. */
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setPhase(DONE);
          return;
        }
        RUN.forEach((ms, i) => timers.push(setTimeout(() => setPhase(i + 1), ms)));
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="assistant__panel" ref={panelRef}>
      <div className="assistant__panel-head">
        <Image src={MARK_SRC} alt="" width={18} height={18} />
        <span className="assistant__panel-title">Odontoa asistent</span>
      </div>

      <div className="assistant__log" aria-live="polite">
        <div className={`assistant__q${phase >= 1 ? ' is-in' : ''}`}>Koliko termina imam sutra?</div>

        <div className="assistant__slot">
          <div className={`assistant__a${phase >= DONE ? ' is-in' : ''}`}>
            <Image src={MARK_SRC} alt="" width={20} height={20} className="assistant__mark" />
            <div>
              <p className="assistant__a-text">
                Sutra imaš 6 termina. Prvi je u 09:00 - Sanja Ilić, kontrola.
              </p>
              <span className="assistant__action">
                Otvori kalendar
                {ICON_ARROW}
              </span>
            </div>
          </div>
          <div className={`assistant__typing${phase === 2 ? ' is-in' : ''}`} aria-hidden="true">
            <Image src={MARK_SRC} alt="" width={20} height={20} />
            <span className="assistant__dots">
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
      </div>

      {/* Dekorativna traka - nije <input>, pa nije fokusabilna niti obećava interakciju. */}
      <div className="assistant__prompt" aria-hidden="true">
        <span className="assistant__prompt-text">Pitaj o pacijentima, terminima ili naplati…</span>
        <span className="assistant__prompt-btn">{ICON_SEND}</span>
      </div>
    </div>
  );
}
