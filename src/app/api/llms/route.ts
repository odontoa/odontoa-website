import { NextResponse } from 'next/server';
import { businessConfig } from '@/lib/config/business';
import {
  ensureRecnikValid,
  getCategoriesWithTerms,
  getCategoryPath,
  getIndexableTerms,
  getTermPath,
  isCategoryIndexable,
  isGlossaryPublic,
} from '@/lib/content/recnik';
import { FEATURE_PAGES } from '@/lib/content/funkcionalnosti';
import { isSectionHidden } from '@/lib/config/hidden-sections';
import { isComingSoon } from '@/lib/config/site-mode';
import { absoluteUrl } from '@/lib/config/site-url';
import { pricing } from '@/lib/config/pricing';

/* llms.txt (rewrite /llms.txt -> /api/llms u next.config.js). Pomocni, masinski citljiv opis
   sajta; nije SEO signal i nista u rutiranju ili indeksiranju ne zavisi od njega.
   Sadrzaj se gradi iz istih izvora kao sajt (FEATURE_PAGES, recnik, pricing, businessConfig),
   samo sa javnim stranicama. */

const TERMS_IN_LLMS = 30;

function textResponse(body: string) {
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export async function GET() {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    /* Coming-soon: minimalan opis bez funkcionalnosti, cene i linkova ka zatvorenim rutama.
       Pun sadrzaj se vraca cim se SITE_MODE ukloni. */
    if (isComingSoon()) {
      return textResponse(
        `# Odontoa\n\n` +
          `Platforma za upravljanje stomatološkom ordinacijom. Sajt je u izradi.\n\n` +
          `## Kontakt\n` +
          `Email: ${businessConfig.email}\n` +
          `Sajt: ${absoluteUrl('/')}\n`,
      );
    }

    ensureRecnikValid();
    const showGlossary = isGlossaryPublic();
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
      llmsContent += `- ${page.navTitle}: ${page.shortDesc} ${absoluteUrl(`/funkcionalnosti/${page.slug}`)}\n`;
    }
    llmsContent += `\n`;

    llmsContent += `## Cena\n`;
    llmsContent += `Cena za rani pristup: ${pricing.monthly} ${pricing.currencySymbol} mesečno, uz godišnju naplatu od ${pricing.yearly} ${pricing.currencySymbol} (naplata jednom godišnje). Sve funkcionalnosti su uključene, bez naplate po stolici i bez doplate za pojedinačne module. Prvih ${pricing.trialDays} dana je besplatno.\n\n`;

    llmsContent += `## Ključni linkovi\n`;
    llmsContent += `${absoluteUrl('/')}\n`;
    llmsContent += `${absoluteUrl('/funkcionalnosti')}\n`;
    if (showGlossary) llmsContent += `${absoluteUrl('/recnik')}\n`;
    if (!isSectionHidden('/alati')) llmsContent += `${absoluteUrl('/alati')}\n`;
    llmsContent += `${absoluteUrl('/demo')}\n`;
    llmsContent += `${absoluteUrl('/kontakt')}\n`;
    if (!isSectionHidden('/o-nama')) llmsContent += `${absoluteUrl('/o-nama')}\n`;
    llmsContent += `\n`;

    /* Alati su privremeno sakriveni (src/lib/config/hidden-sections.ts). */
    if (!isSectionHidden('/alati')) {
      llmsContent += `## Besplatni alati\n`;
      llmsContent += `- Test digitalne spremnosti ordinacije: ${absoluteUrl('/alati/digitalna-spremnost-ordinacije')}\n`;
      llmsContent += `  Besplatan test od 12 pitanja koji pokazuje koliko je stomatološka ordinacija digitalno organizovana, sa rezultatom po oblastima (kartoni, zakazivanje, zubna tehnika, tim, analitika). Bez registracije, rezultat odmah.\n`;
      llmsContent += `- Kalkulator uštede vremena u ordinaciji: ${absoluteUrl('/alati/kalkulator-ustede-vremena')}\n`;
      llmsContent += `  Besplatan kalkulator koji procenjuje koliko sati nedeljno ordinacija troši na ručne kartone, zakazivanje, podsetnike, zubnu tehniku i izveštaje. Bez registracije, rezultat odmah.\n`;
      llmsContent += `- Checklist za prelazak sa papira na digitalni karton: ${absoluteUrl('/alati/checklist-prelazak-na-digitalni-karton')}\n`;
      llmsContent += `  Besplatna interaktivna checklista sa 6 sekcija i 23 koraka za postepen prelazak sa papirnih kartona na digitalni sistem. Bez registracije.\n\n`;
    }

    /* Recnik: samo objavljeni, indexable pojmovi; ulazne tacke su /recnik i kategorije. */
    if (glossaryTerms.length > 0) {
      llmsContent += `## Stomatološki rečnik (${glossaryTerms.length} pojmova)\n`;
      llmsContent += `Indeks: ${absoluteUrl('/recnik')}\n`;
      llmsContent += `Svi pojmovi sa definicijama: ${absoluteUrl('/llms-full.txt')}\n\n`;

      llmsContent += `### Kategorije\n`;
      for (const category of getCategoriesWithTerms()) {
        const link = isCategoryIndexable(category) ? `: ${absoluteUrl(getCategoryPath(category))}` : '';
        llmsContent += `- ${category.title} (${category.termCount})${link}\n`;
      }
      llmsContent += `\n`;

      llmsContent += `### Pojmovi\n`;
      for (const term of glossaryTerms.slice(0, TERMS_IN_LLMS)) {
        llmsContent += `- ${term.publicTitle}: ${absoluteUrl(getTermPath(term))}\n`;
      }
      if (glossaryTerms.length > TERMS_IN_LLMS) {
        llmsContent += `- ... i još ${glossaryTerms.length - TERMS_IN_LLMS} pojmova na ${absoluteUrl('/recnik')}\n`;
      }
      llmsContent += `\n`;
    }

    llmsContent += `## Kontakt\n`;
    llmsContent += `Email: ${businessConfig.email}\n`;
    if (businessConfig.phone) llmsContent += `Telefon: ${businessConfig.phone}\n`;
    llmsContent += `Sajt: ${absoluteUrl('/')}\n\n`;

    llmsContent += `---\n`;
    llmsContent += `Last updated: ${currentDate}\n`;

    return textResponse(llmsContent);
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    return new NextResponse('Error generating llms.txt', { status: 500 });
  }
}
