import Image from 'next/image';

export default function Home3FeatureRight() {
  return (
    <section className="home3-feature-right">
      <div className="home3-feature-right__inner">
        {/* Illustrations — circle + cards all in one unit */}
        <div className="home3-feature-right__illustrations">
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

          {/* Top card — left */}
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
              src="/images/home3/feature-right-stock.png"
              alt="Stock details"
              width={680}
              height={480}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Bottom card — shifted right, overlaps top card */}
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
              src="/images/home3/feature-right-chart.png"
              alt="Fleet tonnage"
              width={880}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* Text */}
        <div>
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)' }}
          >
            Pocnite danas
          </p>
          <h2
            className="text-[44px] leading-[1.15] font-medium tracking-tight mb-6"
            style={{ color: 'var(--stellar-heading)', letterSpacing: '-1.25px' }}
          >
            Digitalizujte svoju
            <br />
            ordinaciju danas.
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--stellar-body)' }}
          >
            Pratite analitiku u realnom vremenu i donosite
            poslovne odluke na osnovu tačnih podataka.
          </p>

          <div className="flex flex-col gap-4">
            <div className="home3-cta__form">
              <input
                type="email"
                placeholder="name@email.com"
                className="home3-cta__input"
              />
              <button className="home3-btn-purple whitespace-nowrap">Zapocnite</button>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--stellar-muted)' }}
            >
              14 dana besplatno - bez kreditne kartice
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
