"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProblemSolutionItem {
  title: string
  description: string
  type: 'problem' | 'solution'
}

interface ProblemSolutionSectionProps {
  problems: ProblemSolutionItem[]
  solutions: ProblemSolutionItem[]
  className?: string
}

function ProblemSolutionSection({ problems, solutions, className }: ProblemSolutionSectionProps) {
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 mb-12">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/images/Odontoa - logo pack/Full_logo_horizontal_color.png"
              alt="Odontoa Logo"
              width={200}
              height={60}
              className="h-auto"
              priority
            />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-normal text-zinc-900 dark:text-zinc-50">
            Prepoznajete li ove probleme?
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed text-center">
            Većina stomatologa se suočava sa istim izazovima. Evo kako Odontoa automatski rešava sve ove probleme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Problems Card - Red tones */}
          <div
            className={cn(
              "relative group backdrop-blur-sm",
              "rounded-3xl transition-all duration-300",
              "flex flex-col",
              "bg-gradient-to-b from-red-50/80 to-transparent dark:from-red-400/[0.15] border-red-200 dark:border-red-400/20",
              "border shadow-md",
              "hover:translate-y-0 hover:shadow-lg",
            )}
          >
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400">
                  <X className="w-7 h-7" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100 mb-4">
                  Trenutno stanje
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Svakodnevni izazovi u ordinacijama:
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-red-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Prekidi tokom rada zbog poziva
                  </h4>
                </div>
                <div className="border-l-4 border-red-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Administracija i papiri oduzimaju sate
                  </h4>
                </div>
                <div className="border-l-4 border-red-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    15–20% prihoda nestaje zbog propuštenih termina
                  </h4>
                </div>
                <div className="border-l-4 border-red-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Teško praćenje pacijenata i terapija
                  </h4>
                </div>
                <div className="border-l-4 border-red-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Nesporazumi sa tehničarima
                  </h4>
                </div>
                <div className="border-l-4 border-red-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Papirne liste zaliha → nestašice ili višak
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white text-zinc-900 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 rounded-xl px-5 h-12"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Saznajte više o problemima
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>

          {/* Solutions Card - Green tones */}
          <div
            className={cn(
              "relative group backdrop-blur-sm",
              "rounded-3xl transition-all duration-300",
              "flex flex-col",
              "bg-gradient-to-b from-green-50/80 to-transparent dark:from-green-400/[0.15] border-green-200 dark:border-green-400/20",
              "border shadow-md",
              "hover:translate-y-0 hover:shadow-lg",
            )}
          >
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400">
                  <CheckIcon className="w-7 h-7" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100 mb-4">
                  Sa Odontoa sistemom
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Automatska rešenja za digitalnu praksu:
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Zakazivanje u par klikova, bez grešaka
                  </h4>
                </div>
                <div className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Automatski SMS/Email podsetnici
                  </h4>
                </div>
                <div className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Digitalni kartoni i brza pretraga podataka
                  </h4>
                </div>
                <div className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Kompletna evidencija pacijenta na jednom mestu
                  </h4>
                </div>
                <div className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Centralizovana komunikacija sa tehničarima
                  </h4>
                </div>
                <div className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                    Finansijski dashboard i automatsko praćenje zaliha
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <Button
                size="lg"
                className="w-full bg-green-600 text-white hover:bg-green-700 rounded-xl px-5 text-base h-12"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Zakažite demo
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolutionSection 