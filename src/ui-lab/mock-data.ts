import {
  UserPlus,
  CalendarClock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

// ─── Korisnik ────────────────────────────────────────────
export const mockUser = {
  firstName: "Marko",
  lastName: "Marković",
  email: "marko@odontoa.com",
  initials: "MM",
};

// ─── Dashboard: statistike ───────────────────────────────
export const mockMetrics = {
  totalPatients: 452,
  todayAppointments: 18,
  activeDentists: 6,
};

// ─── Dashboard: brze akcije ──────────────────────────────
export const mockQuickActions = [
  {
    title: "Novi pacijent",
    description: "Dodaj novog pacijenta u sistem",
    href: "/ui-lab/patients",
  },
  {
    title: "Zakaži termin",
    description: "Kreiraj novi termin za pacijenta",
    href: "/ui-lab/appointments",
  },
  {
    title: "Pacijenti",
    description: "Pregledaj sve pacijente",
    href: "/ui-lab/patients",
  },
];

// ─── Dashboard: DonutChart podatci ───────────────────────
export const mockAppointmentStatus = [
  { label: "Zakazani", value: 10, color: "#2563eb" },
  { label: "Završeni", value: 5, color: "#22c55e" },
  { label: "Otkazani", value: 3, color: "#ef4444" },
];

// ─── Dashboard: BarChart podatci ─────────────────────────
export const mockWeeklyAppointments = [
  { label: "Ponedeljak", value: 14 },
  { label: "Utorak", value: 18 },
  { label: "Sreda", value: 16 },
  { label: "Četvrtak", value: 20 },
  { label: "Petak", value: 12 },
];

// ─── Dashboard: današnji termini ─────────────────────────
export const mockTodayAppointments = [
  { time: "09:00", patient: "Ana Petrović", procedure: "Preventivni pregled" },
  { time: "10:30", patient: "Marko Ilić", procedure: "Plomba" },
  { time: "12:00", patient: "Jelena Marković", procedure: "Kontrola" },
  { time: "14:15", patient: "Stefan Jovanović", procedure: "Konsultacija" },
  { time: "16:00", patient: "Milica Nikolić", procedure: "Čišćenje kamenca" },
];

// ─── Dashboard: nedavna aktivnost ────────────────────────
export const mockRecentActivity = [
  {
    icon: UserPlus,
    text: "Novi pacijent dodat: Ivana Petrović",
    color: "text-blue-600",
  },
  {
    icon: CalendarClock,
    text: "Termin pomeren: Marko Ilić (10:30 → 11:00)",
    color: "text-blue-600",
  },
  {
    icon: CheckCircle2,
    text: "Završen pregled: Ana Petrović",
    color: "text-emerald-600",
  },
  {
    icon: MessageSquare,
    text: "Poslat SMS podsetnik: Jelena Marković",
    color: "text-blue-600",
  },
];

// ─── Pacijenti: lista ────────────────────────────────────
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  initials: string;
  phone: string;
  email: string;
  location: string;
  dateOfBirth: string;
  age: number;
}

