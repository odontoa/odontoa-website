// Shared types for document templates and saved patient documents.
// Clinic templates are stored in localStorage; system templates are code constants.

export type TemplateCategory = "opravdanja" | "potvrde" | "uputi" | "ostalo";
export type TemplateField = "razlog" | "period" | "specijalista" | "svrhaPosete" | "napomena";

/** User-created clinic templates only — never system templates */
export interface ClinicTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  docTitle: string;
  bodyTemplate: string;       // contains {placeholders}
  requiredFields: TemplateField[];
  isActive: boolean;
  updatedAt: string;          // ISO
  createdAt: string;          // ISO
}

/** System (built-in) templates — source field prevents them being stored in clinic localStorage.
 *  Inherits all fields from ClinicTemplate including requiredFields, docTitle, bodyTemplate.
 *  isActive/updatedAt/createdAt are omitted (system templates are always active, no timestamps). */
export interface SystemTemplate extends Omit<ClinicTemplate, "isActive" | "updatedAt" | "createdAt"> {
  source: "system";
}

/** Union for rendering: either kind drives conditional fields + docTitle */
export type AnyTemplate = ClinicTemplate | SystemTemplate;

/** User-entered form values only — no template metadata (that lives in SavedDokument) */
export interface DokumentForm {
  datumPosete: string;
  datumDokumenta: string;
  abFrom: string;
  abTo: string;
  razlog: string;
  specijalist: string;
}

export interface SavedDokument {
  id: string;
  patientId: string;
  createdAt: string;
  brojDokumenta: string;
  templateId: string;
  templateSource: "system" | "clinic";
  templateName: string;
  form: DokumentForm;
  resolvedHtml: string;       // snapshot — immutable after save
}
