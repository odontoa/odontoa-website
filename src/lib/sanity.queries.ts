import { groq } from "next-sanity";

export const allBlogPostsQuery = groq`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  featured,
  "featuredAt": coalesce(featuredAt, publishedAt),
  featuredSlot,
  pinnedRank,
  "author": author->{
    name,
    url,
    "avatarUrl": avatar.asset->url
  },
  tags[]->{ title, "slug": slug.current },
  content
}`;

export const blogPostSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`;

export const heroFeaturedPostQuery = groq`*[_type=="blogPost" && featured==true && coalesce(featuredSlot,"hero")=="hero" && !noindex]
| order(coalesce(featuredAt, publishedAt) desc)[0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "featuredAt": coalesce(featuredAt, publishedAt),
  featuredSlot,
  "author": author->{
    name,
    url,
    "avatarUrl": avatar.asset->url
  },
  tags[]->{ title, "slug": slug.current },
  content
}`;

export const pinnedFeaturedPostsQuery = groq`*[_type=="blogPost" && featured==true && featuredSlot=="pinned" && !noindex]
| order(coalesce(pinnedRank, 999) asc, coalesce(featuredAt, publishedAt) desc)[0...3]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "featuredAt": coalesce(featuredAt, publishedAt),
  featuredSlot,
  pinnedRank,
  "author": author->{
    name,
    url,
    "avatarUrl": avatar.asset->url
  },
  tags[]->{ title, "slug": slug.current },
  content
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  coverImageAlt,
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  featured,
  "featuredAt": coalesce(featuredAt, publishedAt),
  "author": author->{
    name,
    url,
    "avatarUrl": avatar.asset->url
  },
  authorUrl,
  tags[]->{ title, "slug": slug.current },
  content,
  seoTitle,
  seoDescription,
  canonicalUrl,
  breadcrumbLabel,
  noindex,
  faqs,
  schemaOverrideJson
}`;

// Define a TypeScript type for the blog post shape to use in components:
export type SanityBlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: any;
  coverImageAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  featuredAt?: string;
  featuredSlot?: "hero" | "pinned";
  pinnedRank?: number;
  author: {
    name?: string;
    url?: string;
    avatarUrl?: string;
  } | null;
  // Keep for backward compatibility
  authorName?: string;
  authorSlug?: string;
  authorUrlFromAuthor?: string;
  authorUrl?: string;
  tags?: { title: string; slug: string }[];
  content?: any[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  breadcrumbLabel?: string;
  noindex?: boolean;
  faqs?: {
    question: string;
    answer: any[];
  }[];
  schemaOverrideJson?: string;
};

// Glossary Term Queries
// Explicitly exclude drafts and require publishedAt for production safety

// Lightweight query for directory view (list page) - only fields needed for display
export const allGlossaryTermsDirectoryQuery = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  category,
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  noindex
}`;

// Optimized query for sitemap - filters noindex and returns minimal fields
export const glossarySitemapQuery = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && coalesce(noindex, false) == false] | order(term asc){
  "slug": slug.current,
  _updatedAt
}`;

// Full query for detail pages (includes all fields)
export const allGlossaryTermsQuery = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  definition,
  fullArticle,
  category,
  tags[]->{ title, "slug": slug.current },
  "relatedTerms": relatedTerms[]->{ term, "slug": slug.current },
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  "authorName": author->name,
  "authorSlug": author->slug.current,
  "authorUrlFromAuthor": author->url,
  authorUrl,
  coverImage,
  coverImageAlt,
  seoTitle,
  metaDescription,
  canonicalUrl,
  noindex,
  faqs
}`;

export const glossaryTermSlugsQuery = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)]{
  "slug": slug.current
}`;

export const glossaryTermBySlugQuery = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && slug.current == $slug && defined(publishedAt)][0]{
  _id,
  term,
  "slug": slug.current,
  definition,
  fullArticle,
  category,
  tags[]->{ title, "slug": slug.current },
  "relatedTerms": relatedTerms[]->{ term, "slug": slug.current },
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  "authorName": author->name,
  "authorSlug": author->slug.current,
  "authorUrlFromAuthor": author->url,
  authorUrl,
  coverImage,
  coverImageAlt,
  seoTitle,
  metaDescription,
  canonicalUrl,
  noindex,
  faqs
}`;

export const relatedGlossaryTermsQuery = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && slug.current != $currentSlug && (
  category == $category || 
  count(tags[@._ref in $tagIds]) > 0 ||
  _id in $relatedTermIds
)][0...5]{
  term,
  "slug": slug.current,
  definition,
  category
}`;

// Tag Queries
export const allTagsQuery = groq`*[_type == "tag" && defined(slug.current)] | order(title asc){
  _id,
  title,
  "slug": slug.current
}`;

export const allTagSlugsQuery = groq`*[_type == "tag" && defined(slug.current)]{
  "slug": slug.current
}`;

export const tagBySlugQuery = groq`*[_type == "tag" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current
}`;

export const postsByTagSlugQuery = groq`*[_type == "blogPost" && defined(slug.current) && $tagSlug in tags[]->slug.current] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  "author": author->{
    name,
    url,
    "avatarUrl": avatar.asset->url
  },
  tags[]->{ title, "slug": slug.current }
}`;

// TypeScript type for tags
export type SanityTag = {
  _id: string;
  title: string;
  slug: string;
};

// TypeScript type for glossary terms
// NOTE: GROQ returns "slug": slug.current, so in TypeScript we use term.slug (string), never slug.current
export type SanityGlossaryTerm = {
  _id: string;
  term: string;
  slug: string; // Already extracted from slug.current by GROQ
  definition: string;
  fullArticle?: any[];
  category?: string;
  tags?: { title: string; slug: string }[];
  relatedTerms?: { term: string; slug: string }[];
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  authorSlug?: string;
  authorUrlFromAuthor?: string;
  authorUrl?: string;
  coverImage?: any;
  coverImageAlt?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  faqs?: {
    question: string;
    answer: any[];
  }[];
};

