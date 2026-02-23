"use client";

import React, { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Cloud, Lock } from "lucide-react";
import { CalendarMockup } from "@/components/CalendarMockup";
import ReminderMockup from "@/components/marketing/ReminderMockup";
import DashboardMockupA from "@/components/DashboardMockupA";
import DashboardMockupB from "@/components/DashboardMockupB";
import OdontogramMockup from "@/components/OdontogramMockup";
import OrtodontskiKartonMockup from "@/components/OrtodontskiKartonMockup";
import IzvestajiMockup from "@/components/IzvestajiMockup";
import { MockupFrame } from "@/components/ui/MockupFrame";

export interface AccordionFeatureItem {
  id: number;
  title: string;
  description: string;
}

interface AccordionFeatureSectionProps {
  features?: AccordionFeatureItem[];
}

const defaultFeatures: AccordionFeatureItem[] = [
  {
    id: 1,
    title: "Kontrolna tabla ordinacije",
    description:
      "Pregled rada ordinacije u realnom vremenu: termini, pacijenti, tim i statusi poseta, uz brze akcije na dohvat ruke.",
  },
  {
    id: 2,
    title: "Dnevni tok rada",
    description:
      "Jasan pregled termina i statusa poseta u realnom vremenu. Svaka promena se beleži automatski, pa su raspored i evidencija uvek usklađeni.",
  },
  {
    id: 3,
    title: "Kalendar",
    description:
      "Sve u jednom rasporedu: ko radi, kada radi i koliko je dan popunjen. Termini se lako pomeraju, a promene su odmah vidljive svima.",
  },
  {
    id: 4,
    title: "SMS + email podsetnici",
    description:
      "Manje propuštenih termina i manje praznina u rasporedu. Podsetnici se šalju automatski i ostaju zabeleženi u istoriji aktivnosti.",
  },
  {
    id: 5,
    title: "Odontogram",
    description:
      "Statusi i terapije po zubu su jasno označeni na jednom mestu. Za par sekundi vidite stanje i naredni korak, bez listanja kartona.",
  },
  {
    id: 6,
    title: "Ortodontski karton",
    description:
      "Od prve procene do poslednje kontrole, sve je u istom kartonu i u istom toku.",
  },
  {
    id: 7,
    title: "Finansije",
    description:
      "Računi, rate i uplate na jednom mestu, sa jasnim statusima naplate. Brz pregled prihoda i dugovanja, bez ručnog praćenja.",
  },
  {
    id: 8,
    title: "Podaci zaštićeni, uvek dostupni",
    description:
      "Podaci se čuvaju u cloud-u uz automatske rezervne kopije i siguran pristup, kada god zatreba.",
  },
];

/**
 * Renders the appropriate mockup inside a MockupFrame for each feature ID.
 * Phase A: all scale/transform hacks removed. Mockup content may clip until Phase B redesigns.
 * Phase B: each mockup component is redesigned to look sharp at natural frame width (350–680px).
 */
