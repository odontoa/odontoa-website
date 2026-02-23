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
    <section className="relative isolate w-full min-h-[calc(100svh-var(--nav-h))] bg-background overflow-hidden">
      {/* Glow behind phone – z-0 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 70% 35%, rgba(0,0,0,0.05), transparent 55%)',
        }}
        aria-hidden
      />

      {/* Content container – z-10 */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-[clamp(4rem,5vh,8rem)] pb-16 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,440px)] xl:grid-cols-[1fr_minmax(0,520px)] lg:gap-12">
          {/* Left column: text content */}
          <div className="order-1">
            <AnimatedGroup>
              <h1 className="font-manrope font-semibold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.15] text-foreground">
                Digitalna ordinacija
              </h1>

              <p className="mt-5 lg:mt-6 max-w-[52ch] text-base sm:text-lg leading-relaxed text-slate-600">
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
                  <Link href="#video-demo">
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

              <div className="mt-10 lg:mt-14 grid grid-cols-3 gap-6 sm:gap-10">
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

          {/* Right column: phone image in grid flow */}
          <div className="order-2 relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <div
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
                className="w-full h-auto"
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, (max-width: 1280px) 440px, 520px"
                priority
                placeholder="empty"
                style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.08))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroDesigne2026;
