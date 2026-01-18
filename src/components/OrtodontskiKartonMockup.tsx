'use client';

import React from 'react';

// Mockup: Ortodontski karton - Klinička procena
const OrtodontskiKartonMockup = () => {
  return (
    <div className="w-full max-w-[90rem] mx-auto p-3" style={{ pointerEvents: 'none' }}>
      {/* Main Container */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Ortodontski karton</div>
              <div className="text-sm text-slate-500">Pacijent: Marko Jovanović</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700">U obradi</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200/60 px-5 py-3">
          <div className="flex items-center gap-2">
            {/* Active Tab - Klinička procena */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200/60 text-slate-900" style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}>
              <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Klinička procena</span>
            </div>
            {/* Inactive Tab - Funkcionalna procena */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-white/50 transition-colors">
              <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Funkcionalna procena</span>
            </div>
            {/* Inactive Tab - Studijski model */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-white/50 transition-colors">
              <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Studijski model</span>
            </div>
            {/* Inactive Tab - Analiza profilnog telerengenskog snimka */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-white/50 transition-colors">
              <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-medium">Analiza profilnog snimka</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-slate-50/50">
          {/* Two Column Grid - Facijalne Karakteristike & Oralni i Dentalni Detalji */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Facijalne Karakteristike */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-4" style={{
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-violet-500 flex items-center justify-center">
                  <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Facijalne Karakteristike</h3>
              </div>

              {/* Lice & Usne */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Lice</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Simetrično</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Usne</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Kompetentne</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Odnosi Spratova Lica u Vertikali */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                  <h4 className="text-sm font-semibold text-slate-700">Odnosi Spratova Lica u Vertikali</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Nazolabijalni sulkusi</label>
                    <div className="relative">
                      <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Pravilno izraženi</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Mentolabijalni sulkusi</label>
                    <div className="relative">
                      <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Naglašeni</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profil & Biometrijsko Polje - Now in same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Profil</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Izaberite uslugu</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Biometrijsko Polje</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Oralni i Dentalni Detalji */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-4" style={{
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Oralni i Dentalni Detalji</h3>
              </div>

              {/* Higijena */}
              <div className="mb-4">
                <label className="block text-sm text-slate-600 font-medium mb-1.5">Higijena</label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option>Dobra</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Izražen Frenulum - Checkboxes */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <label className="text-sm text-slate-700 font-semibold">Izražen Frenulum</label>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700">Gornji labijalni</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white flex items-center justify-center">
                    </div>
                    <span className="text-sm text-slate-700">Donji labijalni</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white flex items-center justify-center">
                    </div>
                    <span className="text-sm text-slate-700">Lingvalni</span>
                  </label>
                </div>
              </div>

              {/* Sredine Zubnih Nizova & Klasifikacija */}
              <div className="grid grid-cols-2 gap-4 mb-4 items-start">
                <div className="flex flex-col">
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Sredine Zubnih Nizova</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Poklapaju se</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Klasifikacija po Uglu</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>II/1 klasa</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bočni odnos & Incizalni Stepenik - Now in same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Bočni odnos</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Pravilan</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">Incizalni Stepenik</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Unesite vrednost u mm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrtodontskiKartonMockup;
