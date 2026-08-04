import Image from 'next/image';
import Link from 'next/link';
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

          {/* Telefon sa Odontoa aplikacijom, preko glow kruga. Pozicioniranje je
              u CSS klasi, ne inline, da bi mobilni breakpoint mogao da ga pregazi. */}
          <div className="home4-feature-right__phone">
            {/* Ista slika na oba slota, razlikuje se samo velicina po
                breakpointu. Isti URL, pa browser skida sliku jednom. */}
            <Image
              className="home4-feature-right__phone-desktop"
              src="/images/black-phone-odontoa-mockup-1000.png"
              alt="Odontoa aplikacija na mobilnom telefonu"
              width={1000}
              height={1667}
              sizes="306px"
            />

            <Image
              className="home4-feature-right__phone-mobile"
              src="/images/black-phone-odontoa-mockup-1000.png"
              alt="Odontoa aplikacija na mobilnom telefonu"
              width={1000}
              height={1667}
              sizes="280px"
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
            Par minuta do naloga, pacijente uvozimo mi.
          </p>

          <div className="flex flex-col gap-4">
            {/* Omotac ostaje i sa jednim detetom: na <=640px nosi
                flex-direction: column i width: 100%, pa dugme tamo ide punom sirinom. */}
            <div className="home4-cta__form">
              <Link href="/register" className="home4-btn-cta">
                Započni besplatno
              </Link>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--stellar-muted)' }}
            >
              Mesec dana besplatno · Bez kreditne kartice
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
