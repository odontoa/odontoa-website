import Image from 'next/image';

const LOGOS = [
  { src: '/images/home3/logo-1.svg', alt: 'Logo 1' },
  { src: '/images/home3/logo-2.svg', alt: 'Logo 2' },
  { src: '/images/home3/logo-3.svg', alt: 'Logo 3' },
  { src: '/images/home3/logo-4.svg', alt: 'Logo 4' },
  { src: '/images/home3/logo-5.svg', alt: 'Logo 5' },
  { src: '/images/home3/logo-6.svg', alt: 'Logo 6' },
];

const TRACK = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

export default function Home3TrustLogos() {
  return (
    <section className="home3-trust-section" style={{ background: '#ffffff', padding: '96px 0' }}>
      <div
        className="home3-trust-container"
        style={{
          maxWidth: 1216,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Heading */}
        <h2
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 28.75,
            fontWeight: 500,
            lineHeight: '38.4px',
            letterSpacing: '-0.69px',
            color: '#060b13',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Vodece kompanije sveta koriste Odontoa.
        </h2>

        {/* Logo carousel */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: 80 }}>
          {/* Left fade */}
          <div
            className="home3-trust-fade"
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 160,
              background: 'linear-gradient(to right, #ffffff, transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          {/* Right fade */}
          <div
            className="home3-trust-fade"
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 160,
              background: 'linear-gradient(to left, #ffffff, transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />

          {/* Scrolling track */}
          <div className="home3-trust__logos-track" style={{ gap: 0 }}>
            {TRACK.map((logo, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: 180,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={40}
                    style={{ objectFit: 'contain', maxHeight: 40 }}
                  />
                </div>
                <div
                  style={{
                    width: 1,
                    height: 32,
                    background: '#e8eaf2',
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Body text */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 20,
            fontWeight: 400,
            lineHeight: '40px',
            letterSpacing: '-0.33px',
            color: '#363d4f',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Odontoa koristi vise od 55.000+ ordinacija sirom sveta
        </p>

        {/* CTA button */}
        <a
          href="#"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 999,
            border: '1px solid #e9ebf1',
            background: 'linear-gradient(180deg, rgba(235,239,244,0) 0%, rgba(235,239,244,0.04) 100%)',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '-0.18px',
            color: '#060b13',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Zapocnite besplatno
        </a>
      </div>
    </section>
  );
}
