// Dokumenti drawer — generates legal/administrative document templates (school/work absence, referrals).
// Entry point: "Dokumenti" pill in patient details tab bar.
// Templates: clinic templates (from localStorage) + system templates (constants).
// Saved documents store a resolvedHtml snapshot — template edits do NOT affect past documents.
"use client";

import { useState, useEffect } from "react";
import { X, FileText, Check, ChevronDown } from "lucide-react";
import { ORDINACIJA, DOKTOR } from "@/ui-lab/config/clinicConfig";
import {
  buildDocumentHtml,
  interpolateTemplate,
  fmtDate,
  peekNextDocNumber,
  consumeNextDocNumber,
  SYSTEM_TEMPLATES,
  type TemplateContext,
} from "@/ui-lab/lib/buildDocument";
import { getClinicTemplates } from "@/ui-lab/lib/templatesStorage";
import type {
  AnyTemplate,
  ClinicTemplate,
  DokumentForm,
  SavedDokument,
} from "@/ui-lab/types/dokumenti";
import type { PatientForDetails } from "./mock";

// ─── Helpers ─────────────────────────────────────────────

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── localStorage hook ────────────────────────────────────

function useDokumenti(patientId: string) {
  const key = `odontoa_v2_dokumenti_${patientId}`;
  const [list, setList] = useState<SavedDokument[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setList(JSON.parse(raw) as SavedDokument[]);
    } catch {
      // ignore
    }
  }, [key]);

  function save(d: SavedDokument) {
    const next = [d, ...list];
    setList(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
  }

  return { list, save };
}

// ─── Style helpers ────────────────────────────────────────

const inputSt: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid var(--v2-border)",
  background: "var(--v2-input-bg)",
  color: "var(--v2-text)",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const labelSt: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--v2-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  marginBottom: "4px",
  display: "block",
};

// ─── Main Drawer ──────────────────────────────────────────

interface DokumentiDrawerProps {
  patient: PatientForDetails;
  open: boolean;
  onClose: () => void;
}

