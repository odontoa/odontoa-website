"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "../../DeviceModeToggle";
import DesktopTehnikaFin from "./DesktopTehnikaFin";
import TabletTehnikaFin from "./TabletTehnikaFin";
import MobileTehnikaFin from "./MobileTehnikaFin";

export default function TehnikaFinScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopTehnikaFin className="hidden lg:flex h-full" />
            <TabletTehnikaFin className="hidden sm:flex lg:hidden h-full" />
            <MobileTehnikaFin className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopTehnikaFin className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletTehnikaFin className="flex h-full" />
        ) : (
          <MobileTehnikaFin className="flex h-full" />
        )}
      </div>
    </div>
  );
}
