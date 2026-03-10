import { Twitter } from 'lucide-react';

interface Testimonial {
  title: string;
  text: string;
  name: string;
  handle: string;
  social: 'twitter' | 'instagram';
}

const TESTIMONIALS: Testimonial[] = [
  {
    title: 'Incredibly useful product',
    text: "Stellar's user-friendly dashboards have simplified our digital strategy management.",
    name: 'Fig Nelson',
    handle: '@fignel_sooon',
    social: 'twitter',
  },
  {
    title: 'Incredibly useful product',
    text: "Stellar has truly transformed our online presence. With its powerful analytics and seamless integration, we've gained invaluable insights.",
    name: 'Sadie Berlin',
    handle: '@sadiieberlin00',
    social: 'instagram',
  },
  {
    title: 'Incredibly useful product',
    text: "We've gained invaluable insights and improved our SEO ranking, resulting in significant business growth",
    name: 'Amaya Locosta',
    handle: '@amaylocosta',
    social: 'instagram',
  },
  {
    title: 'Incredibly useful product',
    text: "We've gained invaluable insights and improved our SEO ranking, resulting in significant business growth",
    name: 'Sadie Berlin',
    handle: '@sadiieberlin00',
    social: 'twitter',
  },
  {
    title: 'Incredibly useful product',
    text: "Stellar's user-friendly dashboards have simplified our digital strategy management.",
    name: 'Fig Nelson',
    handle: '@fignel_sooon',
    social: 'twitter',
  },
  {
    title: 'Incredibly useful product',
    text: "Stellar's user-friendly dashboards have simplified our digital strategy management.",
    name: 'Sadie Berlin',
    handle: '@sadiieberlin00',
    social: 'instagram',
  },
];

export default function Home3Testimonials() {
  return (
    <section className="home3-testimonials">
      <div className="home3-testimonials__inner">
        {/* Header */}
        <div className="text-center mb-4">
          <p
            className="mb-4 text-xs font-medium"
            style={{ color: 'var(--stellar-accent)' }}
          >
            Our Customers
          </p>
          <h2
            className="text-[58px] leading-[1.1] font-medium tracking-tight"
            style={{ color: 'var(--stellar-heading)' }}
          >
            See what our
            <br />
            customers are saying
          </h2>
        </div>

        {/* Cards grid */}
        <div className="home3-testimonials__grid">
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className="home3-testimonial-card">
              <h3
                className="text-base font-medium mb-3"
                style={{ color: 'var(--stellar-heading)' }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'var(--stellar-body)' }}
              >
                {item.text}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="home3-testimonial-card__avatar" />
                  <div>
                    <p
                      className="text-sm font-normal"
                      style={{ color: 'var(--stellar-heading)' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--stellar-accent)' }}
                    >
                      {item.handle}
                    </p>
                  </div>
                </div>
                {item.social === 'twitter' ? (
                  <Twitter size={18} style={{ color: '#1da1f2' }} />
                ) : (
                  <div
                    className="w-[18px] h-[18px] rounded-full"
                    style={{
                      background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social CTA in the middle of bottom row */}
        <div className="flex justify-center mt-[-60px] mb-4 relative z-10">
          <a
            href="#"
            className="home3-btn-purple text-sm"
          >
            Follow us on Social Media
          </a>
        </div>
      </div>
    </section>
  );
}
