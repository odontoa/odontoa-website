import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export default function DemoCtaSection() {
  return (
    <section className="demo-cta">
      <div className="demo-cta__inner">
        {/* Illustrations - circle + cards all in one unit */}
        <Reveal delay={0.12} className="demo-cta__visual-wrap">
        <div className="demo-cta__illustrations">
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
          <div className="demo-cta__phone">
            {/* Ista slika na oba slota, razlikuje se samo velicina po
                breakpointu. Isti URL, pa browser skida sliku jednom. */}
            <Image
              className="demo-cta__phone-desktop"
              src="/images/black-phone-odontoa-mockup-1000.png"
              alt="Odontoa aplikacija na mobilnom telefonu"
              width={1000}
              height={1667}
              sizes="306px"
            />

            <Image
              className="demo-cta__phone-mobile"
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
            Pogledaj uživo
          </p>
          <h2 className="section-title" style={{ marginBottom: 24 }}>
            Prođi kroz Odontou sa nama za 15 minuta.
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--stellar-body)' }}
          >
            Na pozivu ti pokažemo zakazivanje, karton i finansije na primeru tvoje ordinacije.
          </p>

          <div className="flex flex-col gap-4">
            {/* Omotac ostaje i sa jednim detetom: na <=640px nosi
                flex-direction: column i width: 100%, pa dugme tamo ide punom sirinom. */}
            <div className="closing-cta__form">
              {/* Srednji korak funnela: proizvod uzivo (postojeci /demo), trial je u zavrsnom CTA */}
              <Link href="/demo" className="btn-cta">
                Zakaži demo
              </Link>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--stellar-muted)' }}
            >
              Bez obaveze i bez pripreme.
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
