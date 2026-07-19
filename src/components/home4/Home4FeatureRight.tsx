import Image from 'next/image';
import Reveal from './Reveal';

export default function Home4FeatureRight() {
  return (
    <section className="home4-feature-right">
      <div className="home4-feature-right__inner">
        {/* Illustrations - circle + cards all in one unit */}
        <Reveal delay={0.12} className="home4-feature-right__visual-wrap">
        <div className="home4-feature-right__illustrations">
          {/* Decorative circle */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              left: '40%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'rgba(110,81,224,0.06)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Top card - left */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 340,
              height: 240,
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: 2,
            }}
          >
            <Image
              src="/images/home4/feature-right-stock.png"
              alt="Stock details"
              width={680}
              height={480}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Bottom card - shifted right, overlaps top card */}
          <div
            style={{
              position: 'absolute',
              top: 190,
              left: 64,
              width: 440,
              height: 300,
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <Image
              src="/images/home4/feature-right-chart.png"
              alt="Fleet tonnage"
              width={880}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)' }}
          >
            Počnite danas
          </p>
          <h2 className="home4-h2" style={{ marginBottom: 24 }}>
            Pogledajte kako Odontoa izgleda u vašoj ordinaciji.
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--stellar-body)' }}
          >
            Kratka prezentacija sistema, bez komplikacije.
          </p>

          <div className="flex flex-col gap-4">
            <div className="home4-cta__form">
              <input
                type="email"
                placeholder="Vaš email"
                className="home4-cta__input"
              />
              <button className="home4-btn-cta">Započni besplatno</button>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--stellar-muted)' }}
            >
              3 meseca besplatno · Bez kreditne kartice
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
