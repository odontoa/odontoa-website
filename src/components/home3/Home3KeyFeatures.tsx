import Image from 'next/image';

const FEATURES = [
  {
    icon: '/images/home3/key-features/icon-deploy.svg',
    title: 'Sve povezano',
    description: 'Kartoni, termini, dokumenti i finansije u istom sistemu.',
  },
  {
    icon: '/images/home3/key-features/icon-nocode.svg',
    title: 'Tehnika',
    description: 'Zahtevi, istorija i saradnja sa tehnikom na jednom mestu.',
  },
  {
    icon: '/images/home3/key-features/icon-comms.svg',
    title: 'Dokumentacija i saglasnosti',
    description: 'Šabloni, saglasnosti i digitalni potpisi pacijenta.',
  },
  {
    icon: '/images/home3/key-features/icon-custom.svg',
    title: 'Finansije i izveštaji',
    description: 'Predračuni, uplate i pregled rada ordinacije.',
  },
];

export default function Home3KeyFeatures() {
  return (
    <section className="home3-key-features">
      <div className="home3-key-features__inner">
        {/* Text + Feature Grid */}
        <div>
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)', letterSpacing: '-0.18px' }}
          >
            Zašto Odontoa
          </p>
          <h2
            className="text-[44px] leading-[1.3] font-medium tracking-[-1.25px] mb-10"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Više kontrole nad radom ordinacije.
          </h2>

          <div className="home3-key-features__grid">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="home3-key-features__item">
                {/* Icon box */}
                <div className="home3-key-features__icon-box">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
                <h3
                  className="text-base font-medium mb-2 mt-4"
                  style={{ color: 'var(--stellar-heading)', letterSpacing: '-0.26px' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--stellar-body)', letterSpacing: '-0.09px' }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockups */}
        <div className="home3-key-features__phones">
          {/* Border background panel */}
          <div className="home3-key-features__phone-panel" />
          {/* Back phone */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home3/key-features/phone-back.png"
            alt=""
            className="home3-key-features__phone-back"
          />
          {/* Front phone */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home3/key-features/phone-front.png"
            alt=""
            className="home3-key-features__phone-front"
          />
        </div>
      </div>
    </section>
  );
}
