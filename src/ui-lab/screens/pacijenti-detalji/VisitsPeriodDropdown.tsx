"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { VisitsPeriod } from "./mock";
import { VISITS_PERIOD_LABELS } from "./mock";

const PERIODS: VisitsPeriod[] = ["1", "6", "12", "all"];

export function VisitsPeriodDropdown({
  value,
  onChange,
  size = "sm",
}: {
  value: VisitsPeriod;
  onChange: (period: VisitsPeriod) => void;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMd = size === "md";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 font-medium transition-opacity hover:opacity-80 ${isMd ? "text-[12px]" : "text-[10px]"}`}
        style={{
          paddingLeft: isMd ? "14px" : "10px",
          paddingRight: isMd ? "12px" : "8px",
          paddingTop: isMd ? "8px" : "6px",
          paddingBottom: isMd ? "8px" : "6px",
          borderRadius: "var(--v2-radius-pill)",
          background: "var(--v2-primary-bg)",
          color: "var(--v2-text)",
        }}
      >
        {VISITS_PERIOD_LABELS[value]}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-20 py-1 rounded-lg shadow-lg min-w-[160px]"
          style={{
            background: "var(--v2-surface)",
            border: "1px solid var(--v2-border)",
          }}
        >
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[12px] transition-colors hover:bg-[var(--v2-primary-bg)]"
              style={{
                color: value === p ? "var(--v2-primary-dark)" : "var(--v2-text)",
                fontWeight: value === p ? 600 : 400,
              }}
            >
              {VISITS_PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
