"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Appointment, DayKey, Treatment, ApptType, RecurrenceSeries, SeriesStatus } from "./types";

// ─── Local helper ─────────────────────────────────────────────────────────────

const DAY_KEYS_BY_JS_DOW: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function dateToDayKey(iso: string): DayKey {
  return DAY_KEYS_BY_JS_DOW[new Date(iso + "T12:00:00").getDay()];
}

// ─── Seed data (mirrors MOCK_APPTS_INITIAL in CalendarNewDesign) ──────────────
// Keeping the seed here so CalendarNewDesign can drop its local useState.

const SEED_APPOINTMENTS: Appointment[] = [
  { id: "apt-001", patientName: "Sanja Petrović",    procedureLabel: "Vađenje zuba",        startTime: "08:15", dateISO: "2025-12-08", dayKey: "mon", chairId: 1, status: "ZAVRSENO",  durationMin: 60 },
  { id: "apt-002", patientName: "Gorana Simić",      procedureLabel: "Čišćenje kamenca",    startTime: "09:45", dateISO: "2025-12-08", dayKey: "mon", chairId: 1, status: "ZAVRSENO",  durationMin: 75 },
  { id: "apt-003", patientName: "Milica Stojanović", procedureLabel: "Retencija",           startTime: "13:00", dateISO: "2025-12-08", dayKey: "mon", chairId: 1, status: "ZAKAZANO",  durationMin: 60 },
  { id: "apt-020", patientName: "Dragan Nikolić",    procedureLabel: "Kontrola implantata", startTime: "16:30", dateISO: "2025-12-08", dayKey: "mon", chairId: 1, status: "ZAKAZANO",  durationMin: 45 },
  { id: "apt-004", patientName: "Nikola Ilić",       procedureLabel: "Kontrola",            startTime: "09:15", dateISO: "2025-12-09", dayKey: "tue", chairId: 1, status: "ZAKAZANO",  isUrgent: true, durationMin: 90 },
  { id: "apt-005", patientName: "Dunja Matić",       procedureLabel: "Endodoncija",         startTime: "11:30", dateISO: "2025-12-09", dayKey: "tue", chairId: 1, status: "ZAKAZANO",  durationMin: 120 },
  { id: "apt-021", patientName: "Jovana Ristić",     procedureLabel: "Pregled",             startTime: "17:00", dateISO: "2025-12-09", dayKey: "tue", chairId: 1, status: "ZAKAZANO",  durationMin: 30 },
  { id: "apt-006", patientName: "Marko Jovanović",   procedureLabel: "Ortodontski pregled", startTime: "07:30", dateISO: "2025-12-10", dayKey: "wed", chairId: 1, status: "ZAKAZANO",  durationMin: 60 },
  { id: "apt-007", patientName: "Petar Đorđević",    procedureLabel: "Provera implantata",  startTime: "12:00", dateISO: "2025-12-10", dayKey: "wed", chairId: 1, status: "ZAKAZANO",  durationMin: 90 },
  { id: "apt-022", patientName: "Katarina Mitrović", procedureLabel: "Plomba",              startTime: "18:00", dateISO: "2025-12-10", dayKey: "wed", chairId: 1, status: "ZAKAZANO",  durationMin: 45 },
  { id: "apt-008", patientName: "Jelena Marić",      procedureLabel: "Plomba",              startTime: "11:00", dateISO: "2025-12-11", dayKey: "thu", chairId: 1, status: "ZAKAZANO",  durationMin: 60 },
  { id: "apt-009", patientName: "Stefan Kovačević",  procedureLabel: "Konsultacija",        startTime: "14:15", dateISO: "2025-12-11", dayKey: "thu", chairId: 1, status: "ZAKAZANO",  durationMin: 60 },
  { id: "apt-010", patientName: "Ana Petrović",      procedureLabel: "Kontrola",            startTime: "09:00", dateISO: "2025-12-12", dayKey: "fri", chairId: 1, status: "ZAKAZANO",  durationMin: 75 },
  { id: "apt-023", patientName: "Miloš Popović",     procedureLabel: "Čišćenje kamenca",    startTime: "15:30", dateISO: "2025-12-12", dayKey: "fri", chairId: 1, status: "ZAKAZANO",  durationMin: 45 },
  { id: "apt-011", patientName: "Ivan Nikolić",      procedureLabel: "Kontrola",            startTime: "09:00", dateISO: "2025-12-08", dayKey: "mon", chairId: 2, status: "ZAKAZANO",  durationMin: 45 },
  { id: "apt-012", patientName: "Maja Pavlović",     procedureLabel: "Plomba",              startTime: "11:00", dateISO: "2025-12-09", dayKey: "tue", chairId: 2, status: "ZAVRSENO",  durationMin: 60 },
  { id: "apt-013", patientName: "Luka Tomić",        procedureLabel: "Čišćenje",            startTime: "14:00", dateISO: "2025-12-10", dayKey: "wed", chairId: 2, status: "ZAKAZANO",  durationMin: 45 },
  { id: "apt-014", patientName: "Sara Janković",     procedureLabel: "Pregled",             startTime: "10:00", dateISO: "2025-12-08", dayKey: "mon", chairId: 3, status: "ZAKAZANO",  durationMin: 30 },
  { id: "apt-015", patientName: "Filip Stanković",   procedureLabel: "Ekstrakcija",         startTime: "13:00", dateISO: "2025-12-11", dayKey: "thu", chairId: 3, status: "ZAKAZANO",  isUrgent: true, durationMin: 90 },
  { id: "apt-016", patientName: "Mila Obradović",    procedureLabel: "Implant",             startTime: "08:30", dateISO: "2025-12-09", dayKey: "tue", chairId: 4, status: "ZAKAZANO",  durationMin: 120 },
  { id: "apt-017", patientName: "Vuk Savić",         procedureLabel: "Rutinski pregled",    startTime: "11:00", dateISO: "2025-12-10", dayKey: "wed", chairId: 4, status: "ZAKAZANO",  durationMin: 30 },
  { id: "apt-018", patientName: "Tijana Lukić",      procedureLabel: "Izbjeljivanje",       startTime: "09:00", dateISO: "2025-12-12", dayKey: "fri", chairId: 2, status: "ZAKAZANO",  durationMin: 90 },
  { id: "apt-019", patientName: "Đorđe Vasić",       procedureLabel: "Vađenje umnjaka",     startTime: "14:00", dateISO: "2025-12-12", dayKey: "fri", chairId: 3, status: "ZAKAZANO",  isUrgent: true, durationMin: 60 },
];

