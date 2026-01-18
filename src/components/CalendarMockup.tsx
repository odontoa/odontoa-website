"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Clock3, AlertCircle, BadgeCheck, Home, Users, Stethoscope, Calendar, FileText } from "lucide-react";
import Image from "next/image";

type MockSize = "square" | "wide";

type ApptStatus = "Zakazano" | "U toku" | "Završeno" | "Hitno";

type Appointment = {
  day: 1 | 2 | 3 | 4 | 5; // Ponedeljak, Utorak, Sreda, Četvrtak, Petak
  start: string; // "08:15"
  durationMin: number; // 30, 45, 60, 90
  patient: string;
  procedure: string;
  status: ApptStatus;
};

const ODONTOA_BLUE = "#2563EB";

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statusStyles(status: ApptStatus) {
  // premium, soft palettes - lighter, more healthtech feel
  switch (status) {
    case "Zakazano":
      return {
        card: "bg-blue-50/80 border-blue-200/50",
        pill: "bg-blue-500 text-white",
        icon: <Clock3 className="h-3 w-3" />,
        bar: "bg-blue-400",
      };
    case "U toku":
      return {
        card: "bg-teal-50/80 border-teal-200/50",
        pill: "bg-teal-500 text-white",
        icon: <Clock3 className="h-3 w-3" />,
        bar: "bg-teal-400",
      };
    case "Završeno":
      return {
        card: "bg-emerald-50/80 border-emerald-200/50",
        pill: "bg-emerald-500 text-white",
        icon: <BadgeCheck className="h-3 w-3" />,
        bar: "bg-emerald-400",
      };
    case "Hitno":
      return {
        card: "bg-red-50/80 border-red-200/50",
        pill: "bg-red-500 text-white",
        icon: <AlertCircle className="h-3 w-3" />,
        bar: "bg-red-400",
      };
  }
}

const TIMES = (() => {
  // 08:00 → 15:30 (zadnji slot, završava na 16:00), 30-min increments
  const start = 8 * 60;
  const end = 15.5 * 60; // 15:30 je poslednji slot, završava na 16:00
  const step = 30;
  const arr: string[] = [];
  for (let m = start; m <= end; m += step) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    arr.push(`${hh}:${mm}`);
  }
  return arr;
})();

const DAYS = [
  { label: "Ponedeljak", date: "08.12", index: 1 },
  { label: "Utorak", date: "09.12", index: 2 },
  { label: "Sreda", date: "10.12", index: 3 },
  { label: "Četvrtak", date: "11.12", index: 4 },
  { label: "Petak", date: "12.12", index: 5 },
] as const;

const MOCK_APPTS: Appointment[] = [
  // Ponedeljak (08.12)
  { day: 1, start: "08:15", durationMin: 60, patient: "Sanja Petrović", procedure: "Vađenje zuba", status: "Zakazano" },
  { day: 1, start: "09:45", durationMin: 75, patient: "Gorana Simić", procedure: "Čišćenje kamenca", status: "Završeno" },

  // Utorak (09.12)
  { day: 2, start: "09:15", durationMin: 90, patient: "Nikola Ilić", procedure: "Kontrola", status: "Hitno" },
  { day: 2, start: "10:30", durationMin: 120, patient: "Dunja Matić", procedure: "Endodoncija", status: "U toku" },

  // Sreda (10.12)
  { day: 3, start: "10:00", durationMin: 75, patient: "Marko Jovanović", procedure: "Ortodontski pregled", status: "Zakazano" },
  { day: 3, start: "12:00", durationMin: 90, patient: "Petar Đorđević", procedure: "Provera implantata", status: "Zakazano" },

  // Četvrtak (11.12)
  { day: 4, start: "11:00", durationMin: 60, patient: "Jelena Marić", procedure: "Plomba", status: "Zakazano" },
  { day: 4, start: "14:15", durationMin: 60, patient: "Stefan Kovačević", procedure: "Konsultacija", status: "Zakazano" },

  // Petak (12.12)
  { day: 5, start: "09:00", durationMin: 75, patient: "Ana Petrović", procedure: "Kontrola", status: "Zakazano" },
];

