// TypeScript types for Strapi article response
interface StrapiImage {
  attributes?: {
    url: string;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  } | null;
  url?: string; // fallback for non-standard shapes
  formats?: { medium?: { url: string } };
}

// Normalize Strapi base URL to root host (no trailing /, no /api or /admin suffixes)
function normalizeBaseUrl(input?: string | null): string {
  if (!input) return '';
  let url = input.trim();
  // remove trailing slash
  if (url.endsWith('/')) url = url.slice(0, -1);
  // strip common suffixes
  for (const suffix of ['/api', '/admin']) {
    if (url.toLowerCase().endsWith(suffix)) {
      url = url.slice(0, -suffix.length);
      if (url.endsWith('/')) url = url.slice(0, -1);
    }
  }
  return url;
}

interface StrapiAuthor {
  data?: {
    id: number;
    attributes: {
      name: string;
      email: string;
      bio?: string;
      avatar?: {
        data?: StrapiImage;
      };
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
  documentId?: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content?: string;
  body?: string;
  // Strapi dynamic zone used in our Article schema
  // Example item: { __component: 'shared.rich-text', body: '<p>...</p>' }
  //                { __component: 'shared.media', file: { data: { url: '/uploads/..' } } }
  //                { __component: 'shared.quote', text: '...', author: '...' }
  blocks?: Array<Record<string, any>>;
  cover?: {
    data?: StrapiImage;
  };
  author?: StrapiAuthor;
  category?: StrapiCategory;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
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

// New types for public blog functionality
export type ArticleSummary = {
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  authorName: string | null;
  publishedAtISO: string; // ISO string
};

export type ArticleDetails = {
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  authorName: string | null;
  authorAvatarUrl: string | null;
  publishedAtISO: string; // ISO
  contentHtml: string | null; // if Strapi has rich text/html field; if not available, can fallback to description
};

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
  // Build absolute URL helper using env base
  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_STRAPI_URL) || '';
  const toAbsoluteUrl = (url?: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url}`;
  };
  return raw.data.map((article) => {
    // Handle cover image URL with fallback logic
    let coverImageUrl: string | null = null;
    if (article.cover?.data) {
      const cover = article.cover.data as StrapiImage;
      const attrs = cover.attributes;
      const medium = attrs?.formats?.medium?.url || cover.formats?.medium?.url;
      const url = medium || attrs?.url || cover.url;
      coverImageUrl = toAbsoluteUrl(url || null);
    }

    // Handle author name with fallback
    const authorName = article.author?.data?.attributes?.name || null;

    // Handle category name with fallback
    const categoryName = article.category?.data?.attributes?.name || null;

    // Format published date with fallback
    const publishedAt = article.publishedAt 
      ? new Date(article.publishedAt).toLocaleDateString('sr-RS', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : null;

    return {
      id: article.id?.toString() || 'unknown',
      title: article.title || 'Untitled',
      slug: article.slug || 'untitled',
      excerpt: article.excerpt || article.description || null,
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

// New public blog functions
export async function fetchPublicArticles(): Promise<ArticleSummary[]> {
  try {
    const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_STRAPI_URL);
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_STRAPI_URL is not set');
      return [];
    }

    console.log('Attempting to fetch articles from:', baseUrl);

    const res = await fetch(
      `${baseUrl}/api/articles?populate=*`,
      {
        method: "GET",
        next: { revalidate: 60 },
        // Add timeout and better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!res.ok) {
      console.error(`Strapi API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('Invalid data structure received from Strapi');
      return [];
    }

    console.log(`Successfully fetched ${data.data.length} articles from Strapi`);

