"use client";

/**
 * Calendar New Design — Ogie (V2 Premium + Fixes)
 *
 * Changes vs. previous version:
 * - Alignment fix: outer card uses overflow:clip (doesn't create scroll context,
 *   so sticky still works), header moved INSIDE single overflow-auto container.
 * - CalendarView state: daily / weekly / monthly — all three views work.
 * - CalendarMonthView: real month grid driven by activeMonth state (prev/next work).
 * - CSV export: RFC 4180-compliant csvCell() escaping, \uFEFF BOM for Excel.
 * - Layout prop: desktop / tablet / mobile — responsive control bar layouts.
 * - useNow() drives the real-time "now" line; line is absolute inside body grid.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Clock3,
  AlertCircle,
  BadgeCheck,
  Download,
  Ban,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAppointmentDrawer } from "./CreateAppointmentDrawer";
import { AppointmentDetailsDrawer } from "./AppointmentDetailsDrawer";
import { useAppointments } from "@/lib/ui-lab/appointments-context";
import type { Appointment, DayKey, ApptStatus } from "@/lib/ui-lab/types";

// Re-export for backward compat
export type { Appointment, DayKey };

// ─── Types ────────────────────────────────────────────────────────────────────

type MockSize       = "square" | "wide";
type CalendarView   = "daily" | "weekly" | "monthly";
type CalendarLayout = "desktop" | "tablet" | "mobile";
type DisplayStatus  = "Zakazano" | "Završeno" | "Hitno" | "Otkazano";

type DayInfo = {
  readonly label: string;
  readonly date: string;    // "DD.MM" — display only
  readonly dateISO: string; // "YYYY-MM-DD" — for slot click
  readonly index: number;
  readonly dayKey: DayKey;
};

type MonthCell = { day: number | null; dateStr: string | null };

// ─── Status styles (single source of truth) ──────────────────────────────────

type StatusConfig = { card: string; pill: string; bar: string; icon: React.ReactNode };

const STATUS_STYLES: Record<DisplayStatus, StatusConfig> = {
  Zakazano: {
    card: "bg-[color:var(--v2-cal-zakazano-bg,rgba(239,246,255,0.8))] border-[color:var(--v2-cal-zakazano-border,rgba(191,219,254,0.5))]",
    pill: "bg-[color:var(--v2-cal-zakazano,#3b82f6)] text-white",
    bar:  "bg-[color:var(--v2-cal-zakazano-bar,#60a5fa)]",
    icon: <Clock3 className="h-2.5 w-2.5" />,
  },
  Završeno: {
    card: "bg-[color:var(--v2-cal-zavrseno-bg,rgba(236,253,245,0.8))] border-[color:var(--v2-cal-zavrseno-border,rgba(167,243,208,0.5))]",
    pill: "bg-[color:var(--v2-cal-zavrseno,#10b981)] text-white",
    bar:  "bg-[color:var(--v2-cal-zavrseno-bar,#34d399)]",
    icon: <BadgeCheck className="h-2.5 w-2.5" />,
  },
  Hitno: {
    card: "bg-[color:var(--v2-cal-hitno-bg,rgba(254,242,242,0.8))] border-[color:var(--v2-cal-hitno-border,rgba(254,202,202,0.5))]",
    pill: "bg-[color:var(--v2-cal-hitno,#ef4444)] text-white",
    bar:  "bg-[color:var(--v2-cal-hitno-bar,#f87171)]",
    icon: <AlertCircle className="h-2.5 w-2.5" />,
  },
  Otkazano: {
    card: "bg-[color:var(--v2-input-bg)] border-[color:var(--v2-border)] opacity-50",
    pill: "bg-gray-400 text-white",
    bar:  "bg-gray-300",
    icon: <Ban className="h-2.5 w-2.5" />,
  },
};

const LEGEND_ITEMS: { key: DisplayStatus; label: string; tokenSuffix: string }[] = [
  { key: "Zakazano", label: "Zakazano",      tokenSuffix: "zakazano" },
  { key: "Završeno", label: "Završeno",       tokenSuffix: "zavrseno" },
  { key: "Hitno",    label: "Hitno (oznaka)", tokenSuffix: "hitno" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function getDisplayStatus(status: ApptStatus, isUrgent?: boolean): DisplayStatus {
  if (status === "OTKAZANO") return "Otkazano";
  if (isUrgent) return "Hitno";
  return status === "ZAVRSENO" ? "Završeno" : "Zakazano";
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function padTime(n: number): string {
  return String(n).padStart(2, "0");
}

function calcEndTime(startTime: string, durationMin: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const end = h * 60 + m + durationMin;
  return `${padTime(Math.floor(end / 60))}:${padTime(end % 60)}`;
}

// RFC 4180 — wrap cell in quotes if it contains comma, quote, or newline
function csvCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function exportToCSV(appointments: Appointment[], filename: string): void {
  const headers = ["Datum", "Vreme od", "Vreme do", "Pacijent", "Procedura", "Status", "Stolica"];
  const rows = appointments.map((a) => [
    a.dateISO,
    a.startTime,
    calcEndTime(a.startTime, a.durationMin),
    csvCell(a.patientName),
    csvCell(a.procedureLabel),
    a.isUrgent ? "Hitno" : a.status,
    `Stolica ${a.chairId}`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getExportableAppointments(
  view: CalendarView,
  allFiltered: Appointment[],
  days: readonly DayInfo[],
  activeMonth: Date,
): Appointment[] {
  if (view === "daily")  return allFiltered.filter((a) => a.dayKey === TODAY_KEY);
  if (view === "weekly") return allFiltered.filter((a) => days.some((d) => d.dayKey === a.dayKey));
  const y = activeMonth.getFullYear();
  const m = activeMonth.getMonth();
  return allFiltered.filter((a) => {
    const d = new Date(a.dateISO);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

// ─── Date/time helpers (also used by CreateAppointmentDrawer) ────────────────

const DAY_KEYS_ORDER: readonly DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function dateToDayKey(iso: string): DayKey {
  return DAY_KEYS_ORDER[new Date(iso + "T12:00:00").getDay()];
}

export function toDateISO(d: Date): string {
  return `${d.getFullYear()}-${padTime(d.getMonth() + 1)}-${padTime(d.getDate())}`;
}

/** Floor time to the nearest 15-minute boundary (e.g. 10:47 → "10:45") */
export function floorTo15(d: Date): string {
  const totalMin = d.getHours() * 60 + d.getMinutes();
  const floored  = Math.floor(totalMin / 15) * 15;
  return `${padTime(Math.floor(floored / 60))}:${padTime(floored % 60)}`;
}

