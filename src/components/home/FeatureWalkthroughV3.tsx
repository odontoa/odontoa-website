'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { CalendarMockup } from '@/components/CalendarMockup';
import ReminderMockup from '@/components/marketing/ReminderMockup';
import DashboardMockupA from '@/components/DashboardMockupA';
import DashboardMockupB from '@/components/DashboardMockupB';
import OdontogramMockup from '@/components/OdontogramMockup';
import OrtodontskiKartonMockup from '@/components/OrtodontskiKartonMockup';
import IzvestajiMockup from '@/components/IzvestajiMockup';

// Hook za scroll animacije sa Intersection Observer
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isVisible };
}

// Wrapper za skaliranje kalendara bez deformacije
function ScaledCalendarMock({
  scale = 0.663,
}: {
  scale?: number;
}) {
  const inv = 1 / scale;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ clipPath: 'inset(0 0 15% 0)' }}>
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `calc(100% * ${inv})`,
          height: `calc(100% * ${inv})`,
        }}
      >
        <CalendarMockup size="wide" />
      </div>
    </div>
  );
}

// Wrapper za skaliranje dashboard mockup-a bez sečenja
function ScaledDashboardMock({
  children,
  scale = 0.52,
  transformOrigin = 'top left',
}: {
  children: React.ReactNode;
  scale?: number;
  transformOrigin?: string;
}) {
  const inv = 1 / scale;

  return (
    <div className="relative w-full overflow-visible">
      <div
        className="relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: transformOrigin,
          width: `calc(100% * ${inv})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Komponenta za animirani feature blok
function AnimatedFeatureBlock({ 
  feature, 
  index, 
  shouldReverse 
}: { 
  feature: {
    id: string;
    title: string;
    bullets: string[];
    description: string;
    imagePosition: 'left' | 'right';
  };
  index: number;
  shouldReverse: boolean;
}) {
  const { ref, isVisible } = useScrollAnimation();

  // Special grid layout for dashboard features
  const isDashboardFeature = feature.id === 'funkcija-dashboard-overview' || feature.id === 'funkcija-daily-operations';
  const isReversed = feature.id === 'funkcija-daily-operations';
  
  if (isDashboardFeature) {
    return (
      <div
        ref={ref}
        id={feature.id}
        className={`grid grid-cols-1 gap-12 lg:gap-16 lg:items-stretch ${
          isReversed ? 'lg:grid-cols-[65%_35%]' : 'lg:grid-cols-[35%_65%]'
        }`}
      >
          {/* Text Content - visina kolone = visina reda, tekst vertikalno centriran */}
          <div 
            className={`flex flex-col items-start justify-center min-h-0 transition-all duration-700 ease-out ${
              isReversed ? 'lg:col-start-2' : 'lg:col-start-1'
            } ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <h3 className="text-xl md:text-2xl font-semibold leading-tight text-foreground mb-6">
              {feature.title}
            </h3>
            
            <ul className="space-y-5 mb-8">
              {feature.bullets.map((bullet, bulletIndex) => (
                <li 
                  key={bulletIndex} 
                  className={`flex items-start transition-all duration-500 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${(bulletIndex * 80) + 150}ms` }}
                >
                  <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-base md:text-lg text-foreground leading-relaxed">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <p
              className={`text-base md:text-lg text-muted-foreground leading-relaxed transition-all duration-500 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {feature.description}
            </p>
          </div>

          {/* Image */}
          <div 
            className={`flex items-center justify-center w-full relative z-0 overflow-visible transition-all duration-700 ease-out ${
              isReversed 
                ? 'lg:col-start-1 lg:row-start-1 lg:justify-end' 
                : 'lg:col-start-2 lg:justify-start'
            } ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            {feature.id === 'funkcija-dashboard-overview' ? (
              <ScaledDashboardMock scale={0.78} transformOrigin="top left">
                <DashboardMockupA />
              </ScaledDashboardMock>
            ) : (
              <ScaledDashboardMock scale={0.85} transformOrigin="top left">
                <DashboardMockupB />
              </ScaledDashboardMock>
            )}
          </div>
        </div>
    );
  }

  return (
    <div
      ref={ref}
      id={feature.id}
      className={`grid grid-cols-1 gap-12 lg:gap-16 lg:items-stretch ${
        shouldReverse ? 'lg:grid-cols-[65%_35%]' : 'lg:grid-cols-[35%_65%]'
      }`}
    >
      {/* Text Content - visina kolone = visina reda, tekst vertikalno centriran */}
      <div 
        className={`flex flex-col items-start justify-center min-h-0 relative z-10 transition-all duration-700 ease-out ${
          shouldReverse ? 'lg:col-start-2' : 'lg:col-start-1'
        } ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-6'
        }`}
      >
        <h3 className="text-xl md:text-2xl font-semibold leading-tight text-foreground mb-6">
          {feature.title}
        </h3>
        
        <ul className="space-y-5 mb-8">
          {feature.bullets.map((bullet, bulletIndex) => (
            <li 
              key={bulletIndex} 
              className={`flex items-start transition-all duration-500 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${(bulletIndex * 80) + 150}ms` }}
            >
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-base md:text-lg text-foreground leading-relaxed">
                {bullet}
              </span>
            </li>
          ))}
        </ul>

        <p
          className={`text-base md:text-lg text-muted-foreground leading-relaxed transition-all duration-500 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {feature.description}
        </p>
      </div>

      {/* Visual Placeholder or Calendar Mockup - centriran u visini reda */}
      <div 
        className={`flex items-center relative transition-all duration-700 ease-out ${
          shouldReverse ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2'
        } ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        {feature.id === 'funkcija-kalendar' ? (
          <div className="flex w-full justify-center lg:justify-start">
            <div className="w-full">
              <div 
                className="rounded-3xl border border-slate-200/60 bg-white overflow-hidden relative"
                style={{
              boxShadow: `
                0 35px 100px rgba(15, 23, 42, 0.15),
                0 20px 60px rgba(59, 130, 246, 0.1),
                0 10px 30px rgba(59, 130, 246, 0.08),
                0 0 0 1px rgba(255, 255, 255, 0.6) inset,
                0 2px 4px rgba(255, 255, 255, 0.8) inset
              `,
                  transform: 'translateZ(0) perspective(1000px) translateY(-2px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div 
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(255, 255, 255, 0) 50%, rgba(59, 130, 246, 0.03) 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(59, 130, 246, 0.05)',
                  }}
                />
                <div 
                  className="absolute -inset-1 rounded-3xl pointer-events-none -z-10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.05))',
                    filter: 'blur(20px)',
                    opacity: 0.4,
                  }}
                />
                <div className="h-[480px] lg:h-[520px] relative z-10 overflow-hidden">
                  <div className="hidden lg:block h-full">
                    <ScaledCalendarMock scale={0.72} />
                  </div>
                  <div className="hidden sm:block lg:hidden h-full">
                    <ScaledCalendarMock scale={0.65} />
                  </div>
                  <div className="block sm:hidden h-full">
                    <ScaledCalendarMock scale={0.55} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : feature.id === 'funkcija-sms' ? (
          <div className="flex justify-center lg:justify-start w-full relative z-0">
            <div 
              className="w-full origin-left relative"
              style={{ 
                transform: 'scale(0.7)', 
                transformOrigin: 'top left',
              }}
            >
              <ReminderMockup compact={true} />
            </div>
          </div>
        ) : feature.id === 'funkcija-terapije' ? (
          <div className="flex justify-center lg:justify-start w-full relative z-0 overflow-visible">
            <div 
              className="relative w-full"
              style={{ 
                transform: 'scale(0.95)', 
                transformOrigin: 'top left',
              }}
            >
              <OdontogramMockup />
            </div>
          </div>
        ) : feature.id === 'funkcija-ortodoncija' ? (
          <div className="flex justify-center lg:justify-start w-full relative z-0 overflow-visible">
            <div 
              className="relative w-full"
              style={{ 
                transform: 'scale(0.95)', 
                transformOrigin: 'top left',
              }}
            >
              <OrtodontskiKartonMockup />
            </div>
          </div>
        ) : feature.id === 'funkcija-izvestaji' ? (
          <div className="flex justify-center lg:justify-start w-full relative z-0 overflow-visible">
            <div 
              className="relative w-full"
              style={{ 
                transform: 'scale(0.95)', 
                transformOrigin: 'top left',
              }}
            >
              <IzvestajiMockup />
            </div>
          </div>
        ) : (
          <div 
            className="relative w-full h-[400px] bg-gradient-to-br from-muted/50 to-background border border-border rounded-3xl overflow-hidden"
            style={{
              boxShadow: `
                0 35px 100px rgba(15, 23, 42, 0.15),
                0 20px 60px rgba(59, 130, 246, 0.1),
                0 10px 30px rgba(59, 130, 246, 0.08),
                0 0 0 1px rgba(255, 255, 255, 0.6) inset,
                0 2px 4px rgba(255, 255, 255, 0.8) inset
              `,
              transform: 'translateZ(0) perspective(1000px) translateY(-2px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(255, 255, 255, 0) 50%, rgba(59, 130, 246, 0.03) 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(59, 130, 246, 0.05)',
              }}
            />
            <div 
              className="absolute -inset-1 rounded-3xl pointer-events-none -z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.05))',
                filter: 'blur(20px)',
                opacity: 0.4,
              }}
            />
            <div className="relative z-10 h-full">
              <div className="absolute top-4 right-4 z-20">
                <div className="px-3 py-1 rounded-full bg-white border border-border text-muted-foreground text-xs font-semibold leading-tight">
                  Screenshot
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-muted-foreground mb-2 text-sm leading-relaxed">
                    {feature.title}
                  </div>
                  <div className="text-primary text-xs font-semibold leading-tight">
                    Placeholder slika
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const FeatureWalkthroughV3 = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const cloudSecurityRef = useRef<HTMLDivElement>(null);
  const [cloudSecurityVisible, setCloudSecurityVisible] = useState(false);
  const trustedByRef = useRef<HTMLDivElement>(null);
  const [trustedByVisible, setTrustedByVisible] = useState(false);

  useEffect(() => {
    const headerElement = headerRef.current;
    const cloudSecurityElement = cloudSecurityRef.current;
    const trustedByElement = trustedByRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerElement && entry.isIntersecting) {
            setHeaderVisible(true);
          }
          if (entry.target === cloudSecurityElement && entry.isIntersecting) {
            setCloudSecurityVisible(true);
          }
          if (entry.target === trustedByElement && entry.isIntersecting) {
            setTrustedByVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (headerElement) observer.observe(headerElement);
    if (cloudSecurityElement) observer.observe(cloudSecurityElement);
    if (trustedByElement) observer.observe(trustedByElement);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 'funkcija-dashboard-overview',
      title: 'Pregled ordinacije u realnom vremenu',
      bullets: [
        'Pregled dana u 5 sekundi: pacijenti, termini, tim',
        'Statusi: zakazani, završeni, otkazani',
        'Jedan klik do ključnih akcija'
      ],
      description: 'Sve što je bitno za operativni rad ordinacije nalazi se na jednom ekranu, bez "kopanja" kroz menije.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-daily-operations',
      title: 'Dnevni pregled i aktivnosti u realnom vremenu',
      bullets: [
        'Pregled termina i statusa',
        'Praćenje izmena i aktivnosti (ko, šta, kada)',
        'Brza reakcija bez konfuzije'
      ],
      description: 'Sve izmene se beleže automatski, pa su raspored i kartoni uvek usklađeni.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-kalendar',
      title: 'Kalendar termina i smena',
      bullets: [
        'Zakazivanje i pomeranje termina u par klikova',
        'Pregled po danu, nedelji i smeni',
        'Evidencija otkazivanja i promena'
      ],
      description: 'Jedan kalendar za ceo tim. Brže planiranje i jasna organizacija rada kroz dan.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-sms',
      title: 'Automatski SMS i email podsetnici',
      bullets: [
        'Manje propuštenih termina uz automatske podsetnike.',
        'Automatsko slanje podsetnika, bez poziva i poruka "ručno"',
        'Stabilniji raspored i manje poziva tokom dana.'
      ],
      description: 'Podesite pravila jednom. Podsetnici se šalju automatski, uz evidenciju aktivnosti.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-terapije',
      title: 'Brži pregled kartona kroz odontogram',
      bullets: [
        'Grafički status zuba i terapija',
        'Sledeći korak je odmah vidljiv',
        'Brži uvid u istoriju'
      ],
      description: 'Sve je povezano sa pacijentovim planom, pa se odluke donose brže.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-ortodoncija',
      title: 'Karton za ortodontsku terapiju',
      bullets: [
        'Sve procene i nalazi na jednom mestu',
        'Faze terapije jasno povezane kroz kontrole',
        'Brz uvid u fotografije i beleške'
      ],
      description: 'Sve je zabeleženo i povezano, pa tim odmah vidi istoriju i sledeći korak terapije.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-izvestaji',
      title: 'Kontrola poslovanja kroz izveštaje',
      bullets: [
        'Izvoz podataka po periodu, doktoru i stolici',
        'Pregled termina, dolazaka i otkazivanja',
        'Brža kontrola rada i planiranje kapaciteta'
      ],
      description: 'Jasni brojevi umesto procene. Napravite izveštaj za par sekundi i optimizujte raspored i organizaciju rada.',
      imagePosition: 'right' as const
    }
  ];

  const trustedBy = [
    'Ordinacija Dr. Petrović',
    'Dental Centar Beograd',
    'Smile Clinic',
    'DentArt Studio',
    'Perfect Smile'
  ];

  return (
    <section id="funkcije" className="w-full scroll-mt-24 bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 lg:mb-20 transition-all duration-700 ease-out flex flex-col gap-4 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-foreground">
            Jedno mesto za kompletan rad ordinacije
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Sve što vam treba za dnevni rad: pacijenti, termini, terapije, dokumenti i uvid u performanse.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-20 lg:space-y-24">
          {features.map((feature, index) => {
            const isEven = index % 2 === 1;
            const textFirst = !isEven;
            const shouldReverse = feature.id === 'funkcija-sms' 
              ? feature.imagePosition === 'left' 
              : feature.id === 'funkcija-daily-operations'
              ? feature.imagePosition === 'left'
              : !textFirst;

            return (
              <AnimatedFeatureBlock
                key={feature.id}
                feature={feature}
                index={index}
                shouldReverse={shouldReverse}
              />
            );
          })}
        </div>

        {/* Cloud Security Section */}
        <div 
          ref={cloudSecurityRef}
          className="mt-16 lg:mt-20 pt-16 border-t border-border"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 lg:gap-16">
            {/* Text Content */}
            <div 
              className={`flex flex-col relative z-10 transition-all duration-700 ease-out ${
                cloudSecurityVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
            >
              <h3 className="text-xl md:text-2xl font-semibold leading-tight text-foreground mb-6">
                Podaci zaštićeni, dostupni kad god zatreba
              </h3>
              
              <ul className="space-y-5 mb-8">
                {[
                  'Cloud čuvanje i zaštita pristupa',
                  'Podaci se čuvaju automatski.',
                  'Sigurnost kartona i termina u svakom scenariju'
                ].map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex}
                    className={`flex items-start transition-all duration-500 ease-out ${
                      cloudSecurityVisible 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${(bulletIndex * 80) + 150}ms` }}
                  >
                    <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-base md:text-lg text-foreground leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className={`text-base md:text-lg text-muted-foreground leading-relaxed transition-all duration-500 ease-out ${
                  cloudSecurityVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '450ms' }}
              >
                Pouzdana infrastruktura u pozadini, fokus na pacijentima u praksi.
              </p>
            </div>

            {/* Mockup Placeholder */}
            <div 
              className={`relative transition-all duration-700 ease-out ${
                cloudSecurityVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <div 
                className="relative w-full h-[400px] bg-gradient-to-br from-muted/50 to-background border border-border rounded-3xl overflow-hidden"
                style={{
                  boxShadow: `
                    0 35px 100px rgba(15, 23, 42, 0.15),
                    0 20px 60px rgba(59, 130, 246, 0.1),
                    0 10px 30px rgba(59, 130, 246, 0.08),
                    0 0 0 1px rgba(255, 255, 255, 0.6) inset,
                    0 2px 4px rgba(255, 255, 255, 0.8) inset
                  `,
                  transform: 'translateZ(0) perspective(1000px) translateY(-2px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div 
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(255, 255, 255, 0) 50%, rgba(59, 130, 246, 0.03) 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(59, 130, 246, 0.05)',
                  }}
                />
                <div 
                  className="absolute -inset-1 rounded-3xl pointer-events-none -z-10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.05))',
                    filter: 'blur(20px)',
                    opacity: 0.4,
                  }}
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-muted-foreground mb-2 text-sm leading-relaxed">
                      Cloud Security Mockup
                    </div>
                    <div className="text-primary text-xs font-semibold leading-tight">
                      Placeholder slika
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section - Hidden for now */}
        {/* <div 
          ref={trustedByRef}
          className={`mt-20 lg:mt-24 pt-16 border-t border-border transition-all duration-700 ease-out ${
            trustedByVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed uppercase tracking-wider">
              Veruju nam
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {trustedBy.map((name, index) => (
                <div
                  key={index}
                  className={`px-6 py-3 bg-white border border-border rounded-lg text-sm font-semibold leading-tight text-muted-foreground transition-all duration-500 ease-out ${
                    trustedByVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FeatureWalkthroughV3;
