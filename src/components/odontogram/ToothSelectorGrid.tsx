"use client";

// FDI tooth numbering grid
// Permanent teeth:  Upper right 18-11 | Upper left 21-28
//                   Lower right 48-41 | Lower left 31-38
// Deciduous teeth:  Upper right 55-51 | Upper left 61-65
//                   Lower right 85-81 | Lower left 71-75

import React from "react";
import type { ToothType } from "@/lib/ui-lab/types";

type SelectorMode = "none" | "single" | "multi";

interface ToothSelectorGridProps {
  toothType: ToothType;
  mode: SelectorMode;
  selectedTeeth: number[];
  onToggle: (toothNumber: number) => void;
}

// ─── FDI numbering layouts ────────────────────────────────────────────────────

const PERMANENT_UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const PERMANENT_UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const PERMANENT_LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];
const PERMANENT_LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

const DECIDUOUS_UPPER_RIGHT = [55, 54, 53, 52, 51];
const DECIDUOUS_UPPER_LEFT  = [61, 62, 63, 64, 65];
const DECIDUOUS_LOWER_LEFT  = [71, 72, 73, 74, 75];
const DECIDUOUS_LOWER_RIGHT = [85, 84, 83, 82, 81];

// ─── Single tooth button ──────────────────────────────────────────────────────

function ToothButton({
  number,
  isSelected,
  isDisabled,
  onToggle,
}: {
  number: number;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (n: number) => void;
}) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onToggle(number)}
      className="flex flex-col items-center gap-0.5 transition-all"
      style={{ cursor: isDisabled ? "default" : "pointer" }}
      title={`Zub ${number}`}
    >
      {/* Tooth visual */}
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-semibold border-2 transition-all"
        style={{
          background: isSelected
            ? "var(--v2-primary)"
            : isDisabled
            ? "var(--v2-input-bg)"
            : "var(--v2-surface)",
          borderColor: isSelected
            ? "var(--v2-primary-dark)"
            : "var(--v2-border)",
          color: isSelected ? "var(--v2-primary-fg)" : isDisabled ? "var(--v2-text-muted)" : "var(--v2-text-heading)",
          opacity: isDisabled ? 0.4 : 1,
          transform: isSelected ? "scale(1.1)" : "scale(1)",
          boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {number}
      </div>
    </button>
  );
}

// ─── Jaw row ──────────────────────────────────────────────────────────────────

function JawRow({
  leftQuadrant,
  rightQuadrant,
  selectedTeeth,
  isDisabled,
  onToggle,
}: {
  leftQuadrant: number[];
  rightQuadrant: number[];
  selectedTeeth: number[];
  isDisabled: boolean;
  onToggle: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-0">
      {/* Right quadrant (displayed on left side visually — patient's right) */}
      <div className="flex items-center gap-1">
        {rightQuadrant.map((n) => (
          <ToothButton
            key={n}
            number={n}
            isSelected={selectedTeeth.includes(n)}
            isDisabled={isDisabled}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Center divider */}
      <div className="mx-2 w-px h-8" style={{ background: "var(--v2-border)" }} />

      {/* Left quadrant */}
      <div className="flex items-center gap-1">
        {leftQuadrant.map((n) => (
          <ToothButton
            key={n}
            number={n}
            isSelected={selectedTeeth.includes(n)}
            isDisabled={isDisabled}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ToothSelectorGrid({
  toothType,
  mode,
  selectedTeeth,
  onToggle,
}: ToothSelectorGridProps) {
  const isDisabled = mode === "none";

  const handleToggle = (n: number) => {
    if (isDisabled) return;
    if (mode === "single") {
      // If already selected, deselect; otherwise select only this tooth
      onToggle(n);
    } else {
      onToggle(n);
    }
  };

  const isPermanent = toothType === "STALNI";

  const upperRight = isPermanent ? PERMANENT_UPPER_RIGHT : DECIDUOUS_UPPER_RIGHT;
  const upperLeft  = isPermanent ? PERMANENT_UPPER_LEFT  : DECIDUOUS_UPPER_LEFT;
  const lowerLeft  = isPermanent ? PERMANENT_LOWER_LEFT  : DECIDUOUS_LOWER_LEFT;
  const lowerRight = isPermanent ? PERMANENT_LOWER_RIGHT : DECIDUOUS_LOWER_RIGHT;

  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{
        borderColor: "var(--v2-border)",
        background: isDisabled ? "var(--v2-input-bg)" : "var(--v2-surface)",
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      {/* Legend */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
          Gornja vilica
        </span>
        {selectedTeeth.length > 0 && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
          >
            Izabrano: {selectedTeeth.join(", ")}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-wider font-semibold invisible">plh</span>
      </div>

      {/* Upper jaw */}
      <JawRow
        rightQuadrant={upperRight}
        leftQuadrant={upperLeft}
        selectedTeeth={selectedTeeth}
        isDisabled={isDisabled}
        onToggle={handleToggle}
      />

      {/* Separator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--v2-border)" }} />
        <span className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>
          {isPermanent ? "Stalni zubi (FDI)" : "Mlečni zubi (FDI)"}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--v2-border)" }} />
      </div>

      {/* Lower jaw */}
      <JawRow
        rightQuadrant={lowerRight}
        leftQuadrant={lowerLeft}
        selectedTeeth={selectedTeeth}
        isDisabled={isDisabled}
        onToggle={handleToggle}
      />

      <span className="text-[10px] uppercase tracking-wider font-semibold text-center" style={{ color: "var(--v2-text-muted)" }}>
        Donja vilica
      </span>

      {isDisabled && (
        <p className="text-[12px] text-center" style={{ color: "var(--v2-text-muted)" }}>
          Odabir zuba nije potreban za opciju &ldquo;Svi zubi&rdquo;
        </p>
      )}
    </div>
  );
}

export default ToothSelectorGrid;
