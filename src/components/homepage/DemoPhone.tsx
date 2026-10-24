'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/*
  Telefon u sekciji "Pogledaj uživo": ravan i uspravan, nacrtan u HTML-u kao hero mockup,
  umesto ranijeg nagnutog 3D PNG-a. Ekran je početna tabla mobilne aplikacije (isti
  raspored kao black-phone-odontoa-mockup-1000.png), sa podacima usklađenim tako da se
  ne kose: sat je 10:20, 4 termina danas, prvi (10:00) je završen, još 3 su pred nama,
  2 od njih čekaju potvrdu. Sledeći je Nikola Tomić u 11:15, isti termin kao u heroju
  početne (uklanjanje kamenca).
  Dekorativan je kao celina (role="img" + opis), pa čitač ekrana ne čita svaku ćeliju.

  SMS obaveštenje izlazi iz telefona: ostrvo na vrhu ekrana se jednom, kad telefon uđe u
  viewport, raširi u crnu pilulu sa porukom (kao live activity). Ostaje unutar ekrana, pa
  telefon stoji sam na osi ploče i ništa ga ne gura u stranu. Uz reduced motion pilula je
  odmah raširena, bez animacije.
*/

const ICON_CAL = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ICON_STETH = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const ICON_CLOCK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const ICON_CHAT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ICON_CHECK = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const SCHEDULE = [
  { time: '10:00', name: 'Vladimir Perić', what: 'Kontrola', done: true },
  /* "Uklanjanje kamenca" u heroju; kratko jer red telefona nema mesta za ceo naziv */
  { time: '11:15', name: 'Nikola Tomić', what: 'Kamenac', done: false },
  { time: '12:00', name: 'Jelena Petrović', what: 'Konsultacija', done: false },
  { time: '12:45', name: 'Sanja Ilić', what: 'Kontrola', done: false },
];

/* Pauza posle ulaska u viewport: ploča prvo završi svoj Reveal, pa se ostrvo raširi. */
const OPEN_DELAY = 700;

export default function DemoPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => setOpen(true), OPEN_DELAY);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`demo-phone${open ? ' is-open' : ''}`}
      role="img"
      aria-label="Odontoa na telefonu: početna tabla sa rasporedom za danas i obaveštenjem da je SMS podsetnik poslat"
    >
      <div className="demo-phone__screen">
        <span className="demo-phone__island">
          <span className="demo-phone__notice">
            <span className="demo-phone__app">
              <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={16} height={16} />
            </span>
            <span className="demo-phone__notice-text">
              <b>SMS podsetnik poslat</b>
              <small>Nikola Tomić · danas 11:15</small>
            </span>
            <span className="demo-phone__sent">{ICON_CHECK}</span>
          </span>
        </span>
        <span className="demo-phone__status">
          <span>10:20</span>
          <span>5G</span>
        </span>

        <div className="demo-phone__greet">
          <b>Zdravo, dr Marko!</b>
          <span>Danas imaš još 3 termina.</span>
          <span className="demo-phone__btns">
            <i>Zakaži termin</i>
            <i>Dodaj pacijenta</i>
          </span>
        </div>

        <div className="demo-phone__stats">
          <div className="demo-phone__stat">
            <span className="demo-phone__ic demo-phone__ic--dark">{ICON_CAL}</span>
            <span>
              <small>Moji termini danas</small>
              <b>4</b>
            </span>
          </div>
          <div className="demo-phone__stat">
            <span className="demo-phone__ic">{ICON_STETH}</span>
            <span>
              <small>Sledeći termin</small>
              <b>11:15 · Nikola Tomić</b>
            </span>
          </div>
          <div className="demo-phone__stat">
            <span className="demo-phone__ic">{ICON_CLOCK}</span>
            <span>
              <small>Termini na čekanju potvrde</small>
              <b>2</b>
            </span>
          </div>
        </div>

        <div className="demo-phone__sched">
          <div className="demo-phone__sched-head">
            <b>Raspored za danas</b>
            <span>Prikaži sve</span>
          </div>
          {SCHEDULE.map((row) => (
            <div key={row.time} className={`demo-phone__row${row.done ? ' is-done' : ''}`}>
              <span>{row.time}</span>
              <span>{row.name}</span>
              <em>{row.what}</em>
            </div>
          ))}
        </div>

        <span className="demo-phone__fab">{ICON_CHAT}</span>
      </div>
    </div>
  );
}
