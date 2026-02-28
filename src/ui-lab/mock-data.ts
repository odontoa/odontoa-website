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
  { label: "Total Appointments", value: "120", icon: "calendar" },
  { label: "Available Doctors", value: "15", icon: "stethoscope" },
  { label: "Total Medicine", value: "56", icon: "pill" },
  { label: "Total Earnings", value: "$34,500", icon: "dollar" },
];

export const mockV2TaskChips = [
  { count: 5, label: "New Patient Appointments" },
  { count: 7, label: "Follow-up Consultations" },
  { count: 4, label: "Review Therapy Progress Reports" },
];

export const mockV2EarningStats = [
  { month: "Jan", profit: 600, expenses: 400 },
  { month: "Feb", profit: 900, expenses: 500 },
  { month: "Mar", profit: 800, expenses: 600 },
  { month: "Apr", profit: 1100, expenses: 700 },
  { month: "May", profit: 950, expenses: 750 },
  { month: "Jun", profit: 1580, expenses: 900 },
  { month: "Jul", profit: 1300, expenses: 850 },
  { month: "Aug", profit: 1600, expenses: 950 },
  { month: "Sep", profit: 1400, expenses: 800 },
  { month: "Oct", profit: 1700, expenses: 1000 },
  { month: "Nov", profit: 1500, expenses: 900 },
  { month: "Dec", profit: 1900, expenses: 1100 },
];

export const mockV2AgeStages = [
  { day: "Mon", children: 20, teens: 35, adults: 45 },
  { day: "Tue", children: 25, teens: 40, adults: 50 },
  { day: "Wed", children: 38, teens: 56, adults: 17 },
  { day: "Thu", children: 30, teens: 45, adults: 55 },
  { day: "Fri", children: 22, teens: 38, adults: 48 },
  { day: "Sat", children: 15, teens: 30, adults: 40 },
  { day: "Sun", children: 10, teens: 20, adults: 35 },
];

export const mockV2GenderStats = [
  { day: "Mon", male: 900, female: 850 },
  { day: "Tue", male: 1184, female: 1230 },
  { day: "Wed", male: 1184, female: 1230 },
  { day: "Thu", male: 1050, female: 980 },
  { day: "Fri", male: 900, female: 870 },
  { day: "Sat", male: 750, female: 700 },
  { day: "Sun", male: 600, female: 580 },
];

export const mockV2ConsultationTypes = [
  { label: "Mood Disorders",       value: 6999, color: "#2a2c4c", percentage: "40%" },
  { label: "Anxiety Disorders",    value: 4900, color: "#9281ff", percentage: "28%" },
  { label: "Personality Disorder", value: 3150, color: "#e4e8ff", percentage: "18%" },
  { label: "Psychotic Disorders",  value: 2449, color: "#b6b6b8", percentage: "14%" },
];

export const mockV2DoctorsList = [
  { name: "Dr. Paul Carter", specialty: "Clinical Psychologist", status: "Available", initials: "PC" },
  { name: "Dr. Bella Stevens", specialty: "Psychiatrist", status: "Full Booked", initials: "BS" },
  { name: "Dr. Laurent Blake", specialty: "Child Psychologist", status: "On Duty", initials: "LB" },
  { name: "Dr. Gemma O'Connor", specialty: "Cognitive Behavioral Therapist", status: "Absent", initials: "GO" },
  { name: "Dr. Tyson Ford", specialty: "Marriage & Family Therapist", status: "Available", initials: "TF" },
];

export const mockV2CounsellingList = [
  { id: "MDF-P006", date: "2028-09-20", time: "09:00", name: "Amanda Richards", doctor: "Dr. Paul Carter", appointFor: "Anxiety Management", report: "Individual Counseling", status: "Confirmed" },
  { id: "MDF-P005", date: "2028-09-20", time: "11:00", name: "John Davidson", doctor: "Dr. Bella Stevens", appointFor: "Depression Treatment", report: "Psychiatric Counseling", status: "Ongoing" },
  { id: "MDF-P004", date: "2028-09-20", time: "01:00", name: "Michael Lee", doctor: "Dr. Laurent Blake", appointFor: "Child Behavioral Issues", report: "Family Counseling", status: "Ongoing" },
  { id: "MDF-P003", date: "2028-09-20", time: "02:30", name: "Samantha Brown", doctor: "Dr. Gemma O'Connor", appointFor: "Cognitive Behavioral Therapy", report: "Individual Counseling", status: "Cancelled" },
  { id: "MDF-P002", date: "2028-09-21", time: "03:00", name: "Emily Stone", doctor: "Dr. Tyson Ford", appointFor: "Marriage Counseling", report: "Couples Counseling", status: "Confirmed" },
  { id: "MDF-P001", date: "2028-09-21", time: "10:30", name: "Robert Smith", doctor: "Dr. Laura Mitchell", appointFor: "Stress Management", report: "Group Counseling", status: "Pending" },
];

export const mockV2RecentActivity = [
  { time: "10:30 AM", text: "Emily Stone's appointment with Dr. Tyson Ford confirmed by admin." },
  { time: "10:10 AM", text: "Samantha Brown's appointment with Dr. Gemma O'Connor was cancelled." },
  { time: "09:45 AM", text: "Counselling session status for John Davidson marked as 'Ongoing' by Dr. Bella Stevens." },
  { time: "09:30 AM", text: "New patient profile created for Amanda Richards." },
  { time: "09:15 AM", text: "Milla Willow updated the schedule for Dr. Paul Carter's appointments." },
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
