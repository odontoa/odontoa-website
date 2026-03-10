import { Check } from 'lucide-react';

export default function Home3CTA() {
  return (
    <section className="home3-cta">
      <div className="home3-cta__inner">
        {/* Left text */}
        <div>
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)' }}
          >
            Start building today!
          </p>
          <h2
            className="text-[43px] leading-[1.15] font-medium tracking-tight mb-4"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Start your 7-day free trial
          </h2>
          <p
            className="text-base"
            style={{ color: 'var(--stellar-body)' }}
          >
            Experience the Stellar difference and unlock the true potential
          </p>
        </div>

        {/* Right form */}
        <div>
          <div className="home3-cta__form">
            <input
              type="email"
              placeholder="name@email.com"
              className="home3-cta__input"
            />
            <button className="home3-btn-purple whitespace-nowrap">
              Get Instant Access
            </button>
          </div>
          <div className="home3-cta__checks">
            <div className="home3-cta__check">
              <div className="home3-cta__check-icon">
                <Check size={14} strokeWidth={3} />
              </div>
              Free 7-day trial
            </div>
            <div className="home3-cta__check">
              <div className="home3-cta__check-icon">
                <Check size={14} strokeWidth={3} />
              </div>
              No credit card required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
