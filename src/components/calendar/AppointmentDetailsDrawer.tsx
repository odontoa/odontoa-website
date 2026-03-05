"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Stethoscope,
  Calendar,
  Clock,
  Timer,
  ArmchairIcon,
  FileText,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Repeat,
  Copy,
} from "lucide-react";
import type { Appointment, DayKey } from "@/lib/ui-lab/types";
import { useAppointments } from "@/lib/ui-lab/appointments-context";
import { WEEKDAY_EVERY_LABELS } from "@/lib/ui-lab/recurrence-utils";

// ─── Local helper ─────────────────────────────────────────────────────────────

const DAY_KEYS_BY_JS_DOW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
function dateToDayKey(iso: string): DayKey {
  return DAY_KEYS_BY_JS_DOW[new Date(iso + "T12:00:00").getDay()];
}

// ─── Cancel reasons ───────────────────────────────────────────────────────────

const CANCEL_REASONS = [
  "Pacijent otkazao",
  "Pacijent se nije pojavio",
  "Doktor nije dostupan",
  "Pomeren termin",
  "Hitna intervencija",
  "Ostalo",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function padTime(n: number): string {
  return String(n).padStart(2, "0");
}

function calcEndTime(startTime: string, durationMin: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const end = h * 60 + m + durationMin;
  return `${padTime(Math.floor(end / 60))}:${padTime(end % 60)}`;
}

function formatDateDisplay(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("sr-RS", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ZAKAZANO:        { label: "Zakazano",        color: "#3b82f6" },
  ZAVRSENO:        { label: "Završeno",         color: "#10b981" },
  OTKAZANO:        { label: "Otkazano",         color: "#6b7280" },
  NIJE_SE_POJAVIO: { label: "Nije se pojavio",  color: "#f59e0b" },
};

// ─── Copy appointment modal ───────────────────────────────────────────────────

function CopyModal({
  open,
  appointment,
  onClose,
  onConfirm,
}: {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (newAppt: Appointment) => void;
}) {
  const [copyDate, setCopyDate]       = useState(appointment?.dateISO ?? "");
  const [copyTime, setCopyTime]       = useState(appointment?.startTime ?? "");
  const [copyChair, setCopyChair]     = useState<1|2|3|4>(appointment?.chairId ?? 1);
  const [samePatient, setSamePatient] = useState(true);
  const [newPatientName, setNewPatientName] = useState("");
  const [errors, setErrors]           = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && appointment) {
      setCopyDate(appointment.dateISO);
      setCopyTime(appointment.startTime);
      setCopyChair(appointment.chairId);
      setSamePatient(true);
      setNewPatientName("");
      setErrors({});
    }
  }, [open, appointment]);

  const handleConfirm = () => {
    const errs: Record<string, string> = {};
    if (!copyDate) errs.date = "Datum je obavezan";
    if (!copyTime) errs.time = "Vreme je obavezno";
    if (!samePatient && !newPatientName.trim()) errs.patient = "Ime pacijenta je obavezno";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const newAppt: Appointment = {
      id: `apt-copy-${Date.now()}`,
      patientName: samePatient ? appointment!.patientName : newPatientName.trim(),
      procedureLabel: appointment!.procedureLabel,
      doctorName: appointment!.doctorName,
      startTime: copyTime,
      dateISO: copyDate,
      dayKey: dateToDayKey(copyDate),
      chairId: copyChair,
      status: "ZAKAZANO",
      durationMin: appointment!.durationMin,
      notes: appointment!.notes,
      // no seriesId — standalone copy
    };
    onConfirm(newAppt);
  };

  if (!open || !appointment) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
        style={{
          width: "min(440px, calc(100vw - 32px))",
          background: "var(--v2-surface)",
          border: "1px solid var(--v2-border)",
          borderRadius: "var(--v2-radius-card)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Kopiranje termina"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[color:var(--v2-border)]">
          <div className="flex items-start gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--v2-primary-bg)" }}
            >
              <Copy className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] leading-tight" style={{ color: "var(--v2-text-heading)" }}>
                Kopiraj termin
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
                {appointment.patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)] flex-shrink-0 ml-2"
            aria-label="Zatvori"
          >
            <X className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
                Datum
              </label>
              <input
                type="date"
                value={copyDate}
                onChange={(e) => { setCopyDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }}
                className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                style={{ background: "var(--v2-input-bg)", borderColor: errors.date ? "var(--v2-status-cancelled-fg)" : "var(--v2-border)", color: "var(--v2-text)", colorScheme: "light" }}
              />
              {/* Quick date buttons */}
              <div className="flex gap-1 mt-0.5">
                {[
                  { label: "Danas", offset: 0 },
                  { label: "Sutra", offset: 1 },
                  { label: "+1 ned", offset: 7 },
                ].map(({ label, offset }) => {
                  const d = new Date();
                  d.setDate(d.getDate() + offset);
                  const val = d.toISOString().slice(0, 10);
                  const isActive = copyDate === val;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { setCopyDate(val); setErrors((p) => ({ ...p, date: "" })); }}
                      className="flex-1 h-6 rounded text-[10px] font-semibold transition-colors border"
                      style={{
                        background: isActive ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
                        color: isActive ? "var(--v2-primary-dark)" : "var(--v2-text-muted)",
                        borderColor: isActive ? "color-mix(in srgb, var(--v2-primary) 30%, transparent)" : "var(--v2-border)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {copyDate && (
                <p className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>
                  {formatDateDisplay(copyDate)}
                </p>
              )}
              {errors.date && <p className="text-[11px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{errors.date}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
                Vreme
              </label>
              <input
                type="time"
                value={copyTime}
                step={900}
                onChange={(e) => { setCopyTime(e.target.value); setErrors((p) => ({ ...p, time: "" })); }}
                className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                style={{ background: "var(--v2-input-bg)", borderColor: errors.time ? "var(--v2-status-cancelled-fg)" : "var(--v2-border)", color: "var(--v2-text)", colorScheme: "light" }}
              />
              {/* Common time presets */}
              <div className="flex gap-1 mt-0.5 flex-wrap">
                {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"].map((t) => {
                  const isActive = copyTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setCopyTime(t); setErrors((p) => ({ ...p, time: "" })); }}
                      className="h-6 px-1.5 rounded text-[10px] font-semibold transition-colors border"
                      style={{
                        background: isActive ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
                        color: isActive ? "var(--v2-primary-dark)" : "var(--v2-text-muted)",
                        borderColor: isActive ? "color-mix(in srgb, var(--v2-primary) 30%, transparent)" : "var(--v2-border)",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              {errors.time && <p className="text-[11px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{errors.time}</p>}
            </div>
          </div>

          {/* Chair */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>Stolica</label>
            <div className="flex gap-2">
              {([1, 2, 3, 4] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCopyChair(c)}
                  className="flex-1 h-9 rounded-lg text-[13px] font-semibold transition-all border"
                  style={
                    copyChair === c
                      ? { background: "var(--v2-primary)", color: "var(--v2-primary-fg)", borderColor: "var(--v2-primary)" }
                      : { background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", borderColor: "var(--v2-border)" }
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Isti pacijent toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={samePatient}
              onChange={(e) => { setSamePatient(e.target.checked); setErrors((p) => ({ ...p, patient: "" })); }}
              className="accent-[color:var(--v2-primary)] w-4 h-4 rounded"
            />
            <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>
              Isti pacijent ({appointment.patientName})
            </span>
          </label>
          {!samePatient && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
                Ime pacijenta
              </label>
              <input
                type="text"
                value={newPatientName}
                onChange={(e) => { setNewPatientName(e.target.value); setErrors((p) => ({ ...p, patient: "" })); }}
                placeholder="Ime i prezime..."
                className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)]"
                style={{ background: "var(--v2-input-bg)", borderColor: errors.patient ? "var(--v2-status-cancelled-fg)" : "var(--v2-border)", color: "var(--v2-text)" }}
              />
              {errors.patient && <p className="text-[11px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{errors.patient}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border transition-colors hover:bg-[color:var(--v2-input-bg)]"
            style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
          >
            Odustani
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[1.5] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 active:opacity-75 flex items-center justify-center gap-2"
            style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
          >
            <Copy className="h-3.5 w-3.5" />
            Kopiraj termin
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Cancel scope modal ───────────────────────────────────────────────────────

type CancelScope = "single" | "future" | "all";

function CancelModal({
  open,
  patientName,
  isSeries,
  onClose,
  onConfirm,
}: {
  open: boolean;
  patientName: string;
  isSeries: boolean;
  onClose: () => void;
  onConfirm: (scope: CancelScope, reason: string, note: string) => void;
}) {
  const [scope, setScope]   = useState<CancelScope>("single");
  const [reason, setReason] = useState("");
  const [note, setNote]     = useState("");
  const [error, setError]   = useState("");

  useEffect(() => {
    if (open) { setScope("single"); setReason(""); setNote(""); setError(""); }
  }, [open]);

  const handleSubmit = () => {
    if (!reason) { setError("Izaberite razlog otkazivanja"); return; }
    onConfirm(scope, reason, note);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
        style={{
          width: "min(440px, calc(100vw - 32px))",
          background: "var(--v2-surface)",
          border: "1px solid var(--v2-border)",
          borderRadius: "var(--v2-radius-card)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Otkazivanje termina"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[color:var(--v2-border)]">
          <div className="flex items-start gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(239,68,68,0.1)" }}
            >
              <Ban className="h-5 w-5" style={{ color: "#ef4444" }} />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] leading-tight" style={{ color: "var(--v2-text-heading)" }}>
                Otkazivanje termina
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
                {patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)] flex-shrink-0 ml-2"
            aria-label="Zatvori"
          >
            <X className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Scope selector — only for series appointments */}
          {isSeries && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
                Šta otkazati?
              </p>
              <div className="flex flex-col gap-1 rounded-xl border overflow-hidden" style={{ borderColor: "var(--v2-border)" }}>
                {(
                  [
                    { value: "single", label: "Samo ovaj termin" },
                    { value: "future", label: "Ovaj i sve buduće termine" },
                    { value: "all",    label: "Celu seriju" },
                  ] as { value: CancelScope; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setScope(opt.value)}
                    className="flex items-center gap-3 px-4 py-3 border-b border-[color:var(--v2-border)] last:border-b-0 text-left transition-colors hover:bg-[color:var(--v2-input-bg)]"
                    style={{ background: scope === opt.value ? "var(--v2-input-bg)" : "transparent" }}
                  >
                    <div
                      className="h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: scope === opt.value ? "var(--v2-primary)" : "var(--v2-border)",
                        background: scope === opt.value ? "var(--v2-primary)" : "transparent",
                      }}
                    >
                      {scope === opt.value && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-[13px]" style={{ color: "var(--v2-text-heading)" }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reason select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
              Razlog otkazivanja
              <span style={{ color: "#ef4444" }}> *</span>
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              className="w-full h-10 px-3 rounded-lg border text-[13px] outline-none transition-colors focus:border-[color:var(--v2-primary)] appearance-none cursor-pointer"
              style={{
                background: "var(--v2-input-bg)",
                borderColor: error ? "#ef4444" : "var(--v2-border)",
                color: reason ? "var(--v2-text)" : "var(--v2-text-muted)",
              }}
            >
              <option value="" disabled>Izaberite razlog...</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {error && (
              <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Note textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
              Dodatna napomena
              <span className="ml-1.5 text-[11px] font-normal" style={{ color: "var(--v2-text-muted)" }}>(opciono)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Napišite dodatne detalje o razlogu otkazivanja..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-colors resize-none focus:border-[color:var(--v2-primary)]"
              style={{
                background: "var(--v2-input-bg)",
                borderColor: "var(--v2-border)",
                color: "var(--v2-text)",
                lineHeight: "1.5",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border transition-colors hover:bg-[color:var(--v2-input-bg)]"
            style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
          >
            Odustani
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[1.5] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 active:opacity-75"
            style={{ background: "#ef4444", color: "#ffffff" }}
          >
            Potvrdi otkazivanje
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppointmentDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onCancel: (id: string, payload: { reason: string; note?: string }) => void;
  onComplete?: (id: string) => void;
  onEdit?: (appt: Appointment) => void;
}

// ─── Main drawer component ────────────────────────────────────────────────────

export function AppointmentDetailsDrawer({
  open,
  onOpenChange,
  appointment,
  onCancel,
  onComplete,
  onEdit,
}: AppointmentDetailsDrawerProps) {
  const { series, cancelSeriesFuture, cancelSeriesAll, addAppointment } = useAppointments();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen]     = useState(false);

  useEffect(() => {
    if (!open) { setCancelModalOpen(false); setCopyModalOpen(false); }
  }, [open]);

  const handleClose = () => onOpenChange(false);

  const handleCancelConfirm = (scope: CancelScope, reason: string, note: string) => {
    if (!appointment) return;
    setCancelModalOpen(false);
    const payload = { reason, note: note.trim() || undefined };

    if (scope === "single" || !appointment.seriesId) {
      onCancel(appointment.id, payload);
    } else if (scope === "future") {
      cancelSeriesFuture(appointment.seriesId, appointment.dateISO, payload);
      onOpenChange(false);
    } else {
      cancelSeriesAll(appointment.seriesId, payload);
      onOpenChange(false);
    }
  };

  const appt = appointment;
  const isCanceled = appt?.status === "OTKAZANO";
  const statusInfo = appt ? (STATUS_LABELS[appt.status] ?? { label: appt.status, color: "#6b7280" }) : null;

  // Series context
  const seriesData = appt?.seriesId ? series.find((s) => s.id === appt.seriesId) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.2)",
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
          width: "min(400px, 100vw)",
          background: "var(--v2-surface)",
          borderLeft: "1px solid var(--v2-border)",
          borderRadius: "var(--v2-radius-card) 0 0 var(--v2-radius-card)",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Podešavanja termina"
      >
        {/* ── Sticky header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--v2-border)] flex-shrink-0">
          <div>
            <h2 className="font-semibold leading-tight" style={{ fontSize: 16, color: "var(--v2-text-heading)" }}>
              Podešavanja termina
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
              {appt ? appt.patientName : "—"}
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

        {/* ── Scrollable body ────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {appt ? (
            <>
              {/* Series badge */}
              {seriesData && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "var(--v2-primary-bg)" }}
                >
                  <Repeat className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--v2-primary-dark)" }} />
                  <p className="text-[12px] font-medium flex-1" style={{ color: "var(--v2-primary-dark)" }}>
                    Termin iz serije ·{" "}
                    {[...seriesData.weekdays].sort((a, b) => a - b).map((i) => WEEKDAY_EVERY_LABELS[i]).join(" i ")}
                  </p>
                </div>
              )}

              {/* Cancelled banner */}
              {isCanceled && (
                <div
                  className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                  style={{
                    background: "rgba(239,68,68,0.06)",
                    borderColor: "rgba(239,68,68,0.2)",
                  }}
                >
                  <Ban className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: "#ef4444" }}>
                      Termin je otkazan
                    </p>
                    {appt.cancelReason && (
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--v2-text-muted)" }}>
                        Razlog: {appt.cancelReason}
                      </p>
                    )}
                    {appt.cancelNote && (
                      <p className="text-[12px] mt-0.5 italic" style={{ color: "var(--v2-text-muted)" }}>
                        {appt.cancelNote}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Detalji termina */}
              <section className="flex flex-col gap-1">
                <p className="text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-[color:var(--v2-border)]"
                  style={{ color: "var(--v2-text-muted)" }}>
                  Detalji termina
                </p>
                <div
                  className="mt-3 rounded-xl border divide-y divide-[color:var(--v2-border)] overflow-hidden"
                  style={{ borderColor: "var(--v2-border)" }}
                >
                  {/* Pacijent */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <User className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Pacijent</p>
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--v2-text-heading)" }}>{appt.patientName}</p>
                    </div>
                  </div>

                  {/* Doktor */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <Stethoscope className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Doktor</p>
                      <p className="text-[13px] font-medium truncate" style={{ color: "var(--v2-text-heading)" }}>
                        {appt.doctorName ?? "Dr. Marko Marković"}
                      </p>
                    </div>
                  </div>

                  {/* Datum */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <Calendar className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Datum</p>
                      <p className="text-[13px] font-medium" style={{ color: "var(--v2-text-heading)" }}>
                        {formatDateDisplay(appt.dateISO)}
                      </p>
                    </div>
                  </div>

                  {/* Vreme od → do */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <Clock className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Vreme</p>
                      <p className="text-[13px] font-medium" style={{ color: "var(--v2-text-heading)" }}>
                        {appt.startTime} → {calcEndTime(appt.startTime, appt.durationMin)}
                      </p>
                    </div>
                  </div>

                  {/* Trajanje */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <Timer className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Trajanje</p>
                      <p className="text-[13px] font-medium" style={{ color: "var(--v2-text-heading)" }}>
                        {appt.durationMin} minuta
                      </p>
                    </div>
                  </div>

                  {/* Stolica */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <ArmchairIcon className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Stolica</p>
                      <p className="text-[13px] font-medium" style={{ color: "var(--v2-text-heading)" }}>
                        Stolica {appt.chairId}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)" }}>
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: statusInfo?.color ?? "#6b7280" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>Status</p>
                      <span
                        className="inline-block text-[12px] font-semibold px-2.5 py-0.5 rounded-full mt-0.5"
                        style={{ background: `${statusInfo?.color}18`, color: statusInfo?.color ?? "#6b7280" }}
                      >
                        {statusInfo?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Napomena */}
              <section className="flex flex-col gap-1">
                <p className="text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-[color:var(--v2-border)]"
                  style={{ color: "var(--v2-text-muted)" }}>
                  Napomena
                </p>
                <div className="mt-2 flex items-start gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--v2-text-muted)" }} />
                  {appt.notes ? (
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--v2-text)" }}>
                      {appt.notes}
                    </p>
                  ) : (
                    <p className="text-[13px] italic" style={{ color: "var(--v2-text-muted)" }}>
                      Nema napomene
                    </p>
                  )}
                </div>
              </section>
            </>
          ) : (
            <p className="text-[13px] text-center py-10" style={{ color: "var(--v2-text-muted)" }}>
              Nema izabranog termina
            </p>
          )}

          <div className="h-2" />
        </div>

        {/* ── Sticky footer ─────────────────────────────────────────────────── */}
        <div
          className="px-6 py-4 flex flex-col gap-2 border-t border-[color:var(--v2-border)] flex-shrink-0"
          style={{ background: "var(--v2-surface)" }}
        >
          {/* "Završi termin" — primary action, only for ZAKAZANO */}
          {appt?.status === "ZAKAZANO" && onComplete && (
            <button
              onClick={() => { onComplete(appt.id); handleClose(); }}
              className="w-full h-11 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 active:opacity-80 flex items-center justify-center gap-2"
              style={{ background: "#10b981", color: "#ffffff" }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Završi termin
            </button>
          )}

          {/* Kopiraj termin — available for all non-cancelled appointments */}
          {appt && appt.status !== "OTKAZANO" && (
            <button
              onClick={() => setCopyModalOpen(true)}
              className="w-full h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border transition-colors hover:bg-[color:var(--v2-input-bg)] flex items-center justify-center gap-2"
              style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
            >
              <Copy className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
              Kopiraj termin
            </button>
          )}

          <div className="flex gap-3">
            {/* Edit — enabled for ZAKAZANO when onEdit provided */}
            <button
              disabled={!onEdit || appt?.status !== "ZAKAZANO"}
              title={appt?.status !== "ZAKAZANO" ? "Izmena nije dostupna za ovaj status" : undefined}
              onClick={() => {
                if (onEdit && appt) {
                  onEdit(appt);
                  handleClose();
                }
              }}
              className={`flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border transition-colors ${
                onEdit && appt?.status === "ZAKAZANO"
                  ? "hover:bg-[color:var(--v2-input-bg)] cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
              }`}
              style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
            >
              Izmeni
            </button>

            {/* Cancel button */}
            {appt?.status === "ZAKAZANO" ? (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="flex-[1.5] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 active:opacity-75"
                style={{ background: "#ef4444", color: "#ffffff" }}
              >
                Otkaži termin
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="flex-[1.5] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium transition-colors hover:bg-[color:var(--v2-input-bg)] border"
                style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
              >
                Zatvori
              </button>
            )}
          </div>
        </div>
      </div>

      <CancelModal
        open={cancelModalOpen}
        patientName={appt?.patientName ?? ""}
        isSeries={!!appt?.seriesId}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
      />

      <CopyModal
        open={copyModalOpen}
        appointment={appt}
        onClose={() => setCopyModalOpen(false)}
        onConfirm={(newAppt) => {
          addAppointment(newAppt);
          setCopyModalOpen(false);
        }}
      />
    </>
  );
}

export default AppointmentDetailsDrawer;
