import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import { SYSTEM_GRID_PAGES } from '@/lib/content/funkcionalnosti';

/* Redovi se izvode iz istog izvora kao stranice funkcionalnosti, pa naslov kartice
   i H1 stranice ne mogu da se raziju. SYSTEM_GRID_PAGES je vec bez AI asistenta:
   on ima svoju stranicu, ali se ne pojavljuje u ovom gridu. */

/* Modul oznacen u listi i u railu (zakazivanje). Desno nije jedan ekran nego povezan
   sistem: karton pacijenta ispred, pravi nedeljni kalendar iza njega. Redovi liste su
   linkovi ka stranicama modula. */
const SHOWN_MODULE = '/01';

const TREATMENTS = [
  { day: '9', month: 'jul', title: 'Hirurško vađenje zuba', meta: 'Dr Marko Marković · Stolica 1', status: 'done', statusLabel: 'Završeno', linked: false },
  /* Isti termin kao istaknuti slot u kalendaru iza (cetvrtak 16. jul, 11:00). */
  { day: '16', month: 'jul', title: 'Kontrola posle vađenja', meta: 'Čet, 16. jul · 11:00 · Stolica 1', status: 'plan', statusLabel: 'Zakazano', linked: true },
] as const;

/* Kalendar u pozadini: nedelja 13–16. jul, cetvrtak je dan iz kartona. Svi prikazani
   termini su zavrseni; jedini zakazan je Markov, koji se crta posebno, ostar. */
const CAL_DAYS = [
  { name: 'Ponedeljak', date: '13.07', focus: false },
  { name: 'Utorak', date: '14.07', focus: false },
  { name: 'Sreda', date: '15.07', focus: false },
  { name: 'Četvrtak', date: '16.07', focus: true },
] as const;

const CAL_HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00'];

/* day = indeks u CAL_DAYS; start/end u satima. Grid ima red po 15 min od 09:00. */
const CAL_EVENTS = [
  { day: 0, start: 9, end: 9.75, name: 'Ana Tasić', what: 'Kontrola' },
  { day: 1, start: 10, end: 11, name: 'Ivan Radić', what: 'Punjenje kanala' },
  /* Rano u danu: posle 11h su prve tri kolone ispod kartona, pa termin tu ne bi bio ceo */
  { day: 2, start: 9.5, end: 10.25, name: 'Jovana Janković', what: 'Plomba' },
  { day: 3, start: 9, end: 9.75, name: 'Jelena Nikolić', what: 'Intervencija' },
  { day: 3, start: 10, end: 10.75, name: 'Aleksandra Božić', what: 'Punjenje 2 kanala' },
] as const;

const MARKO = { day: 3, start: 11, end: 11.5 };

/* Prvi red grida je zaglavlje dana, pa red za vreme t pocinje na (t - 9) * 4 + 2. */
const calRow = (start: number, end: number) => `${(start - 9) * 4 + 2} / ${(end - 9) * 4 + 2}`;
const calCol = (day: number) => day + 2;

