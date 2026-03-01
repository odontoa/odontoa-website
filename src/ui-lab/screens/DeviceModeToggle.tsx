"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";

export type DeviceMode = "auto" | "desktop" | "tablet" | "mobile";

const modes: { value: DeviceMode; label: string; Icon: typeof Monitor }[] = [
  { value: "auto",    label: "Auto",    Icon: Monitor },
  { value: "desktop", label: "Desktop", Icon: Monitor },
  { value: "tablet",  label: "Tablet",  Icon: Tablet },
  { value: "mobile",  label: "Mobile",  Icon: Smartphone },
];

interface DeviceModeToggleProps {
  mode: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}

export function DeviceModeToggle({ mode, onChange }: DeviceModeToggleProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center gap-[6px] px-[16px] py-[6px]"
      style={{
        background: "var(--v2-surface)",
        borderBottom: "1px solid var(--v2-border)",
      }}
    >
      {modes.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className="flex items-center gap-[4px] font-medium transition-colors"
          style={{
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "var(--v2-radius-pill)",
            background: mode === value ? "var(--v2-primary)" : "var(--v2-primary-bg)",
            color: mode === value ? "var(--v2-primary-fg)" : "var(--v2-text)",
          }}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
