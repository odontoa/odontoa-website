// localStorage CRUD for clinic-managed document templates.
// Key: odontoa_v2_clinic_templates
// System templates (SYSTEM_TEMPLATES) are never stored here — they live in buildDocument.ts.

import type { ClinicTemplate, TemplateField } from "@/ui-lab/types/dokumenti";

const STORAGE_KEY = "odontoa_v2_clinic_templates";

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `tmpl_${crypto.randomUUID()}`;
  }
  return `tmpl_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const SEED_TEMPLATES: ClinicTemplate[] = [
  {
    id: "tmpl_seed_opravdanje_skola",
    name: "Opravdanje — škola (moj šablon)",
    category: "opravdanja",
    docTitle: "OPRAVDANJE ZA IZOSTANAK IZ ŠKOLE",
    bodyTemplate:
      `Potvrđuje se da je pacijent/pacijentkinja {patient_full_name} (datum rođenja: {patient_dob}), ` +
      `dana {visit_date} obavio/la stomatološki pregled/intervenciju u ordinaciji {clinic_name}.\n\n` +
      `Zbog zdravstvenih razloga pacijentu/pacijentkinji se opravdava izostanak iz škole ` +
      `u periodu od {absence_from} do {absence_to}.\n` +
      `Razlog (kratko): {reason_short}.\n\n` +
      `U {city}, dana {document_date}.\n` +
      `Doktor: {doctor_full_name}`,
    requiredFields: ["period", "razlog"] as TemplateField[],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tmpl_seed_potvrda_posao",
    name: "Potvrda — posao (kratko)",
    category: "potvrde",
    docTitle: "POTVRDA ZA POSAO — IZOSTANAK SA POSLA",
    bodyTemplate:
      `Potvrđuje se da je zaposleni/a {patient_full_name} (datum rođenja: {patient_dob}) dana {visit_date} ` +
      `obavio/la stomatološki pregled/intervenciju u ordinaciji {clinic_name}.\n\n` +
      `Preporučuje se izostanak sa posla u periodu od {absence_from} do {absence_to}, ` +
      `zbog zdravstvenih razloga.\n` +
      `Razlog (kratko): {reason_short}.\n\n` +
      `U {city}, dana {document_date}.\n` +
      `Doktor: {doctor_full_name}`,
    requiredFields: ["period", "razlog"] as TemplateField[],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getClinicTemplates(): ClinicTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ClinicTemplate[];
    // First run: seed
    saveClinicTemplates(SEED_TEMPLATES);
    return SEED_TEMPLATES;
  } catch {
    return SEED_TEMPLATES;
  }
}

export function saveClinicTemplates(list: ClinicTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

export function upsertTemplate(t: ClinicTemplate): ClinicTemplate[] {
  const list = getClinicTemplates();
  const idx = list.findIndex(x => x.id === t.id);
  const next = idx >= 0
    ? list.map((x, i) => (i === idx ? t : x))
    : [...list, t];
  saveClinicTemplates(next);
  return next;
}

export function deleteTemplate(id: string): ClinicTemplate[] {
  const next = getClinicTemplates().filter(x => x.id !== id);
  saveClinicTemplates(next);
  return next;
}

export function duplicateTemplate(id: string): ClinicTemplate {
  const list = getClinicTemplates();
  const src = list.find(x => x.id === id);
  if (!src) throw new Error(`Template ${id} not found`);
  const now = new Date().toISOString();
  const copy: ClinicTemplate = {
    ...src,
    id: genId(),
    name: `${src.name} (kopija)`,
    createdAt: now,
    updatedAt: now,
  };
  saveClinicTemplates([...list, copy]);
  return copy;
}

export function toggleTemplateActive(id: string): ClinicTemplate[] {
  const next = getClinicTemplates().map(x =>
    x.id === id
      ? { ...x, isActive: !x.isActive, updatedAt: new Date().toISOString() }
      : x,
  );
  saveClinicTemplates(next);
  return next;
}

/** Creates a new blank template scaffold ready for the editor */
export function createNewTemplate(): ClinicTemplate {
  const now = new Date().toISOString();
  return {
    id: genId(),
    name: "",
    category: "potvrde",
    docTitle: "",
    bodyTemplate: "",
    requiredFields: [],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}
