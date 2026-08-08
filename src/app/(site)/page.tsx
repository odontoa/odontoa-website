import Home4Hero from '@/components/home4/Home4Hero';
// TrustLogos: placeholder logoi iz template-a; proof traka u heroju je zamena.
// import Home4TrustLogos from '@/components/home4/Home4TrustLogos';
import Home4FeatureLeft from '@/components/home4/Home4FeatureLeft';
import Home4BigFeatures from '@/components/home4/Home4BigFeatures';
import Home4Finance from '@/components/home4/Home4Finance';
import Home4FeatureRight from '@/components/home4/Home4FeatureRight';
import Home4Assistant from '@/components/home4/Home4Assistant';
import Home4DigitalReadiness from '@/components/home4/Home4DigitalReadiness';
import Home4Quote from '@/components/home4/Home4Quote';
import Home4Pricing from '@/components/home4/Home4Pricing';
// Testimonials: `Home4Testimonials` - vratiti kada budu pravi korisnici (vidi komentar u Home4Testimonials.tsx).
// import Home4Testimonials from '@/components/home4/Home4Testimonials';
import Home4Blog from '@/components/home4/Home4Blog';
import Home4CTA from '@/components/home4/Home4CTA';
import ComingSoonPage from '@/components/coming-soon/ComingSoonPage';
import { displayFont } from './display-font';
import './home4.css';

export default function HomePage() {
  if (process.env.SITE_MODE === 'coming_soon') {
    return <ComingSoonPage />;
  }
  return (
    <div className={`home4-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <Home4Hero />
      {/* <Home4TrustLogos /> */}
      <Home4FeatureLeft />
      <Home4BigFeatures />
      <Home4Finance />
      <Home4FeatureRight />
      <Home4Assistant />
      <Home4DigitalReadiness />
      <Home4Quote />
      <Home4Pricing />
      {/* <Home4Testimonials /> */}
      <Home4Blog />
      <Home4CTA />
    </div>
  );
}