/* Ikonice raila, istim redom kao lista /01-/06. */
const RAIL_ICONS: Record<string, ReactNode> = {
  '/01': (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M16 2.5v4M8 2.5v4M3 10h18" />
    </>
  ),
  '/02': (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  '/03': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </>
  ),
  '/04': (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  '/05': (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 17c1-1.5 2-1.5 3 0s2 1.5 3 0" />
    </>
  ),
  '/06': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M14 8H8M16 12H8M13 16H8" />
    </>
  ),
};

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function SystemOverviewSection() {
  return (
    <section
      id="funkcionalnosti"
      className="system-overview"
      style={{ background: 'var(--stellar-bg-light)', padding: 'var(--section-pad) 24px', overflow: 'hidden' }}
    >
      <div
        className="system-overview__inner"
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
        }}
      >
        {/* ── Left text column (488px) ── */}
        <div className="system-overview__text" style={{ flex: '0 0 488px' }}>
          <Reveal>
          {/* Heading */}
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            Jedan sistem za{' '}
            <span style={{ color: 'var(--stellar-accent)' }}>celu</span>{' '}
            ordinaciju
          </h2>

          {/* Podnaslov */}
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.62,
              letterSpacing: '-0.011em',
              color: 'var(--stellar-body)',
              margin: 0,
              marginBottom: 30,
            }}
          >
            Tretman, trošak tehnike i uplata ostaju povezani sa terminom. Kalendar, karton, RTG i dokumentacija su u jednom sistemu, bez prebacivanja između alata.
          </p>

          {/* Lista modula: svaki red je link ka stranici funkcionalnosti */}
          <div className="system-overview__list">
            {SYSTEM_GRID_PAGES.map((row) => (
              <Link
                key={row.slug}
                href={`/funkcionalnosti/${row.slug}`}
                className={
                  row.gridNum === SHOWN_MODULE
                    ? 'system-overview__row system-overview__row--shown'
                    : 'system-overview__row'
                }
              >
                <span className="system-overview__row-num">{row.gridNum}</span>
                <span>
                  <span className="system-overview__row-title">{row.navTitle}</span>
                  <span className="system-overview__row-desc">{row.shortDesc}</span>
                </span>
                <span className="system-overview__row-arrow">{ARROW}</span>
              </Link>
            ))}
          </div>

          {/* CTA: sekundarna akcija kao tekstualni link, isti obrazac kao hero i asistent */}
          <Link href="/funkcionalnosti" className="system-overview__cta">
            Pogledaj sve funkcionalnosti
            {ARROW}
          </Link>
          </Reveal>
        </div>

        {/* ── Right illustration column ── */}
        {/*
          Relativne pozicije u kontejneru 584x488:
          - Kalendar (pozadina):               top=0,   left=80, 504 x 356
          - Prozor aplikacije (rail + karton): top=188, left=0,  width 430
          Cetvrtak je poslednja kolona kalendara, desno od prozora, pa Markov termin
          (11:00) ostaje vidljiv iznad i desno od kartona.
        */}
        <Reveal delay={0.12} style={{ flex: 1, minWidth: 0, width: '100%' }}>
        <div className="system-overview__illustrations">
          {/* Kalendar iza: zamucen sloj + ostar sloj istog grida, u kom je samo Markov
              termin, pa se poklapaju u piksel. */}
          <div className="system-overview__cal" aria-hidden="true">
            <div className="system-overview__cal-grid system-overview__cal-grid--muted">
              {CAL_DAYS.map((d, i) => (
                <span
                  key={`col-${d.date}`}
                  className={`system-overview__cal-col${d.focus ? ' is-focus' : ' system-overview__cal-other'}`}
                  style={{ gridColumn: calCol(i) }}
                />
              ))}
              <span className="system-overview__cal-lines" />
              {CAL_DAYS.map((d, i) => (
                <span
                  key={`head-${d.date}`}
                  className={`system-overview__cal-day${d.focus ? ' is-focus' : ' system-overview__cal-other'}`}
                  style={{ gridColumn: calCol(i) }}
                >
                  <b>{d.name}</b> {d.date}
                </span>
              ))}
              {CAL_HOURS.map((h, i) => (
                <span key={h} className="system-overview__cal-time" style={{ gridRow: i * 4 + 2 }}>
                  {h}
                </span>
              ))}
              {CAL_EVENTS.map((e) => (
                <span
                  key={e.name}
                  className={`system-overview__cal-event${CAL_DAYS[e.day].focus ? '' : ' system-overview__cal-other'}`}
                  style={{ gridColumn: calCol(e.day), gridRow: calRow(e.start, e.end) }}
                >
                  <b>{e.name}</b>
                  {e.what}
                </span>
              ))}
            </div>
            <div className="system-overview__cal-grid system-overview__cal-grid--focus">
              <span
                className="system-overview__cal-marko"
                style={{ gridColumn: calCol(MARKO.day), gridRow: calRow(MARKO.start, MARKO.end) }}
              >
                <b>Marko Petrović</b>
                <span>11:00 · Kontrola</span>
              </span>
            </div>
          </div>

          {/* Prozor aplikacije: rail sa svih sest modula + karton pacijenta */}
          <div className="system-card system-overview__window">
            <div className="system-overview__rail" aria-hidden>
              <span className="system-overview__rail-logo">
                <Image
                  src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
                  alt=""
                  width={34}
                  height={34}
                />
              </span>
              {SYSTEM_GRID_PAGES.map((row) =>
                row.gridNum && RAIL_ICONS[row.gridNum] ? (
                  <span
                    key={row.slug}
                    className={
                      row.gridNum === SHOWN_MODULE
                        ? 'system-overview__rail-icon system-overview__rail-icon--active'
                        : 'system-overview__rail-icon'
                    }
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {RAIL_ICONS[row.gridNum]}
                    </svg>
                  </span>
                ) : null,
              )}
            </div>

            <div className="system-overview__window-main">
              <div className="system-card__head">
                <div className="system-card__avatar">
                  <Image
                    src="/images/image-card-patient-cutout.png"
                    alt=""
                    width={553}
                    height={470}
                    sizes="44px"
                  />
                </div>
                <div className="system-card__name">
                  <b>Marko Petrović</b>
                  <span>Karton pacijenta · ID P022</span>
                </div>
              </div>
              <div className="system-card__list">
                <h5>Istorija tretmana</h5>
                {TREATMENTS.map((t) => (
                  <div
                    key={`${t.day}-${t.title}`}
                    className={t.linked ? 'system-card__item system-card__item--linked' : 'system-card__item'}
                  >
                    <div className="system-card__item-date">
                      {t.day}
                      <small>{t.month}</small>
                    </div>
                    <div className="system-card__item-what">
                      <b>{t.title}</b>
                      <span>{t.meta}</span>
                    </div>
                    <span className={`system-card__status system-card__status--${t.status}`}>
                      {t.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
