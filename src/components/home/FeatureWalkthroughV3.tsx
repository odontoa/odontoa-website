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
        className={`grid grid-cols-1 gap-12 lg:gap-16 ${
          isReversed ? 'lg:grid-cols-[65%_35%]' : 'lg:grid-cols-[35%_65%]'
        }`}
      >
          {/* Text Content */}
          <div 
            className={`flex flex-col items-start justify-start transition-all duration-700 ease-out ${
              isReversed ? 'lg:col-start-2' : 'lg:col-start-1'
            } ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <h3
              className="text-[#000A2D] mb-6"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '1.2em'
              }}
            >
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
                  <Check className="w-5 h-5 text-[#3267FF] mt-0.5 mr-3 flex-shrink-0" />
                  <span
                    className="text-[#000A2D]"
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.6em'
                    }}
                  >
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <p
              className={`text-[#636571] transition-all duration-500 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em',
                transitionDelay: '400ms'
              }}
            >
              {feature.description}
            </p>
          </div>

          {/* Image */}
          <div 
            className={`flex items-start justify-center w-full relative z-0 overflow-visible transition-all duration-700 ease-out ${
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
      className={`grid grid-cols-1 gap-12 lg:gap-16 ${
        shouldReverse ? 'lg:grid-cols-[65%_35%]' : 'lg:grid-cols-[35%_65%]'
      }`}
    >
      {/* Text Content */}
      <div 
        className={`flex flex-col relative z-10 transition-all duration-700 ease-out ${
          shouldReverse ? 'lg:col-start-2' : 'lg:col-start-1'
        } ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-6'
        }`}
      >
        <h3
          className="text-[#000A2D] mb-6"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '1.2em'
          }}
        >
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
              <Check className="w-5 h-5 text-[#3267FF] mt-0.5 mr-3 flex-shrink-0" />
              <span
                className="text-[#000A2D]"
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.6em'
                }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>

        <p
          className={`text-[#636571] transition-all duration-500 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            fontFamily: 'Archivo, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '1.6em',
            transitionDelay: '400ms'
          }}
        >
          {feature.description}
        </p>
      </div>

      {/* Visual Placeholder or Calendar Mockup */}
      <div 
        className={`relative transition-all duration-700 ease-out ${
          shouldReverse ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2'
        } ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        {feature.id === 'funkcija-kalendar' ? (
          <div className="flex justify-center lg:justify-start">
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
            className="relative w-full h-[400px] bg-gradient-to-br from-[#F1F8FF] to-[#FBFDFF] border border-slate-200/60 rounded-3xl overflow-hidden"
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
                <div
                  className="px-3 py-1 rounded-full bg-white border border-[#EEEEEE] text-[#636571]"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '1.2em'
                  }}
                >
                  Screenshot
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <div
                    className="text-[#636571] mb-2"
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '1.5em'
                    }}
                  >
                    {feature.title}
                  </div>
                  <div
                    className="text-[#3267FF]"
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      lineHeight: '1.2em'
                    }}
                  >
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
      title: 'Kontrola ordinacije na prvi pogled',
      bullets: [
        'Ključne informacije dostupne odmah po ulasku u sistem',
        'Jasan pregled pacijenata, termina i opterećenja ordinacije',
        'Brze akcije bez pretrage kroz više ekrana'
      ],
      description: 'Sve važne informacije nalaze se na jednom mestu — da biste u svakom trenutku znali kako ordinacija funkcioniše i gde je potrebna reakcija.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-daily-operations',
      title: 'Dnevni rad bez zastoja',
      bullets: [
        'Brz uvid u današnje termine i izmene rasporeda',
        'Evidencija nedavnih aktivnosti u realnom vremenu',
        'Manje grešaka i jasnija komunikacija unutar tima'
      ],
      description: 'Pratite šta se dešava tokom dana i reagujte odmah — bez preklapanja termina, zaboravljenih obaveza ili ručnih beleški.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-kalendar',
      title: 'Kalendar za zakazivanje',
      bullets: [
        'Zakazivanje u nekoliko klikova, sa jasnim pregledom dana i smena.',
        'Manje preklapanja i "rupa" u rasporedu.',
        'Brzo pomeranje termina i evidencija otkazivanja.'
      ],
      description: 'Kalendar je centralno mesto rada. Planirajte dan unapred i reagujte brzo kada se termin promeni.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-sms',
      title: 'SMS podsetnici bez dodatnih troškova',
      bullets: [
        'Manje propuštenih termina uz automatske podsetnike.',
        'Standardizovana komunikacija prema pacijentima (bez ručnog slanja).',
        'Bolja popunjenost rasporeda i manje stresa na recepciji.'
      ],
      description: 'Podsetnici se šalju automatski po vašim pravilima. Tim štedi vreme, a pacijenti dobijaju jasnu potvrdu.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-terapije',
      title: 'Grafički prikaz statusa i terapija',
      bullets: [
        'Jasno vidite status slučaja i sledeći korak terapije.',
        'Lakše praćenje plana: urađeno, u toku, zakazano, čekanje.',
        'Brži pregled istorije bez "kopanja" po beleškama.'
      ],
      description: 'Sve terapije i statusi su pregledni i konzistentni, tako da i vi i tim uvek znate gde je pacijent u procesu.',
      imagePosition: 'left' as const
    },
    {
      id: 'funkcija-ortodoncija',
      title: 'Ortodontski karton',
      bullets: [
        'Strukturisan ortodontski pregled na jednom mestu.',
        'Lakše praćenje faza terapije i kontrola.',
        'Brz uvid u fotografije, nalaze i napomene.'
      ],
      description: 'Ortodontski slučajevi zahtevaju kontinuitet. Karton je organizovan tako da svaki pregled ima kontekst.',
      imagePosition: 'right' as const
    },
    {
      id: 'funkcija-izvestaji',
      title: 'Kreiranje izveštaja',
      bullets: [
        'Brzi izveštaji za internu kontrolu i organizaciju rada.',
        'Pregled aktivnosti po periodu (termini, dolasci, otkazivanja).',
        'Lakše donošenje odluka na osnovu podataka.'
      ],
      description: 'Umesto "osećaja", dobijate jasne brojke. Izveštaji pomažu da optimizujete raspored i opterećenje tima.',
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
    <section id="funkcije" className="w-full" style={{ backgroundColor: 'hsl(0 0% 98%)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-20 lg:mb-24 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="text-[#000A2D] mb-8"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: '52px',
              lineHeight: '1.1em',
              letterSpacing: '-2.88%'
            }}
          >
            Jedno mesto za kompletan rad ordinacije
          </h2>
          <p
            className="text-[#636571] max-w-2xl mx-auto"
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '1.6em'
            }}
          >
            Od kartona i zakazivanja do podsetnika i izveštaja, Odontoa pojednostavljuje svakodnevni rad ordinacije.
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
          className="mt-20 lg:mt-24 pt-16 border-t border-[#EEEEEE]"
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
              <h3
                className="text-[#000A2D] mb-6"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '1.2em'
                }}
              >
                Podaci bezbedno čuvani u cloud-u
              </h3>
              
              <ul className="space-y-5 mb-8">
                {[
                  'Svi podaci se čuvaju u sigurnom cloud okruženju sa visokim standardima zaštite.',
                  'Automatski backup se radi dva puta dnevno, bez prekida u radu.',
                  'Pristup podacima je zaštićen i dostupan samo ovlašćenim korisnicima.',
                  'Vaši pacijenti, kartoni i termini su bezbedni - čak i u slučaju kvara, gubitka uređaja ili greške.'
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
                    <Check className="w-5 h-5 text-[#3267FF] mt-0.5 mr-3 flex-shrink-0" />
                    <span
                      className="text-[#000A2D]"
                      style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '1.6em'
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className={`text-[#636571] transition-all duration-500 ease-out ${
                  cloudSecurityVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.6em',
                  transitionDelay: '450ms'
                }}
              >
                Odontoa brine o infrastrukturi, kako biste vi mogli da se fokusirate na rad sa pacijentima.
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
                className="relative w-full h-[400px] bg-gradient-to-br from-[#F1F8FF] to-[#FBFDFF] border border-slate-200/60 rounded-3xl overflow-hidden"
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
                    <div
                      className="text-[#636571] mb-2"
                      style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '1.5em'
                      }}
                    >
                      Cloud Security Mockup
                    </div>
                    <div
                      className="text-[#3267FF]"
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '12px',
                        lineHeight: '1.2em'
                      }}
                    >
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
          className={`mt-20 lg:mt-24 pt-16 border-t border-[#EEEEEE] transition-all duration-700 ease-out ${
            trustedByVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <p
              className="text-[#636571] mb-6"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '1.5em',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Veruju nam
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {trustedBy.map((name, index) => (
                <div
                  key={index}
                  className={`px-6 py-3 bg-white border border-[#EEEEEE] rounded-lg transition-all duration-500 ease-out ${
                    trustedByVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '1.2em',
                    color: '#636571',
                    transitionDelay: `${index * 100 + 200}ms`
                  }}
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
