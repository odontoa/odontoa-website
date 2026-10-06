import type { Metadata } from "next";
import DigitalReadinessTool from "@/components/alati/DigitalReadinessTool";
import FaqSection from "@/components/alati/FaqSection";
import RelatedTools from "@/components/alati/RelatedTools";
import { FAQ_ITEMS } from "@/components/alati/quiz-data";
import { buildToolJsonLd } from "@/lib/structured-data/tool-jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import "../alati.css";

const TITLE =
  "Test digitalne spremnosti stomatološke ordinacije | Odontoa";
const DESCRIPTION =
  "Besplatan test od 12 pitanja koji ti pokazuje koliko je tvoja ordinacija digitalno organizovana. Bez registracije, rezultat odmah.";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/alati/digitalna-spremnost-ordinacije" });
}

export default function DigitalReadinessPage() {
  const path = "/alati/digitalna-spremnost-ordinacije";

  const jsonLd = buildToolJsonLd({
    name: "Test digitalne spremnosti stomatološke ordinacije",
    description: DESCRIPTION,
    path,
    breadcrumbs: [
      { name: "Početna", path: "/" },
      { name: "Alati", path: "/alati" },
      {
        name: "Test digitalne spremnosti ordinacije",
        path,
      },
    ],
    faqs: FAQ_ITEMS,
  });

  return (
    <div className="alati-page alati-tool-page">
      <JsonLd data={jsonLd} />

      <DigitalReadinessTool />

      <div className="alati-tool">
        <RelatedTools
          tools={[
            {
              href: "/alati/kalkulator-ustede-vremena",
              title: "Kalkulator uštede vremena u ordinaciji",
            },
            {
              href: "/alati/checklist-prelazak-na-digitalni-karton",
              title: "Checklist za prelazak sa papira na digitalni karton",
            },
          ]}
        />
        <FaqSection items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
