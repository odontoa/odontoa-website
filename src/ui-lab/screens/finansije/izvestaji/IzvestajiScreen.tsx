"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "../../DeviceModeToggle";
import DesktopIzvestaji from "./DesktopIzvestaji";
import TabletIzvestaji from "./TabletIzvestaji";
import MobileIzvestaji from "./MobileIzvestaji";

export default function IzvestajiScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopIzvestaji className="hidden lg:flex h-full" />
            <TabletIzvestaji className="hidden sm:flex lg:hidden h-full" />
            <MobileIzvestaji className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopIzvestaji className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletIzvestaji className="flex h-full" />
        ) : (
          <MobileIzvestaji className="flex h-full" />
        )}
      </div>
    </div>
  );
}
