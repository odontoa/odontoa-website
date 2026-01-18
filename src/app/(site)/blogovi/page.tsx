import { sanityClient } from "@/lib/sanity.client";
import { 
  allBlogPostsQuery, 
  heroFeaturedPostQuery,
  pinnedFeaturedPostsQuery,
  type SanityBlogPost 
} from "@/lib/sanity.queries";
import { Metadata } from "next";
import { urlFor } from "@/lib/sanity.image";
import { FeaturedBlogHero } from "@/components/sections/blog/FeaturedBlogHero";
import { FeaturedHeroReplica } from "@/components/sections/blog/FeaturedHeroReplica";
import { PinnedFeaturedSection } from "@/components/sections/blog/PinnedFeaturedSection";
import { RecentArticlesGrid } from "@/components/sections/blog/RecentArticlesGrid";
import { TopicCarousel } from "@/components/sections/blog/TopicCarousel";
import { BlogCTABanner } from "@/components/sections/blog/BlogCTABanner";
import { NewsletterBand } from "@/components/sections/blog/NewsletterBand";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blogovi – Odontoa",
    description:
      "Digitalizacija stomatološke ordinacije: saveti o organizaciji pacijenata, zalihama i zakazivanju termina.",
    openGraph: {
      title: "Blogovi – Odontoa",
      description:
        "Saveti i praksa iz ordinacije: pacijenti, zalihe, zakazivanje, analitika.",
    },
  };
}

function formatToSerbianDate(isoString: string): string {
  const date = new Date(isoString);
  const months = [
    "januar", "februar", "mart", "april", "maj", "jun",
    "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}. ${month} ${year}`;
}

// Helper function to transform Sanity post to component format
function transformPost(post: SanityBlogPost) {
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(800).url()
    : "/images/blog-cover-new.png";

  return {
    id: post.slug,
    _id: post._id,
    title: post.title || "",
    summary: post.excerpt || "",
    slug: post.slug,
    tags: post.tags || [],
    author: post.author, // Pass author object directly
    publishedAt: post.publishedAt, // Keep ISO string for AuthorRow
    updatedAt: post.updatedAt, // For date fallback
    published: post.publishedAt ? formatToSerbianDate(post.publishedAt) : "", // Keep for backward compatibility
    url: `/blogovi/${post.slug}`,
    image: coverImageUrl,
    content: post.content,
    featured: !!post.featured,
    featuredAt: post.featuredAt || post.publishedAt || null,
  };
}

export default async function BlogoviPage() {
  let heroPost: any = null;
  let pinnedPosts: any[] = [];
  let allPosts: any[] = [];
  let sanityPosts: SanityBlogPost[] = [];

  try {
    // Fetch hero post
    const heroSanityPost = await sanityClient.fetch<SanityBlogPost | null>(
      heroFeaturedPostQuery,
      {},
      { cache: "no-store" } as any
    );
    
    // Fetch pinned posts
    const pinnedSanityPosts = await sanityClient.fetch<SanityBlogPost[]>(
      pinnedFeaturedPostsQuery,
      {},
      { cache: "no-store" } as any
    );

    // Fetch all posts for recent/trending sections
    sanityPosts = await sanityClient.fetch<SanityBlogPost[]>(
      allBlogPostsQuery,
      {},
      { cache: "no-store" } as any
    );

    // Transform posts
    if (heroSanityPost) {
      heroPost = transformPost(heroSanityPost);
    }
    
    pinnedPosts = (pinnedSanityPosts || [])
      .filter((post) => post?.title && post?.slug)
      .map(transformPost);

    allPosts = (sanityPosts || [])
      .filter((post) => post?.title && post?.slug)
      .map(transformPost);
  } catch (error) {
    console.error("Error fetching blog posts from Sanity:", error);
  }

  // Fallback: if no hero post from query, use newest post
  if (!heroPost && allPosts.length > 0) {
    heroPost = allPosts[0];
  }

  // Use allPosts directly - hero and pinned posts can appear in recent
  // Pass enough posts (24) to RecentArticlesGrid for progressive reveal
  const recentPosts = allPosts.slice(0, 24);

  return (
    <>
      {/* Featured Hero Replica */}
      {heroPost && <FeaturedHeroReplica post={heroPost} />}

      {/* Featured Blog Hero - Keep for now, can be removed later */}
      {/* {heroPost && (
        <FeaturedBlogHero post={heroPost} />
      )} */}

      {/* Recent Articles Grid */}
      {recentPosts.length > 0 && (
        <RecentArticlesGrid posts={recentPosts} />
      )}

      {/* Pinned Featured Section */}
      {pinnedPosts.length > 0 && <PinnedFeaturedSection posts={pinnedPosts} />}

      {/* Topic Carousel */}
      <TopicCarousel />

      {/* CTA Banner */}
      <BlogCTABanner />

      {/* Newsletter Band */}
      <NewsletterBand />
    </>
  );
}
