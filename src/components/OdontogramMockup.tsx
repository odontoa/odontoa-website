'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';

// ── Dentino palette ─────────────────────────────
const C = {
  navy:   '#1B2B6B',
  bg:     '#EEF0F8',
  border: '#F1F5F9',
  chart:  '#2563EB',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';

// ── Legend entries ───────────────────────────────
const LEGEND = [
  { color: '#94a3b8', label: 'Nema terapije' },
  { color: '#f97316', label: 'Endodontska' },
  { color: '#3b82f6', label: 'Restaurativna' },
];

// ── Component ───────────────────────────────────
export const OdontogramMockup = () => (
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
          <FileText className="h-2.5 w-2.5 text-white" />
        </div>
        <div>
          <div className="text-[9px] font-bold text-slate-900 leading-tight">Odontogram</div>
          <div className="text-[6px] text-slate-400 leading-tight">Grafički prikaz statusa</div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50">
        <div className="w-1 h-1 rounded-full bg-emerald-500" />
        <span className="text-[6px] font-medium text-emerald-700">Aktivan</span>
      </div>
    </header>

    {/* Content */}
    <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-0 overflow-hidden">

      {/* Segmented control */}
      <div
        className="flex-shrink-0 flex items-center gap-[2px] bg-white rounded-md p-[2px]"
        style={{ boxShadow: SHADOW }}
      >
        <div
          className="flex-1 text-center text-[7px] font-semibold py-1 rounded text-white"
          style={{ background: C.navy }}
        >
          Stalni zubi
        </div>
        <div className="flex-1 text-center text-[7px] font-semibold py-1 rounded text-slate-400">
          Mlečni zubi
        </div>
      </div>

      {/* SVG Container */}
      <motion.div
        className="bg-white rounded-lg flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        style={{ boxShadow: SHADOW }}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src="/images/features-new-homepage3/Odontogram-premium-v2.svg"
          alt="Odontogram pacijenta"
          className="w-full h-full object-contain p-2"
          loading="eager"
          decoding="async"
          style={{
            filter: 'contrast(1.05) brightness(0.99)',
          }}
        />
      </motion.div>

      {/* Legend footer */}
      <div
        className="flex-shrink-0 bg-white rounded-lg px-2 py-1.5 flex items-center justify-between"
        style={{ boxShadow: SHADOW }}
      >
        <div className="flex items-center gap-3">
          {LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
              <span className="text-[6px] text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0.5 text-[6px] font-medium" style={{ color: C.chart }}>
          Vidi terapije
          <ChevronRight className="h-2 w-2" />
        </div>
      </div>
    </div>
  </div>
);

export default OdontogramMockup;
