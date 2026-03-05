# UI Lab V2 — Dev Handoff

> **Scope:** `src/ui-lab/` and `src/app/(v2)/ui-lab/` only. No production app code was changed.
> **Persistence:** All data is stored in `localStorage` (browser-only). No backend yet.
> **Rule:** Whenever data models, persistence layer, or backend service shape changes, update both this file and `README.md` in the same PR.

---

## Data Models

### `Patient` — `src/ui-lab/lib/patientsStorage.ts`
```ts
interface Patient {
  id: string;               // e.g. "pat_<uuid>"
  patientCode: string;      // e.g. "MDF-P001" — displayed in UI header
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;      // ISO YYYY-MM-DD
  createdAt: string;        // ISO YYYY-MM-DD
  doctorName: string;
  location: string;
}
```

### `Predracun` (Invoice) — `src/ui-lab/screens/finansije/shared.tsx`
```ts
interface Predracun {
  id: string;
  brojPredracuna?: string;  // auto-generated e.g. "28170/2026"
  pacijent: string;         // patient full name (free text, no FK yet)
  datum: string;            // ISO YYYY-MM-DD
  status: "draft" | "final" | "storniran";
  stavke: PredracunStavka[];
  popust?: PredracunPopust;
  napomena?: string;
}

interface PredracunStavka {
  id: string;
  naziv: string;
  kolicina: number;
  cena: number;             // RSD, per unit
  poZubu?: boolean;
  brojZuba?: number;
}
```

