import Image from 'next/image';

interface BlogCard {
  image: string;
  tags: string[];
  title: string;
  description: string;
}

const BLOG_CARDS: BlogCard[] = [
  {
    image: '/images/home3/blog-card-1.png',
    tags: ['Slate', 'Contrux'],
    title: 'The Art of Designing Timeless Masterpieces',
    description:
      'Dive into the realm of limitless creativity as we explore the techniques and inspirations behind crafting visually stunning and timeless designs that captivate hearts and minds.',
  },
  {
    image: '/images/home3/blog-card-2.png',
    tags: ['Slate', 'Contrux'],
    title: 'Stay Ahead of the Curve in the Visual World',
    description:
      'Discover the secrets of designing impactful brand experiences that leave a lasting impression on your audience, forging deep connections and driving brand loyalty.',
  },
  {
    image: '/images/home3/blog-card-3.png',
    tags: ['Slate', 'Contrux'],
    title: 'Crafting Emotionally Engaging User Experiences',
    description:
      "Join us on a journey of exploration as we push the boundaries of design, unveiling cutting-edge concepts and techniques that challenge conventional norms and redefine what's possible.",
  },
];

export default function Home3Blog() {
  return (
    <section className="home3-blog">
      <div className="home3-blog__inner">
        {/* Header */}
        <div className="home3-blog__header">
          <div>
            <p
              className="mb-3 text-sm font-medium"
              style={{ color: 'var(--stellar-accent)' }}
            >
              Our Blog
            </p>
            <h2
              className="text-[44px] leading-[1.1] font-medium tracking-tight"
              style={{ color: 'var(--stellar-heading)' }}
            >
              Blog & Articles
            </h2>
          </div>
          <p
            className="text-base leading-relaxed max-w-[480px]"
            style={{ color: 'var(--stellar-body)' }}
          >
            Unlock the power of data analytics and gain actionable insights to make
            informed business decisions. Enhance your website&apos;s visibility
          </p>
        </div>

        {/* Cards */}
        <div className="home3-blog__grid">
          {BLOG_CARDS.map((card, i) => (
            <div key={i}>
              <div className="home3-blog-card__image">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={336}
                  height={296}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="home3-blog-card__tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="home3-blog-card__tag">{tag}</span>
                ))}
              </div>

              <h3
                className="text-[22px] leading-[1.3] font-medium mb-3"
                style={{ color: 'var(--stellar-heading)' }}
              >
                {card.title}
              </h3>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--stellar-body)' }}
              >
                {card.description}
              </p>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--stellar-heading)' }}
              >
                Read More
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
