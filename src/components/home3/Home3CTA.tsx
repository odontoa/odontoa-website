export default function Home3CTA() {
  return (
    <section className="home3-cta">
      <div className="home3-cta__inner">
        {/* Left text */}
        <div>
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)', letterSpacing: '-0.18px' }}
          >
            Počnite danas
          </p>
          <h2
            className="text-[36px] leading-[1.2] font-medium tracking-[-1.25px] mb-4"
            style={{ color: 'var(--stellar-heading)' }}
          >
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
          <div className="home3-cta__form">
            <input
              type="email"
              placeholder="Vaš email"
              className="home3-cta__input"
            />
            <button className="home3-btn-cta">
              Započni besplatno
            </button>
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--stellar-muted)' }}>
            3 meseca besplatno · Bez kreditne kartice
          </p>
        </div>
      </div>
    </section>
  );
}
