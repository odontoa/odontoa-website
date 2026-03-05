// Figma: Moodify Patient Details — Desktop (node-id=56-5890, frame 1440×1046)
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Bell, MessageCircle, Pencil, MoreHorizontal, Plus, Trash2, FileText } from "lucide-react";
import { FigmaDesktopSidebar } from "@/ui-lab/screens/figma-dashboard/sidebars";
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

function DetailsTopbar({ patientName }: { patientName: string }) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 pl-[4px]"
      style={{ height: "var(--v2-topbar-h)" }}
    >
      <div className="flex items-center gap-[16px] min-w-0">
        <Link
          href="/ui-lab/pacijenti"
          className="flex items-center gap-[5px] flex-shrink-0 transition-opacity hover:opacity-70"
          style={{ color: "var(--v2-text-muted)", fontSize: "12px" }}
        >
          <ArrowLeft style={{ width: "12px", height: "12px" }} />
          Nazad
        </Link>
        <div className="flex flex-col gap-[2px] min-w-0">
          <h1 className="font-semibold leading-[1.1] truncate" style={{ fontSize: "18px", color: "var(--v2-text)" }}>
            Pregled pacijenta
          </h1>
          <p className="truncate" style={{ fontSize: "11px", color: "var(--v2-text-muted)", lineHeight: "1.2" }}>
            {patientName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-[12px] flex-shrink-0">
        <button className="flex items-center justify-center flex-shrink-0" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
          <Settings style={{ width: "20px", height: "20px", color: "var(--v2-primary-dark)" }} />
        </button>
        <button className="relative flex items-center justify-center flex-shrink-0" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
          <Bell style={{ width: "20px", height: "20px", color: "var(--v2-primary-dark)" }} />
          <span className="absolute h-[8px] w-[8px] rounded-full" style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }} />
        </button>
        <div className="flex items-center gap-[10px] flex-shrink-0">
          <div className="flex items-center justify-center font-semibold flex-shrink-0 text-[12px]" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>
            MM
          </div>
          <div className="flex flex-col gap-[2px]">
            <div className="font-bold" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>Dr Marko Marković</div>
            <div style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Visits Chart (Aktivni dolasci) — 6 meseci, hover tooltip ───────────────

