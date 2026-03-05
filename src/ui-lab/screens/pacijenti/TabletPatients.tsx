// Figma: Moodify All Patients — Tablet layout (overflow-x-auto + min-w)
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Users, UserPlus, TrendingUp } from "lucide-react";
import { FigmaTabletSidebar } from "@/ui-lab/screens/figma-dashboard/sidebars";
import { DropdownPill } from "@/ui-lab/screens/figma-dashboard/shared";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import { mockPatients, type MockPatient } from "./patients-mock";
import { PatientTableRow } from "./PatientTableRow";

const KPI_CARDS = [
  { label: "Svi pacijenti", value: "2.350", badge: "+1.25%", icon: Users },
  { label: "Novi pacijenti", value: "450", badge: "+4.92%", icon: UserPlus },
] as const;

const PAGE_SIZE = 10;
const COLUMNS = [
  "Ime pacijenta",
  "ID",
  "Kontakt",
  "Email",
  "Datum kreiranja",
  "Doktor",
  "Lokacija",
  "Akcije",
] as const;

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

// ─── Main Screen ──────────────────────────────────────────

export default function TabletPatients({ className }: { className?: string }) {
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
      className={`flex h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaTabletSidebar />

      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <V2PageHeader
          title="Pacijenti"
          extraActions={
            <button
              onClick={handleNewPatient}
              className="flex items-center gap-[6px] text-[12px] font-medium transition-opacity hover:opacity-90"
              style={{
                padding: "8px 14px",
                borderRadius: "var(--v2-radius-pill)",
                background: "var(--v2-primary)",
                color: "var(--v2-primary-fg)",
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Novi pacijent
            </button>
          }
        />

        <main
          className="flex-1 min-h-0 overflow-hidden p-[20px] flex flex-col gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >
          {/* KPI cards — same size as Predračun */}
          <div className="grid grid-cols-2 gap-[20px] w-full">
            {KPI_CARDS.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="flex items-center gap-[12px] px-[14px] py-[16px]"
                  style={{
                    background: "var(--v2-surface)",
                    borderRadius: "var(--v2-radius-card)",
                  }}
                >
                  <div
                    className="flex items-center justify-center p-[10px] flex-shrink-0"
                    style={{
                      borderRadius: "var(--v2-radius-icon)",
                      background: "var(--v2-primary)",
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--v2-text-muted)" }}
                    >
                      {kpi.label}
                    </span>
                    <span
                      className="font-bold"
                      style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}
                    >
                      {kpi.value}
                    </span>
                  </div>
                  <span
                    className="flex items-center gap-[4px] px-[4px] py-[2px] text-[10px] font-medium rounded-[4px] ml-auto flex-shrink-0"
                    style={{
                      background: "var(--v2-primary)",
                      color: "var(--v2-primary-fg)",
                    }}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {kpi.badge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Table card — flex-1, sticky header */}
          <div
            className="flex flex-col overflow-hidden flex-1 min-h-0"
            style={{
              background: "var(--v2-surface)",
              borderRadius: "var(--v2-radius-card)",
            }}
          >
            <div className="flex items-center justify-between w-full px-[20px] py-[16px] gap-[10px] flex-wrap">
              <div className="relative flex-shrink-0">
                <Search
                  className="absolute left-[12px] top-1/2 -translate-y-1/2"
                  style={{ color: "var(--v2-text-muted)", width: "16px", height: "16px" }}
                />
                <input
                  type="text"
                  placeholder="Pretraži pacijente, doktora..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-[12px] py-[8px] text-[12px] focus:outline-none placeholder:text-[var(--v2-text-muted)]"
                  style={{
                    width: "224px",
                    paddingLeft: "36px",
                    background: "var(--v2-input-bg)",
                    borderRadius: "18px",
                    border: "none",
                    outline: "none",
                    color: "var(--v2-text)",
                    lineHeight: "1.3",
                  }}
                />
              </div>
              <div className="flex items-center gap-[10px] flex-shrink-0">
                <DropdownPill size="sm">Ove nedelje</DropdownPill>
                <div className="flex items-center gap-[4px]">
                  <span
                    className="text-[11px] leading-[1.24]"
                    style={{ color: "var(--moodify-on-surface)" }}
                  >
                    Sortiraj po:
                  </span>
                  <DropdownPill size="sm">Doktor</DropdownPill>
                </div>
              </div>
            </div>

            <div className="overflow-auto flex-1 min-h-0">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr
                    className="sticky top-0 z-10"
                    style={{ background: "var(--v2-input-bg)", borderRadius: "6px" }}
                  >
                    {COLUMNS.map((h) => (
                      <th
                        key={h}
                        className="py-[14px] px-[16px] text-left font-medium whitespace-nowrap first:rounded-tl-[6px] last:rounded-tr-[6px]"
                        style={{
                          fontSize: "12px",
                          color: "var(--v2-text-muted)",
                          background: "var(--v2-input-bg)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <PatientTableRow
                      key={p.id}
                      patient={p}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="flex items-center justify-between px-[12px] py-[10px]"
              style={{
                borderTop: "1px solid var(--v2-border)",
                background: "var(--v2-surface)",
              }}
            >
              <span
                className="text-[11px]"
                style={{ color: "var(--v2-text-muted)" }}
              >
                {filtered.length} pacijenata
              </span>
              <div className="flex items-center gap-[6px]">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-[6px] rounded-[15px] transition-opacity disabled:opacity-50"
                  style={{ background: "var(--v2-input-bg)" }}
                >
                  <span className="text-[14px]">‹</span>
                </button>
                <span
                  className="px-[8px] py-[4px] text-[10px] font-medium"
                  style={{ color: "var(--v2-text)" }}
                >
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center justify-center p-[6px] rounded-[15px] transition-opacity disabled:opacity-50"
                  style={{ background: "var(--v2-input-bg)" }}
                >
                  <span className="text-[14px]">›</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
