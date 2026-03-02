"use client";

/**
 * CalendarScreen — responsive orchestrator
 *
 * Device mode is persisted in the URL query param:
 *   ?device=desktop | tablet | mobile   (omit for "auto")
 *
 * This makes the preview shareable / bookmarkable, and avoids
 * hydration mismatches caused by local state. Only this screen
 * uses query params for device mode — existing screens are untouched.
 */

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DeviceModeToggle, type DeviceMode } from "../DeviceModeToggle";
import DesktopCalendar from "./DesktopCalendar";
import TabletCalendar from "./TabletCalendar";
import MobileCalendar from "./MobileCalendar";

// ─── Inner component (reads useSearchParams, must be inside Suspense) ────────

function CalendarScreenInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawDevice = searchParams.get("device");
  const VALID_MODES: DeviceMode[] = ["auto", "desktop", "tablet", "mobile"];
  const mode: DeviceMode = VALID_MODES.includes(rawDevice as DeviceMode)
    ? (rawDevice as DeviceMode)
    : "auto";

  const setMode = (next: DeviceMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "auto") {
      params.delete("device");
    } else {
      params.set("device", next);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopCalendar className="hidden lg:flex h-full" />
            <TabletCalendar  className="hidden sm:flex lg:hidden h-full" />
            <MobileCalendar  className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopCalendar className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletCalendar className="flex h-full" />
        ) : (
          <MobileCalendar className="flex h-full" />
        )}
      </div>
    </div>
  );
}

// ─── Public export (Suspense boundary required for useSearchParams) ──────────

export default function CalendarScreen() {
  return (
    <Suspense>
      <CalendarScreenInner />
    </Suspense>
  );
}
