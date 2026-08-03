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
