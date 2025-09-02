import { NextRequest, NextResponse } from 'next/server';
import { EmailService, ContactFormData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, phone, clinic, subject, message } = body;
    
    if (!name || !email || !phone || !clinic || !subject || !message) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neispravan format email adrese' },
        { status: 400 }
      );
    }

    const formData: ContactFormData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      clinic: clinic.trim(),
      subject: subject.trim(),
      message: message.trim()
    };

    // Send email
    await EmailService.sendContactFormEmail(formData);

    return NextResponse.json(
      { message: 'Poruka je uspešno poslata! Odgovorićemo vam u najkraćem roku.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof Error && error.message.includes('Failed to send contact form email')) {
      return NextResponse.json(
        { error: 'Greška pri slanju email-a. Pokušajte ponovo kasnije.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Greška na serveru. Pokušajte ponovo kasnije.' },
      { status: 500 }
    );
  }
}
