import { AdminRoute } from '@/components/AdminRoute';
import { getPreviewArticles, NormalizedArticle } from '@/lib/strapiClient';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface StrapiPreviewPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function StrapiPreviewPage({ searchParams }: StrapiPreviewPageProps) {
  let articles: NormalizedArticle[] = [];
  let error: string | null = null;

  try {
    articles = await getPreviewArticles();
  } catch (err) {
    console.error('Error fetching Strapi articles:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-purple-500 text-white px-3 py-1">
                Strapi CMS Preview (beta)
              </Badge>
              <ExternalLink className="h-4 w-4 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Strapi Cloud Content Preview
            </h1>
            <p className="text-gray-400">
              Pregled sadržaja iz Strapi Cloud-a pre potpune migracije blog sistema
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-500 bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Greška pri učitavanju Strapi sadržaja:</span>
                </div>
                <p className="text-red-300 mt-2 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Articles Grid */}
          {articles.length === 0 && !error && (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">Nema dostupnih članaka u Strapi Cloud-u</p>
              </CardContent>
            </Card>
          )}

          {articles.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                try {
                  return (
                    <Card key={article.id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {article.coverImageUrl ? (
                            <img 
                              src={article.coverImageUrl} 
                              alt={article.title} 
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                // Hide image if it fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-800/40 rounded-lg flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                              No image
                            </div>
                          )}
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="text-sm text-purple-400 font-medium mb-1">
                              Strapi CMS Preview (beta)
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                              {article.title}
                            </h3>
                            <div className="text-xs text-gray-400 mb-2">
                              {article.authorName ? `${article.authorName} • ` : ""}
                              {article.publishedAt}
                            </div>
                            {article.excerpt && (
                              <p className="text-sm text-gray-300 line-clamp-2">
                                {article.excerpt}
                              </p>
                            )}
                            {article.categoryName && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {article.categoryName}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                } catch (err) {
                  // If individual article fails to render, show error card
                  return (
                    <Card key={`error-${article.id}`} className="border-red-500 bg-red-900/20">
                      <CardContent className="p-4">
                        <div className="text-red-400 text-sm">
                          Error rendering article: {article.title || 'Unknown'}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              })}
            </div>
          )}

          {/* Stats */}
          {articles.length > 0 && (
            <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
              <p className="text-sm text-gray-400">
                Ukupno članaka: <span className="text-white font-medium">{articles.length}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