export const mockPatientsList: Patient[] = [
  {
    id: 1,
    firstName: "Ana",
    lastName: "Petrović",
    initials: "AP",
    phone: "+381 64 123 4567",
    email: "ana.petrovic@gmail.com",
    location: "Beograd",
    dateOfBirth: "15.03.1990",
    age: 35,
  },
  {
    id: 2,
    firstName: "Marko",
    lastName: "Ilić",
    initials: "MI",
    phone: "+381 63 234 5678",
    email: "marko.ilic@gmail.com",
    location: "Novi Sad",
    dateOfBirth: "22.07.1985",
    age: 40,
  },
  {
    id: 3,
    firstName: "Jelena",
    lastName: "Marković",
    initials: "JM",
    phone: "+381 65 345 6789",
    email: "jelena.m@gmail.com",
    location: "Beograd",
    dateOfBirth: "08.11.1992",
    age: 33,
  },
  {
    id: 4,
    firstName: "Stefan",
    lastName: "Jovanović",
    initials: "SJ",
    phone: "+381 66 456 7890",
    email: "stefan.j@gmail.com",
    location: "Niš",
    dateOfBirth: "30.01.1988",
    age: 38,
  },
  {
    id: 5,
    firstName: "Milica",
    lastName: "Nikolić",
    initials: "MN",
    phone: "+381 64 567 8901",
    email: "milica.n@gmail.com",
    location: "Beograd",
    dateOfBirth: "12.06.1995",
    age: 30,
  },
  {
    id: 6,
    firstName: "Nikola",
    lastName: "Đorđević",
    initials: "NĐ",
    phone: "+381 63 678 9012",
    email: "nikola.dj@gmail.com",
    location: "Kragujevac",
    dateOfBirth: "25.09.1982",
    age: 43,
  },
  {
    id: 7,
    firstName: "Ivana",
    lastName: "Stojanović",
    initials: "IS",
    phone: "+381 65 789 0123",
    email: "ivana.s@gmail.com",
    location: "Beograd",
    dateOfBirth: "03.04.1997",
    age: 28,
  },
  {
    id: 8,
    firstName: "Dragan",
    lastName: "Simić",
    initials: "DS",
    phone: "+381 66 890 1234",
    email: "dragan.s@gmail.com",
    location: "Subotica",
    dateOfBirth: "17.12.1978",
    age: 47,
  },
  {
    id: 9,
    firstName: "Maja",
    lastName: "Pavlović",
    initials: "MP",
    phone: "+381 64 901 2345",
    email: "maja.p@gmail.com",
    location: "Beograd",
    dateOfBirth: "28.08.1993",
    age: 32,
  },
  {
    id: 10,
    firstName: "Aleksandar",
    lastName: "Popović",
    initials: "AP",
    phone: "+381 63 012 3456",
    email: "aleksandar.p@gmail.com",
    location: "Novi Sad",
    dateOfBirth: "05.02.1986",
    age: 40,
  },
];

// ─── Pacijent detalj: mock terapije ─────────────────────
export const mockTherapies = [
  {
    date: "25.02.2026",
    procedure: "Preventivni pregled",
    dentist: "Dr Marko Marković",
    status: "completed" as const,
    notes: "Sve u redu, kontrola za 6 meseci",
  },
  {
    date: "10.01.2026",
    procedure: "Čišćenje kamenca",
    dentist: "Dr Jelena Savić",
    status: "completed" as const,
    notes: "Uklonjen kamenac, preporuka za redovno čišćenje",
  },
  {
    date: "15.03.2026",
    procedure: "Plomba — zub 36",
    dentist: "Dr Marko Marković",
    status: "scheduled" as const,
    notes: "",
  },
];

// ─── Pacijent detalj: mock zakazani termini ─────────────
export const mockUpcomingAppointments = [
  {
    date: "15.03.2026",
    time: "10:00",
    procedure: "Plomba — zub 36",
    dentist: "Dr Marko Marković",
  },
  {
    date: "20.04.2026",
    time: "09:30",
    procedure: "Kontrolni pregled",
    dentist: "Dr Jelena Savić",
  },
];

// ─── V2 Figma Dashboard ──────────────────────────────────
// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146

export const mockV2Stats = [
  { label: "Ukupno termina danas", value: "18", icon: "calendar" },
  { label: "Ukupan broj pacijenata", value: "452", icon: "stethoscope" },
  { label: "Dostupni doktori", value: "6", icon: "pill" },
  { label: "To be added", value: "—", icon: "dollar" },
];

export const mockV2TaskChips = [
  { count: 5, label: "Novi termini pacijenata" },
  { count: 7, label: "Kontrolne konsultacije" },
  { count: 4, label: "Pregled izveštaja o napretku terapije" },
];

export const mockV2EarningStats = [
  { month: "Jan", profit: 600, expenses: 400 },
  { month: "Feb", profit: 900, expenses: 500 },
  { month: "Mar", profit: 800, expenses: 600 },
  { month: "Apr", profit: 1100, expenses: 700 },
  { month: "Maj", profit: 950, expenses: 750 },
  { month: "Jun", profit: 1580, expenses: 900 },
  { month: "Jul", profit: 1300, expenses: 850 },
  { month: "Avg", profit: 1600, expenses: 950 },
  { month: "Sep", profit: 1400, expenses: 800 },
  { month: "Okt", profit: 1700, expenses: 1000 },
  { month: "Nov", profit: 1500, expenses: 900 },
  { month: "Dec", profit: 1900, expenses: 1100 },
];

