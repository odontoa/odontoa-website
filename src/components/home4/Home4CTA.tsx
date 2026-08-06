import Reveal from './Reveal';

export default function Home4CTA() {
  return (
    <section className="home4-cta">
      <Reveal>
      <div className="home4-cta__inner">
        {/* Left text */}
        <div>
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)', letterSpacing: '-0.18px' }}
          >
            Počnite danas
          </p>
          <h2 className="home4-h2" style={{ marginBottom: 16 }}>
            Pogledajte kako Odontoa izgleda u vašoj ordinaciji.
          </h2>
          <p
            className="text-[15px] leading-[1.65]"
            style={{ color: 'var(--stellar-body)' }}
          >
            Kratka prezentacija sistema, bez komplikacije.
          </p>
        </div>

        {/* Right form */}
        <div>
          <div className="home4-cta__form">
            <input
              type="email"
              placeholder="Vaš email"
              className="home4-cta__input"
            />
            <button className="home4-btn-cta">
              Započni besplatno
            </button>
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--stellar-muted)' }}>
            30 dana besplatno
          </p>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
