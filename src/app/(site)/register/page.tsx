import type { Metadata } from 'next';
import OnboardingWizard from '@/components/register/OnboardingWizard';
import './register.css';

/* Marketing font (Manrope), isti kao na ostatku sajta: display-font.ts. */
import { displayFont } from '../display-font';

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
