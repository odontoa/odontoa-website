interface FaqItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BuildToolJsonLdParams {
  name: string;
  description: string;
  url: string;
  baseUrl: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FaqItem[];
  datePublished?: string;
  dateModified?: string;
}

export function buildToolJsonLd({
  name,
  description,
  url,
  baseUrl,
  breadcrumbs,
  faqs,
  datePublished,
  dateModified,
}: BuildToolJsonLdParams) {
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    description,
    inLanguage: "sr",
    isPartOf: {
      "@type": "WebSite",
      url: baseUrl,
      name: "Odontoa",
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
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  const jsonLdArray: Record<string, unknown>[] = [webpage, breadcrumbList];

  if (faqs && faqs.length > 0) {
    jsonLdArray.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  return jsonLdArray;
}
