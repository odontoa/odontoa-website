/* Jedini izvor istine za javni (canonical) host sajta.

   Canonical URL-ovi, sitemap, robots, JSON-LD, Open Graph i llms.txt se grade iz SITE_URL,
   nikad iz rucno ukucanog domena. Produkcija danas servira www (apex -> www na Vercelu),
   pa je to podrazumevana vrednost; NEXT_PUBLIC_SITE_URL je pregazi ako je postavljen.
   NEXT_PUBLIC_ znaci da se vrednost upisuje u build, pa promena env-a trazi novi deploy. */

const DEFAULT_SITE_URL = 'https://www.odontoa.com';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

/** Apsolutni URL za putanju na sajtu. Pocetna je SITE_URL bez kose crte na kraju. */
export function absoluteUrl(path: string = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized === '/' ? SITE_URL : `${SITE_URL}${normalized}`;
}
