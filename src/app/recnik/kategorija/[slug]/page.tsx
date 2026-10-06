import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ensureRecnikValid,
  getCategoriesWithTerms,
  getCategoryBySlug,
  getCategoryPath,
  getPublishedTermsByCategory,
  getTermPath,
  isCategoryIndexable,
} from "@/lib/content/recnik";
import { pageMetadata } from "@/lib/seo/metadata";
import { buildGlossaryCategoryJsonLd } from "@/lib/structured-data/glossary-jsonld";
import JsonLd from "@/components/seo/JsonLd";
import RecnikBreadcrumbs from "@/components/glossary/RecnikBreadcrumbs";
import { displayFont } from "@/app/(site)/display-font";
import "@/app/(site)/site.css";
import "@/app/(site)/funkcionalnosti/feature-page.css";
import "../../recnik.css";

type Params = { params: { slug: string } };

/* Stranica postoji samo za kategoriju sa bar jednim objavljenim pojmom. Noindex je dok
   kategorija nema indexable: true i odobren seoTitle/metaDescription (RECNIK_CATEGORIES),
   pa nije ni u sitemap-u. Bez generickog SEO teksta: prikazuje se samo spisak pojmova. */
export const dynamicParams = false;

export function generateStaticParams() {
  ensureRecnikValid();
  return getCategoriesWithTerms().map((c) => ({ slug: c.slug }));
}

function descriptionOf(title: string, count: number) {
  return `Pojmovi iz kategorije ${title} u Odontoa stomatološkom rečniku (${count}).`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: "Kategorija nije pronađena – Odontoa Rečnik", robots: { index: false, follow: false } };

  const indexable = isCategoryIndexable(category);
  const count = getPublishedTermsByCategory(category.id).length;
  return pageMetadata({
    title: indexable ? category.seoTitle! : `${category.title} – Odontoa Rečnik`,
    description: indexable ? category.metaDescription! : descriptionOf(category.title, count),
    path: getCategoryPath(category),
    noindex: !indexable,
  });
}

export default function GlossaryCategoryPage({ params }: Params) {
  const category = getCategoryBySlug(params.slug);
  const terms = category ? getPublishedTermsByCategory(category.id) : [];
  if (!category || terms.length === 0) {
    notFound();
  }

  const path = getCategoryPath(category);
  const description = isCategoryIndexable(category)
    ? category.metaDescription!
    : descriptionOf(category.title, terms.length);

  return (
    <>
      <JsonLd data={buildGlossaryCategoryJsonLd(category, description)} />

      <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
        <header className="page-hero recnik-hero">
          <div className="page-hero__inner">
            <RecnikBreadcrumbs
              items={[
                { name: "Početna", path: "/" },
                { name: "Rečnik", path: "/recnik" },
                { name: category.title, path },
              ]}
            />
            <h1 className="page-hero__title">{category.title}</h1>
            {category.shortDescription && <p className="page-hero__lead">{category.shortDescription}</p>}
            <p className="recnik-count">
              {terms.length} {terms.length === 1 ? "termin" : "termina"}
            </p>
          </div>
        </header>

        <section className="page-section page-section--alt">
          <div className="recnik-narrow">
            <ul className="recnik-category-list">
              {terms.map((term) => (
                <li key={term.id}>
                  <Link href={getTermPath(term)} className="recnik-category-list__link">
                    {term.publicTitle}
                  </Link>
                  <p className="recnik-category-list__def">{term.shortDefinition}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page-cta">
          <div className="page-cta__inner">
            <h2 className="page-cta__title">Ceo rečnik</h2>
            <p className="page-cta__lead">Svi pojmovi, po abecedi i kategorijama.</p>
            <div className="page-cta__actions">
              <Link href="/recnik" className="hero__btn hero__btn--primary">
                Nazad na rečnik
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
