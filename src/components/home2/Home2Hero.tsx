'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import CountUp from 'react-countup';

const Home2Hero = () => {
  return (
    <section className="relative w-full min-h-screen min-h-[100svh] flex items-start pt-16 pb-16 overflow-x-hidden overflow-y-visible bg-background [@media_(max-height:800px)]:pt-14 [@media_(max-height:800px)]:pb-12">
      <div className="relative w-full min-w-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full min-w-0 flex flex-col lg:flex-row items-center lg:items-start gap-y-10 lg:gap-10 xl:gap-12 [@media_(max-height:800px)]:gap-y-8">
          {/* Leva kolona – naslov, opis, CTA, ocene, metrike (kao hero test) */}
          <div className="w-full min-w-0 lg:max-w-[50%] xl:max-w-[52%] flex flex-col justify-start text-left pt-32 lg:pt-48 mt-2.5">
            <AnimatedGroup>
              <h1 className="font-manrope font-semibold text-[44px] leading-[50px] tracking-[-0.03em] text-black sm:text-[56px] sm:leading-[64px] lg:text-[75px] lg:leading-[85px] [@media_(max-height:800px)]:text-5xl">
                Upravljajte ordinacijom <br />
                bez stresa
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
                <span className="font-medium text-slate-900">4.9+</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">50+ ocena</span>
              </div>

              <div className="mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
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

          {/* Desna kolona – slika ruke sa telefonom (ista kao hero test: mask, glow, senka) */}
          <div className="w-full min-w-0 lg:flex-1 lg:min-w-0 flex justify-center lg:justify-end items-start pt-2 lg:pt-0 mt-2.5 pr-10 pb-10 md:pr-14 md:pb-14 lg:pr-16 lg:pb-16 overflow-visible">
            <div className="relative w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[560px] xl:max-w-[620px] h-[min(95vh,920px)] flex-shrink-0 overflow-visible">
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 70% 50% at 55% 45%, rgba(0,0,0,0.08) 0%, transparent 65%)',
                  transform: 'scale(1.12) translate(-3%, 26px)',
                  transformOrigin: 'top center',
                }}
                aria-hidden
              />
              <div
                className="absolute inset-0 overflow-visible z-[1]"
                style={{
                  transform: 'scale(1.12) translate(-3%, 26px)',
                  transformOrigin: 'top center',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.98) 64%, rgba(0,0,0,0.92) 72%, rgba(0,0,0,0.78) 80%, rgba(0,0,0,0.50) 87%, rgba(0,0,0,0.18) 93%, rgba(0,0,0,0.02) 98%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.98) 64%, rgba(0,0,0,0.92) 72%, rgba(0,0,0,0.78) 80%, rgba(0,0,0,0.50) 87%, rgba(0,0,0,0.18) 93%, rgba(0,0,0,0.02) 98%, rgba(0,0,0,0) 100%)',
                  maskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              >
                <Image
                  src="/images/features-new-homepage3/New Hero Hanf Phone Photo.svg"
                  alt="Odontoa pregled na mobilnom"
                  fill
                  className="object-contain object-top bg-transparent"
                  sizes="(max-width: 640px) 380px, (max-width: 1024px) 460px, (max-width: 1280px) 560px, 620px"
                  priority
                  placeholder="empty"
                  style={{
                    filter: 'drop-shadow(0 18px 35px rgba(0,0,0,0.10))',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2Hero;
