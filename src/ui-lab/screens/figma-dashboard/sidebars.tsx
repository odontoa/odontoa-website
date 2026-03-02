"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { sidebarNav, type NavItem } from "./shared";

// ─── Desktop accordion group (items with children) ────────

function DesktopAccordionGroup({ item, pathname }: { item: NavItem & { children: NavItem[] }; pathname: string }) {
  const isUnder = item.href ? pathname.startsWith(item.href) : false;
  const lsKey = `v2SidebarOpen_${item.label}`;

  const [open, setOpen] = useState(isUnder);

  // On mount, prefer localStorage value
  useEffect(() => {
    try {
      const stored = localStorage.getItem(lsKey);
      if (stored !== null) {
        setOpen(stored === "true");
        return;
      }
    } catch { /* noop */ }
    setOpen(isUnder);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-expand when navigating into the section and persist so other accordions
  // don't collapse it on the next remount (sidebar re-mounts on every navigation).
  useEffect(() => {
    if (isUnder) {
      setOpen(true);
      try { localStorage.setItem(lsKey, "true"); } catch { /* noop */ }
    }
  }, [isUnder, lsKey]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !open;
    setOpen(next);
    try { localStorage.setItem(lsKey, String(next)); } catch { /* noop */ }
  };

  const isChildActive = item.children.some(c => c.href && pathname.startsWith(c.href));
  // Parent is active only when we're under its section but no child is the active page.
  // Never highlight the parent when a child is already highlighted — tablet sidebar already does this correctly.
  const parentActive = isUnder && !isChildActive;

  return (
    <>
      {/* Parent row */}
      <div
        className="w-full flex items-center justify-between pl-[12px] pr-[8px] py-[8px] min-[1440px]:py-[12px] transition-colors"
        style={{
          borderRadius: "var(--v2-radius-nav)",
          background: parentActive ? "var(--v2-primary)" : "transparent",
          color: parentActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
        }}
      >
        <Link href={item.href!} className="flex items-center gap-[8px] flex-1 min-w-0">
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="text-[14px] font-medium leading-none">{item.label}</span>
        </Link>
        <button
          onClick={toggle}
          className="flex-shrink-0 p-[4px] -mr-[2px] transition-opacity hover:opacity-70"
          aria-label={open ? "Skupi" : "Proširi"}
        >
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>

      {/* Children */}
      {open && (
        <div className="flex flex-col gap-[2px] pl-[16px]">
          {item.children.map((child) => {
            const ChildIcon = child.icon;
            const childActive = child.href ? pathname.startsWith(child.href) : false;
            return (
              <Link
                key={child.label}
                href={child.href!}
                className="w-full flex items-center gap-[8px] pl-[12px] pr-[8px] py-[7px] min-[1440px]:py-[9px] text-[13px] font-medium leading-none transition-colors"
                style={{
                  borderRadius: "var(--v2-radius-nav)",
                  background: childActive ? "var(--v2-primary)" : "transparent",
                  color: childActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
                }}
              >
                <ChildIcon className="h-4 w-4 flex-shrink-0" />
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Desktop sidebar (full labels, ~224px) ────────────────

export function FigmaDesktopSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full w-[224px] min-[1440px]:w-[243px] px-[16px] min-[1440px]:px-[24px] py-[16px] gap-[12px] min-[1440px]:gap-[16px]"
      style={{ background: "var(--v2-surface)" }}
    >
      <div className="px-[8px] py-[4px] flex items-center">
        <Image
          src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
          alt="Odontoa"
          width={120}
          height={28}
          className="h-[28px] w-auto object-contain"
        />
      </div>

      <nav className="flex-1 flex flex-col gap-[8px] overflow-y-auto">
        {sidebarNav.map((item) => {
          if (item.children) {
            return (
              <DesktopAccordionGroup
                key={item.label}
                item={item as NavItem & { children: NavItem[] }}
                pathname={pathname}
              />
            );
          }

          const Icon = item.icon;
          const isActive = item.href
            ? item.exact ? pathname === item.href : pathname.startsWith(item.href)
            : false;
          const itemStyle = {
            borderRadius: "var(--v2-radius-nav)",
            background: isActive ? "var(--v2-primary)" : "transparent",
            color: isActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
          };
          const inner = (
            <>
              <span className="flex items-center gap-[8px]">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-[14px] font-medium leading-none">{item.label}</span>
              </span>
              {item.badge && (
                <span
                  className="flex items-center justify-center text-[10px] leading-[1.35]"
                  style={{
                    minWidth: "18px",
                    padding: "2px",
                    borderRadius: "9px",
                    background: "var(--v2-primary)",
                    color: "var(--v2-primary-fg)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="w-full flex items-center justify-between pl-[12px] pr-[8px] py-[8px] min-[1440px]:py-[12px] transition-colors"
                style={itemStyle}
              >
                {inner}
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              className="w-full flex items-center justify-between pl-[12px] pr-[8px] py-[8px] min-[1440px]:py-[12px] transition-colors"
              style={itemStyle}
            >
              {inner}
            </button>
          );
        })}
      </nav>

      <div
        className="flex flex-col gap-[16px] p-[16px]"
        style={{ background: "var(--v2-primary-bg)", borderRadius: "24px" }}
      >
        <Image
          src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
          alt="Odontoa"
          width={48}
          height={24}
          className="h-6 w-auto object-contain"
        />
        <p className="text-[14px] font-medium leading-[1.25]" style={{ color: "var(--v2-text)" }}>
          Pojednostavite upravljanje pacijentima, pratite termine i pristupite ključnim uvidima na jednom mestu.
        </p>
        <button
          className="text-[14px] font-medium transition-opacity hover:opacity-90"
          style={{
            padding: "10px 16px",
            borderRadius: "var(--v2-radius-pill)",
            background: "var(--v2-primary)",
            color: "var(--v2-primary-fg)",
          }}
        >
          Nadogradnja 4.0
        </button>
      </div>

      <button
        className="flex items-center gap-[8px] pl-[12px] pr-[8px] py-[8px] min-[1440px]:py-[12px] text-[14px] font-medium leading-none transition-colors hover:opacity-80"
        style={{
          borderRadius: "var(--v2-radius-nav)",
          background: "var(--v2-input-bg)",
          color: "var(--v2-text-muted)",
        }}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        Odjavi se
      </button>
    </aside>
  );
}

// ─── Tablet accordion group (icon-only) ──────────────────

function TabletAccordionGroup({ item, pathname }: { item: NavItem & { children: NavItem[] }; pathname: string }) {
  const isUnder = item.href ? pathname.startsWith(item.href) : false;
  const lsKey = `v2SidebarTabletOpen_${item.label}`;

  const [open, setOpen] = useState(isUnder);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(lsKey);
      if (stored !== null) { setOpen(stored === "true"); return; }
    } catch { /* noop */ }
    setOpen(isUnder);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUnder) {
      setOpen(true);
      try { localStorage.setItem(lsKey, "true"); } catch { /* noop */ }
    }
  }, [isUnder, lsKey]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try { localStorage.setItem(lsKey, String(next)); } catch { /* noop */ }
  };

  const isChildActive = item.children.some(c => c.href && pathname.startsWith(c.href));
  const parentActive = isUnder && !isChildActive;

  return (
    <>
      {/* Parent icon — link to hub */}
      <Link
        href={item.href!}
        className="flex items-center justify-center p-[10px] transition-colors"
        style={{
          borderRadius: "var(--v2-radius-nav)",
          background: parentActive ? "var(--v2-primary)" : "transparent",
          color: parentActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
        }}
        title={item.label}
      >
        <item.icon className="h-5 w-5" />
      </Link>

      {/* Chevron toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center transition-opacity hover:opacity-70"
        style={{ height: "16px", color: "var(--v2-text-muted)" }}
        title={open ? "Skupi" : "Proširi"}
      >
        <ChevronDown
          className="h-3 w-3 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Children icons */}
      {open && item.children.map((child) => {
        const ChildIcon = child.icon;
        const childActive = child.href ? pathname.startsWith(child.href) : false;
        return (
          <Link
            key={child.label}
            href={child.href!}
            className="flex items-center justify-center p-[8px] transition-colors"
            style={{
              borderRadius: "var(--v2-radius-nav)",
              background: childActive ? "var(--v2-primary)" : "transparent",
              color: childActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
            }}
            title={child.label}
          >
            <ChildIcon className="h-4 w-4" />
          </Link>
        );
      })}
    </>
  );
}

// ─── Tablet sidebar (icon-only rail) ─────────────────────

export function FigmaTabletSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="flex-shrink-0 flex flex-col items-center h-full px-[20px] py-[16px] gap-[8px]"
      style={{ background: "var(--v2-surface)" }}
    >
      <div className="flex items-center justify-center p-[2px] mb-[8px]">
        <Image
          src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
          alt="Odontoa"
          width={36}
          height={36}
          className="h-[36px] w-[36px] object-contain"
        />
      </div>

      <nav className="flex-1 flex flex-col gap-[4px] items-center overflow-y-auto w-full">
        {sidebarNav.map((item) => {
          if (item.children) {
            return (
              <TabletAccordionGroup
                key={item.label}
                item={item as NavItem & { children: NavItem[] }}
                pathname={pathname}
              />
            );
          }

          const Icon = item.icon;
          const isActive = item.href
            ? item.exact ? pathname === item.href : pathname.startsWith(item.href)
            : false;
          const itemStyle = {
            borderRadius: "var(--v2-radius-nav)",
            background: isActive ? "var(--v2-primary)" : "transparent",
            color: isActive ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
          };
          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-center p-[10px] transition-colors"
                style={itemStyle}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              className="flex items-center justify-center p-[10px] transition-colors"
              style={itemStyle}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </nav>

      <button
        className="flex items-center justify-center p-[10px] transition-opacity hover:opacity-80"
        style={{
          borderRadius: "var(--v2-radius-nav)",
          background: "var(--v2-input-bg)",
          color: "var(--v2-text-muted)",
        }}
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  );
}
