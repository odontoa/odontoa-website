"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, CreditCard, Wrench, BarChart3, ArrowRight } from "lucide-react";
import { DeviceModeToggle, type DeviceMode } from "../DeviceModeToggle";
import { FigmaDesktopSidebar } from "../figma-dashboard/sidebars";
import { FigmaTabletSidebar } from "../figma-dashboard/sidebars";

// ─── Hub card data ────────────────────────────────────────

const hubCards = [
  {
    label: "Predračun",
    description: "Kreiraj i upravljaj predračunima za pacijente — od nacrta do finalnog dokumenta.",
    href: "/ui-lab/finansije/predracun",
    Icon: FileText,
  },
  {
    label: "Uplate",
    description: "Evidentiraj uplate pacijenata, prati načine plaćanja i istoriju transakcija.",
    href: "/ui-lab/finansije/uplate",
    Icon: CreditCard,
  },
  {
    label: "Tehnika",
    description: "Finansijski pregled saradnje sa tehničkim laboratorijama i dospelih obaveza.",
    href: "/ui-lab/finansije/tehnika",
    Icon: Wrench,
  },
  {
    label: "Izveštaji",
    description: "Pregled finansijskih izveštaja, prometa i statistika po periodu i doktoru.",
    href: "/ui-lab/finansije/izvestaji",
    Icon: BarChart3,
  },
];

// ─── Card component ───────────────────────────────────────

function HubCard({ label, description, href, Icon }: typeof hubCards[0]) {
  return (
    <div
      className="flex flex-col gap-[16px] p-[24px] h-full"
      style={{
        background: "var(--v2-surface)",
        borderRadius: "var(--v2-radius-card)",
      }}
    >
      <div
        className="flex items-center justify-center p-[12px] flex-shrink-0 self-start"
        style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}
      >
        <Icon className="h-6 w-6" style={{ color: "var(--v2-primary-fg)" }} />
      </div>
      <div className="flex flex-col gap-[8px] flex-1">
        <h2 className="font-semibold leading-[1.2]" style={{ fontSize: "18px", color: "var(--v2-text-heading)" }}>
          {label}
        </h2>
        <p className="leading-[1.5]" style={{ fontSize: "13px", color: "var(--v2-text-muted)" }}>
          {description}
        </p>
      </div>
      <Link
        href={href}
        className="flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-90 flex-shrink-0"
        style={{
          padding: "10px 16px",
          borderRadius: "var(--v2-radius-pill)",
          background: "var(--v2-primary)",
          color: "var(--v2-primary-fg)",
        }}
      >
        Otvori
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────

function DesktopHub({ className }: { className?: string }) {
  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        {/* Topbar */}
        <header
          className="flex items-center justify-between flex-shrink-0 pl-[4px]"
          style={{ height: "var(--v2-topbar-h)" }}
        >
          <h1 className="font-semibold" style={{ fontSize: "22px", color: "var(--v2-text)" }}>Finansije</h1>
          <div className="flex items-center gap-[12px]">
            <div
              className="flex items-center justify-center font-semibold text-[12px]"
              style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
            >
              MM
            </div>
            <div className="hidden sm:flex flex-col gap-[2px]">
              <div className="font-bold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>Dr Marko Marković</div>
              <div style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Administrator</div>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <p className="text-[13px] mb-[20px]" style={{ color: "var(--v2-text-muted)" }}>
            Odaberite modul koji želite da otvorite.
          </p>
          <div className="grid grid-cols-2 gap-[20px]">
            {hubCards.map(card => <HubCard key={card.href} {...card} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tablet layout ────────────────────────────────────────

function TabletHub({ className }: { className?: string }) {
  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaTabletSidebar />
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <header
          className="flex items-center justify-between flex-shrink-0 pl-[4px]"
          style={{ height: "var(--v2-topbar-h)" }}
        >
          <h1 className="font-semibold" style={{ fontSize: "20px", color: "var(--v2-text)" }}>Finansije</h1>
          <div
            className="flex items-center justify-center font-semibold text-[12px]"
            style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
          >
            MM
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <p className="text-[13px] mb-[16px]" style={{ color: "var(--v2-text-muted)" }}>Odaberite modul.</p>
          <div className="grid grid-cols-2 gap-[16px]">
            {hubCards.map(card => <HubCard key={card.href} {...card} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile layout ────────────────────────────────────────

function MobileHub({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <header
        className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <div className="flex items-center gap-[8px]">
          <Image
            src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
            alt="Odontoa"
            width={32}
            height={32}
            className="h-[32px] w-[32px] object-contain"
          />
          <h1 className="font-semibold" style={{ fontSize: "18px", color: "var(--v2-text)" }}>Finansije</h1>
        </div>
        <div
          className="flex items-center justify-center font-semibold text-[11px]"
          style={{ height: "32px", width: "32px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
        >
          MM
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[12px] rounded-t-[24px]" style={{ background: "var(--v2-bg)" }}>
        {hubCards.map(card => <HubCard key={card.href} {...card} />)}
      </main>
    </div>
  );
}

// ─── Screen root ──────────────────────────────────────────

export default function FinansijeHubScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopHub className="hidden lg:flex h-full" />
            <TabletHub className="hidden sm:flex lg:hidden h-full" />
            <MobileHub className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopHub className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletHub className="flex h-full" />
        ) : (
          <MobileHub className="flex h-full" />
        )}
      </div>
    </div>
  );
}
