'use client';

import React from 'react';
import { motion } from 'framer-motion';

const DashboardMockup = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main Dashboard Container */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{
        boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        maxHeight: '90vh'
      }}>
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white w-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&facepad=2" alt="Dr Marko Marković" className="w-full h-full object-cover object-center" />
                  </div>
                  <div>
                    <h1 className="text-2xl tracking-tight">
                      <span className="text-slate-500 font-medium">Dobrodošli nazad,</span><br />
                      <span className="text-slate-900 font-semibold">Dr Marko Marković</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0 mt-3">
                <div className="bg-white rounded-xl border border-slate-200/60 p-4" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base text-slate-500 font-semibold">Ukupno pacijenata</div>
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">452</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/60 p-4" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base text-slate-500 font-semibold">Termini danas</div>
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">18</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/60 p-4" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base text-slate-500 font-semibold">Aktivni stomatolozi</div>
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">6</div>
                </div>
              </div>

              {/* Brze akcije */}
              <div className="mb-4 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">Brze akcije</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4" style={{
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="text-base font-semibold text-slate-900 mb-1">Novi pacijent</div>
                    <div className="text-sm text-slate-500">Dodaj novog pacijenta u sistem</div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4" style={{
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="text-base font-semibold text-slate-900 mb-1">Zakaži termin</div>
                    <div className="text-sm text-slate-500">Kreiraj novi termin za pacijenta</div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4" style={{
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="text-base font-semibold text-slate-900 mb-1">Pacijenti</div>
                    <div className="text-sm text-slate-500">Pregledaj sve pacijente</div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid gap-5 mb-4 flex-shrink-0" style={{ gridTemplateColumns: 'minmax(520px, 1.3fr) minmax(380px, 1fr)' }}>
                {/* Status termina danas */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">Status termina danas</h3>
                  </div>
                  <motion.div 
                    className="flex-1 flex items-center min-h-0"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                  >
                    {/* Donut Chart */}
                    <div className="flex items-center gap-6">
                      <div className="relative" style={{ width: '160px', height: '160px' }}>
                        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="80" cy="80" r="70" fill="#f8fafc"></circle>
                          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1"></circle>
                          {/* Zakazani: 10/18 = 55.56% = 254.84px */}
                          <motion.circle 
                            cx="80" 
                            cy="80" 
                            r="73" 
                            fill="none" 
                            stroke="#2563eb" 
                            strokeWidth="14" 
                            strokeDasharray="254.84 458.67" 
                            strokeLinecap="butt"
                            initial={{ strokeDashoffset: "458.67" }}
                            whileInView={{ strokeDashoffset: "0" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                          />
                          {/* Završeni: 5/18 = 27.78% = 127.42px */}
                          <motion.circle 
                            cx="80" 
                            cy="80" 
                            r="73" 
                            fill="none" 
                            stroke="#22c55e" 
                            strokeWidth="14" 
                            strokeDasharray="127.42 458.67" 
                            strokeLinecap="butt"
                            initial={{ strokeDashoffset: "458.67" }}
                            whileInView={{ strokeDashoffset: "-254.84" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                          />
                          {/* Otkazani: 3/18 = 16.67% = 76.45px */}
                          <motion.circle 
                            cx="80" 
                            cy="80" 
                            r="73" 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="14" 
                            strokeDasharray="76.45 458.67" 
                            strokeLinecap="butt"
                            initial={{ strokeDashoffset: "458.67" }}
                            whileInView={{ strokeDashoffset: "-366.53" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 leading-none">18</div>
                            <div className="text-sm text-slate-500 mt-1">ukupno</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#2563eb' }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-slate-700">Zakazani</div>
                            <div className="text-sm text-slate-500">10 (56%)</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#22c55e' }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-slate-700">Završeni</div>
                            <div className="text-sm text-slate-500">5 (28%)</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#ef4444' }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-slate-700">Otkazani</div>
                            <div className="text-sm text-slate-500">3 (17%)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Termini po danima */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">Termini po danima</h3>
                  </div>
                  <motion.div 
                    className="flex-1 flex items-end min-h-0"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                  >
                    {/* Bar Chart */}
                    <div className="w-full h-full flex flex-col">
                      <div className="flex-1 relative flex items-end justify-between gap-3 mb-2">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          <div className="w-full border-t border-slate-100/50"></div>
                          <div className="w-full border-t border-slate-100/50"></div>
                          <div className="w-full border-t border-slate-100/50"></div>
                          <div className="w-full border-t border-slate-100/50"></div>
                          <div className="w-full border-t border-slate-100/50"></div>
                        </div>
                        {/* Bars */}
                        <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                          <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                            <motion.div 
                              className="w-full rounded-t-md bg-blue-400"
                              variants={{
                                hidden: { height: 0 },
                                visible: { height: '98px' }
                              }}
                              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-sm text-slate-600 font-medium text-center">Ponedeljak</div>
                          <div className="text-base font-semibold text-slate-900">14</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                          <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                            <motion.div 
                              className="w-full rounded-t-md bg-blue-400"
                              variants={{
                                hidden: { height: 0 },
                                visible: { height: '126px' }
                              }}
                              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-sm text-slate-600 font-medium text-center">Utorak</div>
                          <div className="text-base font-semibold text-slate-900">18</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                          <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                            <motion.div 
                              className="w-full rounded-t-md bg-blue-400"
                              variants={{
                                hidden: { height: 0 },
                                visible: { height: '112px' }
                              }}
                              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-sm text-slate-600 font-medium text-center">Sreda</div>
                          <div className="text-base font-semibold text-slate-900">16</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                          <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                            <motion.div 
                              className="w-full rounded-t-md bg-blue-600"
                              variants={{
                                hidden: { height: 0 },
                                visible: { height: '140px' }
                              }}
                              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-sm text-slate-600 font-medium text-center">Četvrtak</div>
                          <div className="text-base font-semibold text-slate-900">20</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                          <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                            <motion.div 
                              className="w-full rounded-t-md bg-blue-400"
                              variants={{
                                hidden: { height: 0 },
                                visible: { height: '84px' }
                              }}
                              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-sm text-slate-600 font-medium text-center">Petak</div>
                          <div className="text-base font-semibold text-slate-900">12</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
                      <h3 className="text-lg font-medium tracking-tight text-slate-900">Današnji termini (18)</h3>
                    </div>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">09:00</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Ana Petrović</div>
                        <div className="text-sm text-slate-500 truncate">Preventivni pregled</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">10:30</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Marko Ilić</div>
                        <div className="text-sm text-slate-500 truncate">Plomba</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">12:00</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Jelena Marković</div>
                        <div className="text-sm text-slate-500 truncate">Kontrola</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">14:15</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-900 truncate">Stefan Jovanović</div>
                        <div className="text-sm text-slate-500 truncate">Konsultacija</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex-shrink-0">
                    <button className="w-full py-2.5 px-3 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors">
                      Vidi sve termine za danas →
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-200/60 p-5" style={{
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
                }}>
                  <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <h3 className="text-lg font-medium tracking-tight text-slate-900">Nedavna aktivnost</h3>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                      </svg>
                      <div className="text-base text-slate-700 flex-1">Novi pacijent dodat: Ivana Petrović</div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div className="text-base text-slate-700 flex-1">Termin pomeren: Marko Ilić (10:30 → 11:00)</div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div className="text-base text-slate-700 flex-1">Završen pregled: Ana Petrović</div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <div className="text-base text-slate-700 flex-1">Poslat SMS podsetnik: Jelena Marković</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;

