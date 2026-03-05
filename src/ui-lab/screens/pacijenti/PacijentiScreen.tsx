// Pacijenti — responsive orchestrator
// Breakpoints: Mobile < 640, Tablet 640–1023, Desktop >= 1024
"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "../DeviceModeToggle";
import DesktopPatients from "./DesktopPatients";
import TabletPatients from "./TabletPatients";
import MobilePatients from "./MobilePatients";

export default function PacijentiScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopPatients className="hidden lg:flex h-full" />
            <TabletPatients className="hidden sm:flex lg:hidden h-full" />
            <MobilePatients className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopPatients className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletPatients className="flex h-full" />
        ) : (
          <MobilePatients className="flex h-full" />
        )}
      </div>
    </div>
  );
}
