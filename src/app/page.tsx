import { ArrowRight, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyCTA } from "@/components/ui/sticky-cta";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AiPresenceSection from "@/components/AiPresenceSection";
import GetStartedSection from "@/components/GetStartedSection";
import FeaturedBlogsSection from "@/components/FeaturedBlogsSection";
import AlternatePricingSection from "@/components/AlternatePricingSection";
import CtaSection from "@/components/CtaSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background w-full">
      <HeroSection />
      <ProblemSolutionSection />
      <TestimonialsSection />
      <GetStartedSection />
      <AiPresenceSection />
      <FeaturedBlogsSection />
      <AlternatePricingSection />
      <CtaSection />
      <StickyCTA />
    </div>
  );
} 