import { defineType, defineField } from "sanity";

/**
 * Glossary Term Schema
 * 
 * ⚠️ VAŽNO: Ako menjaš ova polja, OBAVEZNO ažuriraj:
 * - scripts/importGlossaryTerms.ts (interface, validacija, kreiranje)
 * - scripts/glossary-terms-template.json (template)
 * - scripts/GLOSSARY_IMPORT_README.md (dokumentacija)
 * 
 * Proveri scripts/SCHEMA_SYNC_CHECKLIST.md pre svake promene!
 */
export default defineType({
  name: "glossaryTerm",
  title: "Glossary Term",
  type: "document",
  fieldsets: [
    {
      name: "help",
      title: "Pomoć (kako sistem radi)",
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      name: "term",
      title: "Termin",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: {
        source: "term",
        maxLength: 96,
      },
      description: "Unos: URL adresa termina. Automatski: generiše se iz termina.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "definition",
      title: "Kratka definicija",
      type: "text",
      description: "Unos: 60–200 karaktera. Automatski: ako je meta opis prazan, koristi se definicija.",
      validation: (Rule) => 
        Rule.required()
          .min(60)
          .max(200),
    }),
    defineField({
      name: "fullArticle",
      title: "Puni članak",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      description: "Unos: detaljno objašnjenje termina.",
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      options: {
        list: [
          "Opšta stomatologija",
          "Preventivna i dečja stomatologija",
          "Bolesti zuba i endodoncija",
          "Stomatološka protetika",
          "Parodontologija i oralna medicina",
          "Ortopedija vilica (Ortodoncija)",
          "Oralna hirurgija",
          "Maksilofacijalna hirurgija",
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tagovi",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "relatedTerms",
      title: "Povezani termini",
      type: "array",
      of: [{ type: "reference", to: [{ type: "glossaryTerm" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Datum objave",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Datum poslednje izmene",
      type: "datetime",
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "authorUrl",
      title: "URL autora (fallback)",
      type: "url",
      description: "Unos: koristi se ako autor nema URL. Automatski: /o-nama",
    }),
    defineField({
      name: "coverImage",
      title: "Naslovna slika",
      type: "image",
      options: { hotspot: true },
      description: "Unos: preporučeno za Article schema (JSON-LD). Automatski: ako je prazno, koristi se podrazumevana slika.",
    }),
    defineField({
      name: "coverImageAlt",
      title: "Alt tekst za naslovnu sliku",
      type: "string",
      description: "Unos: opis slike za pristupačnost i SEO. Obavezno: kada postoji naslovna slika.",
      validation: (Rule: any) =>
        Rule.custom((alt: string, context: any) => {
          const hasCoverImage = context.document?.coverImage;
          if (hasCoverImage && !alt) {
            return "Alt text je obavezan kada postoji cover image";
          }
          return true;
        }),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO naslov (opciono)",
      type: "string",
      description: "Unos: alternativni naslov. Automatski: ako je prazno, koristi se termin.",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta opis (opciono)",
      type: "text",
      description: "Unos: alternativni opis. Automatski: ako je prazno, koristi se definicija.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (opciono)",
      type: "url",
      description: "Unos: ručno samo po potrebi. Automatski: https://odontoa.com/recnik/{slug}",
    }),
    defineField({
      name: "noindex",
      title: "Ne indeksiraj (noindex)",
      type: "boolean",
      initialValue: false,
      description: "Unos: uključite samo za testni termin ili ako ne želite da Google indeksira ovu stranicu. VAŽNO: ako je uključeno, termin se neće pojavljivati na Google-u. Automatski: stranica dobija noindex.",
    }),
    defineField({
      name: "faqs",
      title: "Često postavljana pitanja (FAQ)",
      type: "array",
      description: "Unos: opcionalno. Ako dodate FAQ, pitanja/odgovori moraju biti vidljivi na stranici.",
      validation: (Rule) =>
        Rule.custom((faqs: any[]) => {
          // If FAQs exist, must have at least 3
          if (faqs && faqs.length > 0 && faqs.length < 3) {
            return "Ako dodajete FAQ, morate imati minimum 3 pitanja";
          }
          // If no FAQs, that's fine (optional field)
          return true;
        }),
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Pitanje",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Odgovor",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    // Help fieldset
    defineField({
      name: "helpText",
      title: "Pomoć",
      type: "text",
      readOnly: true,
      rows: 12,
      fieldset: "help",
      initialValue: `Pomoć - Kako sistem radi

AUTOMATSKI GENERIŠE:
• Slug - iz termina
• SEO naslov - ako je prazno, koristi se termin
• Meta opis - ako je prazno, koristi se kratka definicija
• Canonical URL - ako je prazno, generiše se kao https://odontoa.com/recnik/{slug}
• Schema (JSON-LD) - automatski se generiše na sajtu na osnovu ovih polja

MORATE DA POPUNITE:
• Termin (obavezno)
• Kratka definicija (obavezno, 60-200 karaktera)
• Puni članak (obavezno)
• Datum objave (obavezno)

OPCIONO:
• SEO naslov, Meta opis, Canonical URL - za naprednu SEO optimizaciju
• FAQ - minimum 3 pitanja (ako se dodaju, moraju biti u vidljivom sadržaju)
• Ne indeksiraj - za skrivanje od pretraživača`,
    }),
  ],
});
