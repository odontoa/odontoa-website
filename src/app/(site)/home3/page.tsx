import Home3Hero from '@/components/home3/Home3Hero';
import Home3TrustLogos from '@/components/home3/Home3TrustLogos';
import Home3FeatureLeft from '@/components/home3/Home3FeatureLeft';
import Home3FeatureRight from '@/components/home3/Home3FeatureRight';
import Home3BigFeatures from '@/components/home3/Home3BigFeatures';
import Home3KeyFeatures from '@/components/home3/Home3KeyFeatures';
import Home3Integrations from '@/components/home3/Home3Integrations';
import Home3Testimonials from '@/components/home3/Home3Testimonials';
import Home3Blog from '@/components/home3/Home3Blog';
import Home3CTA from '@/components/home3/Home3CTA';
import './home3.css';

export default function Home3Page() {
  return (
    <div className="home3-page min-h-screen bg-white w-full">
      <Home3Hero />
      <Home3TrustLogos />
      <Home3FeatureLeft />
      <Home3FeatureRight />
      <Home3BigFeatures />
      <Home3KeyFeatures />
      <Home3Integrations />
      <Home3Testimonials />
      <Home3Blog />
      <Home3CTA />
    </div>
  );
}