const STORAGE_KEY        = "odontoa_v2_appointments";
const SERIES_STORAGE_KEY = "odontoa_v2_series";

function loadSeriesFromStorage(): RecurrenceSeries[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SERIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecurrenceSeries[];
    // Migration: old format had singular `weekday: number`; migrate to `weekdays: number[]`
    return parsed.map((s) => {
      const legacy = s as RecurrenceSeries & { weekday?: number };
      if (legacy.weekday !== undefined && !s.weekdays) {
        const { weekday, ...rest } = legacy;
        return { ...rest, weekdays: [weekday] } as RecurrenceSeries;
      }
      return s;
    });
  } catch {
    return [];
  }
}

function saveSeriesToStorage(series: RecurrenceSeries[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SERIES_STORAGE_KEY, JSON.stringify(series));
  } catch {}
}

function loadFromStorage(): Appointment[] {
  if (typeof window === "undefined") return SEED_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_APPOINTMENTS;
    return JSON.parse(raw) as Appointment[];
  } catch {
    return SEED_APPOINTMENTS;
  }
}

function saveToStorage(appointments: Appointment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // Storage quota exceeded — ignore
  }
}

// ─── Context shape ────────────────────────────────────────────────────────────

type CancelPayload = { reason: string; note?: string };

type AppointmentsContextValue = {
  appointments: Appointment[];
  series: RecurrenceSeries[];
  addAppointment: (appt: Appointment) => void;
  cancelAppointment: (id: string, payload: CancelPayload) => void;
  completeAppointment: (
    id: string,
    payload: { apptType: ApptType; treatments: Treatment[] },
  ) => void;
  // Series operations
  addSeries: (s: RecurrenceSeries, instances: Appointment[]) => void;
  updateSeriesField: (seriesId: string, patch: Partial<RecurrenceSeries>) => void;
  cancelSeriesFuture: (seriesId: string, fromDateISO: string, payload: CancelPayload) => void;
  cancelSeriesAll: (seriesId: string, payload: CancelPayload) => void;
  // Edit (update any field; series instance: mark as exception)
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  // Reschedule (standalone: update date/time/chair; series instance: mark as exception)
  rescheduleAppointment: (
    id: string,
    patch: { dateISO: string; startTime: string; chairId: 1 | 2 | 3 | 4 },
  ) => void;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(SEED_APPOINTMENTS);
  const [series, setSeries]             = useState<RecurrenceSeries[]>([]);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    setAppointments(loadFromStorage());
    setSeries(loadSeriesFromStorage());
  }, []);

  // Persist to localStorage whenever appointments change
  useEffect(() => { saveToStorage(appointments); }, [appointments]);
  useEffect(() => { saveSeriesToStorage(series); }, [series]);

  const addAppointment = useCallback((appt: Appointment) => {
    setAppointments((prev) => [...prev, appt]);
  }, []);

  const cancelAppointment = useCallback(
    (id: string, payload: { reason: string; note?: string }) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "OTKAZANO" as const,
                cancelReason: payload.reason,
                cancelNote: payload.note,
                canceledAt: new Date().toISOString(),
              }
            : a,
        ),
      );
    },
    [],
  );

  const completeAppointment = useCallback(
    (id: string, payload: { apptType: ApptType; treatments: Treatment[] }) => {
      setAppointments((prev) => {
        const next = prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "ZAVRSENO" as const,
                apptType: payload.apptType,
                treatments: payload.treatments,
                completedAt: new Date().toISOString(),
              }
            : a,
        );
        // Auto-complete series if no ZAKAZANO instances remain
        const completed = next.find((a) => a.id === id);
        if (completed?.seriesId) {
          const sid = completed.seriesId;
          const hasRemaining = next.some((a) => a.seriesId === sid && a.status === "ZAKAZANO");
          if (!hasRemaining) {
            setSeries((prev) =>
              prev.map((s) => s.id === sid ? { ...s, status: "completed" as SeriesStatus } : s),
            );
          }
        }
        return next;
      });
    },
    [],
  );

  // ─── Series operations ──────────────────────────────────────────────────────

  const addSeries = useCallback((s: RecurrenceSeries, instances: Appointment[]) => {
    setSeries((prev) => [...prev, s]);
    setAppointments((prev) => [...prev, ...instances]);
  }, []);

  const updateSeriesField = useCallback((seriesId: string, patch: Partial<RecurrenceSeries>) => {
    setSeries((prev) =>
      prev.map((s) => s.id === seriesId ? { ...s, ...patch } : s),
    );
  }, []);

  const cancelSeriesFuture = useCallback(
    (seriesId: string, fromDateISO: string, payload: { reason: string; note?: string }) => {
      const now = new Date().toISOString();
      setAppointments((prev) =>
        prev.map((a) =>
          a.seriesId === seriesId && a.status === "ZAKAZANO" && a.dateISO >= fromDateISO
            ? { ...a, status: "OTKAZANO" as const, cancelReason: payload.reason, cancelNote: payload.note, canceledAt: now }
            : a,
        ),
      );
      // Update series end date to day before fromDateISO
      setSeries((prev) =>
        prev.map((s) => {
          if (s.id !== seriesId) return s;
          const d = new Date(fromDateISO + "T00:00:00");
          d.setDate(d.getDate() - 1);
          return { ...s, seriesEndDate: d.toISOString().slice(0, 10), status: "completed" as SeriesStatus };
        }),
      );
    },
    [],
  );

  const rescheduleAppointment = useCallback(
    (id: string, patch: { dateISO: string; startTime: string; chairId: 1 | 2 | 3 | 4 }) => {
      setAppointments((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const isSeriesAppt = !!a.seriesId;
          return {
            ...a,
            dateISO: patch.dateISO,
            dayKey: dateToDayKey(patch.dateISO),
            startTime: patch.startTime,
            chairId: patch.chairId,
            ...(isSeriesAppt
              ? {
                  isException: true,
                  originalDateISO: a.originalDateISO ?? a.dateISO,
                }
              : {}),
          };
        }),
      );
    },
    [],
  );

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Appointment>) => {
      setAppointments((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const updated = { ...a, ...patch };
          // Recompute dayKey if dateISO changed
          if (patch.dateISO) {
            updated.dayKey = dateToDayKey(patch.dateISO);
          }
          // Series instance: mark as exception
          if (a.seriesId) {
            updated.isException = true;
            updated.originalDateISO = a.originalDateISO ?? a.dateISO;
          }
          return updated;
        }),
      );
    },
    [],
  );

  const cancelSeriesAll = useCallback(
    (seriesId: string, payload: { reason: string; note?: string }) => {
      const now = new Date().toISOString();
      setAppointments((prev) =>
        prev.map((a) =>
          a.seriesId === seriesId && a.status === "ZAKAZANO"
            ? { ...a, status: "OTKAZANO" as const, cancelReason: payload.reason, cancelNote: payload.note, canceledAt: now }
            : a,
        ),
      );
      setSeries((prev) =>
        prev.map((s) => s.id === seriesId ? { ...s, status: "cancelled" as SeriesStatus } : s),
      );
    },
    [],
  );

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        series,
        addAppointment,
        cancelAppointment,
        completeAppointment,
        addSeries,
        updateSeriesField,
        cancelSeriesFuture,
        cancelSeriesAll,
        updateAppointment,
        rescheduleAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppointments(): AppointmentsContextValue {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) {
    throw new Error("useAppointments must be used within AppointmentsProvider");
  }
  return ctx;
}
