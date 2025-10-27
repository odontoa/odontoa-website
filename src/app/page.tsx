import { ArrowRight, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyCTA } from "@/components/ui/sticky-cta";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import ExpandableCardsSection from "@/components/ExpandableCardsSection";
import { OdontoaCompareTable } from "@/app/(site)/components/CompareProblems";
import TestimonialsSection from "@/components/TestimonialsSection";
import AiPresenceSection from "@/components/AiPresenceSection";
import GetStartedSection from "@/components/GetStartedSection";
import FeaturedBlogsSection from "@/components/FeaturedBlogsSection";
import AlternatePricingSection from "@/components/AlternatePricingSection";
import CtaSection from "@/components/CtaSection";

export default function HomePage() {
  const columns = ['Odontoa', 'Ručno (Papir/Excel)', 'Više odvojenih alata'];
  const rows = [
    { feature: 'Automatski SMS/Email podsetnici', values: [true, false, false] },
    { feature: 'Zakazivanje u par klikova',        values: [true, false, true]  },
    { feature: 'Digitalni kartoni + brza pretraga',values: [true, false, false] },
    { feature: 'Centralizovana komunikacija',      values: [true, false, false] },
    { feature: 'Praćenje zaliha i upozorenja',     values: [true, false, false] },
    { feature: 'Analitika i finansijski pregled',  values: [true, false, false] },
    { feature: 'Implementacija 1–3 dana',          values: [true, false, false] },
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      <HeroSection />
      <ProblemSolutionSection />
      <ExpandableCardsSection />
      <OdontoaCompareTable
        title="Prepoznajete li ove probleme? – 2"
        columns={columns}
        rows={rows}
        emphasizeIndex={0}
      />
      <TestimonialsSection />
      <GetStartedSection />
      <AiPresenceSection />
      <FeaturedBlogsSection />
      <AlternatePricingSection />
      <CtaSection />
      <StickyCTA />
    </div>
  );
} // Test deployment access
