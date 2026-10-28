import { NextResponse } from 'next/server';
import { z } from 'zod';
import { EmailService } from '@/lib/email';

/* Lead sa /klub100. Izvor se ne cita iz tela zahteva: ruta je jedini ulaz za Klub 100,
   pa je izvor uvek "klub100" (u mejlu kao "Izvor: Klub 100"). Telefon je opcion, bez
   provere formata; prazan string se tretira kao da nije poslat. */
const bodySchema = z.object({
  email: z
    .string({ required_error: 'Unesite email adresu', invalid_type_error: 'Unesite email adresu' })
    .trim()
    .email('Neispravan format email adrese')
    .max(320),
  phone: z
    .string({ invalid_type_error: 'Neispravan broj telefona' })
    .trim()
    .max(40, 'Broj telefona je predugačak')
    .optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');

  /* Neispravan JSON je los zahtev, ne serverska greska. */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400, headers });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const error = parsed.error.errors[0]?.message ?? 'Neispravan zahtev.';
    return NextResponse.json({ error }, { status: 400, headers });
  }

  try {
    await EmailService.sendKlub100LeadEmail({
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
    });
    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch (error) {
    /* Bez email adrese u logu: licni podatak. */
    console.error('Klub 100 form error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Greška pri slanju prijave. Pokušajte ponovo kasnije.' },
      { status: 500, headers }
    );
  }
}
