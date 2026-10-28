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

/* Pošiljalac mora biti na domenu verifikovanom u Resend-u (notify.odontoa.com);
   vrednost je samo u env-u, vidi RESEND_SETUP.md. */
function getFrom(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error('Resend sender address not configured');
  }
  return from;
}

/* Interni primaoci obaveštenja o formama. Env je lista razdvojena zarezom;
   fallback su isti primaoci kao u RESEND_SETUP.md, da forme rade i ako varijabla izostane. */
const DEFAULT_INTERNAL_RECIPIENTS = [
  'info@odontoa.com',
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

export interface Klub100LeadData {
  email: string;
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

/* ── Zajednicki izgled internih mejlova sa formi ──
   Email-safe: tabele, inline stilovi, bez slika i bez linkova osim mailto/tel, pa je
   poruka mala i pretezno tekst. Identitet nose tipografija, razmak i Odontoa boje.
   width="600" je za Outlook (ne cita max-width), max-width za Gmail i telefone. */
const EMAIL_FONT = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

interface EmailField {
  label: string;
  /* Vec escapovan HTML (tekst ili link) */
  valueHtml: string;
}

const textValue = (value: string) => escapeHtml(value);

const emailLink = (email: string) =>
  `<a href="mailto:${escapeHtml(email)}" style="color: #5a3ec7; text-decoration: none;">${escapeHtml(email)}</a>`;

const phoneLink = (phone: string) =>
  `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ''))}" style="color: #5a3ec7; text-decoration: none;">${escapeHtml(phone)}</a>`;

/* Oznaka iznad vrednosti: kratke forme (demo, kontakt, Klub 100) */
function stackedRows(fields: EmailField[]): string {
  return fields
    .map(
      (f, i) => `
        <tr>
          <td style="padding: 11px 0;${i < fields.length - 1 ? ' border-bottom: 1px solid #ebe8f7;' : ''}">
            <div style="font-size: 12px; line-height: 16px; color: #6b7184;">${escapeHtml(f.label)}</div>
            <div style="font-size: 15px; line-height: 22px; color: #060b13; font-weight: 600; margin-top: 2px;">${f.valueHtml}</div>
          </td>
        </tr>`
    )
    .join('');
}

/* Oznaka levo, vrednost desno: duga prijava (/register), da bude pregledna */
function pairRows(fields: EmailField[]): string {
  return fields
    .map(
      (f, i) => `
        <tr>
          <td valign="top" width="44%" style="padding: 9px 12px 9px 0; font-size: 13px; line-height: 19px; color: #6b7184;${i < fields.length - 1 ? ' border-bottom: 1px solid #ebe8f7;' : ''}">${escapeHtml(f.label)}</td>
          <td valign="top" style="padding: 9px 0; font-size: 14px; line-height: 20px; color: #060b13; font-weight: 600;${i < fields.length - 1 ? ' border-bottom: 1px solid #ebe8f7;' : ''}">${f.valueHtml}</td>
        </tr>`
    )
    .join('');
}

function dataCard(rowsHtml: string, title?: string): string {
  return `
    ${title ? `<div style="font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a3ec7; margin: 0 0 8px;">${escapeHtml(title)}</div>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f7fd; border: 1px solid #ebe8f7; border-radius: 12px; margin: 0 0 16px;">
      <tr>
        <td style="padding: 6px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">${rowsHtml}</table>
        </td>
      </tr>
    </table>`;
}

function internalEmail(args: { title: string; badge?: string; body: string }): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #ffffff;">
  <tr>
    <td align="center" style="padding: 24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #ececf2; border-radius: 16px; font-family: ${EMAIL_FONT};">
        <tr>
          <td style="padding: 28px 32px 0;">
            <div style="font-size: 16px; line-height: 20px; font-weight: 700; letter-spacing: -0.01em; color: #6e51e0;">Odontoa</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 22px 32px 22px;">
            ${args.badge ? `<div style="margin: 0 0 10px;"><span style="display: inline-block; padding: 3px 9px; border-radius: 999px; background-color: #efebfc; color: #5a3ec7; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 0.06em;">${escapeHtml(args.badge)}</span></div>` : ''}
            <h1 style="margin: 0; font-size: 22px; line-height: 28px; font-weight: 700; color: #060b13; letter-spacing: -0.01em;">${escapeHtml(args.title)}</h1>
            <p style="margin: 4px 0 0; font-size: 13px; line-height: 18px; color: #6b7184;">Odontoa web sajt</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 32px 4px;">${args.body}</td>
        </tr>
        <tr>
          <td style="padding: 0 32px 28px;">
            <div style="border-top: 1px solid #ececf2; padding-top: 16px; font-size: 12px; line-height: 18px; color: #6b7184;">
              Automatska poruka sa Odontoa web sajta.<br>
              Odgovor na ovaj email ide direktno korisniku.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
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
    /* Poruka u belom unutrasnjem polju, obicna tezina: duzi tekst se lakse cita */
    const messageHtml = `
      <div style="margin-top: 6px; padding: 12px 14px; background-color: #ffffff; border: 1px solid #ebe8f7; border-radius: 10px; font-size: 14px; line-height: 21px; font-weight: 400; color: #1d2130;">
        ${escapeHtml(data.message).replace(/\n/g, '<br>')}
      </div>`;

    const html = internalEmail({
      title: 'Nova poruka sa kontakt forme',
      body: dataCard(
        stackedRows([
          { label: 'Ime i prezime', valueHtml: textValue(data.name) },
          { label: 'Email', valueHtml: emailLink(data.email) },
          { label: 'Telefon', valueHtml: phoneLink(data.phone) },
          { label: 'Naziv ordinacije', valueHtml: textValue(data.clinic) },
          { label: 'Predmet', valueHtml: textValue(data.subject) },
          { label: 'Poruka', valueHtml: messageHtml },
        ])
      ),
    });

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
    const html = internalEmail({
      title: 'Novi zahtev za demo',
      body: dataCard(
        stackedRows([
          { label: 'Ime i prezime', valueHtml: textValue(data.name) },
          { label: 'Email', valueHtml: emailLink(data.email) },
          { label: 'Telefon', valueHtml: phoneLink(data.phone) },
        ])
      ),
    });

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
   * Send email for Klub 100 lead submissions (/klub100)
   */
  static async sendKlub100LeadEmail(data: Klub100LeadData): Promise<void> {
    const html = internalEmail({
      title: 'Nova Klub 100 prijava',
      badge: 'KLUB 100',
      body: dataCard(
        stackedRows([
          { label: 'Email', valueHtml: emailLink(data.email) },
          { label: 'Izvor', valueHtml: textValue('Klub 100') },
        ])
      ),
    });

    await send(
      {
        to: getInternalRecipients(),
        subject: 'Nova Klub 100 prijava',
        html,
        replyTo: sanitizeAddress(data.email),
      },
      'Failed to send Klub 100 lead email'
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
       jer je posiljalac adresa za forme. Interna kopija (bcc) ide na isti javni kontakt. */
    await send(
      {
        to: data.email,
        bcc: ['info@odontoa.com'],
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
    /* Isti podaci kao ranije, svaki red; grupisani u cetiri kartice */
    const t = (label: string, value: string): EmailField => ({ label, valueHtml: textValue(value) });

    const html = internalEmail({
      title: 'Nova prijava ordinacije',
      body:
        dataCard(
          pairRows([
            t('Naziv ordinacije', data.clinicName),
            t('Ulica i broj', data.street),
            t('Poštanski broj', data.zip),
            t('Grad', data.city),
            t('Država', data.country),
          ]),
          'Ordinacija'
        ) +
        dataCard(pairRows(data.hours.map((h) => t(h.label, h.value))), 'Radno vreme') +
        dataCard(
          pairRows([
            t('Broj stolica', data.chairs),
            t('Broj doktora / članova tima', data.members),
            t('Trenutno koriste', data.currentSystems),
            t('Okvirno pacijenata', data.patientVolume),
          ]),
          'Tim i trenutni sistem'
        ) +
        dataCard(
          pairRows([
            t('Ime i prezime', `${data.firstName} ${data.lastName}`),
            { label: 'Email', valueHtml: emailLink(data.email) },
            { label: 'Telefon', valueHtml: phoneLink(data.phone) },
            t('Kako su saznali za nas', data.source),
          ]),
          'Glavni korisnik'
        ),
    });

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
