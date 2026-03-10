import Image from 'next/image';
import { Rocket, Layout, MessageCircle, Settings } from 'lucide-react';

const FEATURES = [
  {
    icon: Rocket,
    title: 'Deploy faster together',
    description: 'Gain a competitive edge with our SEO optimization tools',
  },
  {
    icon: Layout,
    title: 'Beautiful No-Code',
    description: "Enhance your website's visibility and drive targeted traffic",
  },
  {
    icon: MessageCircle,
    title: 'Good Communication',
    description: 'xperience the Stellar difference and unlock the true potential',
  },
  {
    icon: Settings,
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
            style={{ color: 'var(--stellar-accent)' }}
          >
            Our Key Features
          </p>
          <h2
            className="text-[44px] leading-[1.15] font-medium tracking-tight mb-10"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Build a solution that wins
            <br />
            you more customers.
          </h2>

          <div className="home3-key-features__grid">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
                <feature.icon
                  size={36}
                  strokeWidth={1.5}
                  style={{ color: 'var(--stellar-accent)' }}
                  className="home3-key-features__item-icon"
                />
                <h3
                  className="text-base font-medium mb-2"
                  style={{ color: 'var(--stellar-heading)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--stellar-body)' }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div className="relative flex justify-center">
          <div
            className="absolute top-0 left-0 w-full h-1/2 rounded-b-[40px]"
            style={{ background: 'var(--stellar-bg-light)' }}
          />
          <Image
            src="/images/home3/phone-mockup.png"
            alt="Mobile app preview"
            width={520}
            height={560}
            className="relative z-10 w-full max-w-[520px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
