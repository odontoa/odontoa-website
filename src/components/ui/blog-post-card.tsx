import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const cardVariants = cva(
  cn(
    "group relative rounded-3xl bg-white",
    "border border-slate-200/50",
    "transition-all duration-200 ease-out",
    "hover:border-slate-300/60 hover:shadow-[0_8px_24px_-18px_rgba(2,6,23,0.25)]"
  ),
  {
    variants: {
      variant: {
        grid: "overflow-hidden",
        stack: "p-4",
        hero: "overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "grid",
    },
  }
);

type BlogAuthor = {
  name?: string;
  avatarUrl?: string;
  url?: string;
};

export interface BlogPostCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  tag?: string; // e.g. "Blog"
  readTime?: string; // e.g. "1 min čitanja"
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaText?: string; // e.g. "Pročitaj"
  author: BlogAuthor | null; // Author is required (always exists in Sanity)
  publishedAt?: string | null;
  fallbackAuthorName?: string; // default: "Odontoa tim"
}

function Pills({ tag, readTime }: { tag?: string; readTime?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tag ? (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {tag}
        </span>
      ) : null}
      {readTime ? (
        <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          {readTime}
        </span>
      ) : null}
    </div>
  );
}

function formatSrDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const months = [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}. ${month} ${year}`;
}

function getInitials(name?: string | null, fallback: string = "O"): string {
  if (!name) return fallback;
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name[0]?.toUpperCase() || fallback;
}

interface AuthorRowProps {
  author: BlogAuthor | null;
  publishedAt?: string | null;
  fallbackAuthorName?: string;
  variant?: "hero" | "grid" | "stack";
}

function AuthorRow({
  author,
  publishedAt,
  fallbackAuthorName = "Odontoa tim",
  variant = "grid",
}: AuthorRowProps) {
  const authorName = author?.name || fallbackAuthorName;
  const avatarUrl = author?.avatarUrl;
  const authorUrl = author?.url;
  const formattedDate = formatSrDate(publishedAt);

  const avatarSize = variant === "hero" ? "h-8 w-8" : "h-7 w-7";
  const marginTop = variant === "hero" ? "mt-6" : variant === "stack" ? "mt-4" : "mt-5";

  const AvatarComponent = (
    <div className={cn(avatarSize, "rounded-full bg-slate-100 shrink-0", avatarUrl ? "relative overflow-hidden" : "flex items-center justify-center")}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={authorName}
          fill
          className="object-cover"
          sizes={variant === "hero" ? "32px" : "28px"}
        />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground">
          {getInitials(authorName)}
        </span>
      )}
    </div>
  );

  const TextBlock = (
    <div className="flex flex-col leading-tight min-w-0">
      <span className="text-sm font-medium text-foreground truncate">
        {authorName}
      </span>
      {formattedDate && (
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      )}
    </div>
  );

  const AuthorContent = (
    <div className={cn("flex items-center gap-3", marginTop)}>
      {AvatarComponent}
      {TextBlock}
    </div>
  );

  if (authorUrl) {
    return (
      <Link href={authorUrl} className="block hover:opacity-80 transition-opacity">
        {AuthorContent}
      </Link>
    );
  }

  return AuthorContent;
}

export const BlogPostCard = React.forwardRef<HTMLDivElement, BlogPostCardProps>(
  (
    {
      className,
      variant,
      tag = "Blog",
      readTime = "1 min čitanja",
      title,
      description,
      href,
      imageUrl,
      imageAlt,
      ctaText = "Pročitaj",
      author,
      publishedAt,
      fallbackAuthorName = "Odontoa tim",
      ...props
    },
    ref
  ) => {
    // Shared image block (Odontoa clean, no extra frames/lines)
    const Img = imageUrl ? (
      <div className="relative overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            "group-hover:scale-[1.02]"
          )}
          sizes={
            variant === "hero"
              ? "(min-width: 1024px) 60vw, 100vw"
              : "(min-width: 1024px) 320px, 100vw"
          }
          priority={variant === "hero"}
        />
      </div>
    ) : null;

    // Variant layouts
    if (variant === "hero") {
      return (
        <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props}>
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Image left */}
            <div className="relative min-h-[260px] lg:min-h-[340px]">
              {Img}
            </div>

            {/* Content right */}
            <div className="p-6 md:p-7 lg:p-8">
              <div className="mb-4 border-b border-slate-200/60 pb-4">
                <Pills tag={tag} readTime={readTime} />
              </div>

              <h3 className="text-lg md:text-xl font-semibold leading-tight text-foreground pb-2">
                {title}
              </h3>

              {description ? (
                <p className="mt-3 line-clamp-3 text-sm md:text-base text-muted-foreground">
                  {description}
                </p>
              ) : null}

              <AuthorRow
                author={author}
                publishedAt={publishedAt}
                fallbackAuthorName={fallbackAuthorName}
                variant="hero"
              />

              <div className="mt-6">
                <Button asChild variant="pillSecondary" size="pill" className="gap-2">
                  <Link href={href} aria-label={`Pročitaj: ${title}`}>
                    {ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "stack") {
      return (
        <Link
          href={href}
          className={cn(cardVariants({ variant, className }), "block")}
          aria-label={`Pročitaj: ${title}`}
        >
          <div className="flex gap-4">
            {/* small thumb */}
            <div className="relative h-[84px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt || title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="120px"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="mb-2">
                <Pills tag={tag} readTime={readTime} />
              </div>

              <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                {title}
              </h3>

              {description ? (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {description}
                </p>
              ) : null}

              <AuthorRow
                author={author}
                publishedAt={publishedAt}
                fallbackAuthorName={fallbackAuthorName}
                variant="stack"
              />
            </div>
          </div>
        </Link>
      );
    }

    // grid (default)
    return (
      <Link
        href={href}
        className={cn(cardVariants({ variant, className }), "block overflow-hidden")}
        aria-label={`Pročitaj: ${title}`}
      >
        {/* top image */}
        {imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 360px, 100vw"
            />
          </div>
        ) : null}

        <div className="p-5">
          <div className="mb-3">
            <Pills tag={tag} readTime={readTime} />
          </div>

          <h3 className="line-clamp-2 text-lg md:text-xl font-semibold leading-tight text-foreground">
            {title}
          </h3>

          {description ? (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}

          <AuthorRow
            author={author}
            publishedAt={publishedAt}
            fallbackAuthorName={fallbackAuthorName}
            variant="grid"
          />

          <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    );
  }
);

BlogPostCard.displayName = "BlogPostCard";
