"use client";

import React from "react";
import { Check, Star, Crown, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle, GooeyFilter } from "@/components/ui/liquid-toggle";

const Home2CustomizedPlan = () => {
  const [billingPeriod, setBillingPeriod] = React.useState<
    "monthly" | "yearly"
  >("monthly");

  const plans = [
    {
      name: "START",
      icon: Star,
      monthlyPrice: 19,
      yearlyPrice: 190,
      description: "Za ordinacije sa 1 stolicom.",
      features: [
        "Stomatologija, ortodoncija, protetika i hirurgija (svi moduli uključeni)",
        "Digitalni kartoni pacijenata i kompletan terapijski plan",
        "Kalendar i online zakazivanje termina",
        "Automatski SMS i email podsetnici pacijenata",
        "OPG/RTG skladište, kliničke fotografije i galerije",
        "Finansijski izveštaji i fakturisanje",
        "Praćenje zaliha i potrošnog materijala",
        "Skladištenje kompletne medicinske dokumentacije i sigurnosne kopije (backup 2× dnevno)",
        "Zaštita podataka u skladu sa GDPR regulativom",
      ],
      limitations: [
        "Preporučeno za 1 stolicu",
        "Neograničen broj pacijenata, doktora i korisnika",
        "Email podrška",
      ],
      buttonText: "Probaj besplatno",
      variant: "outline" as const,
      featured: false,
    },
    {
      name: "GROW",
      icon: Crown,
      monthlyPrice: 35,
      yearlyPrice: 350,
      description: "Za ordinacije sa 2-3 stolice.",
      features: [
        "Sve iz START paketa +",
        "Upravljanje timom i korisničkim dozvolama",
        "Napredna analitika, finansije i detaljni KPI izveštaji",
        "Napredno praćenje zaliha i naručivanje",
        "Interna komunikacija i beleške za tim",
        "Centralizovano upravljanje ordinacijom",
        "Prioritetna podrška",
      ],
      limitations: [
        "2-3 stolice uključene u cenu",
        "Neograničen broj pacijenata i korisnika",
        "Prioritetna email podrška",
      ],
      buttonText: "Probaj besplatno",
      variant: "default" as const,
      featured: true,
      badge: "Najčešći izbor",
    },
    {
      name: "PRO",
      icon: Shield,
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: "Za ordinacije sa 4-5 stolica.",
      features: [
        "Sve iz GROW paketa +",
        "Napredni dashboard sa KPI pokazateljima po stolici i doktoru",
        "Custom izveštaji i dodatne analitičke metrike",
        "Podrška za više lokacija u jednom nalogu",
        "Posvećeni account manager",
      ],
      limitations: [
        "4-5 stolica uključeno u cenu",
        "Neograničen broj pacijenata, doktora i korisnika",
        "Prioritetna podrška + vođeni onboarding",
      ],
      buttonText: "Probaj besplatno",
      variant: "outline" as const,
      featured: false,
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <GooeyFilter />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <div className="inline-flex items-center border rounded px-4 py-1.5 border-[#EEEEEE] font-manrope font-bold text-sm leading-relaxed text-[#3267FF]">
              Odaberite paket prema broju stolica
            </div>
          </div>
          <h2 className="font-manrope font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-[#000A2D] mb-6">
            Tri paketa za svaku ordinaciju
          </h2>
          <p className="text-base leading-relaxed text-[#636571] max-w-2xl mx-auto">
            Sve funkcionalnosti su uključene u svaki paket. Razlikuju se samo u
            broju stolica i nivou podrške.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-semibold font-manrope ${
                billingPeriod === "monthly" ? "text-[#000A2D]" : "text-[#636571]"
              }`}
            >
              Mesečno
            </span>
            <Toggle
              checked={billingPeriod === "yearly"}
              onCheckedChange={(checked) =>
                setBillingPeriod(checked ? "yearly" : "monthly")
              }
              variant="default"
            />
            <span
              className={`text-sm font-semibold font-manrope ${
                billingPeriod === "yearly" ? "text-[#000A2D]" : "text-[#636571]"
              }`}
            >
              Godišnje (-20%)
            </span>
          </div>
          <p className="text-center mt-4 text-sm leading-relaxed text-[#636571]">
            Popust od 20% važi za godišnje plaćanje.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const priceToDisplay =
              billingPeriod === "monthly"
                ? `${plan.monthlyPrice}€`
                : `${plan.yearlyPrice}€`;
            const periodToDisplay =
              billingPeriod === "monthly" ? "/mes" : "/god";
            return (
              <div
                key={index}
                className={`relative bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full ${
                  plan.featured
                    ? "border-2 border-[#3267FF] shadow-lg"
                    : "border border-[#EEEEEE]"
                }`}
              >
                {/* Badge */}
                {plan.featured && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3267FF] text-white px-6 py-1.5 rounded-full z-20 shadow-lg text-sm font-semibold font-manrope leading-tight">
                    {plan.badge}
                  </div>
                )}

                <div className="flex-grow flex flex-col">
                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className="w-5 h-5 text-[#3267FF]" />
                      <h3 className="font-manrope font-bold text-2xl leading-tight text-[#000A2D]">
                        {plan.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-[#636571]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="font-manrope font-extrabold text-4xl leading-none text-[#000A2D]">
                        {priceToDisplay}
                      </span>
                      <span className="text-[#636571] ml-2 text-sm">
                        {periodToDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <Check className="w-4 h-4 text-[#3267FF] mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-sm leading-relaxed text-[#000A2D]">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#EEEEEE]">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start">
                          <Check className="w-4 h-4 text-[#636571] mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-sm leading-relaxed text-[#636571]">
                            {limitation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="mt-auto">
                  <Button
                    variant={plan.featured ? "pillPrimary" : "pillSecondary"}
                    size="pill"
                    className="w-full gap-2"
                  >
                    {plan.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <p className="text-center mt-10 text-sm leading-relaxed text-[#636571]">
          Za 6+ stolica pripremamo individualnu ponudu.
        </p>
      </div>
    </section>
  );
};

export default Home2CustomizedPlan;
