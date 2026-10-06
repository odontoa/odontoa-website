/* Coming-soon rezim (SITE_MODE=coming_soon): javni sajt stoji na Welcome stranici, a
   middleware sve ostale rute vraca na "/". Kad se SITE_MODE ukloni, sve ispod se samo gasi:
   puni sitemap, llms.txt, navigacija i footer se vracaju bez izmene koda. */

/* Samo na serveru: SITE_MODE nije NEXT_PUBLIC varijabla, pa klijentske komponente
   (Navigation, Footer) dobijaju rezultat kao prop od serverskog roditelja. */
export function isComingSoon(): boolean {
  return process.env.SITE_MODE === 'coming_soon';
}

/* Stranice dostupne u coming-soon rezimu. Mora da prati allowlist u src/middleware.ts. */
export const COMING_SOON_OPEN_PAGES = ['/', '/kontakt', '/politika-privatnosti'] as const;

export function isOpenInComingSoon(href: string): boolean {
  return (COMING_SOON_OPEN_PAGES as readonly string[]).includes(href);
}
