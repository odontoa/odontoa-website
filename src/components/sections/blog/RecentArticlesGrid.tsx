"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthorRow } from "@/components/blog/AuthorRow";

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
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="mb-8 md:mb-10 flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-foreground">
            Naši najnoviji članci
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Ostanite informisani sa našim najnovijim uvidima
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
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

                {/* Text Block (Plain, No Box) - Flush alignment */}
                <div className="mt-5 px-0">
                  {/* Tag Pill - Primary tag only */}
                  {post.tags?.[0] && (
                    <Link 
                      href={`/blogovi/tag/${post.tags[0].slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mb-3"
                    >
                      <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors">
                        {post.tags[0].title}
                      </span>
                    </Link>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-semibold leading-tight text-foreground line-clamp-2 max-w-full group-hover:text-foreground/80 transition-colors duration-200">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
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
                variant="pillSecondary"
                size="pill"
                onClick={() => setVisibleCount((prev) => Math.min(prev + STEP, posts.length))}
              >
                Pogledaj više
              </Button>
            </div>
          )}
        </div>
    </section>
  );
}
