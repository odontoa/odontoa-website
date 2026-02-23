'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Dentino palette ─────────────────────────────
const C = {
  navy:   '#1B2B6B',
  bg:     '#EEF0F8',
  border: '#F1F5F9',
  chart:  '#2563EB',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';

// ── Types ───────────────────────────────────────
type MockSize = 'square' | 'wide';
type ApptStatus = 'Zakazano' | 'U toku' | 'Završeno' | 'Hitno';

type Appointment = {
  day: 1 | 2 | 3 | 4 | 5;
  start: string;
  slots: number;      // how many 30-min slots it spans
  patient: string;
  procedure: string;
  status: ApptStatus;
};

// ── Data ────────────────────────────────────────
const DAYS = [
  { label: 'Pon', date: '08', index: 1 },
  { label: 'Uto', date: '09', index: 2 },
  { label: 'Sre', date: '10', index: 3 },
  { label: 'Čet', date: '11', index: 4 },
  { label: 'Pet', date: '12', index: 5 },
] as const;

const TIMES = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30',
];

const APPTS: Appointment[] = [
  { day: 1, start: '08:00', slots: 2, patient: 'S. Petrović',   procedure: 'Vađenje',      status: 'Zakazano' },
  { day: 1, start: '10:00', slots: 3, patient: 'G. Simić',      procedure: 'Čišćenje',     status: 'Završeno' },
  { day: 2, start: '09:00', slots: 3, patient: 'N. Ilić',       procedure: 'Kontrola',     status: 'Hitno'    },
  { day: 2, start: '13:00', slots: 4, patient: 'D. Matić',      procedure: 'Endodoncija',  status: 'U toku'   },
  { day: 3, start: '10:00', slots: 3, patient: 'M. Jovanović',  procedure: 'Ortodoncija',  status: 'Zakazano' },
  { day: 3, start: '14:00', slots: 3, patient: 'P. Đorđević',   procedure: 'Implantati',   status: 'Zakazano' },
  { day: 4, start: '11:00', slots: 2, patient: 'J. Marić',      procedure: 'Plomba',       status: 'Zakazano' },
  { day: 4, start: '14:00', slots: 2, patient: 'S. Kovačević',  procedure: 'Konsultacija', status: 'Zakazano' },
  { day: 5, start: '09:00', slots: 3, patient: 'A. Petrović',   procedure: 'Kontrola',     status: 'Zakazano' },
];

const SC: Record<ApptStatus, { bg: string; bar: string }> = {
  Zakazano: { bg: '#EFF6FF', bar: '#3B82F6' },
  'U toku': { bg: '#F0FDFA', bar: '#14B8A6' },
  Završeno: { bg: '#ECFDF5', bar: '#10B981' },
  Hitno:    { bg: '#FEF2F2', bar: '#EF4444' },
};

function toSlot(t: string) {
  const [h, m] = t.split(':').map(Number);
  return (h - 8) * 2 + (m >= 30 ? 1 : 0);
}

// ── Component ───────────────────────────────────
export function CalendarMockup({ size = 'wide' }: { size?: MockSize }) {
  const ROW_H = 18;
  const gridH = TIMES.length * ROW_H;
  const nowSlot = toSlot('12:00');
  const nowTop = nowSlot * ROW_H;

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
            <CalendarDays className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-[9px] font-bold text-slate-900">Kalendar termina</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-slate-50 rounded-md px-1.5 py-0.5">
            <ChevronLeft className="h-2 w-2 text-slate-400" />
            <span className="text-[6.5px] font-medium text-slate-700 whitespace-nowrap">8–12. dec</span>
            <ChevronRight className="h-2 w-2 text-slate-400" />
          </div>
          <div
            className="text-[6px] font-semibold text-white px-1.5 py-0.5 rounded"
            style={{ background: C.chart }}
          >
            Nedeljni
          </div>
        </div>
      </header>

      {/* Day header row */}
      <div
        className="flex-shrink-0 grid bg-white"
        style={{
          gridTemplateColumns: '28px repeat(5, 1fr)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="px-1 py-1 flex items-center justify-center">
          <span className="text-[5.5px] font-semibold text-slate-400 uppercase">Vre.</span>
        </div>
        {DAYS.map(day => (
          <div
            key={day.index}
            className="px-1 py-1 flex items-center gap-0.5"
            style={{ borderLeft: `1px solid ${C.border}` }}
          >
            <span className="text-[6.5px] font-semibold text-slate-900">{day.label}</span>
            <span className="text-[5.5px] text-slate-400">{day.date}</span>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: '28px repeat(5, 1fr)',
            height: gridH,
          }}
        >
          {/* Time column */}
          <div className="relative bg-white" style={{ borderRight: `1px solid ${C.border}` }}>
            {TIMES.map((t, i) => (
              <div
                key={t}
                className="absolute w-full flex items-start justify-end pr-1"
                style={{ top: i * ROW_H, height: ROW_H }}
              >
                {i % 2 === 0 && (
                  <span className="text-[5px] text-slate-400 mt-px tabular-nums">{t}</span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map(day => (
            <div
              key={day.index}
              className="relative bg-white"
              style={{ borderRight: `1px solid ${C.border}` }}
            >
              {/* Row lines */}
              {TIMES.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0"
                  style={{
                    top: i * ROW_H,
                    borderTop: i > 0
                      ? `1px solid ${i % 2 === 0 ? 'rgba(15,23,42,0.06)' : 'rgba(15,23,42,0.03)'}`
                      : undefined,
                  }}
                />
              ))}

              {/* Appointment cards */}
              {APPTS.filter(a => a.day === day.index).map((a, i) => {
                const top = toSlot(a.start) * ROW_H + 1;
                const height = a.slots * ROW_H - 2;
                const s = SC[a.status];
                return (
                  <motion.div
                    key={i}
                    className="absolute left-0.5 right-0.5 rounded overflow-hidden"
                    style={{ top, height, background: s.bg }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                  >
                    <div className="flex h-full">
                      <div className="w-[3px] flex-shrink-0" style={{ background: s.bar }} />
                      <div className="flex-1 min-w-0 px-1 py-0.5 flex flex-col">
                        <span className="text-[5.5px] font-semibold text-slate-900 truncate leading-tight">
                          {a.patient}
                        </span>
                        <span className="text-[5px] text-slate-500 truncate leading-tight">
                          {a.procedure}
                        </span>
                        {a.slots >= 3 && (
                          <span
                            className="text-[4.5px] font-medium mt-auto self-start px-1 py-px rounded-full"
                            style={{ background: s.bar, color: 'white' }}
                          >
                            {a.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* Current time indicator */}
          <div
            className="absolute pointer-events-none"
            style={{ top: nowTop, left: 28, right: 0 }}
          >
            <div className="relative">
              <div className="h-px" style={{ background: 'rgba(239,68,68,0.5)' }} />
              <div
                className="absolute -top-1.5 left-1 flex items-center gap-0.5 rounded-full px-1 py-px"
                style={{ background: '#EF4444' }}
              >
                <div className="w-0.5 h-0.5 rounded-full bg-white" />
                <span className="text-[4.5px] font-semibold text-white">12:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
