// Shared document builder — used by DokumentiDrawer (patient view) and TemplateEditorDrawer (preview).
// Extracts buildDocumentHtml + interpolation from the original DokumentiDrawer implementation.

import { ORDINACIJA, DOKTOR } from "@/ui-lab/config/clinicConfig";
import type { SystemTemplate, TemplateField } from "@/ui-lab/types/dokumenti";

// ─── Date helpers ─────────────────────────────────────────

/** YYYY-MM-DD → DD.MM.YYYY. */
export function fmtDate(iso: string): string {
  if (!iso) return "–";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}.${parts[1]}.${parts[0]}.`;
}

// ─── Document counter (clinic-wide yearly) ────────────────

const counterKey = (year: number) => `odontoa_v2_doc_counter_${year}`;

/** Reads next number without incrementing — safe for live preview. */
export function peekNextDocNumber(year?: number): string {
  if (typeof window === "undefined") return "DOC-????-??????";
  const y = year ?? new Date().getFullYear();
  const current = parseInt(localStorage.getItem(counterKey(y)) ?? "0", 10);
  return `DOC-${y}-${String(current + 1).padStart(6, "0")}`;
}

/** Increments and returns the new document number. Call on Sačuvaj only. */
export function consumeNextDocNumber(year?: number): string {
  const y = year ?? new Date().getFullYear();
  const key = counterKey(y);
  const current = parseInt(localStorage.getItem(key) ?? "0", 10);
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return `DOC-${y}-${String(next).padStart(6, "0")}`;
}

// ─── Template interpolation ───────────────────────────────

export interface TemplateContext {
  patient_full_name: string;
  patient_dob: string;
  visit_date: string;
  absence_from: string;
  absence_to: string;
  reason_short: string;
  referred_to_specialist: string;
  clinic_name: string;
  clinic_address: string;
  city: string;
  document_date: string;
  doctor_full_name: string;
  broj_dokumenta: string;
}

/** Replaces {placeholder} tokens. Missing keys fall back to "" — never "undefined". */
export function interpolateTemplate(tmpl: string, ctx: TemplateContext): string {
  return tmpl.replace(/\{(\w+)\}/g, (_, key) => {
    const val = (ctx as unknown as Record<string, string>)[key];
    return val !== undefined && val !== null ? val : "";
  });
}

// ─── HTML builder ─────────────────────────────────────────

export interface BuildDocArgs {
  ordinacija?: typeof ORDINACIJA;
  doktor?: typeof DOKTOR;
  brojDokumenta: string;
  docTitle: string;
  bodyTextResolved: string;
  patient: { fullName: string; dateOfBirth: string };
  datumDokumenta: string;
}

/**
 * Returns an HTML fragment used for both:
 *  - in-app preview: <div dangerouslySetInnerHTML={{ __html: html }} />
 *  - print: window.open() popup
 */
export function buildDocumentHtml({
  ordinacija = ORDINACIJA,
  doktor = DOKTOR,
  brojDokumenta,
  docTitle,
  bodyTextResolved,
  patient,
  datumDokumenta,
}: BuildDocArgs): string {
  const bodyHtml = bodyTextResolved
    .split("\n")
    .map(line =>
      line.trim()
        ? `<p style="margin:0 0 5px 0;font-size:11px;color:#111;line-height:1.55">${line}</p>`
        : `<p style="margin:0 0 10px 0">&nbsp;</p>`,
    )
    .join("");

  return `
