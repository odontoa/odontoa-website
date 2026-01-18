import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { calculateReadingTime } from "@/lib/blog-utils";
import { AuthorRow } from "@/components/blog/AuthorRow";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <section
      className={cn(
        plusJakarta.className,
        "relative bg-white before:hidden after:hidden"
      )}
    >

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 pt-32 pb-12 z-10">
        {/* OUTER HERO MODULE WRAPPER - Unified container (clickable) */}
        <Link
          href={postUrl}
          className="block rounded-[32px] bg-slate-50/40 p-3 md:p-4 group cursor-pointer transition-all duration-200 hover:bg-slate-50/50"
        >
          {/* GRID INSIDE WRAPPER */}
          <div className="grid gap-3 md:gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start">
            {/* LEFT: IMAGE SURFACE */}
            <div className="rounded-3xl bg-white p-2">
              {/* Inner image container */}
              <div className="relative overflow-hidden rounded-[22px] aspect-[16/10] bg-slate-100">
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
                      <p className="text-[10px] font-medium text-slate-500">Zakazani termini</p>
                      <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-slate-900">
                        1,234
                      </p>
                      <div className="mt-2 h-[4px] w-full rounded-full bg-[#2F6BFF]" />
                    </div>

                    {/* Card 2: Novi pacijenti (upper-right, orange bar) */}
                    <div className="absolute right-10 top-[84px] w-[180px] rounded-[10px] border border-slate-200/70 bg-white/95 backdrop-blur-[2px] px-3 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                      {/* Icon chip */}
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
                      <p className="text-[10px] font-medium text-slate-500">Novi pacijenti</p>
                      <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-slate-900">456</p>
                      <div className="mt-2 h-[4px] w-full rounded-full bg-[#F59E0B]" />
                    </div>

                    {/* Card 3: Stanje zaliha (bottom-left, red bar) */}
                    <div className="absolute left-[110px] bottom-10 w-[180px] rounded-[10px] border border-slate-200/70 bg-white/95 backdrop-blur-[2px] px-3 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                      {/* Icon chip */}
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
                      <p className="text-[10px] font-medium text-slate-500">Stanje zaliha</p>
                      <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-slate-900">
                        2,890
                      </p>
                      <div className="mt-2 h-[4px] w-full rounded-full bg-[#EF4444]" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: TEXT SURFACE */}
            <div className="rounded-3xl bg-white p-5 md:p-6">
              {/* Category + Reading time row - Pill badges with divider */}
              <div className="mb-4 border-b border-slate-200/60 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60">
                    {category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/70">
                    {readingTime} min čitanja
                  </span>
                </div>
              </div>

              {/* Headline - editorial style with better line-height, 3 lines like reference */}
              <div className="max-h-[9rem] md:max-h-[10.5rem] lg:max-h-[10rem] overflow-hidden">
                <h1 className="pb-2 text-3xl md:text-4xl lg:text-[40px] font-medium tracking-tight leading-[1.1] text-slate-900">
                  {title}
                </h1>
              </div>

              {/* Summary/Excerpt - line-clamp-2 only, no hard character limit */}
              {excerpt && (
                <p className="mt-3 max-w-xl text-base text-slate-600 md:text-lg line-clamp-2">
                  {excerpt}
                </p>
              )}

              {/* Author Row */}
              {post.author && (
                <div className="mt-6">
                  <AuthorRow
                    name={post.author.name || "Odontoa tim"}
                    avatarUrl={post.author.avatarUrl}
                    url={post.author.url}
                    publishedAt={post.publishedAt}
                    updatedAt={post.updatedAt}
                    size="md"
                  />
                </div>
              )}

              {/* Read more link - subtle CTA */}
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#2F6BFF] group-hover:opacity-80 transition-opacity">
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
