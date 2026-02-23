'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * PatientSmsPreview — iMessage-style SMS conversation from the patient's perspective.
 * Patient receives appointment reminder from "Odontoa", confirms, gets confirmation back.
 */

const C = {
  blue: '#007AFF',
  gray: '#E9E9EB',
  bg: '#FFFFFF',
  textDark: '#000000',
  textLight: '#8E8E93',
  barBg: '#F6F6F6',
} as const;

type Bubble = {
  text: string;
  from: 'clinic' | 'patient';
  time?: string;
};

const MESSAGES: Bubble[] = [
  {
    text: 'Poštovana Ana, podsećamo Vas na zakazan termin: Petak, 20. dec u 14:30 kod Dr. Nikolić. Potvrdite sa DA ili otkažite sa NE.',
    from: 'clinic',
    time: '08:30',
  },
  {
    text: 'DA',
    from: 'patient',
  },
  {
    text: 'Hvala! Vaš termin je potvrđen. Vidimo se u petak! 🦷',
    from: 'clinic',
    time: '08:31',
  },
];

export default function PatientSmsPreview() {
  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      {/* Status bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3"
        style={{ height: 20, background: C.barBg }}
      >
        <span className="text-[6px] font-semibold text-black/80">9:41</span>
        <div className="flex items-center gap-1">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <rect x="0" y="4" width="2" height="2" rx="0.5" fill="#000" />
            <rect x="3" y="2.5" width="2" height="3.5" rx="0.5" fill="#000" />
            <rect x="6" y="1" width="2" height="5" rx="0.5" fill="#000" />
            <rect x="9" y="0" width="1" height="6" rx="0.5" fill="#000" opacity="0.3" />
          </svg>
          <svg width="14" height="6" viewBox="0 0 14 6" fill="none">
            <rect x="0" y="0.5" width="11" height="5" rx="1" stroke="#000" strokeWidth="0.6" />
            <rect x="1" y="1.5" width="8" height="3" rx="0.5" fill="#34C759" />
            <rect x="12" y="1.5" width="1.5" height="3" rx="0.5" fill="#000" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Header bar */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-2"
        style={{
          height: 28,
          background: C.barBg,
          borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        }}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M5 1L1 5L5 9" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex items-center gap-1 flex-1 justify-center">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1B2B6B, #3B5998)',
            }}
          >
            <span className="text-[7px] font-bold text-white">O</span>
          </div>
          <div>
            <div className="text-[8px] font-semibold text-black leading-tight">Odontoa</div>
            <div className="text-[5.5px] leading-tight" style={{ color: C.textLight }}>SMS</div>
          </div>
        </div>
        <div style={{ width: 6 }} />
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col justify-end p-2 gap-1.5 min-h-0 overflow-hidden">
        <motion.div
          className="flex flex-col gap-1.5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.3, delayChildren: 0.4 } },
          }}
        >
          {MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.from === 'patient' ? 'justify-end' : 'justify-start'}`}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <div
                className="px-2 py-1.5 max-w-[85%]"
                style={{
                  borderRadius:
                    msg.from === 'patient'
                      ? '10px 10px 2px 10px'
                      : '10px 10px 10px 2px',
                  background: msg.from === 'patient' ? C.blue : C.gray,
                  color: msg.from === 'patient' ? '#fff' : C.textDark,
                }}
              >
                <p className="text-[6.5px] leading-[1.4]">{msg.text}</p>
                {msg.time && (
                  <p
                    className="text-[4.5px] mt-0.5 text-right"
                    style={{
                      color:
                        msg.from === 'patient'
                          ? 'rgba(255,255,255,0.6)'
                          : C.textLight,
                    }}
                  >
                    {msg.time}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-2"
        style={{
          height: 24,
          borderTop: '0.5px solid rgba(0,0,0,0.1)',
          background: C.barBg,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" stroke={C.textLight} strokeWidth="0.6" />
          <path d="M6 3.5V8.5M3.5 6H8.5" stroke={C.textLight} strokeWidth="0.6" strokeLinecap="round" />
        </svg>
        <div
          className="flex-1 rounded-full px-2 py-0.5 text-[6px]"
          style={{
            border: '0.5px solid rgba(0,0,0,0.15)',
            color: C.textLight,
            background: '#fff',
          }}
        >
          Poruka
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 6L2 2V5L7 6L2 7V10Z" fill={C.blue} />
        </svg>
      </div>
    </div>
  );
}
