import { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Politika privatnosti | Odontoa – CRM za stomatološke ordinacije',
  description: 'Pročitajte kako Odontoa prikuplja, čuva i obrađuje podatke o korisnicima i pacijentima u skladu sa GDPR regulativom.',
  path: '/politika-privatnosti',
})

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

