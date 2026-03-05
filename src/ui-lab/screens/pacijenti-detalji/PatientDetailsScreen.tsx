// Pacijenti Detalji — responsive orchestrator
// Breakpoints: Mobile < 640, Tablet 640–1023, Desktop >= 1024
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeviceModeToggle, type DeviceMode } from "../DeviceModeToggle";
import DesktopPatientDetails from "./DesktopPatientDetails";
import TabletPatientDetails from "./TabletPatientDetails";
import MobilePatientDetails from "./MobilePatientDetails";
import { getPatientById } from "./mock";
import { deletePatient, getPatientById as getStoragePatientById, type Patient } from "@/ui-lab/lib/patientsStorage";
import { PatientDrawer } from "@/ui-lab/screens/pacijenti/PatientDrawer";
import { ConfirmDialog } from "@/ui-lab/components/ui/ConfirmDialog";

interface Props {
  id: string;
}

export default function PatientDetailsScreen({ id }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<DeviceMode>("auto");
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Re-derived on each render (refreshKey bump forces re-read from storage)
  const patient = getPatientById(id);
  const storagePatient: Patient | undefined = getStoragePatientById(id);

  if (!patient) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen gap-[16px]"
        style={{ background: "var(--v2-bg)", color: "var(--v2-text)" }}
      >
        <p style={{ fontSize: "18px", fontWeight: 600 }}>Pacijent nije pronađen.</p>
        <Link
          href="/ui-lab/pacijenti"
          style={{ fontSize: "14px", color: "var(--v2-primary)", textDecoration: "underline" }}
        >
          Nazad na listu pacijenata
        </Link>
      </div>
    );
  }

  const handleEdit = () => setDrawerOpen(true);
  const handleDelete = () => setDeleteOpen(true);
  const confirmDelete = () => {
    deletePatient(id);
    setDeleteOpen(false);
    router.push("/ui-lab/pacijenti");
  };
  const handleSaved = () => setRefreshKey((k) => k + 1);

  return (
    <div className="flex flex-col h-screen overflow-hidden" key={refreshKey}>
      <DeviceModeToggle mode={mode} onChange={setMode} />

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "auto" ? (
          <>
            <DesktopPatientDetails patient={patient} onEdit={handleEdit} onDelete={handleDelete} className="hidden lg:flex h-full" />
            <TabletPatientDetails patient={patient} onEdit={handleEdit} onDelete={handleDelete} className="hidden sm:flex lg:hidden h-full" />
            <MobilePatientDetails patient={patient} onEdit={handleEdit} onDelete={handleDelete} className="flex sm:hidden h-full" />
          </>
        ) : mode === "desktop" ? (
          <DesktopPatientDetails patient={patient} onEdit={handleEdit} onDelete={handleDelete} className="flex h-full" />
        ) : mode === "tablet" ? (
          <TabletPatientDetails patient={patient} onEdit={handleEdit} onDelete={handleDelete} className="flex h-full" />
        ) : (
          <MobilePatientDetails patient={patient} onEdit={handleEdit} onDelete={handleDelete} className="flex h-full" />
        )}
      </div>

      {storagePatient && (
        <PatientDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSaved={handleSaved}
          patient={storagePatient}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Brisanje pacijenta"
        message="Da li ste sigurni da želite da obrišete ovog pacijenta? Ova akcija se ne može poništiti."
        confirmLabel="Obriši"
        cancelLabel="Otkaži"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
