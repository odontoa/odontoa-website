// Pacijenti Detalji — mock data (card rows, termini, tretmani, itd.)
// Pacijent se učitava iz liste (mockPatients) preko getPatientById — spremno za bazu

import { mockPatients } from "@/ui-lab/screens/pacijenti/patients-mock";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0]![0] ?? "") + (parts[1]![0] ?? "");
  return name.slice(0, 2).toUpperCase() || "??";
}

export interface PatientForDetails {
  id: number;
  fullName: string;
  initials: string;
  dateOfBirth: string;
  email: string;
  contactPhone: string;
}

// Naredni termini — varijante po pacijentu (stomatologija/ortodontija)
const UPCOMING_VARIANTS = [
  [
    { type: "Ortodontska kontrola", session: "Kontrola fiksnog aparata i zamena ligatura", doctor: "Dr. Marko Marković", datetime: "25.09.2025, 10:00" },
    { type: "Preventiva", session: "Profesionalno čišćenje zuba i poliranje", doctor: "Dr. Ana Petrović", datetime: "01.10.2025, 11:30" },
    { type: "Konzervativna", session: "Ispuna karijesa, donji desni kutnjak", doctor: "Dr. Stefan Jovanović", datetime: "05.10.2025, 09:00" },
  ],
  [
    { type: "Oralna hirurgija", session: "Vađenje umnjaka, donja leva strana", doctor: "Dr. Nikola Ilić", datetime: "28.09.2025, 14:00" },
    { type: "Ortodontska kontrola", session: "Kontrola mobilnog aparata", doctor: "Dr. Marko Marković", datetime: "03.10.2025, 09:30" },
    { type: "Preventiva", session: "Redovni stomatološki pregled", doctor: "Dr. Milica Đorđević", datetime: "08.10.2025, 11:00" },
  ],
  [
{ type: "Ortodontija", session: "Postavljanje ekspandera, prva faza", doctor: "Dr. Marko Marković", datetime: "30.09.2025, 10:00" },
  { type: "Endodoncija", session: "Lečenje kanala, gornji desni premolar", doctor: "Dr. Stefan Jovanović", datetime: "04.10.2025, 15:00" },
    { type: "Ortodontska kontrola", session: "Zamena elastika i provera napretka", doctor: "Dr. Ana Petrović", datetime: "10.10.2025, 10:30" },
  ],
];

// Istorija tretmana — varijante po pacijentu (stomatologija/ortodontija)
const TREATMENTS_VARIANTS = [
  [
    { title: "Zamena ligatura na fiksnom aparatu", date: "15.07.2025, 09:00", category: "Ortodontija", status: "completed" as const },
    { title: "Profesionalno čišćenje zuba", date: "10.08.2025, 10:30", category: "Preventiva", status: "completed" as const },
    { title: "Kontrola ortodontskog tretmana", date: "05.09.2025, 11:00", category: "Ortodontija", status: "completed" as const },
    { title: "Ponovna kontrola, otpuštanje aparata", date: "15.09.2025, 14:00", category: "Ortodontija", status: "retreatment" as const },
  ],
  [
{ title: "Vađenje zuba, donji desni kutnjak", date: "12.06.2025, 10:00", category: "Oralna hirurgija", status: "completed" as const },
  { title: "Ispuna karijesa, gornji levi premolar", date: "20.07.2025, 11:30", category: "Konzervativna", status: "completed" as const },
    { title: "Profesionalno čišćenje i fluorizacija", date: "08.08.2025, 09:00", category: "Preventiva", status: "completed" as const },
    { title: "Kontrola rane posle ekstrakcije", date: "18.06.2025, 14:00", category: "Oralna hirurgija", status: "retreatment" as const },
  ],
  [
    { title: "Postavljanje fiksnog ortodontskog aparata", date: "01.05.2025, 10:00", category: "Ortodontija", status: "completed" as const },
    { title: "Lečenje kanala, donji desni molar", date: "15.06.2025, 11:00", category: "Endodoncija", status: "completed" as const },
{ title: "Zamena ligatura, druga faza", date: "20.08.2025, 09:30", category: "Ortodontija", status: "completed" as const },
  { title: "Hitna intervencija, lom zuba", date: "10.09.2025, 16:00", category: "Konzervativna", status: "retreatment" as const },
  ],
];

export function getUpcomingForPatient(patientId: string | number) {
  const idx = Number(patientId) % UPCOMING_VARIANTS.length;
  return UPCOMING_VARIANTS[idx] ?? UPCOMING_VARIANTS[0];
}

export function getTreatmentsForPatient(patientId: string | number) {
  const idx = Number(patientId) % TREATMENTS_VARIANTS.length;
  return TREATMENTS_VARIANTS[idx] ?? TREATMENTS_VARIANTS[0];
}

// Za backward compatibility — koristi prvu varijantu
export const MOCK_UPCOMING = UPCOMING_VARIANTS[0]!;
export const MOCK_TREATMENTS = TREATMENTS_VARIANTS[0]!;

