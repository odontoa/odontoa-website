# Resend Email Setup Guide

> **Source of truth** za email marketing sajta. Pre bilo kakve izmene email koda, env-a ili
> formi pročitaj ovaj fajl. Pravi API ključ nikad ne ide u repo.

## Odontoa Website Email Architecture

| | |
|---|---|
| **Provider** | Resend (region Ireland / eu-west-1) |
| **Verified sending domain** | `notify.odontoa.com` |
| **Sender (FROM)** | `Odontoa Forms <forms@notify.odontoa.com>` |
| **Recipients (TO)** | `info@odontoa.com`, `ognjen.drinic31@gmail.com` |
| **Reply-To** | email korisnika koji je popunio formu |
| **API key** | `odontoa-website`, permission **Sending access** |

**Website forme** (sve kroz `src/lib/email.ts`, isti FROM/TO iz env-a):

| Forma | API ruta | EmailService metoda | Subject |
|---|---|---|---|
| `/kontakt` | `POST /api/contact` | `sendContactFormEmail` | `Nova kontakt forma - Kontakt sa sajta` |
| `/demo` | `POST /api/demo` | `sendDemoFormEmail` | `Novi zahtev za demo - Odontoa` |
| `/register` (Započni besplatno) | `POST /api/register` | `sendOnboardingEmail` | `Nova prijava ordinacije: {naziv}` |
| `/klub100` (skrivena, QR) | `POST /api/klub100` | `sendKlub100LeadEmail` | `Nova Klub 100 prijava` |

- Klub 100: izvor `klub100` se postavlja na serveru (u mejlu „Izvor: Klub 100“), ne čita se
  iz zahteva. GA posle uspeha: `generate_lead`, `lead_source: klub100`.
- Sakriveni kviz (`/api/quiz-result`, `sendQuizResultEmail`) šalje rezultat korisniku, uz
  `bcc: info@odontoa.com` i `replyTo: info@odontoa.com` (hardkodovano; post-launch cleanup:
  prebaciti na `CONTACT_TO_EMAIL`).

**Odvojeni sistemi — ne menjati kao deo marketing sajta:**

- **Patient reminders: SEPARATE SYSTEM.** Odontoa backend (NestJS) koristi Nodemailer/SMTP
  (`SMTP_HOST`, `SMTP_USER`...). Nema veze sa Resend-om ni sa ovim repoom.
- **Cold email: SEPARATE** infrastruktura i domeni. Nikad preko `notify.odontoa.com`.

## Environment variables

Vercel (Production + Preview) i `.env.local` lokalno:

```bash
RESEND_API_KEY=            # kljuc "odontoa-website", Sending access; nikad u repo
RESEND_FROM_EMAIL=Odontoa Forms <forms@notify.odontoa.com>
CONTACT_TO_EMAIL=info@odontoa.com,ognjen.drinic31@gmail.com
```

- `RESEND_API_KEY` — obavezno. Bez njega forme vraćaju 500 (`Resend API key not configured`).
- `RESEND_FROM_EMAIL` — obavezno, nema fallback-a u kodu. Mora biti na verifikovanom domenu
  (`notify.odontoa.com`); bez nje forme vraćaju 500 (`Resend sender address not configured`).
- `CONTACT_TO_EMAIL` — lista razdvojena zarezom. Ako se izostavi, `DEFAULT_INTERNAL_RECIPIENTS`
  u `src/lib/email.ts` daje iste primaoce (`info@odontoa.com`, `ognjen.drinic31@gmail.com`).

**Posle svake promene env promenljivih u Vercel-u mora se uraditi redeploy.** Postojeći
deploy zadržava stare vrednosti.

## Ponašanje formi

- Success se prikazuje tek kad Resend prihvati poruku (ruta vrati 200).
- Na grešku slanja (500) ili mreže korisnik vidi poruku, a podaci ostaju u formi za ponovni
  pokušaj. `/register` i `/klub100`: „Slanje nije uspelo. Pokušajte ponovo ili nam pišite na
  info@odontoa.com.“ Greške validacije (400) prikazuju konkretnu poruku.
- Prijave se ne čuvaju nigde osim u mejlu; kopija poslatih poruka je u Resend dashboardu
  (**Emails** tab).

## Test

1. `npm run dev` sa env-om iz gornjeg bloka u `.env.local`
2. Pošalji formu (ili otvori `/test-email`, interna stranica, u produkciji 404)
3. Proveri primaoce iz `CONTACT_TO_EMAIL` i **Emails** tab u Resend dashboardu

Test poruke jasno označiti (npr. naziv ordinacije „TEST — ne odgovarati“), jer stižu na prave
primaoce.

## Troubleshooting

- **`Resend API key not configured`** — `RESEND_API_KEY` nije postavljen u tom okruženju
- **`Resend sender address not configured`** — nedostaje `RESEND_FROM_EMAIL`
- **403 / domain not verified** — domen u `RESEND_FROM_EMAIL` nije `notify.odontoa.com`, ili
  ključ nema pravo slanja za taj domen
- **Env promenjen, a ništa se ne menja** — nije urađen redeploy
- **Mejl ne stiže** — proveri **Emails** tab u Resend dashboardu; tamo se vidi bounce/spam status
- Telo mejla se namerno **ne loguje** (lični podaci iz forme). U logu su samo `error.name` i `error.message`.

## Security notes

- `.env.local` se ne commituje; pravi ključ samo u Vercel-u i lokalnom `.env.local`
- Ključ ima samo Sending access
- Sav korisnički unos se HTML-escapuje pre nego što uđe u telo mejla (`escapeHtml`)
- Subject i `replyTo` se čiste od CR/LF (header injection)

## Istorija

- Pre 2026-10: pošiljalac `noreply@odontoa.info`, fallback primalac `info@odontoa.info`.
  Više se ne koristi za website forme.
- Pre 2026-08: SendGrid; `@sendgrid/mail` više nije zavisnost.
