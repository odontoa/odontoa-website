// Figma Dashboard — responsive orchestrator
// Desktop: node-id=16:1146 | Tablet: node-id=288:7994 | Mobile: node-id=291:9656
"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "./DeviceModeToggle";
import DesktopDashboard from "./figma-dashboard/DesktopDashboard";
import TabletDashboard from "./figma-dashboard/TabletDashboard";
import MobileDashboard from "./figma-dashboard/MobileDashboard";

export default function FigmaDashboardScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopDashboard className="hidden lg:flex h-full" />
            <TabletDashboard className="hidden sm:flex lg:hidden h-full" />
            <MobileDashboard className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopDashboard className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletDashboard className="flex h-full" />
        ) : (
          <MobileDashboard className="flex h-full" />
        )}
      </div>
    </div>
  );
}
