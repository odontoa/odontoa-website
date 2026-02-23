"use client";

import React from "react";

interface MockupFrameProps {
  children: React.ReactNode;
  /** Default "4/3". Use "3/2" only if a mockup's content is significantly wider. */
  aspectRatio?: "4/3" | "3/2";
}

/**
 * MockupFrame — single shared container for all feature preview mockups.
 *
 * Responsibilities:
 *   - Stable aspect-ratio container (eliminates layout shift when switching accordion items)
 *   - Consistent border, shadow, radius, and bg matching the healthtech design system
 *   - overflow-hidden so mockup content never bleeds outside the frame
 *
 * Phase A: structural wrapper, mockup internals unchanged.
 * Phase B: each mockup is redesigned to fill this frame at natural width (no scaling).
 */
export function MockupFrame({ children, aspectRatio = "4/3" }: MockupFrameProps) {
  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white"
      style={{
        aspectRatio,
        boxShadow:
          "0 20px 60px -12px rgba(15, 23, 42, 0.10), 0 4px 16px -4px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.7) inset",
      }}
    >
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
