import { Manrope } from 'next/font/google';

/**
 * Marketing font sajta: Manrope, za naslove i tekst.
 *
 * Isti subseti i tezine kao Manrope u root layoutu, pa browser preuzima iste fajlove
 * (latin-ext nosi č, ć, ž, š, đ). Varijabla --font-display ide na .site-page wrapper,
 * a navigacija i footer koriste className, jer stoje van tog wrappera.
 *
 * Mockupi aplikacije (hero, funkcionalnosti) namerno ostaju na Inter-u (--font-inter
 * iz root layouta): font prave aplikacije nije potvrdjen.
 */
export const displayFont = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
