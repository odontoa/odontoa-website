'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Menu, X, Zap, Shield, Calendar, Bell, TrendingUp, Star } from 'lucide-react';
import CountUp from "react-countup";
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const dentistAvatars = [
  {
    id: 1,
    name: "Dr. Ana Petrović",
    designation: "Ortodont",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Dr. Marko Jovanović",
    designation: "Oralni hirurg",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Dr. Jelena Nikolić",
    designation: "Endodont",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Dr. Stefan Đorđević",
    designation: "Stomatolog opšte prakse",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Dr. Marija Stojanović",
    designation: "Parodontolog",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
];

const HeroSection = () => {
  return (
    <main className="overflow-hidden">
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>
      
      {/* Animated Grid Pattern Background */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.03}
          duration={6}
          repeatDelay={2}
          width={60}
          height={60}
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "opacity-40",
          )}
        />
      </div>
      <section className="section-spacing">
        <div className="relative pt-24 md:pt-36">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    delayChildren: 1,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    bounce: 0.3,
                    duration: 2,
                  },
                },
              },
            }}
            className="absolute inset-0 -z-20">
            {/* Plavkasti glow efekat iza slike */}
            <div className="absolute inset-x-0 top-20 w-full h-[400px] bg-gradient-to-b from-[#EFF6FF]/40 via-transparent to-transparent rounded-full blur-3xl z-10" />
            
            {/* Animated Grid Pattern behind the dashboard image */}
            <div className="absolute inset-x-0 top-20 p-4 z-15">
              <div className="relative max-w-4xl mx-auto">
                <AnimatedGridPattern
                  numSquares={15}
                  maxOpacity={0.08}
                  duration={8}
                  repeatDelay={3}
                  width={80}
                  height={80}
                  className={cn(
                    "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                    "absolute inset-0 rounded-2xl",
                  )}
                />
              </div>
            </div>
            
            <div className="absolute inset-x-0 top-20 p-4 z-20">
              {/* Plavkasti glow oko slike */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#EFF6FF]/30 via-transparent to-[#EFF6FF]/30 rounded-2xl blur-xl" />
              <img
                src="/images/doktori-dashboard.png"
                alt="Odontoa Dashboard"
                className="relative w-full h-auto rounded-2xl border border-[#DBEAFE]/50 shadow-[0_0_50px_rgba(2,132,199,0.25)] drop-shadow-[0_0_30px_rgba(2,132,199,0.15)] max-w-4xl mx-auto"
                width="3276"
                height="4095"
              />
            </div>
          </AnimatedGroup>
          <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                <h1 className="mt-8 max-w-4xl mx-auto text-balance text-foreground font-normal">
                  Upravljajte ordinacijom<br />
                  bez stresa
                </h1>
                <div className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
                  <p>Kompletno rešenje za stomatološke prakse - automatsko zakazivanje, digitalni kartoni i pregled stanja u realnom vremenu.</p>
                  <p className="mt-2 font-medium">Sve na jednom mestu.</p>
                </div>
              </AnimatedGroup>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                <div
                  key={1}
                  className="bg-foreground/10 rounded-lg border p-0.5 w-full max-w-xs md:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-lg px-5 py-3 text-base text-white h-auto w-full">
                    <Link href="#demo">
                      <span className="text-nowrap text-white">Zakaži demo</span>
                      <ArrowRight className="ml-2 h-4 w-4 text-white" />
                    </Link>
                  </Button>
                </div>
                <Button
                  key={2}
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-5 h-12">
                  <Link href="#features">
                    <span className="text-nowrap">
                      Pogledaj kako radi
                    </span>
                  </Link>
                </Button>
              </AnimatedGroup>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-8 flex flex-col items-center justify-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="font-medium text-foreground">4.9+</span>
                  <AnimatedTooltip items={dentistAvatars} />
                </div>
                <span className="text-muted-foreground text-sm">Razvijeno uz podršku stomatologa širom regiona</span>
              </AnimatedGroup>
            </div>
          </div>

      {/* Tekst iznad slike */}
      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.75,
              },
            },
          },
          ...transitionVariants,
        }}
        className="text-center mt-16 mb-8">
        <h2 className="text-2xl md:text-3xl font-normal text-foreground">
          Kompletan pregled rada ordinacije, u realnom vremenu.
        </h2>
      </AnimatedGroup>

      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.75,
              },
            },
          },
          ...transitionVariants,
        }}>
        <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
          <div
            aria-hidden
            className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
          />
          <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
            <img
              className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
              src="/images/odontoa dashboard.png"
              alt="Odontoa Dashboard Screenshot"
              width="2700"
              height="1440"
            />
            <img
              className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
              src="/images/odontoa dashboard.png"
              alt="Odontoa Dashboard Screenshot"
              width="2700"
              height="1440"
            />
          </div>
        </div>
      </AnimatedGroup>

      {/* Metrics Section - ispod glavne slike */}
      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-primary mb-4 mx-auto" />
            <h3 className="text-3xl md:text-4xl font-normal text-foreground mb-2">
              <CountUp
                end={120}
                duration={2.5}
                separator=","
                enableScrollSpy
                scrollSpyOnce
              />
              <span className="text-xl md:text-2xl font-normal">
                {" "}minuta dnevno uštede
              </span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Vreme koje uštedete na telefonskim pozivima i vođenju papirnih kartona
            </p>
          </div>
          
          <div className="text-center relative">
            <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            <Bell className="w-8 h-8 text-primary mb-4 mx-auto" />
            <h3 className="text-3xl md:text-4xl font-normal text-foreground mb-2">
              <CountUp
                end={3}
                duration={2.5}
                separator=","
                enableScrollSpy
                scrollSpyOnce
              />
              <span className="text-xl md:text-2xl font-normal">
                x više pacijenata se vraća
              </span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Jer ih automatski podsetimo na kontrole i čišćenje zuba
            </p>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-primary mb-4 mx-auto" />
            <h3 className="text-3xl md:text-4xl font-normal text-foreground mb-2">
              <CountUp
                end={92}
                duration={2.5}
                separator=","
                enableScrollSpy
                scrollSpyOnce
              />
              <span className="text-xl md:text-2xl font-normal">
                % manje propuštenih termina
              </span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Zahvaljujući pametnom SMS/email sistemu podsetnika
            </p>
          </div>
        </div>
      </div>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
