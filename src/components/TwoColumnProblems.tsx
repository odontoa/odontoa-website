'use client';

import Link from "next/link";
import Image from "next/image";
import { Check, X, BarChart3, Clock, Star, ArrowRight, AlertTriangle } from "lucide-react";

function PillSm({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-2.5 py-0.5 text-xs leading-5">
      {children}
    </span>
  );
}

function AvatarStack() {
  const items = ["/avatars/doc1.jpg","/avatars/doc2.jpg","/avatars/doc3.jpg"];
  return (
    <div className="flex -space-x-2">
      {items.map((src, i) => (
        <span key={i} className="inline-block h-6 w-6 overflow-hidden rounded-full ring-2 ring-white">
          <Image src={src} alt="" width={24} height={24} />
        </span>
      ))}
    </div>
  );
}

export default function TwoColumnProblems() {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-50">
            Prepoznajete li ove probleme?
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Šta se gubi bez Odontoa i šta dobijate kada ga uključite.
          </p>
        </header>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
          {/* Leva kartica */}
          <div className="h-full rounded-2xl border border-rose-200/60 bg-rose-50/60 p-6 md:p-8 flex flex-col">
            <div className="mb-3 inline-flex w-fit items-center rounded-full bg-rose-100/80 text-rose-700 px-2.5 py-0.5 text-xs shadow-sm">
              Bez automatizacije
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-5">
              Trenutno stanje u ordinacijama
            </h3>

            {/* TAGOVI: 2 uredna reda (grid), kontrolisan max width da ne odu u jedan red */}
            <div className="mb-5 grid grid-cols-2 gap-2 max-w-md">
              <PillSm><AlertTriangle className="h-3.5 w-3.5" /> Bez podsetnika</PillSm>
              <PillSm><AlertTriangle className="h-3.5 w-3.5" /> Ručno zakazivanje</PillSm>
              <PillSm><AlertTriangle className="h-3.5 w-3.5" /> Papirna dokumentacija</PillSm>
              {/* prazan "spacer" za balans u 2 reda na manjim širinama, može i da se ukloni */}
              <span className="hidden sm:block" />
            </div>

            {/* 5 tačaka */}
            <ul className="space-y-3 text-zinc-800">
              {[
                "15–20% propuštenih termina zbog izostanaka bez podsetnika",
                "Sati izgubljeni na papire i ručno zakazivanje",
                "Nepregledni kartoni i spora pretraga podataka",
                "Nesporazumi sa tehničarima i fragmentisana komunikacija",
                "Papirne liste zaliha → nestašice ili višak",
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <X className="mt-0.5 h-5 w-5 text-rose-600 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA u istoj liniji (oba footera imaju mt-auto) */}
            <div className="mt-auto pt-6">
              <Link
                href="/blog/problemi-u-ordinaciji"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-zinc-900 hover:bg-white"
              >
                Saznajte više o problemima
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Desna kartica */}
          <div className="h-full rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-6 md:p-8 flex flex-col">
            <div className="mb-3 inline-flex w-fit items-center rounded-full bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 text-xs shadow-sm">
              Rezultati sa Odontoa
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-5">
              Sa Odontoa sistemom
            </h3>

            {/* KPI chips (2 reda kad zatreba) */}
            <div className="mb-5 grid grid-cols-2 gap-2 max-w-md">
              <PillSm><BarChart3 className="h-3.5 w-3.5" /> <strong>−15–20%</strong> no-show</PillSm>
              <PillSm><Clock className="h-3.5 w-3.5" /> <strong>&lt; 20s</strong> zakazivanje</PillSm>
              <PillSm><Clock className="h-3.5 w-3.5" /> <strong>1–3 dana</strong> implementacija</PillSm>
              <span className="hidden sm:block" />
            </div>

            {/* 5 tačaka – simetrija sa levom */}
            <ul className="space-y-3 text-zinc-800">
              {[
                "Automatski SMS/Email podsetnici (manje izostanaka)",
                "Zakazivanje u par klikova (prosek < 20s)",
                "Digitalni kartoni + brza pretraga (sve na jednom mestu)",
                "Centralizovana komunikacija sa tehničarima (manje grešaka)",
                "Finansijski dashboard i automatsko praćenje zaliha (uvek znate stanje)",
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA + trust ispod; CTA će biti poravnat sa levim jer su oba footera mt-auto */}
            <div className="mt-auto pt-6">
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
              >
                Zakažite demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="mt-3 flex items-center gap-3 text-sm text-zinc-700">
                <AvatarStack />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <span className="text-zinc-600">
                  Ocena <strong>4.9/5</strong> na osnovu <strong>120+</strong> preporuka
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}