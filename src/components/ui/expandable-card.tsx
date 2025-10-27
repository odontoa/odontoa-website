"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MessageSquare,
  Star,
  Check,
  X as XIcon,
  BarChart3 as BarChart,
  ArrowRight,
  Play,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExpandable } from "@/components/hooks/use-expandable";

interface KPI {
  label: string;
  value: string;
}

interface BulletItem {
  text: string;
  good?: boolean;
}

interface ProjectStatusCardProps {
  title: string;
  badge: { text: string; tone: "rose" | "emerald" | "zinc" };
  kpis: KPI[];
  bullets: BulletItem[];
  trust?: { rating?: number; text?: string };
  info?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  gradientBg?: string;
}

export function ProjectStatusCard({
  title,
  badge,
  kpis,
  bullets,
  trust,
  info,
  primaryCta,
  secondaryCta,
  gradientBg,
}: ProjectStatusCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    <Card
      className={`w-full max-w-lg transition-all duration-300 hover:shadow-lg ${gradientBg || ''}`}
      onClick={toggleExpand}
    >
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={
                badge?.tone === "rose"
                  ? "bg-rose-100 text-rose-700"
                  : badge?.tone === "emerald"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-100 text-zinc-700"
              }
            >
              {badge?.text}
            </Badge>
            <h3 className="text-2xl font-semibold">{title}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* KPI pills */}
          {kpis && kpis.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-2">
              {kpis.map((kpi) => (
                <li
                  key={kpi.label}
                  className="px-2.5 py-1 rounded-full text-sm border bg-white/70 text-zinc-900 backdrop-blur-sm flex items-center gap-1"
                >
                  <BarChart className="h-4 w-4 text-zinc-600" />
                  <span className="font-medium">{kpi.value}</span>
                  <span className="text-zinc-500">{kpi.label}</span>
                </li>
              ))}
            </ul>
          )}

          <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2"
                  >
                    {/* Trust row */}
                    {(trust?.rating || trust?.text) && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        {trust?.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.round(trust.rating || 0) ? "fill-emerald-500 text-emerald-500" : "text-emerald-200"}`}
                              />
                            ))}
                          </div>
                        )}
                        {trust?.text && <span>{trust.text}</span>}
                      </div>
                    )}

                    {/* Implementation/info row */}
                    {info && info.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                        {info.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-zinc-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullets list */}
                    <ul className="mt-2 space-y-2">
                      {bullets.map((b, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2 p-2 rounded-lg bg-white/50 ${b.good ? "hover:translate-x-1 hover:shadow-sm transition" : ""}`}
                        >
                          {b.good ? (
                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                          ) : (
                            <XIcon className="mt-0.5 h-4 w-4 text-rose-500" />
                          )}
                          <span className="text-zinc-700">{b.text}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTAs */}
                    {(primaryCta || secondaryCta) && (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {primaryCta && (
                          <a
                            href={primaryCta.href}
                            className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {primaryCta.label}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        )}
                        {secondaryCta && (
                          <a
                            href={secondaryCta.href}
                            className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-zinc-900 border hover:shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {secondaryCta.label}
                            <Play className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

