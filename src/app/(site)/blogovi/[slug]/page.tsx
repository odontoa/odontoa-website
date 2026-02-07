import { sanityClient } from "@/lib/sanity.client";
import {
  blogPostBySlugQuery,
  blogPostSlugsQuery,
  type SanityBlogPost,
} from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import { buildBlogJsonLd } from "@/lib/structured-data/blog-jsonld";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlogViewTracker } from "@/components/BlogViewTracker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch(blogPostSlugsQuery);
    return slugs.map((item: { slug: string }) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await sanityClient.fetch<SanityBlogPost | null>(
    blogPostBySlugQuery,
    { slug: params.slug }
  );

  if (!post) {
    return {
      title: "Članak nije pronađen – Odontoa",
      description: "Traženi članak trenutno nije dostupan.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : `${baseUrl}/og/odontoa-default.png`;

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";

  return {
    title: `${title} – Odontoa`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author?.name || "Odontoa tim"],
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImageUrl],
    },
    alternates: {
      canonical: post.canonicalUrl || `${baseUrl}/blogovi/${params.slug}`,
    },
    robots: post.noindex 
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

function formatToSerbianDate(isoString: string): string {
  const date = new Date(isoString);
  const months = [
    "januar", "februar", "mart", "april", "maj", "jun",
    "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}. ${month} ${year}`;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await sanityClient.fetch<SanityBlogPost | null>(
    blogPostBySlugQuery,
    { slug: params.slug }
  );

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : `${baseUrl}/og/odontoa-default.png`;

  // Build JSON-LD with cover image URL
  const jsonLd = buildBlogJsonLd(
    { ...post, coverImageUrl },
    baseUrl
  );

  const publishedAt = formatToSerbianDate(post.publishedAt);
  const updatedAt = post.updatedAt && post.updatedAt !== post.publishedAt 
    ? formatToSerbianDate(post.updatedAt) 
    : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Blog view tracking */}
      <BlogViewTracker slug={params.slug} title={post.title} />

      <div className="min-h-screen bg-white pt-20">
        <article className="mx-auto max-w-3xl px-4 py-10">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Link href="/blogovi">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Vrati se na sve članke
              </Link>
            </Button>
          </div>

          <header className="mb-8 flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight text-foreground dark:text-white">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
              <div className="flex flex-col">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {post.author?.name || "Odontoa tim"}
                </span>
                <div className="flex flex-col gap-1">
                  <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
                    Objavljeno: {publishedAt}
                  </time>
                  {updatedAt && (
                    <time dateTime={post.updatedAt} className="text-xs text-muted-foreground">
                      Ažurirano: {updatedAt}
                    </time>
                  )}
                </div>
              </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src={coverImageUrl}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt / description */}
          {post.excerpt && (
            <p className="mb-6 text-lg text-slate-700 dark:text-slate-300">
              {post.excerpt}
            </p>
          )}

          {/* Main content - PortableText */}
          {post.content && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <PortableTextRenderer content={post.content} />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )}

          {/* FAQ Section - must match FAQPage JSON-LD */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-12 border-t border-slate-200 pt-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-foreground mb-6 dark:text-white">
                Često postavljena pitanja
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {post.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-slate-200">
                    <AccordionTrigger className="text-left text-base font-semibold text-slate-900 dark:text-white hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-700 dark:text-slate-300">
                      <PortableTextRenderer content={faq.answer} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
