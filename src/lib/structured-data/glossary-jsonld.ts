import type { RecnikTerm } from "../content/recnik";

/**
 * Builds JSON-LD structured data for glossary terms following Odontoa SEO/LLM rules.
 * Returns array: [WebPage, BreadcrumbList, Article, FAQPage?]
 * 
 * Rules:
 * - Combined JSON-LD in single array
 * - @context only on FIRST object (not repeated)
 * - datePublished and dateModified in ISO 8601
 * - Article.image (fallback to default OG if not provided)
 * - author.url is REQUIRED (fallback to /o-nama)
 * - inLanguage: "sr"
 * - FAQPage only if FAQs exist and are 1:1 in visible content
 *
 * Izvor je lokalni recnik (src/lib/content/recnik.ts), ne Sanity.
 */
export function buildGlossaryJsonLd(term: RecnikTerm, baseUrl: string) {
  const url = `${baseUrl}/recnik/${term.slug}`;
  const title = term.seoTitle || term.term;
  const description = term.metaDescription || term.definition || "";
  
  // ISO 8601 dates
  const datePublished = new Date(term.publishedAt).toISOString();
  const dateModified = new Date(term.updatedAt || term.publishedAt).toISOString();
  
  // Image fallback to default OG if not provided
  const imageUrl = term.coverImage ? `${baseUrl}${term.coverImage.src}` : `${baseUrl}/og/odontoa-default.png`;
  
  // Author URL is REQUIRED (fallback to /o-nama)
  const authorUrl = `${baseUrl}/o-nama`;
  const authorName = term.author || "Odontoa Tim";

  // FAQ entiteti iz istog niza koji se prikazuje na stranici (1:1)
  const faqEntities = (term.faqs ?? []).map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  // Combined schema array: [WebPage, BreadcrumbList, Article, FAQPage?]
  // @context only on FIRST object
  return [
    {
      "@context": "https://schema.org", // ONLY HERE
      "@type": "WebPage",
      "@id": url,
      url,
      name: title,
      description,
      inLanguage: "sr",
      datePublished,
      dateModified,
      author: {
        "@type": "Person",
        name: authorName,
        url: authorUrl, // REQUIRED
      },
      publisher: {
        "@type": "Organization",
        name: "Odontoa",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/Odontoa-New-logo-pack-2026/horiyotal_color.png`,
        },
      },
    },
    {
      // No @context here
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Početna",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Rečnik",
          item: `${baseUrl}/recnik`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: term.term,
          item: url,
        },
      ],
    },
    {
      // No @context here
      "@type": "Article",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      headline: title,
      description,
      image: imageUrl, // Fallback to default OG if not provided
      datePublished, // ISO 8601
      dateModified, // ISO 8601
      author: {
        "@type": "Person",
        name: authorName,
        url: authorUrl, // REQUIRED
      },
      publisher: {
        "@type": "Organization",
        name: "Odontoa",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/Odontoa-New-logo-pack-2026/horiyotal_color.png`,
        },
      },
      inLanguage: "sr",
    },
    // FAQPage only if FAQs exist
    ...(faqEntities.length > 0
      ? [
          {
            // No @context here
            "@type": "FAQPage",
            mainEntity: faqEntities,
          },
        ]
      : []),
  ];
}
