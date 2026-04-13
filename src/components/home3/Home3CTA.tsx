import { Check } from 'lucide-react';

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
            Započnite danas
          </p>
          <h2
            className="text-[36px] leading-[1.2] font-medium tracking-[-1.25px] mb-4"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Isprobajte Odontoa bez obaveze.
          </h2>
          <p
            className="text-[15px] leading-[1.65]"
            style={{ color: 'var(--stellar-body)' }}
          >
            Pogledajte kako Odontoa izgleda u praksi.
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
          <div className="home3-cta__checks">
            <div className="home3-cta__check">
              <div className="home3-cta__check-icon">
                <Check size={12} strokeWidth={2.5} />
              </div>
              Besplatno, bez obaveze
            </div>
            <div className="home3-cta__check">
              <div className="home3-cta__check-icon">
                <Check size={12} strokeWidth={2.5} />
              </div>
              Bez kreditne kartice
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
