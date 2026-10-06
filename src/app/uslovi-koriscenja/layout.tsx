import { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Uslovi korišćenja | Odontoa – CRM za stomatološke ordinacije',
  description: 'Pravni okvir korišćenja Odontoa platforme za stomatološke ordinacije u Srbiji i regionu.',
  path: '/uslovi-koriscenja',
})

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

