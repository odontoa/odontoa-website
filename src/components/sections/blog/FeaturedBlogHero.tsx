import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculateReadingTime } from "@/lib/blog-utils";

interface FeaturedBlogHeroProps {
  post: {
    id: string;
    title: string;
    summary: string;
    image: string;
    url?: string;
    slug: string;
    tags?: { title: string; slug: string }[];
    content?: any[];
  };
}

export function FeaturedBlogHero({ post }: FeaturedBlogHeroProps) {
  const readingTime = calculateReadingTime(post.content);
  const postUrl = post.url || `/blogovi/${post.slug}`;
  const imageUrl = post.image || "/images/blog-cover-new.png";

  // Subtle tech-line background pattern SVG - more visible
  const patternSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="tech-lines" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 0 50 L 100 50" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-opacity="0.4"/>
          <path d="M 50 0 L 50 100" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-opacity="0.4"/>
          <path d="M 0 0 L 100 100" fill="none" stroke="#CBD5E1" stroke-width="0.5" stroke-opacity="0.3"/>
          <path d="M 100 0 L 0 100" fill="none" stroke="#CBD5E1" stroke-width="0.5" stroke-opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#tech-lines)" />
    </svg>
  `)}`;

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/60">
      {/* Background pattern layer - more visible */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `url("${patternSvg}")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column - Image Card with floating stat cards */}
          <div className="relative">
            {/* Outer framed card */}
            <div className="relative rounded-2xl border border-slate-200/70 bg-white p-3 shadow-[0_22px_70px_-40px_rgba(15,23,42,0.35)]">
              {/* Inner image container */}
              <div className="relative overflow-hidden rounded-xl aspect-[16/10] bg-slate-100">
                <Image
                  src={imageUrl}
                  alt={post.title || "Featured blog post"}
                  fill
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />

                {/* Floating stat cards */}
                {/* Card 1: Zakazani termini (top-left, blue bar) */}
                <div className="absolute left-8 top-8 w-[185px] rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                  <p className="text-[10px] font-medium text-slate-500">Zakazani termini</p>
                  <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-slate-900">1,234</p>
                  <div className="mt-2 h-[3px] w-full rounded-full bg-[#2F6BFF]" />
                </div>

                {/* Card 2: Novi pacijenti (upper-right, orange bar) */}
                <div className="absolute right-10 top-[84px] w-[185px] rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                  <p className="text-[10px] font-medium text-slate-500">Novi pacijenti</p>
                  <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-slate-900">456</p>
                  <div className="mt-2 h-[3px] w-full rounded-full bg-[#F59E0B]" />
                </div>

                {/* Card 3: Stanje zaliha (bottom-left, red bar) */}
                <div className="absolute left-[110px] bottom-10 w-[185px] rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                  <p className="text-[10px] font-medium text-slate-500">Stanje zaliha</p>
                  <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-slate-900">2,890</p>
                  <div className="mt-2 h-[3px] w-full rounded-full bg-[#EF4444]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Text content */}
          <div className="flex flex-col">
            {/* Pill + Reading time row */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#2F6BFF] px-3 py-1 text-xs font-medium text-white">
                News!
              </span>
              <span className="text-xs text-slate-500">
                {readingTime} mins read
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 max-w-[14ch] text-[46px] leading-[1.05] tracking-[-0.02em] font-semibold text-slate-900 lg:text-[52px]">
              {post.title || "Digitalni vodič kroz organizaciju vaše ordinacije"}
            </h1>

            {/* Summary/Excerpt - plain text, no card */}
            <p className="mt-4 max-w-[62ch] text-sm leading-6 text-slate-600 line-clamp-3">
              {post.summary || "Praktični saveti, studije slučaja i vodiči za digitalizaciju kartona pacijenata, zakazivanje, zalihe i timski rad – iz perspektive svakodnevnog života u ordinaciji."}
            </p>

            {/* Read more link */}
            <Link
              href={postUrl}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#2F6BFF] hover:opacity-80 transition-opacity"
            >
              Read More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
