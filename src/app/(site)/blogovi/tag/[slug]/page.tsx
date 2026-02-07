import { sanityClient } from "@/lib/sanity.client";
import {
  allTagSlugsQuery,
  tagBySlugQuery,
  postsByTagSlugQuery,
  allTagsQuery,
  type SanityTag,
  type SanityBlogPost,
} from "@/lib/sanity.queries";
import { Metadata } from "next";
import { urlFor } from "@/lib/sanity.image";
import { RecentArticlesGrid } from "@/components/sections/blog/RecentArticlesGrid";
import { CategoryPills } from "@/components/sections/blog/CategoryPills";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const tags = await sanityClient.fetch<Array<{ slug: string }>>(
      allTagSlugsQuery,
      {},
      { cache: "no-store" } as any
    );

    return tags.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for tags:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  try {
    const tag = await sanityClient.fetch<SanityTag | null>(
      tagBySlugQuery,
      { slug: params.slug },
      { cache: "no-store" } as any
    );

    if (!tag) {
      return {
        title: "Tag nije pronađen | Odontoa blog",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://odontoa.com";
    const canonicalUrl = `${baseUrl}/blogovi/tag/${tag.slug}`;

    return {
      title: `${tag.title} | Odontoa blog`,
      description: `Svi članci na temu: ${tag.title}`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${tag.title} | Odontoa blog`,
        description: `Svi članci na temu: ${tag.title}`,
        url: canonicalUrl,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${tag.title} | Odontoa blog`,
        description: `Svi članci na temu: ${tag.title}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for tag page:", error);
    return {
      title: "Tag | Odontoa blog",
    };
  }
}

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
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    published: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("sr-RS")
      : "",
    url: `/blogovi/${post.slug}`,
    image: coverImageUrl,
    content: post.content,
    featured: !!post.featured,
    featuredAt: post.featuredAt || post.publishedAt || null,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  let tag: SanityTag | null = null;
  let posts: any[] = [];
  let allTags: SanityTag[] = [];

  try {
    // Fetch tag metadata
    tag = await sanityClient.fetch<SanityTag | null>(
      tagBySlugQuery,
      { slug: params.slug },
      { cache: "no-store" } as any
    );

    if (!tag) {
      notFound();
    }

    // Fetch posts with this tag
    const sanityPosts = await sanityClient.fetch<SanityBlogPost[]>(
      postsByTagSlugQuery,
      { tagSlug: params.slug },
      { cache: "no-store" } as any
    );

    // Fetch all tags for CategoryPills
    allTags = await sanityClient.fetch<SanityTag[]>(
      allTagsQuery,
      {},
      { cache: "no-store" } as any
    );

    // Transform posts
    posts = (sanityPosts || [])
      .filter((post) => post?.title && post?.slug)
      .map(transformPost);
  } catch (error) {
    console.error("Error fetching tag page data:", error);
    notFound();
  }

  return (
    <>
      {/* Category Pills - With active tag */}
      {allTags.length > 0 && (
        <section className="w-full bg-white py-12 md:py-16">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryPills tags={allTags} activeTagSlug={tag.slug} />
          </div>
        </section>
      )}

      {/* Tag Header */}
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-foreground">
            Članci: {tag.title}
          </h1>
          {posts.length > 0 && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Pronađeno {posts.length} {posts.length === 1 ? "članak" : "članaka"}
            </p>
          )}
        </div>
      </section>

      {/* Posts Grid or Empty State */}
      {posts.length > 0 ? (
        <RecentArticlesGrid posts={posts} />
      ) : (
        <section className="w-full bg-white py-16 md:py-20">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-base md:text-lg text-muted-foreground mb-4">
              Nema članaka sa tagom "{tag.title}"
            </p>
            <a
              href="/blogovi"
              className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
            >
              Vrati se na sve članke
            </a>
          </div>
        </section>
      )}
    </>
  );
}
