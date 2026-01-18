import { defineType, defineField } from "sanity";

export default defineType({
  name: "tag",
  title: "Tag",
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
      description: "Unos: URL slug taga. Automatski: generiše se iz naslova.",
    }),
    // Help fieldset
    defineField({
      name: "helpText",
      title: "Pomoć",
      type: "text",
      readOnly: true,
      rows: 6,
      fieldset: "help",
      initialValue: `Pomoć - Kako sistem radi

AUTOMATSKI GENERIŠE:
• Slug - iz naslova

MORATE DA POPUNITE:
• Naslov (obavezno)`,
    }),
  ],
});
