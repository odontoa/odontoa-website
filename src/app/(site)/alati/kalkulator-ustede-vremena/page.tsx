import type { Metadata } from "next";
import TimeCalculator from "@/components/alati/TimeCalculator";
import RelatedTools from "@/components/alati/RelatedTools";
import FaqSection from "@/components/alati/FaqSection";
import { buildToolJsonLd } from "@/lib/structured-data/tool-jsonld";
import "../alati.css";

const TITLE = "Kalkulator uštede vremena u stomatološkoj ordinaciji | Odontoa";
const DESCRIPTION =
  "Besplatan kalkulator koji ti pokazuje koliko vremena ordinacija okvirno troši na ručne kartone, zakazivanje, podsetnike, zubnu tehniku i izveštaje.";

const CALCULATOR_FAQ = [
  {
    question: "Da li je kalkulator besplatan?",
    answer:
      "Da, kalkulator je potpuno besplatan. Nema registracije ni skrivenih troškova.",
  },
  {
    question: "Da li moram da ostavim email?",
    answer:
      "Ne. Rezultat dobijaš odmah, bez ostavljanja email adrese.",
  },
  {
    question: "Da li je rezultat tačan?",
    answer:
      "Kalkulator daje okvirnu procenu na osnovu tvojih ulaznih podataka. To nije garantovana ušteda, vec ilustracija koliko vremena trenutno odlazi na ručne procese.",
  },
  {
    question: "Šta znači ručni administrativni posao?",
    answer:
      "Podrazumeva sve što se radi ručno, kao što su traženje papirnih kartona, ručno upisivanje termina u rokovnik, slanje poruka pacijentima pre termina, ručno praćenje naloga za zubnu tehniku i sabiranje finansijskih podataka na kraju meseca.",
  },
  {
    question: "Kako mogu smanjiti vreme koje odlazi na administraciju?",
    answer:
      "Najčešće se počinje od jedne oblasti koja najviše opterecuje tim, obično zakazivanje ili kartoni. Digitalni sistem centralizuje podatke i smanjuje ručno prebacivanje između papira, tabela i poruka.",
  },
  {
    question: "Da li je kalkulator namenjen malim ordinacijama?",
    answer:
      "Da. Kalkulator je napravljen posebno za ordinacije u Srbiji, bez obzira na veličinu. Jednako je koristan za jednog doktora i za ordinaciju sa više stolica.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const url = `${baseUrl}/alati/kalkulator-ustede-vremena`;
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

export default function KalkulatorUstedeVremenaPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const url = `${baseUrl}/alati/kalkulator-ustede-vremena`;

  const jsonLd = buildToolJsonLd({
    name: "Kalkulator uštede vremena u stomatološkoj ordinaciji",
    description: DESCRIPTION,
    url,
    baseUrl,
    breadcrumbs: [
      { name: "Početna", url: baseUrl },
      { name: "Alati", url: `${baseUrl}/alati` },
      { name: "Kalkulator uštede vremena u ordinaciji", url },
    ],
    faqs: CALCULATOR_FAQ,
  });

  return (
    <div className="alati-page alati-tool-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimeCalculator />
      <div className="alati-tool">
        <RelatedTools
          tools={[
            {
              href: "/alati/digitalna-spremnost-ordinacije",
              title: "Test digitalne spremnosti ordinacije",
            },
            {
              href: "/alati/checklist-prelazak-na-digitalni-karton",
              title: "Checklist za prelazak sa papira na digitalni karton",
            },
          ]}
        />
        <FaqSection items={CALCULATOR_FAQ} />
      </div>
    </div>
  );
}
