'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, BadgeCheck, Zap } from 'lucide-react';

// ── Colors (Dentino palette — matches DashboardMockupA) ──
const C = {
  navy:   '#1B2B6B',
  bg:     '#EEF0F8',
  border: '#F1F5F9',
  chart:  '#2563EB',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';
const AVATAR = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&facepad=2';

// ── Stats ──────────────────────────────────────
const STATS = [
  { value: '18', label: 'termina',  Icon: Clock3,     bg: C.navy    },
  { value: '5',  label: 'završeno', Icon: BadgeCheck,  bg: '#10B981' },
  { value: '1',  label: 'u toku',   Icon: Zap,         bg: '#F59E0B' },
];

// ── Appointments ───────────────────────────────
const APPOINTMENTS = [
  { time: '09:00', name: 'Ana Petrović',     proc: 'Preventivni pregled', status: 'Završeno', active: false },
  { time: '10:30', name: 'Marko Ilić',       proc: 'Plomba',              status: 'U toku',   active: true  },
  { time: '12:00', name: 'Jelena Marković',  proc: 'Kontrola',            status: 'Zakazano', active: false },
  { time: '14:15', name: 'Stefan Jovanović', proc: 'Konsultacija',        status: 'Zakazano', active: false },
];

const CHIP: Record<string, { bg: string; color: string }> = {
  Završeno: { bg: '#ECFDF5', color: '#059669' },
  'U toku': { bg: '#FFFBEB', color: '#D97706' },
  Zakazano: { bg: '#EFF6FF', color: C.navy },
};

// ── Component ──────────────────────────────────
const DashboardMockupB = () => (
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
          <CalendarDays className="h-2.5 w-2.5 text-white" />
        </div>
        <div>
          <div className="text-[9px] font-bold text-slate-900 leading-tight">Dnevni tok rada</div>
          <div className="text-[6px] text-slate-400 leading-tight">Utorak, 21. jan 2025.</div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50">
        <div className="w-1 h-1 rounded-full bg-emerald-500" />
        <span className="text-[6px] font-medium text-emerald-700">Aktivna</span>
      </div>
    </header>

    {/* Content */}
    <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-0 overflow-hidden">

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-lg px-2 py-1.5 flex items-center gap-1.5" style={{ boxShadow: SHADOW }}>
            <div
              className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}
            >
              <s.Icon className="h-2.5 w-2.5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-900 leading-none">{s.value}</div>
              <div className="text-[6.5px] text-slate-400 leading-none mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment list card */}
      <div className="bg-white rounded-lg flex-1 min-h-0 flex flex-col overflow-hidden" style={{ boxShadow: SHADOW }}>
        <div
          className="flex items-center justify-between px-2 pt-1.5 pb-1 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-1">
            <CalendarDays className="h-2.5 w-2.5" style={{ color: C.navy }} />
            <span className="text-[8px] font-bold text-slate-900">Današnji termini</span>
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
          {APPOINTMENTS.map((appt) => (
            <motion.div
              key={appt.time}
              variants={{ hidden: { opacity: 0, x: -4 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex items-center gap-1.5 mx-1.5 rounded-lg flex-shrink-0 ${
                appt.active ? 'px-2 py-2 my-0.5' : 'px-2 py-1.5'
              }`}
              style={
                appt.active
                  ? { background: C.navy, boxShadow: '0 4px 14px rgba(27,43,107,0.25)' }
                  : { borderBottom: `1px solid ${C.border}` }
              }
            >
              <span className={`text-[6.5px] w-[24px] flex-shrink-0 tabular-nums font-medium ${
                appt.active ? 'text-white/60' : 'text-slate-400'
              }`}>
                {appt.time}
              </span>
              <img
                src={AVATAR}
                alt={appt.name}
                className={`${appt.active ? 'h-5 w-5' : 'h-4 w-4'} rounded-full object-cover flex-shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <div className={`${appt.active ? 'text-[7.5px]' : 'text-[7px]'} font-semibold leading-tight truncate ${
                  appt.active ? 'text-white' : 'text-slate-900'
                }`}>
                  {appt.name}
                </div>
                <div className={`text-[6px] leading-tight truncate ${
                  appt.active ? 'text-white/55' : 'text-slate-400'
                }`}>
                  {appt.proc}
                </div>
              </div>
              <span
                className="flex-shrink-0 px-1 py-px rounded-full text-[5px] font-semibold"
                style={
                  appt.active
                    ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
                    : { background: CHIP[appt.status]?.bg, color: CHIP[appt.status]?.color }
                }
              >
                {appt.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  </div>
);

export default DashboardMockupB;
