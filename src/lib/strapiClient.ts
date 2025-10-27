// TypeScript types for Strapi article response
interface StrapiImage {
  url: string;
  formats?: {
    medium?: {
      url: string;
    };
    small?: {
      url: string;
    };
    thumbnail?: {
      url: string;
    };
  };
}

interface StrapiAuthor {
  data?: {
    id: number;
    attributes: {
      name: string;
      email: string;
      bio?: string;
    };
  };
}

interface StrapiCategory {
  data?: {
    id: number;
    attributes: {
      name: string;
    };
  };
}

interface StrapiArticle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt?: string;
    cover?: {
      data?: StrapiImage;
    };
    author?: StrapiAuthor;
    category?: StrapiCategory;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface StrapiResponse {
  data: StrapiArticle[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Normalized article type for frontend
export interface NormalizedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string | null;
  categoryName: string | null;
  publishedAt: string | null;
}

export async function fetchBlogPosts(): Promise<StrapiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  }

  // NOTE:
  // In Strapi we are using the "Article" collection type (default blog post model).
  // Public role in Strapi must have 'find' and 'findOne' permissions on Article.
  // We are using populate=* so we also get author, cover image, etc.

  const res = await fetch(
    `${baseUrl}/api/articles?populate=*`,
    {
      method: "GET",
      // cache for a short period to avoid hammering the free Strapi instance
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch articles from Strapi Cloud: " + res.status + " " + res.statusText
    );
  }

  const data = await res.json();
  return data;
}

export function normalizeStrapiArticles(raw: StrapiResponse): NormalizedArticle[] {
  return raw.data.map((article) => {
    // Handle cover image URL with fallback logic
    let coverImageUrl: string | null = null;
    if (article.attributes?.cover?.data) {
      const cover = article.attributes.cover.data;
      if (cover.formats?.medium?.url) {
        coverImageUrl = cover.formats.medium.url;
      } else if (cover.url) {
        coverImageUrl = cover.url;
      }
    }

    // Handle author name with fallback
    const authorName = article.attributes?.author?.data?.attributes?.name || null;

    // Handle category name with fallback
    const categoryName = article.attributes?.category?.data?.attributes?.name || null;

    // Format published date with fallback
    const publishedAt = article.attributes?.publishedAt 
      ? new Date(article.attributes.publishedAt).toLocaleDateString('sr-RS', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : null;

    return {
      id: article.id?.toString() || 'unknown',
      title: article.attributes?.title || 'Untitled',
      slug: article.attributes?.slug || 'untitled',
      excerpt: article.attributes?.excerpt || null,
      coverImageUrl,
      authorName,
      categoryName,
      publishedAt,
    };
  });
}

export async function getPreviewArticles(): Promise<NormalizedArticle[]> {
  const api = await fetchBlogPosts();
  return normalizeStrapiArticles(api);
}
