// Calendar — Mobile layout
// Follows the same structure as MobileDashboard.tsx (no sidebar)
"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { CalendarNewDesignOgie } from "@/components/calendar/CalendarNewDesign";

// ─── Mobile navbar (no sidebar) ──────────────────────────

function CalendarMobileNavbar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]"
      style={{ background: "var(--v2-surface)" }}
    >
      <div className="flex items-center gap-[8px]">
        <Image
          src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
          alt="Odontoa"
          width={32}
          height={32}
          className="h-[32px] w-[32px] object-contain"
        />
        <h1
          className="font-semibold leading-[1.2]"
          style={{ fontSize: "18px", color: "var(--v2-text)" }}
        >
          Kalendar
        </h1>
      </div>
      <div className="flex items-center gap-[8px]">
        <button
          className="relative flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "8px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Bell className="h-[18px] w-[18px]" style={{ color: "var(--v2-primary-dark)" }} />
          <span
            className="absolute h-[6px] w-[6px] rounded-full"
            style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }}
          />
        </button>
        <div
          className="flex items-center justify-center font-semibold text-[11px]"
          style={{
            height: "32px",
            width: "32px",
            borderRadius: "var(--v2-radius-avatar)",
            background: "var(--v2-primary)",
            color: "var(--v2-primary-fg)",
          }}
        >
          MM
        </div>
      </div>
    </header>
  );
}

// ─── Mobile layout ────────────────────────────────────────

export default function MobileCalendar({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-surface)" }}
    >
      <CalendarMobileNavbar />

      <main
        className="flex-1 overflow-hidden p-[16px] flex flex-col gap-[16px] rounded-t-[24px]"
        style={{ background: "var(--v2-bg)" }}
      >
        <CalendarNewDesignOgie size="square" layout="mobile" />
      </main>
    </div>
  );
}
