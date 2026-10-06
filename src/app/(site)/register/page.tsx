import type { Metadata } from 'next';
import OnboardingWizard from '@/components/register/OnboardingWizard';
import { pageMetadata } from '@/lib/seo/metadata';
import './register.css';

/* Marketing font (Manrope), isti kao na ostatku sajta: display-font.ts. */
import { displayFont } from '../display-font';

const TITLE = 'Započni besplatno | Odontoa';
const DESCRIPTION =
  'Podesi svoju ordinaciju u Odontoi za par minuta. Popuni osnovne podatke, radno vreme i kontakt, a mi preuzimamo uvoz pacijenata.';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/register' });
}

export default function RegisterPage() {
  return (
    <div className={`register-page ${displayFont.variable}`}>
      <OnboardingWizard />
    </div>
  );
}
