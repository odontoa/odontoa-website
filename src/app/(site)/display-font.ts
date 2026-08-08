import { Instrument_Sans } from 'next/font/google';

/**
 * Display font za naslove u home4 estetici.
 *
 * Scoped je na stranice koje ga koriste, root layout se ne dira (zbog home3).
 * Varijabla --font-display dodaje se na .home4-page wrapper, odakle je cita
 * .home4-h2 i naslovi stranica funkcionalnosti.
 *
 * Deljen izmedju pocetne i stranica funkcionalnosti da ne bi postojale dve
 * nezavisne deklaracije istog fonta.
 */
export const displayFont = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
