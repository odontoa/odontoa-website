'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

// ── Dentino palette ─────────────────────────────
const C = {
  navy:   '#1B2B6B',
  bg:     '#EEF0F8',
  border: '#F1F5F9',
  chart:  '#2563EB',
} as const;

const SHADOW = '0 1px 3px rgba(15,23,42,0.05)';

// ── Data ────────────────────────────────────────
const TABS = [
  { label: 'Klinička',     active: true  },
  { label: 'Funkcionalna', active: false },
  { label: 'Studijski',    active: false },
  { label: 'Analiza',      active: false },
];

const FACIAL = [
  { label: 'Lice',           value: 'Simetrično'        },
  { label: 'Usne',           value: 'Kompetentne'       },
  { label: 'Nazo. sulkusi',  value: 'Pravilno izraženi' },
  { label: 'Mento. sulkusi', value: 'Naglašeni'         },
  { label: 'Profil',         value: '—'                 },
  { label: 'Biom. polje',    value: '—'                 },
];

const ORAL = [
  { label: 'Higijena',        value: 'Dobra'           },
  { label: 'Frenulum',        value: 'Gornji labijalni' },
  { label: 'Sredine nizova',  value: 'Poklapaju se'    },
  { label: 'Klasa po Uglu',   value: 'II/1 klasa'      },
  { label: 'Bočni odnos',     value: 'Pravilan'        },
  { label: 'Inciz. stepenik', value: '—'                },
];

// ── Component ───────────────────────────────────
const OrtodontskiKartonMockup = () => (
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
          <ClipboardList className="h-2.5 w-2.5 text-white" />
        </div>
        <div>
          <div className="text-[9px] font-bold text-slate-900 leading-tight">Ortodontski karton</div>
          <div className="text-[6px] text-slate-400 leading-tight">Marko Jovanović</div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50">
        <div className="w-1 h-1 rounded-full bg-blue-500" />
        <span className="text-[6px] font-medium text-blue-700">U obradi</span>
      </div>
    </header>

    {/* Content */}
    <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-0 overflow-hidden">

      {/* Tab strip */}
      <div
        className="flex-shrink-0 flex items-center gap-[3px] bg-white rounded-md p-[2px]"
        style={{ boxShadow: SHADOW }}
      >
        {TABS.map(t => (
          <div
            key={t.label}
            className={`flex-1 text-center text-[6px] font-semibold py-1 rounded ${
              t.active ? 'text-white' : 'text-slate-400'
            }`}
            style={t.active ? { background: C.navy } : undefined}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Two-column cards */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5 overflow-hidden">

        {/* Facijalne Karakteristike */}
        <motion.div
          className="bg-white rounded-lg flex flex-col overflow-hidden"
          style={{ boxShadow: SHADOW }}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div
            className="flex items-center gap-1 px-2 pt-1.5 pb-1 flex-shrink-0"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <div
              className="h-4 w-4 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: '#8B5CF6' }}
            >
              <svg className="h-2 w-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[7px] font-bold text-slate-900">Facijalne Karakt.</span>
          </div>
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {FACIAL.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-2 py-1"
                style={i < FACIAL.length - 1 ? { borderBottom: `1px solid ${C.border}` } : undefined}
              >
                <span className="text-[6px] text-slate-400 truncate">{row.label}</span>
                <span className="text-[6.5px] font-medium text-slate-900 truncate ml-1">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Oralni i Dentalni Detalji */}
        <motion.div
          className="bg-white rounded-lg flex flex-col overflow-hidden"
          style={{ boxShadow: SHADOW }}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div
            className="flex items-center gap-1 px-2 pt-1.5 pb-1 flex-shrink-0"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <div
              className="h-4 w-4 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: '#10B981' }}
            >
              <svg className="h-2 w-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[7px] font-bold text-slate-900">Oralni Detalji</span>
          </div>
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {ORAL.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-2 py-1"
                style={i < ORAL.length - 1 ? { borderBottom: `1px solid ${C.border}` } : undefined}
              >
                <span className="text-[6px] text-slate-400 truncate">{row.label}</span>
                <span className="text-[6.5px] font-medium text-slate-900 truncate ml-1">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default OrtodontskiKartonMockup;
