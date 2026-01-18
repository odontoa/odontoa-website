"use client";

import * as React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function NewsletterBand() {
  const [email, setEmail] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: hook into real newsletter provider later
    // eslint-disable-next-line no-console
    console.log("newsletter_email", email);
  }

  return (
    <section
      className={cn(
        plusJakarta.className,
        "relative bg-white overflow-hidden antialiased [text-rendering:optimizeLegibility]"
      )}
    >
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

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 py-[56px] lg:py-[64px]">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 items-center">
          {/* Left */}
          <div>
            <h2 className="text-[26px] md:text-[30px] lg:text-[34px] font-semibold text-slate-900 leading-[1.08] tracking-[-0.02em]">
              Optimizujte rad ordinacije uz Odontoa
            </h2>
            <p className="mt-3 text-[13px] md:text-[14px] text-slate-500 leading-[1.6] max-w-[52ch]">
              Praktični saveti o digitalnoj kartoteci, zakazivanju, zalihama i organizaciji tima.
              Kratko, konkretno i bez spama.
            </p>
          </div>

          {/* Right */}
          <div className="lg:justify-self-end w-full lg:max-w-[420px]">
            <div className="text-[13px] font-semibold text-slate-900">Newsletter</div>
            <div className="mt-1 text-[12px] text-slate-400 leading-[1.45]">
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
                className="h-[38px] flex-1 rounded-[10px] border border-slate-200/80 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/20 focus:border-[#2F6BFF]/40"
                required
              />
              <button
                type="submit"
                className="h-[38px] rounded-[10px] bg-[#2F6BFF] px-4 text-[13px] font-semibold text-white transition active:scale-[0.98] hover:bg-[#2A60F0]"
              >
                Prijavi se
              </button>
            </form>

            <div className="mt-3 text-[11px] text-slate-400">
              Možete se odjaviti u bilo kom trenutku. Vaša privatnost nam je važna.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
