import type { ReactNode } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { displayFont } from '@/app/(site)/display-font';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { isComingSoon, isOpenInComingSoon } from '@/lib/config/site-mode';
/* site.css nosi --stellar-* tokene na .site-page wrapperu; legal.css stilizuje dokument. */
import '@/app/(site)/site.css';
import './legal.css';

/* Pravni dokumenti iz footera, za red "Ostali dokumenti" na dnu stranice. */
const LEGAL_DOCS = [
  { href: '/politika-privatnosti', label: 'Politika privatnosti' },
  { href: '/uslovi-koriscenja', label: 'Uslovi korišćenja' },
  { href: '/gdpr', label: 'GDPR izjava' },
  { href: '/pomoc-i-pravno', label: 'Podrška i uslovi' },
].filter((doc) => !isSectionHidden(doc.href));

interface LegalPageProps {
  /** Putanja trenutne stranice; izbacuje se iz reda "Ostali dokumenti". */
  path: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}

/* Zajednicki okvir za pravne stranice: isti navigacioni chrome, tokeni i font kao pocetna.
   Sadrzaj dokumenata zivi u stranicama i ovde se samo stilizuje (.legal__body). */
export default function LegalPage({ path, eyebrow, title, lead, children }: LegalPageProps) {
  /* Politika je otvorena i u coming-soon rezimu; tada nema linkova ka zatvorenim rutama. */
  const comingSoon = isComingSoon();
  const otherDocs = LEGAL_DOCS.filter(
    (doc) => doc.href !== path && (!comingSoon || isOpenInComingSoon(doc.href)),
  );
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation comingSoon={comingSoon} />
      <main className={`site-page flex-1 ${displayFont.variable}`}>
        <header className="legal__hero">
          <div className="legal__inner">
            <p className="legal__eyebrow">{eyebrow}</p>
            <h1 className="legal__title">{title}</h1>
            <p className="legal__lead">{lead}</p>
          </div>
        </header>

        <div className="legal__content">
          <div className="legal__inner legal__body">{children}</div>

          {otherDocs.length > 0 && (
            <nav className="legal__inner legal__related" aria-label="Ostali dokumenti">
              <p className="legal__related-title">Ostali dokumenti</p>
              <ul>
                {otherDocs.map((doc) => (
                  <li key={doc.href}>
                    <Link href={doc.href}>{doc.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </main>
      <Footer comingSoon={comingSoon} />
    </div>
  );
}
