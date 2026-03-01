"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "../DeviceModeToggle";
import DesktopTechnika from "./DesktopTechnika";
import TabletTechnika from "./TabletTechnika";
import MobileTechnika from "./MobileTechnika";

export default function TechnikaScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopTechnika className="hidden lg:flex h-full" />
            <TabletTechnika className="hidden sm:flex lg:hidden h-full" />
            <MobileTechnika className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopTechnika className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletTechnika className="flex h-full" />
        ) : (
          <MobileTechnika className="flex h-full" />
        )}
      </div>
    </div>
  );
}
