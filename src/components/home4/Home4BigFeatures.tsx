import Reveal from './Reveal';

const CALENDAR_CELLS = [
  '#6e51e0', '#f4f1fd', '#f3f4f8', '#fef3ec', '#6e51e0',
  '#f3f4f8', '#edfaf2', '#6e51e0', '#f3f4f8', '#fef8e8',
  '#edfaf2', '#f4f1fd', '#f3f4f8', '#6e51e0', '#f3f4f8',
  '#f3f4f8', '#fef3ec', '#f4f1fd', '#f3f4f8', '#edfaf2',
];


export default function Home4BigFeatures() {
  return (
    <section id="funkcionalnosti" className="home4-big-features">
      <div className="home4-big-features__inner">

        {/* ── Header ── */}
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--stellar-accent)',
              marginBottom: 16,
            }}>
              U praksi
            </p>
            <h2 className="home4-h2">
              Od zakazivanja{' '}
              <span style={{ color: 'var(--stellar-accent)' }}>do naplate.</span>
            </h2>
          </div>
        </Reveal>

        {/* ── Three cards ── */}
        <Reveal delay={0.12}>
        <div className="home4-big-features__cards">

          {/* Card 1 - Zakazivač termina (light) */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid var(--stellar-border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: '26px 26px 0', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: '#f4f1fd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6e51e0" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />
                  </svg>
                </div>
                <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--stellar-muted)', fontWeight: 600 }}>
                  Zakazivanje
                </span>
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--stellar-heading)', margin: '0 0 10px' }}>
                Zakazivanje i dolasci
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--stellar-body)', margin: '0 0 28px' }}>
                Brzo zakazivanje, automatski SMS i e-mail podsetnici i pregledan raspored po doktoru i stolici. Jasan status svakog termina u realnom vremenu.
              </p>
            </div>
            {/* Calendar grid */}
            <div style={{
              margin: '0 20px 20px',
              background: 'var(--stellar-bg-light)',
              border: '1px solid var(--stellar-border)',
              borderRadius: 12,
              padding: 16,
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 6, marginBottom: 8,
                fontSize: 10, color: 'var(--stellar-muted)', fontWeight: 600, letterSpacing: '0.04em',
                fontFamily: 'ui-monospace, monospace',
              }}>
                {['PON','UTO','SRE','ČET','PET'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {CALENDAR_CELLS.map((color, i) => (
                  <div key={i} style={{ height: 22, borderRadius: 4, background: color }} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 11, color: 'var(--stellar-body)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6e51e0" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                12 SMS podsetnika · danas
              </div>
            </div>
          </div>

          {/* Card 2 - Karton i terapija (dark accent) */}
          <div style={{
            background: '#1e2235',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: '26px 26px 0', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                </div>
                <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8b909e', fontWeight: 600 }}>
                  Karton
                </span>
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 10px' }}>
                Karton i terapija
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#b8bcc8', margin: '0 0 28px' }}>
                Anamneza, plan terapije, RTG i fotografije, saglasnosti i beleške - sve u kartonu pacijenta, dostupno u sekundi.
              </p>
            </div>
            {/* Document strips */}
            <div style={{
              margin: '0 20px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              {([
                { label: 'Anamneza', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4" /> },
                { label: 'Plan terapije', icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></> },
                { label: 'RTG i saglasnosti', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8M12 8v8" /></> },
              ] as const).map(({ label, icon }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                    {icon}
                  </svg>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 - Finansije (light) */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid var(--stellar-border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: '26px 26px 0', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: '#f4f1fd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6e51e0" strokeWidth="1.8">
                    <path d="M3 3v18h18M7 14l4-4 4 4 6-6" />
                  </svg>
                </div>
                <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--stellar-muted)', fontWeight: 600 }}>
                  Naplata
                </span>
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--stellar-heading)', margin: '0 0 10px' }}>
                Naplata i administracija
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--stellar-body)', margin: '0 0 28px' }}>
                Predračuni, uplate i dugovanja na jednom mestu. Osnovni finansijski pregled ordinacije bez dodatnog haosa.
              </p>
            </div>
            {/* Admin rows */}
            <div style={{
              margin: '0 20px 20px',
              background: 'var(--stellar-bg-light)',
              border: '1px solid var(--stellar-border)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              {([
                { label: 'Računi', icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /> },
                { label: 'Uplate', icon: <path d="M20 6L9 17l-5-5" /> },
                { label: 'Izveštaji', icon: <path d="M3 3v18h18M7 14l4-4 4 4 6-6" /> },
              ] as const).map(({ label, icon }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px',
                  borderRadius: 6,
                  background: '#ffffff',
                  border: '1px solid var(--stellar-border)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6e51e0" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                    {icon}
                  </svg>
                  <span style={{ fontSize: 13, color: 'var(--stellar-body)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
        </Reveal>
      </div>
    </section>
  );
}
