"use client";

import { Play } from "lucide-react";

/**
 * Placeholder za demo video – kako aplikacija izgleda.
 * Zameni ovaj sadržaj <video> ili iframe kada imaš snimljen marketing video.
 */
export function VideoDemoPlaceholder() {
  return (
    <section id="video-demo" className="w-full bg-muted/30 py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Kako aplikacija izgleda u praksi
          </h2>
          <p className="mt-2 text-muted-foreground">
            Demo video
          </p>
        </div>
        {/* Placeholder: zameni ovaj div sadržajem <video> kada imaš snimku */}
        <div
          className="relative w-full rounded-xl border border-border bg-muted overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10 ring-4 ring-muted-foreground/5">
              <Play className="h-8 w-8 ml-1 text-muted-foreground" fill="currentColor" />
            </div>
            <p className="text-sm font-medium">Ovde će biti demo video</p>
            <p className="text-xs max-w-sm text-center">
              Dodaj <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">&lt;video&gt;</code> ili embed kada snimiš materijal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
