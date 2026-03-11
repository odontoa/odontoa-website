import Image from 'next/image';

const FEATURES = [
  {
    icon: '/images/home3/key-features/icon-deploy.svg',
    title: 'Deploy faster together',
    description: 'Gain a competitive edge with our SEO optimization tools',
  },
  {
    icon: '/images/home3/key-features/icon-nocode.svg',
    title: 'Beautiful No-Code',
    description: "Enhance your website's visibility and drive targeted traffic",
  },
  {
    icon: '/images/home3/key-features/icon-comms.svg',
    title: 'Good Communication',
    description: 'xperience the Stellar difference and unlock the true potential',
  },
  {
    icon: '/images/home3/key-features/icon-custom.svg',
    title: 'Easily Customised',
    description: 'From content creation and deployment to performance',
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
            Our Key Features
          </p>
          <h2
            className="text-[44px] leading-[1.3] font-medium tracking-[-1.25px] mb-10"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Build a solution that wins
            <br />
            you more customers.
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
