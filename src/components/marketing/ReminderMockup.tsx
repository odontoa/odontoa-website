'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';

// ── Dentino palette ─────────────────────────────
const C = {
  navy:   '#1B2B6B',
  bg:     '#EEF0F8',
  border: '#F1F5F9',
  chart:  '#2563EB',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';
const AVATAR = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&facepad=2';

// ── Stats ───────────────────────────────────────
const STATS = [
  { value: '12', label: 'poslato',     bg: '#10B981', Icon: CheckCircle2 },
  { value: '3',  label: 'na čekanju',  bg: '#F59E0B', Icon: Clock3       },
  { value: '0',  label: 'neuspešno',   bg: '#EF4444', Icon: AlertCircle  },
];

// ── Reminders ───────────────────────────────────
type Reminder = {
  time: string;
  name: string;
  message: string;
  status: 'Poslato' | 'Na čekanju';
};

const REMINDERS: Reminder[] = [
  { time: '08:30', name: 'Ana Petrović',     message: 'Termin 15. dec u 14:30 — Dr. Nikolić',  status: 'Poslato'     },
  { time: '09:00', name: 'Marko Ilić',       message: 'Termin 15. dec u 10:30 — Čišćenje',     status: 'Poslato'     },
  { time: '10:15', name: 'Jelena Marković',  message: 'Termin 16. dec u 12:00 — Kontrola',     status: 'Na čekanju'  },
  { time: '11:00', name: 'Stefan Jovanović', message: 'Termin 16. dec u 14:15 — Konsultacija', status: 'Poslato'     },
];

const CHIP: Record<string, { bg: string; color: string }> = {
  Poslato:      { bg: '#ECFDF5', color: '#059669' },
  'Na čekanju': { bg: '#FFFBEB', color: '#D97706' },
};

// ── Component ───────────────────────────────────
type ReminderMockupProps = { compact?: boolean };

export default function ReminderMockup({ compact = false }: ReminderMockupProps) {
  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>

      {/* Header */}
      <header
        className="flex-shrink-0 bg-white flex items-center justify-between px-3"
        style={{ height: 30, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: C.navy }}
          >
            <MessageSquare className="h-2.5 w-2.5 text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-900 leading-tight">Podsetnici</div>
            <div className="text-[6px] text-slate-400 leading-tight">Današnji pregled</div>
          </div>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50">
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
          <span className="text-[6px] font-medium text-emerald-700">Aktivno</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-0 overflow-hidden">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-lg px-2 py-1.5 flex items-center gap-1.5" style={{ boxShadow: SHADOW }}>
              <div
                className="h-4 w-4 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg }}
              >
                <s.Icon className="h-2 w-2 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-900 leading-none">{s.value}</div>
                <div className="text-[5.5px] text-slate-400 leading-none mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab toggle */}
        <div className="flex-shrink-0 flex items-center gap-[2px] bg-slate-100 rounded-md p-[2px]">
          <div
            className="flex-1 text-center text-[7px] font-semibold py-1 rounded text-white"
            style={{ background: C.navy }}
          >
            SMS
          </div>
          <div className="flex-1 text-center text-[7px] font-semibold py-1 rounded text-slate-500">
            Email
          </div>
        </div>

        {/* Reminder list */}
        <div className="bg-white rounded-lg flex-1 min-h-0 flex flex-col overflow-hidden" style={{ boxShadow: SHADOW }}>
          <div
            className="flex items-center justify-between px-2 pt-1.5 pb-1 flex-shrink-0"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-1">
              <MessageSquare className="h-2.5 w-2.5" style={{ color: C.navy }} />
              <span className="text-[8px] font-bold text-slate-900">SMS podsetnici</span>
            </div>
            <span className="text-[6px] font-medium" style={{ color: C.chart }}>Vidi sve</span>
          </div>

          <motion.div
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >
            {REMINDERS.map(r => (
              <motion.div
                key={r.time + r.name}
                variants={{ hidden: { opacity: 0, x: -4 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-center gap-1.5 px-2 py-1.5"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <span className="text-[6px] w-[24px] flex-shrink-0 tabular-nums font-medium text-slate-400">
                  {r.time}
                </span>
                <img
                  src={AVATAR}
                  alt={r.name}
                  className="h-4 w-4 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[7px] font-semibold text-slate-900 leading-tight truncate">
                    {r.name}
                  </div>
                  <div className="text-[5.5px] text-slate-400 leading-tight truncate">
                    {r.message}
                  </div>
                </div>
                <span
                  className="flex-shrink-0 px-1 py-px rounded-full text-[5px] font-semibold"
                  style={{ background: CHIP[r.status]?.bg, color: CHIP[r.status]?.color }}
                >
                  {r.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
