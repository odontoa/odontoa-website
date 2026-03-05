// Patient create/edit drawer — right-side panel (~520px).
// Reuses existing V2 drawer + form patterns.
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  createNewPatient,
  upsertPatient,
  type Patient,
} from "@/ui-lab/lib/patientsStorage";

// ─── Constants ───────────────────────────────────────────

const DOCTORS = [
  "Dr Marko Marković",
  "Dr Ana Petrović",
  "Dr Stefan Jovanović",
  "Dr Jelena Nikolić",
  "Dr Nikola Ilić",
  "Dr Milica Đorđević",
];

const LOCATIONS = [
  "Beograd",
  "Novi Sad",
  "Niš",
  "Subotica",
  "Kragujevac",
  "Čačak",
  "Pančevo",
  "Smederevo",
  "Valjevo",
  "Zrenjanin",
  "Kruševac",
  "Šabac",
];

// ─── Styles ──────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "var(--v2-input-bg)",
  border: "1px solid var(--v2-border)",
  borderRadius: "10px",
  color: "var(--v2-text)",
  fontSize: "14px",
  padding: "9px 13px",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--v2-text-muted)",
  marginBottom: "6px",
  display: "block",
};

// ─── Component ───────────────────────────────────────────

interface PatientDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Pass existing patient for edit mode, or undefined for create mode. */
  patient?: Patient;
}

export function PatientDrawer({
  open,
  onClose,
  onSaved,
  patient,
}: PatientDrawerProps) {
  const isEdit = !!patient;
  const [draft] = useState(() => patient ?? createNewPatient());

  const [fullName, setFullName] = useState(draft.fullName);
  const [phone, setPhone] = useState(draft.phone);
  const [email, setEmail] = useState(draft.email);
  const [dateOfBirth, setDateOfBirth] = useState(draft.dateOfBirth);
  const [doctorName, setDoctorName] = useState(draft.doctorName);
  const [location, setLocation] = useState(draft.location);
  const [err, setErr] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (!fullName.trim()) {
      setErr("Ime i prezime su obavezni.");
      return;
    }

    const saved: Patient = {
      ...draft,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      dateOfBirth,
      doctorName,
      location,
    };

    upsertPatient(saved);
    onSaved();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full flex flex-col"
        style={{
          width: "520px",
          maxWidth: "100vw",
          background: "var(--v2-surface)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-[24px] py-[16px] flex-shrink-0"
          style={{ borderBottom: "1px solid var(--v2-border)" }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--v2-text-heading)",
            }}
          >
            {isEdit ? "Izmeni pacijenta" : "Novi pacijent"}
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "var(--v2-bg)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X style={{ width: "16px", height: "16px", color: "var(--v2-text-muted)" }} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[16px]">
          {/* Full name */}
          <div>
            <label style={labelStyle}>Ime i prezime *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setErr(""); }}
              placeholder="npr. Ana Petrović"
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+381 6x xxx xxx"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.rs"
              style={inputStyle}
            />
          </div>

          {/* Date of birth */}
          <div>
            <label style={labelStyle}>Datum rođenja</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Doctor */}
          <div>
            <label style={labelStyle}>Doktor</label>
            <select
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              style={inputStyle}
            >
              <option value="">— Izaberi doktora —</option>
              {DOCTORS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Lokacija</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle}
            >
              <option value="">— Izaberi lokaciju —</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Patient code (read-only) */}
          <div>
            <label style={labelStyle}>Šifra pacijenta</label>
            <input
              type="text"
              value={draft.patientCode}
              readOnly
              style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>

          {/* Error */}
          {err && (
            <p style={{ fontSize: "13px", color: "var(--v2-status-cancelled-fg)", margin: 0 }}>
              {err}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] flex-shrink-0"
          style={{ borderTop: "1px solid var(--v2-border)" }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--v2-text)",
              background: "var(--v2-bg)",
              border: "1px solid var(--v2-border)",
              borderRadius: "var(--v2-radius-badge)",
              cursor: "pointer",
            }}
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--v2-primary-fg)",
              background: "var(--v2-primary)",
              border: "none",
              borderRadius: "var(--v2-radius-badge)",
              cursor: "pointer",
            }}
          >
            {isEdit ? "Sačuvaj" : "Kreiraj"}
          </button>
        </div>
      </div>
    </>
  );
}
