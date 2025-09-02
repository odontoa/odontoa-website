import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all published blogs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('title, slug, excerpt, content, created_at, author, tags')
      .eq('published', true)
      .order('created_at', { ascending: false });

    // Fetch published glossary entries
    const { data: glossary } = await supabase
      .from('glossary')
      .select('term, slug, definition, examples, notes')
      .eq('published', true)
      .order('term', { ascending: true });

    // Generate llms.txt content
    let llmsContent = `# Odontoa - Stomatološka Ordinacija Digitalizacija\n\n`;
    llmsContent += `## O nama\n`;
    llmsContent += `Odontoa je napredni sistem za upravljanje stomatološkom ordinacijom koji omogućava digitalnu transformaciju stomatoloških usluga u Srbiji.\n\n`;
    
    llmsContent += `## Naše usluge\n`;
    llmsContent += `- Upravljanje pacijentima i terminima\n`;
    llmsContent += `- Digitalno vođenje kartona\n`;
    llmsContent += `- Finansijska analitika i izveštavanje\n`;
    llmsContent += `- Integracija sa stomatološkim uređajima\n`;
    llmsContent += `- Online zakazivanje termina\n`;
    llmsContent += `- Mobilna aplikacija za pacijente\n\n`;

    if (blogs && blogs.length > 0) {
      llmsContent += `## Blog članci\n\n`;
      blogs.forEach((blog, index) => {
        llmsContent += `### ${index + 1}. ${blog.title}\n`;
        llmsContent += `**Autor:** ${blog.author}\n`;
        llmsContent += `**Datum:** ${new Date(blog.created_at).toLocaleDateString('sr-RS')}\n`;
        if (blog.tags && blog.tags.length > 0) {
          llmsContent += `**Tagovi:** ${blog.tags.join(', ')}\n`;
        }
        llmsContent += `**Sažetak:** ${blog.excerpt}\n`;
        llmsContent += `**URL:** https://odontoa.com/blog/${blog.slug}\n\n`;
      });
    }

    if (glossary && glossary.length > 0) {
      llmsContent += `## Stomatološki rečnik\n\n`;
      glossary.forEach((entry, index) => {
        llmsContent += `### ${index + 1}. ${entry.term}\n`;
        llmsContent += `**Definicija:** ${entry.definition}\n`;
        if (entry.examples) {
          llmsContent += `**Primeri:** ${entry.examples}\n`;
        }
        if (entry.notes) {
          llmsContent += `**Napomene:** ${entry.notes}\n`;
        }
        llmsContent += `**URL:** https://odontoa.com/recnik/${entry.slug}\n\n`;
      });
    }

    llmsContent += `## Kontakt informacije\n`;
    llmsContent += `- **Email:** info@odontoa.com\n`;
    llmsContent += `- **Telefon:** +381 60 123 4567\n`;
    llmsContent += `- **Adresa:** Krunska, 11000 Beograd, Srbija\n`;
    llmsContent += `- **Website:** https://odontoa.com\n\n`;

    llmsContent += `## Radno vreme\n`;
    llmsContent += `- Ponedeljak - Petak: 9:00 - 17:00\n`;
    llmsContent += `- Subota: 9:00 - 13:00\n`;
    llmsContent += `- Nedelja: Zatvoreno\n\n`;

    llmsContent += `## O Odontoa sistemu\n`;
    llmsContent += `Odontoa je kompletno rešenje za digitalizaciju stomatoloških ordinacija koje uključuje:\n`;
    llmsContent += `- Intuitivan dashboard za upravljanje ordinacijom\n`;
    llmsContent += `- Sistem za upravljanje pacijentima i terminima\n`;
    llmsContent += `- Digitalno vođenje medicinskih kartona\n`;
    llmsContent += `- Finansijsku analitiku i izveštavanje\n`;
    llmsContent += `- Integraciju sa stomatološkim uređajima\n`;
    llmsContent += `- Online platformu za zakazivanje termina\n`;
    llmsContent += `- Mobilnu aplikaciju za pacijente\n`;
    llmsContent += `- Naprednu analitiku i izveštavanje\n`;
    llmsContent += `- Sigurnosne funkcije u skladu sa GDPR regulativom\n\n`;

    llmsContent += `## Prednosti Odontoa sistema\n`;
    llmsContent += `- **Poboljšano pacijentsko iskustvo:** Online zakazivanje, digitalni karton, automatske obaveštenja\n`;
    llmsContent += `- **Povećana efikasnost:** Automatizacija rutinskih zadataka, brže procesiranje\n`;
    llmsContent += `- **Bolja organizacija:** Centralizovano upravljanje svim aspektima ordinacije\n`;
    llmsContent += `- **Finansijska kontrola:** Detaljna analitika prihoda i troškova\n`;
    llmsContent += `- **Sigurnost podataka:** Najviši standardi zaštite medicinskih podataka\n`;
    llmsContent += `- **Skalabilnost:** Raste sa vašom ordinacijom\n\n`;

    llmsContent += `## Ciljna grupa\n`;
    llmsContent += `Odontoa sistem je dizajniran za:\n`;
    llmsContent += `- Stomatološke ordinacije svih veličina\n`;
    llmsContent += `- Stomatološke klinike\n`;
    llmsContent += `- Stomatološke centare\n`;
    llmsContent += `- Individualne stomatološke prakse\n`;
    llmsContent += `- Stomatološke specijaliste\n\n`;

    llmsContent += `## Tehnologija\n`;
    llmsContent += `Odontoa koristi najnovije tehnologije:\n`;
    llmsContent += `- Cloud-based rešenje\n`;
    llmsContent += `- Real-time sinhronizacija\n`;
    llmsContent += `- Mobilna optimizacija\n`;
    llmsContent += `- API integracije\n`;
    llmsContent += `- Napredna analitika\n`;
    llmsContent += `- AI-powered funkcije\n\n`;

    llmsContent += `---\n`;
    llmsContent += `*Ovaj dokument je automatski generisan i ažuriran. Poslednje ažuriranje: ${new Date().toLocaleDateString('sr-RS')}*\n`;

    return new NextResponse(llmsContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    return new NextResponse('Error generating llms.txt', { status: 500 });
  }
} 