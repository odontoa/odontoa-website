import Hero from '@/components/homepage/Hero';
// TrustLogos: placeholder logoi iz template-a; proof traka u heroju je zamena.
// import TrustLogos from '@/components/homepage/TrustLogos';
import SystemOverviewSection from '@/components/homepage/SystemOverviewSection';
import WorkflowSection from '@/components/homepage/WorkflowSection';
import FinanceSection from '@/components/homepage/FinanceSection';
import DemoCtaSection from '@/components/homepage/DemoCtaSection';
import AssistantSection from '@/components/homepage/AssistantSection';
import ReadinessQuizSection from '@/components/homepage/ReadinessQuizSection';
import TestimonialQuote from '@/components/homepage/TestimonialQuote';
import PricingSection from '@/components/homepage/PricingSection';
// Testimonials: `TestimonialCards` - vratiti kada budu pravi korisnici (vidi komentar u TestimonialCards.tsx).
// import TestimonialCards from '@/components/homepage/TestimonialCards';
// Blog: `BlogTeaserSection` - privremeno sakriven do content launcha bloga.
// import BlogTeaserSection from '@/components/homepage/BlogTeaserSection';
import ClosingCtaSection from '@/components/homepage/ClosingCtaSection';
import ComingSoonPage from '@/components/coming-soon/ComingSoonPage';
import { displayFont } from './display-font';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { isComingSoon } from '@/lib/config/site-mode';
import { pageMetadata } from '@/lib/seo/metadata';
import { buildPageGraph } from '@/lib/structured-data/page-graph';
import { SOFTWARE_ID } from '@/lib/structured-data/site-entities';
import JsonLd from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import './site.css';

const DESCRIPTION =
  'Softver za stomatološke ordinacije: zakazivanje, karton, RTG, zubna tehnika, dokumentacija i finansije u jednom sistemu.';

/* Pocetna je jedina stranica sa canonical-om "/" (root layout ga namerno nema). */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: isComingSoon()
      ? 'Odontoa je online'
      : 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
    description: DESCRIPTION,
    path: '/',
  });
}

/* Site-wide entiteti (Organization, WebSite) i, u punom rezimu, SoftwareApplication. */
function homeJsonLd(comingSoon: boolean) {
  return buildPageGraph({
    path: '/',
    name: 'Odontoa',
    description: DESCRIPTION,
    includeSoftware: !comingSoon,
    ...(comingSoon ? {} : { pageFields: { about: { '@id': SOFTWARE_ID } } }),
  });
}

export default function HomePage() {
  if (isComingSoon()) {
    return (
      <>
        <JsonLd data={homeJsonLd(true)} />
        <ComingSoonPage />
      </>
    );
  }
  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <JsonLd data={homeJsonLd(false)} />
      <Hero />
      {/* <TrustLogos /> */}
      <SystemOverviewSection />
      <WorkflowSection />
      <FinanceSection />
      <DemoCtaSection />
      <AssistantSection />
      {/* Sekcija vodi na test u Alatima: prikazuje se samo dok Alati nisu sakriveni. */}
      {!isSectionHidden('/alati') && <ReadinessQuizSection />}
      <TestimonialQuote />
      <PricingSection />
      {/* <TestimonialCards /> */}
      {/* <BlogTeaserSection /> */}
      <ClosingCtaSection />
    </div>
  );
}
