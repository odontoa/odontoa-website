'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Stethoscope,
  Search, Bell,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

// ── Colors (Dentino palette) ───────────────────
const C = {
  navy:      '#1B2B6B',
  navyLight: '#EBF0FA',
  bg:        '#EEF0F8',
  border:    '#F1F5F9',
  chart:     '#2563EB',
  coralIcon: '#F87171',
  coralBg:   '#FEF2F2',
  blueIcon:  '#3B82F6',
  blueBg:    '#EFF6FF',
  tealIcon:  '#14B8A6',
  tealBg:    '#F0FDFA',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';
const AVATAR = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&facepad=2';

// ── KPI Data ───────────────────────────────────
const KPIS = [
  { value: '8',   label: 'Pacijenti danas',   Icon: Users,       color: C.coralIcon, bg: C.coralBg, round: true  },
  { value: '364', label: 'Ukupno pacijenata', Icon: Users,       color: C.blueIcon,  bg: C.blueBg,  round: false },
  { value: '6',   label: 'Doktori',           Icon: Stethoscope, color: C.tealIcon,  bg: C.tealBg,  round: false },
];

// ── Chart SVG (Dentino-style curve) ────────────
// ViewBox "0 0 260 100", chart y ∈ [8,75], x ∈ [24,248]
// vals: 5,1,8,20,23,18,15 — peak at index 4 (Pet)
const LINE =
  'M 24 61.6 C 42.7 61.6, 42.7 72.3, 61.3 72.3 ' +
  'C 80 72.3, 80 53.6, 98.7 53.6 C 117.3 53.6, 117.3 21.4, 136 21.4 ' +
  'C 154.7 21.4, 154.7 13.4, 173.3 13.4 C 192 13.4, 192 26.8, 210.7 26.8 ' +
  'C 229.3 26.8, 229.3 34.8, 248 34.8';
const AREA = `${LINE} L 248 75 L 24 75 Z`;
const DOTS = [
  { x: 24,    y: 61.6 }, { x: 61.3,  y: 72.3 }, { x: 98.7,  y: 53.6 },
  { x: 136,   y: 21.4 }, { x: 173.3, y: 13.4 }, { x: 210.7, y: 26.8 },
  { x: 248,   y: 34.8 },
];
const GRID_Y  = [21.4, 34.8, 48.2, 61.6, 75];
const Y_LABEL = ['20', '15', '10', '5', '0'];
const X_LABEL = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

// ── Patient Table ──────────────────────────────
const PATIENTS = [
  { no: '96', date: '23.10.', name: 'Ana Petrović',  member: true,  treat: 'Endodoncija'  },
  { no: '95', date: '23.10.', name: 'Marko Jović',   member: false, treat: 'Konsultacija' },
  { no: '94', date: '23.10.', name: 'Mila Savić',    member: true,  treat: 'Endodoncija'  },
];

// ── Calendar ───────────────────────────────────
const WEEK_DAYS  = ['P', 'U', 'S', 'Č', 'P', 'S', 'N'];
const WEEK_DATES = [17, 18, 19, 20, 21, 22, 23];
const TODAY = 21; // Pet — synced with chart peak marker

// ── Upcoming Appointments ──────────────────────
const APPT_GROUPS = [
  {
    day: 'Danas, 21. feb',
    items: [
      { time: '12:00', name: 'Sanja Simić',    proc: 'Kontrola',     active: false },
      { time: '14:00', name: 'Ana Petrović',   proc: 'Plomba',       active: false, badge: 'Član' },
    ],
  },
  {
    day: 'Sutra, 23. feb',
    items: [
      { time: '11:00', name: 'Jelena Marković', proc: 'Izbeljivanje', active: true,  badge: 'Član' },
      { time: '12:30', name: 'Stefan Ilić',     proc: 'Čišćenje',     active: false },
      { time: '13:45', name: 'Marko Ilić',      proc: 'Konsultacija', active: false },
    ],
  },
];

// ── Reusable appointment row ──────────────────
const ApptRow = ({ appt, delay }: { appt: typeof APPT_GROUPS[0]['items'][0]; delay: number }) => (
  <motion.div
    className={`flex items-center gap-1.5 ${appt.active ? 'px-2 py-1.5' : 'px-1.5 py-1'} mx-1 mb-0.5 rounded-lg`}
    style={appt.active
      ? { background: C.navy, boxShadow: '0 4px 14px rgba(27,43,107,0.25)' }
      : undefined}
    initial={{ opacity: 0, x: -4 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
  >
    <span className={`text-[6px] w-[22px] flex-shrink-0 tabular-nums ${appt.active ? 'text-white/60' : 'text-slate-400'}`}>
      {appt.time}
    </span>
    <img
      src={AVATAR}
      alt={appt.name}
      className={`${appt.active ? 'h-5 w-5' : 'h-4 w-4'} rounded-full object-cover flex-shrink-0`}
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-0.5">
        <span className={`${appt.active ? 'text-[7px]' : 'text-[6.5px]'} font-semibold truncate ${appt.active ? 'text-white' : 'text-slate-900'}`}>
          {appt.name}
        </span>
        {'badge' in appt && appt.badge && (
          <span
            className="text-[4.5px] font-medium px-1 py-px rounded-full flex-shrink-0"
            style={{ background: appt.active ? 'rgba(248,113,113,0.85)' : C.coralIcon, color: 'white' }}
          >
            {appt.badge}
          </span>
        )}
      </div>
      <div className={`text-[5.5px] truncate ${appt.active ? 'text-white/60' : 'text-slate-400'}`}>
        {appt.proc}
      </div>
    </div>
    <span className={`text-[7px] flex-shrink-0 ${appt.active ? 'text-white/40' : 'text-slate-300'}`}>⋮</span>
  </motion.div>
);

// ── Component ──────────────────────────────────
type DashboardMockupAProps = { variant?: 'default' | 'hero' };

const DashboardMockupA = ({ variant = 'default' }: DashboardMockupAProps) => (
  <div className="h-full flex flex-col" style={{ background: C.bg }}>

    {/* Header */}
    <header
      className="flex-shrink-0 bg-white flex items-center justify-between px-3"
      style={{ height: 32, borderBottom: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-1.5 bg-slate-50 rounded-md px-2 py-1" style={{ width: '32%' }}>
        <Search className="h-2.5 w-2.5 text-slate-400 flex-shrink-0" />
        <span className="text-[8px] text-slate-400">Pretraži...</span>
      </div>
      <div className="flex items-center gap-2.5">
        {/* Pill group: both buttons in white capsule — desktop only */}
        <div className="hidden sm:inline-flex items-center gap-[2px] bg-white rounded-full p-[2px] shadow-sm border border-slate-100">
          <div
            className="text-[6.5px] font-semibold text-white px-3 py-1.5 rounded-full"
            style={{ background: C.navy }}
          >
            + Zakaži termin
          </div>
          <div
            className="text-[6.5px] font-semibold text-white px-3 py-1.5 rounded-full"
            style={{ background: C.coralIcon }}
          >
            + Pacijent
          </div>
        </div>
        <div className="relative">
          <Bell className="h-3 w-3 text-slate-400" />
          <div className="absolute -top-0.5 -right-0.5 h-1 w-1 rounded-full" style={{ background: C.coralIcon }} />
        </div>
        {/* Doctor mini-profile — desktop only */}
        <div className="hidden sm:flex items-center gap-1">
          <img src={AVATAR} alt="Dr. Marko Petrović" className="h-5 w-5 rounded-full object-cover flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[7px] font-semibold text-slate-900 leading-tight whitespace-nowrap">Dr. Marko Petrović</div>
            <div className="text-[5.5px] text-slate-400 leading-none">Stomatolog</div>
          </div>
        </div>
      </div>
    </header>

    {/* Content area */}
    <div className="flex-1 flex flex-row gap-2 p-2 min-h-0 overflow-hidden">

      {/* ─── Center Column ─── */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">

        {/* Title */}
        <div className="flex-shrink-0">
          <span className="text-[11px] font-bold text-slate-900">Pregled klinike</span>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
          {KPIS.map(kpi => (
            <div key={kpi.label} className="bg-white rounded-lg px-2 py-1.5 flex items-center gap-1.5" style={{ boxShadow: SHADOW }}>
              <div
                className={`${kpi.round ? 'h-6 w-6 rounded-full' : 'h-5 w-5 rounded'} flex items-center justify-center flex-shrink-0`}
                style={{ background: kpi.bg }}
              >
                <kpi.Icon className={kpi.round ? 'h-3 w-3' : 'h-2.5 w-2.5'} style={{ color: kpi.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[7px] text-slate-400 leading-none truncate">{kpi.label}</div>
                <div className="text-[11px] font-bold text-slate-900 leading-none mt-0.5">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-lg flex-shrink-0" style={{ boxShadow: SHADOW }}>
          <div className="flex items-center justify-between px-2 pt-1.5">
            <span className="text-[9px] font-semibold text-slate-900">Statistika termina</span>
            <div className="flex items-center gap-1">
              <span className="text-[6.5px] text-slate-400">Oktobar 2021</span>
              <ChevronLeft className="h-2 w-2 text-slate-300" />
              <ChevronRight className="h-2 w-2 text-slate-300" />
              <span className="text-[6px] text-slate-500 bg-slate-50 px-1 py-px rounded">Nedelja</span>
            </div>
          </div>
          <motion.svg
            width="100%" viewBox="0 0 260 100" preserveAspectRatio="xMidYMid meet"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }}
          >
            <defs>
              <linearGradient id="dentinoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.chart} stopOpacity="0.10" />
                <stop offset="100%" stopColor={C.chart} stopOpacity="0.00" />
              </linearGradient>
            </defs>
            {/* Dashed marker aligned with peak dot (index 4, Pet, x=173.3) */}
            <line x1="173.3" y1="8" x2="173.3" y2="75" stroke="rgba(15,23,42,0.22)" strokeWidth="0.6" strokeDasharray="2,1.5" />
            {/* Grid lines + Y labels */}
            {GRID_Y.map((y, i) => (
              <React.Fragment key={i}>
                <line x1="24" y1={y} x2="248" y2={y} stroke="rgba(15,23,42,0.06)" strokeWidth="0.5" />
                <text x="20" y={y + 1.5} textAnchor="end" fontSize="5" fill="rgba(15,23,42,0.28)">{Y_LABEL[i]}</text>
              </React.Fragment>
            ))}
            {/* Area */}
            <motion.path d={AREA} fill="url(#dentinoGrad)"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, delay: 0.5 } } }}
            />
            {/* Line */}
            <motion.path
              d={LINE} fill="none" stroke={C.chart} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 1.2, delay: 0.2, ease: 'easeInOut' } },
              }}
            />
            {/* Dots */}
            {DOTS.map((d, i) => (
              <motion.circle
                key={i} cx={d.x} cy={d.y}
                r={i === 4 ? 3.5 : 2.2}
                fill={i === 4 ? '#F59E0B' : 'white'}
                stroke={i === 4 ? '#F59E0B' : C.chart}
                strokeWidth={i === 4 ? 0 : 1.2}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.9 + i * 0.07 } },
                }}
              />
            ))}
            {/* Tooltip at peak (index 4) */}
            <motion.g variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3, delay: 1.3 } } }}>
              <rect x="152" y="2" width="42" height="9" rx="3" fill={C.navy} />
              <text x="173" y="8.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="white">41 termin</text>
            </motion.g>
            {/* X labels */}
            {X_LABEL.map((l, i) => (
              <text key={i} x={DOTS[i].x} y="86" textAnchor="middle" fontSize="5" fill="rgba(15,23,42,0.28)">{l}</text>
            ))}
          </motion.svg>
        </div>

        {/* Patient Table — desktop only, hidden in hero variant */}
        <div className={`${variant === 'hero' ? 'hidden' : 'hidden sm:flex'} bg-white rounded-lg flex-1 min-h-0 flex-col overflow-hidden`} style={{ boxShadow: SHADOW }}>
          <div className="px-2 pt-1.5 pb-1 flex-shrink-0">
            <span className="text-[9px] font-semibold text-slate-900">Poslednji pacijenti</span>
          </div>
          <div className="flex items-center gap-1 px-2 pb-1 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
            <span className="w-[18px] flex-shrink-0 text-[6px] font-semibold text-slate-400 uppercase">Br.</span>
            <span className="w-[32px] flex-shrink-0 text-[6px] font-semibold text-slate-400 uppercase">Datum</span>
            <span className="flex-1 text-[6px] font-semibold text-slate-400 uppercase truncate">Ime</span>
            <span className="w-[26px] flex-shrink-0 text-[6px] font-semibold text-slate-400 uppercase text-center">Član.</span>
            <span className="flex-1 text-[6px] font-semibold text-slate-400 uppercase truncate">Terapija</span>
            <span className="w-[8px]" />
          </div>
          {PATIENTS.map(p => (
            <div key={p.no} className="flex items-center gap-1 px-2 py-1" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="w-[18px] flex-shrink-0 text-[6.5px] text-slate-900">{p.no}</span>
              <span className="w-[32px] flex-shrink-0 text-[6.5px] text-slate-500">{p.date}</span>
              <span className="flex-1 text-[6.5px] font-medium text-slate-900 truncate">{p.name}</span>
              <span className="w-[26px] flex-shrink-0 text-center">
                {p.member ? (
                  <span className="text-[5.5px] font-medium px-1 py-px rounded-full" style={{ background: C.coralIcon, color: 'white' }}>
                    Član
                  </span>
                ) : (
                  <span className="text-[6px] text-slate-300">—</span>
                )}
              </span>
              <span className="flex-1 text-[6.5px] text-slate-500 truncate">{p.treat}</span>
              <span className="w-[8px] text-[7px] text-slate-300 text-center leading-none">⋯</span>
            </div>
          ))}
        </div>

        {/* Mobile-only: mini upcoming appointments (2 rows), hidden in hero variant */}
        <div className={`${variant === 'hero' ? 'hidden' : 'flex sm:hidden'} flex-col gap-0.5 flex-shrink-0 bg-white rounded-lg py-1`} style={{ boxShadow: SHADOW }}>
          <div className="px-2 pb-0.5">
            <span className="text-[8px] font-semibold text-slate-900">Naredni termini</span>
          </div>
          {APPT_GROUPS[0].items.map((appt, i) => (
            <ApptRow key={appt.time} appt={appt} delay={0.4 + i * 0.1} />
          ))}
        </div>

      </div>

      {/* ─── Right Panel — desktop only, hidden in hero variant ─── */}
      <aside
        className={`${variant === 'hero' ? 'hidden' : 'hidden sm:flex'} flex-shrink-0 bg-white rounded-lg flex-col overflow-hidden`}
        style={{ width: '28%', boxShadow: SHADOW }}
      >
        {/* Calendar */}
        <div className="px-2 pt-1.5 pb-1.5 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-bold text-slate-900">Februar 2026</span>
            <div className="flex gap-0.5">
              <ChevronLeft className="h-2.5 w-2.5 text-slate-400" />
              <ChevronRight className="h-2.5 w-2.5 text-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px text-center mb-1">
            {WEEK_DAYS.map((d, i) => (
              <span key={i} className={`text-[5.5px] font-semibold ${WEEK_DATES[i] === TODAY ? 'text-slate-900' : 'text-slate-400'}`}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px text-center">
            {WEEK_DATES.map(d => (
              <div
                key={d}
                className={`text-[6.5px] py-0.5 flex items-center justify-center ${
                  d === TODAY ? 'rounded-md text-white font-bold' : 'text-slate-700 font-medium'
                }`}
                style={d === TODAY ? { background: C.navy } : undefined}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-2 pt-1.5 pb-1 flex-shrink-0">
            <span className="text-[8px] font-bold text-slate-900">Naredni termini</span>
            <span className="text-[6px] font-medium" style={{ color: C.chart }}>Vidi sve</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            {APPT_GROUPS.map((group, gi) => (
              <React.Fragment key={group.day}>
                <div className={`px-2 pt-1 pb-0.5 flex-shrink-0${gi > 0 ? ' mt-0.5' : ''}`} style={gi > 0 ? { borderTop: `1px solid ${C.border}` } : undefined}>
                  <span className="text-[6px] font-semibold text-slate-400 uppercase tracking-wide">{group.day}</span>
                </div>
                {group.items.map((appt, i) => (
                  <ApptRow key={appt.time} appt={appt} delay={0.4 + i * 0.1} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </aside>

    </div>
  </div>
);

export default DashboardMockupA;
