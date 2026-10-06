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
import './site.css';

export default function HomePage() {
  if (process.env.SITE_MODE === 'coming_soon') {
    return <ComingSoonPage />;
  }
  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
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
