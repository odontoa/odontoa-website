import Image from 'next/image';

const BULLETS = [
  'Pratite sve pacijente i njihove kartone na jednom mestu.',
  'Zakazujte termine brzo i bez grešaka.',
  'Kontrolišite finansije ordinacije u realnom vremenu.',
];

export default function Home3FeatureLeft() {
  return (
    <section className="home3-feature-left" style={{ background: '#ffffff', padding: '96px 24px', overflow: 'hidden' }}>
      <div
        className="home3-feature-left__inner"
        style={{
          maxWidth: 1216,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 104,
        }}
      >
        {/* ── Left text column (488px) ── */}
        <div className="home3-feature-left__text" style={{ flex: '0 0 488px' }}>
          {/* Label */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '23.8px',
              letterSpacing: '-0.18px',
              color: '#6e51e0',
              margin: 0,
              marginBottom: 16,
            }}
          >
            Upoznajte Odontoa
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 43.125,
              fontWeight: 500,
              lineHeight: '57.6px',
              letterSpacing: '-1.25px',
              color: '#060b13',
              margin: 0,
              marginBottom: 24,
            }}
          >
            Pouzdana rešenja uvek
            <br />
            kada su vam potrebna
          </h2>

          {/* Body */}
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
            Odontoa je više od softvera za ordinacije - to je kompletno
            digitalno rešenje za modernu stomatološku praksu.
          </p>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {BULLETS.map((text, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: '23.8px',
                  letterSpacing: '-0.18px',
                  color: '#060b13',
                }}
              >
                <Image
                  src="/images/home3/feature-checkmark-circle.png"
                  alt=""
                  width={72}
                  height={72}
                  style={{ width: 24, height: 24, flexShrink: 0 }}
                />
                {text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href="#" className="home3-btn-gradient">
            Isprobajte besplatno
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="home3-feature-left__illustrations" style={{ flex: 1, position: 'relative', height: 508, minWidth: 0 }}>
          {/* Circle illustration */}
          <div style={{ position: 'absolute', top: 32, left: 32, width: 448, height: 448 }}>
            <Image
              src="/images/home3/feature-left-circle.png"
              alt="Odontoa ilustracija"
              width={896}
              height={896}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Big top card (384×256) */}
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
            <Image
              src="/images/home3/feature-left-card-top.png"
              alt="Dashboard pregled"
              width={768}
              height={512}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
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
              src="/images/home3/feature-left-circle-icon.png"
              alt="Odontoa ikona"
              width={176}
              height={176}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Bottom card (280×208) */}
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
            <Image
              src="/images/home3/feature-left-card-bottom.png"
              alt="Statistika ordinacije"
              width={560}
              height={416}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
