import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import OnboardingWizard from '@/components/register/OnboardingWizard';
import './register.css';

/* Display font za naslove, scoped na ovu stranicu (isto kao home4). */
const displayFont = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const TITLE = 'Započni besplatno | Odontoa';
const DESCRIPTION =
  'Podesi svoju ordinaciju u Odontoi za par minuta. Popuni osnovne podatke, radno vreme i kontakt, a mi preuzimamo uvoz pacijenata.';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://odontoa.com';
  const url = `${baseUrl}/register`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function RegisterPage() {
  return (
    <div className={`register-page ${displayFont.variable}`}>
      <OnboardingWizard />
    </div>
  );
}