// Medicinsko stanje - predefinisana lista stanja za stomatologiju
export const MEDICAL_CONDITIONS = [
  "Epilepsija",
  "Povišen krvni pritisak",
  "Hemofilija",
  "Trombocitopenija",
  "Leukemija",
  "Prekomerno zgrušavanje krvi",
  "Bronhijalna astma",
  "Čir na želucu",
  "Čir na dvanaestopalačnom crevu",
  "Dijabetes",
  "Adisonova bolest",
  "Hipertireoza",
  "Hipotireoza",
  "Sida",
  "Hepatitis",
  "Alergija na penicilin",
  "Alergija na latex",
  "Alergija na anesteziju",
  "Srčane bolesti",
  "Bubrežne bolesti",
  "Jetrene bolesti",
  "Respiratorne bolesti",
  "Neurološke bolesti",
  "Psihijatrijske bolesti",
  "Trudnoća",
  "Dojenje",
  "Antikoagulantna terapija",
  "Kortikosteroidna terapija",
  "Kemoterapija",
  "Radioterapija",
  "Transplantacija organa",
  "Imunosupresivna terapija",
] as const;

// Dummy stanja po pacijentu (indeks u MEDICAL_CONDITIONS)
const PATIENT_CONDITIONS_VARIANTS: number[][] = [
  [1, 9, 18],
  [2, 15, 16],
  [0, 10, 19],
];

export function getMedicalConditionsForPatient(patientId: string | number): string[] {
  const idx = Number(patientId) % PATIENT_CONDITIONS_VARIANTS.length;
  const indices = PATIENT_CONDITIONS_VARIANTS[idx] ?? PATIENT_CONDITIONS_VARIANTS[0]!;
  return indices.map((i) => MEDICAL_CONDITIONS[i] ?? "").filter(Boolean);
}

// Dnevne aktivnosti (Daily Activities)
export const MOCK_ACTIVITIES = [
  { label: "Jutarnja šetnja", done: false },
  { label: "Meditacijska sesija", done: true },
  { label: "Posao (8 sati)", done: true },
  { label: "Druženje s prijateljima", done: true },
  { label: "Večernji odmor (čitanje, muzika)", done: true },
  { label: "Porodično vreme", done: true },
];

// Zdravstveni izveštaji (Health Reports — PDF files)
export const MOCK_HEALTH_REPORTS = [
  { title: "Izveštaj o krvnom pritisku (jul 2024.)" },
  { title: "Procena mentalnog zdravlja (avgust 2024.)" },
  { title: "Studija spavanja (septembar 2024.)" },
];

// Istorija lekova (Medicine History)
export const MOCK_MEDICATIONS = [
  { date: "15.09.2025, 14:30", name: "Diazepam", status: "stop" as const },
  { date: "01.10.2025, 09:00", name: "Fluoksetin", status: "active" as const },
  { date: "15.10.2025, 14:00", name: "Lorazepam", status: "active" as const },
  { date: "01.11.2025, 10:30", name: "Escitalopram", status: "active" as const },
];

// Beleške pacijenta (Patient Notes)
export const MOCK_NOTES = [
  { date: "25.09.2025, 10:00", title: "Izveštaj o napretku", text: "Pacijent pokazuje napredak u upravljanju stresom, ali povremeno ima teškoće." },
  { date: "25.09.2025, 11:00", title: "Prilagođavanje terapije", text: "Prešlo sa Lorazepama na Fluoksetin radi ublažavanja simptoma anksioznosti." },
  { date: "15.09.2025, 14:00", title: "Nivoi stresa", text: "Zabeleženi povećani nivoi stresa zbog problema na poslu." },
  { date: "15.09.2025, 13:30", title: "Problemi sa spavanjem", text: "Izveštava o poteškoćama sa spavanjem tokom poslednjih nekoliko nedelja." },
];

// Aktivni dolasci pacijenta — svi podaci (od najstarijeg ka najnovijem)
export const MOCK_VISITS_CHART_ALL = [
  { month: "Jan", count: 2 },
  { month: "Feb", count: 3 },
  { month: "Mar", count: 4 },
  { month: "Apr", count: 3 },
  { month: "Maj", count: 5 },
  { month: "Jun", count: 3 },
  { month: "Jul", count: 5 },
  { month: "Avg", count: 4 },
  { month: "Sep", count: 6 },
  { month: "Okt", count: 4 },
  { month: "Nov", count: 5 },
  { month: "Dec", count: 4 },
];

export type VisitsPeriod = "1" | "6" | "12" | "all";

export const VISITS_PERIOD_LABELS: Record<VisitsPeriod, string> = {
  "1": "Poslednji mesec",
  "6": "Poslednjih 6",
  "12": "Poslednjih 12",
  all: "Oduvek",
};

export function getVisitsForPeriod(period: VisitsPeriod) {
  const all = MOCK_VISITS_CHART_ALL;
  const n = all.length;
  if (period === "all") return all;
  const take = period === "1" ? 1 : period === "6" ? 6 : 12;
  return all.slice(-take);
}

export function getPatientById(id: string | number): PatientForDetails | undefined {
  // U produkciji: fetch iz baze po id
  const p = mockPatients.find((x) => String(x.id) === String(id));
  if (!p) return undefined;
  return {
    id: p.id,
    fullName: p.fullName,
    initials: initials(p.fullName),
    dateOfBirth: p.dateOfBirth,
    email: p.email,
    contactPhone: p.phone,
  };
}
