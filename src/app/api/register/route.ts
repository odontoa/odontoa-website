import { NextRequest, NextResponse } from 'next/server';
import { EmailService, OnboardingFormData } from '@/lib/email';
import {
  COUNTRIES,
  CURRENT_SYSTEMS,
  DAYS,
  PATIENT_VOLUMES,
  collectErrors,
  displayValue,
  formatCountry,
  formatCurrentSystems,
  groupHours,
  initialData,
  type CurrentSystem,
  type DayHours,
  type DayKey,
  type WizardData,
} from '@/components/register/wizard-data';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/* Telo dolazi sa klijenta, pa se svako polje svodi na poznat oblik pre
   validacije. Nepoznate vrednosti padaju na podrazumevane. */
function normalize(body: unknown): WizardData {
  const data = initialData();
  const raw = (body ?? {}) as Record<string, unknown>;

  const clinic = (raw.clinic ?? {}) as Record<string, unknown>;
  data.clinic.name = asString(clinic.name);
  data.clinic.street = asString(clinic.street);
  data.clinic.zip = asString(clinic.zip);
  data.clinic.city = asString(clinic.city);
  data.clinic.countryOther = asString(clinic.countryOther);
  const country = asString(clinic.country);
  if ((COUNTRIES as readonly string[]).includes(country)) {
    data.clinic.country = country as WizardData['clinic']['country'];
  }

  const hours = (raw.hours ?? {}) as Record<string, unknown>;
  for (const day of DAYS) {
    const value = (hours[day.key] ?? {}) as Record<string, unknown>;
    const from = asString(value.from);
    const to = asString(value.to);
    const target: DayHours = data.hours[day.key as DayKey];
    target.open = value.open === true;
    if (TIME_PATTERN.test(from)) target.from = from;
    if (TIME_PATTERN.test(to)) target.to = to;
  }

  const team = (raw.team ?? {}) as Record<string, unknown>;
  data.team.chairs = asString(team.chairs);
  data.team.members = asString(team.members);
  data.team.currentSystemOther = asString(team.currentSystemOther);
  const systems = Array.isArray(team.currentSystem) ? team.currentSystem : [];
  data.team.currentSystem = CURRENT_SYSTEMS.filter((system) =>
    systems.includes(system)
  ) as CurrentSystem[];
  const volume = asString(team.patientVolume);
  if ((PATIENT_VOLUMES as readonly string[]).includes(volume)) {
    data.team.patientVolume = volume as WizardData['team']['patientVolume'];
  }

  const user = (raw.user ?? {}) as Record<string, unknown>;
  data.user.firstName = asString(user.firstName);
  data.user.lastName = asString(user.lastName);
  data.user.email = asString(user.email);
  data.user.phone = asString(user.phone);
  data.user.source = asString(user.source);

  return data;
}

export async function POST(request: NextRequest) {
  try {
    /* Neispravan JSON je los zahtev, ne serverska greska. */
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Neispravan format podataka. Pokušajte ponovo.' },
        { status: 400 }
      );
    }

    const data = normalize(body);

    /* Ista validacija kao na klijentu, bez duplirane logike. */
    const errors = collectErrors(data);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const formData: OnboardingFormData = {
      clinicName: data.clinic.name.trim(),
      street: displayValue(data.clinic.street),
      zip: displayValue(data.clinic.zip),
      city: displayValue(data.clinic.city),
      country: formatCountry(data.clinic),
      hours: groupHours(data.hours),
      chairs: displayValue(data.team.chairs),
      members: displayValue(data.team.members),
      currentSystems: formatCurrentSystems(data.team),
      patientVolume: displayValue(data.team.patientVolume),
      firstName: data.user.firstName.trim(),
      lastName: data.user.lastName.trim(),
      email: data.user.email.trim(),
      phone: data.user.phone.trim(),
      source: displayValue(data.user.source),
    };

    await EmailService.sendOnboardingEmail(formData);

    return NextResponse.json(
      {
        message:
          'Prijava je poslata. Javljamo se u roku od jednog radnog dana.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Register form error:', error);

    if (
      error instanceof Error &&
      error.message.includes('Failed to send onboarding email')
    ) {
      return NextResponse.json(
        { error: 'Greška pri slanju prijave. Pokušajte ponovo kasnije.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Greška na serveru. Pokušajte ponovo kasnije.' },
      { status: 500 }
    );
  }
}
