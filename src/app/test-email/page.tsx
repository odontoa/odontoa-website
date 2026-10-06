import { notFound } from 'next/navigation';
import TestEmailClient from './TestEmailClient';

/* Interna stranica za proveru Resend forme. Salje prave zahteve na /api/contact i
   /api/demo, pa u produkciji ne sme biti dostupna: tamo vraca 404. Email sistem se ne dira. */
export default function TestEmailPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <TestEmailClient />;
}
