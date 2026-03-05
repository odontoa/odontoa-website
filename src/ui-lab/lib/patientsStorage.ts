// localStorage CRUD for patients.
// Key: odontoa_v2_patients
// Counter: odontoa_v2_patient_counter (for MDF-P### codes)
// TODO: replace localStorage calls with API service (same function signatures)

export interface Patient {
  id: string;
  patientCode: string; // e.g. "MDF-P001"
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string; // ISO YYYY-MM-DD
  createdAt: string; // ISO YYYY-MM-DD
  doctorName: string;
  location: string;
}

const STORAGE_KEY = "odontoa_v2_patients";
const COUNTER_KEY = "odontoa_v2_patient_counter";

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `pat_${crypto.randomUUID()}`;
  }
  return `pat_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readCounter(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(COUNTER_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function writeCounter(n: number): void {
  try {
    localStorage.setItem(COUNTER_KEY, String(n));
  } catch {
    // ignore quota errors
  }
}

/** Generate next patient code and increment counter. Call only on create. */
export function generatePatientCode(): string {
  const next = readCounter() + 1;
  writeCounter(next);
  return `MDF-P${next.toString().padStart(3, "0")}`;
}

// ─── Seed data (deterministic, ~15 patients) ─────────────

const SEED_PATIENTS: Patient[] = [
  { id: "pat_s01", patientCode: "MDF-P001", fullName: "Ana Petrović", phone: "+381 64 123 456", email: "ana.petrovic@example.rs", dateOfBirth: "1990-03-15", createdAt: "2024-06-10", doctorName: "Dr Marko Marković", location: "Beograd" },
  { id: "pat_s02", patientCode: "MDF-P002", fullName: "Marko Ilić", phone: "+381 63 234 567", email: "marko.ilic@example.rs", dateOfBirth: "1985-07-22", createdAt: "2024-07-01", doctorName: "Dr Ana Petrović", location: "Novi Sad" },
  { id: "pat_s03", patientCode: "MDF-P003", fullName: "Jelena Jovanović", phone: "+381 65 345 678", email: "jelena.jovanovic@example.rs", dateOfBirth: "1978-11-03", createdAt: "2024-08-15", doctorName: "Dr Stefan Jovanović", location: "Niš" },
  { id: "pat_s04", patientCode: "MDF-P004", fullName: "Stefan Nikolić", phone: "+381 66 456 789", email: "stefan.nikolic@example.rs", dateOfBirth: "1995-01-28", createdAt: "2024-09-05", doctorName: "Dr Jelena Nikolić", location: "Beograd" },
  { id: "pat_s05", patientCode: "MDF-P005", fullName: "Milica Đorđević", phone: "+381 62 567 890", email: "milica.djordjevic@example.rs", dateOfBirth: "1982-05-14", createdAt: "2024-10-20", doctorName: "Dr Nikola Ilić", location: "Subotica" },
  { id: "pat_s06", patientCode: "MDF-P006", fullName: "Nikola Stojanović", phone: "+381 69 678 901", email: "nikola.stojanovic@example.rs", dateOfBirth: "1973-09-08", createdAt: "2024-11-12", doctorName: "Dr Milica Đorđević", location: "Kragujevac" },
  { id: "pat_s07", patientCode: "MDF-P007", fullName: "Ivana Kostić", phone: "+381 64 789 012", email: "ivana.kostic@example.rs", dateOfBirth: "1998-12-01", createdAt: "2025-01-08", doctorName: "Dr Marko Marković", location: "Čačak" },
  { id: "pat_s08", patientCode: "MDF-P008", fullName: "Petar Popović", phone: "+381 63 890 123", email: "petar.popovic@example.rs", dateOfBirth: "1988-04-19", createdAt: "2025-02-14", doctorName: "Dr Ana Petrović", location: "Pančevo" },
  { id: "pat_s09", patientCode: "MDF-P009", fullName: "Marija Milošević", phone: "+381 65 901 234", email: "marija.milosevic@example.rs", dateOfBirth: "1992-08-30", createdAt: "2025-03-01", doctorName: "Dr Stefan Jovanović", location: "Beograd" },
  { id: "pat_s10", patientCode: "MDF-P010", fullName: "Aleksandar Simić", phone: "+381 66 012 345", email: "aleksandar.simic@example.rs", dateOfBirth: "1970-02-11", createdAt: "2025-04-22", doctorName: "Dr Jelena Nikolić", location: "Smederevo" },
  { id: "pat_s11", patientCode: "MDF-P011", fullName: "Tamara Pavlović", phone: "+381 62 123 890", email: "tamara.pavlovic@example.rs", dateOfBirth: "2001-06-25", createdAt: "2025-05-10", doctorName: "Dr Nikola Ilić", location: "Valjevo" },
  { id: "pat_s12", patientCode: "MDF-P012", fullName: "Dušan Stefanović", phone: "+381 69 234 901", email: "dusan.stefanovic@example.rs", dateOfBirth: "1980-10-07", createdAt: "2025-06-18", doctorName: "Dr Milica Đorđević", location: "Zrenjanin" },
  { id: "pat_s13", patientCode: "MDF-P013", fullName: "Katarina Todorović", phone: "+381 64 345 012", email: "katarina.todorovic@example.rs", dateOfBirth: "1996-03-12", createdAt: "2025-08-05", doctorName: "Dr Marko Marković", location: "Kruševac" },
  { id: "pat_s14", patientCode: "MDF-P014", fullName: "Luka Marković", phone: "+381 63 456 123", email: "luka.markovic@example.rs", dateOfBirth: "1987-07-29", createdAt: "2025-10-15", doctorName: "Dr Ana Petrović", location: "Šabac" },
  { id: "pat_s15", patientCode: "MDF-P015", fullName: "Sandra Kostić", phone: "+381 65 567 234", email: "sandra.kostic@example.rs", dateOfBirth: "1993-11-18", createdAt: "2025-12-01", doctorName: "Dr Stefan Jovanović", location: "Novi Sad" },
];

// ─── CRUD ─────────────────────────────────────────────────

export function getPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Patient[];
    // First run: seed
    savePatients(SEED_PATIENTS);
    writeCounter(SEED_PATIENTS.length);
    return SEED_PATIENTS;
  } catch {
    return SEED_PATIENTS;
  }
}

export function savePatients(list: Patient[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

export function getPatientById(id: string | number): Patient | undefined {
  return getPatients().find((p) => String(p.id) === String(id));
}

export function upsertPatient(patient: Patient): Patient[] {
  const list = getPatients();
  const idx = list.findIndex((p) => p.id === patient.id);
  const next = idx >= 0
    ? list.map((p, i) => (i === idx ? patient : p))
    : [...list, patient];
  savePatients(next);
  return next;
}

export function deletePatient(id: string): Patient[] {
  const next = getPatients().filter((p) => p.id !== id);
  savePatients(next);
  return next;
}

/** Create a new blank patient scaffold (for the drawer). */
export function createNewPatient(): Patient {
  return {
    id: genId(),
    patientCode: generatePatientCode(),
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    createdAt: new Date().toISOString().split("T")[0],
    doctorName: "",
    location: "",
  };
}

/** Initials from full name (e.g. "Ana Petrović" → "AP") */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "??";
}
