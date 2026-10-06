import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { isComingSoon } from '@/lib/config/site-mode';
import { displayFont } from '@/app/(site)/display-font';
/* site.css nosi --stellar-* tokene na .site-page wrapperu i stilove dugmadi. */
import '@/app/(site)/site.css';
import './not-found.css';

/* Prikazuje se za nepostojece URL-ove i za privremeno sakrivene sekcije (middleware ih
   rewrite-uje na nepostojecu putanju). Status ostaje 404. */
export default function NotFound() {
  /* Isti navbar kao na svim javnim stranicama, umesto zasebnog logoa. U coming-soon
     rezimu bez linkova ka zatvorenim rutama (i bez dugmeta ka funkcionalnostima). */
  const comingSoon = isComingSoon();
  return (
    <>
      <Navigation comingSoon={comingSoon} />
      <main className={`site-page not-found ${displayFont.variable}`}>
        <div className="not-found__body">
          <p className="not-found__code">404</p>
          <h1 className="not-found__title">Ova stranica trenutno nije dostupna.</h1>
          <p className="not-found__lead">
            Stranica koju tražiš možda je uklonjena, premeštena ili još nije objavljena.
          </p>
          <div className="not-found__actions">
            <Link href="/" className="btn-cta">
              Nazad na početnu
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            {!comingSoon && (
              <Link href="/funkcionalnosti" className="hero__link">
                Pogledaj funkcionalnosti
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
