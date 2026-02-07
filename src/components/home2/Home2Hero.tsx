'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import CountUp from "react-countup";

const Home2Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.5) {
        video.pause();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
    <section className="relative w-full min-h-screen min-h-[100svh] flex items-center pt-24 pb-12 overflow-hidden bg-background [@media_(max-height:800px)]:pt-20 [@media_(max-height:800px)]:pb-6">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="/videos/homepage-hero-video.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/40 z-[1] pointer-events-none" />
      
      {/* Gradient overlay on left side for more authority */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/6 via-transparent to-transparent z-[1] pointer-events-none" />
      
      {/* Decorative gradient elements */}
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>
      
      <div className="relative z-[10] w-full min-w-0 mx-auto max-w-[1240px] px-[10px] py-0">
        <div className="w-full min-w-0 flex flex-col lg:flex-row items-center gap-y-6 lg:gap-8 [@media_(max-height:800px)]:gap-y-4">
          {/* Left Column - Content - Exact Figma layout */}
          <div className="w-full min-w-0 max-w-[620px] lg:max-w-[640px] xl:max-w-[820px] 2xl:max-w-[900px] flex flex-col justify-center relative">
            <div className="min-w-0">
            <AnimatedGroup>
              {/* Main Heading - typography locked to 2 lines, font-semibold 600 */}
              <div className="min-w-0" style={{ paddingLeft: '5px', paddingTop: '20px' }}>
                <h1 className="font-semibold tracking-tight text-foreground text-5xl sm:text-6xl lg:text-6xl xl:text-7xl leading-[0.95] max-w-[18ch] sm:max-w-[20ch] lg:max-w-[19ch] xl:max-w-[28ch] 2xl:max-w-[30ch] [@media_(max-height:800px)]:text-5xl whitespace-normal break-words">
                  Upravljajte ordinacijom <br className="hidden lg:block" /> bez stresa
                </h1>
              </div>

              {/* Description - Exact Figma positioning */}
              <div style={{ paddingLeft: '10px', paddingTop: '24px', maxWidth: '450px' }}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kompletno rešenje za stomatološke prakse - automatizujte zakazivanje i administraciju
                </p>
              </div>

              {/* CTA + social proof + metrics - PulseIQ style (single wrapper, Tailwind-only) */}
              <div className="pl-2.5 pt-5 lg:pt-6 [@media_(max-height:800px)]:pt-4">
                <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                  <Button
                    asChild
                    variant="pillPrimary"
                    size="pill"
                    className="w-full max-w-xs md:w-auto gap-2">
                    <Link href="#demo">
                      <span className="text-nowrap">Zakaži demo</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="pillSecondary"
                    size="pill"
                    className="w-full max-w-xs md:w-auto">
                    <Link href="#features">
                      <span className="text-nowrap">Pogledaj kako radi</span>
                    </Link>
                  </Button>
                </div>

                {/* Social proof - PulseIQ style */}
                <div className="mt-5 lg:mt-6 [@media_(max-height:800px)]:mt-4 flex items-center gap-2 text-sm text-slate-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-slate-900 stroke-slate-900" />
                  ))}
                  <span className="font-medium text-slate-900">4.9+</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">50+ ocena</span>
                </div>

                {/* Metrics row - PulseIQ style (no icons/cards; animate on mount) */}
                <div className="mt-8 lg:mt-10 [@media_(max-height:800px)]:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 [@media_(max-height:800px)]:gap-4 [@media_(max-height:800px)]:sm:gap-6">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                      <CountUp end={120} duration={2.5} /> min
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Ušteda vremena dnevno</p>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">3×</div>
                    <p className="mt-1 text-sm text-slate-500">Više ponovnih dolazaka</p>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900">
                      <CountUp end={92} duration={2.5} />%
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Manje propuštenih termina</p>
                  </div>
                </div>

                {/* Sakriveno za sada */}
                {/* <p className="mt-6 text-xs text-slate-500">Razvijeno uz podršku stomatologa širom regiona</p> */}
              </div>
            </AnimatedGroup>
            </div>
          </div>

          {/* Right Column - Floating Elements - Exact Figma positioning */}
          <div className="w-full min-w-0 lg:w-[620px] lg:ml-0 mt-[40px] lg:mt-0 relative">
            <div className="relative w-full overflow-visible" style={{ height: '581.42px', marginTop: '-20px', marginBottom: '-20px' }}>
              {/* Decorative glow effect */}
              <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-transparent via-blue-50/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Soft vertical gradient fade at bottom transitioning to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-background/60 to-background z-[5] pointer-events-none" />
    </section>
    </>
  );
};

export default Home2Hero;
