import { NextResponse } from 'next/server';
import { businessConfig } from '@/lib/config/business';
import { sanityClient } from '@/lib/sanity.client';
import { allBlogPostsQuery, allGlossaryTermsDirectoryQuery } from '@/lib/sanity.queries';

export async function GET() {
  try {
    const baseUrl = 'https://odontoa.com';
    const currentDate = new Date().toISOString().split('T')[0];

    // Fetch dynamic content from Sanity
    const [blogPosts, glossaryTerms] = await Promise.all([
      sanityClient.fetch(allBlogPostsQuery).catch(() => []),
      sanityClient.fetch(allGlossaryTermsDirectoryQuery).catch(() => []),
    ]);

    let llmsContent = `# Odontoa — CRM i platforma za upravljanje stomatološkom ordinacijom (SaaS)\n\n`;

    llmsContent += `## Šta je Odontoa?\n`;
    llmsContent += `Odontoa je SaaS platforma za stomatološke ordinacije u Srbiji i regionu. Pomaže ordinacijama da digitalizuju zakazivanje, kartone pacijenata, zalihe i timsku koordinaciju, uz analitiku poslovanja.\n\n`;

    llmsContent += `## Za koga je?\n`;
    llmsContent += `- Privatne stomatološke ordinacije\n`;
    llmsContent += `- Ordinacije sa više stolica i timova\n`;
    llmsContent += `- Samostalni stomatolozi i specijalisti\n`;
    llmsContent += `- Stomatološki centri i klinike\n\n`;

    llmsContent += `## Ključne funkcije\n`;
    llmsContent += `- Evidencija pacijenata i istorija terapija (digitalna kartoteka)\n`;
    llmsContent += `- Zakazivanje termina i smene\n`;
    llmsContent += `- Automatski podsetnici pacijentima\n`;
    llmsContent += `- Upravljanje zalihama i potrošnim materijalom\n`;
    llmsContent += `- Interna komunikacija i beleške za tim\n`;
    llmsContent += `- Statistika i analitika poslovanja\n\n`;

    llmsContent += `## Kako koristiti ovaj sajt\n`;
    llmsContent += `Na sajtu se nalaze:\n`;
    llmsContent += `- Stranice sa funkcijama i prednostima proizvoda\n`;
    llmsContent += `- Blog vodiči o digitalizaciji i organizaciji rada u ordinaciji\n`;
    llmsContent += `- Rečnik pojmova (glossary)\n`;
    llmsContent += `- Kontakt i poziv na demo\n\n`;

    llmsContent += `## Ključni linkovi\n`;
    llmsContent += `${baseUrl}/\n`;
    llmsContent += `${baseUrl}/blogovi\n`;
    llmsContent += `${baseUrl}/recnik\n`;
    llmsContent += `${baseUrl}/kontakt\n`;
    llmsContent += `${baseUrl}/o-nama\n\n`;

    // Dynamic blog posts section
    if (blogPosts && blogPosts.length > 0) {
      llmsContent += `## Članci na blogu (${blogPosts.length})\n`;
      const postsToShow = blogPosts.slice(0, 20);
      for (const post of postsToShow) {
        llmsContent += `- ${post.title}: ${baseUrl}/blogovi/${post.slug}\n`;
        if (post.excerpt) {
          llmsContent += `  ${post.excerpt}\n`;
        }
      }
      if (blogPosts.length > 20) {
        llmsContent += `- ... i još ${blogPosts.length - 20} članaka na ${baseUrl}/blogovi\n`;
      }
      llmsContent += `\n`;
    }

    // Dynamic glossary terms section
    if (glossaryTerms && glossaryTerms.length > 0) {
      const indexedTerms = glossaryTerms.filter((t: any) => !t.noindex);
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
    llmsContent += `Telefon: ${businessConfig.phone}\n`;
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