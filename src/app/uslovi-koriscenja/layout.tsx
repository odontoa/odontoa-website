import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Uslovi korišćenja | Odontoa – CRM za stomatološke ordinacije',
  description: 'Pravni okvir korišćenja Odontoa platforme za stomatološke ordinacije u Srbiji i regionu.',
  openGraph: {
    title: 'Uslovi korišćenja | Odontoa – CRM za stomatološke ordinacije',
    description: 'Pravni okvir korišćenja Odontoa platforme za stomatološke ordinacije u Srbiji i regionu.',
    type: 'website',
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