export const mockV2AgeStages = [
  { day: "Pon", children: 20, teens: 35, adults: 45 },
  { day: "Uto", children: 25, teens: 40, adults: 50 },
  { day: "Sre", children: 38, teens: 56, adults: 17 },
  { day: "Čet", children: 30, teens: 45, adults: 55 },
  { day: "Pet", children: 22, teens: 38, adults: 48 },
  { day: "Sub", children: 15, teens: 30, adults: 40 },
  { day: "Ned", children: 10, teens: 20, adults: 35 },
];

export const mockV2GenderStats = [
  { day: "Pon", male: 900, female: 850 },
  { day: "Uto", male: 1184, female: 1230 },
  { day: "Sre", male: 1184, female: 1230 },
  { day: "Čet", male: 1050, female: 980 },
  { day: "Pet", male: 900, female: 870 },
  { day: "Sub", male: 750, female: 700 },
  { day: "Ned", male: 600, female: 580 },
];

export const mockV2ConsultationTypes = [
  { label: "Poremećaji raspoloženja", value: 6999, color: "#2a2c4c", percentage: "40%" },
  { label: "Anksiozni poremećaji", value: 4900, color: "#9281ff", percentage: "28%" },
  { label: "Poremećaj ličnosti", value: 3150, color: "#e4e8ff", percentage: "18%" },
  { label: "Psihotični poremećaji", value: 2449, color: "#b6b6b8", percentage: "14%" },
];

export const mockV2DoctorsList = [
  { name: "Dr Marko Marković", specialty: "Klinički psiholog", status: "Available", initials: "MM" },
  { name: "Dr Jelena Stevanović", specialty: "Psihijatar", status: "Full Booked", initials: "JS" },
  { name: "Dr Nikola Blagojević", specialty: "Dečji psiholog", status: "On Duty", initials: "NB" },
  { name: "Dr Ana Ognjenović", specialty: "Kognitivno-bihevioralni terapeut", status: "Absent", initials: "AO" },
  { name: "Dr Stefan Petrović", specialty: "Porodični terapeut", status: "Available", initials: "SP" },
  { name: "Dr Laura Mitrović", specialty: "Psihoterapeut", status: "Available", initials: "LM" },
];

export const mockV2CounsellingList = [
  { id: "MDF-P006", date: "20.09.2028", time: "09:00", name: "Ana Ristić", doctor: "Dr Marko Marković", appointFor: "Upravljanje anksioznošću", report: "Individualno savetovanje", status: "Confirmed" },
  { id: "MDF-P005", date: "20.09.2028", time: "11:00", name: "Marko Davidović", doctor: "Dr Jelena Stevanović", appointFor: "Lečenje depresije", report: "Psihijatrijsko savetovanje", status: "Ongoing" },
  { id: "MDF-P004", date: "20.09.2028", time: "13:00", name: "Stefan Jovičić", doctor: "Dr Nikola Blagojević", appointFor: "Problemi u ponašanju dece", report: "Porodično savetovanje", status: "Ongoing" },
  { id: "MDF-P003", date: "20.09.2028", time: "14:30", name: "Jelena Brajović", doctor: "Dr Ana Ognjenović", appointFor: "Kognitivno-bihevioralna terapija", report: "Individualno savetovanje", status: "Cancelled" },
  { id: "MDF-P002", date: "21.09.2028", time: "15:00", name: "Milica Stojanović", doctor: "Dr Stefan Petrović", appointFor: "Bračno savetovanje", report: "Savetovanje parova", status: "Confirmed" },
  { id: "MDF-P001", date: "21.09.2028", time: "10:30", name: "Nikola Simić", doctor: "Dr Laura Mitrović", appointFor: "Upravljanje stresom", report: "Grupno savetovanje", status: "Pending" },
];

export const mockV2RecentActivity = [
  { time: "10:30", text: "Termin Milice Stojanović sa Dr Stefanom Petrovićem potvrđen od strane administratora." },
  { time: "10:10", text: "Termin Jelene Brajović sa Dr Anom Ognjenović otkazan." },
  { time: "09:45", text: "Status savetovanja za Marka Davidovića označen kao 'U toku' od strane Dr Jelene Stevanović." },
  { time: "09:30", text: "Kreiran novi profil pacijenta za Anu Ristić." },
  { time: "09:15", text: "Dr Marko Marković ažurirao raspored termina." },
];

// ─── Helpers ─────────────────────────────────────────────
export const formatCurrency = (amount: number, currency: string): string => {
  if (currency === "RSD") {
    return `${amount.toLocaleString("sr-RS", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} RSD`;
  }
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
};
