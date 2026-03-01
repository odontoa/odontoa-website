// Figma base: Invoices Tablet — node-id=345:18061
"use client";

import { useState } from "react";
import { Bell, X, Wrench } from "lucide-react";
import { FigmaTabletSidebar } from "../../figma-dashboard/sidebars";
import {
  SEED_TEHNIKA_FIN, WorkStatusBadge, formatDate, formatRSD, getInitials,
  ModalOverlay, type TehFinRow,
} from "../shared";

function TehStatusBadge({ status }: { status: TehFinRow["status"] }) {
  const isActive = status === "aktivan";
  return (
    <span className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]" style={{ borderRadius: "var(--v2-radius-badge)", background: isActive ? "var(--v2-status-confirmed-bg)" : "var(--v2-status-cancelled-bg)", color: isActive ? "var(--v2-status-confirmed-fg)" : "var(--v2-status-cancelled-fg)" }}>
      {isActive ? "Aktivan" : "Neaktivan"}
    </span>
  );
}

function DetailModal({ row, onClose }: { row: TehFinRow; onClose: () => void }) {
  return (
    <ModalOverlay z={40}>
      <div className="flex flex-col overflow-y-auto" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "420px", maxHeight: "85vh", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start justify-between gap-[10px] p-[16px] flex-shrink-0">
          <div className="flex items-center gap-[10px] min-w-0">
            <div className="flex items-center justify-center font-bold text-[13px] flex-shrink-0" style={{ height: "38px", width: "38px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(row.naziv)}</div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{row.naziv}</p>
              <div className="mt-[3px]"><TehStatusBadge status={row.status} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
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
              <div key={label} className="flex flex-col gap-[2px] p-[8px]" style={{ background: "var(--v2-input-bg)", borderRadius: "8px" }}>
                <span className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                <span className="font-semibold text-[12px]" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[6px]">
          <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Poslednji radovi</p>
          {row.poslednjiRadovi.map(w => (
            <div key={w.id} className="flex flex-col gap-[3px] p-[8px]" style={{ background: "var(--v2-input-bg)", borderRadius: "8px" }}>
              <div className="flex items-start justify-between gap-[6px]">
                <span className="text-[12px] font-medium flex-1 min-w-0" style={{ color: "var(--v2-text)" }}>{w.pacijent}</span>
                <WorkStatusBadge status={w.statusNaplate} />
              </div>
              <div className="flex justify-between">
                <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{w.vrstaRada}</span>
                <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(w.datum)}</span>
              </div>
              <span className="text-[11px] font-medium" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(w.iznos)}</span>
            </div>
          ))}
        </div>
        <div className="p-[16px] flex-shrink-0">
          <button onClick={onClose} className="w-full text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Zatvori</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

export default function TabletTehnikaFin({ className }: { className?: string }) {
  const rows = SEED_TEHNIKA_FIN;
  const [selected, setSelected] = useState<TehFinRow | null>(null);

  const totalRadova = rows.reduce((s, r) => s + r.brojRadova, 0);
  const ukupanDug = rows.reduce((s, r) => s + r.dug, 0);

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaTabletSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <header className="flex items-center justify-between flex-shrink-0 pl-[4px]" style={{ height: "var(--v2-topbar-h)" }}>
          <h1 className="font-semibold" style={{ fontSize: "20px", color: "var(--v2-text)" }}>Izveštaj tehnike</h1>
          <div className="flex items-center gap-[10px]">
            <button className="flex items-center justify-center" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
              <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
            </button>
            <div className="flex items-center justify-center font-semibold text-[12px]" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <div className="grid grid-cols-2 gap-[14px]">
            {[
              { label: "Ukupno radova", value: String(totalRadova) },
              { label: "Ukupan dug", value: formatRSD(ukupanDug) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-[10px] px-[14px] py-[14px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
                <div className="flex items-center justify-center p-[8px]" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>
                  <Wrench className="h-4 w-4" style={{ color: "var(--v2-primary-fg)" }} />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                  <span className="font-bold" style={{ fontSize: "16px", color: "var(--v2-primary-dark)" }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
            <div className="p-[14px]">
              <h2 className="font-semibold text-[13px]" style={{ color: "var(--v2-text-heading)" }}>Tehničari</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "var(--v2-input-bg)" }}>
                    {["Tehničar", "Dug", "Status"].map((h, i) => (
                      <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id} onClick={() => setSelected(row)} className="cursor-pointer" style={{ borderBottom: "1px solid var(--v2-border)", opacity: row.status === "neaktivan" ? 0.6 : 1 }}>
                      <td className="py-[12px] px-[12px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(row.naziv)}</div>
                          <span className="text-[13px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{row.naziv}</span>
                        </div>
                      </td>
                      <td className="py-[12px] px-[12px]"><span className="text-[12px] font-semibold" style={{ color: row.dug > 0 ? "var(--v2-status-cancelled-fg)" : "var(--v2-text-muted)" }}>{row.dug > 0 ? formatRSD(row.dug) : "—"}</span></td>
                      <td className="py-[12px] px-[12px]"><TehStatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
        </main>
      </div>
      {selected && <DetailModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
