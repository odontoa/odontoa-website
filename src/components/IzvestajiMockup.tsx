'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download } from 'lucide-react';

// ── Dentino palette ─────────────────────────────
const C = {
  navy:   '#1B2B6B',
  bg:     '#EEF0F8',
  border: '#F1F5F9',
  chart:  '#2563EB',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';

// ── Data ────────────────────────────────────────
const STATS = [
  { value: '38.800', label: 'Ukupan prihod', suffix: ' RSD' },
  { value: '19',     label: 'Tretmana',      suffix: ''     },
  { value: '85%',    label: 'Naplata',        suffix: ''     },
];

const FILTERS = [
  { label: 'Mesečni',      active: true  },
  { label: 'Svi doktori',  active: false },
  { label: 'Svi statusi',  active: false },
];

type RowStatus = 'Plaćeno' | 'Na čekanju' | 'Otkazano';

type Row = {
  name: string;
  treatment: string;
  amount: string;
  status: RowStatus;
};

const ROWS: Row[] = [
  { name: 'Ana Petrović',     treatment: 'Endodoncija',  amount: '12.500', status: 'Plaćeno'     },
  { name: 'Marko Ilić',       treatment: 'Plomba',       amount: '5.800',  status: 'Plaćeno'     },
  { name: 'Jelena Marković',  treatment: 'Čišćenje',     amount: '3.500',  status: 'Na čekanju'  },
  { name: 'Stefan Jovanović', treatment: 'Konsultacija', amount: '2.000',  status: 'Plaćeno'     },
  { name: 'Sanja Simić',      treatment: 'Izbeljivanje', amount: '15.000', status: 'Na čekanju'  },
];

const CHIP: Record<string, { bg: string; color: string }> = {
  Plaćeno:      { bg: '#ECFDF5', color: '#059669' },
  'Na čekanju': { bg: '#FFFBEB', color: '#D97706' },
  Otkazano:     { bg: '#FEF2F2', color: '#DC2626' },
};

// ── Component ───────────────────────────────────
const IzvestajiMockup = () => (
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
          <BarChart3 className="h-2.5 w-2.5 text-white" />
        </div>
        <div>
          <div className="text-[9px] font-bold text-slate-900 leading-tight">Izveštaji</div>
          <div className="text-[6px] text-slate-400 leading-tight">Decembar 2025</div>
        </div>
      </div>
      <div
        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-white text-[6px] font-semibold"
        style={{ background: C.navy }}
      >
        <Download className="h-2 w-2" />
        Izvezi
      </div>
    </header>

    {/* Content */}
    <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-0 overflow-hidden">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-lg px-2 py-1.5 text-center" style={{ boxShadow: SHADOW }}>
            <div className="text-[10px] font-bold text-slate-900 leading-none">
              {s.value}{s.suffix}
            </div>
            <div className="text-[5.5px] text-slate-400 leading-none mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {FILTERS.map(f => (
          <div
            key={f.label}
            className={`text-[6px] font-medium px-1.5 py-0.5 rounded-full ${
              f.active ? 'text-white' : 'text-slate-500 bg-white'
            }`}
            style={f.active ? { background: C.chart } : { boxShadow: SHADOW }}
          >
            {f.label}
          </div>
        ))}
      </div>

      {/* Data table */}
      <div className="bg-white rounded-lg flex-1 min-h-0 flex flex-col overflow-hidden" style={{ boxShadow: SHADOW }}>
        {/* Table header */}
        <div
          className="flex items-center gap-1 px-2 py-1 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <span className="flex-[2] text-[6px] font-semibold text-slate-400 uppercase">Pacijent</span>
          <span className="flex-[2] text-[6px] font-semibold text-slate-400 uppercase">Tretman</span>
          <span className="flex-1 text-[6px] font-semibold text-slate-400 uppercase text-right">Iznos</span>
          <span className="w-[40px] text-[6px] font-semibold text-slate-400 uppercase text-center">Status</span>
        </div>

        {/* Table rows */}
        <motion.div
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        >
          {ROWS.map(row => (
            <motion.div
              key={row.name}
              variants={{ hidden: { opacity: 0, x: -4 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center gap-1 px-2 py-1.5"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <span className="flex-[2] text-[6.5px] font-medium text-slate-900 truncate">{row.name}</span>
              <span className="flex-[2] text-[6px] text-slate-500 truncate">{row.treatment}</span>
              <span className="flex-1 text-[6.5px] font-semibold text-slate-900 text-right tabular-nums">{row.amount}</span>
              <span
                className="w-[40px] text-center text-[5px] font-semibold px-1 py-px rounded-full"
                style={{ background: CHIP[row.status]?.bg, color: CHIP[row.status]?.color }}
              >
                {row.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);

export default IzvestajiMockup;
