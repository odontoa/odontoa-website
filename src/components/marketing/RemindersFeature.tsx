"use client";

import React from "react";
import ReminderMockup from "./ReminderMockup";

export function RemindersFeature() {
  return (
    <section className="relative py-16 lg:py-24 bg-transparent">
      {/* Subtle background mesh (opcionalno) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Text content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Podsetnici koji smanjuju nedolaske
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Automatski SMS i email podsetnici, personalizovani po pacijentu i terapiji.
            </p>

            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-base">
                  Pacijent dobija tačne informacije: datum, vreme, doktor, zahvat.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-base">
                  Manje propuštenih termina i manje poziva ka recepciji.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-base">
                  Sve izgleda profesionalno, u vašem brendu.
                </span>
              </li>
            </ul>
          </div>

          {/* RIGHT: Mockup */}
          <div className="lg:justify-self-end">
            <ReminderMockup compact={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

