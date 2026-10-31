'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { appFont } from './app-font';
import './hero-dashboard.css';

/*
  Hero vizual: kontrolna tabla Odontoa aplikacije sa uzanim sidebarom (samo ikonice modula).
  Crta se u dimenzijama ekrana aplikacije (1610x1200) i proporcionalno smanjuje na sirinu
  hero panela, pa izgleda kao screenshot, a ostaje ostar na svakom ekranu.
  Font je Urbanist, kao u aplikaciji. Podaci su izmisljeni demo podaci ordinacije za
  oktobar 2026 ("danas" je 28.10).
*/

const CANVAS_W = 1610;

/* Bruto i trosak tehnike po periodima od 2-3 dana; zbir 286.500 i 48.300, neto 238.200. */
const GROUPS: [string, number, number?][] = [
  ['01', 22300], ['03', 20200], ['06', 26800, 6200], ['08', 32600, 9800],
  ['10', 20300], ['13', 35600, 12000], ['15', 21100, 4500], ['19', 27300],
  ['21', 28500, 7300], ['23', 17800], ['26', 24500, 8500], ['28', 9500],
];
const CHART = { max: 40000, h: 236, w: 838 };
const SLOT = CHART.w / GROUPS.length;
const yOf = (v: number) => CHART.h - (v / CHART.max) * CHART.h;

const BARS = GROUPS.map(([, bruto, lab], i) => {
  const cx = (i + 0.5) * SLOT;
  const start = cx - (lab ? 28 + 3 + 11 : 28) / 2;
  return { left: start, h: (bruto / CHART.max) * CHART.h, lab: lab ? (lab / CHART.max) * CHART.h : 0, delay: 120 + i * 45 };
});
const NET = GROUPS.map(([, bruto, lab], i) => ({ x: (i + 0.5) * SLOT, y: yOf(bruto - (lab ?? 0)) }));
const NET_POINTS = NET.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
/* Duzina linije do svake tacke, za trenutak kada je linija stigne */
const NET_AT = NET.map((_, i) => NET.slice(1, i + 1).reduce((len, p, j) => len + Math.hypot(p.x - NET[j].x, p.y - NET[j].y), 0));
const NET_LEN = Math.ceil(NET_AT[NET_AT.length - 1]);
/* Isto kao .hd-net u hero-dashboard.css: pocetak 1050 ms, crtanje 950 ms, kvadratni ease-out.
   Tacka se pojavi kad linija prodje kroz nju (inverz ease-out krive po predjenoj duzini). */
const NET_DRAW = { delay: 1050, ms: 950 };
const netDotDelay = (i: number) => NET_DRAW.delay + Math.round(NET_DRAW.ms * (1 - Math.sqrt(1 - NET_AT[i] / NET_LEN)));
const X_LABELS = [0, 3, 6, 9, 11].map((i) => ({ left: (i + 0.5) * SLOT, label: `${GROUPS[i][0]}.10` }));

const APPOINTMENTS = [
  ['08:30', 'Nikola Petrović', 'Dr Marko Jovanović', 'Kontrola'],
  ['09:15', 'Jelena Ilić', 'Dr Ana Stanković', 'Kompozitna plomba'],
  ['10:30', 'Stefan Nikolić', 'Dr Marko Jovanović', 'Endodontski tretman'],
  ['12:00', 'Ana Marković', 'Dr Nikola Radić', 'Uklanjanje kamenca'],
];

const PAYMENTS = [
  ['milica-jovanovic', 'Milica Jovanović', '27.10.2026 · kartica', '8.500 RSD'],
  ['nikola-petrovic', 'Nikola Petrović', '26.10.2026 · gotovina', '12.000 RSD'],
  ['jelena-ilic', 'Jelena Ilić', '24.10.2026 · gotovina', '6.000 RSD'],
  ['stefan-nikolic', 'Stefan Nikolić', '22.10.2026 · kartica', '18.500 RSD'],
];

const DOCTOR_PHOTO = '/images/hero-dashboard/dr-marko-jovanovic.jpg';

/* Ikonice: lucide geometrija, inline da ceo vizual ostane jedan komad */
const I = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></>,
  calendarPlain: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  wallet: <><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></>,
  chart: <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />,
  flask: <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />,
  building: <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" /></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" /></>,
  book: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  copy: <><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  calendarPlus: <path d="M8 2v4M16 2v4M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8M3 10h18M16 19h6M19 16v6" />,
  userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
  alert: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
};

