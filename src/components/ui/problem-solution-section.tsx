"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-normal text-zinc-900 dark:text-zinc-50">
            Prepoznajete li ove probleme?
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed text-center">
            Većina stomatologa se suočava sa istim izazovima. Evo kako Odontoa automatski rešava sve ove probleme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Problems Card */}
          <div
            className={cn(
              "relative group backdrop-blur-sm",
              "rounded-3xl transition-all duration-300",
              "flex flex-col",
              "bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-400/[0.15] border-blue-200 dark:border-blue-400/20",
              "border shadow-md",
              "hover:translate-y-0 hover:shadow-lg",
            )}
          >
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400">
                  <X className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                    Problemi
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100 mb-4">
                  Trenutno stanje
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Svakodnevni izazovi sa kojima se suočavaju stomatološke ordinacije.
                </p>
              </div>

              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                      {problem.title}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white text-zinc-900 border-zinc-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 rounded-xl px-5 h-12"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Saznajte više o problemima
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>

          {/* Solutions Card */}
          <div
            className={cn(
              "relative group backdrop-blur-sm",
              "rounded-3xl transition-all duration-300",
              "flex flex-col",
              "bg-gradient-to-b from-cyan-50/80 to-transparent dark:from-cyan-400/[0.15] border-cyan-200 dark:border-cyan-400/20",
              "border shadow-md",
              "hover:translate-y-0 hover:shadow-lg",
            )}
          >
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-400">
                  <CheckIcon className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700">
                    Rešenja
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100 mb-4">
                  Sa Odontoa sistemom
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Automatska rešenja koja transformišu vašu ordinaciju.
                </p>
              </div>

              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="border-l-4 border-cyan-200 pl-4">
                    <h4 className="text-lg font-normal text-zinc-900 dark:text-zinc-100 mb-2">
                      {solution.title}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <Button
                size="lg"
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl px-5 text-base h-12"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Rešite sada
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