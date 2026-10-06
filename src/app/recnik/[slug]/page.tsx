import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ensureRecnikValid,
  getCategoryById,
  getCategoryPath,
  getPublishedTermBySlug,
  getPublishedTerms,
  getTermLinks,
  getTermPath,
  getTermReviewer,
  getTermSources,
  termCanonicalPath,
  type RecnikTerm,
} from "@/lib/content/recnik";
import { resolveBlogLinks } from "@/lib/content/recnik/blog-links";
import { absoluteUrl } from "@/lib/config/site-url";
import { DEFAULT_OG_IMAGE, pageMetadata } from "@/lib/seo/metadata";
import { buildGlossaryTermJsonLd } from "@/lib/structured-data/glossary-jsonld";
import type { BreadcrumbItem } from "@/lib/structured-data/page-graph";
import JsonLd from "@/components/seo/JsonLd";
import GlossaryArticle from "@/components/glossary/GlossaryArticle";
import RecnikBreadcrumbs from "@/components/glossary/RecnikBreadcrumbs";
import TrackedGlossaryLink from "@/components/glossary/TrackedGlossaryLink";
import CopyLinkButton from "@/components/glossary/CopyLinkButton";
import { GlossaryViewTracker } from "@/components/GlossaryViewTracker";
import { displayFont } from "@/app/(site)/display-font";
import { formatDateSr } from "../format-date";
/* Isti sistem kao stranice funkcionalnosti: --stellar-* tokeni sa .site-page,
   hero/sekcije/FAQ/CTA iz feature-page.css, ostatak u recnik.css. */
import "@/app/(site)/site.css";
import "@/app/(site)/funkcionalnosti/feature-page.css";
import "../recnik.css";

type Params = { params: { slug: string } };

