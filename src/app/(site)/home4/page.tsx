import Home4Hero from '@/components/home4/Home4Hero';
// TrustLogos: placeholder logoi iz template-a; proof traka u heroju je zamena.
// import Home4TrustLogos from '@/components/home4/Home4TrustLogos';
import Home4FeatureLeft from '@/components/home4/Home4FeatureLeft';
import Home4FeatureRight from '@/components/home4/Home4FeatureRight';
import Home4BigFeatures from '@/components/home4/Home4BigFeatures';
import Home4KeyFeatures from '@/components/home4/Home4KeyFeatures';
import Home4DigitalReadiness from '@/components/home4/Home4DigitalReadiness';
import Home4Integrations from '@/components/home4/Home4Integrations';
// Testimonials: `Home4Testimonials` - vratiti kada budu pravi korisnici (vidi komentar u Home4Testimonials.tsx).
// import Home4Testimonials from '@/components/home4/Home4Testimonials';
import Home4Blog from '@/components/home4/Home4Blog';
import Home4CTA from '@/components/home4/Home4CTA';
import './home4.css';

export default function Home4Page() {
  return (
    <div className="home4-page min-h-screen bg-white w-full">
      <Home4Hero />
      {/* <Home4TrustLogos /> */}
      <Home4FeatureLeft />
      <Home4FeatureRight />
      <Home4BigFeatures />
      <Home4KeyFeatures />
      <Home4DigitalReadiness />
      <Home4Integrations />
      {/* <Home4Testimonials /> */}
      <Home4Blog />
      <Home4CTA />
    </div>
  );
}
