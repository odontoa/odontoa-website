import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
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
      name: "title",
      title: "Naslov",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "Unos: URL adresa članka. Automatski: generiše se iz naslova.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Kratki opis",
      type: "text",
      description: "Unos: kratak opis (80–200 karaktera). Automatski: ako je SEO opis prazan, koristi se ovaj tekst.",
      validation: (Rule: any) =>
        Rule.custom((excerpt: string) => {
          if (!excerpt) return true; // Optional field
          if (excerpt.length < 60) {
            return "Excerpt mora imati minimum 60 karaktera";
          }
          if (excerpt.length > 200) {
            return "Excerpt preporučeno maksimum 200 karaktera (trenutno: " + excerpt.length + ")";
          }
          if (excerpt.length < 80) {
            return "Excerpt preporučeno minimum 80 karaktera za bolji SEO (trenutno: " + excerpt.length + ")";
          }
          return true;
        }),
    }),
    defineField({
      name: "coverImage",
      title: "Naslovna slika",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverImageAlt",
      title: "Alt tekst za naslovnu sliku",
      type: "string",
      description: "Unos: opis slike za pristupačnost i SEO. Obavezno: kada postoji naslovna slika.",
      validation: (Rule: any) =>
        Rule.custom((alt: string, context: any) => {
          // Only required if coverImage exists
          const hasCoverImage = context.document?.coverImage;
          if (hasCoverImage && !alt) {
            return "Alt text je obavezan kada postoji cover image";
          }
          return true;
        }),
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
      description: "Unos: datum poslednje izmene. Automatski: ako je prazno, koristi se datum objave.",
    }),
    defineField({
      name: "featured",
      title: "Istaknuti članak",
      type: "boolean",
      initialValue: false,
      description: "Unos: označite da li je članak istaknuti. Ako je označeno, birajte poziciju ispod.",
    }),
    defineField({
      name: "featuredAt",
      title: "Datum istaknutog članka (opciono)",
      type: "datetime",
      description: "Unos: datum za sortiranje istaknutih. Automatski: ako je prazno, koristi se datum objave.",
      hidden: ({ document }: any) => !document?.featured,
    }),
    defineField({
      name: "featuredSlot",
      title: "Pozicija istaknutog članka",
      type: "string",
      initialValue: "hero",
      description: "Unos: gde da se prikaže istaknuti članak - Hero (vrh) ili Pinned (ispod hero sekcije).",
      options: {
        list: [
          { title: "Hero (top)", value: "hero" },
          { title: "Pinned (under hero)", value: "pinned" },
        ],
        layout: "radio",
      },
      hidden: ({ document }: any) => !document?.featured,
      validation: (Rule: any) =>
        Rule.custom((slot: string, context: any) => {
          if (context.document?.featured && !slot) {
            return "Featured slot je obavezan kada je post featured";
          }
          return true;
        }),
    }),
    defineField({
      name: "pinnedRank",
      title: "Redosled prikačanih članaka (1–3)",
      type: "number",
      description: "Unos: redosled prikačanih članaka (1 je prvi). Vidljivo samo za Pinned poziciju.",
      hidden: ({ document }: any) =>
        !document?.featured || document?.featuredSlot !== "pinned",
      validation: (Rule: any) => Rule.min(1).max(3),
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
      description: "Unos: koristi se ako autor nema URL. Automatski: ako je prazno, koristi se /o-nama.",
    }),
    defineField({
      name: "tags",
      title: "Tagovi",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "content",
      title: "Sadržaj",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    // SEO fields (for Article + WebPage in JSON-LD)
    defineField({
      name: "seoTitle",
      title: "SEO naslov (opciono)",
      type: "string",
      description: "Unos: alternativni naslov za Google. Automatski: ako je prazno, koristi se naslov članka.",
      validation: (Rule: any) =>
        Rule.custom((title: string) => {
          if (!title) return true; // Optional field
          if (title.length > 60) {
            return "SEO Title preporučeno maksimum 60 karaktera za bolji prikaz u pretrazi (trenutno: " + title.length + ")";
          }
          return true;
        }),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO opis (opciono)",
      type: "text",
      description: "Unos: alternativni opis za Google. Automatski: ako je prazno, koristi se kratki opis.",
      validation: (Rule: any) =>
        Rule.custom((desc: string) => {
          if (!desc) return true; // Optional field
          if (desc.length > 160) {
            return "SEO Description preporučeno maksimum 160 karaktera za bolji prikaz u pretrazi (trenutno: " + desc.length + ")";
          }
          return true;
        }),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (opciono)",
      type: "url",
      description: "Unos: ručno samo po potrebi. Automatski: https://odontoa.com/blogovi/{slug}",
    }),
    defineField({
      name: "noindex",
      title: "Ne indeksiraj (noindex)",
      type: "boolean",
      initialValue: false,
      description: "Unos: uključite samo ako je ovo testni/draft članak ili ne želite da Google indeksira ovu stranicu. VAŽNO: ako je uključeno, članak se neće pojavljivati na Google-u. Automatski: stranica dobija noindex.",
    }),
    defineField({
      name: "breadcrumbLabel",
      title: "Label za breadcrumb (opciono)",
      type: "string",
      description: "Unos: label za breadcrumb. Automatski: ako je prazno, koristi se naslov članka.",
      initialValue: "Blogovi",
      hidden: true,
    }),
    // FAQ section: questions must exist in visible content, and also in JSON-LD.
    defineField({
      name: "faqs",
      title: "Često postavljana pitanja (FAQ)",
      type: "array",
      description: "Unos: minimum 3 pitanja i odgovora. Važno: FAQ mora biti vidljiv na stranici (radi SEO).",
      validation: (Rule: any) =>
        Rule.required()
          .min(3)
          .custom((faqs: any[]) => {
            if (faqs.length > 8) {
              return "Maksimum 8 FAQ pitanja";
            }
            return true;
          }),
      of: [
        {
          name: "faqItem",
          title: "FAQ stavka",
          type: "object",
          fields: [
            {
              name: "question",
              title: "Pitanje",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "answer",
              title: "Odgovor",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "schemaOverrideJson",
      title: "Schema override JSON (napredno)",
      type: "text",
      description: "Unos: napredno (ručni JSON-LD). Automatski: ako je prazno, schema se generiše na sajtu.",
      validation: (Rule: any) =>
        Rule.custom((json: string) => {
          if (!json) return true;
          try {
            const parsed = JSON.parse(json);
            if (!Array.isArray(parsed)) {
              return "Schema override mora biti JSON array";
            }
            const types = parsed.map((s: any) => s["@type"]).filter(Boolean);
            const required = ["WebPage", "BreadcrumbList", "Article", "FAQPage"];
            const missing = required.filter((r) => !types.includes(r));
            if (missing.length > 0) {
              return `Schema mora uključivati: ${missing.join(", ")}`;
            }
            return true;
          } catch {
            return "Nevalidan JSON format";
          }
        }),
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
• Slug - iz naslova
• SEO naslov - ako je prazno, koristi se naslov članka
• SEO opis - ako je prazno, koristi se kratki opis (excerpt)
• Canonical URL - ako je prazno, generiše se kao https://odontoa.com/blogovi/{slug}
• Breadcrumb label - ako je prazno, koristi se naslov članka
• Datum poslednje izmene - ako je prazno, koristi se datum objave
• Datum istaknutog članka - ako je prazno, koristi se datum objave
• Schema (JSON-LD) - automatski se generiše na sajtu na osnovu ovih polja (WebPage, BreadcrumbList, Article, FAQPage)

MORATE DA POPUNITE:
• Naslov (obavezno)
• Kratki opis (preporučeno 80-200 karaktera)
• Naslovna slika (preporučeno)
• Alt tekst za sliku (obavezno kada postoji slika)
• Datum objave (obavezno)
• Sadržaj (obavezno)
• FAQ - minimum 3 pitanja (obavezno)

OPCIONO:
• SEO naslov, SEO opis, Canonical URL - za naprednu SEO optimizaciju
• Istaknuti članak - za prikaz na početnoj strani bloga
• Ne indeksiraj - za skrivanje od pretraživača`,
    }),
  ],
});
