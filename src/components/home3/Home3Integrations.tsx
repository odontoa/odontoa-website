import { Cloud, Facebook, Instagram, Twitter, Figma, Bell, Pen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface IntegrationIcon {
  icon: LucideIcon;
  color: string;
  center?: boolean;
}

const ICONS: IntegrationIcon[] = [
  { icon: Figma, color: '#f24e1e' },
  { icon: Pen, color: '#ffeb3b' },
  { icon: Twitter, color: '#1da1f2' },
  { icon: Instagram, color: '#e1306c' },
  { icon: Pen, color: '#222' },
  { icon: Cloud, color: '#6e51e0', center: true },
  { icon: Facebook, color: '#1877f2' },
  { icon: Pen, color: '#e1306c' },
  { icon: Figma, color: '#0acf83' },
  { icon: Pen, color: '#ff6b35' },
  { icon: Bell, color: '#ffb800' },
];

export default function Home3Integrations() {
  return (
    <section className="home3-integrations">
      <div className="home3-integrations__inner">
        <p
          className="mb-4 text-sm font-medium"
          style={{ color: 'var(--stellar-accent)' }}
        >
          Our Primary Integrations
        </p>
        <h2
          className="text-[44px] leading-[1.15] font-medium tracking-tight"
          style={{ color: 'var(--stellar-white)' }}
        >
          Make productivity easier
          <br />
          with{' '}
          <span style={{ color: 'var(--stellar-accent)' }}>50+ Integrations</span>
        </h2>

        <div className="home3-integrations__grid">
          <div className="home3-integrations__noise" />
          {/* Row 1: 5 icons */}
          <div className="flex items-center justify-center gap-8 w-full">
            {ICONS.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className={`home3-integrations__icon ${item.center ? 'home3-integrations__icon--center' : ''}`}
              >
                <item.icon size={item.center ? 40 : 28} style={{ color: item.color }} />
              </div>
            ))}
          </div>
          {/* Row 2: center icon + 2 */}
          <div className="flex items-center justify-center gap-8 w-full">
            {ICONS.slice(5, 8).map((item, i) => (
              <div
                key={i}
                className={`home3-integrations__icon ${item.center ? 'home3-integrations__icon--center' : ''}`}
              >
                <item.icon size={item.center ? 40 : 28} style={{ color: item.color }} />
              </div>
            ))}
          </div>
          {/* Row 3: 3 icons */}
          <div className="flex items-center justify-center gap-8 w-full">
            {ICONS.slice(8).map((item, i) => (
              <div
                key={i}
                className="home3-integrations__icon"
              >
                <item.icon size={28} style={{ color: item.color }} />
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: 'var(--stellar-body)' }}
        >
          Gain a competitive edge with our SEO optimization tools, ensuring your website
          <br />
          ranks higher, attracts more visitors, and generates leads like never before.
        </p>

        <a href="#" className="home3-btn-purple">
          See Integrations
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
