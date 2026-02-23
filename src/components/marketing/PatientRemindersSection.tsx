'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Reply,
  Mic,
} from 'lucide-react';

/* ── Dentino palette ──────────────────────────────── */
const C = {
  navy: '#1B2B6B',
  chart: '#2563EB',
} as const;

const CARD_SHADOW = '0 12px 40px rgba(15,23,42,0.12)';

/* ══════════════════════════════════════════════════════
   Section wrapper
   ══════════════════════════════════════════════════════ */
export default function PatientRemindersSection() {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Vaši pacijenti neće propustiti sledeći termin
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Automatski SMS i email podsetnici smanjuju broj propuštenih termina i
            do 90&nbsp;%. Pacijenti dobijaju jasne informacije — a vi manje
            praznih stolica.
          </p>
        </div>

        {/* ── Two-column previews ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start justify-items-center">
          <PhoneMockup isInView={isInView} />
          <EmailPreview isInView={isInView} />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   Phone / iMessage mockup
   ══════════════════════════════════════════════════════ */
function PhoneMockup({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative flex justify-center w-full max-w-[300px]">
      <div className="relative w-[260px] h-[520px] sm:w-[280px] sm:h-[560px]">
        {/* iPhone outer shell */}
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 border-[3px] border-slate-900/50 shadow-[0_24px_60px_rgba(0,0,0,0.25),inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

        {/* Inner bezel */}
        <div className="absolute inset-[8px] rounded-[34px] bg-slate-900/20 overflow-hidden">
          {/* Screen */}
          <div className="absolute inset-[2px] rounded-[32px] bg-white overflow-hidden flex flex-col">
            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black/90 z-30" />

            {/* Status bar */}
            <div className="relative z-20 flex items-center justify-between px-5 pt-4 h-10 text-[10px] font-semibold text-slate-900 flex-shrink-0">
              <span>9:41</span>
              <span className="text-[9px]">100 %</span>
            </div>

            {/* iMessage contact header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 flex-shrink-0">
              <ChevronLeft className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-slate-900">Odontoa</span>
              <MoreVertical className="h-4 w-4 text-slate-500" strokeWidth={2} />
            </div>

            {/* Chat bubbles — pb-14 reserves space for input bar */}
            <div className="flex-1 overflow-hidden px-3 pt-4 pb-14 space-y-2.5">
              {/* Single Odontoa message */}
              <ChatBubble
                from="odontoa"
                text="Podsetnik: termin 15. dec u 14:30 (Dr. Ana Nikolić). Adresa: Knez Mihailova 15. Molimo dođite 10 min ranije."
                delay="0.2s"
                isInView={isInView}
              />

              {/* Patient reply */}
              <div className="flex justify-end">
                <ChatBubble
                  from="patient"
                  text="Hvala, dolazim!"
                  delay="0.8s"
                  isInView={isInView}
                />
              </div>
            </div>

            {/* iMessage input bar — pinned to bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-2 bg-white border-t border-slate-200/70 flex items-center gap-1.5">
              {/* + circle */}
              <div className="h-7 w-7 rounded-full border border-slate-300 text-slate-400 text-base flex items-center justify-center flex-shrink-0 leading-none">
                +
              </div>
              {/* Input pill */}
              <div className="flex-1 h-7 rounded-full bg-white border border-slate-300 px-3 flex items-center">
                <span className="text-[10px] text-slate-400">iMessage</span>
              </div>
              {/* Mic */}
              <Mic className="h-4 w-4 text-slate-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat bubble — native iMessage styling ── */
function ChatBubble({
  from,
  text,
  delay,
  isInView,
}: {
  from: 'odontoa' | 'patient';
  text: string;
  delay: string;
  isInView: boolean;
}) {
  const isPatient = from === 'patient';
  return (
    <div
      className={[isInView ? 'rm-anim-pop' : 'opacity-0', isPatient ? 'flex justify-end' : ''].join(' ')}
      style={{ animationDelay: isInView ? delay : '0s' }}
    >
      <div
        className={[
          isPatient ? 'max-w-[78%]' : 'max-w-[88%]',
          'rounded-2xl px-3 py-2 text-[11px] leading-relaxed',
          isPatient ? 'text-white' : 'text-slate-900',
        ].join(' ')}
        style={{
          background: isPatient ? '#007AFF' : '#E9E9EB',
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Email preview — Gmail reading pane style
   ══════════════════════════════════════════════════════ */
function EmailPreview({ isInView }: { isInView: boolean }) {
  return (
    <div
      className={[isInView ? 'rm-anim-fade' : 'opacity-0', 'w-full max-w-[480px]'].join(' ')}
      style={{ animationDelay: isInView ? '0.15s' : '0s' }}
    >
      <div
        className="rounded-2xl bg-white border border-slate-200/60 overflow-hidden"
        style={{ boxShadow: CARD_SHADOW }}
      >

        {/* ── Reading pane header (← Inbox  ⋮) ── */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            <span className="text-xs text-slate-500">Inbox</span>
          </div>
          <MoreVertical className="h-4 w-4 text-slate-400" strokeWidth={2} />
        </div>

        {/* ── Od (From) row ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
          <span className="text-xs text-slate-400 w-5 flex-shrink-0">Od</span>
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              style={{ background: C.navy }}
            >
              O
            </div>
            <span className="text-xs font-medium text-slate-800">OrthoSmile</span>
            <span className="text-xs text-slate-400">podsetnici@orthosmile.com</span>
          </div>
        </div>

        {/* ── Za (To) row ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
          <span className="text-xs text-slate-400 w-5 flex-shrink-0">Za</span>
          <div className="flex items-center gap-1.5 flex-1 flex-wrap">
            <RecipientChip initials="MP" name="marko.p@gmail.com" color="bg-blue-100 text-blue-700" />
          </div>
        </div>

        {/* ── Subject — text-lg, Gmail-tight spacing ── */}
        <div className="px-4 pt-3 pb-1">
          <div className="text-lg font-semibold text-slate-900 leading-snug">
            Podsetnik za termin — 15. decembar u 14:30
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-4 pt-3 pb-4 space-y-3">
          <p className="text-sm text-slate-700">Poštovani Marko,</p>
          <p className="text-sm text-slate-700">
            Vaš termin je zakazan za{' '}
            <span className="font-semibold text-slate-900">15. decembar u 14:30</span>{' '}
            kod <span className="font-semibold text-slate-900">Dr. Ane Nikolić</span>.
          </p>

          {/* Detail card */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/60 px-3 py-2.5 space-y-1.5">
            {[
              { label: 'Zahvat',   value: 'Preventivni pregled' },
              { label: 'Trajanje', value: '~45 min' },
              { label: 'Lokacija', value: 'Knez Mihailova 15' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{r.label}</span>
                <span className="text-xs font-medium text-slate-900">{r.value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Napomena:</span>{' '}
            Molimo dođite 10 min ranije. Slobodni slotovi: 10:00, 16:30.
          </p>

          <p className="text-sm text-slate-700 pt-1">
            Srdačno,<br />
            <span className="font-medium text-slate-900">Tim OrthoSmile</span>
          </p>
        </div>

        {/* ── Gmail-style muted footer actions ── */}
        <div className="px-4 pb-4 flex items-center gap-4 border-t border-slate-100 pt-3">
          <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
            <Reply className="h-3 w-3" />
            Odgovori
          </button>
          <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Prosledi
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Recipient chip ── */
function RecipientChip({
  initials,
  name,
  color,
}: {
  initials: string;
  name: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 border border-slate-200/60">
      <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${color}`}>
        {initials}
      </div>
      <span className="text-xs text-slate-700">{name}</span>
    </div>
  );
}
