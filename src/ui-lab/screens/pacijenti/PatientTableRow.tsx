/**
 * PatientTableRow — standalone table row component
 * Figma: node 136-5568 (Moodify Patients table row)
 *
 * Structure: p-[16px], border-bottom, background #FCFCFD
 * Cells: Ime pacijenta, ID, Kontakt, Email, Datum kreiranja, Doktor, Lokacija, Akcije
 */
"use client";

import Link from "next/link";
import { Eye, Trash, Pencil } from "lucide-react";
import { getInitials as getInitialsMock, type MockPatient } from "./patients-mock";
import { type Patient, getInitials as getInitialsStorage } from "@/ui-lab/lib/patientsStorage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const cellStyle = {
  fontSize: "12px" as const,
  fontWeight: 400 as const,
  color: "var(--v2-text)",
  lineHeight: "1.3",
};

export interface PatientTableRowProps {
  patient: MockPatient | Patient;
  onView?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

export function PatientTableRow({
  patient,
  onView,
  onEdit,
  onDelete,
}: PatientTableRowProps) {
  const p = patient;

  return (
    <tr
      className="transition-colors hover:opacity-95"
      style={{
        borderBottom: "1px solid var(--v2-border)",
        background: "var(--v2-surface)",
      }}
    >
      {/* Ime pacijenta — Figma: flex gap-[8px], avatar 30×30 rounded-16px */}
      <td className="p-[16px] whitespace-nowrap">
        <div className="flex items-center gap-[8px]">
          <div
            className="flex items-center justify-center font-semibold flex-shrink-0 text-[12px] overflow-hidden"
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "16px",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            {"patientCode" in p ? getInitialsStorage(p.fullName) : getInitialsMock(p)}
          </div>
          <Link
            href={`/ui-lab/pacijenti/${p.id}`}
            className="transition-opacity hover:opacity-80 hover:underline"
            style={cellStyle}
          >
            {p.fullName}
          </Link>
        </div>
      </td>

      {/* ID — Figma: 12px, purple-light; now navigates to patient details */}
      <td className="p-[16px] whitespace-nowrap">
        <Link
          href={`/ui-lab/pacijenti/${p.id}`}
          className="text-[12px] leading-[1.3] font-normal transition-opacity hover:opacity-80 hover:underline"
          style={{ color: "var(--v2-primary)" }}
        >
          {p.id}
        </Link>
      </td>

      {/* Kontakt */}
      <td className="p-[16px] whitespace-nowrap" style={cellStyle}>
        {p.phone}
      </td>

      {/* Email */}
      <td className="p-[16px] whitespace-nowrap" style={cellStyle}>
        {p.email}
      </td>

      {/* Datum kreiranja */}
      <td className="p-[16px] whitespace-nowrap" style={cellStyle}>
        {formatDate(p.createdAt)}
      </td>

      {/* Doktor */}
      <td className="p-[16px] whitespace-nowrap" style={cellStyle}>
        {p.doctorName}
      </td>

      {/* Lokacija */}
      <td className="p-[16px] whitespace-nowrap" style={cellStyle}>
        {p.location}
      </td>

      {/* Akcije — Figma row ends with Status; we add View/Edit/Delete per Odontoa */}
      <td className="p-[16px]">
        <div className="flex items-center gap-[8px]">
          <Link
            href={`/ui-lab/pacijenti/${p.id}`}
            className="flex items-center justify-center p-[8px] rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "var(--v2-primary)", background: "transparent" }}
            title="Pogledaj"
            onClick={() => onView?.(p.id)}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete?.(p.id)}
            className="flex items-center justify-center p-[8px] rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "var(--moodify-red)", background: "transparent" }}
            title="Obriši"
          >
            <Trash className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit?.(p.id)}
            className="flex items-center justify-center p-[8px] rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "var(--v2-primary)", background: "transparent" }}
            title="Izmeni"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
