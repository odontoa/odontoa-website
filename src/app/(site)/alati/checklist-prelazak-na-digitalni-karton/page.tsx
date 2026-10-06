import type { Metadata } from "next";
import PaperChecklist from "@/components/alati/PaperChecklist";
import RelatedTools from "@/components/alati/RelatedTools";
import FaqSection from "@/components/alati/FaqSection";
import { buildToolJsonLd } from "@/lib/structured-data/tool-jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import "../alati.css";

const TITLE =
  "Checklist za prelazak sa papira na digitalni karton | Odontoa";
const DESCRIPTION =
  "Besplatna checklista za stomatološke ordinacije koje prelaze sa papirnih kartona na digitalni karton. Praktični koraci za pacijente, termine i tim.";

const CHECKLIST_FAQ = [
  {
    question: "Da li moram sve stare kartone da prebacim odmah?",
    answer:
      "Ne. Preporučujemo da počnete od aktivnih pacijenata i onih koji imaju zakazane termine. Stare kartone prebacujte postepeno, po potrebi, u narednih nekoliko meseci.",
  },
  {
    question: "Odakle je najbolje početi?",
    answer:
      "Počnite od koraka 1 (Priprema) i definišite jednu osobu koja koordinira prelazak. Bez toga, svako radi po svom nahođenju i greške se nakupljaju.",
  },
  {
    question: "Koliko traje prelazak na digitalni karton?",
    answer:
      "Za večinu ordinacija, osnovna migracija aktivnih pacijenata i termina traje od jedne do tri nedelje. Potpuni prelazak, uključujući stare kartone i finansijske podatke, može trajati i nekoliko meseci.",
  },
  {
    question: "Da li mala ordinacija može postepeno da pređe na digitalni sistem?",
    answer:
      "Da. Postepen prelazak je čak preporučljiviji od nagle zamene svega odjednom. Počnite od zakazivanja i aktivnih pacijenata, a ostatak dodajte u svom tempu.",
  },
  {
    question: "Šta ako tim i dalje koristi papir?",
    answer:
      "To je najčešći problem u prvim nedeljama. Korak 5 (Tim i pravila rada) pomaže da uskladite ko šta unosi i gde. Jasna pravila su važnija od savršenog alata.",
  },
  {
    question: "Da li je checklista besplatna?",
    answer:
      "Da. Checklista je potpuno besplatna i ne zahteva registraciju.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/alati/checklist-prelazak-na-digitalni-karton" });
}

export default function ChecklistPrelazakPage() {
  const path = "/alati/checklist-prelazak-na-digitalni-karton";

  const jsonLd = buildToolJsonLd({
    name: "Checklist za prelazak sa papira na digitalni karton",
    description: DESCRIPTION,
    path,
    breadcrumbs: [
      { name: "Početna", path: "/" },
      { name: "Alati", path: "/alati" },
      {
        name: "Checklist za prelazak sa papira na digitalni karton",
        path,
      },
    ],
    faqs: CHECKLIST_FAQ,
  });

  return (
    <div className="alati-page alati-tool-page">
      <JsonLd data={jsonLd} />
      <PaperChecklist />
      <div className="alati-tool">
        <RelatedTools
          tools={[
            {
              href: "/alati/digitalna-spremnost-ordinacije",
              title: "Test digitalne spremnosti ordinacije",
            },
            {
              href: "/alati/kalkulator-ustede-vremena",
              title: "Kalkulator uštede vremena u ordinaciji",
            },
          ]}
        />
        <FaqSection items={CHECKLIST_FAQ} />
      </div>
    </div>
  );
}
