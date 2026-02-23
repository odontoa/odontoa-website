'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import CountUp from 'react-countup';
import { HeroDeviceComposition } from '@/components/hero/HeroDeviceComposition';

/**
 * HeroV2 — premium hero with laptop + phone device composition.
 * Laptop shows DashboardMockupA (hero variant), phone shows patient SMS preview.
 */
const HeroV2 = () => {
  return (
    <section className="relative isolate w-full min-h-[calc(100svh-var(--nav-h))] bg-background overflow-x-clip overflow-y-visible">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 65% 40%, rgba(27,43,107,0.06), transparent 70%)',
        }}
        aria-hidden
      />

      {/* Content container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 pt-24 sm:pt-28 lg:pt-[clamp(8.75rem,11.5vh,17.5rem)] pb-20 sm:pb-24 lg:pb-28">
        <div className="grid items-center gap-14 sm:gap-16 lg:grid-cols-[1fr_minmax(0,1404px)] xl:grid-cols-[1fr_minmax(0,1560px)] lg:gap-16 xl:gap-20">
          {/* ── Left column: text content ── */}
          <div className="order-1 lg:pr-4 xl:pr-8">
            <AnimatedGroup>
              <h1 className="font-manrope font-semibold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.15] text-foreground">
                Digitalna ordinacija
              </h1>

              <p className="mt-5 lg:mt-6 max-w-[52ch] text-base sm:text-lg leading-relaxed text-slate-600">
                Kompletno rešenje za stomatološke prakse – automatizujte
                zakazivanje i administraciju
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
                  <Star
                    key={i}
                    className="w-4 h-4 fill-slate-900 stroke-slate-900"
                  />
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
                  <p className="mt-1 text-sm text-slate-500">
                    Ušteda vremena dnevno
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[1.75rem] font-semibold tracking-tight text-slate-900">
                    3×
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Više ponovnih dolazaka
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-[1.75rem] font-semibold tracking-tight text-slate-900">
                    <CountUp end={92} duration={2.5} />%
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Manje propuštenih termina
                  </p>
                </div>
              </div>
            </AnimatedGroup>
          </div>

          {/* ── Right column: static hero artwork ── */}
          <div className="order-2 relative mx-auto w-full max-w-[min(95vw,576px)] sm:max-w-[min(95vw,744px)] md:max-w-[min(95vw,912px)] lg:max-w-none lg:translate-x-8 xl:translate-x-12 overflow-hidden">
            <div className="lg:scale-[1.235] lg:origin-center">
              <HeroDeviceComposition />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroV2;
