# Supabase (legacy)

Stari Supabase setup iz ranije verzije sajta (admin panel, blog i recnik u Supabase bazi).
Nije deo trenutne production arhitekture: sajt ne importuje nista odavde, nema
`@supabase/*` paketa u `package.json` i nijedna aktivna ruta ne cita Supabase env varijable.

Sadrzaj:
- `llms-service-stub.ts`: prazan stub nekadasnjeg LLMS servisa (bivsi `src/lib/llms.ts`).
  Danasnji `/llms.txt` generise `src/app/api/llms/route.ts`.
- `scripts/fix-admin-user.mjs`: iskljucena skripta za admin korisnika (bivsi koren repoa).
- `create-storage-policies.sql`: RLS politike za stari `blog-images` storage bucket.

Ovde nema `.env` fajlova ni tajni. Planirano za potpuno brisanje kasnije.
Ne importovati odavde u aktivni sajt.
