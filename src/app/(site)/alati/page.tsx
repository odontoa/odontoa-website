import type { Metadata } from "next";
import { buildToolJsonLd } from "@/lib/structured-data/tool-jsonld";
import ToolCard from "@/components/alati/ToolCard";
import "./alati.css";

const TITLE = "Besplatni alati za stomatološke ordinacije | Odontoa";
const DESCRIPTION =
  "Praktični alati, testovi i kalkulatori za stomatologe i menadžere ordinacija u Srbiji. Bez registracije, rezultat odmah.";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const url = `${baseUrl}/alati`;
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

export default function AlatiHubPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
  const url = `${baseUrl}/alati`;

  const jsonLd = buildToolJsonLd({
    name: "Besplatni alati za stomatološke ordinacije",
    description: DESCRIPTION,
    url,
    baseUrl,
    breadcrumbs: [
      { name: "Početna", url: baseUrl },
      { name: "Alati", url },
    ],
  });

  return (
    <div className="alati-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="alati-hub">
        <div className="alati-hub__inner">
          <header className="alati-hub__hero">
            <p className="alati-pill">Besplatni alati</p>
            <h1 className="alati-h1">
              Alati za bolju organizaciju ordinacije
            </h1>
            <p className="alati-lead">
              Kratki testovi i vodiči koji pomažu da lakše vidiš gde ordinacija
              gubi vreme i šta prvo treba unaprediti.
            </p>
          </header>

          {/* Featured card — full width */}
          <div className="alati-hub__grid">
            <ToolCard
              href="/alati/digitalna-spremnost-ordinacije"
              badge="Novo"
              title="Test digitalne spremnosti ordinacije"
              description="Saznaj gde najviše gubiš vreme u kartonima, terminima, zubnoj tehnici, timu i analitici."
              meta="2 minuta · Bez registracije · Rezultat odmah"
              ctaLabel="Pokreni test"
              featured
            />
          </div>

          {/* Secondary cards — 2 column */}
          <div className="alati-hub__secondary-grid">
            <ToolCard
              href="/alati/kalkulator-ustede-vremena"
              title="Kalkulator uštede vremena u ordinaciji"
              description="Izračunaj koliko sati nedeljno odlazi na ručne kartone, zakazivanje, podsetnike, zubnu tehniku i izveštaje."
              ctaLabel="Izračunaj uštedu"
            />
            <ToolCard
              href="/alati/checklist-prelazak-na-digitalni-karton"
              title="Checklist za prelazak sa papira na digitalni karton"
              description="Prođi kroz praktične korake za postepen prelazak sa papirnih kartona na digitalni sistem."
              ctaLabel="Otvori checklistu"
            />
          </div>

          <p className="alati-hub__footnote">
            Alate dodajemo postepeno, samo kada mogu da donesu konkretnu
            vrednost ordinaciji.
          </p>
        </div>
      </section>
    </div>
  );
}
