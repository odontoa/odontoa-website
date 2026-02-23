import HeroV2 from '@/components/hero/HeroV2';
import { Features } from '@/components/ui/features-4';
import { AccordionFeatureSection } from '@/components/ui/accordion-feature-section';
import { VideoDemoPlaceholder } from '@/components/ui/video-demo-placeholder';
import PatientRemindersSection from '@/components/marketing/PatientRemindersSection';
import Home2CTA from '@/components/home2/Home2CTA';
import FeaturedBlogsSection from '@/components/FeaturedBlogsSection';
import Home2CustomizedPlan from '@/components/home2/Home2CustomizedPlan';
import Home2FAQ from '@/components/home2/Home2FAQ';

export default async function Home2Page() {
  return (
    <div className="min-h-screen bg-background w-full">
      <HeroV2 />
      <Features />
      <AccordionFeatureSection />
      <VideoDemoPlaceholder />
      <PatientRemindersSection />
      <Home2CTA />
      <FeaturedBlogsSection />
      <Home2CustomizedPlan />
      <Home2FAQ />
    </div>
  );
}