function VisitsChart() {
  const [period, setPeriod] = useState<"1" | "6" | "12" | "all">("6");
  const chartData = getVisitsForPeriod(period);
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--v2-text-heading)" }}>
          Aktivni dolasci pacijenta
        </span>
        <VisitsPeriodDropdown value={period} onChange={setPeriod} size="sm" />
      </div>
      <div className="flex-1 flex flex-col gap-0">
        <div className="flex-1 relative" style={{ borderBottom: "1px solid var(--v2-border)" }}>
          {/* Y-axis: 0, mid, max */}
          {[0, Math.ceil(maxCount / 2), maxCount].map((tick) => (
            <span
              key={tick}
              style={{
                position: "absolute",
                left: 0,
                bottom: tick === 0 ? "-5px" : `calc(${(tick / maxCount) * 100}% - 5px)`,
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
          {[0.25, 0.5, 0.75].map((pct) => (
            <div
              key={pct}
              style={{
                position: "absolute",
                left: "32px",
                right: 0,
                bottom: `${pct * 100}%`,
                height: "1px",
                background: "var(--v2-border)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: "32px",
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              gap: "6px",
              alignItems: "flex-end",
            }}
          >
            {chartData.map((d) => {
              const heightPct = (d.count / maxCount) * 100;
              const isHovered = hovered === d.month;
              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center justify-end relative"
                  style={{ height: "100%" }}
                  onMouseEnter={() => setHovered(d.month)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {isHovered && (
                    <div
                      className="absolute z-10 px-2 py-1 rounded shadow-md whitespace-nowrap"
                      style={{
                        bottom: `calc(${heightPct}% + 8px)`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--v2-text-heading)",
                        color: "var(--v2-surface)",
                        fontSize: "12px",
                        fontWeight: 500,
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
    </div>
  );
}

function formatDateOfBirth(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// ─── Card A: General Info (557×142) + Well-Being Progress (557×260) ──────────
// Combined into single card (557×422) with internal divider — Figma node 168:7122

function CardGeneralAndWellbeing({ patient }: { patient: PatientForDetails }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", minHeight: "422px" }}>

      {/* ── General Info — 142px section ── */}
      <div className="flex gap-[20px]" style={{ minHeight: "110px" }}>

        {/* Avatar 110×110, r=16, bg=--v2-primary */}
        <div
          className="flex items-center justify-center font-bold flex-shrink-0"
          style={{ width: "110px", height: "110px", borderRadius: "16px", background: "var(--v2-primary)", color: "var(--v2-primary-fg)", fontSize: "28px" }}
        >
          {patient.initials}
        </div>

        {/* Info block — 395px */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 0 }}>

          {/* Head: Name + ID left, Chat + Edit right */}
          <div className="flex items-start justify-between gap-[8px]">
            <div className="flex flex-col gap-[4px] min-w-0">
              <span className="font-semibold truncate" style={{ fontSize: "22px", color: "var(--v2-text)", lineHeight: "1.2" }}>
                {patient.fullName}
              </span>
              <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
                MDF-P{String(patient.id).padStart(3, "0")}
              </span>
            </div>
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <button
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: "36px", height: "36px", borderRadius: "20px", background: "var(--v2-primary-bg)", border: "none", cursor: "pointer" }}
              >
                <MessageCircle style={{ width: "16px", height: "16px", color: "var(--v2-primary-dark)" }} />
              </button>
              <button
                className="flex items-center gap-[6px] flex-shrink-0"
                style={{ height: "36px", padding: "0 16px", borderRadius: "20px", background: "var(--v2-primary)", border: "none", cursor: "pointer", color: "var(--v2-primary-fg)", fontSize: "12px", fontWeight: 500 }}
              >
                <Pencil style={{ width: "12px", height: "12px" }} />
                Izmeni
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--v2-border)", margin: "12px 0" }} />

          {/* 3-col info: Datum rođenja | Email adresa | Kontakt */}
          <div className="flex gap-[20px]">
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

      {/* Section divider — 16px above (matches card padding), 20px below (Figma gap = 20px) */}
      <div style={{ height: "1px", background: "var(--v2-border)", margin: "16px 0 20px" }} />

      {/* ── Aktivni dolasci — 260px section ── */}
      <VisitsChart />
    </Card>
  );
}

// ─── Naredni termini (268×422) ────────────────────────────
// Card items: 236×102, bg=--v2-bg, r=16
// Each item: type badge (bg=--v2-primary-bg r=4) + session title (fs=14 fw=500 --v2-primary-dark) + doctor | datetime

function CardUpcoming({ patient }: { patient: PatientForDetails }) {
  const upcoming = getUpcomingForPatient(patient.id);
  return (
    <Card style={{ display: "flex", flexDirection: "column", minHeight: "422px" }}>
      <CardHeader title="Naredni termini" right={<DropdownPill size="sm">Ove nedelje</DropdownPill>} />
      <div className="flex flex-col gap-[8px] flex-1 overflow-y-auto">
        {upcoming.map((apt, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px]"
            style={{
              background: "var(--v2-bg)",
              borderRadius: "16px",
              padding: "12px 16px",
            }}
          >
            {/* Type badge */}
            <span
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                fontSize: "11px",
                fontWeight: 400,
                color: "var(--v2-text)",
                background: "var(--v2-primary-bg)",
                borderRadius: "4px",
                padding: "2px 6px",
              }}
            >
              {apt.type}
            </span>
            {/* Session title */}
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-primary-dark)", lineHeight: "1.3" }}>
              {apt.session}
            </span>
            {/* Doctor | Datetime */}
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

// ─── Istorija tretmana (268×422) ──────────────────────────
// Items separated by horizontal dividers
// Left: treatment name (fs=14 fw=500) + date (fs=12 muted)
// Right: status badge (r=6)

function TreatmentStatusBadge({ status }: { status: "completed" | "retreatment" }) {
  const isCompleted = status === "completed";
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 400,
        borderRadius: "6px",
        padding: "4px 8px",
        flexShrink: 0,
        background: isCompleted ? "var(--v2-primary-dark)" : "var(--v2-primary)",
        color: isCompleted ? "var(--v2-primary-bg)" : "var(--v2-primary-fg)",
        whiteSpace: "nowrap",
      }}
    >
      {isCompleted ? "Završeno" : "Ponovni tretman"}
    </span>
  );
}

function CardTreatmentHistory({ patient }: { patient: PatientForDetails }) {
  const treatments = getTreatmentsForPatient(patient.id);
  return (
    <Card style={{ display: "flex", flexDirection: "column", minHeight: "422px" }}>
      <CardHeader title="Istorija tretmana" />
      <div className="flex flex-col flex-1 overflow-y-auto">
        {treatments.map((tr, i) => (
          <div key={i}>
            <div className="flex items-center gap-[8px] py-[10px]">
              {/* Left: name + date */}
              <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-text)", lineHeight: "1.3" }}>
                  {tr.title}
                </span>
                <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>{tr.date}</span>
              </div>
              {/* Right: status badge */}
              <TreatmentStatusBadge status={tr.status} />
            </div>
            {i < treatments.length - 1 && (
              <div style={{ height: "1px", background: "var(--v2-border)" }} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Medicinsko stanje (268×230) ───────────────────────────────
// Lista stanja pacijenta + Dodaj dropdown

function CardMedicalCondition({ patient }: { patient: PatientForDetails }) {
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
    <Card style={{ display: "flex", flexDirection: "column" }}>
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

// ─── Zdravstveni izveštaji (268×230) ─────────────────────
// PDF file list: dark icon (34×34 r=6) + title + trash

function CardHealthReport() {
  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Zdravstveni izveštaji"
        right={
          <button
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: "30px", height: "30px", borderRadius: "15px", background: "var(--v2-primary)", border: "none", cursor: "pointer" }}
          >
            <Plus style={{ width: "14px", height: "14px", color: "var(--v2-primary-fg)" }} />
          </button>
        }
      />
      <div className="flex flex-col gap-[10px] flex-1">
        {MOCK_HEALTH_REPORTS.map((rep, i) => (
          <div key={i} className="flex items-center gap-[10px]">
            {/* Dark icon 34×34 r=6 */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: "34px", height: "34px", borderRadius: "6px", background: "var(--v2-primary-dark)" }}
            >
              <FileText style={{ width: "18px", height: "18px", color: "var(--v2-primary-bg)" }} />
            </div>
            {/* Title */}
            <span className="flex-1 min-w-0" style={{ fontSize: "12px", color: "var(--v2-text)", lineHeight: "1.4" }}>
              {rep.title}
            </span>
            {/* Trash */}
            <button
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: "26px", height: "26px", borderRadius: "5px", background: "var(--v2-bg)", border: "none", cursor: "pointer" }}
            >
              <Trash2 style={{ width: "14px", height: "14px", color: "var(--v2-text-muted)" }} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Beleške pacijenta (845×170) ─────────────────────────
// 4 note cards in row: 199×124, bg=--v2-surface, r=16
// Each: date (fs=11 muted) + title (fs=14 fw=500 --v2-primary-dark) + text (fs=12 muted)

function CardNotes() {
  return (
    <div>
      <CardHeader title="Beleške pacijenta" />
      <div className="grid gap-[16px]" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {MOCK_NOTES.map((note, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px]"
            style={{
              background: "var(--v2-surface)",
              borderRadius: "16px",
              padding: "12px 16px",
              border: "1px solid var(--v2-border)",
              minHeight: "100px",
            }}
          >
            <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{note.date}</span>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-primary-dark)", lineHeight: "1.3" }}>
              {note.title}
            </span>
            <p className="line-clamp-3" style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.4", margin: 0 }}>
              {note.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Istorija lekova (268×416) ────────────────────────────
// Items: bg=--v2-bg, r=16. Each: date + name + status badge

function MedicationStatusBadge({ status }: { status: "stop" | "active" }) {
  if (status === "stop") {
    return (
      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--v2-status-cancelled-fg)", flexShrink: 0 }}>
        Stop
      </span>
    );
  }
  return (
    <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--v2-primary-dark)", flexShrink: 0 }}>
      Aktivno
    </span>
  );
}

function CardMedicineHistory() {
  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <CardHeader title="Istorija lekova" right={<DropdownPill size="sm">Aktivni</DropdownPill>} />
      <div className="flex flex-col gap-[8px] flex-1 overflow-y-auto">
        {MOCK_MEDICATIONS.map((med, i) => (
          <div
            key={i}
            className="flex flex-col gap-[6px]"
            style={{ background: "var(--v2-bg)", borderRadius: "16px", padding: "10px 16px" }}
          >
            <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{med.date}</span>
            <div className="flex items-center justify-between gap-[8px]">
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-text)" }}>{med.name}</span>
              <MedicationStatusBadge status={med.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main Screen ──────────────────────────────────────────

export default function DesktopPatientDetails({ patient, className }: { patient: PatientForDetails; className?: string }) {
  return (
    <div
      className={`flex h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaDesktopSidebar />

      {/* Main column */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <DetailsTopbar patientName={patient.fullName} />

        {/* Body — gray rounded panel */}
        <main
          className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >
          {/* ROW 1 — Card A capped at Figma 557px; right cards grow from 268px to fill extra space */}
          <div className="grid gap-[20px]" style={{ gridTemplateColumns: "minmax(0, 557px) minmax(268px, 1fr) minmax(268px, 1fr)" }}>
            <CardGeneralAndWellbeing patient={patient} />
            <CardUpcoming patient={patient} />
            <CardTreatmentHistory patient={patient} />
          </div>

          {/* ROW 2 — 3 kartice (kao u redu iznad) + Notes */}
          <div className="flex flex-col gap-[16px]">
            <div className="grid gap-[20px]" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <CardMedicalCondition patient={patient} />
              <CardHealthReport />
              <CardMedicineHistory />
            </div>
            <CardNotes />
          </div>
        </main>
      </div>
    </div>
  );
}
