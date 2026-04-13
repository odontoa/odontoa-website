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
    tags: ['Vodič'],
    title: 'Kako digitalizovati ordinaciju u 5 koraka',
    description:
      'Praktičan vodič za prelazak sa papira na digitalni sistem — bez stresa i bez zastoja u radu.',
  },
  {
    image: '/images/home3/blog-card-2.png',
    tags: ['Organizacija'],
    title: 'Zašto ordinacije gube pacijente bez podsetnika',
    description:
      'Propušteni termini koštaju. Evo kako automatski podsetnici menjaju sliku.',
  },
  {
    image: '/images/home3/blog-card-3.png',
    tags: ['Saveti'],
    title: 'Šta treba znati pre izbora softvera za ordinaciju',
    description:
      'Na šta obratiti pažnju, koja pitanja postaviti i kako izbeći česte greške.',
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
              Blog
            </p>
            <h2
              className="text-[44px] leading-[1.1] font-medium tracking-tight"
              style={{ color: 'var(--stellar-heading)' }}
            >
              Saveti za modernu ordinaciju
            </h2>
          </div>
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
                Pročitaj više
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