export function DokumentiDrawer({ patient, open, onClose }: DokumentiDrawerProps) {
  const today    = todayIso();
  const lastVisit = (patient as PatientForDetails & { lastVisitDate?: string }).lastVisitDate ?? today;

  const { save } = useDokumenti(String(patient.id));

  // ─── Templates ─────────────────────────────────────────
  const [clinicTemplates, setClinicTemplates] = useState<ClinicTemplate[]>([]);

  useEffect(() => {
    setClinicTemplates(getClinicTemplates().filter(t => t.isActive));
  }, []);

  // Determine initial template: first active clinic template, else first system template
  const allTemplates: AnyTemplate[] = [...clinicTemplates, ...SYSTEM_TEMPLATES];

  const [selectedTemplate, setSelectedTemplate] = useState<AnyTemplate>(SYSTEM_TEMPLATES[0]);

  // Update selected template once clinic templates are loaded
  useEffect(() => {
    if (clinicTemplates.length > 0) {
      setSelectedTemplate(clinicTemplates[0]);
    }
  // Only run when clinicTemplates first loads (non-empty)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicTemplates.length > 0]);

  // ─── Form state ────────────────────────────────────────
  const [form, setForm] = useState<DokumentForm>({
    datumPosete:    lastVisit,
    datumDokumenta: today,
    abFrom:         lastVisit,
    abTo:           lastVisit,
    razlog:         "",
    specijalist:    "",
  });

  const [showDetails, setShowDetails] = useState(false);
  const [saved, setSaved]           = useState(false);
  const [previewBroj, setPreviewBroj] = useState("DOC-????-??????");

  useEffect(() => {
    setPreviewBroj(peekNextDocNumber());
  }, []);

  function set<K extends keyof DokumentForm>(k: K, v: DokumentForm[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleTemplateChange(id: string) {
    const tpl = allTemplates.find(t => t.id === id);
    if (tpl) setSelectedTemplate(tpl);
  }

  // ─── Derived visibility ────────────────────────────────
  const showPeriod      = selectedTemplate.requiredFields.includes("period");
  const showRazlog      = selectedTemplate.requiredFields.includes("razlog");
  const showSpecijalist = selectedTemplate.requiredFields.includes("specijalista");

  // ─── Build TemplateContext ─────────────────────────────
  function buildCtx(broj: string): TemplateContext {
    return {
      patient_full_name:      patient.fullName,
      patient_dob:            fmtDate(patient.dateOfBirth),
      visit_date:             fmtDate(form.datumPosete),
      absence_from:           fmtDate(form.abFrom),
      absence_to:             fmtDate(form.abTo),
      reason_short:           form.razlog.trim() || "–",
      referred_to_specialist: form.specijalist.trim() || "–",
      clinic_name:            ORDINACIJA.naziv,
      clinic_address:         `${ORDINACIJA.adresa}, ${ORDINACIJA.grad}`,
      city:                   DOKTOR.city,
      document_date:          fmtDate(form.datumDokumenta),
      doctor_full_name:       DOKTOR.fullName,
      broj_dokumenta:         broj,
    };
  }

  function buildHtml(broj: string): string {
    const ctx = buildCtx(broj);
    return buildDocumentHtml({
      brojDokumenta:   broj,
      docTitle:        selectedTemplate.docTitle,
      bodyTextResolved: interpolateTemplate(selectedTemplate.bodyTemplate, ctx),
      patient:         { fullName: patient.fullName, dateOfBirth: patient.dateOfBirth },
      datumDokumenta:  form.datumDokumenta,
    });
  }

  const html = buildHtml(previewBroj);

  // ─── Actions ───────────────────────────────────────────
  function handleSave() {
    const broj = consumeNextDocNumber();
    const resolvedHtml = buildHtml(broj);
    const source = "source" in selectedTemplate ? "system" : "clinic";
    save({
      id:              `dok_${Date.now()}`,
      patientId:       String(patient.id),
      createdAt:       new Date().toISOString(),
      brojDokumenta:   broj,
      templateId:      selectedTemplate.id,
      templateSource:  source,
      templateName:    selectedTemplate.name,
      form,
      resolvedHtml,
    });
    setPreviewBroj(peekNextDocNumber());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handlePrint() {
    const win = window.open("", "_blank", "width=820,height=960");
    if (!win) return;
    const currentHtml = buildHtml(previewBroj);
    win.document.write(`<!DOCTYPE html><html lang="sr">
<head>
  <meta charset="UTF-8"/>
  <title>${selectedTemplate.name}</title>
  <style>
    @media print { @page { size: A4; margin: 10mm; } .toolbar { display: none !important; } body { margin: 0; } }
    body { background: #e8e8e8; margin: 0; font-family: inherit; }
    .doc { background: #fff; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 15mm 18mm; box-sizing: border-box; }
    .toolbar { display: flex; gap: 10px; padding: 10px 20px; background: #f5f5f5; border-bottom: 1px solid #ddd; }
    button { padding: 7px 16px; border-radius: 6px; border: 1px solid #ccc; background: #fff; cursor: pointer; font-size: 13px; }
    button.primary { background: #1a56db; color: #fff; border-color: #1a56db; font-weight: 600; }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.close()">← Nazad</button>
    <button class="primary" onclick="window.print()">Štampaj / Sačuvaj PDF</button>
    <span style="font-size:12px;color:#555;margin-left:8px">${selectedTemplate.name} · ${patient.fullName}</span>
  </div>
  <div class="doc">${currentHtml}</div>
</body>
</html>`);
    win.document.close();
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: "min(520px, 100vw)",
          background: "var(--v2-surface)",
          borderLeft: "1px solid var(--v2-border)",
          boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-shrink-0 px-[20px] py-[16px]"
          style={{ borderBottom: "1px solid var(--v2-border)" }}
        >
          <div className="flex items-center gap-[8px]">
            <FileText style={{ width: "18px", height: "18px", color: "var(--v2-primary)" }} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--v2-text-heading)" }}>
              Dokumenti
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center hover:opacity-60 transition-opacity"
            style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--v2-bg)", border: "none", cursor: "pointer" }}
          >
            <X style={{ width: "16px", height: "16px", color: "var(--v2-text-muted)" }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[16px]">

          {/* Tip dokumenta — grouped dropdown */}
          <div>
            <label style={labelSt}>Tip dokumenta</label>
            <select
              value={selectedTemplate.id}
              onChange={e => handleTemplateChange(e.target.value)}
              style={inputSt}
            >
              {clinicTemplates.length > 0 && (
                <optgroup label="Moji šabloni">
                  {clinicTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Standardni šabloni (Odontoa)">
                {SYSTEM_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Compact context row + collapsible details */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between gap-[8px] min-w-0">
              <span
                className="truncate text-[12px] min-w-0"
                style={{ color: "var(--v2-text-muted)" }}
              >
                <span style={{ color: "var(--v2-text)" }}>{patient.fullName}</span>
                {" · "}
                {DOKTOR.fullName}
              </span>
              <button
                onClick={() => setShowDetails(d => !d)}
                className="flex items-center gap-[3px] text-[11px] font-medium hover:opacity-70 transition-opacity flex-shrink-0"
                style={{ color: "var(--v2-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showDetails ? "Sakrij" : "Prikaži detalje"}
                <ChevronDown
                  style={{
                    width: "13px",
                    height: "13px",
                    transition: "transform 0.2s",
                    transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
            </div>
            {showDetails && (
              <div
                style={{ background: "var(--v2-bg)", borderRadius: "10px", padding: "10px 12px", fontSize: "12px", color: "var(--v2-text)", lineHeight: 1.7 }}
              >
                <div><span style={{ color: "var(--v2-text-muted)" }}>Pacijent: </span>{patient.fullName}</div>
                <div><span style={{ color: "var(--v2-text-muted)" }}>Datum rođenja: </span>{fmtDate(patient.dateOfBirth)}</div>
                <div><span style={{ color: "var(--v2-text-muted)" }}>Ordinacija: </span>{ORDINACIJA.naziv}</div>
                <div><span style={{ color: "var(--v2-text-muted)" }}>Doktor: </span>{DOKTOR.fullName}</div>
              </div>
            )}
          </div>

          {/* Datum posete + Datum dokumenta — always shown */}
          <div className="grid gap-[12px]" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <label style={labelSt}>Datum posete</label>
              <input
                type="date"
                value={form.datumPosete}
                onChange={e => set("datumPosete", e.target.value)}
                style={inputSt}
              />
            </div>
            <div>
              <label style={labelSt}>Datum dokumenta</label>
              <input
                type="date"
                value={form.datumDokumenta}
                onChange={e => set("datumDokumenta", e.target.value)}
                style={inputSt}
              />
            </div>
          </div>

          {/* Period izostanka */}
          {showPeriod && (
            <div className="grid gap-[12px]" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label style={labelSt}>Period izostanka — od</label>
                <input
                  type="date"
                  value={form.abFrom}
                  onChange={e => set("abFrom", e.target.value)}
                  style={inputSt}
                />
              </div>
              <div>
                <label style={labelSt}>Period izostanka — do</label>
                <input
                  type="date"
                  value={form.abTo}
                  onChange={e => set("abTo", e.target.value)}
                  style={inputSt}
                />
              </div>
            </div>
          )}

          {/* Specijalista */}
          {showSpecijalist && (
            <div>
              <label style={labelSt}>Specijalista *</label>
              <input
                type="text"
                placeholder="npr. Ortodont, Oralni hirurg…"
                value={form.specijalist}
                onChange={e => set("specijalist", e.target.value)}
                style={inputSt}
              />
            </div>
          )}

          {/* Razlog */}
          {showRazlog && (
            <div>
              <label style={labelSt}>Razlog (kratko) *</label>
              <input
                type="text"
                placeholder="Kratak opis razloga…"
                value={form.razlog}
                onChange={e => set("razlog", e.target.value)}
                style={inputSt}
              />
            </div>
          )}

          {/* Live preview */}
          <div>
            <label style={labelSt}>Pregled dokumenta</label>
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--v2-border)",
                borderRadius: "8px",
                padding: "16px",
                fontFamily: "inherit",
                fontSize: "11px",
                lineHeight: 1.5,
                color: "#111",
                overflowX: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

        </div>

        {/* Footer actions */}
        <div
          className="flex items-center gap-[10px] flex-shrink-0 px-[20px] py-[14px]"
          style={{ borderTop: "1px solid var(--v2-border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-[8px] rounded-[8px] text-[13px] font-medium hover:opacity-70 transition-opacity"
            style={{ background: "var(--v2-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)", cursor: "pointer" }}
          >
            Zatvori
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-[5px] py-[8px] rounded-[8px] text-[13px] font-semibold hover:opacity-80 transition-all"
            style={{
              background: saved ? "var(--v2-primary-dark)" : "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {saved ? <><Check size={13} /> Sačuvano</> : "Sačuvaj"}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-[8px] rounded-[8px] text-[13px] font-semibold hover:opacity-80 transition-opacity"
            style={{
              background: "var(--v2-primary-bg)",
              color: "var(--v2-primary-dark)",
              border: "1px solid var(--v2-primary)",
              cursor: "pointer",
            }}
          >
            Preuzmi PDF
          </button>
        </div>
      </div>
    </>
  );
}
