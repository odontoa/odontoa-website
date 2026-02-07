"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  tags: Array<{ title: string; slug: string }>;
  activeTagSlug?: string;
  baseUrl?: string;
}

export function CategoryPills({ 
  tags, 
  activeTagSlug,
  baseUrl = "/blogovi"
}: CategoryPillsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold leading-tight text-foreground">Teme</h3>
      </div>

      {/* Tabs Container - Scrollable on mobile, single line on desktop */}
      <div className="mt-3 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center gap-6 min-w-max border-b border-border">
          {/* "Sve" tab */}
          <Link
            href={baseUrl}
            aria-current={!activeTagSlug ? "page" : undefined}
            className={cn(
              "relative inline-flex items-center py-2 text-sm md:text-base transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
              !activeTagSlug
                ? "text-foreground font-semibold border-b-2 border-foreground -mb-[1px]"
                : "text-muted-foreground border-b-2 border-transparent hover:text-foreground/80 hover:border-border -mb-[1px]"
            )}
          >
            Sve
          </Link>

          {/* Tag tabs */}
          {tags.map((tag) => {
            const isActive = activeTagSlug === tag.slug;
            return (
              <Link
                key={tag.slug}
                href={`${baseUrl}/tag/${tag.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center py-2 text-sm md:text-base transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
                  isActive
                    ? "text-foreground font-semibold border-b-2 border-foreground -mb-[1px]"
                    : "text-muted-foreground border-b-2 border-transparent hover:text-foreground/80 hover:border-border -mb-[1px]"
                )}
              >
                {tag.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
