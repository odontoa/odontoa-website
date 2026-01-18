import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GDPR izjava | Odontoa – CRM za stomatološke ordinacije',
  description: 'GDPR izjava i informacije o obradi podataka u skladu sa Opštom uredbom EU o zaštiti podataka.',
  openGraph: {
    title: 'GDPR izjava | Odontoa – CRM za stomatološke ordinacije',
    description: 'GDPR izjava i informacije o obradi podataka u skladu sa Opštom uredbom EU o zaštiti podataka.',
    type: 'website',
  },
}

export default function GDPRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

