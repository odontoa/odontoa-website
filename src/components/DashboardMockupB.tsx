'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Mockup B: Overlay view - Today's appointments and Recent activity with premium design
const DashboardMockupB = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Dashboard Container */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{
        boxShadow: '0 30px 80px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
      }}>
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between" style={{
          background: 'linear-gradient(to right, rgba(59, 130, 246, 0.04), rgba(255, 255, 255, 0))'
        }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center" style={{
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Pregled dana</div>
              <div className="text-sm text-slate-500">Utorak, 10. decembar 2024.</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Ordinacija aktivna</span>
            </div>
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white w-full">
            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-5 flex flex-col min-h-0">
              {/* Mini Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">18</div>
                    <div className="text-xs text-slate-500">termina danas</div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">5</div>
                    <div className="text-xs text-slate-500">završeno</div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">1</div>
                    <div className="text-xs text-slate-500">u toku</div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                {/* Today's Appointments */}
                <div className="bg-white rounded-xl border border-slate-200/60 p-5" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-900">Današnji termini</h3>
                    </div>
                  </div>
                  <motion.div 
                    className="space-y-2.5 flex-1"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.2,
                          delayChildren: 0.2,
                        }
                      }
                    }}
                  >
                    <motion.div 
                      className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">09:00</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Ana Petrović</div>
                        <div className="text-sm text-slate-500 truncate">Preventivni pregled</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-xs font-medium text-emerald-700">Završeno</div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">10:30</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Marko Ilić</div>
                        <div className="text-sm text-slate-500 truncate">Plomba</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-amber-100 text-xs font-medium text-amber-700 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                        U toku
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/30 border border-blue-200/40"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">12:00</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Jelena Marković</div>
                        <div className="text-sm text-slate-500 truncate">Kontrola</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-blue-100 text-xs font-medium text-blue-700">Zakazano</div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/30 border border-blue-200/40"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">14:15</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Stefan Jovanović</div>
                        <div className="text-sm text-slate-500 truncate">Konsultacija</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-blue-100 text-xs font-medium text-blue-700">Zakazano</div>
                    </motion.div>
                  </motion.div>
                  <div className="mt-3 flex-shrink-0">
                    <button className="w-full py-2.5 px-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors flex items-center justify-center gap-2">
                      Vidi sve termine
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-200/60 p-5" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">Nedavna aktivnost</h3>
                  </div>
                  <motion.div 
                    className="space-y-2.5 flex-1"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.2,
                          delayChildren: 0.4,
                        }
                      }
                    }}
                  >
                    <motion.div 
                      className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/40 border border-blue-100/60"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900">Novi pacijent dodat</div>
                        <div className="text-sm text-slate-500">Ivana Petrović</div>
                      </div>
                      <div className="text-xs text-slate-400">Pre 5 min</div>
                    </motion.div>
                    <motion.div 
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/40 border border-amber-100/60"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900">Termin pomeren</div>
                        <div className="text-sm text-slate-500">Marko Ilić (10:30 → 11:00)</div>
                      </div>
                      <div className="text-xs text-slate-400">Pre 12 min</div>
                    </motion.div>
                    <motion.div 
                      className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/60"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900">Završen pregled</div>
                        <div className="text-sm text-slate-500">Ana Petrović</div>
                      </div>
                      <div className="text-xs text-slate-400">Pre 25 min</div>
                    </motion.div>
                    <motion.div 
                      className="flex items-start gap-3 p-3 rounded-xl bg-violet-50/40 border border-violet-100/60"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <svg className="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900">SMS podsetnik poslat</div>
                        <div className="text-sm text-slate-500">Jelena Marković</div>
                      </div>
                      <div className="text-xs text-slate-400">Pre 1 sat</div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockupB;
