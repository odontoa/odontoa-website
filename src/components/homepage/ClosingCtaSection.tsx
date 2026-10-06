import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export default function ClosingCtaSection() {
  return (
    <section className="closing-cta">
      <Reveal>
      <div className="closing-cta__inner">
        {/* Left text */}
        <div>
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)', letterSpacing: '-0.18px' }}
          >
            Počni danas
          </p>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Probaj Odontou 30 dana besplatno.
          </h2>
          <p
            className="text-[15px] leading-[1.65]"
            style={{ color: 'var(--stellar-body)' }}
          >
            Par minuta do naloga, pacijente uvozimo mi.
          </p>
        </div>

        {/* Zavrsni korak funnela: postojeci trial tok (/register). Polje za email je
            uklonjeno jer /register ne prima email iz URL-a, pa ga nije imalo gde da posalje. */}
        <div>
          <div className="closing-cta__form">
            <Link href="/register" className="btn-cta">
              Započni besplatno
            </Link>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
