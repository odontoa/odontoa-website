import { fetchBlogPostBySlug } from '@/lib/strapiClient'
import BlogArticleLayout from '@/components/blog/BlogArticleLayout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const article = await fetchBlogPostBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Članak nije pronađen – Odontoa',
      description: 'Traženi članak trenutno nije dostupan.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://odontoa.com';
  const coverImageUrl = article.coverImageUrl 
    ? (article.coverImageUrl.startsWith('http') 
        ? article.coverImageUrl 
        : `${baseUrl}${article.coverImageUrl}`)
    : `${baseUrl}/images/blog-placeholder.jpg`;

  return {
    title: `${article.title} – Odontoa`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAtISO,
      authors: [article.authorName || 'Odontoa tim'],
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 800,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [coverImageUrl],
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const article = await fetchBlogPostBySlug(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-center text-gray-600 py-20">
              Ovaj sadržaj trenutno nije dostupan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const publishedAt = formatToSerbianDate(article.publishedAtISO);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.description,
            "author": {
              "@type": "Person",
              "name": article.authorName || "Odontoa tim"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Odontoa",
              "logo": {
                "@type": "ImageObject",
                "url": "https://odontoa.com/images/Odontoa - logo pack/Full_logo_horizontal_color.png"
              }
            },
            "datePublished": article.publishedAtISO,
            "dateModified": article.publishedAtISO,
            "image": article.coverImageUrl ? {
              "@type": "ImageObject",
              "url": article.coverImageUrl,
              "width": 1200,
              "height": 800
            } : undefined,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://odontoa.com/blog2/${params.slug}`
            }
          })
        }}
      />
      
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Početna",
                "item": "https://odontoa.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://odontoa.com/blog2"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `https://odontoa.com/blog2/${params.slug}`
              }
            ]
          })
        }}
      />

      <BlogArticleLayout
        title={article.title}
        description={article.description}
        coverImageUrl={article.coverImageUrl}
        authorName={article.authorName}
        authorAvatarUrl={article.authorAvatarUrl}
        publishedAt={publishedAt}
        contentHtml={article.contentHtml}
        keyTakeaways={[]} // TODO: Add when Strapi supports keyTakeaways field
        tags={[]} // TODO: Add when Strapi supports tags field
      />
    </>
  );
}