// ─── Month helpers ────────────────────────────────────────────────────────────

const SERBIAN_MONTHS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

const MONTH_DAY_HEADERS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function buildMonthGrid(firstOfMonth: Date): MonthCell[][] {
  const y = firstOfMonth.getFullYear();
  const m = firstOfMonth.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  // Compute Mon-first offset (JS: 0=Sun,1=Mon,...,6=Sat)
  const firstDow = new Date(y, m, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;

  const cells: MonthCell[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: `${y}-${padTime(m + 1)}-${padTime(d)}` });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, dateStr: null });

  const weeks: MonthCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function formatMonthLabel(d: Date): string {
  return `${SERBIAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── Grid constants ───────────────────────────────────────────────────────────

const GRID_START_MIN = 7 * 60;
const GRID_END_MIN   = 20 * 60;
const TOTAL_MIN      = GRID_END_MIN - GRID_START_MIN;
const TIME_COL_W     = 72; // px — time gutter width

const HOUR_LABELS: string[] = [];
for (let h = 7; h <= 20; h++) HOUR_LABELS.push(`${padTime(h)}:00`);

// ─── Days ─────────────────────────────────────────────────────────────────────

const ALL_DAYS: readonly DayInfo[] = [
  { label: "Ponedeljak", date: "08.12", dateISO: "2025-12-08", index: 1, dayKey: "mon" },
  { label: "Utorak",     date: "09.12", dateISO: "2025-12-09", index: 2, dayKey: "tue" },
  { label: "Sreda",      date: "10.12", dateISO: "2025-12-10", index: 3, dayKey: "wed" },
  { label: "Četvrtak",   date: "11.12", dateISO: "2025-12-11", index: 4, dayKey: "thu" },
  { label: "Petak",      date: "12.12", dateISO: "2025-12-12", index: 5, dayKey: "fri" },
  { label: "Subota",     date: "13.12", dateISO: "2025-12-13", index: 6, dayKey: "sat" },
  { label: "Nedelja",    date: "14.12", dateISO: "2025-12-14", index: 7, dayKey: "sun" },
];

const WEEKDAYS      = ALL_DAYS.slice(0, 5);
const WEEKEND_KEYS: DayKey[] = ["sat", "sun"];
const TODAY_KEY: DayKey = "wed"; // mock — pretend Wednesday is today
const TODAY_DAY_INFO: DayInfo = ALL_DAYS[2];

// ─── View label ↔ key mapping ─────────────────────────────────────────────────

const VIEW_LABEL_TO_KEY: Record<string, CalendarView> = {
  Dnevni: "daily", Nedeljni: "weekly", Mesečni: "monthly",
};
const VIEW_KEY_TO_LABEL: Record<CalendarView, string> = {
  daily: "Dnevni", weekly: "Nedeljni", monthly: "Mesečni",
};
const VIEW_OPTIONS_ALL    = ["Dnevni", "Nedeljni", "Mesečni"] as const;
const VIEW_OPTIONS_MOBILE = ["Dnevni", "Mesečni"] as const;

// ─── Mock data (kept for reference; actual state lives in AppointmentsContext) ──

// ─── Hook: real-time clock ────────────────────────────────────────────────────

function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Top Bar (merged header + controls — single V2 surface) ──────────────────

function CalendarTopBar({
  view,
  onViewChange,
  selectedChair,
  onChairChange,
  includeWeekend,
  onWeekendChange,
  activeMonth,
  onMonthChange,
  dateRangeLabel,
  layout,
  onExport,
  exportDisabled,
  onNewAppointment,
}: {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  selectedChair: 1 | 2 | 3 | 4;
  onChairChange: (c: 1 | 2 | 3 | 4) => void;
  includeWeekend: boolean;
  onWeekendChange: (v: boolean) => void;
  activeMonth: Date;
  onMonthChange: (d: Date) => void;
  dateRangeLabel: string;
  layout: CalendarLayout;
  onExport: () => void;
  exportDisabled: boolean;
  onNewAppointment: () => void;
}) {
  const viewOptions = layout === "mobile" ? VIEW_OPTIONS_MOBILE : VIEW_OPTIONS_ALL;

  const ChairTabs = () => (
    <div className="flex items-center gap-0.5 bg-[color:var(--v2-input-bg)] rounded-[var(--v2-radius-badge)] p-0.5">
      {([1, 2, 3, 4] as const).map((chair) => {
        const isActive = selectedChair === chair;
        return (
          <button
            key={chair}
            onClick={() => onChairChange(chair)}
            className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[13px] font-semibold transition-all"
            style={
              isActive
                ? { background: "var(--v2-primary)", color: "var(--v2-primary-fg)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }
                : { color: "var(--v2-text-muted)" }
            }
          >
            {chair}
          </button>
        );
      })}
    </div>
  );

  const DateNav = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => view === "monthly" && onMonthChange(addMonths(activeMonth, -1))}
        className="h-8 w-8 rounded-[var(--v2-radius-badge)] flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
        aria-label="Prethodni period"
      >
        <ChevronLeft className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
      </button>
      <div
        className={`text-[13px] font-medium whitespace-nowrap text-center ${compact ? "min-w-[140px]" : "min-w-[180px]"}`}
        style={{ color: "var(--v2-text-heading)" }}
      >
        {dateRangeLabel}
      </div>
      <button
        onClick={() => view === "monthly" && onMonthChange(addMonths(activeMonth, 1))}
        className="h-8 w-8 rounded-[var(--v2-radius-badge)] flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
        aria-label="Sledeći period"
      >
        <ChevronRight className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
      </button>
      <button
        onClick={() => view === "monthly" && onMonthChange(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
        className="h-8 px-2.5 rounded-[var(--v2-radius-badge)] text-[12px] font-semibold transition-all whitespace-nowrap ml-1"
        style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
      >
        Danas
      </button>
    </div>
  );

  const ViewSegment = () => (
    <div className="flex items-center bg-[color:var(--v2-input-bg)] rounded-[var(--v2-radius-badge)] p-0.5">
      {viewOptions.map((label) => {
        const key = VIEW_LABEL_TO_KEY[label];
        const isActive = view === key;
        return (
          <button
            key={label}
            onClick={() => onViewChange(key)}
            className="px-3 py-1.5 rounded-[5px] text-[12px] font-semibold transition-all"
            style={
              isActive
                ? { background: "var(--v2-surface)", color: "var(--v2-text-heading)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                : { color: "var(--v2-text-muted)" }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const WeekendToggle = () => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-[12px] font-medium" style={{ color: "var(--v2-text-muted)" }}>
        Vikend
      </span>
      <button
        onClick={() => onWeekendChange(!includeWeekend)}
        className="relative w-10 h-[22px] rounded-full transition-colors"
        style={{ background: includeWeekend ? "var(--v2-primary)" : "var(--v2-border)" }}
        role="switch"
        aria-checked={includeWeekend}
        aria-label="Uključi vikend"
      >
        <div
          className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
          style={{ transform: includeWeekend ? "translateX(22px)" : "translateX(3px)" }}
        />
      </button>
    </label>
  );

  const InlineLegend = () => (
    <div className="flex items-center gap-3 ml-auto">
      {LEGEND_ITEMS.map(({ key, label, tokenSuffix }) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: `var(--v2-cal-${tokenSuffix})` }} />
          <span className="text-[11px] font-medium" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
        </div>
      ))}
    </div>
  );

  // ── Mobile: controls only (no title row — screen wrapper has its own navbar) ─
  if (layout === "mobile") {
    return (
      <div className="rounded-[var(--v2-radius-card)] border border-[color:var(--v2-border)] bg-[color:var(--v2-surface)] px-3 py-2.5 flex flex-col gap-2 flex-shrink-0">
        {/* Row 1: Chair chips (horizontal scroll) + Izvezi icon */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 overflow-x-auto flex-1 pb-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mr-1" style={{ color: "var(--v2-text-muted)" }}>Stolica</span>
            {([1, 2, 3, 4] as const).map((chair) => {
              const isActive = selectedChair === chair;
              return (
                <button
                  key={chair}
                  onClick={() => onChairChange(chair)}
                  className="flex-shrink-0 w-9 h-9 rounded-[var(--v2-radius-badge)] flex items-center justify-center text-[13px] font-semibold transition-all"
                  style={
                    isActive
                      ? { background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }
                      : { background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }
                  }
                >
                  {chair}
                </button>
              );
            })}
          </div>
          <button
            onClick={onExport}
            disabled={exportDisabled}
            className="flex-shrink-0 h-9 w-9 rounded-[var(--v2-radius-badge)] flex items-center justify-center border border-[color:var(--v2-border)] transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--v2-surface)" }}
            aria-label="Izvezi CSV"
            title="Izvezi podatke"
          >
            <Download className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
          </button>
        </div>
        {/* Row 2: Date nav + View options */}
        <div className="flex items-center justify-between gap-2">
          <DateNav compact />
          <ViewSegment />
        </div>
      </div>
    );
  }

  // ── Desktop + Tablet: title row + divider + controls row(s) — single card ──
  return (
    <div className="rounded-[var(--v2-radius-card)] border border-[color:var(--v2-border)] bg-[color:var(--v2-surface)] px-6 py-4 flex flex-col gap-3.5 flex-shrink-0">
      {/* Title row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-[var(--v2-radius-icon)] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--v2-primary)" }}
          >
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold leading-tight tracking-tight" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
              Kalendar termina
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
              Pregled rasporeda i upravljanje terminima
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExport}
            disabled={exportDisabled}
            className="h-9 px-3.5 rounded-[var(--v2-radius-pill)] border border-[color:var(--v2-border)] bg-[color:var(--v2-surface)] text-[13px] font-medium transition-opacity hover:opacity-80 flex items-center gap-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: "var(--v2-text)" }}
          >
            <Download className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
            Izvezi
          </button>
          <button
            onClick={onNewAppointment}
            className="h-9 px-4 rounded-[var(--v2-radius-pill)] text-[13px] font-medium flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-90 active:opacity-75"
            style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
          >
            <Plus className="h-3.5 w-3.5" />
            Novi termin
          </button>
        </div>
      </div>

      {/* Subtle horizontal divider */}
      <div className="h-px bg-[color:var(--v2-border)]" />

      {/* Controls — desktop: single row; tablet: two rows */}
      {layout === "desktop" ? (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 border-r border-[color:var(--v2-border)] pr-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>Stolica</span>
            <ChairTabs />
          </div>
          <div className="border-r border-[color:var(--v2-border)] pr-4">
            <DateNav />
          </div>
          <div className="flex items-center gap-3">
            <ViewSegment />
            {view === "weekly" && (
              <>
                <div className="w-px h-6 bg-[color:var(--v2-border)]" />
                <WeekendToggle />
              </>
            )}
          </div>
          <InlineLegend />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {/* Tablet row 1: Chair + date nav */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>Stolica</span>
              <ChairTabs />
            </div>
            <div className="ml-auto">
              <DateNav />
            </div>
          </div>
          {/* Tablet row 2: View + weekend + legend */}
          <div className="flex items-center gap-3 flex-wrap">
            <ViewSegment />
            {view === "weekly" && (
              <>
                <div className="w-px h-5 bg-[color:var(--v2-border)]" />
                <WeekendToggle />
              </>
            )}
            <InlineLegend />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Appointment card ─────────────────────────────────────────────────────────

function AppointmentCard({
  appointment,
  top,
  height,
  maxHeight,
  onCardClick,
}: {
  appointment: Appointment;
  top: number;
  height: number;
  maxHeight: number;
  onCardClick?: (appt: Appointment) => void;
}) {
  const displayStatus = getDisplayStatus(appointment.status, appointment.isUrgent);
  const s = STATUS_STYLES[displayStatus];
  const cardHeight = Math.min(clamp(height, 48, 300), maxHeight);
  const isCompact  = cardHeight < 65;
  const isCanceled = appointment.status === "OTKAZANO";

  return (
    <div
      className={`absolute left-1.5 right-1.5 rounded-lg border overflow-hidden transition-all duration-150 ${isCanceled ? "" : "hover:-translate-y-px hover:shadow-md"} focus-within:ring-2 focus-within:ring-[color:var(--v2-primary)] focus-within:ring-offset-1 ${s.card}`}
      style={{ top, height: cardHeight, maxHeight, cursor: onCardClick ? "pointer" : "default" }}
      tabIndex={0}
      role="button"
      aria-label={`${appointment.patientName} — ${appointment.procedureLabel}, ${appointment.startTime}`}
      onClick={(e) => { e.stopPropagation(); onCardClick?.(appointment); }}
    >
      <div className="h-full grid grid-cols-[3px_1fr]">
        <div className={s.bar} />
        <div className={`flex flex-col min-w-0 overflow-hidden ${isCompact ? "px-1.5 py-1" : "px-2 py-1.5"}`}>
          <div className="flex items-center justify-between gap-1 mb-0.5 flex-shrink-0">
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: "var(--v2-text-muted)" }}>
              {appointment.startTime}
            </span>
            {/* Status pill always visible — compact cards get a smaller variant */}
            <span className={`inline-flex items-center gap-0.5 rounded-full font-semibold flex-shrink-0 ${s.pill} ${isCompact ? "px-1 py-px text-[8px]" : "px-1.5 py-px text-[9px]"}`}>
              {s.icon}{displayStatus}
            </span>
          </div>
          <div className="text-[12px] font-semibold leading-tight truncate" style={{ color: "var(--v2-text-heading)" }}>
            {appointment.patientName}
          </div>
          {!isCompact && (
            <div className="text-[11px] leading-snug truncate mt-px" style={{ color: "var(--v2-text-muted)" }}>
              {appointment.procedureLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Current time line ────────────────────────────────────────────────────────
// Rendered as absolute child of the body grid (position: relative)

function CurrentTimeLine({
  nowMin,
  pxPerMin,
}: {
  nowMin: number;
  pxPerMin: number;
}) {
  if (nowMin < GRID_START_MIN || nowMin > GRID_END_MIN) return null;
  const y     = Math.round((nowMin - GRID_START_MIN) * pxPerMin);
  const label = `${padTime(Math.floor(nowMin / 60))}:${padTime(nowMin % 60)}`;

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-20"
      style={{ top: y }}
    >
      {/* Time label in gutter */}
      <div
        className="absolute text-[10px] font-bold tabular-nums"
        style={{ left: 4, top: -9, color: "var(--v2-primary)" }}
      >
        {label}
      </div>
      {/* Dot at gutter/grid junction */}
      <div
        className="absolute w-2 h-2 rounded-full -translate-y-1/2"
        style={{ left: TIME_COL_W - 4, background: "var(--v2-primary)" }}
      />
      {/* Line across day columns */}
      <div
        className="absolute h-[2px] -translate-y-1/2"
        style={{ left: TIME_COL_W, right: 0, background: "var(--v2-primary)", opacity: 0.45 }}
      />
    </div>
  );
}

// ─── Calendar grid (daily + weekly) ──────────────────────────────────────────

function CalendarGrid({
  days,
  visibleAppointments,
  pxPerMin,
  view,
  includeWeekend,
  nowMin,
  selectedChair,
  onSlotClick,
  onSlotPlusClick,
  onCardClick,
}: {
  days: readonly DayInfo[];
  visibleAppointments: Appointment[];
  pxPerMin: number;
  view: "daily" | "weekly";
  includeWeekend: boolean;
  nowMin: number;
  selectedChair: 1 | 2 | 3 | 4;
  onSlotClick?: (e: React.MouseEvent<HTMLDivElement>, dateISO: string, chairId: 1 | 2 | 3 | 4) => void;
  onSlotPlusClick?: (dateISO: string, chairId: 1 | 2 | 3 | 4) => void;
  onCardClick?: (appt: Appointment) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // On mount, scroll to 08:00 (1 hour from GRID_START 07:00).
  // The user can still scroll up to see 07:00.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = Math.round(60 * pxPerMin);
  // pxPerMin is stable per layout; run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dayCount   = days.length;
  const colMinW    = view === "daily" ? "0px" : (includeWeekend ? "120px" : "160px");
  // Single source of truth for both header and body column widths
  const GRID_TEMPLATE = `${TIME_COL_W}px repeat(${dayCount}, minmax(${colMinW}, 1fr))`;
  const gridHeight = Math.round(TOTAL_MIN * pxPerMin);
  const hourHeight = 60 * pxPerMin;

  const todayVisible = days.some((d) => d.dayKey === TODAY_KEY);

  return (
    // overflow: clip — clips to border-radius without creating a scroll context,
    // so position:sticky inside the child overflow-auto works correctly.
    // Graceful degradation: Safari < 16 shows no corner clip but layout is correct.
    <div
      className="rounded-[var(--v2-radius-card)] border border-[color:var(--v2-border)] bg-[color:var(--v2-surface)] flex flex-col flex-1 min-h-0"
      style={{ overflow: "clip" }}
    >
      {/* ── Single scroll container for BOTH header and body ── */}
      <div ref={scrollRef} className="overflow-auto flex-1" style={{ minHeight: 300 }}>

        {/* ── Sticky day header (scrolls horizontally with body) ── */}
        <div
          className="sticky top-0 z-10 border-b border-[color:var(--v2-border)] bg-[color:var(--v2-surface)]"
          style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE }}
        >
          <div className="px-2 py-3 flex items-end">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
              Vreme
            </span>
          </div>
          {days.map((day) => {
            const isToday   = day.dayKey === TODAY_KEY;
            const isWeekend = WEEKEND_KEYS.includes(day.dayKey);
            return (
              <div
                key={day.index}
                className="px-3 py-3 border-l border-[color:var(--v2-border)]"
                style={{ background: isToday ? "var(--v2-primary-bg)" : isWeekend ? "var(--v2-input-bg)" : undefined }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: isToday ? "var(--v2-primary-dark)" : "var(--v2-text-heading)" }}>
                    {day.label}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-px rounded-full"
                      style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>
                      Danas
                    </span>
                  )}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: isToday ? "var(--v2-primary)" : "var(--v2-text-muted)" }}>
                  {day.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Body grid (position:relative for now-line) ─────── */}
        {/* 8px top spacer gives 07:00 label breathing room below the sticky header */}
        <div style={{ paddingTop: 8 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: GRID_TEMPLATE,
            height: gridHeight,
            position: "relative",
          }}
        >
          {/* Time gutter */}
          <div className="relative border-r border-[color:var(--v2-border)] bg-[color:var(--v2-surface)] h-full">
            {HOUR_LABELS.map((t, idx) => (
              <div
                key={t}
                className="absolute flex items-start justify-end pr-2.5 w-full"
                style={{ top: idx * hourHeight, height: hourHeight }}
              >
                <span
                  className={`text-[11px] font-medium tabular-nums${idx === 0 ? "" : " -translate-y-1/2"}`}
                  style={{ color: "var(--v2-text-muted)" }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const isToday   = day.dayKey === TODAY_KEY;
            const isWeekend = WEEKEND_KEYS.includes(day.dayKey);
            const dayAppts  = visibleAppointments.filter((a) => a.dayKey === day.dayKey);

            return (
              <div
                key={day.index}
                className="relative border-r border-[color:var(--v2-border)] last:border-r-0 overflow-hidden h-full"
                style={{
                  background: isToday
                    ? "color-mix(in srgb, var(--v2-primary-bg) 25%, var(--v2-surface))"
                    : isWeekend
                      ? "var(--v2-input-bg)"
                      : "var(--v2-surface)",
                }}
              >
                <div
                  style={{ height: gridHeight, cursor: onSlotClick ? "pointer" : "default" }}
                  className="relative group"
                  onClick={onSlotClick ? (e) => onSlotClick(e, day.dateISO, selectedChair) : undefined}
                >
                  {/* Slot hover tint — pointer-events-none so it doesn't block card clicks */}
                  {onSlotClick && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none"
                      style={{ background: "color-mix(in srgb, var(--v2-primary) 8%, transparent)", zIndex: 0 }}
                    />
                  )}
                  {/* Plus affordance — separate callback avoids Y-offset bug (button rect ≠ slot rect) */}
                  {onSlotPlusClick && (
                    <button
                      type="button"
                      aria-label="Dodaj termin"
                      onClick={(e) => { e.stopPropagation(); onSlotPlusClick(day.dateISO, selectedChair); }}
                      className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-100 h-6 w-6 rounded-full flex items-center justify-center"
                      style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {/* Hourly lines — strongest (opacity 0.65) */}
                  {HOUR_LABELS.map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute left-0 right-0 border-t border-[color:var(--v2-border)]"
                      style={{ top: idx * hourHeight, opacity: idx === 0 ? 0 : 0.65 }}
                    />
                  ))}
                  {/* 30-min dashed lines — medium (opacity 0.34) */}
                  {HOUR_LABELS.slice(0, -1).map((_, idx) => (
                    <div
                      key={`h-${idx}`}
                      className="absolute left-0 right-0 border-t border-dashed border-[color:var(--v2-border)]"
                      style={{ top: idx * hourHeight + hourHeight / 2, opacity: 0.34 }}
                    />
                  ))}
                  {/* 15-min dotted lines — most subtle (opacity 0.18); only when density allows */}
                  {hourHeight >= 64 && HOUR_LABELS.slice(0, -1).map((_, idx) =>
                    ([0.25, 0.75] as const).map((frac) => (
                      <div
                        key={`q-${idx}-${frac}`}
                        className="absolute left-0 right-0 border-t border-dotted border-[color:var(--v2-border)]"
                        style={{ top: idx * hourHeight + hourHeight * frac, opacity: 0.18 }}
                      />
                    ))
                  )}
                  {/* Appointment cards */}
                  {dayAppts.map((a) => {
                    const t    = Math.round((toMinutes(a.startTime) - GRID_START_MIN) * pxPerMin);
                    const h    = Math.round(a.durationMin * pxPerMin);
                    const maxH = gridHeight - t - 8;
                    return (
                      <AppointmentCard
                        key={a.id}
                        appointment={a}
                        top={Math.max(clamp(t, 2, gridHeight - 54), 2)}
                        height={h}
                        maxHeight={maxH}
                        onCardClick={onCardClick}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Now line — absolute within body grid (shares its reference frame) */}
          {todayVisible && (
            <CurrentTimeLine nowMin={nowMin} pxPerMin={pxPerMin} />
          )}
        </div>
        </div> {/* /paddingTop spacer */}
      </div>
    </div>
  );
}

// ─── Monthly view ─────────────────────────────────────────────────────────────

function CalendarMonthView({
  appointments,
  activeMonth,
  nowDate,
  onDayClick,
}: {
  appointments: Appointment[];
  activeMonth: Date;
  nowDate: Date;
  onDayClick?: (dateISO: string) => void;
}) {
  const todayStr = `${nowDate.getFullYear()}-${padTime(nowDate.getMonth() + 1)}-${padTime(nowDate.getDate())}`;
  const weeks = buildMonthGrid(activeMonth);

  // Index appointments by dateISO for O(1) lookup
  const byDate: Record<string, Appointment[]> = {};
  for (const a of appointments) {
    (byDate[a.dateISO] ??= []).push(a);
  }

  return (
    <div
      className="rounded-[var(--v2-radius-card)] border border-[color:var(--v2-border)] bg-[color:var(--v2-surface)] flex flex-col flex-1 min-h-0"
      style={{ overflow: "clip" }}
    >
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-[color:var(--v2-border)] sticky top-0 z-10 bg-[color:var(--v2-surface)]">
        {MONTH_DAY_HEADERS.map((h, i) => (
          <div
            key={h}
            className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider border-r border-[color:var(--v2-border)] last:border-r-0"
            style={{ color: i >= 5 ? "var(--v2-text-muted)" : "var(--v2-text-heading)" }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div className="overflow-y-auto flex-1">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7 border-b border-[color:var(--v2-border)] last:border-b-0"
            style={{ minHeight: 88 }}
          >
            {week.map((cell, ci) => {
              const isToday   = cell.dateStr === todayStr;
              const isWeekend = ci >= 5;
              const isOutside = cell.day === null;
              const dayAppts  = cell.dateStr ? (byDate[cell.dateStr] ?? []) : [];
              const shown     = dayAppts.slice(0, 3);
              const extra     = dayAppts.length - shown.length;

              return (
                <div
                  key={ci}
                  className="p-2 border-r border-[color:var(--v2-border)] last:border-r-0"
                  style={{
                    background: isOutside
                      ? "var(--v2-input-bg)"
                      : isToday
                        ? "color-mix(in srgb, var(--v2-primary-bg) 40%, var(--v2-surface))"
                        : isWeekend
                          ? "var(--v2-input-bg)"
                          : "var(--v2-surface)",
                    cursor: (!isOutside && onDayClick) ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (!isOutside && cell.dateStr && onDayClick) {
                      onDayClick(cell.dateStr);
                    }
                  }}
                >
                  {cell.day !== null && (
                    <>
                      <div
                        className="text-[12px] font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                        style={{
                          background: isToday ? "var(--v2-primary)" : "transparent",
                          color: isToday ? "var(--v2-primary-fg)" : isWeekend ? "var(--v2-text-muted)" : "var(--v2-text-heading)",
                        }}
                      >
                        {cell.day}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {shown.map((a) => {
                          const ds = getDisplayStatus(a.status, a.isUrgent);
                          const s  = STATUS_STYLES[ds];
                          return (
                            <div
                              key={a.id}
                              className={`text-[10px] font-medium truncate px-1.5 py-0.5 rounded-sm ${s.pill}`}
                            >
                              {a.startTime} {a.patientName}
                            </div>
                          );
                        })}
                        {extra > 0 && (
                          <div className="text-[10px] font-medium" style={{ color: "var(--v2-text-muted)" }}>
                            +{extra} više
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export function CalendarNewDesignOgie({
  size = "square",
  layout = "desktop",
}: {
  size?: MockSize;
  layout?: CalendarLayout;
}) {
  const defaultView: CalendarView = layout === "mobile" ? "daily" : "weekly";
  const [view, setView]           = useState<CalendarView>(defaultView);
  const [selectedChair, setSelectedChair] = useState<1 | 2 | 3 | 4>(1);
  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [activeMonth, setActiveMonth] = useState<Date>(
    () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); }
  );

  // ── Appointments from shared context ──────────────────────────────────────
  const { appointments, addAppointment, cancelAppointment } = useAppointments();
  const router = useRouter();

  // ── Appointment details drawer state ───────────────────────────────────────
  const [detailsOpen, setDetailsOpen]       = useState(false);
  const [selectedAppt, setSelectedAppt]     = useState<Appointment | null>(null);

  // ── Create-appointment drawer state ────────────────────────────────────────
  const [drawerOpen, setDrawerOpen]               = useState(false);
  const [drawerInitialDate, setDrawerInitialDate] = useState<string>("");
  const [drawerInitialTime, setDrawerInitialTime] = useState<string>("09:00");
  const [drawerInitialChairId, setDrawerInitialChairId] = useState<1 | 2 | 3 | 4>(1);

  const now    = useNow();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const pxPerMin = layout === "mobile" ? 3.0 : size === "wide" ? 2.3 : 2.7;

  const DAYS =
    view === "daily"  ? [TODAY_DAY_INFO] :
    includeWeekend    ? ALL_DAYS :
                        WEEKDAYS;

  // Full set for the selected chair — kept for CSV export and state consistency
  const chairAppointments = appointments.filter((a) => a.chairId === selectedChair);

  // Renderable subset — OTKAZANO excluded so cancelled slots don't block new bookings
  const visibleAppointments = chairAppointments.filter(
    (a) => a.status !== "OTKAZANO"
  );

  const exportableAppts = getExportableAppointments(view, chairAppointments, DAYS, activeMonth);

  const dateRangeLabel =
    view === "monthly" ? formatMonthLabel(activeMonth) :
    view === "daily"   ? `${TODAY_DAY_INFO.label}, ${TODAY_DAY_INFO.date}. dec 2025` :
                         `${DAYS[0].date} – ${DAYS[DAYS.length - 1].date}. dec 2025`;

  const handleExport = () => {
    const m = activeMonth.getMonth();
    const y = activeMonth.getFullYear();
    const filename =
      view === "monthly" ? `termini-${SERBIAN_MONTHS[m].toLowerCase()}-${y}.csv` :
      view === "daily"   ? `termini-${TODAY_DAY_INFO.date.replace(".", "-")}.csv` :
                           `termini-nedeljni.csv`;
    exportToCSV(exportableAppts, filename);
  };

  // Decode Y click position → time string, then open drawer
  const handleSlotClick = (
    e: React.MouseEvent<HTMLDivElement>,
    dateISO: string,
    chairId: 1 | 2 | 3 | 4,
  ) => {
    const rect    = e.currentTarget.getBoundingClientRect();
    const yOffset = e.clientY - rect.top; // viewport-relative; accounts for scroll naturally
    const minsFromStart  = Math.floor(yOffset / pxPerMin / 15) * 15; // floor → round DOWN
    const totalMinutes = clamp(GRID_START_MIN + minsFromStart, GRID_START_MIN, GRID_END_MIN - 15);
    const hh = padTime(Math.floor(totalMinutes / 60));
    const mm = padTime(totalMinutes % 60);
    setDrawerInitialDate(dateISO);
    setDrawerInitialTime(`${hh}:${mm}`);
    setDrawerInitialChairId(chairId);
    setDrawerOpen(true);
  };

  // Plus-button click → default time 09:00 (avoids Y-offset calc with wrong currentTarget)
  const handlePlusClick = (dateISO: string, chairId: 1 | 2 | 3 | 4) => {
    setDrawerInitialDate(dateISO);
    setDrawerInitialTime("09:00");
    setDrawerInitialChairId(chairId);
    setDrawerOpen(true);
  };

  // Month-view day cell click → open drawer with 09:00 default
  const handleMonthDayClick = (dateISO: string) => {
    setDrawerInitialDate(dateISO);
    setDrawerInitialTime("09:00");
    setDrawerInitialChairId(selectedChair);
    setDrawerOpen(true);
  };

  // "Novi termin" button → today + current time floored to 15 min
  const handleNewAppointment = () => {
    setDrawerInitialDate(toDateISO(now));
    setDrawerInitialTime(floorTo15(now));
    setDrawerInitialChairId(selectedChair);
    setDrawerOpen(true);
  };

  const handleAppointmentCreated = (appt: Appointment) => {
    addAppointment(appt);
  };

  const handleCardClick = (appt: Appointment) => {
    setSelectedAppt(appt);
    setDetailsOpen(true);
  };

  const handleCancelAppt = (id: string, payload: { reason: string; note?: string }) => {
    cancelAppointment(id, payload);
    setDetailsOpen(false);
    setSelectedAppt(null);
  };

  const handleCompleteAppt = (id: string) => {
    setDetailsOpen(false);
    setSelectedAppt(null);
    router.push(`/ui-lab/figma-dashboard/calendar/appointments/${id}/complete`);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <CalendarTopBar
        view={view}
        onViewChange={setView}
        selectedChair={selectedChair}
        onChairChange={setSelectedChair}
        includeWeekend={includeWeekend}
        onWeekendChange={setIncludeWeekend}
        activeMonth={activeMonth}
        onMonthChange={setActiveMonth}
        dateRangeLabel={dateRangeLabel}
        layout={layout}
        onExport={handleExport}
        exportDisabled={exportableAppts.length === 0}
        onNewAppointment={handleNewAppointment}
      />

      {view === "monthly" ? (
        <CalendarMonthView
          appointments={visibleAppointments}
          activeMonth={activeMonth}
          nowDate={now}
          onDayClick={handleMonthDayClick}
        />
      ) : (
        <CalendarGrid
          days={DAYS}
          visibleAppointments={visibleAppointments}
          pxPerMin={pxPerMin}
          view={view}
          includeWeekend={includeWeekend}
          nowMin={nowMin}
          selectedChair={selectedChair}
          onSlotClick={handleSlotClick}
          onSlotPlusClick={handlePlusClick}
          onCardClick={handleCardClick}
        />
      )}

      <CreateAppointmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialDate={drawerInitialDate}
        initialTime={drawerInitialTime}
        initialChairId={drawerInitialChairId}
        onCreated={handleAppointmentCreated}
      />

      <AppointmentDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        appointment={selectedAppt}
        onCancel={handleCancelAppt}
        onComplete={handleCompleteAppt}
      />
    </div>
  );
}

export default CalendarNewDesignOgie;
