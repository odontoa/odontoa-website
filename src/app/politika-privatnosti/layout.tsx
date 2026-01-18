import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politika privatnosti | Odontoa – CRM za stomatološke ordinacije',
  description: 'Pročitajte kako Odontoa prikuplja, čuva i obrađuje podatke o korisnicima i pacijentima u skladu sa GDPR regulativom.',
  openGraph: {
    title: 'Politika privatnosti | Odontoa – CRM za stomatološke ordinacije',
    description: 'Pročitajte kako Odontoa prikuplja, čuva i obrađuje podatke o korisnicima i pacijentima u skladu sa GDPR regulativom.',
    type: 'website',
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

