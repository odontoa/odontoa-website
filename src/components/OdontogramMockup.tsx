"use client";

import React from "react";

export const OdontogramMockup = () => {
  return (
    <div className="w-full max-w-[90rem] mx-auto p-3" style={{ pointerEvents: 'none' }}>
      {/* Main Container */}
      <div 
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 30px 80px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Header Bar */}
        <div 
          className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
          style={{
            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.04), rgba(255, 255, 255, 0))'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
              style={{
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Odontogram Pacijenta</div>
              <div className="text-sm text-slate-500">Grafički prikaz statusa zuba</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-emerald-700">Aktivan</span>
            </div>
          </div>
        </div>
        
        {/* Odontogram Image Container */}
        <div 
          className="flex items-center justify-center"
          style={{
            padding: "16px 20px",
            background: "#f8fafc"
          }}
        >
          <img 
            src="/images/features-new-homepage3/odontogram0staticna-slika2.png" 
            alt="Odontogram pacijenta" 
            className="w-full h-auto object-contain mx-auto block"
            loading="eager"
            decoding="async"
            style={{ 
              display: "block", 
              margin: "0 auto",
              width: "100%",
              height: "auto",
              filter: "contrast(1.1) brightness(0.98)",
              imageRendering: "-webkit-optimize-contrast" as any,
              WebkitImageRendering: "-webkit-optimize-contrast" as any,
              msInterpolationMode: "bicubic" as any
            } as React.CSSProperties}
          />
        </div>
        
        {/* Footer Bar with Legend */}
        <div 
          className="px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 border-t border-slate-200/60"
          style={{
            background: "rgba(248, 250, 252, 0.8)"
          }}
        >
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded" style={{ background: "#94a3b8" }}></div>
              <span className="text-sm text-slate-600">Nema terapije</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded" style={{ background: "#f97316" }}></div>
              <span className="text-sm text-slate-600">Endodontska terapija</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded" style={{ background: "#3b82f6" }}></div>
              <span className="text-sm text-slate-600">Restaurativna terapija</span>
            </div>
          </div>
          <button 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
          >
            Vidi sve terapije
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OdontogramMockup;
