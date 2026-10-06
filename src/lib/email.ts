import { Resend } from 'resend';
import { SITE_URL } from '@/lib/config/site-url';

/* Klijent se pravi lenjo: modul se importuje i u rutama koje se build-uju bez
   env-a, pa konstrukcija na nivou modula ruši build kad ključ nije postavljen. */
let client: Resend | null = null;

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('Resend API key not configured');
  }
  if (!client) {
    client = new Resend(key);
  }
  return client;
}

/* Pošiljalac mora biti na domenu verifikovanom u Resend-u (odontoa.info). */
function getFrom(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error('Resend sender address not configured');
  }
  return from;
}

/* Interni primaoci obaveštenja o formama. Env je lista razdvojena zarezom;
   fallback je stanje pre migracije, da forme rade i ako varijabla izostane. */
const DEFAULT_INTERNAL_RECIPIENTS = [
  'info@odontoa.info',
  'ognjen.drinic31@gmail.com',
];

function getInternalRecipients(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL;
  if (!raw) return DEFAULT_INTERNAL_RECIPIENTS;
  const list = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_INTERNAL_RECIPIENTS;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  clinic: string;
  subject: string;
  message: string;
}

export interface DemoFormData {
  name: string;
  email: string;
  phone: string;
}

export interface QuizResultCategory {
  id: string;
  label: string;
  percent: number;
}

export interface OnboardingHoursRow {
  label: string;
  value: string;
}

/* Sve vrednosti dolaze iz API rute vec razresene (drzava iz countryOther,
   sazete grupe radnog vremena, multiselect spojen), pa ovaj sloj samo
   escapuje i renderuje. */
export interface OnboardingFormData {
  clinicName: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  hours: OnboardingHoursRow[];
  chairs: string;
  members: string;
  currentSystems: string;
  patientVolume: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
}

export interface QuizResultEmailData {
  email: string;
  totalScore: number;
  band: string;
  bandLabel: string;
  profile: string;
  profileLabel: string;
  categories: QuizResultCategory[];
  weakestCategories: string[];
}

/* Korisnicki unos ide u HTML telo mejla, pa se escapuje. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Subject nije HTML, ali novi red u njemu je header injection. */
function sanitizeSubject(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/* Isti razlog za replyTo: adresa dolazi iz forme i završava u zaglavlju. */
function sanitizeAddress(value: string): string | undefined {
  const clean = value.replace(/[\r\n]+/g, '').trim();
  return clean.length > 0 ? clean : undefined;
}

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  bcc?: string | string[];
  replyTo?: string;
}

/* Resend ne baca na odbijenu poruku nego vraca { data, error }, pa se greska
   ovde pretvara u izuzetak sa prefiksom koji rute vec prepoznaju. */
async function send(args: SendArgs, failureLabel: string): Promise<void> {
  const { error } = await getClient().emails.send({
    from: getFrom(),
    to: args.to,
    subject: args.subject,
    html: args.html,
    ...(args.bcc ? { bcc: args.bcc } : {}),
    ...(args.replyTo ? { replyTo: args.replyTo } : {}),
  });

  if (error) {
    /* Bez tela poruke u logu: sadrzi licne podatke iz forme. */
    console.error(`${failureLabel}:`, error.name, error.message);
    throw new Error(`${failureLabel}: ${error.message}`);
  }
}

