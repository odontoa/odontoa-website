// Figma: Moodify All Patients — Mobile layout (stacked cards)
"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Trash, Pencil, Phone, Mail, MapPin, User, Calendar } from "lucide-react";
import {
  mockPatients,
  getInitials,
  type MockPatient,
} from "./patients-mock";

const PAGE_SIZE = 8;

function filterPatients(patients: MockPatient[], q: string): MockPatient[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return patients;
  return patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(lower) ||
      p.email.toLowerCase().includes(lower) ||
      p.phone.includes(lower) ||
      p.doctorName.toLowerCase().includes(lower) ||
      p.location.toLowerCase().includes(lower)
  );
}

function handleView(id: number) {
  console.log("view", id);
}
function handleDelete(id: number) {
  console.log("delete", id);
}
function handleEdit(id: number) {
  console.log("edit", id);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Mobile Navbar ─────────────────────────────────────────

function MobilePatientsNavbar({
  search,
  onSearchChange,
  onNewPatient,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onNewPatient: () => void;
}) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px] gap-[12px]"
      style={{ background: "var(--v2-surface)" }}
    >
      <div className="flex items-center gap-[8px] flex-1 min-w-0">
        <Image
          src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
          alt="Odontoa"
          width={32}
          height={32}
          className="h-[32px] w-[32px] object-contain flex-shrink-0"
        />
        <h1
          className="font-semibold leading-[1.2] truncate"
          style={{ fontSize: "18px", color: "var(--v2-text)" }}
        >
          Pacijenti
        </h1>
      </div>
      <div className="flex items-center gap-[8px] flex-shrink-0">
        <div className="relative flex-shrink-0">
          <Search
            className="absolute left-[10px] top-1/2 -translate-y-1/2 h-[16px] w-[16px]"
            style={{ color: "var(--v2-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Pretraži"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[32px] pr-[10px] py-[8px] text-[12px] focus:outline-none placeholder:text-[var(--v2-text-muted)] w-[120px]"
            style={{
              background: "var(--v2-input-bg)",
              borderRadius: "var(--v2-radius-pill)",
              border: "none",
              color: "var(--v2-text)",
            }}
          />
        </div>
        <button
          onClick={onNewPatient}
          className="flex items-center justify-center p-[8px] transition-opacity hover:opacity-90"
          style={{
            borderRadius: "var(--v2-radius-pill)",
            background: "var(--v2-primary)",
            color: "var(--v2-primary-fg)",
          }}
          title="Novi pacijent"
        >
          <Plus className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}

// ─── Patient Card ─────────────────────────────────────────

function PatientCard({ p }: { p: MockPatient }) {
  return (
    <div
      className="flex flex-col gap-[12px] p-[16px]"
      style={{
        background: "var(--v2-surface)",
        borderRadius: "var(--v2-radius-card)",
        border: "1px solid var(--v2-border)",
      }}
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex items-center gap-[12px] min-w-0">
          <div
            className="flex items-center justify-center font-semibold flex-shrink-0 text-[12px] overflow-hidden"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "var(--v2-radius-avatar)",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            {getInitials(p)}
          </div>
          <div className="flex flex-col gap-[2px] min-w-0">
            <span
              className="font-semibold truncate"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              {p.fullName}
            </span>
            <button
              type="button"
              onClick={() => handleView(p.id)}
              className="font-mono text-[12px] leading-[1.3] transition-opacity hover:opacity-80 hover:underline text-left"
              style={{ color: "var(--v2-primary)" }}
            >
              ID: {p.id}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-[6px] flex-shrink-0">
          <button
            onClick={() => handleView(p.id)}
            className="flex items-center justify-center p-[8px] rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "var(--v2-primary)" }}
            title="Pogledaj"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(p.id)}
            className="flex items-center justify-center p-[8px] rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "var(--moodify-red)" }}
            title="Obriši"
          >
            <Trash className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(p.id)}
            className="flex items-center justify-center p-[8px] rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "var(--v2-primary)" }}
            title="Izmeni"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px] text-[13px]" style={{ color: "var(--v2-text)" }}>
          <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
          <span className="truncate">{p.phone}</span>
        </div>
        <div className="flex items-center gap-[8px] text-[13px]" style={{ color: "var(--v2-text)" }}>
          <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
          <span className="truncate">{p.email}</span>
        </div>
        <div className="flex items-center gap-[8px] text-[13px]" style={{ color: "var(--v2-text)" }}>
          <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
          <span>{formatDate(p.createdAt)}</span>
        </div>
        <div className="flex items-center gap-[8px] text-[13px]" style={{ color: "var(--v2-text)" }}>
          <User className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
          <span className="truncate">{p.doctorName}</span>
        </div>
        <div className="flex items-center gap-[8px] text-[13px]" style={{ color: "var(--v2-text)" }}>
          <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
          <span>{p.location}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────

export default function MobilePatients({ className }: { className?: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterPatients(mockPatients, search), [search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filtered, currentPage]
  );

  const handleNewPatient = () => {
    console.log("new patient");
  };

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-surface)" }}
    >
      <MobilePatientsNavbar
        search={search}
        onSearchChange={setSearch}
        onNewPatient={handleNewPatient}
      />

      <main
        className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[16px] rounded-t-[24px]"
        style={{ background: "var(--v2-bg)" }}
      >
        <div className="flex flex-col gap-[16px]">
          {paginated.map((p) => (
            <PatientCard key={p.id} p={p} />
          ))}
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between py-[12px]"
          style={{ borderTop: "1px solid var(--v2-border)" }}
        >
          <span
            className="text-[12px]"
            style={{ color: "var(--v2-text-muted)" }}
          >
            {filtered.length} pacijenata
          </span>
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center p-[8px] rounded-[15px] transition-opacity disabled:opacity-50"
              style={{ background: "var(--v2-input-bg)" }}
            >
              <span className="text-[16px]">‹</span>
            </button>
            <span
              className="px-[10px] py-[6px] text-[11px] font-medium"
              style={{ color: "var(--v2-text)" }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center justify-center p-[8px] rounded-[15px] transition-opacity disabled:opacity-50"
              style={{ background: "var(--v2-input-bg)" }}
            >
              <span className="text-[16px]">›</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
