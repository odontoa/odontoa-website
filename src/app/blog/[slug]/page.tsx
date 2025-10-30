import { fetchArticleBySlug } from '@/lib/strapiClient'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Odontoa blog",
      description: "Stomatološka organizacija, digitalni rad i praksa.",
    };
  }

  return {
    title: article.title,
    description: article.description ?? "Stomatološka organizacija, digitalni rad i praksa.",
    openGraph: {
      title: article.title,
      description: article.description ?? "",
      images: article.coverImageUrl ? [article.coverImageUrl] : [],
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

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-center text-sm text-gray-500">
            Ovaj sadržaj trenutno nije dostupan.
          </p>
        </div>
      </div>
    );
  }

  const schemaData = [
    {
      "@type": "WebPage",
      "@context": "https://schema.org",
      "inLanguage": "sr",
      "name": article.title,
      "url": `https://odontoa.com/blog/${article.slug}`,
      "description": article.description ?? ""
    },
    {
      "@type": "BreadcrumbList",
      "@context": "https://schema.org",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Početna",
          "item": "https://odontoa.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://odontoa.com/blogovi"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `https://odontoa.com/blog/${article.slug}`
        }
      ]
    },
    {
      "@type": "Article",
      "@context": "https://schema.org",
      "headline": article.title,
      "description": article.description ?? "",
      "image": article.coverImageUrl ? [article.coverImageUrl] : [],
      "datePublished": article.publishedAtISO,
      "dateModified": article.publishedAtISO,
      "inLanguage": "sr",
      "author": {
        "@type": "Person",
        "name": article.authorName ?? "Odontoa",
        "url": "https://odontoa.com/o-nama"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Odontoa",
        "logo": {
          "@type": "ImageObject",
          "url": "https://odontoa.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://odontoa.com/blog/${article.slug}`
      }
    },
    {
      "@type": "FAQPage",
      "@context": "https://schema.org",
      "mainEntity": [
        // TODO: once Strapi Article model has FAQ (list of {question, answerHTML}),
        // map them here AND make sure we render same Q&A visibly in the page body.
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <article className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{article.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
            {article.authorAvatarUrl && (
              <img 
                src={article.authorAvatarUrl} 
                alt={article.authorName || "Author"} 
                className="h-8 w-8 rounded-full" 
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-slate-700 dark:text-slate-200">{article.authorName ?? "Odontoa"}</span>
              <time dateTime={article.publishedAtISO} className="text-xs text-slate-500">
                {formatToSerbianDate(article.publishedAtISO)}
              </time>
            </div>
          </div>
        </header>

        {article.coverImageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* lead / description */}
        {article.description && (
          <p className="mb-6 text-lg text-slate-700 dark:text-slate-300">
            {article.description}
          </p>
        )}

        {/* main content */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: article.contentHtml ?? article.description ?? "",
          }}
        />

        {/* TODO: FAQ block visible on page once Strapi has FAQ fields.
           This must match what we output in FAQPage schema. */}
        {/* <section className="mt-12 border-t border-slate-200 pt-8">
             <h2 className="text-xl font-semibold mb-4">Česta pitanja</h2>
             ...render Q&A from Strapi later...
           </section> */}

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* Dev-only debug of image URLs */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
            <p className="font-medium mb-2">Debug: Strapi image URLs</p>
            <pre className="whitespace-pre-wrap break-all">
{`coverImageUrl: ${article.coverImageUrl || 'null'}
authorAvatarUrl: ${article.authorAvatarUrl || 'null'}`}
            </pre>
          </div>
        )}
      </article>
    </div>
  );
}
