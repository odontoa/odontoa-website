import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
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
      name: "name",
      title: "Ime",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      description: "Unos: URL slug autora. Automatski: generiše se iz imena.",
    }),
    defineField({
      name: "bio",
      title: "Kratka biografija",
      type: "text",
    }),
    defineField({
      name: "url",
      title: "URL autora",
      type: "url",
      description: "Unos: link ka stranici autora na sajtu (koristi se u schema).",
    }),
    defineField({
      name: "avatar",
      title: "Avatar slika",
      type: "image",
      options: { hotspot: true },
    }),
    // Help fieldset
    defineField({
      name: "helpText",
      title: "Pomoć",
      type: "text",
      readOnly: true,
      rows: 8,
      fieldset: "help",
      initialValue: `Pomoć - Kako sistem radi

AUTOMATSKI GENERIŠE:
• Slug - iz imena

MORATE DA POPUNITE:
• Ime (obavezno)

OPCIONO:
• Kratka biografija
• URL autora
• Avatar slika`,
    }),
  ],
});
