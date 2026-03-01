"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "../../DeviceModeToggle";
import DesktopUplate from "./DesktopUplate";
import TabletUplate from "./TabletUplate";
import MobileUplate from "./MobileUplate";

export default function UplateScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopUplate className="hidden lg:flex h-full" />
            <TabletUplate className="hidden sm:flex lg:hidden h-full" />
            <MobileUplate className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopUplate className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletUplate className="flex h-full" />
        ) : (
          <MobileUplate className="flex h-full" />
        )}
      </div>
    </div>
  );
}
