import { sanityClient } from "@/lib/sanity.client";
import {
  glossaryTermBySlugQuery,
  type SanityGlossaryTerm,
} from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import { buildGlossaryJsonLd } from "@/lib/structured-data/glossary-jsonld";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import CopyLinkButton from "@/components/glossary/CopyLinkButton";
import TermInitialAvatar from "@/components/glossary/TermInitialAvatar";

export const revalidate = 3600; // ISR: revalidate every hour

// Helper function to format date as dd.mm.yyyy
function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const term = await sanityClient.fetch<SanityGlossaryTerm | null>(
    glossaryTermBySlugQuery,
    { slug: params.slug }
  );

  if (!term) {
    return {
      title: "Termin nije pronađen – Odontoa Rečnik",
      description: "Traženi termin trenutno nije dostupan.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const coverImageUrl = term.coverImage
    ? urlFor(term.coverImage).width(1200).height(630).url()
    : `${baseUrl}/og/odontoa-default.png`;

  const title = term.seoTitle || term.term;
  const description = term.metaDescription || term.definition || "";

  return {
    title: `${title} – Odontoa Rečnik`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: term.publishedAt,
      modifiedTime: term.updatedAt || term.publishedAt,
      images: [{ url: coverImageUrl, width: 1200, height: 630, alt: term.term }],
    },
    alternates: {
      canonical: term.canonicalUrl || `${baseUrl}/recnik/${params.slug}`,
    },
    robots: term.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: { slug: string };
}) {
  const term = await sanityClient.fetch<SanityGlossaryTerm | null>(
    glossaryTermBySlugQuery,
    { slug: params.slug }
  );

  if (!term) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const coverImageUrl = term.coverImage
    ? urlFor(term.coverImage).width(1200).height(630).url()
    : `${baseUrl}/og/odontoa-default.png`;

  // Build JSON-LD schema (strictly follows Odontoa SEO/LLM rules)
  const jsonLd = buildGlossaryJsonLd(
    { ...term, coverImageUrl },
    baseUrl
  );

  const currentUrl = `${baseUrl}/recnik/${params.slug}`;
  const displayDate = formatDateShort(term.updatedAt || term.publishedAt);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <article className="min-h-screen bg-background pt-20">
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Početna</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/recnik">Rečnik</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{term.term}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {!term.coverImage && <TermInitialAvatar term={term.term} />}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {term.term}
                  </h1>
                  {term.definition && (
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                      {term.definition}
                    </p>
                  )}
                </div>
              </div>
              <CopyLinkButton url={currentUrl} />
            </div>

            {/* Meta Row */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {term.category && (
                <Badge variant="secondary">{term.category}</Badge>
              )}
              <span>{displayDate}</span>
              <Link href="/recnik">
                <Button variant="ghost" size="sm" className="h-auto p-0 hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Nazad na Rečnik
                </Button>
              </Link>
            </div>
          </header>

          {/* Illustration */}
          {term.coverImage && (
            <div className="mb-10">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                Ilustracija
              </h2>
              <Card>
                <CardContent className="p-0">
                  <Image
                    src={coverImageUrl}
                    alt={term.coverImageAlt || term.term}
                    width={1200}
                    height={630}
                    className="w-full object-cover rounded-xl max-h-72"
                    priority
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Full Article Content */}
          {term.fullArticle ? (
            <div className="prose prose-slate max-w-none mt-10 prose-headings:mt-8 prose-headings:mb-4 prose-p:my-4 prose-li:my-2">
              <PortableTextRenderer content={term.fullArticle} />
            </div>
          ) : (
            <div className="mt-10 text-muted-foreground italic">
              Detaljno objašnjenje biće dodato uskoro.
            </div>
          )}

          {/* Related Terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <>
              <Separator className="my-10" />
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Povezani termini
                </h2>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.slice(0, 8).map((related) => (
                    <Link
                      key={related.slug}
                      href={`/recnik/${related.slug}`}
                    >
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1.5 hover:bg-primary/5 hover:border-primary/30 transition-colors"
                      >
                        {related.term}
                      </Badge>
                    </Link>
                  ))}
                </div>
            </section>
            </>
          )}

          {/* FAQ Section - must match FAQPage JSON-LD (1:1 with visible content) */}
          {term.faqs && term.faqs.length > 0 && (
            <>
              <Separator className="my-10" />
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                Često postavljena pitanja
              </h2>
                <Accordion type="single" collapsible className="w-full">
                  {term.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-border/60">
                      <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        <PortableTextRenderer content={faq.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </section>
            </>
          )}
        </div>
      </article>
    </>
  );
}
