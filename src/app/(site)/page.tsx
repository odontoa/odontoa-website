import NewHeroDesigne2026 from '@/components/hero/NewHeroDesigne2026';
import { Features } from '@/components/ui/features-4';
import { AccordionFeatureSection } from '@/components/ui/accordion-feature-section';
import { VideoDemoPlaceholder } from '@/components/ui/video-demo-placeholder';
// import FeatureWalkthroughV3 from '@/components/home/FeatureWalkthroughV3'; // sakriveno – horizontalni skrol
import PatientRemindersSection from '@/components/marketing/PatientRemindersSection';
import Home2CTA from '@/components/home2/Home2CTA';
import FeaturedBlogsSection from '@/components/FeaturedBlogsSection';
import Home2CustomizedPlan from '@/components/home2/Home2CustomizedPlan';
import Home2FAQ from '@/components/home2/Home2FAQ';
import ComingSoonPage from '@/components/coming-soon/ComingSoonPage';

export default async function HomePage() {
  if (process.env.SITE_MODE === 'coming_soon') {
    return <ComingSoonPage />;
  }
  return (
    <div className="min-h-screen bg-background w-full">
      <NewHeroDesigne2026 />
      <Features />
      <AccordionFeatureSection />
      <VideoDemoPlaceholder />
      {/* Sekcija "Jedno mesto..." sa horizontalnim skrolom – privremeno sakrivena */}
      {/* <FeatureWalkthroughV3 /> */}
      <PatientRemindersSection />
      <Home2CTA />
      <FeaturedBlogsSection />
      <Home2CustomizedPlan />
      <Home2FAQ />
    </div>
  );
}

