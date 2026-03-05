// TemplateEditorDrawer — create/edit clinic document templates.
// Shows form (left) + live preview (right) using shared buildDocumentHtml.
"use client";

import { useState, useEffect } from "react";
import { X, FileStack } from "lucide-react";
import { ORDINACIJA, DOKTOR } from "@/ui-lab/config/clinicConfig";
import {
  buildDocumentHtml,
  interpolateTemplate,
  fmtDate,
  type TemplateContext,
} from "@/ui-lab/lib/buildDocument";
import { upsertTemplate } from "@/ui-lab/lib/templatesStorage";
import type { ClinicTemplate, TemplateCategory, TemplateField } from "@/ui-lab/types/dokumenti";

// ─── Constants ────────────────────────────────────────────

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  opravdanja: "Opravdanja",
  potvrde:    "Potvrde",
  uputi:      "Uputi",
  ostalo:     "Ostalo",
};

const FIELD_LABELS: Record<TemplateField, string> = {
  razlog:      "Razlog (kratko)",
  period:      "Period izostanka (od/do)",
  specijalista:"Specijalista",
  svrhaPosete: "Svrha posete",
  napomena:    "Napomena",
};

const ALL_FIELDS: TemplateField[] = ["razlog", "period", "specijalista", "svrhaPosete", "napomena"];

const PLACEHOLDER_LIST = [
  "{patient_full_name}", "{patient_dob}", "{visit_date}", "{absence_from}", "{absence_to}",
  "{reason_short}", "{referred_to_specialist}", "{clinic_name}", "{clinic_address}",
  "{city}", "{document_date}", "{doctor_full_name}", "{broj_dokumenta}",
];

// ─── Mock preview context ────────────────────────────────

const PREVIEW_PATIENT = { fullName: "Ana Nikolić", dateOfBirth: "1990-05-15" };

const PREVIEW_CTX: TemplateContext = {
  patient_full_name:       "Ana Nikolić",
  patient_dob:             "15.05.1990.",
  visit_date:              fmtDate(new Date().toISOString().slice(0, 10)),
  absence_from:            fmtDate(new Date().toISOString().slice(0, 10)),
  absence_to:              fmtDate(new Date(Date.now() + 2 * 86400_000).toISOString().slice(0, 10)),
  reason_short:            "Stomatološka intervencija",
  referred_to_specialist:  "Ortodont",
  clinic_name:             ORDINACIJA.naziv,
  clinic_address:          `${ORDINACIJA.adresa}, ${ORDINACIJA.grad}`,
  city:                    DOKTOR.city,
  document_date:           fmtDate(new Date().toISOString().slice(0, 10)),
  doctor_full_name:        DOKTOR.fullName,
  broj_dokumenta:          "DOC-2026-000001",
};

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

// ─── Component ────────────────────────────────────────────

interface Props {
  template: ClinicTemplate | null; // null = create mode
  onClose: () => void;
  onSaved: (updated: ClinicTemplate[]) => void;
}

