import { NextRequest, NextResponse } from 'next/server';
import { EmailService, DemoFormData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, phone } = body;
    
    if (!name || !email || !phone) {
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

    const formData: DemoFormData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim()
    };

    // Send email
    await EmailService.sendDemoFormEmail(formData);

    return NextResponse.json(
      { message: 'Zahtev za demo je uspešno poslat! Kontaktiraćemo vas u najkraćem roku.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Demo form error:', error);
    
    if (error instanceof Error && error.message.includes('Failed to send demo form email')) {
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
