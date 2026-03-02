// Figma base: Invoices Tablet — node-id=345:18061
"use client";

import { Bell, BarChart3, ChevronDown, FileText, CreditCard, Download } from "lucide-react";
import { FigmaTabletSidebar } from "../../figma-dashboard/sidebars";
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

export default function TabletIzvestaji({ className }: { className?: string }) {
  const { brojPredracuna, brojUplata, promet } = getSeedTotals();

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaTabletSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <header className="flex items-center justify-between flex-shrink-0 pl-[4px]" style={{ height: "var(--v2-topbar-h)" }}>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--v2-primary)" }}>Finansije</p>
            <h1 className="font-semibold leading-[1.2]" style={{ fontSize: "20px", color: "var(--v2-text)" }}>Izveštaji</h1>
          </div>
          <div className="flex items-center gap-[10px]">
            <button className="flex items-center justify-center" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
              <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
            </button>
            <div className="flex items-center justify-center font-semibold text-[12px]" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          {/* Filters */}
          <div className="flex items-center gap-[10px] flex-wrap">
            {[{ label: "Ovaj mesec", active: true }, { label: "Svi doktori", active: false }].map(({ label, active }) => (
              <button key={label} className="flex items-center gap-[5px] text-[12px] font-medium" style={{ padding: "7px 12px", borderRadius: "var(--v2-radius-pill)", background: active ? "var(--v2-primary-bg)" : "var(--v2-surface)", color: active ? "var(--v2-primary-dark)" : "var(--v2-text-muted)", border: active ? "1px solid var(--v2-primary)" : "1px solid var(--v2-border)" }}>
                {label} <ChevronDown className="h-3 w-3" />
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-[14px]">
            {[
              { label: "Predračuna", value: String(brojPredracuna), icon: <FileText className="h-4 w-4" style={{ color: "var(--v2-primary-fg)" }} /> },
              { label: "Uplata", value: String(brojUplata), icon: <CreditCard className="h-4 w-4" style={{ color: "var(--v2-primary-fg)" }} /> },
              { label: "Ukupan promet", value: formatRSD(promet), icon: <BarChart3 className="h-4 w-4" style={{ color: "var(--v2-primary-fg)" }} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-[10px] px-[14px] py-[14px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
                <div className="flex items-center justify-center p-[8px]" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>{icon}</div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                  <span className="font-bold" style={{ fontSize: "16px", color: "var(--v2-primary-dark)" }}>{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* PDF disabled */}
          <div className="flex flex-col gap-[10px] p-[20px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", border: "1px dashed var(--v2-border)" }}>
            <p className="font-semibold text-[13px]" style={{ color: "var(--v2-text-heading)" }}>Preuzimanje izveštaja</p>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>Generisanje PDF izveštaja biće dostupno uskoro.</p>
            <div className="flex items-center gap-[10px]">
              <button disabled className="flex items-center gap-[6px] text-[12px] font-medium cursor-not-allowed" style={{ padding: "9px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", opacity: 0.5 }} title="Uskoro dostupno">
                <Download className="h-4 w-4" /> Preuzmi PDF
              </button>
              <span className="text-[10px] px-[8px] py-[4px] rounded-[var(--v2-radius-badge)]" style={{ background: "var(--v2-status-pending-bg)", color: "var(--v2-status-pending-fg)" }}>Uskoro</span>
            </div>
          </div>
          <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
        </main>
      </div>
    </div>
  );
}