export function TemplateEditorDrawer({ template, onClose, onSaved }: Props) {
  const isCreate = template === null;

  const [name, setName]               = useState(template?.name ?? "");
  const [category, setCategory]       = useState<TemplateCategory>(template?.category ?? "potvrde");
  const [docTitle, setDocTitle]       = useState(template?.docTitle ?? "");
  const [bodyTemplate, setBodyTemplate] = useState(template?.bodyTemplate ?? "");
  const [requiredFields, setRequiredFields] = useState<TemplateField[]>(template?.requiredFields ?? []);
  const [isActive, setIsActive]       = useState(template?.isActive ?? true);
  const [previewHtml, setPreviewHtml] = useState("");

  // Recompute preview whenever fields change
  useEffect(() => {
    const resolved = interpolateTemplate(bodyTemplate || "(telo teksta nije uneseno)", PREVIEW_CTX);
    const html = buildDocumentHtml({
      brojDokumenta: PREVIEW_CTX.broj_dokumenta,
      docTitle:       docTitle || "(naslov dokumenta)",
      bodyTextResolved: resolved,
      patient:        PREVIEW_PATIENT,
      datumDokumenta: new Date().toISOString().slice(0, 10),
    });
    setPreviewHtml(html);
  }, [bodyTemplate, docTitle]);

  function toggleField(f: TemplateField) {
    setRequiredFields(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f],
    );
  }

  function handleSave() {
    if (!name.trim() || !docTitle.trim() || !bodyTemplate.trim()) return;
    const now = new Date().toISOString();
    const saved: ClinicTemplate = {
      id:             template?.id ?? `tmpl_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      name:           name.trim(),
      category,
      docTitle:       docTitle.trim(),
      bodyTemplate:   bodyTemplate.trim(),
      requiredFields,
      isActive,
      createdAt:      template?.createdAt ?? now,
      updatedAt:      now,
    };
    const list = upsertTemplate(saved);
    onSaved(list);
    onClose();
  }

  const canSave = name.trim() && docTitle.trim() && bodyTemplate.trim();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.35)" }}
        onClick={onClose}
      />

      {/* Panel — wider to fit preview */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: "min(900px, 100vw)",
          background: "var(--v2-surface)",
          borderLeft: "1px solid var(--v2-border)",
          boxShadow: "-4px 0 32px rgba(0,0,0,0.14)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-shrink-0 px-[20px] py-[16px]"
          style={{ borderBottom: "1px solid var(--v2-border)" }}
        >
          <div className="flex items-center gap-[8px]">
            <FileStack style={{ width: "18px", height: "18px", color: "var(--v2-primary)" }} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--v2-text-heading)" }}>
              {isCreate ? "Novi šablon" : "Uredi šablon"}
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

        {/* Body: form + preview side by side */}
        <div className="flex-1 overflow-hidden flex min-h-0">

          {/* Left: form */}
          <div
            className="flex flex-col overflow-y-auto p-[20px] gap-[16px]"
            style={{ flex: "0 0 min(400px, 50%)", borderRight: "1px solid var(--v2-border)" }}
          >

            {/* Naziv */}
            <div>
              <label style={labelSt}>Naziv šablona *</label>
              <input
                type="text"
                placeholder="npr. Opravdanje za školu"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputSt}
              />
            </div>

            {/* Kategorija */}
            <div>
              <label style={labelSt}>Kategorija</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TemplateCategory)}
                style={inputSt}
              >
                {(Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Naslov dokumenta */}
            <div>
              <label style={labelSt}>Naslov dokumenta * <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(prikazuje se uppercase u dokumentu)</span></label>
              <input
                type="text"
                placeholder="npr. OPRAVDANJE ZA IZOSTANAK IZ ŠKOLE"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                style={inputSt}
              />
            </div>

            {/* Telo teksta */}
            <div>
              <label style={labelSt}>Telo teksta *</label>
              <textarea
                rows={8}
                placeholder="Unesite telo dokumenta. Koristite {placeholders} za dinamičke vrednosti."
                value={bodyTemplate}
                onChange={e => setBodyTemplate(e.target.value)}
                style={{ ...inputSt, resize: "vertical", lineHeight: 1.55 }}
              />
              {/* Placeholder cheat sheet */}
              <details style={{ marginTop: "6px" }}>
                <summary style={{ fontSize: "11px", color: "var(--v2-primary)", cursor: "pointer", userSelect: "none" }}>
                  Dostupni placeholders
                </summary>
                <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
                  {PLACEHOLDER_LIST.map(p => (
                    <code
                      key={p}
                      style={{
                        fontSize: "10px",
                        background: "var(--v2-primary-bg)",
                        color: "var(--v2-primary-dark)",
                        padding: "2px 5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        userSelect: "all",
                      }}
                      title="Klikni da kopirate"
                      onClick={() => navigator.clipboard?.writeText(p).catch(() => {})}
                    >
                      {p}
                    </code>
                  ))}
                </div>
              </details>
            </div>

            {/* Required fields */}
            <div>
              <label style={labelSt}>Polja šablona</label>
              <div className="flex flex-col gap-[8px]">
                {ALL_FIELDS.map(f => (
                  <label
                    key={f}
                    className="flex items-center gap-[8px] cursor-pointer"
                    style={{ fontSize: "13px", color: "var(--v2-text)" }}
                  >
                    <input
                      type="checkbox"
                      checked={requiredFields.includes(f)}
                      onChange={() => toggleField(f)}
                      style={{ width: "15px", height: "15px", accentColor: "var(--v2-primary)" }}
                    />
                    {FIELD_LABELS[f]}
                  </label>
                ))}
              </div>
            </div>

            {/* Aktivan toggle */}
            <div className="flex items-center justify-between">
              <label style={{ fontSize: "13px", color: "var(--v2-text)", fontWeight: 600 }}>
                Aktivan
              </label>
              <button
                onClick={() => setIsActive(a => !a)}
                style={{
                  width: "40px",
                  height: "22px",
                  borderRadius: "11px",
                  background: isActive ? "var(--v2-primary)" : "var(--v2-input-bg)",
                  border: "1px solid var(--v2-border)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute",
                  top: "2px",
                  left: isActive ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: isActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>

          </div>

          {/* Right: live preview */}
          <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[12px]">
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--v2-text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
              Pregled (mock podaci)
            </span>
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
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-[10px] flex-shrink-0 px-[20px] py-[14px]"
          style={{ borderTop: "1px solid var(--v2-border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-[8px] rounded-[8px] text-[13px] font-medium hover:opacity-70 transition-opacity"
            style={{ background: "var(--v2-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)", cursor: "pointer" }}
          >
            Otkaži
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-[8px] rounded-[8px] text-[13px] font-semibold hover:opacity-80 transition-opacity"
            style={{
              background: canSave ? "var(--v2-primary)" : "var(--v2-input-bg)",
              color: canSave ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
              border: "none",
              cursor: canSave ? "pointer" : "not-allowed",
            }}
          >
            Sačuvaj
          </button>
        </div>

      </div>
    </>
  );
}
