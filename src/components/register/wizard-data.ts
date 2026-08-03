/* Podaci, tipovi i validacija onboarding wizarda. Bez JSX, bez zavisnosti.
   Formateri su deljeni sa API rutom i mejlom, pa su cista funkcija podataka. */

export const COUNTRY_OTHER = 'Druga';

export const COUNTRIES = [
  'Srbija',
  'Bosna i Hercegovina',
  'Crna Gora',
  'Hrvatska',
  COUNTRY_OTHER,
] as const;
export type Country = (typeof COUNTRIES)[number];

export const COUNTRY_LABELS: Record<Country, string> = {
  Srbija: 'Srbija',
  'Bosna i Hercegovina': 'Bosna i Hercegovina',
  'Crna Gora': 'Crna Gora',
  Hrvatska: 'Hrvatska',
  Druga: 'Druga (unesi ručno)',
};

/* Za "Druga" nema pretpostavljenog prefiksa, korisnik kuca ceo broj. */
export const DIAL_CODES: Record<Country, string> = {
  Srbija: '+381',
  'Bosna i Hercegovina': '+387',
  'Crna Gora': '+382',
  Hrvatska: '+385',
  Druga: '',
};

const KNOWN_DIAL_CODES = Object.values(DIAL_CODES).filter(Boolean);

export const CURRENT_SYSTEMS = ['Papir', 'Excel', 'Drugi softver'] as const;
export type CurrentSystem = (typeof CURRENT_SYSTEMS)[number];

export const OTHER_SOFTWARE: CurrentSystem = 'Drugi softver';

export const PATIENT_VOLUMES = [
  'do 200',
  '200-500',
  '500-1000',
  'preko 1000',
] as const;
export type PatientVolume = (typeof PATIENT_VOLUMES)[number] | '';

export type DayKey = 'pon' | 'uto' | 'sre' | 'cet' | 'pet' | 'sub' | 'ned';

export const DAYS: {
  key: DayKey;
  label: string;
  short: string;
  workday: boolean;
}[] = [
  { key: 'pon', label: 'Ponedeljak', short: 'Pon', workday: true },
  { key: 'uto', label: 'Utorak', short: 'Uto', workday: true },
  { key: 'sre', label: 'Sreda', short: 'Sre', workday: true },
  { key: 'cet', label: 'Četvrtak', short: 'Čet', workday: true },
  { key: 'pet', label: 'Petak', short: 'Pet', workday: true },
  { key: 'sub', label: 'Subota', short: 'Sub', workday: false },
  { key: 'ned', label: 'Nedelja', short: 'Ned', workday: false },
];

export interface DayHours {
  open: boolean;
  from: string;
  to: string;
}

export interface ClinicData {
  name: string;
  street: string;
  zip: string;
  city: string;
  country: Country;
  countryOther: string;
}

export interface TeamData {
  chairs: string;
  members: string;
  currentSystem: CurrentSystem[];
  currentSystemOther: string;
  patientVolume: PatientVolume;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
}

export interface WizardData {
  clinic: ClinicData;
  hours: Record<DayKey, DayHours>;
  team: TeamData;
  user: UserData;
}

/* Pon-Pet rade 08:00-17:00; Sub i Ned ne rade, ali cuvaju vremena
   da se pojave kada se dan ukljuci. */
function initialHours(): Record<DayKey, DayHours> {
  const hours = {} as Record<DayKey, DayHours>;
  for (const day of DAYS) {
    hours[day.key] = { open: day.workday, from: '08:00', to: '17:00' };
  }
  return hours;
}

export function initialData(): WizardData {
  return {
    clinic: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: 'Srbija',
      countryOther: '',
    },
    hours: initialHours(),
    team: {
      chairs: '',
      members: '',
      currentSystem: [],
      currentSystemOther: '',
      patientVolume: '',
    },
    user: {
      firstName: '',
      lastName: '',
      email: '',
      phone: DIAL_CODES.Srbija,
      source: '',
    },
  };
}

/* ── Telefon i pozivni broj ── */

/* Netaknut telefon je prazan ili tacno jednak nekom poznatom prefiksu. */
export function isPhoneUntouched(phone: string): boolean {
  const trimmed = phone.trim();
  return trimmed === '' || KNOWN_DIAL_CODES.includes(trimmed);
}

/* Prefiks se menja samo ako korisnik nije kucao cifre preko golog prefiksa. */
export function phoneForCountry(country: Country, phone: string): string {
  return isPhoneUntouched(phone) ? DIAL_CODES[country] : phone;
}

