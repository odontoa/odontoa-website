import Image from 'next/image';

const FEATURE_ROWS = [
  { num: '/01', title: 'Zakazivač termina', desc: 'Kalendar po doktorima i stolicama, drag-and-drop izmene.' },
  { num: '/02', title: 'Karton pacijenta', desc: 'Anamneza, terapije i istorija poseta - uvek dostupne.' },
  { num: '/03', title: 'Dokumentacija i saglasnosti', desc: 'Šabloni, digitalni potpis, e-arhiva.' },
  { num: '/04', title: 'RTG i fotografije', desc: 'Slike u kartonu, bez traženja po folderima.' },
  { num: '/05', title: 'Finansije i podsetnici', desc: 'Predračuni, uplate, automatski SMS podsetnici.' },
] as const;

const TREATMENTS = [
  { day: '17', month: 'jul', title: 'Definitivno punjenje kanala', meta: 'Dr Marko Marković · Stolica 1', status: 'done', statusLabel: 'Završeno' },
  { day: '16', month: 'jul', title: 'Hirurško vađenje zuba', meta: 'Dr Marko Marković · Stolica 1', status: 'done', statusLabel: 'Završeno' },
  { day: '21', month: 'jul', title: 'Kontrolni pregled', meta: 'Dr Marko Marković · Stolica 1', status: 'plan', statusLabel: 'Zakazano' },
] as const;

const CALENDAR_SLOTS = [
  { time: '09:00', name: 'Vladimir Perić', meta: 'Intervencija · Završeno', done: true },
  { time: '10:00', name: 'Aleksandra Božić', meta: 'Punjenje 2 kanala · Završeno', done: true },
  { time: '11:00', name: 'Vladimir Perić', meta: 'Pregled · Zakazano', done: false },
] as const;

export default function Home4FeatureLeft() {
  return (
    <section
      id="funkcionalnosti"
      className="home4-feature-left"
      style={{ background: '#ffffff', padding: '96px 24px', overflow: 'hidden' }}
    >
      <div
        className="home4-feature-left__inner"
        style={{
          maxWidth: 1216,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 104,
        }}
      >
        {/* ── Left text column (488px) ── */}
        <div className="home4-feature-left__text" style={{ flex: '0 0 488px' }}>
          {/* Heading */}
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 43.125,
              fontWeight: 700,
              lineHeight: '57.6px',
              letterSpacing: '-1.25px',
              color: '#060b13',
              margin: 0,
              marginBottom: 24,
            }}
          >
            Jedan sistem za{' '}
            <span style={{ color: 'var(--stellar-accent)' }}>celu</span>{' '}
            ordinaciju
          </h2>

          {/* Podnaslov */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              fontWeight: 400,
              lineHeight: '32px',
              letterSpacing: '-0.18px',
              color: '#363d4f',
              margin: 0,
              marginBottom: 32,
            }}
          >
            Digitalni kartoni, zakazivanje i dokumentacija - sve što ordinacija koristi svakodnevno, u jednom sistemu, bez prebacivanja između alata.
          </p>

          {/* Divider lista */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 36 }}>
            {FEATURE_ROWS.map((row) => (
              <div
                key={row.num}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr 20px',
                  alignItems: 'center',
                  gap: '0 18px',
                  padding: '20px 0',
                  borderBottom: '1px solid var(--stellar-border)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--stellar-accent)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {row.num}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#060b13',
                      letterSpacing: '-0.015em',
                      lineHeight: '1.3',
                    }}
                  >
                    {row.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#363d4f',
                      marginTop: 3,
                      lineHeight: '1.5',
                    }}
                  >
                    {row.desc}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#060b13" strokeWidth="1.6" style={{ opacity: 0.35, flexShrink: 0 }}>
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 24px',
              borderRadius: 999,
              background: '#060b13',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Pogledaj funkcionalnosti
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* ── Right illustration column ── */}
        {/*
          Relative positions within 552×508 container (circle at top=32, left=32):
          - Patient card (Karton pacijenta): top=0,   left=0,   width 400
          - Circle:                          top=32,  left=32,  448×448
          - Small icon:                      top=348, left=40,  88×88
          - Calendar card (Kalendar):        top=300, left=272, width 310
        */}
        <div className="home4-feature-left__illustrations" style={{ flex: 1, position: 'relative', height: 508, minWidth: 0 }}>
          {/* Circle illustration */}
          <div className="home4-feature-left__decor" style={{ position: 'absolute', top: 32, left: 32, width: 448, height: 448 }}>
            <Image
              src="/images/home4/feature-left-circle.png"
              alt="Odontoa ilustracija"
              width={896}
              height={896}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Kartica 1 - Karton pacijenta */}
          <div className="home4-syscard home4-syscard--patient">
            <div className="home4-syscard__head">
              <div className="home4-syscard__avatar">
                {/* Stock fotografija se ubacuje naknadno: <img src="/images/home4/pacijent.jpg" alt="" /> */}
                VP
              </div>
              <div className="home4-syscard__name">
                <b>Vladimir Perić</b>
                <span>Karton pacijenta · ID P022</span>
              </div>
            </div>
            <div className="home4-syscard__list">
              <h5>Istorija tretmana</h5>
              {TREATMENTS.map((t) => (
                <div key={`${t.day}-${t.title}`} className="home4-syscard__item">
                  <div className="home4-syscard__item-date">
                    {t.day}
                    <small>{t.month}</small>
                  </div>
                  <div className="home4-syscard__item-what">
                    <b>{t.title}</b>
                    <span>{t.meta}</span>
                  </div>
                  <span className={`home4-syscard__status home4-syscard__status--${t.status}`}>
                    {t.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Small icon circle (88×88) */}
          <div
            className="home4-feature-left__decor"
            style={{
              position: 'absolute',
              top: 348,
              left: 40,
              width: 88,
              height: 88,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <Image
              src="/images/home4/feature-left-circle-icon.png"
              alt="Odontoa ikona"
              width={176}
              height={176}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Kartica 2 - Kalendar termina */}
          <div className="home4-syscard home4-syscard--cal">
            <div className="home4-syscard__cal-head">
              <b>
                Kalendar termina
                <small>četvrtak, 16. jul</small>
              </b>
              <span className="home4-syscard__cal-chip">Stolica 1</span>
            </div>
            {CALENDAR_SLOTS.map((slot) => (
              <div key={slot.time} className="home4-syscard__cal-slot">
                <div className="home4-syscard__cal-time">{slot.time}</div>
                <div
                  className={
                    slot.done
                      ? 'home4-syscard__cal-event home4-syscard__cal-event--done'
                      : 'home4-syscard__cal-event'
                  }
                >
                  <b>{slot.name}</b>
                  <span>{slot.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
