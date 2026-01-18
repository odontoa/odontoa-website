import Home2Hero from '@/components/home2/Home2Hero';
import FeatureWalkthroughV3 from '@/components/home/FeatureWalkthroughV3';
import Home2CTA from '@/components/home2/Home2CTA';
import FeaturedBlogsSection from '@/components/FeaturedBlogsSection';
import Home2CustomizedPlan from '@/components/home2/Home2CustomizedPlan';
import Home2FAQ from '@/components/home2/Home2FAQ';

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background w-full">
      <Home2Hero />
      <FeatureWalkthroughV3 />
      <Home2CTA />
      <FeaturedBlogsSection />
      <Home2CustomizedPlan />
      <Home2FAQ />
    </div>
  );
}

