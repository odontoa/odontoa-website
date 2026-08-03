import type { Metadata } from "next";
import DigitalReadinessTool from "@/components/alati/DigitalReadinessTool";
import FaqSection from "@/components/alati/FaqSection";
import RelatedTools from "@/components/alati/RelatedTools";
import { FAQ_ITEMS } from "@/components/alati/quiz-data";
import { buildToolJsonLd } from "@/lib/structured-data/tool-jsonld";
import "../alati.css";

const TITLE =
  "Test digitalne spremnosti stomatološke ordinacije | Odontoa";
const DESCRIPTION =
  "Besplatan test od 12 pitanja koji vam pokazuje koliko je vaša ordinacija digitalno organizovana. Bez registracije, rezultat odmah.";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const url = `${baseUrl}/alati/digitalna-spremnost-ordinacije`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function DigitalReadinessPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const url = `${baseUrl}/alati/digitalna-spremnost-ordinacije`;

  const jsonLd = buildToolJsonLd({
    name: "Test digitalne spremnosti stomatološke ordinacije",
    description: DESCRIPTION,
    url,
    baseUrl,
    breadcrumbs: [
      { name: "Početna", url: baseUrl },
      { name: "Alati", url: `${baseUrl}/alati` },
      {
        name: "Test digitalne spremnosti ordinacije",
        url,
      },
    ],
    faqs: FAQ_ITEMS,
  });

  return (
    <div className="alati-page alati-tool-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
