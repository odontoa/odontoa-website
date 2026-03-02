"use client";

import { Search, Bell, Settings } from "lucide-react";
import React from "react";

export interface V2StatItem {
  label: string;
  value: string | number;
  color?: string;
}

export interface V2SearchConfig {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}

interface V2PageHeaderProps {
  /** Breadcrumb / section label above the title (e.g. "Ordinacija") */
  section?: string;
  title: string;
  subtitle?: string;
  /** Extra slot between title block and right-side actions (e.g. search bar) */
  centerSearch?: V2SearchConfig;
  /** Replaces the default Bell+Settings+Avatar cluster entirely */
  actions?: React.ReactNode;
  /** Appended before the Bell+Settings+Avatar cluster */
  extraActions?: React.ReactNode;
}

/** Default right-cluster: Settings + Bell + Avatar */
function DefaultCluster() {
  return (
    <>
      <button
        className="flex items-center justify-center transition-opacity hover:opacity-80"
        style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        aria-label="Podešavanja"
      >
        <Settings className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
      </button>
      <button
        className="relative flex items-center justify-center transition-opacity hover:opacity-80"
        style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        aria-label="Obaveštenja"
      >
        <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
      </button>
      <div
        className="flex items-center justify-center font-semibold text-[12px] flex-shrink-0"
        style={{
          height: "40px",
          width: "40px",
          borderRadius: "var(--v2-radius-avatar)",
          background: "var(--v2-primary)",
          color: "var(--v2-primary-fg)",
        }}
      >
        MM
      </div>
    </>
  );
}

/**
 * Uniform page header used across all V2 "Ordinacija" and "Finansije" screens.
 * Renders the section breadcrumb, title, optional subtitle, optional center search,
 * optional extra actions, and the default Settings+Bell+Avatar cluster.
 */
export function V2PageHeader({
  section,
  title,
  subtitle,
  centerSearch,
  actions,
  extraActions,
}: V2PageHeaderProps) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 pl-[4px]"
      style={{ height: "var(--v2-topbar-h)" }}
    >
      {/* Left: section + title */}
      <div
        className="flex flex-col justify-center flex-shrink-0 py-[2px]"
        style={{ width: "340px" }}
      >
        {section && (
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--v2-primary)" }}
          >
            {section}
          </p>
        )}
        <h1
          className="font-semibold leading-[1.2]"
          style={{ fontSize: "22px", color: "var(--v2-text)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Center: optional search */}
      {centerSearch && (
        <div className="relative flex-shrink-0">
          <Search
            className="absolute left-[13px] top-1/2 -translate-y-1/2 h-[18px] w-[18px]"
            style={{ color: "var(--v2-text-muted)" }}
          />
          <input
            type="text"
            placeholder={centerSearch.placeholder ?? "Pretraži…"}
            value={centerSearch.value}
            onChange={(e) => centerSearch.onChange(e.target.value)}
            className="pl-[37px] pr-[13px] py-[9px] text-[14px] focus:outline-none placeholder:text-[var(--v2-text-muted)]"
            style={{
              width: centerSearch.width ?? 280,
              background: "var(--v2-input-bg)",
              borderRadius: "var(--v2-radius-pill)",
              border: "none",
              color: "var(--v2-text)",
            }}
          />
        </div>
      )}

      {/* Right: extra actions + default cluster (or fully replaced actions) */}
      <div className="flex items-center gap-[12px] flex-shrink-0">
        {actions ?? (
          <>
            {extraActions}
            <DefaultCluster />
          </>
        )}
      </div>
    </header>
  );
}