### `ClinicTemplate` — `src/ui-lab/types/dokumenti.ts`
```ts
interface ClinicTemplate {
  id: string;               // "tmpl_<uuid>"
  name: string;
  category: "opravdanja" | "potvrde" | "uputi" | "ostalo";
  docTitle: string;
  bodyTemplate: string;     // with {placeholder} variables
  requiredFields: TemplateField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### `Appointment` — `src/lib/ui-lab/types.ts`
See file for full interface. Key fields: `id`, `patientName`, `status`, `startTime`, `endTime`, `chair`, `seriesId?`.

---

## localStorage Keys

| Key | Module | Description | Seed |
|-----|--------|-------------|------|
| `odontoa_v2_patients` | Patients | Patient list | 15 patients |
| `odontoa_v2_patient_counter` | Patients | Auto-increment for MDF-P### codes | Set to 15 on first seed |
| `uiLabProformas` | Predračun | Invoice list | 7 invoices |
| `uiLabPredracunCounter` | Predračun | Invoice number sequence | Auto |
| `odontoa_v2_clinic_templates` | Templates | User-created doc templates | 2 templates |
| `odontoa_v2_appointments` | Calendar | All appointments | 23 appointments |
| `odontoa_v2_series` | Calendar | Recurring series | — |
| `odontoa_v2_dokumenti_{patientId}` | Patient docs | Saved generated documents per patient | — |
| `odontoa_v2_therapies` | Cenovnik | Therapy price list | 88+ therapies |
| `odontoa_v2_technicians` | Tehnika | Lab/tech entries | 3 labs |
| `odontoa_v2_clinic_profile` | Ordinacija | Clinic info (name, PIB, etc.) | Defaults |

---

## Screen CRUD Status

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Pacijenti (list) | `/ui-lab/pacijenti` | **Full CRUD** | Create/edit via PatientDrawer; delete via ConfirmDialog; loads from storage |
| Pacijenti (detalji) | `/ui-lab/pacijenti/[id]` | **Full CRUD** | Edit/delete from detail view; data from storage; medical conditions are in-memory only |
| Predračun | `/ui-lab/finansije/predracun` | **Full CRUD** | Create/edit/status transitions + delete drafts (new) |
| Šabloni dokumenata | `/ui-lab/ordinacija/sabloni` | **Full CRUD** | Create/edit/delete/duplicate templates |
| Termini (calendar) | `/ui-lab/figma-dashboard/calendar` | **Full CRUD** | Appointments + recurrence series |
| Terapije (cenovnik) | `/ui-lab/ordinacija/cenovnik` | **Read + framework** | Load/save ready; edit UI incomplete |
| Tehničari | `/ui-lab/ordinacija/tehnika` | **Read + framework** | Load/save ready; edit UI incomplete |
| Podaci ordinacije | `/ui-lab/ordinacija/podaci` | **Read only** | Static config, no edit persistence |
| Uplate | `/ui-lab/finansije/uplate` | **UI-only** | Types defined, seed visible, no CRUD wired |
| Tehnika finansije | `/ui-lab/finansije/tehnika` | **UI-only** | Types defined, seed visible, no CRUD wired |
| Izveštaji | `/ui-lab/finansije/izvestaji` | **Placeholder** | Empty screen |

---

## What Is Still Mock-Only

The following data on the patient details screen is **hardcoded mock** (not persisted):

- **Naredni termini** — deterministic variants from `mock.ts` (index based on patient ID)
- **Istorija tretmana** — deterministic variants from `mock.ts`
- **Medicinsko stanje** — in-memory only (changes lost on refresh); picked from predefined list
- **Zdravstveni izveštaji** — hardcoded titles from `MOCK_HEALTH_REPORTS`
- **Istorija lekova** — hardcoded from `MOCK_MEDICATIONS`
- **Beleške pacijenta** — hardcoded from `MOCK_NOTES`
- **Aktivni dolasci chart** — hardcoded from `MOCK_VISITS_CHART_ALL`

When the real backend is ready, these will be fetched by `patientId` from the API.

---

## Backend TODO Checklist

When integrating the real backend (Sanity / REST API / Supabase), replace the following:

### Patients
- [ ] Replace `getPatients()` in `patientsStorage.ts` with `GET /api/patients`
- [ ] Replace `upsertPatient()` with `POST /api/patients` (create) and `PATCH /api/patients/:id` (update)
- [ ] Replace `deletePatient()` with `DELETE /api/patients/:id`
- [ ] Wire `PatientTableRow` link to real patient detail route (currently uses localStorage `id` as URL param)
- [ ] Add proper patient search/filter server-side
- [ ] Add pagination server-side (currently client-side)
- [ ] Seed data in `patientsStorage.ts` can be removed once backend is live

### Predračun
- [ ] Replace `useProformas()` hook in `finansije/shared.tsx` with API calls
- [ ] `brojPredracuna` sequence should be generated server-side (currently localStorage counter)
- [ ] `pacijent` field is currently free text — link to real Patient FK
- [ ] Add invoice PDF generation endpoint

### Šabloni dokumenata
- [ ] Replace `templatesStorage.ts` functions with API calls (same function signatures)
- [ ] `SYSTEM_TEMPLATES` (in `buildDocument.ts`) can stay client-side or move to CMS (Sanity)
- [ ] `SavedDokument` snapshots (per-patient localStorage) → move to backend storage

### Calendar / Appointments
- [ ] Replace `AppointmentsProvider` context state with API-backed hooks
- [ ] `odontoa_v2_appointments` → backend table
- [ ] `odontoa_v2_series` → backend recurrence model

### Clinic Settings
- [ ] `clinic-store.ts` (`loadTherapies`, `saveTechnicians`) → API calls
- [ ] `clinic-profile-store.ts` → API call / CMS (Sanity)
- [ ] `clinicConfig.ts` (ORDINACIJA, DOKTOR) → CMS / env vars

---

## Shared Utilities to Keep

These are client-side utilities that stay the same regardless of backend:

- `src/ui-lab/lib/buildDocument.ts` — HTML generation for documents
- `src/lib/ui-lab/recurrence-utils.ts` — Recurrence calculation helpers
- `src/ui-lab/types/dokumenti.ts` — Document type definitions
- `src/ui-lab/components/ui/ConfirmDialog.tsx` — Shared confirm modal
