// Figma: Moodify Patient Details — Tablet (node-id=329-12171, frame 800×1754)
// Tablet sidebar: 80px icon-only. Body: 696px. Content: 656px (20px padding each side).
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, MessageCircle, Pencil, MoreHorizontal, Plus, Trash2, FileText } from "lucide-react";
import { DokumentiDrawer } from "./DokumentiDrawer";
import { FigmaTabletSidebar } from "@/ui-lab/screens/figma-dashboard/sidebars";
import { DropdownPill } from "@/ui-lab/screens/figma-dashboard/shared";
import type { PatientForDetails } from "./mock";
import {
  getUpcomingForPatient,
  getTreatmentsForPatient,
  getMedicalConditionsForPatient,
  MEDICAL_CONDITIONS,
  MOCK_HEALTH_REPORTS,
  MOCK_MEDICATIONS,
  MOCK_NOTES,
  getVisitsForPeriod,
} from "./mock";
import { VisitsPeriodDropdown } from "./VisitsPeriodDropdown";
import { ConfirmDialog } from "./ConfirmDialog";

// ─── Shared primitives ─────────────────────────────────────

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "var(--v2-surface)",
        borderRadius: "var(--v2-radius-card)",
        padding: "16px",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-[12px]">
      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--v2-text-heading)", lineHeight: "1.3" }}>
        {title}
      </span>
      {right ?? (
        <button
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: "30px", height: "30px", borderRadius: "5px", background: "var(--v2-bg)", border: "none", cursor: "pointer" }}
        >
          <MoreHorizontal style={{ width: "14px", height: "14px", color: "var(--v2-text-muted)" }} />
        </button>
      )}
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────

function TabletTopbar({ patientName }: { patientName: string }) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{ height: "var(--v2-topbar-h)", padding: "0 8px 0 4px" }}
    >
      <div className="flex items-center gap-[14px] min-w-0">
        <Link
          href="/ui-lab/pacijenti"
          className="flex items-center gap-[5px] flex-shrink-0 transition-opacity hover:opacity-70"
          style={{ color: "var(--v2-text-muted)", fontSize: "12px" }}
        >
          <ArrowLeft style={{ width: "12px", height: "12px" }} />
          Nazad
        </Link>
        <div className="flex flex-col gap-[2px] min-w-0">
          <h1 className="font-semibold leading-[1.1] truncate" style={{ fontSize: "16px", color: "var(--v2-text)" }}>
            Pregled pacijenta
          </h1>
          <p className="truncate" style={{ fontSize: "11px", color: "var(--v2-text-muted)", lineHeight: "1.2" }}>
            {patientName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-[8px] flex-shrink-0">
        <button className="flex items-center justify-center" style={{ width: "36px", height: "36px", borderRadius: "28px", background: "var(--v2-primary-bg)", border: "none", cursor: "pointer" }}>
          <Bell style={{ width: "18px", height: "18px", color: "var(--v2-primary-dark)" }} />
        </button>
        <div className="flex items-center justify-center font-semibold" style={{ width: "36px", height: "36px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)", fontSize: "11px" }}>
          MM
        </div>
      </div>
    </header>
  );
}