function FeatureMockupById({ featureId }: { featureId: number }) {
  switch (featureId) {
    case 1:
      return (
        <MockupFrame>
          <DashboardMockupA />
        </MockupFrame>
      );
    case 2:
      return (
        <MockupFrame>
          <DashboardMockupB />
        </MockupFrame>
      );
    case 3:
      return (
        <MockupFrame>
          <CalendarMockup size="wide" />
        </MockupFrame>
      );
    case 4:
      return (
        <MockupFrame>
          <ReminderMockup compact={true} />
        </MockupFrame>
      );
    case 5:
      return (
        <MockupFrame>
          <OdontogramMockup />
        </MockupFrame>
      );
    case 6:
      return (
        <MockupFrame>
          <OrtodontskiKartonMockup />
        </MockupFrame>
      );
    case 7:
      return (
        <MockupFrame>
          <IzvestajiMockup />
        </MockupFrame>
      );
    case 8:
      return (
        <MockupFrame>
          <div className="h-full flex flex-col" style={{ background: '#EEF0F8' }}>
            {/* Header */}
            <header
              className="flex-shrink-0 bg-white flex items-center justify-between px-3"
              style={{ height: 30, borderBottom: '1px solid #F1F5F9' }}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: '#1B2B6B' }}>
                  <Shield className="h-2.5 w-2.5 text-white" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-900 leading-tight">Sigurnost i backup</div>
                  <div className="text-[6px] text-slate-400 leading-tight">Status sistema</div>
                </div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[6px] font-medium text-emerald-700">Zaštićeno</span>
              </div>
            </header>
            {/* Content */}
            <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-0 overflow-hidden">
              {/* 3 feature cards */}
              <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
                {[
                  { Icon: Lock,   label: 'Enkripcija', desc: 'AES-256 bit',     bg: '#3B82F6' },
                  { Icon: Cloud,  label: 'Cloud backup', desc: 'Automatski',     bg: '#10B981' },
                  { Icon: Shield, label: 'Pristup',    desc: 'Kontrola uloga',  bg: '#8B5CF6' },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-lg p-2 flex flex-col items-center text-center" style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
                    <div className="h-6 w-6 rounded-lg flex items-center justify-center mb-1" style={{ background: card.bg }}>
                      <card.Icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-[7px] font-semibold text-slate-900">{card.label}</span>
                    <span className="text-[5.5px] text-slate-400">{card.desc}</span>
                  </div>
                ))}
              </div>
              {/* Status list */}
              <div className="bg-white rounded-lg flex-1 min-h-0 flex flex-col overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
                <div className="flex items-center justify-between px-2 pt-1.5 pb-1 flex-shrink-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <span className="text-[8px] font-bold text-slate-900">Status zaštite</span>
                  <span className="text-[6px] font-medium text-blue-600">Detalji</span>
                </div>
                <div className="flex flex-col">
                  {[
                    { label: 'SSL/TLS sertifikat',         status: 'Aktivan'   },
                    { label: 'Poslednji backup',           status: 'Pre 2h'    },
                    { label: 'Dvofaktorska autentikacija', status: 'Uključena' },
                    { label: 'GDPR usklađenost',           status: 'Potvrđeno' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between px-2 py-1.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <span className="text-[6.5px] text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span className="text-[6px] font-medium text-emerald-700">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MockupFrame>
      );
    default:
      return null;
  }
}

function AccordionFeatureSection({ features = defaultFeatures }: AccordionFeatureSectionProps) {
  const [activeTabId, setActiveTabId] = useState<number>(features[0]?.id ?? 1);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
            Kako izgleda rad u praksi
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Sve što vam treba za dnevni rad: pacijenti, termini, terapije, dokumenti i uvid u performanse.
          </p>
        </div>

        <div className="flex w-full flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* Accordion list */}
          <div className="w-full md:w-1/2 shrink-0">
            <Accordion
              type="single"
              className="w-full space-y-3"
              value={`item-${activeTabId}`}
              onValueChange={(v) => {
                const id = v ? Number(v.replace("item-", "")) : activeTabId;
                if (id) setActiveTabId(id);
              }}
            >
              {features.map((tab) => (
                <AccordionItem
                  key={tab.id}
                  value={`item-${tab.id}`}
                  className="border-b-0 rounded-xl border border-border bg-card px-4 shadow-sm transition-colors hover:bg-muted/30 data-[state=open]:border-primary/20 data-[state=open]:bg-muted/20 data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="cursor-pointer py-4 !no-underline transition text-left hover:no-underline">
                    <h6
                      className={`text-lg md:text-xl font-semibold leading-tight ${
                        tab.id === activeTabId ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {tab.description}
                    </p>
                    {/* Mobile preview — MockupFrame handles sizing, no outer wrapper needed */}
                    <div className="mt-4 md:hidden">
                      <FeatureMockupById featureId={tab.id} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Desktop preview panel — sticky so it stays visible while scrolling the accordion */}
          <div className="hidden w-full shrink-0 self-start md:sticky md:top-8 md:block md:w-1/2">
            <FeatureMockupById featureId={activeTabId} />
          </div>
        </div>
      </div>
    </section>
  );
}

export { AccordionFeatureSection };