<div style="font-family:inherit;font-size:11px;color:#111;line-height:1.5">

  <!-- Header grid: left = logo + clinic, right = meta -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;margin-bottom:14px">
    <div>
      <div style="width:56px;height:56px;border:2px solid #ccc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;margin-bottom:8px;text-align:center;line-height:1.3">
        Logo<br/>ordinacije
      </div>
      <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:3px">${ordinacija.naziv}</div>
      <div style="font-size:10.5px;color:#333">${ordinacija.adresa}</div>
      <div style="font-size:10.5px;color:#333">${ordinacija.grad}</div>
      <div style="font-size:10.5px;color:#333">Tel: ${ordinacija.telefon}</div>
    </div>
    <div style="text-align:right;font-size:10.5px;color:#333">
      <div><span style="color:#888;font-size:9.5px">Matični br.: </span>${ordinacija.maticniBroj}</div>
      <div><span style="color:#888;font-size:9.5px">PIB: </span>${ordinacija.pib}</div>
      <div style="margin-top:8px"><span style="color:#888;font-size:9.5px">Br. dokumenta: </span>${brojDokumenta}</div>
      <div><span style="color:#888;font-size:9.5px">Datum: </span>${fmtDate(datumDokumenta)}</div>
    </div>
  </div>

  <!-- Document title -->
  <div style="font-size:14px;font-weight:700;letter-spacing:0.3px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #111;text-transform:uppercase">
    ${docTitle}
  </div>

  <!-- Patient info block -->
  <div style="border:1px solid #ccc;border-radius:4px;padding:7px 10px;margin-bottom:12px">
    <div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#555;margin-bottom:3px">Pacijent</div>
    <strong style="font-size:11px">${patient.fullName}</strong>
    <span style="color:#555;font-size:10.5px"> · Datum rođenja: ${fmtDate(patient.dateOfBirth)}</span>
  </div>

  <!-- Body text -->
  ${bodyHtml}

  <!-- Signature / stamp -->
  <div style="margin-top:32px;display:flex;justify-content:flex-end">
    <div style="text-align:center;min-width:160px;border-top:1px solid #111;padding-top:6px;font-size:10px;color:#333">
      Pečat i potpis
    </div>
  </div>

</div>`;
}

// ─── System templates ─────────────────────────────────────

export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  {
    id: "system-opravdanje-skola",
    source: "system",
    name: "Opravdanje za izostanak iz škole",
    category: "opravdanja",
    docTitle: "OPRAVDANJE ZA IZOSTANAK IZ ŠKOLE",
    requiredFields: ["period", "razlog"] as TemplateField[],
    bodyTemplate:
      `Potvrđuje se da je pacijent/pacijentkinja {patient_full_name} (datum rođenja: {patient_dob}), ` +
      `dana {visit_date} obavio/la stomatološki pregled/intervenciju u ordinaciji {clinic_name}.\n\n` +
      `Zbog zdravstvenih razloga pacijentu/pacijentkinji se opravdava izostanak iz škole ` +
      `u periodu od {absence_from} do {absence_to}.\n` +
      `Razlog (kratko): {reason_short}.\n\n` +
      `U {city}, dana {document_date}.\n` +
      `Doktor: {doctor_full_name}`,
  },
  {
    id: "system-potvrda-skola",
    source: "system",
    name: "Potvrda o dolasku (škola)",
    category: "potvrde",
    docTitle: "POTVRDA O DOLASKU KOD DOKTORA",
    requiredFields: [] as TemplateField[],
    bodyTemplate:
      `Potvrđuje se da je {patient_full_name} (datum rođenja: {patient_dob}) dana {visit_date} bio/la na ` +
      `stomatološkom pregledu u ordinaciji {clinic_name}, {clinic_address}.\n\n` +
      `U {city}, dana {document_date}.\n` +
      `Doktor: {doctor_full_name}`,
  },
  {
    id: "system-potvrda-posao",
    source: "system",
    name: "Potvrda za posao (izostanak sa posla)",
    category: "potvrde",
    docTitle: "POTVRDA ZA POSAO — IZOSTANAK SA POSLA",
    requiredFields: ["period", "razlog"] as TemplateField[],
    bodyTemplate:
      `Potvrđuje se da je zaposleni/a {patient_full_name} (datum rođenja: {patient_dob}) dana {visit_date} ` +
      `obavio/la stomatološki pregled/intervenciju u ordinaciji {clinic_name}.\n\n` +
      `Preporučuje se izostanak sa posla u periodu od {absence_from} do {absence_to}, ` +
      `zbog zdravstvenih razloga.\n` +
      `Razlog (kratko): {reason_short}.\n\n` +
      `U {city}, dana {document_date}.\n` +
      `Doktor: {doctor_full_name}`,
  },
  {
    id: "system-uput",
    source: "system",
    name: "Uput za specijalistu",
    category: "uputi",
    docTitle: "UPUT ZA SPECIJALISTU",
    requiredFields: ["specijalista", "razlog"] as TemplateField[],
    bodyTemplate:
      `Upućuje se pacijent/pacijentkinja {patient_full_name} (datum rođenja: {patient_dob}) na ` +
      `pregled/konsultaciju kod: {referred_to_specialist}.\n\n` +
      `Razlog upućivanja: {reason_short}.\n` +
      `Datum pregleda u našoj ordinaciji: {visit_date}.\n` +
      `Ordinacija: {clinic_name}, {clinic_address}.\n\n` +
      `U {city}, dana {document_date}.\n` +
      `Doktor: {doctor_full_name}`,
  },
];
