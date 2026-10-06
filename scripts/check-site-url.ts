/* npm run check:site-url (deo prebuild-a)
   Na Vercel produkciji canonical host mora biti onaj na kome sajt stvarno odgovara bez
   redirekta. Danas je to www (apex -> www na Vercelu). Ako je NEXT_PUBLIC_SITE_URL postavljen
   na drugi host, svi canonical-i, sitemap, JSON-LD i llms.txt bi pokazivali na URL koji
   preusmerava, pa build namerno pada.

   Namerni prelazak na apex: promeni Vercel Domain podesavanja (www -> apex), postavi
   NEXT_PUBLIC_SITE_URL=https://odontoa.com i izmeni EXPECTED_PRODUCTION_HOST ispod. */
import { SITE_URL } from '@/lib/config/site-url';

const EXPECTED_PRODUCTION_HOST = 'www.odontoa.com';

const host = new URL(SITE_URL).host;
if (process.env.VERCEL_ENV === 'production' && host !== EXPECTED_PRODUCTION_HOST) {
  console.error(
    `\nSITE_URL je ${SITE_URL}, a produkcioni canonical host je ${EXPECTED_PRODUCTION_HOST}.\n` +
      'Postavi NEXT_PUBLIC_SITE_URL=https://www.odontoa.com u Vercel Production env (ili ga ukloni).\n',
  );
  process.exit(1);
}
console.log(`Canonical host: ${SITE_URL}`);
