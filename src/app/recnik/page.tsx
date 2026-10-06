import type { Metadata } from "next";
import {
  ensureRecnikValid,
  getCategoriesWithTerms,
  getCategoryPath,
  getTermSummaries,
} from "@/lib/content/recnik";
import { pageMetadata } from "@/lib/seo/metadata";
import { buildGlossaryIndexJsonLd } from "@/lib/structured-data/glossary-jsonld";
import JsonLd from "@/components/seo/JsonLd";
import RecnikBreadcrumbs from "@/components/glossary/RecnikBreadcrumbs";
import GlossaryClient from "./glossary-client";

const DESCRIPTION =
  "Kompletan stomatološki rečnik sa objašnjenjima termina, kategorijama i povezanim terminima. Pronađite sve što vam treba o stomatologiji.";

export const metadata: Metadata = pageMetadata({
  title: "Rečnik | Odontoa - Stomatološki rečnik",
  description: DESCRIPTION,
  socialDescription: "Kompletan stomatološki rečnik sa objašnjenjima termina, kategorijama i povezanim terminima.",
  keywords: "rečnik, stomatologija, termini, definicije, Odontoa, stomatološki rečnik",
  path: "/recnik",
});

/* Recnik je lokalni sadrzaj (src/lib/content/recnik), stranica je staticka.
   Klijent dobija samo lagane sazetke (RecnikTermSummary), bez clanaka, FAQ-a i izvora. */
export default function GlossaryPage() {
  ensureRecnikValid();
  const categories = getCategoriesWithTerms().map((c) => ({
    id: c.id,
    title: c.title,
    path: getCategoryPath(c),
    termCount: c.termCount,
  }));

  return (
    <>
      <JsonLd data={buildGlossaryIndexJsonLd(DESCRIPTION)} />
      <GlossaryClient
        terms={getTermSummaries()}
        categories={categories}
        breadcrumbs={
          <RecnikBreadcrumbs
            items={[
              { name: "Početna", path: "/" },
              { name: "Rečnik", path: "/recnik" },
            ]}
          />
        }
      />
    </>
  );
}
