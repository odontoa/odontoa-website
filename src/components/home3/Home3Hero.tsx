import Image from 'next/image';

export default function Home3Hero() {
  return (
    <section
      className="home3-hero-section"
      style={{
        position: 'relative',
        background: '#ffffff',
        overflow: 'hidden',
        minHeight: 910,
      }}
    >
      {/* ── Gray background area (712px from section top, includes navbar zone) ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 712,
          background: '#f7f8fa',
          zIndex: 0,
        }}
      >
        {/* Perspective grid — barely visible, matches Figma (opacity ~0.35) */}
        <Image
          src="/images/home3/hero-grid.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'top', opacity: 0.35 }}
          priority
        />
      </div>

      {/* Wave / perspective floor — barely visible */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 520,
          left: 0,
          right: 0,
          height: 192,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.35,
        }}
      >
        <Image
          src="/images/home3/hero-wave.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'fill' }}
        />
      </div>

      {/* ── 1216px Container — starts 208px from section top (nav 88 + gap 120) ── */}
      <div
        style={{
          position: 'relative',
          maxWidth: 1216,
          margin: '0 auto',
          paddingTop: 208,
          zIndex: 2,
        }}
      >
        {/*
          702px tall inner frame matching exact Figma container dimensions.
          All children absolutely positioned within it.
        */}
        <div style={{ position: 'relative', height: 702 }}>

          {/* ── Text block: centered, top=0 ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Label: Inter 12px 500, #6e51e0, lh=20.4 */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#6e51e0',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: '20.4px',
                letterSpacing: 0,
                margin: 0,
                marginBottom: 8,
              }}
            >
              Za stomatološke ordinacije
            </p>

            <h1
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#060b13',
                fontSize: 58,
                fontWeight: 500,
                lineHeight: '76.8px',
                letterSpacing: '-0.5px',
                margin: 0,
                maxWidth: 700,
              }}
            >
              Uštedite vreme i vodite
              <br />
              <span style={{ whiteSpace: 'nowrap' }}>
                ordinaciju bolje sa{' '}
                {/*
                  Stellar pill: exported directly from Figma (gradient bg + 3-layer shadow).
                  Figma: 202×85, r=999, text is Inter 56.25px w500 letter-spacing=-1.61px
                  Shadows:
                    rgba(38,20,85,0.5) 0 1px 1px (inner edge)
                    rgba(110,81,224,1) 0 0 0 1.5px spread (border ring)
                    rgba(127,81,242,0.3) 0 6px 8px -4px (glow below)
                */}
                <span
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    position: 'relative',
                    top: -4,
                    paddingLeft: 28,
                    paddingRight: 28,
                    height: 85,
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, #7f51f2 0%, #6e51e0 50%, #5a3ec8 100%)',
                    boxShadow:
                      'inset 0 1px 1px rgba(38,20,85,0.5), 0 0 0 1.5px rgba(110,81,224,1), 0 6px 8px -4px rgba(127,81,242,0.3)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 52,
                    fontWeight: 500,
                    letterSpacing: '-1.61px',
                    color: '#ffffff',
                    lineHeight: '85px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Odontoa
                </span>
              </span>
            </h1>

            {/* Body: Inter 16px 400, #363d4f, lh=32px */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#363d4f',
                fontSize: 16,
                fontWeight: 400,
                lineHeight: '32px',
                letterSpacing: 0,
                margin: 0,
                marginTop: 26,
                maxWidth: 440,
              }}
            >
              Pratite pacijente, termine i finansije -
              <br />
              sve na jednom mestu.
            </p>
          </div>

          {/* ── Phone mockup: 448px centered, top=302 ── */}
          <div
            style={{
              position: 'absolute',
              top: 302,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 448,
            }}
          >
            <Image
              src="/images/home3/hero-phone-odontoa.png"
              alt="Odontoa aplikacija"
              width={448}
              height={400}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
            {/* Purple gradient dividers below phone — Figma: Horizontal Divider FRAME */}
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: 'linear-gradient(to left, #6e51e0, transparent)',
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: 'linear-gradient(to right, #6e51e0, transparent)',
                }}
              />
            </div>
          </div>

          {/* ── Floating cards ──
            Figma shadow spec (same on all 4 cards):
              shadow 1: rgba(6,11,19,0.1) offset=(0,12) blur=96 spread=0
              shadow 2: rgba(255,255,255,1) offset=(0,0) blur=0 spread=4  (white ring)
            Border stroke: rgba(255,255,255,0.12) — inset, 1px (negligible, covered by white ring)
          ── */}

          {/* LT: (104, 234) 176×176 */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 234,
              left: 104,
              width: 176,
              height: 176,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <Image
              src="/images/home3/card-lt.png"
              alt="12K Customers"
              width={352}
              height={352}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* LB: (0, 458) 280×248 */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 458,
              left: 0,
              width: 280,
              height: 248,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <Image
              src="/images/home3/card-lb.png"
              alt="Hi Sarah Smith"
              width={560}
              height={496}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* RT: right=104, top=234, 176×176 */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 234,
              right: 104,
              width: 176,
              height: 176,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <Image
              src="/images/home3/card-rt.png"
              alt="Sales Meeting"
              width={352}
              height={352}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* RB: right=0, top=458, 280×248 */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 458,
              right: 0,
              width: 280,
              height: 248,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
            }}
          >
            <Image
              src="/images/home3/card-rb.png"
              alt="Stellar Highlights"
              width={560}
              height={496}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
