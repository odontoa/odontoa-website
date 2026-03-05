// Figma: Moodify Patient Details — Mobile (node-id=329-12666, frame 390×3477)
// Navbar: 60px. Content: 16px padding sides. Single column, gap=16px.
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Pencil, MoreHorizontal, Plus, Trash2, FileText } from "lucide-react";
import { DokumentiDrawer } from "./DokumentiDrawer";
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

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", padding: "16px", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-[12px]">
      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--v2-text-heading)", lineHeight: "1.3" }}>{title}</span>
      {right ?? (
        <button className="flex items-center justify-center flex-shrink-0" style={{ width: "30px", height: "30px", borderRadius: "5px", background: "var(--v2-bg)", border: "none", cursor: "pointer" }}>
          <MoreHorizontal style={{ width: "14px", height: "14px", color: "var(--v2-text-muted)" }} />
        </button>
      )}
    </div>
  );
}

// ─── Mobile Navbar (60px) ─────────────────────────────────

function MobileNavbar() {
  return (
    <div className="flex items-center justify-between px-[16px] flex-shrink-0" style={{ height: "60px", background: "var(--v2-surface)", borderBottom: "1px solid var(--v2-border)" }}>
      <div className="flex items-center gap-[12px]">
        <Link href="/ui-lab/pacijenti" className="flex items-center justify-center flex-shrink-0" style={{ width: "36px", height: "36px", borderRadius: "6px", background: "var(--v2-bg)" }}>
          <ArrowLeft style={{ width: "18px", height: "18px", color: "var(--v2-text)" }} />
        </Link>
        <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--v2-text-heading)", lineHeight: "1.2" }}>Pregled pacijenta</span>
      </div>
      <button className="flex items-center justify-center flex-shrink-0" style={{ width: "36px", height: "36px", borderRadius: "6px", background: "var(--v2-bg)", border: "none", cursor: "pointer" }}>
        <MoreHorizontal style={{ width: "20px", height: "20px", color: "var(--v2-text)" }} />
      </button>
    </div>
  );
}

