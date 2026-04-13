import Image from 'next/image';
import Link from 'next/link';

/* RB kartica: HTML; LT/LB/RT PNG — delovi/strelice u assetu; PREVIEW_CARD = jedan izvor za RB. */
const PREVIEW_CARD = {
  divider: 'var(--stellar-border)',
  arrow: {
    stroke: '#9b97b0',
    strokeWidth: 1.15,
    svgOpacity: 0.78,
    size: 12,
    viewBox: '0 0 14 14',
  },
} as const;

function PreviewTrendArrow({ up }: { up: boolean }) {
  const { stroke, strokeWidth, svgOpacity, size, viewBox } = PREVIEW_CARD.arrow;
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      aria-hidden
      style={{ opacity: svgOpacity, flexShrink: 0 }}
    >
      {up ? (
        <path
          d="M4 10L10 4M10 4H5.5M10 4V8.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M10 4L4 10M4 10H8.5M4 10V5.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

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
            {/* Eyebrow — suptilan, čitljiviji od 12px body label */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#6e51e0',
                fontSize: 13,
                fontWeight: 600,
                lineHeight: '21px',
                letterSpacing: '0.04em',
                margin: 0,
                marginBottom: 10,
              }}
            >
              Softver za stomatološke ordinacije
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
              <span style={{ whiteSpace: 'nowrap' }}>Digitalizuj svoju ordinaciju</span>
            </h1>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#363d4f',
                fontSize: 16,
                fontWeight: 400,
                lineHeight: '28px',
                letterSpacing: 0,
                margin: 0,
                marginTop: 20,
                maxWidth: 520,
              }}
            >
              Zakazivanje, kartoni i finansije. Brzo, jednostavno, digitalno.
            </p>

            {/* CTA — ispod podnaslova; spacing tuned vs phone at top=302 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 16,
                marginTop: 24,
              }}
            >
              <Link
                href="/demo"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: '24px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '15px 32px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #7f51f2 0%, #6e51e0 50%, #5a3ec8 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 2px rgba(6,11,19,0.06), 0 4px 14px -2px rgba(110,81,224,0.32)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                Zakaži demo
              </Link>
              <Link
                href="/home3#funkcionalnosti"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: '24px',
                  color: '#4a5060',
                  textDecoration: 'none',
                  padding: '15px 28px',
                  borderRadius: 999,
                  background: '#ffffff',
                  border: '1px solid var(--stellar-border)',
                  boxShadow: '0 1px 2px rgba(6,11,19,0.05)',
                }}
              >
                Testiraj besplatno
              </Link>
            </div>
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
            {/* Phone frame — original template asset */}
            <div style={{ position: 'relative' }}>
              <Image
                src="/images/home3/hero-phone.png"
                alt="Odontoa aplikacija"
                width={448}
                height={400}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
              {/*
                White screen overlay — precise insets match actual phone bezels:
                  left/right ~10% = ~92px physical bezel (896px source image)
                  top 13% = below status bar / notch zone
                White area now stays fully inside the screen bounds → no visible rectangle edge on bezel.
              */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '13%',
                  left: '10.3%',
                  right: '9.8%',
                  bottom: 0,
                  background: '#ffffff',
                  borderRadius: '14px 14px 0 0',
                }}
              />
              {/* Single Odontoa logo centered on clean screen */}
              <div
                style={{
                  position: 'absolute',
                  top: '13%',
                  left: '10.3%',
                  right: '9.8%',
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
                  alt="Odontoa"
                  width={140}
                  height={46}
                  style={{ width: 140, height: 'auto', display: 'block' }}
                />
              </div>
            </div>
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

          {/* LT: (104, 234) 176×176 — Aktivni kartoni */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 234,
              left: 104,
              width: 176,
              height: 176,
              borderRadius: 12,
              background: '#ffffff',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
              padding: '22px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            {/* Icon — folder/records in brand purple, same visual weight as original siren */}
            <svg
              width="44"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              aria-hidden
              style={{ marginBottom: 14, flexShrink: 0 }}
            >
              {/* Folder body */}
              <path
                d="M3 10C3 8.34 4.34 7 6 7H17L20.5 11H38C39.66 11 41 12.34 41 14V32C41 33.66 39.66 35 38 35H6C4.34 35 3 33.66 3 32V10Z"
                fill="#ede9fe"
              />
              {/* Folder top edge / tab line */}
              <path
                d="M3 16H41"
                stroke="#6e51e0"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.5"
              />
              {/* Record lines inside folder */}
              <path
                d="M12 23H32"
                stroke="#6e51e0"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M12 27.5H26"
                stroke="#6e51e0"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.55"
              />
              {/* Activity spark — top right, mirrors "rays" on original icon */}
              <path
                d="M38 4L39.2 1M41 7H44M39.5 9.5L41.5 11.5"
                stroke="#6e51e0"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>

            {/* Number */}
            <p
              style={{
                margin: 0,
                marginBottom: 4,
                fontSize: 36,
                fontWeight: 700,
                color: '#060b13',
                lineHeight: '42px',
                letterSpacing: '-0.5px',
                alignSelf: 'flex-start',
              }}
            >
              1.248
            </p>

            {/* Label */}
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 400,
                color: '#9ca3af',
                lineHeight: '18px',
                alignSelf: 'flex-start',
              }}
            >
              Aktivni kartoni
            </p>
          </div>

          {/* LB: (0, 458) 280×248 — Zdravo, Dr Ana */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 458,
              left: 0,
              width: 280,
              height: 248,
              borderRadius: 12,
              background: '#ffffff',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
              padding: '22px 22px 18px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            {/* Title */}
            <p
              style={{
                margin: 0,
                marginBottom: 5,
                fontSize: 22,
                fontWeight: 500,
                color: '#060b13',
                lineHeight: '28px',
                letterSpacing: '-0.25px',
              }}
            >
              Zdravo, Dr Ana
            </p>

            {/* Subtitle */}
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 400,
                color: '#9ca3af',
                lineHeight: '20px',
              }}
            >
              Pregled aktivnosti ove nedelje.
            </p>

            {/* Spacer — fixed 22px mirrors original template gap */}
            <div style={{ height: 22, flexShrink: 0 }} />

            {/* Avatar row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Initials avatar — lavender gradient, same family as RT card */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #ede9fe 0%, #c4b5fd 100%)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0 1px rgba(6,11,19,0.06)',
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#5b3fcb',
                    letterSpacing: '-0.3px',
                    userSelect: 'none',
                  }}
                >
                  AM
                </span>
              </div>

              {/* Name + secondary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#060b13',
                    lineHeight: '19px',
                    letterSpacing: '-0.12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Dr Ana Marković
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: '#7c8494',
                    lineHeight: '17px',
                  }}
                >
                  24 zakazana termina
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '20px 0' }} />

            {/* Bottom row — location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="12" height="15" viewBox="0 0 12 15" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                <path
                  d="M6 0C2.69 0 0 2.69 0 6C0 9.75 6 15 6 15C6 15 12 9.75 12 6C12 2.69 9.31 0 6 0ZM6 7.75C5.03 7.75 4.25 6.97 4.25 6C4.25 5.03 5.03 4.25 6 4.25C6.97 4.25 7.75 5.03 7.75 6C7.75 6.97 6.97 7.75 6 7.75Z"
                  fill="#6e51e0"
                />
              </svg>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: '#52576b',
                  lineHeight: '18px',
                }}
              >
                Beograd, Srbija
              </span>
            </div>
          </div>

          {/* RT: right=104, top=234, 176×176 — Zakazan pregled (jedan pacijent) */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 234,
              right: 104,
              width: 176,
              height: 176,
              borderRadius: 12,
              background: '#ffffff',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
              padding: '18px 18px 16px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <p
              style={{
                margin: 0,
                marginBottom: 4,
                fontSize: 19,
                fontWeight: 500,
                color: '#060b13',
                lineHeight: '25px',
                letterSpacing: '-0.2px',
              }}
            >
              Zakazan pregled
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 400,
                color: '#9ca3af',
                lineHeight: '18px',
              }}
            >
              11:00 – 11:30
            </p>

            <div style={{ flex: 1, minHeight: 10 }} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  flexShrink: 0,
                  overflow: 'hidden',
                  alignSelf: 'center',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(6,11,19,0.05)',
                }}
              >
                <Image
                  src="/images/home3/hero-patient-milica.png"
                  alt=""
                  width={80}
                  height={80}
                  sizes="40px"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: '50% 44%',
                    display: 'block',
                    filter: 'saturate(0.94) contrast(0.98)',
                    opacity: 0.98,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 3,
                  minWidth: 0,
                  flex: 1,
                  paddingTop: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: 'var(--stellar-muted)',
                    lineHeight: '15px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Pacijent
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#060b13',
                    lineHeight: '19px',
                    letterSpacing: '-0.12px',
                  }}
                >
                  Milica Jovanović
                </span>
              </div>
            </div>
          </div>

          {/* RB: right=0, top=458, 280×248 — Pregled ordinacije */}
          <div
            className="home3-hero-card"
            style={{
              position: 'absolute',
              top: 458,
              right: 0,
              width: 280,
              height: 248,
              borderRadius: 12,
              background: '#ffffff',
              boxShadow: '0 12px 96px 0 rgba(6,11,19,0.1), 0 0 0 4px #ffffff',
              padding: '18px 20px 16px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            {/* Title — prominent, matches "Stellar Highlights" presence */}
            <div style={{ marginBottom: 18 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: '#060b13',
                  lineHeight: '26px',
                  letterSpacing: '-0.2px',
                }}
              >
                Pregled ordinacije
              </span>
            </div>

            {/* Full-width divider — ispod naslova; redovi bez među-linija */}
            <div style={{ height: 1, background: PREVIEW_CARD.divider, marginBottom: 14 }} />

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {[
                { label: 'Zakazani',    value: '24',  up: true  },
                { label: 'Završeni',    value: '17',  up: true  },
                { label: 'Otkazani',    value: '2',   up: false },
                { label: 'Popunjenost', value: '89%', up: true  },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 400, color: '#52576b', lineHeight: '18px' }}>
                    {row.label}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      flexShrink: 0,
                      paddingRight: 16,
                    }}
                  >
                    <PreviewTrendArrow up={row.up} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#060b13', lineHeight: '18px' }}>
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
