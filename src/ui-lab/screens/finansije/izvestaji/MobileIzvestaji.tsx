// Figma base: Invoices Mobile — node-id=345:18086
"use client";

import Image from "next/image";
import { BarChart3, FileText, CreditCard, Download, ChevronDown } from "lucide-react";
import { SEED_PROFORMAS, formatRSD } from "../shared";

function getSeedTotals() {
  const proformas = SEED_PROFORMAS as { status: string; stavke: { kolicina: number; cena: number; poZubu?: boolean; brojZuba?: number }[]; popust?: { type: "iznos" | "procenat"; value: number } }[];
  const brojPredracuna = proformas.filter(p => p.status !== "storniran").length;
  const promet = proformas.filter(p => p.status === "final").reduce((sum, p) => {
    const med = p.stavke.reduce((s, st) => { const qty = st.poZubu && st.brojZuba ? st.brojZuba : st.kolicina; return s + qty * st.cena; }, 0);
    const disc = p.popust ? (p.popust.type === "iznos" ? p.popust.value : Math.round(med * p.popust.value / 100)) : 0;
    return sum + Math.max(0, med - disc);
  }, 0);
  return { brojPredracuna, brojUplata: 8, promet };
}

export default function MobileIzvestaji({ className }: { className?: string }) {
  const { brojPredracuna, brojUplata, promet } = getSeedTotals();

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <header className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]" style={{ background: "var(--v2-surface)" }}>
        <div className="flex items-center gap-[8px]">
          <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="Odontoa" width={32} height={32} className="h-[32px] w-[32px] object-contain" />
          <div className="flex flex-col justify-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest leading-none mb-[2px]" style={{ color: "var(--v2-primary)" }}>Finansije</p>
            <h1 className="font-semibold leading-[1.2]" style={{ fontSize: "18px", color: "var(--v2-text)" }}>Izveštaji</h1>
          </div>
        </div>
        <div className="flex items-center justify-center font-semibold text-[11px]" style={{ height: "32px", width: "32px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
      </header>
      <main className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[14px] rounded-t-[24px]" style={{ background: "var(--v2-bg)" }}>
        {/* Filters */}
        <div className="flex gap-[8px] flex-wrap">
          {[{ label: "Ovaj mesec", active: true }, { label: "Svi doktori", active: false }].map(({ label, active }) => (
            <button key={label} className="flex items-center gap-[4px] text-[12px] font-medium" style={{ padding: "7px 12px", borderRadius: "var(--v2-radius-pill)", background: active ? "var(--v2-primary-bg)" : "var(--v2-surface)", color: active ? "var(--v2-primary-dark)" : "var(--v2-text-muted)", border: active ? "1px solid var(--v2-primary)" : "1px solid var(--v2-border)" }}>
              {label} <ChevronDown className="h-3 w-3" />
            </button>
          ))}
        </div>

        {/* Stats */}
        {[
          { label: "Broj predračuna", value: String(brojPredracuna), icon: <FileText className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} /> },
          { label: "Broj uplata", value: String(brojUplata), icon: <CreditCard className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} /> },
          { label: "Ukupan promet", value: formatRSD(promet), icon: <BarChart3 className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-center gap-[14px] px-[16px] py-[16px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
            <div className="flex items-center justify-center p-[10px] flex-shrink-0" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>{icon}</div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
              <span className="font-bold" style={{ fontSize: "20px", color: "var(--v2-primary-dark)" }}>{value}</span>
            </div>
          </div>
        ))}

        {/* PDF disabled */}
        <div className="flex flex-col gap-[12px] p-[16px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", border: "1px dashed var(--v2-border)" }}>
          <p className="font-semibold text-[14px]" style={{ color: "var(--v2-text-heading)" }}>Preuzimanje izveštaja</p>
          <p style={{ fontSize: "13px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>Generisanje PDF izveštaja biće dostupno u sledećoj verziji.</p>
          <button disabled className="flex items-center justify-center gap-[6px] text-[14px] font-medium cursor-not-allowed w-full" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", opacity: 0.5 }}>
            <Download className="h-4 w-4" /> Preuzmi PDF
          </button>
          <p className="text-center text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Uskoro dostupno</p>
        </div>
      </main>
    </div>
  );
}
