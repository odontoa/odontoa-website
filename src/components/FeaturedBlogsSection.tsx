import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity.client";
import { allBlogPostsQuery, type SanityBlogPost } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthorRow } from "@/components/blog/AuthorRow";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Helper function to transform Sanity post to component format (same as blogovi/page.tsx)
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
    url: `/blogovi/${post.slug}`,
    image: coverImageUrl,
    content: post.content,
  };
}

async function getFeaturedBlogs() {
  try {
    // Fetch all posts and get the latest 3
    const allSanityPosts = await sanityClient.fetch<SanityBlogPost[]>(
      allBlogPostsQuery,
      {},
      { cache: "no-store" } as any
    );
    
    // Get latest 3 posts (already sorted by publishedAt desc in query)
    const latestPosts = (allSanityPosts || [])
      .filter((post) => post?.title && post?.slug)
      .slice(0, 3);
    
    // Transform posts
    const posts = latestPosts.map(transformPost);
    
    return posts;
  } catch (error) {
    console.error("Error fetching latest blog posts from Sanity:", error);
    return [];
  }
}

const FeaturedBlogsSection = async () => {
  const blogs = await getFeaturedBlogs();

  return (
    <section
      className={cn(
        plusJakarta.className,
        "w-full bg-white py-16 md:py-24"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Naši najnoviji članci
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
              Najnoviji članci i vodiči za digitalizaciju ordinacije
            </p>
          </div>
        </div>

        {/* Blog Cards Grid - 3 članka */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start">
            {blogs.map((post) => (
              <Link
                key={post.id}
                href={post.url}
                className="flex flex-col h-full group cursor-pointer"
              >
                <article className="flex flex-col h-full">
                  {/* Image Tile (No border, just rounded) */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-slate-100">
                    <div className="relative h-44 md:h-48 lg:h-52 w-full overflow-hidden">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <Image
                          src="/images/blog-cover-new.png"
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      )}
                    </div>
                  </div>

                  {/* Text Block (Plain, No Box) */}
                  <div className="mt-4">
                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug line-clamp-2 max-w-full group-hover:text-slate-700 transition-colors duration-200">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Author Row */}
                    {post.author && (
                      <div className="mt-4">
                        <AuthorRow
                          name={post.author.name || "Odontoa tim"}
                          avatarUrl={post.author.avatarUrl}
                          url={post.author.url}
                          publishedAt={post.publishedAt}
                          updatedAt={post.updatedAt}
                          size="sm"
                        />
                      </div>
                    )}

                    {/* Read More Link */}
                    <div className="inline-flex items-center gap-1 mt-5 md:mt-6 text-sm font-medium text-primary hover:text-primary/90 transition-colors duration-200">
                      Pročitaj više
                      <ArrowRight className="h-4 w-4 translate-y-[1px] transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">
              Trenutno nema dostupnih blog postova.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="pillSecondary"
            size="pill"
            asChild
            className="gap-2"
          >
            <Link href="/blogovi">
              Pogledaj sve članke
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogsSection; 