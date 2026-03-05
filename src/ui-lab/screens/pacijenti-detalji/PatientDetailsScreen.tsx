// Pacijenti Detalji — responsive orchestrator
// Breakpoints: Mobile < 640, Tablet 640–1023, Desktop >= 1024
"use client";

import { useState } from "react";
import Link from "next/link";
import { DeviceModeToggle, type DeviceMode } from "../DeviceModeToggle";
import DesktopPatientDetails from "./DesktopPatientDetails";
import TabletPatientDetails from "./TabletPatientDetails";
import MobilePatientDetails from "./MobilePatientDetails";
import { getPatientById } from "./mock";

interface Props {
  id: string;
}

export default function PatientDetailsScreen({ id }: Props) {
  const [mode, setMode] = useState<DeviceMode>("auto");
  const patient = getPatientById(id);

  if (!patient) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen gap-[16px]"
        style={{ background: "var(--v2-bg)", color: "var(--v2-text)" }}
      >
        <p style={{ fontSize: "18px", fontWeight: 600 }}>Pacijent nije pronađen.</p>
        <Link
          href="/ui-lab/pacijenti"
          style={{
            fontSize: "14px",
            color: "var(--v2-primary)",
            textDecoration: "underline",
          }}
        >
          Nazad na listu pacijenata
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DeviceModeToggle mode={mode} onChange={setMode} />

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopPatientDetails patient={patient} className="hidden lg:flex h-full" />
            <TabletPatientDetails patient={patient} className="hidden sm:flex lg:hidden h-full" />
            <MobilePatientDetails patient={patient} className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopPatientDetails patient={patient} className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletPatientDetails patient={patient} className="flex h-full" />
        ) : (
          <MobilePatientDetails patient={patient} className="flex h-full" />
        )}
      </div>
    </div>
  );
}
