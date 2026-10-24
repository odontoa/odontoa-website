/* Coming-soon rezim (SITE_MODE=coming_soon): javni sajt stoji na Welcome stranici, a
   middleware sve ostale rute vraca na "/". Kad se SITE_MODE ukloni, sve ispod se samo gasi:
   puni sitemap, llms.txt, navigacija i footer se vracaju bez izmene koda. */

/* Samo na serveru: SITE_MODE nije NEXT_PUBLIC varijabla, pa klijentske komponente
   (Navigation, Footer) dobijaju rezultat kao prop od serverskog roditelja. */
export function isComingSoon(): boolean {
  return process.env.SITE_MODE === 'coming_soon';
}

/* Javne stranice dostupne u coming-soon rezimu. Middleware, sitemap, navigacija i footer
   citaju odavde (skrivene stranice su u COMING_SOON_UNLISTED_PAGES ispod). */
export const COMING_SOON_OPEN_PAGES = ['/', '/kontakt', '/politika-privatnosti'] as const;

/* Skrivene stranice (noindex, samo direktan URL ili QR) koje rade i u coming-soon rezimu.
   Citaju se SAMO u isPathAllowedInComingSoon (middleware), nikad u isOpenInComingSoon,
   pa ne ulaze u sitemap, navigaciju ni footer. */
const COMING_SOON_UNLISTED_PAGES = ['/klub100'] as const;

/* Tehnicke putanje koje moraju da rade i u coming-soon rezimu (asseti, SEO fajlovi). */
const COMING_SOON_OPEN_PREFIXES = ['/api', '/_next', '/images', '/assets'] as const;
const COMING_SOON_OPEN_FILES = ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/llms.txt'] as const;

export function isOpenInComingSoon(href: string): boolean {
  return (COMING_SOON_OPEN_PAGES as readonly string[]).includes(href);
}

/** Za middleware: da li zahtev za `pathname` sme da prodje u coming-soon rezimu. */
export function isPathAllowedInComingSoon(pathname: string): boolean {
  return (
    isOpenInComingSoon(pathname) ||
    (COMING_SOON_UNLISTED_PAGES as readonly string[]).includes(pathname) ||
    (COMING_SOON_OPEN_FILES as readonly string[]).includes(pathname) ||
    COMING_SOON_OPEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}
