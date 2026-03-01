// Figma base: Invoices Mobile — node-id=345:18086
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Wrench } from "lucide-react";
import {
  SEED_TEHNIKA_FIN, WorkStatusBadge, formatDate, formatRSD, getInitials,
  BottomSheetOverlay, type TehFinRow,
} from "../shared";

function TehStatusBadge({ status }: { status: TehFinRow["status"] }) {
  const isActive = status === "aktivan";
  return (
    <span className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]" style={{ borderRadius: "var(--v2-radius-badge)", background: isActive ? "var(--v2-status-confirmed-bg)" : "var(--v2-status-cancelled-bg)", color: isActive ? "var(--v2-status-confirmed-fg)" : "var(--v2-status-cancelled-fg)" }}>
      {isActive ? "Aktivan" : "Neaktivan"}
    </span>
  );
}

function DetailSheet({ row, onClose }: { row: TehFinRow; onClose: () => void }) {
  return (
    <BottomSheetOverlay onBackdrop={onClose}>
      <div className="flex items-center justify-between px-[20px] pt-[8px] pb-[12px] flex-shrink-0">
        <div className="flex items-center gap-[10px] min-w-0">
          <div className="flex items-center justify-center font-bold text-[13px] flex-shrink-0" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(row.naziv)}</div>
          <div className="min-w-0">
            <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{row.naziv}</p>
            <div className="mt-[3px]"><TehStatusBadge status={row.status} /></div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
      </div>
      <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />
      <div className="px-[20px] py-[14px]">
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
      <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />
      <div className="px-[20px] py-[14px] flex flex-col gap-[8px]">
        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Poslednji radovi</p>
        {row.poslednjiRadovi.map(w => (
          <div key={w.id} className="flex flex-col gap-[3px] p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
            <div className="flex items-start justify-between gap-[6px]">
              <span className="text-[12px] font-medium flex-1" style={{ color: "var(--v2-text)" }}>{w.pacijent}</span>
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
      <div className="px-[20px] pb-[28px] pt-[4px] flex-shrink-0" style={{ borderTop: "1px solid var(--v2-border)" }}>
        <button onClick={onClose} className="w-full text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Zatvori</button>
      </div>
    </BottomSheetOverlay>
  );
}

export default function MobileTehnikaFin({ className }: { className?: string }) {
  const rows = SEED_TEHNIKA_FIN;
  const [selected, setSelected] = useState<TehFinRow | null>(null);

  const ukupanDug = rows.reduce((s, r) => s + r.dug, 0);

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <header className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]" style={{ background: "var(--v2-surface)" }}>
        <div className="flex items-center gap-[8px]">
          <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="Odontoa" width={32} height={32} className="h-[32px] w-[32px] object-contain" />
          <h1 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text)" }}>Izveštaj tehnike</h1>
        </div>
        <div className="flex items-center justify-center font-semibold text-[11px]" style={{ height: "32px", width: "32px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
      </header>
      <main className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[12px] rounded-t-[24px]" style={{ background: "var(--v2-bg)" }}>
        {/* Summary */}
        <div className="flex gap-[10px]">
          <div className="flex-1 flex flex-col gap-[4px] p-[14px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
            <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Ukupan dug</span>
            <span className="font-bold text-[16px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{formatRSD(ukupanDug)}</span>
          </div>
          <div className="flex-1 flex flex-col gap-[4px] p-[14px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
            <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Tehničara</span>
            <span className="font-bold text-[16px]" style={{ color: "var(--v2-primary-dark)" }}>{rows.length}</span>
          </div>
        </div>

        {/* Cards */}
        {rows.map(row => (
          <button key={row.id} onClick={() => setSelected(row)} className="w-full text-left flex items-center gap-[12px] px-[14px] py-[12px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", opacity: row.status === "neaktivan" ? 0.6 : 1 }}>
            <div className="flex items-center justify-center p-[10px] flex-shrink-0" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>
              <Wrench className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-[8px]">
                <span className="text-[14px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{row.naziv}</span>
                <TehStatusBadge status={row.status} />
              </div>
              <div className="flex items-center justify-between mt-[4px]">
                <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{row.brojRadova} radova</span>
                {row.dug > 0 && <span className="text-[12px] font-semibold" style={{ color: "var(--v2-status-cancelled-fg)" }}>Dug: {formatRSD(row.dug)}</span>}
              </div>
            </div>
          </button>
        ))}
      </main>
      {selected && <DetailSheet row={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