function PlusIcon() {
  return (
    <svg className="page-faq__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m0 0l-4-4m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Recnik je lokalni sadrzaj (src/lib/content/recnik): sve stranice se generisu staticki
   pri build-u, a nepoznat ili neobjavljen slug je 404. Dataset sa greskama rusi build. */
export const dynamicParams = false;

export function generateStaticParams() {
  ensureRecnikValid();
  return getPublishedTerms().map((term) => ({ slug: term.slug }));
}

function ogImageOf(term: RecnikTerm) {
  const img = term.seo.ogImage ?? term.coverImage;
  return img ? { url: img.src, width: img.width, height: img.height, alt: img.alt } : DEFAULT_OG_IMAGE;
}

function breadcrumbsOf(term: RecnikTerm): BreadcrumbItem[] {
  const category = getCategoryById(term.categoryId);
  return [
    { name: "Početna", path: "/" },
    { name: "Rečnik", path: "/recnik" },
    ...(category ? [{ name: category.title, path: getCategoryPath(category) }] : []),
    { name: term.publicTitle, path: getTermPath(term) },
  ];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const term = getPublishedTermBySlug(params.slug);
  if (!term) {
    return { title: "Termin nije pronađen – Odontoa Rečnik", robots: { index: false, follow: false } };
  }

  return pageMetadata({
    title: `${term.seo.seoTitle} – Odontoa Rečnik`,
    description: term.seo.metaDescription || term.shortDefinition,
    socialTitle: term.seo.seoTitle,
    path: getTermPath(term),
    canonical: termCanonicalPath(term),
    image: ogImageOf(term),
    ogType: "article",
    publishedTime: term.publishedAt,
    modifiedTime: term.updatedAt || term.publishedAt,
    noindex: term.seo.noindex,
  });
}

export default async function GlossaryTermPage({ params }: Params) {
  const term = getPublishedTermBySlug(params.slug);
  if (!term) {
    notFound();
  }

  const path = getTermPath(term);
  const category = getCategoryById(term.categoryId);
  const sources = getTermSources(term);
  const reviewer = getTermReviewer(term);
  const links = getTermLinks(term);
  const blogLinks = await resolveBlogLinks(links.blogSlugs);
  const faqs = term.faqs ?? [];
  const breadcrumbs = breadcrumbsOf(term);
  const source = { glossaryTerm: term.medicalCanonicalTerm, contentId: term.id };

  const jsonLd = buildGlossaryTermJsonLd({
    term,
    category,
    sources,
    reviewer,
    breadcrumbs,
    faqs,
    imageUrl: absoluteUrl(ogImageOf(term).url),
  });

  const updatedAt = term.updatedAt && term.updatedAt !== term.publishedAt ? term.updatedAt : undefined;
  const showCanonicalName = term.medicalCanonicalTerm !== term.publicTitle;

  /* Podloge sekcija se smenjuju (bela / siva) bez obzira na to koje sekcije
     termin ima, da se dve iste podloge ne dodirnu. Clanak je uvek bela. */
  let tone = 0;
  const nextTone = () =>
    tone++ % 2 === 0 ? "page-section" : "page-section page-section--alt";

  return (
    <>
      <JsonLd data={jsonLd} />

      <GlossaryViewTracker
        contentId={term.id}
        glossaryTerm={term.medicalCanonicalTerm}
        seoEntryTerm={term.seo.seoEntryTerm}
        glossaryCluster={term.clusterId}
        categoryId={term.categoryId}
        pagePath={path}
      />

      <article className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
        {/* ── Hero termina ── */}
        <header className="page-hero recnik-hero">
          <div className="page-hero__inner">
            <RecnikBreadcrumbs items={breadcrumbs} />
            <h1 className="page-hero__title">{term.publicTitle}</h1>
            <p className="page-hero__lead">{term.shortDefinition}</p>

            {(showCanonicalName || term.latinTerm) && (
              <p className="recnik-terminology">
                {showCanonicalName && (
                  <span>
                    Stručni naziv: <strong>{term.medicalCanonicalTerm}</strong>
                  </span>
                )}
                {term.latinTerm && (
                  <span>
                    Latinski: <em lang="la">{term.latinTerm}</em>
                  </span>
                )}
              </p>
            )}

            <div className="recnik-meta">
              {category && (
                <Link href={getCategoryPath(category)} className="recnik-chip">
                  {category.title}
                </Link>
              )}
              <span>
                Objavljeno <time dateTime={term.publishedAt}>{formatDateSr(term.publishedAt)}</time>
              </span>
              {updatedAt && (
                <span>
                  Ažurirano <time dateTime={updatedAt}>{formatDateSr(updatedAt)}</time>
                </span>
              )}
              <CopyLinkButton url={absoluteUrl(path)} />
            </div>

            {reviewer && (
              <p className="recnik-reviewer">
                Stručno pregledao/la:{" "}
                {reviewer.profileUrl ? (
                  <a href={reviewer.profileUrl} rel="noopener noreferrer">{reviewer.name}</a>
                ) : (
                  <strong>{reviewer.name}</strong>
                )}
                , {reviewer.title}
                {term.clinicalReview.reviewedAt && (
                  <>
                    {" · "}
                    <time dateTime={term.clinicalReview.reviewedAt}>
                      {formatDateSr(term.clinicalReview.reviewedAt)}
                    </time>
                  </>
                )}
              </p>
            )}
          </div>
        </header>

        {/* ── Ilustracija + clanak ── */}
        <section className={nextTone()}>
          <div className="recnik-narrow">
            {term.coverImage && (
              <Image
                src={term.coverImage.src}
                alt={term.coverImage.alt}
                width={term.coverImage.width}
                height={term.coverImage.height}
                className="recnik-cover"
                sizes="(max-width: 800px) 100vw, 760px"
                priority
              />
            )}

            {term.article.length > 0 ? (
              <div className="recnik-article">
                <GlossaryArticle blocks={term.article} term={term} />
              </div>
            ) : (
              <p className="recnik-soon">Detaljno objašnjenje biće dodato uskoro.</p>
            )}
          </div>
        </section>

        {/* ── Izvori: vidljivi na stranici, isti spisak je citation u JSON-LD-u ── */}
        {sources.length > 0 && (
          <section className={nextTone()} aria-labelledby="izvori">
            <div className="recnik-narrow">
              <h2 id="izvori" className="recnik-sources__title">Izvori i literatura</h2>
              <ol className="recnik-sources">
                {sources.map((s) => (
                  <li key={s.id}>
                    {s.url ? (
                      <a href={s.url} rel="noopener noreferrer">{s.title}</a>
                    ) : (
                      <span>{s.title}</span>
                    )}
                    <span className="recnik-sources__meta">
                      {s.publisher}
                      {s.accessedAt && <> · pristupljeno <time dateTime={s.accessedAt}>{formatDateSr(s.accessedAt)}</time></>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ── Povezani termini ── */}
        {links.relatedTerms.length > 0 && (
          <section className={nextTone()}>
            <div className="recnik-narrow">
              <p className="page-section__eyebrow">
                <span className="page-section__dash" aria-hidden="true" />
                Rečnik
              </p>
              <h2 className="page-section__title">Povezani termini</h2>
              <div className="recnik-tags">
                {links.relatedTerms.map((related) => (
                  <TrackedGlossaryLink
                    key={related.id}
                    href={getTermPath(related)}
                    className="recnik-tag"
                    kind="content"
                    contentType="glossary_term"
                    contentId={related.id}
                    source={source}
                  >
                    {related.publicTitle}
                  </TrackedGlossaryLink>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Funkcionalnosti i landing stranice ── */}
        {(links.features.length > 0 || links.landingPages.length > 0) && (
          <section className={`${nextTone()} page-section--related`}>
            <div className="recnik-narrow">
              <p className="page-section__eyebrow">
                <span className="page-section__dash" aria-hidden="true" />
                Odontoa
              </p>
              <h2 className="page-section__title">Kako to izgleda u Odontoi</h2>
              <div className="page-related__grid">
                {links.features.map((feature) => (
                  <TrackedGlossaryLink
                    key={feature.slug}
                    href={`/funkcionalnosti/${feature.slug}`}
                    className="page-related__card"
                    kind="content"
                    contentType="feature_page"
                    contentId={feature.slug}
                    source={source}
                  >
                    {feature.navTitle}
                    <ArrowIcon />
                  </TrackedGlossaryLink>
                ))}
                {links.landingPages.map((landing) => (
                  <TrackedGlossaryLink
                    key={landing.path}
                    href={landing.path}
                    className="page-related__card"
                    kind="content"
                    contentType="landing_page"
                    contentId={landing.path}
                    source={source}
                  >
                    {landing.title}
                    <ArrowIcon />
                  </TrackedGlossaryLink>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Povezani blogovi (samo dok je blog javan i post postoji) ── */}
        {blogLinks.length > 0 && (
          <section className={nextTone()}>
            <div className="recnik-narrow">
              <p className="page-section__eyebrow">
                <span className="page-section__dash" aria-hidden="true" />
                Blog
              </p>
              <h2 className="page-section__title">Povezani članci</h2>
              <div className="recnik-tags">
                {blogLinks.map((post) => (
                  <TrackedGlossaryLink
                    key={post.slug}
                    href={post.path}
                    className="recnik-tag"
                    kind="content"
                    contentType="blog_post"
                    contentId={post.slug}
                    source={source}
                  >
                    {post.title}
                  </TrackedGlossaryLink>
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
                      <p>{faq.answer}</p>
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
            <h2 className="page-cta__title">{links.cta.title}</h2>
            <p className="page-cta__lead">{links.cta.lead}</p>
            <div className="page-cta__actions">
              <TrackedGlossaryLink
                href={links.cta.primary.href}
                className="hero__btn hero__btn--primary"
                kind="cta"
                ctaName={`recnik_${links.cta.id}`}
                source={source}
              >
                {links.cta.primary.label}
              </TrackedGlossaryLink>
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
