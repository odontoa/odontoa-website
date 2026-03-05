"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Search, Check, ChevronDown, ChevronUp, User, Plus, AlertCircle, Repeat, ChevronLeft } from "lucide-react";
import type { Appointment } from "./CalendarNewDesign";
import type { RecurrenceSeries } from "@/lib/ui-lab/types";
import { useAppointments } from "@/lib/ui-lab/appointments-context";
import {
  generateOccurrences,
  isoWeekday,
  WEEKDAY_LABELS_SHORT,
  WEEKDAY_EVERY_LABELS,
  formatDateSr,
  computeSeriesEndDate,
  computeSeriesCount,
} from "@/lib/ui-lab/recurrence-utils";

// Local helper — avoids circular runtime import with CalendarNewDesign
const DAY_KEYS_ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
type DayKey = typeof DAY_KEYS_ORDER[number];
function dateToDayKey(iso: string): DayKey {
  return DAY_KEYS_ORDER[new Date(iso + "T12:00:00").getDay()];
}

function addMonths(dateISO: string, months: number): string {
  const d = new Date(dateISO + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

// ─── Mock data ────────────────────────────────────────────────────────────────

type MockPatient = { id: string; name: string; phone: string };

const INITIAL_PATIENTS: MockPatient[] = [
  { id: "p1", name: "Ana Petrović",       phone: "+381 60 123 4567" },
  { id: "p2", name: "Marko Jovanović",    phone: "+381 63 234 5678" },
  { id: "p3", name: "Jelena Nikolić",     phone: "+381 64 345 6789" },
  { id: "p4", name: "Stefan Ilić",        phone: "+381 65 456 7890" },
  { id: "p5", name: "Milica Stojanović",  phone: "+381 60 567 8901" },
  { id: "p6", name: "Nikola Marković",    phone: "+381 63 678 9012" },
  { id: "p7", name: "Sanja Đorđević",     phone: "+381 64 789 0123" },
  { id: "p8", name: "Luka Pavlović",      phone: "+381 65 890 1234" },
];

const MOCK_DOCTORS = [
  "Dr. Marko Marković",
  "Dr. Ana Nikolić",
  "Dr. Petar Jovanović",
];

const DURATION_OPTIONS = [15, 30, 45, 60] as const;
type Duration = typeof DURATION_OPTIONS[number];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateAppointmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: string;    // "YYYY-MM-DD"
  initialTime: string;    // "HH:MM"
  initialChairId?: 1 | 2 | 3 | 4;
  onCreated: (appointment: Appointment) => void;
  // Edit mode
  editingAppointment?: Appointment | null;
  onUpdated?: (id: string, patch: Partial<Appointment>) => void;
}

// ─── Small reusable field wrapper ─────────────────────────────────────────────

function FieldRow({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[13px] font-semibold"
        style={{ color: "var(--v2-text-heading)" }}
      >
        {label}
        {helper && (
          <span className="ml-1.5 text-[11px] font-normal" style={{ color: "var(--v2-text-muted)" }}>
            {helper}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-[color:var(--v2-border)]"
      style={{ color: "var(--v2-text-muted)" }}
    >
      {children}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CreateAppointmentDrawer({
  open,
  onOpenChange,
  initialDate,
  initialTime,
  initialChairId,
  onCreated,
  editingAppointment,
  onUpdated,
}: CreateAppointmentDrawerProps) {
  const { addSeries } = useAppointments();
  const isEditMode = !!editingAppointment;

  // ── Patient state ─────────────────────────────────────────────────────────
  const [localPatients, setLocalPatients] = useState<MockPatient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickFirstName, setQuickFirstName] = useState("");
  const [quickLastName, setQuickLastName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");

  // ── Appointment detail state ──────────────────────────────────────────────
  const [doctor, setDoctor] = useState(MOCK_DOCTORS[0]);
  const [date, setDate]     = useState(initialDate);
  const [time, setTime]     = useState(initialTime);
  const [duration, setDuration] = useState<Duration>(30);
  const [chair, setChair]   = useState<1 | 2 | 3 | 4>(initialChairId ?? 1);
  const [notes, setNotes]   = useState("");

  // ── Recurring state ───────────────────────────────────────────────────────
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurWeekdays, setRecurWeekdays] = useState<Set<number>>(new Set([0]));
  const [recurEndMode, setRecurEndMode] = useState<"date" | "count">("count");
  const [recurEndDate, setRecurEndDate] = useState("");
  const [recurCount, setRecurCount] = useState(2);

  // ── Preview step state ────────────────────────────────────────────────────
  const [showPreview, setShowPreview] = useState(false);
  const [previewInstances, setPreviewInstances] = useState<ReturnType<typeof generateOccurrences>>([]);
  const [skippedPreviewDates, setSkippedPreviewDates] = useState<Set<string>>(new Set());

  // ── Validation errors ─────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchRef = useRef<HTMLInputElement>(null);

  // Sync fields whenever drawer opens
  useEffect(() => {
    if (!open) return;

    if (editingAppointment) {
      // Edit mode: pre-fill from existing appointment
      const pat = localPatients.find((p) => p.name === editingAppointment.patientName);
      setSelectedPatient(pat ?? { id: "edit-pat", name: editingAppointment.patientName, phone: "" });
      setDoctor(editingAppointment.doctorName ?? MOCK_DOCTORS[0]);
      setDate(editingAppointment.dateISO);
      setTime(editingAppointment.startTime);
      setDuration((editingAppointment.durationMin as Duration) || 30);
      setChair(editingAppointment.chairId);
      setNotes(editingAppointment.notes ?? "");
      setIsRecurring(false);
    } else {
      // Create mode: reset
      setDate(initialDate);
      setTime(initialTime);
      setChair(initialChairId ?? 1);
      setSelectedPatient(null);
      setPatientSearch("");
      setShowQuickAdd(false);
      setQuickFirstName("");
      setQuickLastName("");
      setQuickPhone("");
      setDoctor(MOCK_DOCTORS[0]);
      setDuration(30);
      setNotes("");
      // Reset recurring
      setIsRecurring(false);
      setRecurWeekdays(new Set([isoWeekday(initialDate)]));
      setRecurEndMode("count");
      setRecurEndDate(addMonths(initialDate, 3));
      setRecurCount(2);
      setShowPreview(false);
      setPreviewInstances([]);
      setSkippedPreviewDates(new Set());
      // Focus search after animation
      const t = setTimeout(() => searchRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }

    setErrors({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialDate, initialTime, initialChairId, editingAppointment]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredPatients = localPatients.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const sortedWeekdays = Array.from(recurWeekdays).sort((a, b) => a - b) as (0|1|2|3|4|5|6)[];

  const recurringPreviewLabel = (() => {
    if (!date || recurWeekdays.size === 0) return "";
    const parts = sortedWeekdays.map((i) => WEEKDAY_EVERY_LABELS[i]).join(" i ");
    const capitalized = parts.charAt(0).toUpperCase() + parts.slice(1);
    if (recurEndMode === "date" && recurEndDate) {
      return `${capitalized}, od ${formatDateSr(date)}, do ${formatDateSr(recurEndDate)}`;
    }
    return `${capitalized}, od ${formatDateSr(date)} - ${recurCount} termina`;
  })();

  // Computed hints
  const computedEndDate = (() => {
    if (!isRecurring || recurEndMode !== "count" || !date || recurWeekdays.size === 0) return "";
    return computeSeriesEndDate(date, sortedWeekdays, recurCount);
  })();

  const computedCount = (() => {
    if (!isRecurring || recurEndMode !== "date" || !date || !recurEndDate || recurWeekdays.size === 0) return 0;
    return computeSeriesCount(date, sortedWeekdays, recurEndDate);
  })();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectPatient = (p: MockPatient) => {
    setSelectedPatient(p);
    setPatientSearch("");
    setErrors((e) => ({ ...e, patient: "" }));
  };

  const handleDeselectPatient = () => {
    setSelectedPatient(null);
  };

  const handleQuickAdd = () => {
    const errs: Record<string, string> = {};
    if (!quickFirstName.trim()) errs.quickFirstName = "Ime je obavezno";
    if (!quickLastName.trim())  errs.quickLastName  = "Prezime je obavezno";
    if (!quickPhone.trim())     errs.quickPhone     = "Telefon je obavezan";
    if (Object.keys(errs).length) { setErrors((e) => ({ ...e, ...errs })); return; }

    const newPatient: MockPatient = {
      id: `quick-${Date.now()}`,
      name: `${quickFirstName.trim()} ${quickLastName.trim()}`,
      phone: quickPhone.trim(),
    };
    setLocalPatients((prev) => [newPatient, ...prev]);
    setSelectedPatient(newPatient);
    setShowQuickAdd(false);
    setQuickFirstName("");
    setQuickLastName("");
    setQuickPhone("");
    setErrors((e) => ({ ...e, patient: "", quickFirstName: "", quickLastName: "", quickPhone: "" }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedPatient)         errs.patient  = "Izaberite ili dodajte pacijenta";
    if (!date)                    errs.date     = "Datum je obavezan";
    if (!time)                    errs.time     = "Vreme je obavezno";
    if (!doctor)                  errs.doctor   = "Doktor je obavezan";
    if (isRecurring && recurEndMode === "date" && !recurEndDate) {
      errs.recurEndDate = "Datum završetka je obavezan";
    }
    if (isRecurring && recurEndMode === "date" && recurEndDate && recurEndDate <= date) {
      errs.recurEndDate = "Datum završetka mora biti posle datuma početka";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoToPreview = () => {
    if (!validate()) return;

    const tempSeries: RecurrenceSeries = {
      id: `series-preview`,
      patientName: selectedPatient!.name,
      procedureLabel: "Termin",
      doctorName: doctor,
      chairId: chair,
      frequency: "weekly",
      weekdays: sortedWeekdays,
      startTime: time,
      durationMin: duration,
      seriesStartDate: date,
      seriesEndDate: recurEndMode === "date" ? recurEndDate : null,
      maxOccurrences: recurEndMode === "count" ? recurCount : null,
      skippedDates: [],
      status: "active",
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const instances = generateOccurrences(tempSeries);
    setPreviewInstances(instances);
    setSkippedPreviewDates(new Set());
    setShowPreview(true);
  };

  const handleSeriesCreate = () => {
    const seriesId = `series-${Date.now()}`;
    const finalSeries: RecurrenceSeries = {
      id: seriesId,
      patientName: selectedPatient!.name,
      procedureLabel: "Termin",
      doctorName: doctor,
      chairId: chair,
      frequency: "weekly",
      weekdays: sortedWeekdays,
      startTime: time,
      durationMin: duration,
      seriesStartDate: date,
      seriesEndDate: recurEndMode === "date" ? recurEndDate : null,
      maxOccurrences: recurEndMode === "count" ? recurCount : null,
      skippedDates: Array.from(skippedPreviewDates),
      status: "active",
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // Re-generate with actual series ID and excluding skipped dates
    const finalSeries2: RecurrenceSeries = { ...finalSeries, skippedDates: Array.from(skippedPreviewDates) };
    const instances = generateOccurrences({ ...finalSeries2, id: seriesId });
    addSeries(finalSeries, instances);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (isRecurring && !isEditMode) {
      handleGoToPreview();
      return;
    }
    if (!validate()) return;

    // Edit mode: patch existing appointment
    if (isEditMode && editingAppointment && onUpdated) {
      onUpdated(editingAppointment.id, {
        patientName:    selectedPatient!.name,
        doctorName:     doctor,
        dateISO:        date,
        startTime:      time,
        durationMin:    duration,
        chairId:        chair,
        notes:          notes.trim() || undefined,
      });
      onOpenChange(false);
      return;
    }

    const newAppt: Appointment = {
      id:             `apt-${Date.now()}`,
      patientName:    selectedPatient!.name,
      procedureLabel: "Termin",
      startTime:      time,
      dateISO:        date,
      dayKey:         dateToDayKey(date),
      chairId:        chair,
      status:         "ZAKAZANO",
      durationMin:    duration,
      doctorName:     doctor,
      notes:          notes.trim() || undefined,
    };

    onCreated(newAppt);
    onOpenChange(false);
  };

  const handleClose = () => onOpenChange(false);

  const toggleSkipDate = (dateISO: string) => {
    setSkippedPreviewDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateISO)) next.delete(dateISO);
      else next.add(dateISO);
      return next;
    });
  };

  const activeCount = previewInstances.filter((i) => !skippedPreviewDates.has(i.dateISO)).length;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — Preview step
  // ─────────────────────────────────────────────────────────────────────────

  if (showPreview) {
    return (
      <>
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(2px)",
            pointerEvents: open ? "auto" : "none",
            opacity: open ? 1 : 0,
          }}
          onClick={handleClose}
          aria-hidden="true"
        />
        <div
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out"
          style={{
            width: "min(420px, 100vw)",
            background: "var(--v2-surface)",
            borderLeft: "1px solid var(--v2-border)",
            borderRadius: "var(--v2-radius-card) 0 0 var(--v2-radius-card)",
            boxShadow: "-8px 0 48px rgba(0,0,0,0.14)",
            transform: open ? "translateX(0)" : "translateX(100%)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Pregled termina"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-[color:var(--v2-border)]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)] -ml-1"
                aria-label="Nazad"
              >
                <ChevronLeft className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
              </button>
              <div>
                <h2 className="font-semibold leading-tight" style={{ fontSize: 16, color: "var(--v2-text-heading)" }}>
                  Pregled termina
                </h2>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
                  {recurringPreviewLabel}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
              aria-label="Zatvori"
            >
              <X className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
            </button>
          </div>

          {/* Summary chip */}
          <div className="px-6 pt-4 pb-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
            >
              <Repeat className="h-3 w-3" />
              {activeCount} od {previewInstances.length} termina aktivno
            </div>
          </div>

          {/* Scrollable date list */}
          <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-1">
            {previewInstances.map((inst) => {
              const isSkipped = skippedPreviewDates.has(inst.dateISO);
              return (
                <button
                  key={inst.dateISO}
                  onClick={() => toggleSkipDate(inst.dateISO)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left"
                  style={{
                    background: isSkipped ? "transparent" : "var(--v2-input-bg)",
                    borderColor: isSkipped ? "var(--v2-border)" : "color-mix(in srgb, var(--v2-primary) 25%, transparent)",
                    opacity: isSkipped ? 0.45 : 1,
                  }}
                >
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all"
                    style={{
                      background: isSkipped ? "transparent" : "var(--v2-primary)",
                      borderColor: isSkipped ? "var(--v2-border)" : "var(--v2-primary)",
                    }}
                  >
                    {!isSkipped && <Check className="h-3 w-3" style={{ color: "var(--v2-primary-fg)" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium"
                      style={{ color: isSkipped ? "var(--v2-text-muted)" : "var(--v2-text-heading)" }}
                    >
                      {WEEKDAY_LABELS_SHORT[isoWeekday(inst.dateISO)]}, {formatDateSr(inst.dateISO)}
                    </p>
                  </div>
                  <p className="text-[12px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>
                    {inst.startTime} · Stolica {inst.chairId}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 flex gap-3 flex-shrink-0 border-t border-[color:var(--v2-border)]"
            style={{ background: "var(--v2-surface)" }}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border transition-colors hover:bg-[color:var(--v2-input-bg)]"
              style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
            >
              Nazad
            </button>
            <button
              onClick={handleSeriesCreate}
              disabled={activeCount === 0}
              className="flex-[2] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-40"
              style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
            >
              Kreiraj {activeCount} {activeCount === 1 ? "termin" : activeCount < 5 ? "termina" : "termina"}
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — Form step
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(2px)",
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: "min(420px, 100vw)",
          background: "var(--v2-surface)",
          borderLeft: "1px solid var(--v2-border)",
          borderRadius: "var(--v2-radius-card) 0 0 var(--v2-radius-card)",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.14)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={isEditMode ? "Izmeni termin" : "Novi termin"}
      >
        {/* ── Sticky header ───────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-[color:var(--v2-border)]"
        >
          <div>
            <h2
              className="font-semibold leading-tight"
              style={{ fontSize: 16, color: "var(--v2-text-heading)" }}
            >
              {isEditMode ? "Izmeni termin" : "Novi termin"}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
              {isEditMode ? "Izmenite podatke termina" : "Zakažite termin za pacijenta"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
            aria-label="Zatvori"
          >
            <X className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
          </button>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Series instance hint (edit mode only) */}
          {isEditMode && editingAppointment?.seriesId && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{ background: "var(--v2-primary-bg)" }}
            >
              <Repeat className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-primary-dark)" }} />
              <p className="text-[12px] font-medium" style={{ color: "var(--v2-primary-dark)" }}>
                Ovo je termin iz serije. Izmene važe samo za ovaj termin.
              </p>
            </div>
          )}

          {/* ─── Section A: Patient picker ─────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <SectionTitle>Pacijent</SectionTitle>

            {selectedPatient ? (
              /* Selected state banner */
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: "var(--v2-primary-bg)",
                  borderColor: "color-mix(in srgb, var(--v2-primary) 30%, transparent)",
                }}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
                >
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "var(--v2-text-heading)" }}>
                    {selectedPatient.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                    {selectedPatient.phone}
                  </p>
                </div>
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
                >
                  <Check className="h-3 w-3" />
                </div>
                {!isEditMode && (
                  <button
                    onClick={handleDeselectPatient}
                    className="h-7 w-7 rounded-full flex items-center justify-center transition-colors hover:bg-[color:var(--v2-border)] flex-shrink-0"
                    aria-label="Promeni pacijenta"
                  >
                    <X className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                  </button>
                )}
              </div>
            ) : (
              /* Search + list */
              <FieldRow label="Pretraga pacijenta" error={errors.patient}>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                    style={{ color: "var(--v2-text-muted)" }}
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Ime ili prezime..."
                    className="w-full h-10 pl-9 pr-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                    style={{
                      background: "var(--v2-input-bg)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>

                {/* Patient list */}
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: "var(--v2-border)", maxHeight: 180, overflowY: "auto" }}
                >
                  {filteredPatients.length === 0 ? (
                    <p
                      className="px-4 py-3 text-[12px] text-center"
                      style={{ color: "var(--v2-text-muted)" }}
                    >
                      Nema rezultata
                    </p>
                  ) : (
                    filteredPatients.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left border-b border-[color:var(--v2-border)] last:border-b-0 transition-colors hover:bg-[color:var(--v2-input-bg)]"
                      >
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                          style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium truncate" style={{ color: "var(--v2-text-heading)" }}>
                            {p.name}
                          </p>
                          <p className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                            {p.phone}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </FieldRow>
            )}

            {/* Quick-add collapsible */}
            {!selectedPatient && (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: "var(--v2-border)" }}
              >
                <button
                  onClick={() => setShowQuickAdd((v) => !v)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[color:var(--v2-input-bg)]"
                >
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--v2-primary-bg)" }}
                  >
                    <Plus className="h-3.5 w-3.5" style={{ color: "var(--v2-primary-dark)" }} />
                  </div>
                  <span className="text-[13px] font-medium flex-1" style={{ color: "var(--v2-text-heading)" }}>
                    Brzo dodaj pacijenta
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                    ime, prezime, tel
                  </span>
                  {showQuickAdd
                    ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
                    : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
                  }
                </button>

                {showQuickAdd && (
                  <div
                    className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-[color:var(--v2-border)]"
                    style={{ background: "var(--v2-input-bg)" }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <FieldRow label="Ime" error={errors.quickFirstName}>
                        <input
                          type="text"
                          value={quickFirstName}
                          onChange={(e) => {
                            setQuickFirstName(e.target.value);
                            if (errors.quickFirstName) setErrors((prev) => ({ ...prev, quickFirstName: "" }));
                          }}
                          placeholder="Marko"
                          className="w-full h-9 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                          style={{ background: "var(--v2-surface)", borderColor: errors.quickFirstName ? "#ef4444" : "var(--v2-border)", color: "var(--v2-text)" }}
                        />
                      </FieldRow>
                      <FieldRow label="Prezime" error={errors.quickLastName}>
                        <input
                          type="text"
                          value={quickLastName}
                          onChange={(e) => {
                            setQuickLastName(e.target.value);
                            if (errors.quickLastName) setErrors((prev) => ({ ...prev, quickLastName: "" }));
                          }}
                          placeholder="Petrović"
                          className="w-full h-9 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                          style={{ background: "var(--v2-surface)", borderColor: errors.quickLastName ? "#ef4444" : "var(--v2-border)", color: "var(--v2-text)" }}
                        />
                      </FieldRow>
                    </div>
                    <FieldRow label="Telefon" error={errors.quickPhone}>
                      <input
                        type="tel"
                        value={quickPhone}
                        onChange={(e) => {
                          setQuickPhone(e.target.value);
                          if (errors.quickPhone) setErrors((prev) => ({ ...prev, quickPhone: "" }));
                        }}
                        placeholder="+381 60 123 4567"
                        className="w-full h-9 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                        style={{ background: "var(--v2-surface)", borderColor: errors.quickPhone ? "#ef4444" : "var(--v2-border)", color: "var(--v2-text)" }}
                      />
                    </FieldRow>
                    <button
                      onClick={handleQuickAdd}
                      className="h-9 px-4 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-90 self-end"
                      style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
                    >
                      Dodaj i izaberi
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ─── Section B: Appointment details ────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <SectionTitle>Detalji termina</SectionTitle>

            {/* Doctor */}
            <FieldRow label="Doktor" error={errors.doctor}>
              <select
                value={doctor}
                onChange={(e) => {
                  setDoctor(e.target.value);
                  if (errors.doctor) setErrors((prev) => ({ ...prev, doctor: "" }));
                }}
                className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)] appearance-none cursor-pointer"
                style={{ background: "var(--v2-input-bg)", borderColor: errors.doctor ? "#ef4444" : "var(--v2-border)", color: "var(--v2-text)" }}
              >
                {MOCK_DOCTORS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FieldRow>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Datum" error={errors.date}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
                  }}
                  className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                  style={{ background: "var(--v2-input-bg)", borderColor: errors.date ? "#ef4444" : "var(--v2-border)", color: "var(--v2-text)" }}
                />
              </FieldRow>
              <FieldRow label="Vreme" error={errors.time}>
                <input
                  type="time"
                  value={time}
                  step={900}
                  onChange={(e) => {
                    setTime(e.target.value);
                    if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                  }}
                  className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                  style={{ background: "var(--v2-input-bg)", borderColor: errors.time ? "#ef4444" : "var(--v2-border)", color: "var(--v2-text)" }}
                />
              </FieldRow>
            </div>

            {/* Duration */}
            <FieldRow label="Trajanje">
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((d) => {
                  const isActive = duration === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className="flex-1 h-9 rounded-lg text-[13px] font-medium transition-all border"
                      style={
                        isActive
                          ? { background: "var(--v2-primary)", color: "var(--v2-primary-fg)", borderColor: "var(--v2-primary)" }
                          : { background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", borderColor: "var(--v2-border)" }
                      }
                    >
                      {d} min
                    </button>
                  );
                })}
              </div>
            </FieldRow>

            {/* Chair */}
            <FieldRow label="Stolica">
              <div className="flex gap-2">
                {([1, 2, 3, 4] as const).map((c) => {
                  const isActive = chair === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setChair(c)}
                      className="flex-1 h-9 rounded-lg text-[13px] font-semibold transition-all border"
                      style={
                        isActive
                          ? { background: "var(--v2-primary)", color: "var(--v2-primary-fg)", borderColor: "var(--v2-primary)" }
                          : { background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", borderColor: "var(--v2-border)" }
                      }
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </FieldRow>
          </section>

          {/* ─── Section C: Ponavljajući termin (hidden in edit mode) ────────── */}
          {!isEditMode && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Ponavljanje</SectionTitle>

            {/* Toggle row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
                  Ponavljajući termin
                </p>
                <p className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                  Nedeljno, na izabrane dane
                </p>
              </div>
              <button
                onClick={() => setIsRecurring((v) => !v)}
                className="relative h-6 w-11 rounded-full transition-colors flex-shrink-0"
                style={{ background: isRecurring ? "var(--v2-primary)" : "var(--v2-border)" }}
                role="switch"
                aria-checked={isRecurring}
              >
                <span
                  className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
                  style={{ transform: isRecurring ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>

            {isRecurring && (
              <div className="flex flex-col gap-4 pl-0">
                {/* Weekday pills — multi-select (min 1) */}
                <FieldRow label="Dani u sedmici">
                  <div className="flex gap-1.5">
                    {WEEKDAY_LABELS_SHORT.map((label, idx) => {
                      const isActive = recurWeekdays.has(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setRecurWeekdays((prev) => {
                              const next = new Set(prev);
                              if (next.has(idx) && next.size > 1) {
                                next.delete(idx);
                              } else {
                                next.add(idx);
                              }
                              return next;
                            });
                          }}
                          className="flex-1 h-8 rounded-lg text-[11px] font-semibold transition-all border"
                          style={
                            isActive
                              ? { background: "var(--v2-primary)", color: "var(--v2-primary-fg)", borderColor: "var(--v2-primary)" }
                              : { background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", borderColor: "var(--v2-border)" }
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </FieldRow>

                {/* End condition */}
                <FieldRow label="Kraj serije">
                  <div className="flex flex-col gap-2">
                    {/* Radio: by count */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={recurEndMode === "count"}
                        onChange={() => setRecurEndMode("count")}
                        className="accent-[color:var(--v2-primary)]"
                      />
                      <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>Broj termina</span>
                      {recurEndMode === "count" && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => setRecurCount((n) => Math.max(1, n - 1))}
                            className="h-7 w-7 rounded-lg border text-[13px] font-bold flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
                            style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
                          >
                            −
                          </button>
                          <span className="text-[13px] font-semibold min-w-[28px] text-center" style={{ color: "var(--v2-text-heading)" }}>
                            {recurCount}
                          </span>
                          <button
                            onClick={() => setRecurCount((n) => Math.min(52, n + 1))}
                            className="h-7 w-7 rounded-lg border text-[13px] font-bold flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
                            style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </label>
                    {/* Count hint: computed end date */}
                    {recurEndMode === "count" && computedEndDate && (
                      <p className="text-[11px] ml-6" style={{ color: "var(--v2-text-muted)" }}>
                        Poslednji termin: {formatDateSr(computedEndDate)}
                      </p>
                    )}
                    {/* Radio: by date */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={recurEndMode === "date"}
                        onChange={() => setRecurEndMode("date")}
                        className="accent-[color:var(--v2-primary)]"
                      />
                      <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>Do datuma</span>
                      {recurEndMode === "date" && (
                        <input
                          type="date"
                          value={recurEndDate}
                          min={date}
                          onChange={(e) => {
                            setRecurEndDate(e.target.value);
                            if (errors.recurEndDate) setErrors((prev) => ({ ...prev, recurEndDate: "" }));
                          }}
                          className="ml-auto h-7 px-2 rounded-lg border text-[12px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                          style={{
                            background: "var(--v2-input-bg)",
                            borderColor: errors.recurEndDate ? "#ef4444" : "var(--v2-border)",
                            color: "var(--v2-text)",
                          }}
                        />
                      )}
                    </label>
                    {/* Date hint: computed occurrence count */}
                    {recurEndMode === "date" && computedCount > 0 && (
                      <p className="text-[11px] ml-6" style={{ color: "var(--v2-text-muted)" }}>
                        Ukupno termina: {computedCount}
                      </p>
                    )}
                    {errors.recurEndDate && (
                      <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        {errors.recurEndDate}
                      </p>
                    )}
                  </div>
                </FieldRow>

                {/* Live preview line */}
                {recurringPreviewLabel && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: "var(--v2-primary-bg)" }}
                  >
                    <Repeat className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--v2-primary-dark)" }} />
                    <p className="text-[12px] font-medium" style={{ color: "var(--v2-primary-dark)" }}>
                      {recurringPreviewLabel}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
          )}

          {/* ─── Section D: Notes ──────────────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <SectionTitle>Napomena</SectionTitle>
            <FieldRow label="Napomena" helper="(opciono)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dodajte napomenu za ovaj termin..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-colors resize-none focus:border-[color:var(--v2-primary)]"
                style={{
                  background: "var(--v2-input-bg)",
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-text)",
                  lineHeight: "1.5",
                }}
              />
            </FieldRow>
          </section>

          {/* Bottom spacer so content doesn't hide behind sticky footer */}
          <div className="h-2" />
        </div>

        {/* ── Sticky footer ───────────────────────────────────────────────── */}
        <div
          className="px-6 py-4 flex gap-3 flex-shrink-0 border-t border-[color:var(--v2-border)]"
          style={{ background: "var(--v2-surface)" }}
        >
          <button
            onClick={handleClose}
            className="flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border transition-colors hover:bg-[color:var(--v2-input-bg)]"
            style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 active:opacity-75 flex items-center justify-center gap-2"
            style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
          >
            {!isEditMode && isRecurring && <Repeat className="h-3.5 w-3.5" />}
            {isEditMode ? "Sačuvaj izmene" : isRecurring ? "Pregled termina" : "Zakaži termin"}
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateAppointmentDrawer;
