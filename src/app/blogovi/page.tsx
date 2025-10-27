import { fetchPublicArticles } from '@/lib/strapiClient'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog – Odontoa",
    description:
      "Digitalizacija stomatološke ordinacije: saveti o organizaciji pacijenata, zalihama i zakazivanju termina.",
    openGraph: {
      title: "Blog – Odontoa",
      description:
        "Saveti i praksa iz ordinacije: pacijenti, zalihe, zakazivanje, analitika.",
    },
  };
}

function formatToSerbianDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function BlogoviPage() {
  const articles = await fetchPublicArticles();

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-center text-sm text-gray-500">
              Trenutno nije moguće učitati blog postove. Pokušajte kasnije.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-8 leading-tight">
              Vodič za modernu dentalnu praksu
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed">
              Praktični saveti i aktuelne teme koje pomažu da vaša ordinacija radi bolje.
            </p>

            <div className="flex justify-center items-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{articles.length} članaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Aktuelno</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Popularno</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Najnoviji članci
              </h2>
              <p className="text-gray-600">
                {articles.length} članaka
              </p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
              <div className="group cursor-pointer border border-slate-200 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden rounded-xl h-full flex flex-col shadow-sm hover:shadow-lg">
                <div className="p-0 flex-shrink-0">
                  <div className="relative overflow-hidden">
                    {article.coverImageUrl ? (
                      <img 
                        src={article.coverImageUrl} 
                        alt={article.title} 
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      {formatToSerbianDate(article.publishedAtISO)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center text-sm text-gray-500">
                      {article.authorName || "Odontoa"}
                    </div>
                    
                    <div className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4 py-2 text-sm font-medium">
                      Pročitaj više
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        {articles.length > 0 && (
          <div className="mt-20">
            <div className="bg-card/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border relative overflow-hidden">
              <div className="text-center relative z-10">
                <h3 className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-tight">
                  Spremni da digitalizujete ordinaciju?<br />
                  <span className="text-primary">Start za 5 minuta.</span>
                </h3>

                <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                  Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite broj propuštenih termina i uštedite 10+ sati nedeljno. Sve to bez komplikovane obuke.
                </p>

                <div className="flex justify-center">
                  <Link href="/kontakt?source=blog">
                    <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                      Zakaži demo
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}