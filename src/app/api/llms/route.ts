import { NextResponse } from 'next/server';
import { businessConfig } from '@/lib/config/business';
import { getIndexableTerms } from '@/lib/content/recnik';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { isComingSoon } from '@/lib/config/site-mode';

export async function GET() {
  try {
    const baseUrl = 'https://odontoa.com';
    const currentDate = new Date().toISOString().split('T')[0];

    /* Coming-soon: minimalan opis bez funkcionalnosti, cene i linkova ka zatvorenim rutama.
       Pun sadrzaj se vraca cim se SITE_MODE ukloni. */
    if (isComingSoon()) {
      const minimal =
        `# Odontoa\n\n` +
        `Platforma za upravljanje stomatološkom ordinacijom. Sajt je u izradi.\n\n` +
        `## Kontakt\n` +
        `Email: ${businessConfig.email}\n` +
        `Sajt: ${baseUrl}\n`;
      return new NextResponse(minimal, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    /* Blog je privremeno sakriven do content launcha, pa ga ovde nema.
       Recnik dolazi iz lokalnog izvora (src/lib/content/recnik.ts). */
    const showGlossary = !isSectionHidden('/recnik');
    const glossaryTerms = showGlossary ? getIndexableTerms() : [];

    let llmsContent = `# Odontoa — CRM i platforma za upravljanje stomatološkom ordinacijom (SaaS)\n\n`;

    llmsContent += `## Šta je Odontoa?\n`;
    llmsContent += `Odontoa je softver za stomatološke ordinacije u Srbiji i regionu. Zakazivanje, karton i odontogram, RTG snimci, zubna tehnika, dokumentacija i finansije su u jednom sistemu.\n\n`;

    llmsContent += `## Za koga je?\n`;
    llmsContent += `- Privatne stomatološke ordinacije\n`;
    llmsContent += `- Ordinacije sa više stolica i timova\n`;
    llmsContent += `- Samostalni stomatolozi i specijalisti\n`;
    llmsContent += `- Stomatološki centri i klinike\n\n`;

    /* Funkcionalnosti iz istog izvora kao stranice /funkcionalnosti, da se ne raziđu. */
    llmsContent += `## Funkcionalnosti\n`;
    for (const page of FEATURE_PAGES) {
      llmsContent += `- ${page.navTitle}: ${page.shortDesc} ${baseUrl}/funkcionalnosti/${page.slug}\n`;
    }
    llmsContent += `\n`;

    llmsContent += `## Cena\n`;
    llmsContent += `Cena za rani pristup: 12 € mesečno, uz godišnju naplatu od 144 € (naplata jednom godišnje). Sve funkcionalnosti su uključene, bez naplate po stolici i bez doplate za pojedinačne module. Prvih 30 dana je besplatno.\n\n`;

    llmsContent += `## Kako koristiti ovaj sajt\n`;
    llmsContent += `Na sajtu se nalaze:\n`;
    llmsContent += `- Stranice sa funkcionalnostima i prednostima proizvoda\n`;
    if (showGlossary) llmsContent += `- Rečnik pojmova (glossary)\n`;
    llmsContent += `- Kontakt i poziv na demo\n\n`;

    llmsContent += `## Ključni linkovi\n`;
    llmsContent += `${baseUrl}/\n`;
    llmsContent += `${baseUrl}/funkcionalnosti\n`;
    if (showGlossary) llmsContent += `${baseUrl}/recnik\n`;
    if (!isSectionHidden('/alati')) llmsContent += `${baseUrl}/alati\n`;
    llmsContent += `${baseUrl}/kontakt\n`;
    if (!isSectionHidden('/o-nama')) llmsContent += `${baseUrl}/o-nama\n`;
    llmsContent += `\n`;

    /* Alati su privremeno sakriveni (src/lib/config/hidden-sections.ts). */
    if (!isSectionHidden('/alati')) {
      llmsContent += `## Besplatni alati\n`;
      llmsContent += `- Test digitalne spremnosti ordinacije: ${baseUrl}/alati/digitalna-spremnost-ordinacije\n`;
      llmsContent += `  Besplatan test od 12 pitanja koji pokazuje koliko je stomatološka ordinacija digitalno organizovana, sa rezultatom po oblastima (kartoni, zakazivanje, zubna tehnika, tim, analitika). Bez registracije, rezultat odmah.\n`;
      llmsContent += `- Kalkulator uštede vremena u ordinaciji: ${baseUrl}/alati/kalkulator-ustede-vremena\n`;
      llmsContent += `  Besplatan kalkulator koji procenjuje koliko sati nedeljno ordinacija troši na ručne kartone, zakazivanje, podsetnike, zubnu tehniku i izveštaje. Bez registracije, rezultat odmah.\n`;
      llmsContent += `- Checklist za prelazak sa papira na digitalni karton: ${baseUrl}/alati/checklist-prelazak-na-digitalni-karton\n`;
      llmsContent += `  Besplatna interaktivna checklista sa 6 sekcija i 23 koraka za postepen prelazak sa papirnih kartona na digitalni sistem. Bez registracije.\n\n`;
    }

    // Dynamic glossary terms section
    if (glossaryTerms.length > 0) {
      const indexedTerms = glossaryTerms;
      llmsContent += `## Rečnik stomatoloških pojmova (${indexedTerms.length})\n`;
      const termsToShow = indexedTerms.slice(0, 30);
      for (const term of termsToShow) {
        llmsContent += `- ${term.term}: ${baseUrl}/recnik/${term.slug}\n`;
      }
      if (indexedTerms.length > 30) {
        llmsContent += `- ... i još ${indexedTerms.length - 30} pojmova na ${baseUrl}/recnik\n`;
      }
      llmsContent += `\n`;
    }

    llmsContent += `## Kontakt\n`;
    llmsContent += `Email: ${businessConfig.email}\n`;
    if (businessConfig.phone) llmsContent += `Telefon: ${businessConfig.phone}\n`;
    llmsContent += `Sajt: ${baseUrl}\n\n`;

    llmsContent += `---\n`;
    llmsContent += `Last updated: ${currentDate}\n`;

    return new NextResponse(llmsContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    return new NextResponse('Error generating llms.txt', { status: 500 });
  }
} 