export class EmailService {
  /**
   * Send email for contact form submissions
   */
  static async sendContactFormEmail(data: ContactFormData): Promise<void> {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nova kontakt forma - Odontoa
          </h2>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Detalji forme:</h3>
            <p><strong>Tip forme:</strong> Kontakt forma</p>
            <p><strong>Ime i prezime:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
            <p><strong>Naziv ordinacije:</strong> ${escapeHtml(data.clinic)}</p>
            <p><strong>Predmet:</strong> ${escapeHtml(data.subject)}</p>
            <p><strong>Poruka:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
              ${escapeHtml(data.message).replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Ova poruka je automatski generisana sa Odontoa web sajta.
            </p>
          </div>
        </div>
      `;

    await send(
      {
        to: getInternalRecipients(),
        subject: sanitizeSubject(`Nova kontakt forma - ${data.subject}`),
        html,
        replyTo: sanitizeAddress(data.email),
      },
      'Failed to send contact form email'
    );
  }

  /**
   * Send email for demo form submissions
   */
  static async sendDemoFormEmail(data: DemoFormData): Promise<void> {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Novi zahtev za demo - Odontoa
          </h2>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Detalji forme:</h3>
            <p><strong>Tip forme:</strong> Demo forma</p>
            <p><strong>Ime i prezime:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
          </div>

          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Ova poruka je automatski generisana sa Odontoa web sajta.
            </p>
          </div>
        </div>
      `;

    await send(
      {
        to: getInternalRecipients(),
        subject: 'Novi zahtev za demo - Odontoa',
        html,
        replyTo: sanitizeAddress(data.email),
      },
      'Failed to send demo form email'
    );
  }

  /**
   * Send a copy of the digital readiness quiz result to the user's email.
   */
  static async sendQuizResultEmail(data: QuizResultEmailData): Promise<void> {
    const categoryRows = data.categories
      .map(
        (c) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e9ebf1; color: #363d4f;">${escapeHtml(
              c.label
            )}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e9ebf1; color: #060b13; font-weight: 600; text-align: right;">${
              c.percent
            }%</td>
          </tr>
        `
      )
      .join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #060b13;">
          <h2 style="color: #6e51e0; border-bottom: 2px solid #6e51e0; padding-bottom: 10px;">
            Vaš rezultat: Test digitalne spremnosti ordinacije
          </h2>

          <div style="background-color: #f7f8fa; padding: 24px; border-radius: 16px; margin: 20px 0; text-align: center;">
            <div style="font-size: 48px; font-weight: 700; color: #060b13; letter-spacing: -1.5px;">
              ${data.totalScore}<span style="font-size: 20px; color: #6b7388; font-weight: 500;"> / 100</span>
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #060b13; margin-top: 8px;">
              ${escapeHtml(data.bandLabel)}
            </div>
            <div style="font-size: 14px; color: #6b7388; margin-top: 4px;">
              Profil: ${escapeHtml(data.profileLabel)}
            </div>
          </div>

          <h3 style="color: #060b13; margin: 24px 0 12px;">Pregled po oblastima</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${categoryRows}
            </tbody>
          </table>

          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 12px; margin-top: 24px;">
            <p style="margin: 0; color: #363d4f; font-size: 14px; line-height: 1.6;">
              Detaljne preporuke i sledeće korake možete videti na sajtu:
              <a href="${SITE_URL}/alati/digitalna-spremnost-ordinacije" style="color: #6e51e0;">
                odontoa.com/alati/digitalna-spremnost-ordinacije
              </a>
            </p>
          </div>

          <div style="margin-top: 24px; padding: 16px; border-radius: 12px; background: #ffffff; border: 1px solid #e9ebf1;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #060b13;">
              Želite da vidite kako bi ovi procesi izgledali u jednom sistemu?
            </p>
            <p style="margin: 0; color: #363d4f; font-size: 14px;">
              Razumljiv demo, bez pritiska:
              <a href="${SITE_URL}/demo?source=digital-readiness-tool&amp;profile=${encodeURIComponent(
                data.profile
              )}" style="color: #6e51e0;">
                Zakažite Odontoa demo
              </a>
            </p>
          </div>

          <p style="margin-top: 24px; color: #979fb4; font-size: 12px;">
            Ova poruka je automatski generisana na osnovu vaših odgovora na sajtu Odontoa.
          </p>
        </div>
      `;

    /* Jedini mejl koji ide spoljnom korisniku: replyTo na javni kontakt (info@odontoa.com),
       jer je posiljalac noreply adresa. Interna kopija (bcc) ostaje na .info sanducetu. */
    await send(
      {
        to: data.email,
        bcc: ['info@odontoa.info'],
        subject: 'Vaš rezultat: Test digitalne spremnosti ordinacije',
        html,
        replyTo: 'info@odontoa.com',
      },
      'Failed to send quiz result email'
    );
  }

  /**
   * Send email for onboarding wizard submissions (/register)
   */
  static async sendOnboardingEmail(data: OnboardingFormData): Promise<void> {
    const row = (label: string, value: string) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e9ebf1; color: #6b7388; width: 45%;">${escapeHtml(
          label
        )}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e9ebf1; color: #060b13; font-weight: 600;">${escapeHtml(
          value
        )}</td>
      </tr>
    `;

    const section = (title: string, rows: string) => `
      <h3 style="color: #060b13; margin: 24px 0 8px; font-size: 16px;">${escapeHtml(
        title
      )}</h3>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
        <tbody>${rows}</tbody>
      </table>
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #060b13;">
          <h2 style="color: #6e51e0; border-bottom: 2px solid #6e51e0; padding-bottom: 10px;">
            Nova prijava ordinacije
          </h2>

          ${section(
            'Ordinacija',
            row('Naziv ordinacije', data.clinicName) +
              row('Ulica i broj', data.street) +
              row('Poštanski broj', data.zip) +
              row('Grad', data.city) +
              row('Država', data.country)
          )}

          ${section(
            'Radno vreme',
            data.hours.map((h) => row(h.label, h.value)).join('')
          )}

          ${section(
            'Tim i trenutni sistem',
            row('Broj stolica', data.chairs) +
              row('Broj doktora / članova tima', data.members) +
              row('Trenutno koriste', data.currentSystems) +
              row('Okvirno pacijenata', data.patientVolume)
          )}

          ${section(
            'Glavni korisnik',
            row('Ime i prezime', `${data.firstName} ${data.lastName}`) +
              row('Email', data.email) +
              row('Telefon', data.phone) +
              row('Kako su saznali za nas', data.source)
          )}

          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 24px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Ova prijava je poslata sa onboarding forme na /register.
            </p>
          </div>
        </div>
      `;

    await send(
      {
        to: getInternalRecipients(),
        subject: sanitizeSubject(`Nova prijava ordinacije: ${data.clinicName}`),
        html,
        replyTo: sanitizeAddress(data.email),
      },
      'Failed to send onboarding email'
    );
  }
}
