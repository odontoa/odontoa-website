'use client';

import { useEffect, useRef, useState } from 'react';

/*
  Koraci "Kako radi" se pale sekvencijalno odozgo nadole, jednom, kad lista udje
  u viewport.

  Zasto zaseban klijentski fajl: marker i kicma su pseudo-elementi
  (.page-step::before / ::after), pa ih framer-motion ne moze dohvatiti i
  animacija mora da ide preko klase koju dodaje JS. Da je ovo bilo u blocks.tsx,
  'use client' bi povukao i benefits, prose i faq na klijent i pokvario namerno
  "bez klijentskog JS-a" FAQ na nativnom <details>.

  Podela odgovornosti: ovaj fajl drzi kadenciju IZMEDJU koraka, a CSS drzi pomak
  UNUTAR koraka (kicma krece 90ms posle svog markera, preko transition-delay).
  Zato ovde ne treba poseban tajmer za kicmu.

  Isti obrazac kao AssistantSection -> AssistantChat na pocetnoj:
  IntersectionObserver, disconnect na prvom preseku (once), klasa `is-in`.
*/

/* U opsegu 150-200ms: dovoljno da se kaskada procita kao tok, dovoljno kratko
   da se ne ceka. Tri koraka se zavrse za ~620ms (360ms zadnji start + 260ms pop). */
const STEP_STAGGER_MS = 180;

export default function StepsFlow({ items }: { items: string[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  /* Broj koraka koji su do sada upaljeni. Koraci ispod ovoga su neaktivni. */
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    /* Reduced motion: finalno stanje odmah, kaskada se nikad ne pokrene.
       CSS ima i svoj sloj u @media (prefers-reduced-motion: reduce). */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(items.length);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        for (let i = 0; i < items.length; i += 1) {
          timers.push(setTimeout(() => setShown(i + 1), i * STEP_STAGGER_MS));
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
    /* Duzina, ne sam niz: nova referenca sa istim sadrzajem ne sme da restartuje
       kaskadu. Sadrzaj je statican po stranici. */
  }, [items.length]);

  return (
    <ol className="page-steps" ref={listRef}>
      {items.map((step, i) => (
        <li key={step} className={`page-step${i < shown ? ' is-in' : ''}`}>
          <span className="page-step__text">{step}</span>
        </li>
      ))}
    </ol>
  );
}