function Icon({ d, size = 19, stroke = 'currentColor', width = 1.8 }: { d: React.ReactNode; size?: number; stroke?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {d}
    </svg>
  );
}

/* Uzan sidebar, ikonice iz aplikacije: glavni moduli (Kontrolna tabla je aktivna), pa
   druga grupa: Izveštaji, Cenovnik, MKB-10, Šabloni */
const RAIL_MAIN = [I.grid, I.calendar, I.users, I.wallet, I.flask, I.building];
const RAIL_MORE = [I.chart, I.tag, I.book, I.copy];

function Avatar({ src, size, ring }: { src: string; size: number; ring?: boolean }) {
  return (
    <span className={ring ? 'hd-avatar hd-avatar--ring' : 'hd-avatar'} style={{ width: size, height: size }}>
      <Image src={src} alt="" fill sizes="96px" className="hd-avatar__img" />
    </span>
  );
}

export default function HeroDashboard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  /* armed: pocetno stanje animacije (stubci na nuli) postavljeno pre prvog crtanja;
     in: panel je u viewportu, animacija se odigra jednom. Bez JS-a i uz
     prefers-reduced-motion vizual je odmah u konacnom stanju. */
  const [motion, setMotion] = useState<'idle' | 'armed' | 'in'>('idle');

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const update = () => setScale(node.clientWidth / CANVAS_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotion('armed');
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (motion !== 'armed') return;
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setMotion('in');
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [motion]);

  const motionClass = motion === 'armed' ? ' is-armed' : motion === 'in' ? ' is-in' : '';

  return (
    <div
      ref={rootRef}
      className={`hd${motionClass}`}
      style={scale ? ({ '--hd-s': scale } as React.CSSProperties) : undefined}
      role="img"
      aria-label="Kontrolna tabla Odontoa aplikacije: 6 termina danas, promet 286.500 RSD ovog meseca, 34.000 RSD nenaplaćeno, raspored za danas, finansijski pregled i poslednje uplate."
    >
      <div className={`hd__canvas ${appFont.className}`} aria-hidden>
        <aside className="hd-rail">
          <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={32} height={32} className="hd-rail__mark" />
          {[RAIL_MAIN, RAIL_MORE].map((group, g) => (
            <nav key={g} className="hd-rail__nav">
              {group.map((icon, i) => (
                <span key={i} className={g === 0 && i === 0 ? 'hd-rail__item is-active' : 'hd-rail__item'}>
                  <Icon d={icon} size={21} />
                </span>
              ))}
            </nav>
          ))}
        </aside>

        <header className="hd-top">
          <h2 className="hd-top__title">Kontrolna tabla</h2>
          <Avatar src={DOCTOR_PHOTO} size={40} />
        </header>

        <main className="hd-main">
          <section className="hd-greet">
            <div className="hd-greet__who">
              <Avatar src={DOCTOR_PHOTO} size={56} ring />
              <div>
                <p className="hd-greet__title">Zdravo, Dr Marko! 👋</p>
                <p className="hd-greet__sub">Sledeći termin danas: <strong>13:30 - Milica Jovanović</strong></p>
              </div>
            </div>
            <div className="hd-greet__actions">
              <span className="hd-btn hd-btn--primary"><Icon d={I.calendarPlus} size={18} width={1.9} />Zakaži termin</span>
              <span className="hd-btn hd-btn--secondary"><Icon d={I.userPlus} size={18} />Dodaj pacijenta</span>
            </div>
          </section>

          <section className="hd-kpis">
            <div className="hd-kpi hd-anim-kpi" style={{ animationDelay: '80ms' }}>
              <span className="hd-kpi__icon"><Icon d={I.calendarPlain} size={23} /></span>
              <div><p className="hd-kpi__label">Termini danas</p><p className="hd-kpi__value">6</p></div>
            </div>
            <div className="hd-kpi hd-anim-kpi" style={{ animationDelay: '140ms' }}>
              <span className="hd-kpi__icon"><Icon d={I.wallet} size={23} /></span>
              <div><p className="hd-kpi__label">Promet ovaj mesec</p><p className="hd-kpi__value">286.500 <span>RSD</span></p></div>
            </div>
            <div className="hd-kpi hd-kpi--due hd-anim-kpi" style={{ animationDelay: '200ms' }}>
              <span className="hd-kpi__icon"><Icon d={I.alert} size={23} width={1.9} /></span>
              <div><p className="hd-kpi__label">Nenaplaćeno</p><p className="hd-kpi__value">34.000 <span>RSD</span></p></div>
            </div>
          </section>

          <section className="hd-card hd-schedule">
            <div className="hd-card__head">
              <h3>Raspored za danas</h3>
              <span className="hd-link">Prikaži sve <Icon d={I.chevronRight} size={14} width={2.2} /></span>
            </div>
            <div className="hd-table__row hd-table__row--head">
              <span>Vreme</span><span>Pacijent</span><span>Doktor</span><span>Usluga / intervencija</span><span>Status</span><span />
            </div>
            {APPOINTMENTS.map(([time, patient, doctor, service]) => (
              <div key={time} className="hd-table__row">
                <span className="hd-strong">{time}</span>
                <span className="hd-strong">{patient}</span>
                <span className="hd-muted">{doctor}</span>
                <span className="hd-muted">{service}</span>
                <span className="hd-status"><i />Potvrđeno</span>
                <span className="hd-chevron"><Icon d={I.chevronRight} size={16} width={2} /></span>
              </div>
            ))}
          </section>

          <section className="hd-row">
            <div className="hd-card hd-finance">
              <div className="hd-card__head">
                <h3>Finansijski pregled</h3>
                <span className="hd-select">Ovaj mesec <Icon d={I.chevronDown} size={13} stroke="#7c7c85" width={2.2} /></span>
              </div>
              <div className="hd-finance__summary">
                <div>
                  <p className="hd-finance__label">Ukupan promet</p>
                  <p className="hd-finance__total">286.500 <span>RSD</span></p>
                </div>
                <div className="hd-legend">
                  <div><p><i className="hd-legend__bruto" />Bruto</p><b>286.500 RSD</b></div>
                  <div><p><i className="hd-legend__lab" />Trošak tehnike</p><b>48.300 RSD</b></div>
                  <div><p><i className="hd-legend__net" />Neto</p><b>238.200 RSD</b></div>
                </div>
              </div>

              <div className="hd-chart">
                {[40000, 20000, 0].map((v) => (
                  <div key={v}>
                    <div className={v === 0 ? 'hd-chart__grid is-base' : 'hd-chart__grid'} style={{ top: yOf(v) }} />
                    <span className="hd-chart__y" style={{ top: yOf(v) - 8 }}>{v === 0 ? '0' : `${v / 1000}k`}</span>
                  </div>
                ))}
                {BARS.map((b, i) => (
                  <div key={GROUPS[i][0]}>
                    <div className="hd-bar hd-bar--bruto" style={{ left: b.left, height: b.h, animationDelay: `${b.delay}ms` }} />
                    {b.lab > 0 && (
                      <div className="hd-bar hd-bar--lab" style={{ left: b.left + 31, height: b.lab, animationDelay: `${b.delay}ms` }} />
                    )}
                  </div>
                ))}
                <svg className="hd-chart__net" width={CHART.w} height={CHART.h} viewBox={`0 0 ${CHART.w} ${CHART.h}`} aria-hidden>
                  <polyline className="hd-net" points={NET_POINTS} style={{ strokeDasharray: NET_LEN, '--hd-net-len': NET_LEN } as React.CSSProperties} />
                </svg>
                {NET.map((p, i) => (
                  <span
                    key={GROUPS[i][0]}
                    className="hd-net-dot"
                    style={{ left: p.x - 3.5, top: p.y - 3.5, animationDelay: `${netDotDelay(i)}ms` }}
                  />
                ))}
                {X_LABELS.map((x) => (
                  <span key={x.label} className="hd-chart__x" style={{ left: x.left }}>{x.label}</span>
                ))}
              </div>
            </div>

            <div className="hd-card hd-payments">
              <div className="hd-card__head">
                <h3>Poslednje uplate</h3>
                <span className="hd-link">Sve uplate <Icon d={I.chevronRight} size={14} width={2.2} /></span>
              </div>
              <div className="hd-payments__list">
                {PAYMENTS.map(([photo, name, meta, amount]) => (
                  <div key={name} className="hd-payment">
                    <Avatar src={`/images/hero-dashboard/${photo}.jpg`} size={44} />
                    <div className="hd-payment__who">
                      <p>{name}</p>
                      <span>{meta}</span>
                    </div>
                    <b>{amount}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <p className="hd-footer">Copyright © 2026 Odontoa</p>

        <span className="hd-chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
