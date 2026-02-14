'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Check, Workflow } from 'lucide-react';
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
    microLine?: string;
    calloutLabel?: string;
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

            {!feature.microLine && (
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
            )}
            {feature.microLine && (
              <div
                className={`mt-2 inline-flex max-w-lg items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm transition-all duration-500 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
                  <Workflow className="h-4 w-4" />
                </div>
                <p className="leading-relaxed">
                  {feature.calloutLabel && (
                    <>
                      <span className="font-semibold text-slate-900">{feature.calloutLabel}</span>{" "}
                    </>
                  )}
                  {feature.microLine}
                </p>
              </div>
            )}
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

        {!feature.microLine && (
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
        )}
        {feature.microLine && (
          <div
            className={`mt-2 inline-flex max-w-lg items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm transition-all duration-500 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
              <Workflow className="h-4 w-4" />
            </div>
            <p className="leading-relaxed">
              {feature.calloutLabel && (
                <>
                  <span className="font-semibold text-slate-900">{feature.calloutLabel}</span>{" "}
                </>
              )}
              {feature.microLine}
            </p>
          </div>
        )}
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
      title: 'Kontrolna tabla vaše ordinacije',
      bullets: [
        'Dnevni pregled na jednom ekranu: termini, pacijenti, tim',
        'Jasni statusi poseta da znate šta je u toku i šta je završeno',
        'Brze akcije bez traženja kroz menije'
      ],
      description: 'Sve što vam treba za operativne odluke tokom dana nalazi se na jednom mestu, sa jasnim uvidom u tok rada i učinak.',
      microLine: 'Termini, karton i posete rade zajedno, za jasan pregled i brže odluke.',
      calloutLabel: 'Sve u jednom toku.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-daily-operations',
      title: 'Dnevni tok rada, bez nesporazuma u timu',
      bullets: [
        'Jasan pregled termina i statusa poseta',
        'Istorija promena: ko je šta uradio i kada',
        'Brza koordinacija asistenta i doktora'
      ],
      description: 'Sve promene se beleže automatski, pa su raspored i dokumentacija uvek usklađeni.',
      microLine: 'Sve promene se beleže automatski, pa su raspored i evidencija poseta uvek usklađeni.',
      calloutLabel: 'Uvek usklađeno.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-kalendar',
      title: 'Kalendar termina i smena',
      bullets: [
        'Zakazivanje i pomeranje termina bez konfuzije',
        'Pregled po danu i nedelji, za ceo tim',
        'Jasna evidencija otkazivanja i promena'
      ],
      description: 'Jedan raspored za celu ordinaciju, sa jasnim pregledom zauzetosti i toka dana.',
      microLine: 'Tim uvek zna ko, kada i gde radi.',
      calloutLabel: 'Jedan raspored.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-sms',
      title: 'Automatski SMS i email podsetnici',
      bullets: [
        'Manje propuštenih termina i manje praznih rupa u rasporedu',
        'Automatsko slanje podsetnika',
        'Manje poziva tokom dana i mirnija organizacija'
      ],
      description: 'Podesite pravila jednom. Podsetnici se šalju automatski i beleže u istoriji aktivnosti.',
      microLine: 'Podsetnici se šalju automatski i beleže u istoriji aktivnosti.',
      calloutLabel: 'Podesite jednom.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-terapije',
      title: 'Odontogram za brz klinički uvid',
      bullets: [
        'Status i terapije po zubu, jasno označeni',
        'Plan terapije na dohvat ruke',
        'Istorija intervencija bez traženja kroz karton'
      ],
      description: 'Sve je objedinjeno po pacijentu, pa brže dolazite do odluke i sledećeg koraka.',
      microLine: 'Sve je objedinjeno po pacijentu, pa brže dolazite do odluke i sledećeg koraka.',
      calloutLabel: 'Brz uvid.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-ortodoncija',
      title: 'Ortodontski karton za ceo tok terapije',
      bullets: [
        'Procene, nalazi i dokumentacija na jednom mestu',
        'Faze terapije i kontrole jasno povezane',
        'Fotografije, beleške i istorija bez traženja'
      ],
      description: 'Jedan karton, jedan tok terapije, potpuna preglednost.',
      microLine: 'Jedan tok terapije, potpuna preglednost.',
      calloutLabel: 'Jedan karton.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-izvestaji',
      title: 'Finansije i izveštaji na jednom mestu',
      bullets: [
        'Pregled prihoda po periodu, doktoru i stolici',
        'Uvid u naplatu, dugovanja i status poseta',
        'Planiranje kapaciteta i ciljeva na osnovu podataka'
      ],
      description: 'Jasni brojevi umesto procene. U par sekundi dobijate pregled finansija i rada ordinacije.',
      microLine: 'U par sekundi dobijate pregled finansija i rada ordinacije.',
      calloutLabel: 'Jasni brojevi umesto procene.',
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
                Podaci zaštićeni. Dostupni kada zatrebaju.
              </h3>
              
              <ul className="space-y-5 mb-8">
                {[
                  'Siguran cloud pristup, sa kontrolom naloga i uloga',
                  'Automatsko čuvanje i rezervne kopije podataka',
                  'Karton i termini uvek dostupni celom timu, uz kontrolu pristupa'
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
                Pouzdana infrastruktura u pozadini, da vi možete da se fokusirate na rad sa pacijentima.
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
