import Image from 'next/image';

const FEATURE_ROWS = [
  { num: '/01', title: 'Zakazivač termina', desc: 'Kalendar po doktorima i stolicama, drag-and-drop izmene.' },
  { num: '/02', title: 'Karton pacijenta', desc: 'Anamneza, terapije i istorija poseta - uvek dostupne.' },
  { num: '/03', title: 'Dokumentacija i saglasnosti', desc: 'Šabloni, digitalni potpis, e-arhiva.' },
  { num: '/04', title: 'RTG i fotografije', desc: 'Slike u kartonu, bez traženja po folderima.' },
  { num: '/05', title: 'Finansije i podsetnici', desc: 'Predračuni, uplate, automatski SMS podsetnici.' },
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
          - Big top card:    top=0,   left=0,   384×256
          - Circle:          top=32,  left=32,  448×448
          - Small icon:      top=348, left=40,  88×88
          - Bottom card:     top=300, left=272, 280×208
        */}
        <div className="home4-feature-left__illustrations" style={{ flex: 1, position: 'relative', height: 508, minWidth: 0 }}>
          {/* Circle illustration */}
          <div style={{ position: 'absolute', top: 32, left: 32, width: 448, height: 448 }}>
            <Image
              src="/images/home4/feature-left-circle.png"
              alt="Odontoa ilustracija"
              width={896}
              height={896}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Big top card (384×256) - Pregled rada */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 384,
              height: 256,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.04)',
                borderRadius: 12,
                width: '100%',
                height: '100%',
                padding: '28px 24px 22px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#979fb4', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block' }}>
                    Pregled rada
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#060b13', letterSpacing: '-0.4px', lineHeight: 1.1 }}>
                    Danas
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {(['30D', '7D', '1D'] as const).map((tab) => (
                    <span
                      key={tab}
                      style={{
                        fontSize: 12,
                        fontWeight: tab === '1D' ? 500 : 400,
                        color: tab === '1D' ? '#363d4f' : '#b0b7c9',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: tab === '1D' ? '1px solid #e4e6ec' : '1px solid transparent',
                        lineHeight: '18px',
                        letterSpacing: '-0.1px',
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metric row 1 - purple chart */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#52576b' }}>Zakazano</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#3a8b6a', background: '#edfaf2', padding: '2px 6px', borderRadius: 999 }}>
                      +12%
                    </span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#060b13', letterSpacing: '-0.5px', lineHeight: '26px' }}>
                    24{' '}<span style={{ fontSize: 16, fontWeight: 500, color: '#8b909e' }}>termina</span>
                  </span>
                </div>
                <svg width="140" height="48" viewBox="0 0 140 48" fill="none" style={{ flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="pregled-g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6e51e0" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#6e51e0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,42 C10,42 18,16 44,18 C70,20 76,40 98,34 C116,28 124,8 140,6 L140,48 L0,48 Z" fill="url(#pregled-g1)" />
                  <path d="M0,42 C10,42 18,16 44,18 C70,20 76,40 98,34 C116,28 124,8 140,6" stroke="#6e51e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Divider between rows */}
              <div style={{ height: 1, background: '#eceef3', flexShrink: 0 }} />

              {/* Metric row 2 - grey chart */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#52576b' }}>Završeno</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#3a8b6a', background: '#edfaf2', padding: '2px 6px', borderRadius: 999 }}>
                      +8%
                    </span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#060b13', letterSpacing: '-0.5px', lineHeight: '26px' }}>
                    18{' '}<span style={{ fontSize: 16, fontWeight: 500, color: '#8b909e' }}>termina</span>
                  </span>
                </div>
                <svg width="140" height="48" viewBox="0 0 140 48" fill="none" style={{ flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="pregled-g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#979fb4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#979fb4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,44 C12,44 20,22 46,26 C72,30 78,44 100,40 C118,36 126,14 140,12 L140,48 L0,48 Z" fill="url(#pregled-g2)" />
                  <path d="M0,44 C12,44 20,22 46,26 C72,30 78,44 100,40 C118,36 126,14 140,12" stroke="#979fb4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Small icon circle (88×88) */}
          <div
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

          {/* Bottom card (280×208) - Promet ove nedelje */}
          <div
            style={{
              position: 'absolute',
              top: 300,
              left: 272,
              width: 280,
              height: 208,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.04)',
                borderRadius: 12,
                width: '100%',
                height: '100%',
                padding: '24px 22px 20px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {/* Label + kebab */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#979fb4', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  Promet ove nedelje
                </span>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f4f1fd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e51e0" strokeWidth="1.8" aria-hidden>
                    <path d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </div>
              </div>

              {/* Main value */}
              <span style={{ fontSize: 26, fontWeight: 700, color: '#060b13', letterSpacing: '-0.5px', lineHeight: '32px', marginTop: 6 }}>
                312.000{' '}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#979fb4' }}>RSD</span>
              </span>

              {/* Spacer */}
              <div style={{ flex: 1, minHeight: 14 }} />

              {/* Progress row 1 - Naplata */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#52576b' }}>Naplata</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#363d4f' }}>78%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#eceef3', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', borderRadius: 3, background: '#c4b5fd' }} />
                </div>
              </div>

              {/* Progress row 2 - Dolasci */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#52576b' }}>Dolasci</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#363d4f' }}>96%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#eceef3', overflow: 'hidden' }}>
                  <div style={{ width: '96%', height: '100%', borderRadius: 3, background: '#6e51e0' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
