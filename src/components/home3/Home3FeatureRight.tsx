import Image from 'next/image';

export default function Home3FeatureRight() {
  return (
    <section className="home3-feature-right">
      <div className="home3-feature-right__circle" />
      <div className="home3-feature-right__inner">
        {/* Illustrations */}
        <div className="home3-feature-right__illustrations">
          <div
            className="home3-feature__illustration"
            style={{ top: 0, left: 0, width: 280, height: 208 }}
          >
            <Image
              src="/images/home3/feature-right-stock.png"
              alt="Stock details"
              width={280}
              height={208}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div
            className="home3-feature__illustration"
            style={{ bottom: 20, left: 0, width: 384, height: 256 }}
          >
            <Image
              src="/images/home3/feature-right-chart.png"
              alt="Fleet tonnage"
              width={384}
              height={256}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Text */}
        <div>
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: 'var(--stellar-accent)' }}
          >
            Get Started
          </p>
          <h2
            className="text-[44px] leading-[1.15] font-medium tracking-tight mb-6"
            style={{ color: 'var(--stellar-white)' }}
          >
            Start your Stellar
            <br />
            journey here.
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--stellar-body)' }}
          >
            Unlock the power of data analytics and gain actionable insights to
            make informed business decisions.
          </p>

          <div className="flex flex-col gap-4">
            <div className="home3-cta__form">
              <input
                type="email"
                placeholder="name@email.com"
                className="home3-cta__input"
              />
              <button className="home3-btn-purple whitespace-nowrap">Subscribe</button>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--stellar-muted)' }}
            >
              14 day trial – No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
