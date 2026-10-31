'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  CONSENT_OPEN_EVENT,
  CONSENT_UI_ENABLED,
  GA_MEASUREMENT_ID,
  clearGaCookies,
  readConsent,
  writeConsent,
  type ConsentStatus,
} from '@/lib/analytics/consent';

/* Bez Google Signals i bez personalizacije oglasa, u oba rezima. Nema user_id-a. */
const GA_CONFIG = `{ allow_google_signals: false, allow_ad_personalization_signals: false }`;

/*
  Google Analytics. Bez NEXT_PUBLIC_GA_MEASUREMENT_ID nema ni GA ni consent UI-ja.
  Rezim bira NEXT_PUBLIC_COOKIE_CONSENT_ENABLED (src/lib/analytics/consent.ts).
*/
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return CONSENT_UI_ENABLED ? <ConsentAnalytics /> : <CookielessAnalytics />;
}

/*
  Trenutni rezim: nema consent UI-ja, GA radi cookieless. Consent Mode default (sve
  "denied") ide u dataLayer PRE js/config poziva, pa GA salje samo pingove bez kolacica:
  nema _ga/_ga_*, nema ad kolacica. Inline skripta je ispred gtag.js, a gtag.js ionako
  obradjuje dataLayer redom.
*/
function CookielessAnalytics() {
  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', ${GA_CONFIG});
        `}
      </Script>
      <Script
        id="google-analytics-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}

/*
  Rezim za kasnije (NEXT_PUBLIC_COOKIE_CONSENT_ENABLED=true): strict opt-in.
  - GA skripta se renderuje tek kad je pristanak "accepted"; do tada nema zahteva ka
    Google-u ni _ga kolacica.
  - "Odbij" posle ranijeg "Prihvati": GA se gasi za ostatak posete (ga-disable zastavica,
    window.gtag = undefined) i brisu se _ga kolacici sa naseg domena.
  Banner je traka pri dnu ekrana, ne modal; stilovi su Tailwind klase jer se ova
  komponenta renderuje na svim rutama (site.css nije svuda ucitan).
*/
function ConsentAnalytics() {
  /* undefined = jos nije procitano (pre hidracije); null = nema izbora */
  const [consent, setConsent] = useState<ConsentStatus | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const stored = readConsent();
    setConsent(stored);
    setOpen(stored === null);

    const reopen = () => {
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  /* Otvoreno iz footera: fokus na traku, da tastatura i citac ekrana stignu do izbora. */
  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      bannerRef.current?.focus();
    }
  }, [open]);

  const choose = useCallback((status: ConsentStatus) => {
    writeConsent(status);
    const w = window as unknown as Record<string, unknown>;
    if (status === 'rejected') {
      clearGaCookies();
      w[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
      /* GA definise gtag kao globalnu funkciju (ne moze da se obrise): postavlja se na
         undefined, pa trackEvent dalje nista ne salje. */
      w.gtag = undefined;
    } else {
      w[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      /* Ponovni pristanak u istoj poseti: skripta je vec ucitana i next/script je ne
         pokrece ponovo, pa se vraca gtag nad postojecim dataLayer-om. */
      if (!w.gtag && Array.isArray(w.dataLayer)) {
        const dataLayer = w.dataLayer as unknown[];
        w.gtag = function gtag() {
          // eslint-disable-next-line prefer-rest-params
          dataLayer.push(arguments);
        };
      }
    }
    setConsent(status);
    setOpen(false);
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            id="google-analytics-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', ${GA_CONFIG});
            `}
          </Script>
        </>
      )}

      {open && (
        <div
          ref={bannerRef}
          tabIndex={-1}
          role="region"
          aria-label="Podešavanja kolačića"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-[720px] flex-col gap-3 rounded-[14px] border border-[#e3e6ee] bg-white p-4 shadow-[0_1px_2px_rgba(6,11,19,0.04),0_18px_40px_-20px_rgba(6,11,19,0.22)] outline-none sm:inset-x-6 sm:bottom-5 sm:flex-row sm:items-center sm:gap-6 sm:px-5"
        >
          <p className="m-0 flex-1 text-[13.5px] leading-[1.55] text-[#363d4f]">
            Koristimo analitičke kolačiće (Google Analytics) da vidimo kako se sajt koristi.
            Uključujemo ih samo uz tvoj pristanak.{' '}
            <Link
              href="/politika-privatnosti"
              className="whitespace-nowrap font-medium text-[#6e51e0] underline-offset-2 hover:underline"
            >
              Politika privatnosti
            </Link>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => choose('rejected')}
              className="h-10 flex-1 rounded-full border border-[#d9dce5] bg-white px-5 text-[13.5px] font-semibold text-[#060b13] transition-colors hover:border-[#b9bfce] hover:bg-[#f7f8fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e51e0] sm:flex-none sm:min-w-[104px]"
            >
              Odbij
            </button>
            <button
              type="button"
              onClick={() => choose('accepted')}
              className="h-10 flex-1 rounded-full border border-[#6e51e0] bg-[#6e51e0] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#5a3ec7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e51e0] sm:flex-none sm:min-w-[104px]"
            >
              Prihvati
            </button>
          </div>
        </div>
      )}
    </>
  );
}
