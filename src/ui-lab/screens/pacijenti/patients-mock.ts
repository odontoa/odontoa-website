/**
 * Mock patients for V2 Pacijenti screen.
 * Shape aligned with legacy odontoa-application-frontend-main-for-components for easy backend wiring later.
 */

export interface MockPatient {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string; // ISO date (YYYY-MM-DD) — za prikaz u detaljima
  createdAt: string;
  doctorName: string;
  location: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] ?? "") + (parts[1][0] ?? "");
  }
  return name.slice(0, 2).toUpperCase() || "??";
}

const firstNames = [
  "Ana", "Marko", "Jelena", "Stefan", "Milica", "Nikola", "Ivana", "Petar",
  "Marija", "Aleksandar", "Tamara", "Dušan", "Katarina", "Luka", "Sandra",
  "Miloš", "Jovana", "Nemanja", "Teodora", "Vuk", "Sonja", "Filip",
];

const lastNames = [
  "Petrović", "Ilić", "Marković", "Jovanović", "Nikolić", "Đorđević", "Stojanović",
  "Kostić", "Popović", "Milošević", "Simić", "Pavlović", "Stefanović", "Todorović",
];

const doctors = [
  "Dr Marko Marković", "Dr Ana Petrović", "Dr Stefan Jovanović", "Dr Jelena Nikolić",
  "Dr Nikola Ilić", "Dr Milica Đorđević",
];

const locations = [
  "Beograd", "Novi Sad", "Niš", "Subotica", "Kragujevac", "Čačak", "Pančevo",
  "Smederevo", "Valjevo", "Zrenjanin", "Kruševac", "Šabac",
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomDate(): string {
  const start = new Date(2023, 0, 1).getTime();
  const end = Date.now();
  const ts = start + Math.random() * (end - start);
  return new Date(ts).toISOString().slice(0, 10);
}

function randomBirthDate(): string {
  // 1950–2005
  const year = 1950 + Math.floor(Math.random() * 56);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generatePatients(count: number): MockPatient[] {
  const seen = new Set<string>();
  const result: MockPatient[] = [];

  for (let i = 1; i <= count; i++) {
    let fullName: string;
    do {
      fullName = `${random(firstNames)} ${random(lastNames)}`;
    } while (seen.has(fullName));
    seen.add(fullName);

    const fn = fullName.split(" ")[0]!.toLowerCase();
    const ln = fullName.split(" ")[1]!.toLowerCase();
    const email = `${fn}.${ln}${i}@example.rs`;

    result.push({
      id: 1000 + i,
      fullName,
      phone: `+381 6${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
      email,
      dateOfBirth: randomBirthDate(),
      createdAt: randomDate(),
      doctorName: random(doctors),
      location: random(locations),
    });
  }

  return result;
}

export const mockPatients = generatePatients(30);

export function getInitials(p: MockPatient): string {
  return initials(p.fullName);
}
