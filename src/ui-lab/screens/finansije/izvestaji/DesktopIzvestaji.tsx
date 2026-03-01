// Figma base: Invoices — node-id=63:12897 (reports placeholder)
"use client";

import { Settings, Bell, BarChart3, ChevronDown, FileText, CreditCard, Download } from "lucide-react";
import { FigmaDesktopSidebar } from "../../figma-dashboard/sidebars";
import { SEED_PROFORMAS, SEED_TEHNIKA_FIN, formatRSD } from "../shared";

// ─── Derive totals from seed ─────────────────────────────

function getSeedTotals() {
  const proformas = (SEED_PROFORMAS as { status: string; stavke: { id: string; naziv: string; kolicina: number; cena: number; poZubu?: boolean; brojZuba?: number }[]; popust?: { type: "iznos" | "procenat"; value: number } }[]);
  const brojPredracuna = proformas.filter(p => p.status !== "storniran").length;
  const brojUplata = 8;
  const promet = proformas
    .filter(p => p.status === "final")
    .reduce((sum, p) => {
      const med = p.stavke.reduce((s, st) => {
        const qty = st.poZubu && st.brojZuba ? st.brojZuba : st.kolicina;
        return s + qty * st.cena;
      }, 0);
      const disc = p.popust
        ? p.popust.type === "iznos" ? p.popust.value : Math.round(med * p.popust.value / 100)
        : 0;
      return sum + Math.max(0, med - disc);
    }, 0);
  return { brojPredracuna, brojUplata, promet };
}

export default function DesktopIzvestaji({ className }: { className?: string }) {
  const { brojPredracuna, brojUplata, promet } = getSeedTotals();

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <header className="flex items-center justify-between flex-shrink-0 pl-[4px]" style={{ height: "var(--v2-topbar-h)" }}>
          <div>
            <h1 className="font-semibold" style={{ fontSize: "22px", color: "var(--v2-text)" }}>Izveštaji</h1>
            <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>Finansijski izveštaji i statistike</p>
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

        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[24px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>

          {/* Filters row */}
          <div className="flex items-center gap-[12px] flex-wrap">
            <span className="text-[13px] font-medium" style={{ color: "var(--v2-text-muted)" }}>Filteri:</span>
            {[
              { label: "Period: Ovaj mesec", active: true },
              { label: "Doktor: Svi", active: false },
            ].map(({ label, active }) => (
              <button key={label} className="flex items-center gap-[6px] text-[12px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: active ? "var(--v2-primary-bg)" : "var(--v2-surface)", color: active ? "var(--v2-primary-dark)" : "var(--v2-text-muted)", border: active ? "1px solid var(--v2-primary)" : "1px solid var(--v2-border)" }}>
                {label} <ChevronDown className="h-3 w-3" />
              </button>
            ))}
            <span className="text-[11px] ml-auto px-[10px] py-[5px] rounded-[8px]" style={{ background: "var(--v2-surface)", color: "var(--v2-text-muted)", border: "1px dashed var(--v2-border)" }}>
              Filteri su vizuelni — logika filtriranja dolazi uskoro
            </span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-[20px]">
            {[
              { label: "Broj predračuna", value: String(brojPredracuna), icon: <FileText className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />, sub: "finalni i nacrti" },
              { label: "Broj uplata", value: String(brojUplata), icon: <CreditCard className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />, sub: "evidentirane" },
              { label: "Ukupan promet", value: formatRSD(promet), icon: <BarChart3 className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />, sub: "iz finalnih predračuna" },
            ].map(({ label, value, icon, sub }) => (
              <div key={label} className="flex flex-col gap-[16px] px-[20px] py-[20px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
                <div className="flex items-center gap-[10px]">
                  <div className="flex items-center justify-center p-[10px]" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>{icon}</div>
                  <span className="text-[13px] font-medium" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                </div>
                <div>
                  <p className="font-bold leading-[1.1]" style={{ fontSize: "28px", color: "var(--v2-primary-dark)" }}>{value}</p>
                  <p className="text-[11px] mt-[4px]" style={{ color: "var(--v2-text-muted)" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Disabled PDF button */}
          <div className="flex flex-col gap-[12px] p-[24px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", border: "1px dashed var(--v2-border)" }}>
            <div className="flex items-center gap-[10px]">
              <BarChart3 className="h-5 w-5" style={{ color: "var(--v2-text-muted)" }} />
              <p className="font-semibold text-[14px]" style={{ color: "var(--v2-text-heading)" }}>Preuzimanje izveštaja</p>
            </div>
            <p style={{ fontSize: "13px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>
              Generisanje PDF izveštaja za odabrani period biće dostupno u sledećoj verziji. Izveštaj će uključivati pregled predračuna, uplata i tehnike.
            </p>
            <div className="flex items-center gap-[10px]">
              <button
                disabled
                className="flex items-center gap-[6px] text-[13px] font-medium cursor-not-allowed"
                style={{ padding: "10px 20px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)", opacity: 0.5 }}
                title="Uskoro dostupno"
              >
                <Download className="h-4 w-4" /> Preuzmi PDF
              </button>
              <span className="text-[11px] px-[10px] py-[5px] rounded-[var(--v2-radius-badge)]" style={{ background: "var(--v2-status-pending-bg)", color: "var(--v2-status-pending-fg)" }}>Uskoro</span>
            </div>
          </div>

          <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
        </div>
      </div>
    </div>
  );
}
