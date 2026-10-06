import {
  getPublishedTerm,
  getPublishedTerms,
  getRelatedTerms,
} from "@/lib/content/recnik";
import { buildGlossaryJsonLd } from "@/lib/structured-data/glossary-jsonld";
import GlossaryArticle from "@/components/glossary/GlossaryArticle";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CopyLinkButton from "@/components/glossary/CopyLinkButton";
import { GlossaryViewTracker } from "@/components/GlossaryViewTracker";
import { displayFont } from "@/app/(site)/display-font";
/* Isti sistem kao stranice funkcionalnosti: --stellar-* tokeni sa .site-page,
   hero/sekcije/FAQ/CTA iz feature-page.css, ostatak u recnik.css. */
import "@/app/(site)/site.css";
import "@/app/(site)/funkcionalnosti/feature-page.css";
import "../recnik.css";

function BackIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13 8H3m0 0l4-4M3 8l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="page-faq__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Recnik je lokalni sadrzaj (src/lib/content/recnik.ts): sve stranice se generisu staticki
   pri build-u, a nepoznat slug je 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedTerms().map((term) => ({ slug: term.slug }));
}

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
  const term = getPublishedTerm(params.slug);

  if (!term) {
    return {
      title: "Termin nije pronađen – Odontoa Rečnik",
      description: "Traženi termin trenutno nije dostupan.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const coverImageUrl = term.coverImage
    ? `${baseUrl}${term.coverImage.src}`
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImageUrl],
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
  const term = getPublishedTerm(params.slug);

  if (!term) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";

  // Build JSON-LD schema (strictly follows Odontoa SEO/LLM rules)
  const jsonLd = buildGlossaryJsonLd(term, baseUrl);

  const currentUrl = `${baseUrl}/recnik/${params.slug}`;
  const displayDate = formatDateShort(term.updatedAt || term.publishedAt);

  const relatedTerms = getRelatedTerms(term).slice(0, 8);
  const faqs = term.faqs ?? [];

  /* Podloge sekcija se smenjuju (bela / siva) bez obzira na to koje sekcije
     termin ima, da se dve iste podloge ne dodirnu. Clanak je uvek bela. */
  let tone = 0;
  const nextTone = () =>
    tone++ % 2 === 0 ? "page-section" : "page-section page-section--alt";

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Glossary view tracking */}
      <GlossaryViewTracker slug={params.slug} term={term.term} />

      <article className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
        {/* ── Hero termina ── */}
        <header className="page-hero recnik-hero">
          <div className="page-hero__inner">
            <Link href="/recnik" className="page-hero__eyebrow">
              <BackIcon />
              Rečnik
            </Link>
            <h1 className="page-hero__title">{term.term}</h1>
            {term.definition && <p className="page-hero__lead">{term.definition}</p>}

            <div className="recnik-meta">
              {term.category && <span className="recnik-chip">{term.category}</span>}
              <span>Ažurirano {displayDate}</span>
              <CopyLinkButton url={currentUrl} />
            </div>
          </div>
        </header>

        {/* ── Ilustracija + clanak ── */}
        <section className={nextTone()}>
          <div className="recnik-narrow">
            {term.coverImage && (
              <Image
                src={term.coverImage.src}
                alt={term.coverImage.alt || term.term}
                width={term.coverImage.width}
                height={term.coverImage.height}
                className="recnik-cover"
                priority
              />
            )}

            {term.article.length > 0 ? (
              <div className="recnik-article">
                <GlossaryArticle blocks={term.article} />
              </div>
            ) : (
              <p className="recnik-soon">Detaljno objašnjenje biće dodato uskoro.</p>
            )}
          </div>
        </section>

        {/* ── Povezani termini ── */}
        {relatedTerms.length > 0 && (
          <section className={nextTone()}>
            <div className="recnik-narrow">
              <p className="page-section__eyebrow">
                <span className="page-section__dash" aria-hidden="true" />
                Rečnik
              </p>
              <h2 className="page-section__title">Povezani termini</h2>
              <div className="recnik-tags">
                {relatedTerms.map((related) => (
                  <Link key={related.slug} href={`/recnik/${related.slug}`} className="recnik-tag">
                    {related.term}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ: mora da se poklapa sa FAQPage JSON-LD (1:1 sa vidljivim sadrzajem) ── */}
        {faqs.length > 0 && (
          <section className={nextTone()}>
            <div className="recnik-narrow">
              <p className="page-section__eyebrow">
                <span className="page-section__dash" aria-hidden="true" />
                Pitanja
              </p>
              <h2 className="page-section__title">Često postavljena pitanja</h2>
              <div className="page-faq">
                {faqs.map((faq, index) => (
                  <details key={index} className="page-faq__item">
                    <summary className="page-faq__q">
                      {faq.question}
                      <PlusIcon />
                    </summary>
                    <div className="page-faq__a recnik-faq-answer">
                      <div className="prose prose-lg max-w-none">
                        <p className="mb-4 leading-7">{faq.answer}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Zavrsni CTA ── */}
        <section className="page-cta">
          <div className="page-cta__inner">
            <h2 className="page-cta__title">Vodite ordinaciju bez papira</h2>
            <p className="page-cta__lead">
              Zakazivanje, digitalni karton, RTG snimci i finansije, sve u jednom sistemu.
            </p>
            <div className="page-cta__actions">
              <Link href="/register" className="hero__btn hero__btn--primary">
                Započni besplatno
              </Link>
              <Link href="/recnik" className="page-cta__ghost">
                Nazad na rečnik
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
