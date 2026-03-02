// Calendar — Tablet layout
// Follows the same structure as TabletDashboard.tsx
"use client";

import { Bell, Settings } from "lucide-react";
import { FigmaTabletSidebar } from "../figma-dashboard/sidebars";
import { CalendarNewDesignOgie } from "@/components/calendar/CalendarNewDesign";

// ─── Topbar ───────────────────────────────────────────────

function CalendarTabletTopbar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 pl-[4px]"
      style={{ height: "var(--v2-topbar-h)" }}
    >
      <div className="flex flex-col justify-center flex-shrink-0 py-[2px]">
        <h1
          className="font-semibold leading-[1.2]"
          style={{ fontSize: "20px", color: "var(--v2-text)" }}
        >
          Kalendar
        </h1>
      </div>

      <div className="flex items-center gap-[12px] flex-shrink-0">
        <button
          className="flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Settings className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
        </button>
        <button
          className="relative flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
          <span
            className="absolute h-[8px] w-[8px] rounded-full"
            style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }}
          />
        </button>
        <div className="flex items-center gap-[12px]">
          <div
            className="flex items-center justify-center font-semibold text-[12px]"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "var(--v2-radius-avatar)",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            MM
          </div>
          <div className="flex flex-col gap-[2px]">
            <div className="font-bold leading-[1.2]" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
              Dr Marko Marković
            </div>
            <div style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Tablet layout ────────────────────────────────────────

export default function TabletCalendar({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaTabletSidebar />

      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <CalendarTabletTopbar />

        <main
          className="flex-1 overflow-hidden p-[20px] flex flex-col gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >
          <CalendarNewDesignOgie size="wide" layout="tablet" />
        </main>
      </div>
    </div>
  );
}
