import type { SanityBlogPost } from "../sanity.queries";

/**
 * Builds JSON-LD structured data for Sanity blog posts following Odontoa standard.
 * Returns an array with [WebPage, BreadcrumbList, Article, FAQPage?]
 * 
 * If schemaOverrideJson is provided and valid, it will be used instead of auto-generated schema.
 */
export function buildBlogJsonLd(post: SanityBlogPost & { coverImageUrl?: string }, baseUrl: string) {
  // Check for schema override first
  if (post.schemaOverrideJson) {
    try {
      const override = JSON.parse(post.schemaOverrideJson);
      if (Array.isArray(override)) {
        // Validate that it has required types
        const types = override.map((s: any) => s["@type"]).filter(Boolean);
        const required = ["WebPage", "BreadcrumbList", "Article", "FAQPage"];
        const hasAllRequired = required.every((r) => types.includes(r));
        if (hasAllRequired) {
          return override;
        }
      }
    } catch (error) {
      console.error("Invalid schemaOverrideJson, falling back to auto-generated schema:", error);
      // Fall through to auto-generated schema
    }
  }

  const url = `${baseUrl}/blogovi/${post.slug}`;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";
  const breadcrumbName = post.title;
  const datePublished = new Date(post.publishedAt).toISOString();
  const dateModified = new Date(post.updatedAt || post.publishedAt).toISOString();

  // Use provided cover image URL or fallback to default
  const imageUrl = post.coverImageUrl || `${baseUrl}/og/odontoa-default.png`;

  // Build FAQ entities from Sanity FAQ data
  const faqEntities =
    post.faqs && post.faqs.length > 0
      ? post.faqs.map((faq) => {
          // Extract plain text from PortableText blocks
          const answerText = faq.answer
            ? faq.answer
                .map((block: any) => {
                  if (block._type === "block" && block.children) {
                    return block.children
                      .map((child: any) => child.text || "")
                      .join("");
                  }
                  return "";
                })
                .join(" ")
            : "";

          return {
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answerText,
            },
          };
        })
      : [];

  const hasFaqs = faqEntities.length > 0;

  // 1. WebPage schema
  const webpage = {
    "@context": "https://schema.org",
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
      name: post.author?.name || "Odontoa tim",
      url: post.author?.url || post.authorUrl || `${baseUrl}/o-nama`,
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
  };

  // 2. BreadcrumbList schema
  const breadcrumb = {
    "@context": "https://schema.org",
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
        name: "Blogovi",
        item: `${baseUrl}/blogovi`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: breadcrumbName,
        item: url,
      },
    ],
  };

  // 3. Article schema
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    description,
    image: imageUrl,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: post.author?.name || "Odontoa tim",
      url: post.author?.url || post.authorUrl || `${baseUrl}/o-nama`,
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
  };

  // 4. FAQPage schema (only if FAQs exist)
  const faqPage = hasFaqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqEntities,
      }
    : null;

  // Build array: always include WebPage, BreadcrumbList, Article
  // Include FAQPage only if FAQs exist
  const jsonLdArray: any[] = [webpage, breadcrumb, article];
  if (faqPage) {
    jsonLdArray.push(faqPage);
  }

  return jsonLdArray;
}

