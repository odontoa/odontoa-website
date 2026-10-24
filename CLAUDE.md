## Odontoa glossary / rečnik

Before creating, importing, editing, validating, reviewing, or publishing any Odontoa glossary content, you MUST first read and follow:

- `docs/RECNIK_CONTENT_RULES.md`
- `docs/RECNIK_IMPORT_FORMAT.md`

These documents are the source of truth for medical terminology, source verification, aliases, MeSH mapping, clinical review, publication gates, SEO/GEO mapping, and the dry-run import process.

Never bypass these rules to make an import or validator pass. Never infer or “correct” medical content from model knowledge.

## Website email (Resend)

Before changing any website form, `src/lib/email.ts`, an email API route, or email env vars, read `RESEND_SETUP.md`. It is the source of truth for the sender (`notify.odontoa.com`), recipients, Reply-To, and which systems are separate (patient reminders use Nodemailer/SMTP in the app backend; cold email uses its own domains). Never commit a real API key.
