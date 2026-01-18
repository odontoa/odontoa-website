"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthorRow } from "@/components/blog/AuthorRow";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Post {
  id: string;
  title: string;
  summary: string;
  image: string;
  url: string;
  author?: {
    name?: string;
    avatarUrl?: string;
    url?: string;
  } | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  published?: string; // Keep for backward compatibility
  tags?: { title: string; slug: string }[];
}

interface RecentArticlesGridProps {
  posts: Post[];
}

export function RecentArticlesGrid({ posts }: RecentArticlesGridProps) {
  const DEFAULT_VISIBLE = 6;
  const STEP = 6;

  const [visibleCount, setVisibleCount] = React.useState<number>(DEFAULT_VISIBLE);

  if (!posts || posts.length === 0) {
    return null;
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const canLoadMore = visibleCount < posts.length;

  return (
    <section
      className={cn(
        plusJakarta.className,
        "w-full bg-white py-14 md:py-16 lg:py-20"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Constrained container for narrower cards (left-aligned) */}
        <div className="max-w-7xl">
          {/* Header Row */}
          <div className="mb-8 md:mb-10">
            {/* Title + Subtitle */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Naši najnoviji članci
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
                Ostanite informisani sa našim najnovijim uvidima
              </p>
            </div>
          </div>

          {/* Articles Grid - tighter gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start">
          {visiblePosts.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              className="flex flex-col h-full group cursor-pointer"
            >
              <article className="flex flex-col h-full">
                {/* Image Tile (Separate Floating Card) */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-white border border-slate-200/60 hover:border-slate-300/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out">
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
                <div className="mt-4 p-5 md:p-6">
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

          {/* Load More Button */}
          {canLoadMore && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setVisibleCount((prev) => Math.min(prev + STEP, posts.length))}
              >
                Pogledaj više
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
