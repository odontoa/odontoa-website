// Figma base: Invoices — node-id=63:12897 (finance report view)
"use client";

import { useState } from "react";
import { Settings, Bell, X, ChevronDown, Wrench } from "lucide-react";
import { FigmaDesktopSidebar } from "../../figma-dashboard/sidebars";
import {
  SEED_TEHNIKA_FIN, WorkStatusBadge, formatDate, formatRSD, getInitials,
  type TehFinRow,
} from "../shared";

// ─── Stat card ───────────────────────────────────────────

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-[12px] px-[14px] py-[16px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
      <div className="flex items-center justify-center p-[10px]" style={{ borderRadius: "var(--v2-radius-icon)", background: accent ? "var(--v2-primary-dark)" : "var(--v2-primary)" }}>
        <Wrench className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />
      </div>
      <div className="flex flex-col gap-[4px]">
        <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
        <span className="font-bold" style={{ fontSize: "18px", color: accent ? "var(--v2-status-cancelled-fg)" : "var(--v2-primary-dark)", lineHeight: "1.2" }}>{value}</span>
      </div>
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────

function TehStatusBadge({ status }: { status: TehFinRow["status"] }) {
  const isActive = status === "aktivan";
  return (
    <span className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]" style={{ borderRadius: "var(--v2-radius-badge)", background: isActive ? "var(--v2-status-confirmed-bg)" : "var(--v2-status-cancelled-bg)", color: isActive ? "var(--v2-status-confirmed-fg)" : "var(--v2-status-cancelled-fg)" }}>
      {isActive ? "Aktivan" : "Neaktivan"}
    </span>
  );
}

// ─── Detail panel ─────────────────────────────────────────

function DetailPanel({ row, onClose }: { row: TehFinRow; onClose: () => void }) {
  return (
    <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{ width: "360px", background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
      <div className="flex items-start justify-between gap-[12px] p-[16px] flex-shrink-0">
        <div className="flex items-center gap-[10px] min-w-0">
          <div className="flex items-center justify-center font-bold text-[14px] flex-shrink-0" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
            {getInitials(row.naziv)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-[1.2] truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{row.naziv}</p>
            <div className="mt-[4px]"><TehStatusBadge status={row.status} /></div>
          </div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)", marginTop: "2px" }}><X className="h-4 w-4" /></button>
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      <div className="p-[16px]">
        <div className="grid grid-cols-2 gap-[8px]">
          {[
            { label: "Broj radova", value: String(row.brojRadova) },
            { label: "Ukupan dug", value: formatRSD(row.dug) },
            { label: "Plaćeno", value: formatRSD(row.placeno) },
            { label: "Plaćeno do", value: formatDate(row.placenoDo) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-[2px] p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
              <span className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
              <span className="font-semibold text-[13px] break-words" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      <div className="p-[16px] flex flex-col gap-[8px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Poslednji radovi</p>
        {row.poslednjiRadovi.length === 0 ? (
          <p className="text-[12px] text-center py-[8px]" style={{ color: "var(--v2-text-muted)" }}>Nema radova.</p>
        ) : row.poslednjiRadovi.map(w => (
          <div key={w.id} className="flex flex-col gap-[4px] p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
            <div className="flex items-start justify-between gap-[6px]">
              <span className="text-[12px] font-medium flex-1 min-w-0" style={{ color: "var(--v2-text)" }}>{w.pacijent}</span>
              <WorkStatusBadge status={w.statusNaplate} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{w.vrstaRada}</span>
              <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(w.datum)}</span>
            </div>
            <span className="text-[11px] font-medium" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(w.iznos)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main desktop layout ──────────────────────────────────

export default function DesktopTehnikaFin({ className }: { className?: string }) {
  const rows = SEED_TEHNIKA_FIN;
  const [selected, setSelected] = useState<TehFinRow | null>(null);

  const totalRadova = rows.reduce((s, r) => s + r.brojRadova, 0);
  const ukupanDug = rows.reduce((s, r) => s + r.dug, 0);
  const ukupnoPlaceno = rows.reduce((s, r) => s + r.placeno, 0);
  const preostalo = ukupanDug;

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <header className="flex items-center justify-between flex-shrink-0 pl-[4px]" style={{ height: "var(--v2-topbar-h)" }}>
          <div>
            <h1 className="font-semibold" style={{ fontSize: "22px", color: "var(--v2-text)" }}>Izveštaj tehnike</h1>
            <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>Finansijski pregled saradnje sa tehničkim laboratorijama</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button className="flex items-center justify-center" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
              <Settings className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
            </button>
            <button className="relative flex items-center justify-center" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
              <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
              <span className="absolute h-[8px] w-[8px] rounded-full" style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }} />
            </button>
            <div className="flex items-center justify-center font-semibold text-[12px]" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-[20px] flex gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <div className="flex-1 flex flex-col gap-[20px] overflow-y-auto min-w-0">

            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-[16px]">
              <StatCard label="Ukupno radova" value={String(totalRadova)} />
              <StatCard label="Ukupan dug" value={formatRSD(ukupanDug)} accent />
              <StatCard label="Plaćeno" value={formatRSD(ukupnoPlaceno)} />
              <StatCard label="Preostalo" value={formatRSD(preostalo)} accent />
            </div>

            {/* Table */}
            <div className="flex flex-col" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
              <div className="p-[16px]">
                <h2 className="font-semibold text-[14px]" style={{ color: "var(--v2-text-heading)" }}>Tehničari</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--v2-input-bg)" }}>
                      {["Tehničar", "Broj radova", "Dug", "Plaćeno do", "Status", ""].map((h, i) => (
                        <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => {
                      const isSelected = selected?.id === row.id;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelected(isSelected ? null : row)}
                          className="cursor-pointer"
                          style={{ borderBottom: "1px solid var(--v2-border)", background: isSelected ? "var(--v2-primary-bg)" : "transparent", opacity: row.status === "neaktivan" ? 0.6 : 1 }}
                        >
                          <td className="py-[12px] px-[12px]">
                            <div className="flex items-center gap-[8px]">
                              <div className="flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(row.naziv)}</div>
                              <span className="text-[13px] font-medium" style={{ color: "var(--v2-text)" }}>{row.naziv}</span>
                            </div>
                          </td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px]" style={{ color: "var(--v2-text)" }}>{row.brojRadova}</span></td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px] font-semibold" style={{ color: row.dug > 0 ? "var(--v2-status-cancelled-fg)" : "var(--v2-text-muted)" }}>{row.dug > 0 ? formatRSD(row.dug) : "—"}</span></td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(row.placenoDo)}</span></td>
                          <td className="py-[12px] px-[12px]"><TehStatusBadge status={row.status} /></td>
                          <td className="py-[12px] px-[12px]">
                            <ChevronDown className="h-4 w-4" style={{ color: "var(--v2-text-muted)", transform: isSelected ? "rotate(180deg)" : "none" }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-[16px] py-[10px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
                <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{rows.length} tehničara</span>
                <span className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>Klikni na red za detalje</span>
              </div>
            </div>
            <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
          </div>

          {selected && <DetailPanel row={selected} onClose={() => setSelected(null)} />}
        </div>
      </div>
    </div>
  );
}
