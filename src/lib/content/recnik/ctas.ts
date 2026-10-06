import type { RecnikCtaId } from './types';

/* Zavrsni CTA na stranici pojma. Tekstovi su postojeci copy sa sajta (rečnik i /demo);
   pojam bira CTA preko links.ctaId, podrazumevano "default". */
export type RecnikCta = {
  id: RecnikCtaId;
  title: string;
  lead: string;
  primary: { label: string; href: string };
};

export const RECNIK_CTAS: Record<RecnikCtaId, RecnikCta> = {
  default: {
    id: 'default',
    title: 'Vodite ordinaciju bez papira',
    lead: 'Zakazivanje, digitalni karton, RTG snimci i finansije, sve u jednom sistemu.',
    primary: { label: 'Započni besplatno', href: '/register' },
  },
  demo: {
    id: 'demo',
    title: 'Prođi kroz Odontou sa nama za 15 minuta.',
    lead: 'Zakazivanje, karton i finansije na primeru tvoje ordinacije.',
    primary: { label: 'Zakaži demo', href: '/demo' },
  },
};
