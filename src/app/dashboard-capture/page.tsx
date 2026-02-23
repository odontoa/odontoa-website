'use client';

import { useEffect } from 'react';
import DashboardMockupA from '@/components/DashboardMockupA';

/**
 * Minimal page that renders only the dashboard mockup for screenshot capture.
 * Used by scripts to generate dashboard image for mockup compositing.
 */
export default function DashboardCapturePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-[800px] h-[500px] rounded-lg overflow-hidden shadow-xl bg-white">
        <DashboardMockupA />
      </div>
    </div>
  );
}