function formatDateOfBirth(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// ─── General Info (656×142) ───────────────────────────────

function CardGeneralInfo({ patient, onEdit, onDelete }: { patient: PatientForDetails; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Card>
      <div className="flex gap-[20px]" style={{ minHeight: "110px" }}>
        {/* Avatar 110×110, r=16 */}
        <div
          className="flex items-center justify-center font-bold flex-shrink-0"
          style={{ width: "110px", height: "110px", borderRadius: "16px", background: "var(--v2-primary)", color: "var(--v2-primary-fg)", fontSize: "28px" }}
        >
          {patient.initials}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 0 }}>
          <div className="flex items-start justify-between gap-[8px]">
            <div className="flex flex-col gap-[4px] min-w-0">
              <span className="font-semibold truncate" style={{ fontSize: "22px", color: "var(--v2-text)", lineHeight: "1.2" }}>
                {patient.fullName}
              </span>
              <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
                {patient.patientCode ?? `MDF-P${String(patient.id).padStart(3, "0")}`}
              </span>
            </div>
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <button
                className="flex items-center justify-center"
                style={{ width: "36px", height: "36px", borderRadius: "20px", background: "var(--v2-primary-bg)", border: "none", cursor: "pointer" }}
              >
                <MessageCircle style={{ width: "16px", height: "16px", color: "var(--v2-primary-dark)" }} />
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center justify-center"
                  style={{ width: "36px", height: "36px", borderRadius: "20px", background: "var(--v2-status-cancelled-bg)", border: "none", cursor: "pointer" }}
                  title="Obriši pacijenta"
                >
                  <Trash2 style={{ width: "16px", height: "16px", color: "var(--v2-status-cancelled-fg)" }} />
                </button>
              )}
              <button
                onClick={onEdit}
                className="flex items-center gap-[6px]"
                style={{ height: "36px", padding: "0 14px", borderRadius: "20px", background: "var(--v2-primary)", border: "none", cursor: "pointer", color: "var(--v2-primary-fg)", fontSize: "12px", fontWeight: 500 }}
              >
                <Pencil style={{ width: "12px", height: "12px" }} />
                Izmeni
              </button>
            </div>
          </div>
          <div style={{ height: "1px", background: "var(--v2-border)", margin: "12px 0" }} />
          <div className="flex gap-[24px]">
            {[
              { label: "Datum rođenja", value: formatDateOfBirth(patient.dateOfBirth) },
              { label: "Email adresa", value: patient.email },
              { label: "Kontakt", value: patient.contactPhone },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-[2px] min-w-0">
                <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{label}</span>
                <span className="truncate" style={{ fontSize: "12px", color: "var(--v2-text)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Aktivni dolasci (656×260) ───────────────────────────────

function CardWellbeing() {
  const [period, setPeriod] = useState<"1" | "6" | "12" | "all">("6");
  const chartData = getVisitsForPeriod(period);
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const [hovered, setHovered] = useState<string | null>(null);
  const midTick = Math.ceil(maxCount / 2);

  return (
    <Card style={{ display: "flex", flexDirection: "column", minHeight: "260px" }}>
      <div className="flex items-center justify-between mb-[12px]">
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--v2-text-heading)" }}>
          Aktivni dolasci pacijenta
        </span>
        <VisitsPeriodDropdown value={period} onChange={setPeriod} size="sm" />
      </div>

      <div className="flex-1 flex flex-col gap-0">
        {/* Plot area — relative, baseline border at bottom */}
        <div className="flex-1 relative" style={{ borderBottom: "1px solid var(--v2-border)" }}>

          {/* Y-axis tick labels: maxCount, mid, 0 */}
          {[
            { tick: maxCount, bottom: `calc(100% - 5px)` },
            { tick: midTick,  bottom: `calc(${(midTick / maxCount) * 100}% - 5px)` },
            { tick: 0,        bottom: "-5px" },
          ].map(({ tick, bottom }) => (
            <span
              key={tick}
              style={{
                position: "absolute",
                left: 0,
                bottom,
                width: "26px",
                textAlign: "right",
                fontSize: "9px",
                color: "var(--v2-text-muted)",
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {tick}
            </span>
          ))}

          {/* Grid lines at 25%, 50%, 75% */}
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              style={{
                position: "absolute",
                left: "32px", right: 0,
                bottom: `${pct}%`, height: "1px",
                background: "var(--v2-border)",
              }}
            />
          ))}

          {/* Bars */}
          <div
            style={{
              position: "absolute",
              left: "32px", right: 0, top: 0, bottom: 0,
              display: "flex", gap: "6px", alignItems: "flex-end",
            }}
          >
            {chartData.map((d) => {
              const heightPct = (d.count / maxCount) * 100;
              const isHovered = hovered === d.month;
              return (
                <div
                  key={d.month}
                  style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}
                  onMouseEnter={() => setHovered(d.month)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {isHovered && (
                    <div
                      className="absolute z-10 whitespace-nowrap"
                      style={{
                        bottom: `calc(${heightPct}% + 8px)`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--v2-text-heading)",
                        color: "var(--v2-surface)",
                        fontSize: "11px",
                        fontWeight: 500,
                        borderRadius: "4px",
                        padding: "3px 8px",
                      }}
                    >
                      {d.count} {d.count === 1 ? "put" : "puta"} u {d.month}
                    </div>
                  )}
                  <div
                    style={{
                      width: "100%",
                      height: `${heightPct}%`,
                      background: isHovered ? "var(--v2-primary-dark)" : "var(--v2-primary)",
                      borderRadius: "6px 6px 0 0",
                      minHeight: "4px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis: month labels aligned with bars */}
        <div className="flex mt-[6px]" style={{ paddingLeft: "32px" }}>
          {chartData.map((d) => (
            <div key={d.month} style={{ flex: 1, textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--v2-text-muted)", lineHeight: 1 }}>
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Naredni termini (318×422) ────────────────────────────

function CardUpcoming({ patient, style }: { patient: PatientForDetails; style?: React.CSSProperties }) {
  const upcoming = getUpcomingForPatient(patient.id);
  return (
    <Card style={{ display: "flex", flexDirection: "column", ...style }}>
      <CardHeader title="Naredni termini" right={<DropdownPill size="sm">Ove nedelje</DropdownPill>} />
      <div className="flex flex-col gap-[8px] flex-1 overflow-y-auto">
        {upcoming.map((apt, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px]"
            style={{ background: "var(--v2-bg)", borderRadius: "16px", padding: "12px 14px" }}
          >
            <span style={{ display: "inline-flex", alignSelf: "flex-start", fontSize: "11px", color: "var(--v2-text)", background: "var(--v2-primary-bg)", borderRadius: "4px", padding: "2px 6px" }}>
              {apt.type}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-primary-dark)", lineHeight: "1.3" }}>
              {apt.session}
            </span>
            <div className="flex items-center gap-[8px]">
              <span style={{ fontSize: "11px", color: "var(--v2-text)" }}>{apt.doctor}</span>
              <span style={{ width: "1px", height: "10px", background: "var(--v2-border)", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{apt.datetime}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Istorija tretmana (318×422) ──────────────────────────

function TreatmentStatusBadge({ status }: { status: "completed" | "retreatment" }) {
  const isCompleted = status === "completed";
  return (
    <span style={{ fontSize: "11px", borderRadius: "6px", padding: "4px 8px", flexShrink: 0, background: isCompleted ? "var(--v2-primary-dark)" : "var(--v2-primary)", color: isCompleted ? "var(--v2-primary-bg)" : "var(--v2-primary-fg)", whiteSpace: "nowrap" }}>
      {isCompleted ? "Završeno" : "Ponovni tretman"}
    </span>
  );
}

function CardTreatmentHistory({ patient, style }: { patient: PatientForDetails; style?: React.CSSProperties }) {
  const treatments = getTreatmentsForPatient(patient.id);
  return (
    <Card style={{ display: "flex", flexDirection: "column", ...style }}>
      <CardHeader title="Istorija tretmana" />
      <div className="flex flex-col flex-1 overflow-y-auto">
        {treatments.map((tr, i) => (
          <div key={i}>
            <div className="flex items-center gap-[8px] py-[10px]">
              <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-text)", lineHeight: "1.3" }}>{tr.title}</span>
                <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>{tr.date}</span>
              </div>
              <TreatmentStatusBadge status={tr.status} />
            </div>
            {i < treatments.length - 1 && <div style={{ height: "1px", background: "var(--v2-border)" }} />}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Medicinsko stanje (318×230) ───────────────────────────────

function CardMedicalCondition({ patient, style }: { patient: PatientForDetails; style?: React.CSSProperties }) {
  const [conditions, setConditions] = useState<string[]>(() => getMedicalConditionsForPatient(patient.id));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const available = MEDICAL_CONDITIONS.filter((c) => !conditions.includes(c));

  return (
    <Card style={{ display: "flex", flexDirection: "column", ...style }}>
      <CardHeader
        title="Medicinsko stanje"
        right={
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-[4px]"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--v2-primary-dark)",
                background: "var(--v2-primary-bg)",
                border: "none",
                borderRadius: "var(--v2-radius-badge)",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              <Plus style={{ width: "12px", height: "12px" }} />
              Dodaj
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 z-20 py-1 max-h-[200px] overflow-y-auto rounded-lg"
                style={{
                  background: "var(--v2-surface)",
                  border: "1px solid var(--v2-border)",
                  minWidth: "220px",
                }}
              >
                {available.length === 0 ? (
                  <div className="px-3 py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
                    Sva stanja su dodata
                  </div>
                ) : (
                  available.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setConditions((prev) => [...prev, c]);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] transition-colors hover:bg-[var(--v2-primary-bg)]"
                      style={{ color: "var(--v2-text)" }}
                    >
                      {c}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        }
      />
      <div className="flex flex-col gap-[8px] flex-1 overflow-y-auto">
        {conditions.length === 0 ? (
          <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Nema unetih stanja</span>
        ) : (
          conditions.map((c, i) => (
            <div
              key={c}
              className="flex items-center justify-between gap-[8px]"
              style={{
                padding: "8px 12px",
                background: "var(--v2-bg)",
                borderRadius: "8px",
                border: "1px solid var(--v2-border)",
              }}
            >
              <span className="flex-1 min-w-0 truncate" style={{ fontSize: "12px", color: "var(--v2-text)" }}>
                {c}
              </span>
              <button
                type="button"
                onClick={() => setDeleteIndex(i)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trash2 style={{ width: "12px", height: "12px", color: "var(--v2-text-muted)" }} />
              </button>
            </div>
          ))
        )}
      </div>
      <ConfirmDialog
        open={deleteIndex !== null}
        title="Brisanje medicinskog stanja"
        message="Da li ste sigurni da želite da obrišete ovo medicinsko stanje?"
        confirmLabel="Obriši"
        cancelLabel="Otkaži"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteIndex !== null) {
            setConditions((prev) => prev.filter((_, j) => j !== deleteIndex));
            setDeleteIndex(null);
          }
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </Card>
  );
}

// ─── Zdravstveni izveštaji (318×230) ─────────────────────

function CardHealthReport({ style }: { style?: React.CSSProperties }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", ...style }}>
      <CardHeader
        title="Zdravstveni izveštaji"
        right={
          <button className="flex items-center justify-center" style={{ width: "30px", height: "30px", borderRadius: "15px", background: "var(--v2-primary)", border: "none", cursor: "pointer" }}>
            <Plus style={{ width: "14px", height: "14px", color: "var(--v2-primary-fg)" }} />
          </button>
        }
      />
      <div className="flex flex-col gap-[10px] flex-1">
        {MOCK_HEALTH_REPORTS.map((rep, i) => (
          <div key={i} className="flex items-center gap-[10px]">
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: "34px", height: "34px", borderRadius: "6px", background: "var(--v2-primary-dark)" }}>
              <FileText style={{ width: "18px", height: "18px", color: "var(--v2-primary-bg)" }} />
            </div>
            <span className="flex-1 min-w-0" style={{ fontSize: "12px", color: "var(--v2-text)", lineHeight: "1.4" }}>{rep.title}</span>
            <button className="flex items-center justify-center flex-shrink-0" style={{ width: "26px", height: "26px", borderRadius: "5px", background: "var(--v2-bg)", border: "none", cursor: "pointer" }}>
              <Trash2 style={{ width: "14px", height: "14px", color: "var(--v2-text-muted)" }} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Istorija lekova (403×242) ────────────────────────────

function CardMedicineHistory({ style }: { style?: React.CSSProperties }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", ...style }}>
      <CardHeader title="Istorija lekova" right={<DropdownPill size="sm">Aktivni</DropdownPill>} />
      <div className="flex flex-col gap-[8px] flex-1 overflow-y-auto">
        {MOCK_MEDICATIONS.map((med, i) => (
          <div key={i} className="flex flex-col gap-[4px]" style={{ background: "var(--v2-bg)", borderRadius: "16px", padding: "8px 14px" }}>
            <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{med.date}</span>
            <div className="flex items-center justify-between gap-[8px]">
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--v2-text)" }}>{med.name}</span>
              {med.status === "stop" ? (
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--v2-status-cancelled-fg)" }}>Stop</span>
              ) : (
                <span style={{ fontSize: "11px", color: "var(--v2-primary-dark)" }}>Aktivno</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Beleške pacijenta (656×170) ─────────────────────────
// 3 note cards visible, gap 16px

function CardNotes() {
  return (
    <div>
      <CardHeader title="Beleške pacijenta" />
      <div className="grid gap-[16px]" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {MOCK_NOTES.slice(0, 3).map((note, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px]"
            style={{ background: "var(--v2-surface)", borderRadius: "16px", padding: "12px 14px", border: "1px solid var(--v2-border)", minHeight: "96px" }}
          >
            <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{note.date}</span>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--v2-primary-dark)", lineHeight: "1.3" }}>{note.title}</span>
            <p className="line-clamp-3" style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.4", margin: 0 }}>{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────

export default function TabletPatientDetails({
  patient,
  className,
  onEdit,
  onDelete,
}: { patient: PatientForDetails; className?: string; onEdit?: () => void; onDelete?: () => void }) {
  const [dokumentiOpen, setDokumentiOpen] = useState(false);

  return (
    <div
      className={`flex h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaTabletSidebar />

      {/* Main column */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <TabletTopbar patientName={patient.fullName} />

        {/* Body — gray rounded panel, single column */}
        <main
          className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >
          {/* Tab bar — future: Karton / Slike / X-ray / … */}
          <div className="flex items-center gap-[8px] flex-shrink-0">
            <button
              onClick={() => setDokumentiOpen(true)}
              className="flex items-center gap-[6px] px-[14px] py-[6px] text-[13px] font-semibold rounded-full hover:opacity-80 transition-opacity"
              style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)", border: "none", cursor: "pointer" }}
            >
              <FileText size={14} /> Dokumenti
            </button>
          </div>

          {/* Row 1: General Info — 656×142 */}
          <CardGeneralInfo patient={patient} onEdit={onEdit} onDelete={onDelete} />

          {/* Row 2: Well-Being Progress — 656×260 */}
          <CardWellbeing />

          {/* Row 3: Upcoming + Treatment History — 2 cols, 318×422 each */}
          <div className="grid gap-[20px]" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <CardUpcoming patient={patient} style={{ minHeight: "422px" }} />
            <CardTreatmentHistory patient={patient} style={{ minHeight: "422px" }} />
          </div>

          {/* Row 4: Medicinsko stanje + Health Report + Medicine History — 3 cols (kao u redu iznad) */}
          <div className="grid gap-[20px]" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <CardMedicalCondition patient={patient} style={{ minHeight: "230px" }} />
            <CardHealthReport style={{ minHeight: "230px" }} />
            <CardMedicineHistory style={{ minHeight: "230px" }} />
          </div>

          {/* Row 5: Patient Notes */}
          <CardNotes />
        </main>
      </div>

      <DokumentiDrawer
        patient={patient}
        open={dokumentiOpen}
        onClose={() => setDokumentiOpen(false)}
      />
    </div>
  );
}
