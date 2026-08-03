import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

export class EmailService {
  /**
   * Send email for contact form submissions
   */
  static async sendContactFormEmail(data: ContactFormData): Promise<void> {
    // Check if API key is set
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      throw new Error('SendGrid API key not configured');
    }

    const emailContent = {
      to: ['info@odontoa.info', 'ognjen.drinic31@gmail.com'],
      from: 'odontoa.com@gmail.com',
      subject: `Nova kontakt forma - ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nova kontakt forma - Odontoa
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Detalji forme:</h3>
            <p><strong>Tip forme:</strong> Kontakt forma</p>
            <p><strong>Ime i prezime:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone}</p>
            <p><strong>Naziv ordinacije:</strong> ${data.clinic}</p>
            <p><strong>Predmet:</strong> ${data.subject}</p>
            <p><strong>Poruka:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Ova poruka je automatski generisana sa Odontoa web sajta.
            </p>
          </div>
        </div>
      `
    };

    try {
      console.log('Attempting to send contact form email...');
      console.log('API Key exists:', !!process.env.SENDGRID_API_KEY);
      console.log('Email content:', JSON.stringify(emailContent, null, 2));
      
      await sgMail.send(emailContent);
      console.log('Contact form email sent successfully');
    } catch (error) {
      console.error('Error sending contact form email:', error);
      if (error.response) {
        console.error('SendGrid response:', error.response.body);
      }
      throw new Error(`Failed to send contact form email: ${error.message}`);
    }
  }

  /**
   * Send email for demo form submissions
   */
  static async sendDemoFormEmail(data: DemoFormData): Promise<void> {
    // Check if API key is set
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      throw new Error('SendGrid API key not configured');
    }

    const emailContent = {
      to: ['info@odontoa.info', 'ognjen.drinic31@gmail.com'],
      from: 'odontoa.com@gmail.com',
      subject: 'Novi zahtev za demo - Odontoa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Novi zahtev za demo - Odontoa
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Detalji forme:</h3>
            <p><strong>Tip forme:</strong> Demo forma</p>
            <p><strong>Ime i prezime:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Ova poruka je automatski generisana sa Odontoa web sajta.
            </p>
          </div>
        </div>
      `
    };

    try {
      console.log('Attempting to send demo form email...');
      console.log('API Key exists:', !!process.env.SENDGRID_API_KEY);
      console.log('API Key first 10 chars:', process.env.SENDGRID_API_KEY?.substring(0, 10));
      console.log('Email content:', JSON.stringify(emailContent, null, 2));
      
      const result = await sgMail.send(emailContent);
      console.log('Demo form email sent successfully');
      console.log('SendGrid response:', result);
      console.log('SendGrid response type:', typeof result);
      console.log('SendGrid response keys:', Object.keys(result || {}));
    } catch (error) {
      console.error('Error sending demo form email:', error);
      if (error.response) {
        console.error('SendGrid response:', error.response.body);
      }
      throw new Error(`Failed to send demo form email: ${error.message}`);
    }
  }

  /**
   * Send a copy of the digital readiness quiz result to the user's email.
   */
  static async sendQuizResultEmail(data: QuizResultEmailData): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      throw new Error('SendGrid API key not configured');
    }

    const categoryRows = data.categories
      .map(
        (c) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e9ebf1; color: #363d4f;">${c.label}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e9ebf1; color: #060b13; font-weight: 600; text-align: right;">${c.percent}%</td>
          </tr>
        `
      )
      .join('');

    const emailContent = {
      to: data.email,
      bcc: ['info@odontoa.info'],
      from: 'odontoa.com@gmail.com',
      subject: 'Vaš rezultat: Test digitalne spremnosti ordinacije',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #060b13;">
          <h2 style="color: #6e51e0; border-bottom: 2px solid #6e51e0; padding-bottom: 10px;">
            Vaš rezultat: Test digitalne spremnosti ordinacije
          </h2>

          <div style="background-color: #f7f8fa; padding: 24px; border-radius: 16px; margin: 20px 0; text-align: center;">
            <div style="font-size: 48px; font-weight: 700; color: #060b13; letter-spacing: -1.5px;">
              ${data.totalScore}<span style="font-size: 20px; color: #6b7388; font-weight: 500;"> / 100</span>
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #060b13; margin-top: 8px;">
              ${data.bandLabel}
            </div>
            <div style="font-size: 14px; color: #6b7388; margin-top: 4px;">
              Profil: ${data.profileLabel}
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
              <a href="https://odontoa.com/alati/digitalna-spremnost-ordinacije" style="color: #6e51e0;">
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
              <a href="https://odontoa.com/demo?source=digital-readiness-tool&amp;profile=${encodeURIComponent(
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
      `,
    };

    try {
      await sgMail.send(emailContent);
      console.log('Quiz result email sent successfully');
    } catch (error) {
      console.error('Error sending quiz result email:', error);
      if (error.response) {
        console.error('SendGrid response:', error.response.body);
      }
      throw new Error(`Failed to send quiz result email: ${error.message}`);
    }
  }

  /**
   * Send email for onboarding wizard submissions (/register)
   */
  static async sendOnboardingEmail(data: OnboardingFormData): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      throw new Error('SendGrid API key not configured');
    }

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

    const emailContent = {
      to: ['info@odontoa.info', 'ognjen.drinic31@gmail.com'],
      from: 'odontoa.com@gmail.com',
      subject: sanitizeSubject(`Nova prijava ordinacije: ${data.clinicName}`),
      html: `
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
      `,
    };

    try {
      await sgMail.send(emailContent);
      console.log('Onboarding email sent successfully');
    } catch (error) {
      console.error('Error sending onboarding email:', error);
      if (error.response) {
        console.error('SendGrid response:', error.response.body);
      }
      throw new Error(`Failed to send onboarding email: ${error.message}`);
    }
  }
}
