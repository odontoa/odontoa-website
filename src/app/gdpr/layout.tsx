import { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'GDPR izjava | Odontoa – CRM za stomatološke ordinacije',
  description: 'GDPR izjava i informacije o obradi podataka u skladu sa Opštom uredbom EU o zaštiti podataka.',
  path: '/gdpr',
})

export default function GDPRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

