import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { calculateReadingTime } from "@/lib/blog-utils";
import { AuthorRow } from "@/components/blog/AuthorRow";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Post {
  id: string;
  title: string;
  summary?: string;
  image: string;
  url: string;
  author?: {
    name?: string;
    avatarUrl?: string;
    url?: string;
  } | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  tags?: { title: string; slug: string }[] | string[];
  content?: any[];
}

interface PinnedFeaturedSectionProps {
  posts: Post[];
}

export function PinnedFeaturedSection({ posts }: PinnedFeaturedSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        plusJakarta.className,
        "w-full bg-white py-12"
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* LEFT: Copy */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-slate-900 mb-6 leading-tight">
              Preporučeni vodiči
            </h2>
            <p className="mt-2 max-w-prose text-sm text-slate-600 mb-8">
              Tri članka koja preporučujemo da prvo pročitate. Kratko, praktično i odmah primenljivo u radu ordinacije.
            </p>

            <Link
              href="/blogovi"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Pogledaj sve članke
              <span className="hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* RIGHT: 3 stacked featured posts */}
          <div className="space-y-4">
            {posts.slice(0, 3).map((post) => {
              // Extract category from tags
              const firstTag = post?.tags?.[0];
              const category =
                typeof firstTag === "string"
                  ? firstTag
                  : firstTag?.title ?? "Blog";

              // Calculate reading time
              const readingTime = calculateReadingTime(post.content ?? []);

              // Image URL
              const imageUrl = post.image || "/images/blog-cover-new.png";

                return (
                  <Link
                    key={post.id}
                    href={post.url}
                    className="group flex gap-4 rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md items-start"
                  >
                    {/* Left: Thumbnail - rectangular */}
                    <div className="relative h-[160px] w-[220px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="220px"
                      />
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0 flex flex-col h-[160px]">
                      {/* Category - plain text in purple */}
                      <div className="mb-1.5">
                        <span className="text-xs font-medium text-purple-600">
                          {category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="line-clamp-2 text-base font-semibold text-slate-900 mb-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.summary && (
                        <p className="line-clamp-2 text-sm text-slate-600 mb-3 flex-1">
                          {post.summary}
                        </p>
                      )}

                      {/* Author Row */}
                      {post.author && (
                        <div className="mb-3">
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

                      {/* Read More Link - positioned at bottom to align with image bottom */}
                      <div className="inline-flex items-center gap-1 text-sm font-medium text-[#2F6BFF] group-hover:gap-2 transition-all mt-auto">
                        Pročitaj više
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
