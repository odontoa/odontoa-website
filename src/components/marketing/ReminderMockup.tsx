"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  CalendarDays,
  MapPin,
  Phone,
  User,
  Stethoscope,
  ClipboardList,
  Wifi,
  Battery,
  ChevronLeft,
  MoreVertical,
  Minus,
  Square,
  X,
} from "lucide-react";

type ReminderMockupProps = {
  compact?: boolean; // za boxed sekcije
};

export default function ReminderMockup({ compact = false }: ReminderMockupProps) {
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

  return (
    <div ref={containerRef} className="relative w-full bg-transparent">
      {/* Subtle background mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full px-4">
        <div
          className={[
            "grid items-center",
            "grid-cols-1 lg:grid-cols-[minmax(360px,460px)_minmax(520px,1fr)]",
            compact ? "gap-6" : "gap-8",
          ].join(" ")}
        >
          {/* LEFT: iPhone SMS mock */}
          <DevicePhone compact={compact} isInView={isInView} />

          {/* RIGHT: Email mock with glass effect */}
          <div className={compact ? "" : "lg:-ml-4 xl:-ml-6"}>
            <DeviceLaptop compact={compact} isInView={isInView} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DevicePhone({ compact, isInView }: { compact: boolean; isInView: boolean }) {
  return (
    <div className={["relative flex justify-center", compact ? "py-0" : "py-2"].join(" ")}>
      <div
        className={[
          "relative",
          compact ? "w-[360px]" : "w-[390px]",
          compact ? "h-[740px]" : "h-[820px]",
        ].join(" ")}
      >
        {/* iPhone frame - outer shell */}
        <div className="absolute inset-0 rounded-[48px] bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 border-4 border-slate-900/50 shadow-[0_30px_80px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
        
        {/* inner bezel */}
        <div className="absolute inset-[12px] rounded-[40px] bg-slate-900/20 overflow-hidden">
          {/* screen */}
          <div className="absolute inset-[2px] rounded-[38px] bg-white overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full bg-black/90 z-30 shadow-lg" />
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 px-5 pt-5 flex items-center justify-between text-[11px] font-semibold text-slate-900 z-20">
              {/* Left: Time */}
              <div className="text-slate-900 font-semibold">9:41</div>
              
              {/* Right: Battery */}
              <div className="flex items-center">
                {/* Battery - iPhone style */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {/* Battery body */}
                    <div className="w-7 h-3.5 border-[1.5px] border-slate-900 rounded-[2px]">
                      <div className="w-[22px] h-2 bg-slate-900 rounded-[1px] m-0.5" />
                    </div>
                    {/* Battery tip */}
                    <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-0.5 h-2 border-r-[1.5px] border-slate-900 rounded-r-[1px]" />
                  </div>
                  <span className="text-[11px] text-slate-900 font-semibold leading-none">100%</span>
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="pt-14 pb-3 px-4 border-b border-slate-200/60 bg-white">
              <div className="flex items-center justify-between">
                <button className="h-8 w-8 flex items-center justify-center -ml-1">
                  <ChevronLeft className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
                </button>
                <div className="text-base font-semibold text-slate-900">SMS podsetnik</div>
                <button className="h-8 w-8 flex items-center justify-center">
                  <MoreVertical className="h-5 w-5 text-slate-600" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="h-full overflow-hidden bg-white pt-4 pb-24">
              <div className="px-4 space-y-3 h-full overflow-y-auto">
                <ChatBubble
                  from="odontoa"
                  delay="0.2s"
                  title="Odontoa"
                  text="Podsetnik: imate termin 15. decembra u 14:30 (Dr. Ana Nikolić)."
                  isInView={isInView}
                />
                <ChatBubble
                  from="odontoa"
                  delay="0.6s"
                  title="Odontoa"
                  text="Terapija: Preventivni pregled. Molimo dođite 10 minuta ranije."
                  isInView={isInView}
                />
                <ChatBubble
                  from="odontoa"
                  delay="1.0s"
                  title="Odontoa"
                  text="Adresa: Knez Mihailova 15, Beograd. Tel: 011/123-4567"
                  isInView={isInView}
                />

                <div className="pt-6 flex justify-end">
                  <ChatBubble
                    from="patient"
                    delay="1.4s"
                    title="Pacijent"
                    text="Hvala, vidimo se."
                    compact={true}
                    isInView={isInView}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Input Area */}
            <div className="absolute left-0 right-0 bottom-0 p-4 bg-white border-t border-slate-200/60">
              <div className="h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center px-4 text-xs text-slate-500">
                Poruka (automatski generisana)
              </div>
            </div>
          </div>
        </div>

        {/* Glass highlight effect */}
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
}

function ChatBubble({
  from,
  title,
  text,
  delay,
  compact = false,
  isInView = false,
}: {
  from: "odontoa" | "patient";
  title: string;
  text: string;
  delay: string;
  compact?: boolean;
  isInView?: boolean;
}) {
  const isPatient = from === "patient";
  return (
    <div
      className={[isInView ? "rm-anim-pop" : "opacity-0", isPatient ? "flex justify-end" : ""].join(" ")}
      style={{ animationDelay: isInView ? delay : "0s" }}
    >
      <div
        className={[
          compact ? "max-w-fit" : isPatient ? "max-w-[85%]" : "max-w-[75%]",
          "rounded-2xl border shadow-sm",
          isPatient
            ? "bg-blue-600 text-white border-blue-600/80"
            : "bg-blue-50 border-blue-200/60",
        ].join(" ")}
      >
        <div className={["px-3.5 pt-2.5 text-[11px] font-semibold", isPatient ? "text-white/90" : "text-blue-700"].join(" ")}>
          {title}
        </div>
        <div className={["px-3.5 pb-3 text-[13px] leading-relaxed", compact ? "whitespace-nowrap" : "", isPatient ? "text-white" : "text-slate-800"].join(" ")}>
          {text}
        </div>
      </div>
    </div>
  );
}

function DeviceLaptop({ compact, isInView }: { compact: boolean; isInView: boolean }) {
  return (
    <div className={["relative flex justify-center", compact ? "py-0" : "py-2"].join(" ")}>
      <div className={["relative w-full", compact ? "max-w-[520px]" : "max-w-[600px]"].join(" ")}>
        {/* Glass window with frosted effect */}
        <div className="relative rounded-2xl border border-white/40 bg-white/55 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden ring-1 ring-white/20">
          {/* Window Chrome - Top Bar */}
          <div className={["h-10 px-4 flex items-center justify-between bg-white/30 backdrop-blur-sm", isInView ? "rm-anim-fade" : "opacity-0"].join(" ")}
               style={{ animationDelay: isInView ? "0.1s" : "0s" }}>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Mail className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Podsetnik za termin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="h-5 w-5 rounded flex items-center justify-center hover:bg-slate-200/50 transition-colors">
                <Minus className="h-3 w-3 text-slate-600" strokeWidth={2.5} />
              </button>
              <button className="h-5 w-5 rounded flex items-center justify-center hover:bg-slate-200/50 transition-colors">
                <Square className="h-2.5 w-2.5 text-slate-600" strokeWidth={2.5} />
              </button>
              <button className="h-5 w-5 rounded flex items-center justify-center hover:bg-red-200/50 transition-colors">
                <X className="h-3 w-3 text-slate-600" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Email Content */}
          <div className={["p-5", compact ? "sm:p-4" : "sm:p-5"].join(" ")}>
            {/* Reminder highlight box */}
            <div className={[isInView ? "rm-anim-fade" : "opacity-0", "rounded-xl border border-blue-200/50 bg-blue-50/40 p-4 mb-4"].join(" ")}
                 style={{ animationDelay: isInView ? "0.25s" : "0s" }}>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100/80 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 mb-1 uppercase tracking-wide">EMAIL PODSETNIK</div>
                  <div className="text-sm text-slate-700 leading-relaxed break-words">
                    Poštovani Marko Petroviću, ovo je podsetnik da imate zakazan stomatološki termin.
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <InfoCard
              delay="0.35s"
              title="Detalji termina"
              icon={<ClipboardList className="h-4 w-4 text-blue-600" />}
              rows={[
                { label: "Datum:", value: "15. decembar 2024." },
                { label: "Vreme:", value: "14:30" },
                { label: "Stomatolog:", value: "Dr. Ana Nikolić" },
                { label: "Vrsta zahvata:", value: "Preventivni pregled" },
                { label: "Tretman:", value: "Pregled i čišćenje zuba" },
                { label: "Stolica:", value: "Stolica 2" },
              ]}
              isInView={isInView}
            />

            {/* Preparation Notes */}
            <SimpleCard
              delay="0.45s"
              title="Napomene za pripremu"
              text="Molimo vas da dođete 10 minuta pre zakazanog termina radi administrativne pripreme."
              isInView={isInView}
            />

            {/* Contact */}
            <InfoCard
              delay="0.55s"
              title="Kontakt i lokacija"
              icon={<MapPin className="h-4 w-4 text-blue-600" />}
              rows={[
                { label: "Klinika:", value: "OrthoSmile" },
                { label: "Adresa:", value: "Knez Mihailova 15, 11000 Beograd" },
                { label: "Telefon:", value: "011/123-4567" },
              ]}
              isInView={isInView}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  rows,
  delay,
  isInView = false,
}: {
  title: string;
  icon: React.ReactNode;
  rows: { label: string; value: string }[];
  delay: string;
  isInView?: boolean;
}) {
  return (
    <div className={[isInView ? "rm-anim-fade" : "opacity-0", "mb-4 rounded-xl border border-slate-200/50 bg-white/40 p-4"].join(" ")} 
         style={{ animationDelay: isInView ? delay : "0s" }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-7 w-7 rounded-lg bg-blue-50/80 flex items-center justify-center">{icon}</div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
      </div>

      <div className="space-y-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-4">
            <div className="text-slate-600">{r.label}</div>
            <div className="text-slate-900 font-semibold text-right">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleCard({
  title,
  text,
  delay,
  isInView = false,
}: {
  title: string;
  text: string;
  delay: string;
  isInView?: boolean;
}) {
  return (
    <div className={[isInView ? "rm-anim-fade" : "opacity-0", "mb-4 rounded-xl border border-blue-200/50 bg-blue-50/30 p-4"].join(" ")} 
         style={{ animationDelay: isInView ? delay : "0s" }}>
      <div className="text-sm font-semibold text-slate-900 mb-1.5">{title}</div>
      <div className="text-sm text-slate-700 leading-relaxed">{text}</div>
    </div>
  );
}