/* ── Validacija ── */

/* Isti regex kao u API rutama (src/app/api/demo/route.ts), da se klijent
   i server ponasaju isto. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Prefiks +381 nosi 3 cifre, pa 9 znaci najmanje 6 cifara pored prefiksa. */
const MIN_PHONE_DIGITS = 9;

export type Errors = Record<string, string>;

export function collectErrors(data: WizardData): Errors {
  const errors: Errors = {};

  if (!data.clinic.name.trim()) {
    errors['clinic.name'] = 'Naziv ordinacije je obavezan.';
  }

  for (const day of DAYS) {
    const hours = data.hours[day.key];
    if (hours.open && !(hours.from < hours.to)) {
      errors[`hours.${day.key}`] = 'Vreme "od" mora biti pre vremena "do".';
    }
  }

  if (!data.user.firstName.trim()) {
    errors['user.firstName'] = 'Ime je obavezno.';
  }
  if (!data.user.lastName.trim()) {
    errors['user.lastName'] = 'Prezime je obavezno.';
  }
  if (!data.user.email.trim()) {
    errors['user.email'] = 'Email je obavezan.';
  } else if (!EMAIL_REGEX.test(data.user.email.trim())) {
    errors['user.email'] = 'Neispravan format email adrese.';
  }
  const phoneDigits = data.user.phone.replace(/\D/g, '');
  if (!phoneDigits) {
    errors['user.phone'] = 'Telefon je obavezan.';
  } else if (phoneDigits.length < MIN_PHONE_DIGITS) {
    errors['user.phone'] = 'Unesite ceo broj telefona, najmanje 9 cifara.';
  }

  return errors;
}

export function hasErrorsWithPrefix(errors: Errors, prefix: string): boolean {
  return Object.keys(errors).some((key) => key.startsWith(prefix));
}

/* ── Formateri za Proveru i mejl ── */

export const NOT_ENTERED = 'nije uneto';

export function displayValue(value: string): string {
  const trimmed = value.trim();
  return trimmed ? trimmed : NOT_ENTERED;
}

/* Drzava bez adrese, jer "Druga" bez unetog naziva daje "nije uneto". */
export function formatCountry(clinic: ClinicData): string {
  if (clinic.country === COUNTRY_OTHER) {
    return displayValue(clinic.countryOther);
  }
  return clinic.country;
}

export function formatAddress(clinic: ClinicData): string {
  const parts = [
    clinic.street.trim(),
    [clinic.zip.trim(), clinic.city.trim()].filter(Boolean).join(' '),
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : NOT_ENTERED;
}

export function formatDayHours(hours: DayHours): string {
  return hours.open ? `${hours.from} - ${hours.to}` : 'ne radi';
}

/* Uzastopni dani sa istim vrednostima se spajaju u opseg, pa se radno
   vreme svede na 1-3 reda umesto 7. Neradni dani se spajaju bez obzira
   na sacuvana vremena, jer se ona ne prikazuju. */
export function groupHours(
  hours: Record<DayKey, DayHours>
): { label: string; value: string }[] {
  const groups: { label: string; value: string }[] = [];
  let startIndex = 0;

  const keyOf = (day: DayHours) =>
    day.open ? `open|${day.from}|${day.to}` : 'closed';

  for (let i = 0; i < DAYS.length; i += 1) {
    const current = hours[DAYS[i].key];
    const next = i + 1 < DAYS.length ? hours[DAYS[i + 1].key] : null;

    if (next && keyOf(current) === keyOf(next)) continue;

    const first = DAYS[startIndex].short;
    const last = DAYS[i].short;
    groups.push({
      label: startIndex === i ? first : `${first}-${last}`,
      value: current.open ? `${current.from}-${current.to}` : 'ne radi',
    });
    startIndex = i + 1;
  }

  return groups;
}

export function formatHoursSummary(hours: Record<DayKey, DayHours>): string {
  return groupHours(hours)
    .map((group) => `${group.label} ${group.value}`)
    .join(' · ');
}

/* Kanonski redosled iz CURRENT_SYSTEMS, da izlaz ne zavisi od
   redosleda klikanja. */
export function formatCurrentSystems(team: TeamData): string {
  const selected = CURRENT_SYSTEMS.filter((system) =>
    team.currentSystem.includes(system)
  );
  if (!selected.length) return NOT_ENTERED;

  const other = team.currentSystemOther.trim();
  return selected
    .map((system) =>
      system === OTHER_SOFTWARE && other ? `${OTHER_SOFTWARE} (${other})` : system
    )
    .join(', ');
}
