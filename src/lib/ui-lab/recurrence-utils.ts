// ─── Recurrence utilities ──────────────────────────────────────────────────────

import type { Appointment, ApptStatus, DayKey, RecurrenceSeries } from "./types";

const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// Serbian weekday short labels for display (0=Mon … 6=Sun)
export const WEEKDAY_LABELS_SHORT = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
export const WEEKDAY_LABELS_LONG  = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];

// Proper Serbian genitive forms for "every X" (0=Mon … 6=Sun)
export const WEEKDAY_EVERY_LABELS = [
  "svakog ponedeljka",
  "svakog utorka",
  "svake srede",
  "svakog četvrtka",
  "svakog petka",
  "svake subote",
  "svake nedelje",
];

/**
 * ISO weekday index for a YYYY-MM-DD string (0=Mon … 6=Sun).
 * Uses UTC to avoid timezone off-by-one errors.
 */
export function isoWeekday(dateISO: string): number {
  return (new Date(dateISO + "T00:00:00Z").getUTCDay() + 6) % 7;
}

/** Add days to a YYYY-MM-DD string, returns new YYYY-MM-DD. Uses UTC. */
function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Find the ISO date of Monday of the week containing dateISO.
 * Uses UTC to avoid timezone off-by-one errors.
 * Standard: 0=Mon … 6=Sun.
 */
function findWeekMonday(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00Z");
  const dow = (d.getUTCDay() + 6) % 7; // 0=Mon … 6=Sun
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}

/** Format YYYY-MM-DD → DD.MM.YYYY for display. */
export function formatDateSr(dateISO: string): string {
  const [y, m, day] = dateISO.split("-");
  return `${day}.${m}.${y}`;
}

/**
 * Generate all Appointment instances for a RecurrenceSeries.
 * Supports multiple weekdays (e.g. [2, 4] = Wed + Fri).
 * Hard cap: 52 weeks.
 *
 * Weekday standard (locked): 0=Mon … 6=Sun — same as isoWeekday() and WEEKDAY_LABELS_SHORT indices.
 */
export function generateOccurrences(series: RecurrenceSeries): Appointment[] {
  const results: Appointment[] = [];
  const skipped = new Set(series.skippedDates);
  const weekdays = [...series.weekdays].sort((a, b) => a - b); // sorted 0=Mon…6=Sun
  const cap = 52;

  // Dev-time assertions to verify weekday standard consistency
  if (process.env.NODE_ENV === "development") {
    // 2025-12-11 is a Thursday → isoWeekday should return 3
    console.assert(isoWeekday("2025-12-11") === 3, "isoWeekday 2025-12-11 should be 3 (Thu)");
    // 2025-12-08 is a Monday → should return 0
    console.assert(isoWeekday("2025-12-08") === 0, "isoWeekday 2025-12-08 should be 0 (Mon)");
  }

  let weekMonday = findWeekMonday(series.seriesStartDate);

  for (let weekIdx = 0; weekIdx < cap; weekIdx++) {
    for (const wd of weekdays) {
      const cursor = addDays(weekMonday, wd);

      // Skip dates before series start
      if (cursor < series.seriesStartDate) continue;

      // End condition: date exceeds seriesEndDate
      if (series.seriesEndDate && cursor > series.seriesEndDate) return results;

      // End condition: occurrences limit reached
      if (series.maxOccurrences !== null && results.length >= series.maxOccurrences) return results;

      if (!skipped.has(cursor)) {
        const num = String(results.length + 1).padStart(3, "0");
        const appt: Appointment = {
          id: `${series.id}-${num}`,
          patientName: series.patientName,
          procedureLabel: series.procedureLabel,
          doctorName: series.doctorName,
          startTime: series.startTime,
          dateISO: cursor,
          dayKey: DAY_KEYS[isoWeekday(cursor)],
          chairId: series.chairId,
          status: "ZAKAZANO" as ApptStatus,
          durationMin: series.durationMin,
          notes: series.notes,
          seriesId: series.id,
          isException: false,
        };
        results.push(appt);
      }
    }

    weekMonday = addDays(weekMonday, 7);
  }

  return results;
}

/**
 * Compute the end date of a series given start date, weekdays, and occurrence count.
 * Returns the dateISO of the last generated occurrence, or "" if none.
 */
export function computeSeriesEndDate(
  startDate: string,
  weekdays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[],
  count: number,
): string {
  if (!startDate || weekdays.length === 0 || count < 1) return "";
  const temp: RecurrenceSeries = {
    id: "_compute",
    patientName: "",
    procedureLabel: "",
    chairId: 1,
    frequency: "weekly",
    weekdays,
    startTime: "09:00",
    durationMin: 30,
    seriesStartDate: startDate,
    seriesEndDate: null,
    maxOccurrences: count,
    skippedDates: [],
    status: "active",
    createdAt: "",
  };
  const occurrences = generateOccurrences(temp);
  return occurrences.length > 0 ? occurrences[occurrences.length - 1].dateISO : "";
}

/**
 * Compute the number of occurrences for a series given start date, weekdays, and end date.
 */
export function computeSeriesCount(
  startDate: string,
  weekdays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[],
  endDate: string,
): number {
  if (!startDate || weekdays.length === 0 || !endDate) return 0;
  const temp: RecurrenceSeries = {
    id: "_compute",
    patientName: "",
    procedureLabel: "",
    chairId: 1,
    frequency: "weekly",
    weekdays,
    startTime: "09:00",
    durationMin: 30,
    seriesStartDate: startDate,
    seriesEndDate: endDate,
    maxOccurrences: null,
    skippedDates: [],
    status: "active",
    createdAt: "",
  };
  return generateOccurrences(temp).length;
}

/**
 * Progress info for a series based on its generated appointments.
 */
export function getSeriesProgress(
  seriesId: string,
  appointments: Appointment[],
): { total: number; completed: number; upcoming: number } {
  const all = appointments.filter((a) => a.seriesId === seriesId);
  const completed = all.filter((a) => a.status === "ZAVRSENO" || a.status === "NIJE_SE_POJAVIO").length;
  const upcoming  = all.filter((a) => a.status === "ZAKAZANO").length;
  return { total: all.length, completed, upcoming };
}

/**
 * Build a human-readable summary line for a series.
 * e.g. "Svakog četvrtka, od 11.12.2025, do 25.12.2025 - 3 termina"
 * e.g. "Svake srede i svakog petka, od 10.12.2025 - 4 termina"
 */
export function seriesSummaryLabel(
  series: Omit<RecurrenceSeries, "id" | "patientName" | "procedureLabel" | "status" | "createdAt" | "skippedDates">,
  generatedCount: number,
): string {
  const sorted = [...series.weekdays].sort((a, b) => a - b);
  const dayParts = sorted.map((i) => WEEKDAY_EVERY_LABELS[i]).join(" i ");
  const capitalized = dayParts.charAt(0).toUpperCase() + dayParts.slice(1);
  const startLabel = formatDateSr(series.seriesStartDate);

  if (series.seriesEndDate) {
    const endLabel = formatDateSr(series.seriesEndDate);
    return `${capitalized}, od ${startLabel}, do ${endLabel} - ${generatedCount} termina`;
  }
  return `${capitalized}, od ${startLabel} - ${generatedCount} termina`;
}
