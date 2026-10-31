import { Urbanist } from 'next/font/google';

/**
 * Font Odontoa aplikacije (Urbanist). Koristi ga samo nacrtani ekran aplikacije u hero
 * vizualu (HeroDashboard), da izgleda kao pravi screenshot; ostatak sajta ga ne ucitava.
 */
export const appFont = Urbanist({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
