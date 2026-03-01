"use client";

import { useState } from "react";
import { DeviceModeToggle, type DeviceMode } from "../../DeviceModeToggle";
import DesktopPredracun from "./DesktopPredracun";
import TabletPredracun from "./TabletPredracun";
import MobilePredracun from "./MobilePredracun";

export default function PredracunScreen() {
  const [mode, setMode] = useState<DeviceMode>("auto");
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopPredracun className="hidden lg:flex h-full" />
            <TabletPredracun className="hidden sm:flex lg:hidden h-full" />
            <MobilePredracun className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopPredracun className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletPredracun className="flex h-full" />
        ) : (
          <MobilePredracun className="flex h-full" />
        )}
      </div>
    </div>
  );
}
