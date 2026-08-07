# Resend Email Setup Guide

## Overview
Sve forme na Odontoa sajtu šalju mejl preko [Resend](https://resend.com).
Migrirano sa SendGrid-a; `@sendgrid/mail` više nije zavisnost.

Jedini modul koji šalje je `src/lib/email.ts`. Četiri API rute ga koriste:

| Ruta | Metoda | Šta šalje |
|---|---|---|
| `POST /api/contact` | `sendContactFormEmail` | kontakt forma (`/kontakt`) |
| `POST /api/demo` | `sendDemoFormEmail` | zahtev za demo (`Home2CTA`, `/o-nama`) |
| `POST /api/quiz-result` | `sendQuizResultEmail` | rezultat testa digitalne spremnosti |
| `POST /api/register` | `sendOnboardingEmail` | onboarding prijava (`/register`) |

## Step 1: Verify the domain
1. Resend dashboard → **Domains** → Add Domain → `odontoa.info`
2. Unesi DNS zapise koje Resend generiše (MX + TXT za `send.odontoa.info`, DKIM TXT, DMARC TXT)
3. Sačekaj da status pređe u **Verified**

Pošiljalac mora biti na verifikovanom domenu. Gmail adresa ne može da se koristi.

## Step 2: Create the API key
Resend dashboard → **API Keys** → Create → permission **Sending access**.
Ključ se prikazuje samo jednom.

## Step 3: Environment variables
U `.env.local` lokalno i u Vercel-u (Production + Preview):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Odontoa <noreply@odontoa.info>
CONTACT_TO_EMAIL=info@odontoa.info,ognjen.drinic31@gmail.com
```

- `RESEND_FROM_EMAIL` — obavezno. Bez nje `EmailService` baca `Resend sender address not configured`.
- `CONTACT_TO_EMAIL` — opciono, lista razdvojena zarezom. Ako se izostavi, koristi se
  `DEFAULT_INTERNAL_RECIPIENTS` iz `src/lib/email.ts`.

Namerno se koristi `noreply@odontoa.info`, odvojeno od `info@odontoa.info` koji se koristi
za prepisku sa pacijentima. Na svakom mejlu je postavljen `replyTo` na adresu iz forme,
pa se na prijavu odgovara direktno.

## Step 4: Test
1. `npm run dev`
2. Pošalji kontakt ili demo formu (ili otvori `/test-email`)
3. Proveri primaoce iz `CONTACT_TO_EMAIL` i **Emails** tab u Resend dashboardu

## Recipients
- Kontakt / demo / onboarding → interni primaoci iz `CONTACT_TO_EMAIL`
- Rezultat testa → adresa korisnika, uz `bcc: info@odontoa.info`

## Troubleshooting
- **`Resend API key not configured`** — `RESEND_API_KEY` nije postavljen u tom okruženju
- **`Resend sender address not configured`** — nedostaje `RESEND_FROM_EMAIL`
- **403 / domain not verified** — domen u `RESEND_FROM_EMAIL` nije verifikovan, ili je adresa na pogrešnom domenu
- **Mejl ne stiže** — proveri **Emails** tab u Resend dashboardu; tamo se vidi bounce/spam status
- Telo mejla se namerno **ne loguje** (lični podaci iz forme). U logu su samo `error.name` i `error.message`.

## Security notes
- `.env.local` se ne commituje
- Ključ ima samo Sending access
- Sav korisnički unos se HTML-escapuje pre nego što uđe u telo mejla (`escapeHtml`)
- Subject i `replyTo` se čiste od CR/LF (header injection)
