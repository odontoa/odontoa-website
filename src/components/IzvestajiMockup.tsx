'use client';

import React from 'react';

// Mockup: Izvoz termina - Izveštaji
const IzvestajiMockup = () => {
  const patients = [
    { name: 'Marko Petrović', email: 'marko.petrovic@gmail.com' },
    { name: 'Ana Jovanović', email: 'ana.jovanovic@yahoo.com' },
    { name: 'Stefan Nikolić', email: 'stefan.nikolic@gmail.com' },
    { name: 'Jelena Stojanović', email: 'jelena.stojanovic@gmail.com' },
    { name: 'Milan Đorđević', email: 'milan.djordjevic@yahoo.com' },
    { name: 'Sara Milovanović', email: 'sara.milovanovic@gmail.com' },
    { name: 'Nikola Popović', email: 'nikola.popovic@gmail.com' },
    { name: 'Marija Radović', email: 'marija.radovic@yahoo.com' },
    { name: 'Luka Marković', email: 'luka.markovic@gmail.com' },
    { name: 'Jovana Ilić', email: 'jovana.ilic@gmail.com' },
    { name: 'Filip Stanković', email: 'filip.stankovic@yahoo.com' },
    { name: 'Tamara Vuković', email: 'tamara.vukovic@gmail.com' },
    { name: 'Nemanja Đukić', email: 'nemanja.dukic@gmail.com' },
    { name: 'Milica Antić', email: 'milica.antic@yahoo.com' },
    { name: 'Stefan Lazić', email: 'stefan.lazic@gmail.com' },
    { name: 'Jovana Milić', email: 'jovana.milic@gmail.com' },
    { name: 'Marko Ristić', email: 'marko.ristic@yahoo.com' },
    { name: 'Ana Todorović', email: 'ana.todorovic@gmail.com' },
    { name: 'Stefan Pavlović', email: 'stefan.pavlovic@gmail.com' },
  ];

  return (
    <div className="w-full max-w-[90rem] mx-auto p-4" style={{ pointerEvents: 'none' }}>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Izveštaj</div>
              <div className="text-sm text-slate-500">Izaberite kriterijume za izvoz podataka</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Decembar 2025</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-slate-50/50">
          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 mb-4" style={{
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Postavke izvoza</h3>
            </div>

            {/* Filters Grid - 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Period */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Period <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option>Mesečni</option>
                    <option>Nedeljni</option>
                    <option>Godišnji</option>
                    <option>Prilagođeno</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Početni datum */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Početni datum</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value="01.12.2025."
                    readOnly
                  />
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Krajnji datum */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Krajnji datum</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value="31.12.2025."
                    readOnly
                  />
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Status</label>
                <div className="relative">
                  <select className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option>Svi statusi</option>
                    <option>Zakazani</option>
                    <option>Završeni</option>
                    <option>Otkazani</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Doktor */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Doktor</label>
                <div className="relative">
                  <select className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option>Svi doktori</option>
                    <option>Dr. Marko Petrović</option>
                    <option>Dr. Ana Jovanović</option>
                    <option>Dr. Stefan Nikolić</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Stolica */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Stolica</label>
                <div className="relative">
                  <select className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg appearance-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option>Sve stolice</option>
                    <option>Stolica 1</option>
                    <option>Stolica 2</option>
                    <option>Stolica 3</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Tip tretmana */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Tip tretmana</label>
                <input 
                  type="text" 
                  className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="npr. čišćenje"
                />
              </div>
            </div>
          </div>

          {/* Patients Section */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-5" style={{
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
          }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Izbor pacijenata</h3>
              </div>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                Izvezi podatke za sve pacijente (19)
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Pretraži pacijente..."
              />
            </div>

            {/* Patient List - Compact Grid */}
            <div 
              className="overflow-y-auto pr-2 relative"
              style={{ 
                maxHeight: '172px',
                maskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Left Column */}
                <div className="border-r border-slate-200 pr-2">
                  {/* All Patients Option - Selected */}
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer mb-2">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">Svi pacijenti (19)</div>
                      <div className="text-[10px] text-slate-500 truncate">Izvezi podatke za sve pacijente</div>
                    </div>
                  </label>

                  {/* Individual Patients - Left Column - First 3 */}
                  {patients.slice(0, 3).map((patient, index) => (
                    <label key={index} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors mb-2 last:mb-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900 truncate">{patient.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{patient.email}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Right Column */}
                <div className="pl-2">
                  {/* Individual Patients - Right Column - Next 3 */}
                  {patients.slice(3, 6).map((patient, index) => (
                    <label key={index + 3} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors mb-2 last:mb-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900 truncate">{patient.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{patient.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all" style={{
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Izvezi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IzvestajiMockup;
