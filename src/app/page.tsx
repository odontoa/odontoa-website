import { ArrowRight, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import DashboardSection from "@/components/DashboardSection";
import MetricsSection from "@/components/MetricsSection";
import FeatureSection from "@/components/FeatureSection";
import AiPresenceSection from "@/components/AiPresenceSection";
import GetStartedSection from "@/components/GetStartedSection";
import AlternatePricingSection from "@/components/AlternatePricingSection";
import CtaSection from "@/components/CtaSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] w-full">
      <HeroSection />
      <DashboardSection />
      <MetricsSection />
      <FeatureSection />
      <GetStartedSection />
      <AiPresenceSection />
      <AlternatePricingSection />
      <CtaSection />
    </div>
  );
} 