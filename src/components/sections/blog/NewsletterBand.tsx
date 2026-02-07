"use client";

import * as React from "react";

export function NewsletterBand() {
  const [email, setEmail] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: hook into real newsletter provider later
    // eslint-disable-next-line no-console
    console.log("newsletter_email", email);
  }

  return (
    <section className="relative bg-white overflow-hidden antialiased">
      {/* Subtle tech lines background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 360"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-40 85 C 180 35, 330 145, 520 95 C 705 45, 820 120, 980 90 C 1090 70, 1165 55, 1240 60"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <path
            d="M-60 170 C 170 120, 360 225, 560 175 C 760 125, 880 215, 1040 180 C 1145 160, 1190 150, 1260 150"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <path
            d="M-30 255 C 210 205, 360 305, 580 260 C 800 215, 920 295, 1080 265 C 1170 248, 1220 242, 1260 240"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Soft bottom band (very subtle) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-slate-900/[0.03]" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 items-center">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-foreground">
              Optimizujte rad ordinacije uz Odontoa
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[52ch]">
              Praktični saveti o digitalnoj kartoteci, zakazivanju, zalihama i organizaciji tima.
              Kratko, konkretno i bez spama.
            </p>
          </div>

          {/* Right */}
          <div className="lg:justify-self-end w-full lg:max-w-[420px]">
            <div className="text-sm font-semibold text-foreground">Newsletter</div>
            <div className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Prijavite se da dobijate nove vodiče i uvid u najbolje prakse.
            </div>

            <form onSubmit={onSubmit} className="mt-4 flex items-center gap-2">
              <label className="sr-only" htmlFor="newsletter-email">
                Vaša email adresa
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Vaša email adresa"
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                required
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition active:scale-[0.98] hover:bg-primary/90"
              >
                Prijavi se
              </button>
            </form>

            <div className="mt-3 text-xs text-muted-foreground">
              Možete se odjaviti u bilo kom trenutku. Vaša privatnost nam je važna.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
