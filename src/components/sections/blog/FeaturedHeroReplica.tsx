import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculateReadingTime } from "@/lib/blog-utils";
import { AuthorRow } from "@/components/blog/AuthorRow";

type FeaturedHeroReplicaPost = {
  title: string;
  summary?: string;
  url: string;
  image: string;
  author?: {
    name?: string;
    avatarUrl?: string;
    url?: string;
  } | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  published?: string; // Keep for backward compatibility
  content?: any[];
  body?: any[];
  tags?: { title: string; slug: string }[] | string[];
};

type FeaturedHeroReplicaProps = {
  post: FeaturedHeroReplicaPost;
  showStats?: boolean;
};

export function FeaturedHeroReplica({ post, showStats = false }: FeaturedHeroReplicaProps) {
  const title = post.title;
  const excerpt = post.summary || "";
  const imageUrl = post.image || "/images/blog-cover-new.png";
  
  // Handle content/body field fallback
  const content = post.content ?? post.body ?? [];
  const readingTime = calculateReadingTime(content);
  
  const postUrl = post.url;
  
  // Extract category from tags with robust fallback
  // Handles both {title, slug} objects and string arrays
  const firstTag = post?.tags?.[0];
  const category = 
    typeof firstTag === "string" 
      ? firstTag 
      : firstTag?.title ?? "Blog";

  return (
    <section className="relative bg-white before:hidden after:hidden">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 z-10">
        {/* OUTER HERO MODULE WRAPPER - Unified container (clickable) */}
        <Link
          href={postUrl}
          className="block rounded-[32px] bg-slate-50/40 p-3 md:p-4 group cursor-pointer transition-all duration-200 hover:bg-slate-50/50"
        >
          {/* GRID INSIDE WRAPPER */}
          <div className="grid gap-3 md:gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start">
            {/* LEFT: IMAGE SURFACE */}
            <div className="rounded-3xl bg-white p-2">
              {/* Inner image container - fixed height so card grows vertically with title */}
              <div className="relative h-[260px] md:h-[320px] lg:h-[360px] w-full overflow-hidden rounded-[22px] bg-slate-100">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />

                {/* Floating stat cards - conditionally rendered */}
                {showStats && (
                  <>
                    {/* Card 1: Zakazani termini (top-left, blue bar) */}
                    <div className="absolute left-8 top-8 w-[180px] rounded-[10px] border border-slate-200/70 bg-white/95 backdrop-blur-[2px] px-3 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                      {/* Icon chip */}
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
                      <p className="text-xs font-medium text-muted-foreground">Zakazani termini</p>
                      <p className="mt-0.5 text-base font-semibold tracking-tight text-foreground">
                        1,234
                      </p>
                      <div className="mt-2 h-1 w-full rounded-full bg-primary" />
                    </div>

                    {/* Card 2: Novi pacijenti (upper-right, orange bar) */}
                    <div className="absolute right-10 top-[84px] w-[180px] rounded-[10px] border border-slate-200/70 bg-white/95 backdrop-blur-[2px] px-3 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                      {/* Icon chip */}
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
                      <p className="text-xs font-medium text-muted-foreground">Novi pacijenti</p>
                      <p className="mt-0.5 text-base font-semibold tracking-tight text-foreground">456</p>
                      <div className="mt-2 h-[4px] w-full rounded-full bg-[#F59E0B]" />
                    </div>

                    {/* Card 3: Stanje zaliha (bottom-left, red bar) */}
                    <div className="absolute left-[110px] bottom-10 w-[180px] rounded-[10px] border border-slate-200/70 bg-white/95 backdrop-blur-[2px] px-3 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                      {/* Icon chip */}
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
                      <p className="text-xs font-medium text-muted-foreground">Stanje zaliha</p>
                      <p className="mt-0.5 text-base font-semibold tracking-tight text-foreground">
                        2,890
                      </p>
                      <div className="mt-2 h-[4px] w-full rounded-full bg-[#EF4444]" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: TEXT SURFACE */}
            <div className="min-w-0 flex flex-col gap-3 rounded-3xl bg-white p-5 md:p-6">
              {/* Category + Reading time row - Pill badges with divider */}
              <div className="mb-4 border-b border-slate-200/60 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-200/60">
                    Istaknuto
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60">
                    {category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/70">
                    {readingTime} min čitanja
                  </span>
                </div>
              </div>

              {/* Headline - full title visible, no truncation */}
              <div className="min-w-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05] text-foreground whitespace-normal break-words">
                  {title}
                </h1>
              </div>

              {/* Summary/Excerpt */}
              {excerpt && (
                <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-2">
                  {excerpt}
                </p>
              )}

              {/* Author Row */}
              {post.author && (
                <div>
                  <AuthorRow
                    name={post.author.name || "Odontoa tim"}
                    avatarUrl={post.author.avatarUrl}
                    url={post.author.url}
                    publishedAt={post.publishedAt}
                    updatedAt={post.updatedAt}
                    size="md"
                    showDate={false}
                  />
                </div>
              )}

              {/* Read more link - subtle CTA */}
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:opacity-80 transition-opacity">
                Pročitaj
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