    const toAbsoluteUrl = (url?: string | null): string | null => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return `${baseUrl}${url}`;
    };

    return data.data.map((article: StrapiArticle) => {
      // Handle cover image URL with fallback logic
      let coverImageUrl: string | null = null;
      if (article.cover?.data) {
        const cover = article.cover.data as StrapiImage;
        const attrs = cover.attributes;
        const medium = attrs?.formats?.medium?.url || cover.formats?.medium?.url;
        const url = medium || attrs?.url || cover.url;
        coverImageUrl = toAbsoluteUrl(url || null);
      }

      // Handle author name with fallback
      const authorName = article.author?.data?.attributes?.name || null;

      return {
        title: article.title || 'Untitled',
        slug: article.slug || 'untitled',
        description: article.description || article.excerpt || '',
        coverImageUrl,
        authorName,
        publishedAtISO: article.publishedAt || article.createdAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching public articles from Strapi:', error);
    // Return empty array instead of throwing to allow fallback content
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetails | null> {
  try {
    const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_STRAPI_URL);
    if (!baseUrl) {
      return null;
    }

    const toAbsoluteUrl = (url?: string | null): string | null => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return `${baseUrl}${url}`;
    };

    // Deep populate cover, author.avatar and blocks to ensure media URLs are present
    const encodedSlug = encodeURIComponent(slug);
    const url = `${baseUrl}/api/articles?filters[slug][$eq]=${encodedSlug}`
      + `&populate[cover][populate]=*`
      + `&populate[author][populate][avatar][populate]=*`
      + `&populate[blocks][populate]=*`
      + `&publicationState=live`;

    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    const article = data.data[0];

    // Handle cover image URL with fallback logic
    let coverImageUrl: string | null = null;
    if (article.cover?.data) {
      const cover = article.cover.data as StrapiImage;
      const attrs = cover.attributes;
      const medium = attrs?.formats?.medium?.url || cover.formats?.medium?.url;
      const url = medium || attrs?.url || cover.url;
      coverImageUrl = toAbsoluteUrl(url || null);
    }

    // Handle author name and avatar with fallback
    const authorName = article.author?.data?.attributes?.name || null;
    let authorAvatarUrl: string | null = null;
    if (article.author?.data?.attributes?.avatar?.data) {
      const avatar = article.author.data.attributes.avatar.data as StrapiImage;
      const attrs = avatar.attributes;
      const medium = attrs?.formats?.medium?.url || avatar.formats?.medium?.url;
      const url = medium || attrs?.url || avatar.url;
      authorAvatarUrl = toAbsoluteUrl(url || null);
    }

    // Handle content
    // 1) Prefer dynamic zone `blocks` (shared.rich-text, shared.media, shared.quote)
    // 2) Fallback to legacy fields: content/body/description
    let blocksHtml: string | null = null;
    if (Array.isArray(article.blocks) && article.blocks.length > 0) {
      const parts: string[] = [];
      for (const block of article.blocks) {
        const type = block.__component as string | undefined;
        if (!type) continue;
        if (type.endsWith('rich-text') && typeof block.body === 'string') {
          parts.push(block.body);
        } else if (type.endsWith('media')) {
          // Strapi media component frequently uses fields: file / image / media
          const mediaObj = block.file || block.image || block.media;
          const mediaData = mediaObj?.data as StrapiImage | undefined;
          const attrs = mediaData?.attributes;
          const medium = attrs?.formats?.medium?.url || mediaData?.formats?.medium?.url;
          const mediaUrl = medium || attrs?.url || mediaData?.url || mediaObj?.url;
          const abs = toAbsoluteUrl(mediaUrl || null);
          if (abs) {
            const alt = block.alt || block.caption || '';
            parts.push(`<figure><img src="${abs}" alt="${alt}"><figcaption>${alt || ''}</figcaption></figure>`);
          }
        } else if (type.endsWith('quote')) {
          const text = block.text || block.body || '';
          const author = block.author || '';
          if (text) {
            parts.push(`<blockquote><p>${text}</p>${author ? `<footer>— ${author}</footer>` : ''}</blockquote>`);
          }
        }
      }
      blocksHtml = parts.length > 0 ? parts.join('\n') : null;
    }

    const contentHtml =
      blocksHtml || article.content || article.body || article.description || null;

    return {
      title: article.title || 'Untitled',
      slug: article.slug || 'untitled',
      description: article.description || article.excerpt || '',
      coverImageUrl,
      authorName,
      authorAvatarUrl,
      publishedAtISO: article.publishedAt || article.createdAt || new Date().toISOString(),
      contentHtml,
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Alias for consistency with the requirements
export const fetchBlogPostBySlug = fetchArticleBySlug;