function formatDateOfBirth(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// ─── General Info (358×250) ───────────────────────────────

function CardGeneralInfo({ patient, onEdit, onDelete }: { patient: PatientForDetails; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Card>
      {/* Photo & Name */}
      <div className="flex items-center gap-[14px]" style={{ marginBottom: "14px" }}>
        <div className="flex items-center justify-center font-bold flex-shrink-0" style={{ width: "90px", height: "90px", borderRadius: "16px", background: "var(--v2-primary)", color: "var(--v2-primary-fg)", fontSize: "24px" }}>
          {patient.initials}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[2px] min-w-0">
            <span className="font-semibold truncate" style={{ fontSize: "18px", color: "var(--v2-text)", lineHeight: "1.2" }}>{patient.fullName}</span>
            <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>{patient.patientCode ?? `MDF-P${String(patient.id).padStart(3, "0")}`}</span>
          </div>
          <div className="flex items-center gap-[8px]">
            <button className="flex items-center justify-center" style={{ width: "32px", height: "32px", borderRadius: "18px", background: "var(--v2-primary-bg)", border: "none", cursor: "pointer" }}>
              <MessageCircle style={{ width: "14px", height: "14px", color: "var(--v2-primary-dark)" }} />
            </button>
            {onDelete && (
              <button onClick={onDelete} className="flex items-center justify-center" style={{ width: "32px", height: "32px", borderRadius: "18px", background: "var(--v2-status-cancelled-bg)", border: "none", cursor: "pointer" }} title="Obriši">
                <Trash2 style={{ width: "14px", height: "14px", color: "var(--v2-status-cancelled-fg)" }} />
              </button>
            )}
            <button onClick={onEdit} className="flex items-center gap-[5px]" style={{ height: "32px", padding: "0 12px", borderRadius: "18px", background: "var(--v2-primary)", border: "none", cursor: "pointer", color: "var(--v2-primary-fg)", fontSize: "12px", fontWeight: 500 }}>
              <Pencil style={{ width: "11px", height: "11px" }} />
              Izmeni
            </button>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div style={{ height: "1px", background: "var(--v2-border)", marginBottom: "14px" }} />
      {/* Info — 3 items */}
      <div className="flex flex-col gap-[10px]">
        {[
          { label: "Datum rođenja", value: formatDateOfBirth(patient.dateOfBirth) },
          { label: "Email adresa", value: patient.email },
          { label: "Kontakt", value: patient.contactPhone },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-[8px]">
            <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>{label}</span>
            <span style={{ fontSize: "12px", color: "var(--v2-text)", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Aktivni dolasci (358×266) ───────────────────────────────

function CardWellbeing() {
  const BAR_H = 110;
  const [period, setPeriod] = useState<"1" | "6" | "12" | "all">("6");
  const chartData = getVisitsForPeriod(period);
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex items-center justify-between mb-[12px]">
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--v2-text-heading)" }}>Aktivni dolasci pacijenta</span>
        <VisitsPeriodDropdown value={period} onChange={setPeriod} size="sm" />
      </div>
      <div className="flex gap-[4px]" style={{ height: `${BAR_H + 22}px` }}>
        {chartData.map((d) => {
          const barH = (d.count / maxCount) * BAR_H;
          const isHovered = hovered === d.month;
          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center justify-end gap-[6px] relative"
              onMouseEnter={() => setHovered(d.month)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div
                  className="absolute z-10 px-2 py-1 rounded shadow-md whitespace-nowrap"
                  style={{
                    bottom: `${barH + 22}px`,
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
                  height: `${barH}px`,
                  background: isHovered ? "var(--v2-primary-dark)" : "var(--v2-primary)",
                  borderRadius: "6px 6px 0 0",
                  minHeight: "4px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              />
              <span style={{ fontSize: "10px", color: "var(--v2-text-muted)", flexShrink: 0, lineHeight: 1 }}>{d.month}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Naredni termini (358×439) ────────────────────────────

function CardUpcoming({ patient }: { patient: PatientForDetails }) {
  const upcoming = getUpcomingForPatient(patient.id);
  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <CardHeader title="Naredni termini" right={<DropdownPill size="sm">Ove nedelje</DropdownPill>} />
      <div className="flex flex-col gap-[8px]">
        {upcoming.map((apt, i) => (
          <div key={i} className="flex flex-col gap-[8px]" style={{ background: "var(--v2-bg)", borderRadius: "16px", padding: "12px 14px" }}>
            <span style={{ display: "inline-flex", alignSelf: "flex-start", fontSize: "11px", color: "var(--v2-text)", background: "var(--v2-primary-bg)", borderRadius: "4px", padding: "2px 6px" }}>{apt.type}</span>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-primary-dark)", lineHeight: "1.3" }}>{apt.session}</span>
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

// ─── Istorija tretmana (358×422) ──────────────────────────

function CardTreatmentHistory({ patient }: { patient: PatientForDetails }) {
  const treatments = getTreatmentsForPatient(patient.id);
  return (
    <Card>
      <CardHeader title="Istorija tretmana" />
      <div className="flex flex-col">
        {treatments.map((tr, i) => (
          <div key={i}>
            <div className="flex items-start gap-[8px] py-[10px]">
              <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-text)", lineHeight: "1.3" }}>{tr.title}</span>
                <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>{tr.date}</span>
              </div>
              <span style={{ fontSize: "11px", borderRadius: "6px", padding: "4px 8px", flexShrink: 0, background: tr.status === "completed" ? "var(--v2-primary-dark)" : "var(--v2-primary)", color: tr.status === "completed" ? "var(--v2-primary-bg)" : "var(--v2-primary-fg)", whiteSpace: "nowrap" }}>
                {tr.status === "completed" ? "Završeno" : "Ponovni tretman"}
              </span>
            </div>
            {i < treatments.length - 1 && <div style={{ height: "1px", background: "var(--v2-border)" }} />}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Medicinsko stanje (358×240) ───────────────────────────────

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
    <Card>
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
      <div className="flex flex-col gap-[8px]">
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

// ─── Zdravstveni izveštaji (358×230) ─────────────────────

function CardHealthReport() {
  return (
    <Card>
      <CardHeader title="Zdravstveni izveštaji" right={
        <button className="flex items-center justify-center" style={{ width: "30px", height: "30px", borderRadius: "15px", background: "var(--v2-primary)", border: "none", cursor: "pointer" }}>
          <Plus style={{ width: "14px", height: "14px", color: "var(--v2-primary-fg)" }} />
        </button>
      } />
      <div className="flex flex-col gap-[10px]">
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

// ─── Istorija lekova (358×442) ────────────────────────────

function CardMedicineHistory() {
  return (
    <Card>
      <CardHeader title="Istorija lekova" right={<DropdownPill size="sm">Aktivni</DropdownPill>} />
      <div className="flex flex-col gap-[8px]">
        {MOCK_MEDICATIONS.map((med, i) => (
          <div key={i} className="flex flex-col gap-[4px]" style={{ background: "var(--v2-bg)", borderRadius: "16px", padding: "10px 14px" }}>
            <span style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{med.date}</span>
            <div className="flex items-center justify-between gap-[8px]">
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--v2-text)" }}>{med.name}</span>
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

// ─── Beleške pacijenta (358×586) ─────────────────────────

function CardNotes() {
  return (
    <div>
      <CardHeader title="Beleške pacijenta" />
      <div className="flex flex-col gap-[16px]">
        {MOCK_NOTES.map((note, i) => (
          <div key={i} className="flex flex-col gap-[8px]" style={{ background: "var(--v2-surface)", borderRadius: "16px", padding: "12px 14px", border: "1px solid var(--v2-border)", minHeight: "100px" }}>
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

export default function MobilePatientDetails({
  patient,
  className,
  onEdit,
  onDelete,
}: { patient: PatientForDetails; className?: string; onEdit?: () => void; onDelete?: () => void }) {
  const [dokumentiOpen, setDokumentiOpen] = useState(false);

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <MobileNavbar />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[16px]" style={{ padding: "16px" }}>
          {/* Tab bar — future: Karton / Slike / X-ray / … */}
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => setDokumentiOpen(true)}
              className="flex items-center gap-[6px] px-[14px] py-[6px] text-[13px] font-semibold rounded-full hover:opacity-80 transition-opacity"
              style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)", border: "none", cursor: "pointer" }}
            >
              <FileText size={14} /> Dokumenti
            </button>
          </div>

          <CardGeneralInfo patient={patient} onEdit={onEdit} onDelete={onDelete} />
          <CardWellbeing />
          <CardUpcoming patient={patient} />
          <CardTreatmentHistory patient={patient} />
          <CardMedicalCondition patient={patient} />
          <CardHealthReport />
          <CardMedicineHistory />
          <CardNotes />
        </div>
      </div>

      <DokumentiDrawer
        patient={patient}
        open={dokumentiOpen}
        onClose={() => setDokumentiOpen(false)}
      />
    </div>
  );
}