export function CalendarMockup({ size = "wide" }: { size?: MockSize }) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Once animated, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
        rootMargin: "0px 0px -100px 0px", // Start animation slightly before fully in view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const frameClass = "w-full h-full";

  const gridStartMin = 8 * 60;
  const gridEndMin = 15.5 * 60; // 15:30 je poslednji slot, završava na 16:00
  const totalMin = gridEndMin - gridStartMin;

  // each minute = px mapping for good density
  const pxPerMin = size === "square" ? 1.35 : 1.15;
  const gridHeight = Math.round(totalMin * pxPerMin);

  const rowEveryMin = 30;
  const rowHeight = rowEveryMin * pxPerMin;

  const currentTimeMin = 12 * 60; // 12:00 indicator
  const currentTop = Math.round((currentTimeMin - gridStartMin) * pxPerMin);

  return (
    <div ref={containerRef} className={`${frameClass} bg-gradient-to-b from-slate-50 to-white overflow-hidden`}>
      <div className="h-full">
        {/* Sidebar - HIDDEN */}

        {/* Main */}
        <main className="h-full bg-slate-50/50 pt-4 px-4 pb-0 overflow-hidden flex flex-col">
          {/* Top toolbar */}
          <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Title block */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-5 w-5 text-blue-700" />
                </div>
                <div className="text-lg font-semibold text-slate-900">Kalendar termina</div>
              </div>

              {/* Center: Date range pill + Danas */}
              <div className="flex-1 flex justify-center items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 h-9">
                  <button className="h-7 w-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-colors">
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <div className="px-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                    8. decembar 2025 – 13. decembar 2025
                  </div>
                  <button className="h-7 w-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-colors">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
                <button className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap">
                  Danas
                </button>
              </div>

              {/* Right: Controls group */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center rounded-xl bg-slate-100/80 border border-slate-200/60 h-9 overflow-hidden">
                  {["Dnevni", "Nedeljni"].map((v) => {
                    const active = v === "Nedeljni";
                    return (
                      <div
                        key={v}
                        className={[
                          "px-3 h-full flex items-center text-sm font-medium transition-colors cursor-pointer",
                          active
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar frame */}
          <div className="mt-3 rounded-2xl border border-slate-200/50 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
            {/* Header row (days) */}
            <div className="grid grid-cols-[100px_repeat(5,minmax(160px,1fr))] border-b border-slate-200/80 bg-slate-50">
              <div className="px-3 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Vreme</div>
              {DAYS.map((day) => (
                <div key={day.index} className="px-3 py-3.5 border-l border-slate-200/60">
                  <div className="text-sm font-semibold text-slate-900">{day.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{day.date}</div>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="relative overflow-hidden" style={{ height: gridHeight }}>
              <div className="grid grid-cols-[100px_repeat(5,minmax(160px,1fr))]" style={{ height: gridHeight }}>
                {/* Time column */}
                <div className="relative border-r border-slate-200/60 bg-white h-full">
                  <div style={{ height: gridHeight }} className="relative h-full">
                    {TIMES.map((t, idx) => (
                      <div
                        key={t}
                        className="flex items-start justify-end pr-2 text-xs text-slate-500"
                        style={{
                          position: "absolute",
                          top: idx * rowHeight,
                          height: rowHeight,
                          width: "100%",
                        }}
                      >
                        <span className="mt-1">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day columns */}
                {DAYS.map((day) => (
                  <div key={day.index} className="relative border-r border-slate-200/60 last:border-r-0 bg-white overflow-hidden h-full">
                    <div style={{ height: gridHeight }} className="relative h-full">
                      {/* Row lines */}
                      {TIMES.map((t, idx) => (
                        <div
                          key={`${day.index}-${t}`}
                          className={["absolute left-0 right-0 border-t", idx === 0 ? "border-transparent" : "border-slate-200/40"].join(" ")}
                          style={{ top: idx * rowHeight }}
                        />
                      ))}

                      {/* Subtle alternating stripes */}
                      {TIMES.map((_, idx) => (
                        idx % 2 === 1 ? (
                          <div
                            key={`stripe-${day.index}-${idx}`}
                            className="absolute left-0 right-0 bg-slate-50/30"
                            style={{ top: idx * rowHeight, height: rowHeight }}
                          />
                        ) : null
                      ))}

                      {/* Appointments */}
                      {MOCK_APPTS.filter(a => a.day === day.index).map((a, i) => {
                        const top = Math.round((toMinutes(a.start) - gridStartMin) * pxPerMin);
                        const height = Math.round(a.durationMin * pxPerMin);
                        const s = statusStyles(a.status);
                        const maxHeight = gridHeight - top - 8; // Leave 8px bottom padding
                        // Ensure minimum height for content visibility
                        const cardHeight = Math.max(Math.min(clamp(height, 90, 300), maxHeight), 90);
                        // Calculate delay based on day and index for staggered animation
                        const globalIndex = MOCK_APPTS.findIndex(apt => apt === a);
                        const animationDelay = globalIndex * 0.15; // 150ms delay between each card
                        return (
                          <div
                            key={`${day.index}-${i}`}
                            className={[
                              "absolute left-1 right-1 rounded-lg border shadow-sm",
                              isInView ? "animate-balloon-in" : "opacity-0",
                              s.card,
                            ].join(" ")}
                            style={{
                              top: Math.max(clamp(top, 4, gridHeight - 60), 4),
                              height: cardHeight,
                              minHeight: 90,
                              animationDelay: isInView ? `${animationDelay}s` : "0s",
                            }}
                          >
                            <div className={`h-full grid grid-cols-[4px_1fr]`}>
                              <div className={`${s.bar}`} />
                              <div className="p-3 flex flex-col min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1.5 flex-shrink-0">
                                  <div className="text-[11px] font-semibold text-slate-800">{a.start}</div>
                                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${s.pill}`}>
                                    {s.icon}
                                    <span className="whitespace-nowrap">{a.status}</span>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-slate-900 leading-tight mb-1">
                                  {a.patient}
                                </div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                  {a.procedure}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current time indicator (across day columns only) */}
              <div
                className="absolute left-[100px] right-0 pointer-events-none"
                style={{ top: currentTop }}
              >
                <div className="relative">
                  <div className="h-px bg-blue-500/60" />
                  <div className="absolute -top-3 left-3 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-[11px] px-2.5 py-1 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    12:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

