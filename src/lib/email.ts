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
}
