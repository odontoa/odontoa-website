'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import CountUp from 'react-countup';

const MASK_GRADIENT =
  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.98) 72%, rgba(0,0,0,0.88) 80%, rgba(0,0,0,0.70) 86%, rgba(0,0,0,0.45) 91%, rgba(0,0,0,0.22) 95%, rgba(0,0,0,0.08) 97.5%, rgba(0,0,0,0) 100%)';

/**
 * NewHeroDesigne2026 – hero sekcija na glavnoj landing stranici (PulseIQ-style).
 */
const NewHeroDesigne2026 = () => {
  return (
    <section
      className="relative isolate w-full h-[calc(100svh-var(--nav-h))] min-h-[calc(100svh-var(--nav-h))] bg-background"
      style={{ maxWidth: '100%' }}
    >
      {/* Glow behind phone – z-0 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 70% 35%, rgba(0,0,0,0.05), transparent 55%)',
        }}
        aria-hidden
      />

      {/* Phone layer: anchored to viewport bottom-right, above glow – z-[1]; pointer-events-none only here */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <div
          className="absolute right-4 bottom-0 origin-bottom-right scale-[0.95] lg:right-6 xl:right-10 w-[min(520px,38vw)] xl:w-[min(640px,42vw)] 2xl:w-[min(760px,44vw)] [@media_(min-width:1800px)]:w-[min(860px,46vw)] max-w-[95vw] translate-y-[17vh] md:translate-y-[15vh] lg:translate-y-[13vh] xl:translate-y-[11vh] 2xl:translate-y-[7vh] [@media_(max-height:820px)]:translate-y-[19vh] [@media_(max-height:740px)]:translate-y-[21vh] [@media_(min-width:1800px)]:translate-y-[8vh] [@media_(min-width:2200px)]:translate-y-[7vh] [@media_(min-width:1024px)_and_(max-width:1720px)]:translate-y-[14vh] [@media_(min-width:1024px)_and_(max-width:1720px)]:scale-[0.855] [@media_(min-width:1800px)]:scale-[0.99] [@media_(min-width:2200px)]:scale-[1.02]"
        >
          <div
            className="relative w-full overflow-visible"
            style={{
              maskImage: MASK_GRADIENT,
              WebkitMaskImage: MASK_GRADIENT,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
          >
            <Image
              src="/images/features-new-homepage3/New Hero Hanf Phone Photo.svg"
              alt="Odontoa na računaru i mobilnom"
              width={1059}
              height={1505}
              className="w-full h-auto object-contain bg-transparent"
              sizes="(max-width: 640px) 380px, (max-width: 1024px) 520px, (max-width: 1280px) 600px, 660px"
              priority
              placeholder="empty"
              style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.08))' }}
            />
          </div>
        </div>
      </div>

      {/* Content grid – z-10 */}
      <div className="relative z-10 mx-auto h-full w-full max-w-7xl px-6 lg:px-10">
        <div className="grid h-full items-center gap-10 lg:grid-cols-2">
          {/* Left column: pushed down slightly for balance with phone */}
          <div className="translate-y-[7vh] [@media_(min-width:1024px)_and_(max-width:1720px)]:translate-y-[9vh] [@media_(min-width:1024px)_and_(max-width:1720px)_and_(max-height:900px)]:translate-y-[11vh]">
            <AnimatedGroup>
              <h1 className="font-manrope font-semibold text-[48px] leading-[55px] tracking-[-0.03em] text-black sm:text-[62px] sm:leading-[70px] lg:text-[83px] lg:leading-[94px] [@media_(max-height:900px)]:text-[68px] [@media_(max-height:900px)]:leading-[76px] [@media_(max-height:800px)]:text-[53px] [@media_(max-height:800px)]:leading-[58px]">
                Digitalna ordinacija
              </h1>

              <p className="mt-5 lg:mt-6 max-w-[52ch] text-[16px] leading-[24px] text-slate-600 sm:text-[17px] sm:leading-[26px]">
                Kompletno rešenje za stomatološke prakse – automatizujte zakazivanje i administraciju
              </p>

              <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-start gap-3">
                <Button
                  asChild
                  variant="pillPrimary"
                  size="pill"
                  className="w-full sm:w-auto gap-2"
                >
                  <Link href="#demo">
                    <span className="text-nowrap">Zakaži demo</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="pillSecondary"
                  size="pill"
                  className="w-full sm:w-auto"
                >
                  <Link href="#features">
                    <span className="text-nowrap">Pogledaj kako radi</span>
                  </Link>
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-slate-900 stroke-slate-900" />
                ))}
                <span className="font-medium text-slate-900">4.9/5</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">30+ ordinacija aktivno</span>
              </div>

              <div className="mt-12 lg:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[1.75rem] font-semibold tracking-tight text-slate-900">
                    <CountUp end={120} duration={2.5} /> min
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Ušteda vremena dnevno</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[1.75rem] font-semibold tracking-tight text-slate-900">3×</div>
                  <p className="mt-1 text-sm text-slate-500">Više ponovnih dolazaka</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[1.75rem] font-semibold tracking-tight text-slate-900">
                    <CountUp end={92} duration={2.5} />%
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Manje propuštenih termina</p>
                </div>
              </div>
            </AnimatedGroup>
          </div>

          {/* Right column: spacer on lg+ so layout stays two columns */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default NewHeroDesigne2026;
