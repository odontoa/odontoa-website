import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email('Unesite ispravnu email adresu.').max(320),
  source: z.string().max(64).optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');

  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? 'Neispravan zahtev.';
      return NextResponse.json({ message }, { status: 400, headers });
    }
    const { email, source } = parsed.data;

    // TODO: If Supabase is (re)introduced, add NEXT_PUBLIC_SUPABASE_URL + server key,
    // create server client, insert into e.g. waitlist(email, source, created_at).
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      // Optional: insert into Supabase when configured
      // const supabase = createClient(supabaseUrl, supabaseKey);
      // await supabase.from('waitlist').insert({ email, source: source ?? 'coming_soon', created_at: new Date().toISOString() });
    }
    console.log('[waitlist]', { email, source: source ?? 'coming_soon' });

    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { message: 'Neispravan zahtev.' },
      { status: 400, headers }
    );
  }
}
