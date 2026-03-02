"use client";

import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import { FigmaDesktopSidebar } from "../figma-dashboard/sidebars";
import { MKB10_DATA, type Mkb10Entry } from "@/lib/ui-lab/mkb10-data";

// ─── Main ─────────────────────────────────────────────────

export default function DesktopMkb10({ className }: { className?: string }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Mkb10Entry | null>(null);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MKB10_DATA;
    return MKB10_DATA.filter(
      (e) =>
        e.code.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q),
    );
  }, [search]);

  // Group chapter codes (e.g. K00, K01) vs sub-codes (K00.0)
  const isChapter = (code: string) => !code.includes(".");

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}>

        <V2PageHeader section="Ordinacija" title="MKB-10 baza" />

        <main className="flex-1 overflow-hidden rounded-[24px] flex flex-col" style={{ background: "var(--v2-bg)" }}>

          {/* Search + info */}
          <div className="px-6 pt-5 pb-4 flex flex-col gap-3 flex-shrink-0">
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border"
              style={{ background: "var(--v2-surface)", borderColor: "var(--v2-border)" }}
            >
              <Search className="h-5 w-5 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
              <input
                type="text"
                placeholder="Pretraži po šifri (npr. K04) ili nazivu (npr. pulpitis)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-[14px] focus:outline-none bg-transparent"
                style={{ color: "var(--v2-text)" }}
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[12px] px-2 py-0.5 rounded-full hover:bg-[color:var(--v2-input-bg)]"
                  style={{ color: "var(--v2-text-muted)" }}
                >
                  Obriši
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
                Prikazano {results.length} od {MKB10_DATA.length} dijagnoza (K00–K14, stomatološki relevantne)
              </p>
              <p className="text-[11px] px-2.5 py-1 rounded-full"
                style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}>
                TODO: Puni import ~13.000 šifara
              </p>
            </div>
          </div>

          {/* Two-panel layout */}
          <div className="flex-1 overflow-hidden flex gap-0 min-h-0">
            {/* Left: list */}
            <div className="w-[55%] overflow-y-auto border-r" style={{ borderColor: "var(--v2-border)" }}>
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <BookOpen className="h-8 w-8" style={{ color: "var(--v2-text-muted)" }} />
                  <p className="text-[14px]" style={{ color: "var(--v2-text-muted)" }}>
                    Nema rezultata za &ldquo;{search}&rdquo;
                  </p>
                </div>
              ) : (
                results.map((entry) => (
                  <button
                    key={entry.code}
                    onClick={() => setSelected(entry)}
                    className="w-full flex items-center gap-4 px-6 py-3 text-left transition-colors border-b hover:bg-[color:var(--v2-input-bg)]"
                    style={{
                      borderColor: "var(--v2-border)",
                      background: selected?.code === entry.code ? "var(--v2-primary-bg)" : undefined,
                    }}
                  >
                    {/* Code badge */}
                    <span
                      className={`text-[12px] font-mono font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${isChapter(entry.code) ? "w-[60px]" : "w-[64px]"}`}
                      style={{
                        background: isChapter(entry.code) ? "var(--v2-primary)" : "var(--v2-input-bg)",
                        color: isChapter(entry.code) ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
                        textAlign: "center",
                      }}
                    >
                      {entry.code}
                    </span>

                    {/* Name */}
                    <span
                      className={`flex-1 text-[13px] leading-tight ${isChapter(entry.code) ? "font-semibold" : ""}`}
                      style={{ color: selected?.code === entry.code ? "var(--v2-primary-dark)" : "var(--v2-text)" }}
                    >
                      {entry.name}
                    </span>

                    {selected?.code === entry.code && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-primary)" }} />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Right: detail panel */}
            <div className="flex-1 overflow-y-auto">
              {selected ? (
                <div className="p-6 flex flex-col gap-5">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
                    style={{ background: "var(--v2-primary-bg)" }}
                  >
                    <span className="font-mono font-bold text-[18px]" style={{ color: "var(--v2-primary)" }}>
                      {selected.code}
                    </span>
                    {isChapter(selected.code) && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-primary)" }}>
                        Poglavlje
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--v2-text-muted)" }}>
                      Naziv dijagnoze
                    </p>
                    <p className="text-[20px] font-semibold leading-snug" style={{ color: "var(--v2-text-heading)" }}>
                      {selected.name}
                    </p>
                  </div>

                  {/* Related codes */}
                  {isChapter(selected.code) && (() => {
                    const sub = MKB10_DATA.filter(
                      (e) => e.code !== selected.code && e.code.startsWith(selected.code + ".")
                    );
                    return sub.length > 0 ? (
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--v2-text-muted)" }}>
                          Podšifre ({sub.length})
                        </p>
                        <div className="flex flex-col gap-1">
                          {sub.map((s) => (
                            <button
                              key={s.code}
                              onClick={() => setSelected(s)}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors hover:bg-[color:var(--v2-input-bg)]"
                            >
                              <span className="font-mono text-[12px] font-semibold w-[56px] text-center px-2 py-0.5 rounded-lg flex-shrink-0"
                                style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
                                {s.code}
                              </span>
                              <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>{s.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div
                    className="p-4 rounded-xl border text-[12px] leading-relaxed"
                    style={{ borderColor: "var(--v2-border)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}
                  >
                    <strong style={{ color: "var(--v2-text-heading)" }}>Napomena:</strong>{" "}
                    MKB-10 šifre u kartonu pacijenta se dodaju iz ove baze. Odabrana šifra će biti dostupna
                    pri kreiranju dijagnoze u tratmanu.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
                  <div
                    className="h-16 w-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--v2-primary-bg)" }}
                  >
                    <BookOpen className="h-8 w-8" style={{ color: "var(--v2-primary)" }} />
                  </div>
                  <p className="text-[14px] text-center" style={{ color: "var(--v2-text-muted)" }}>
                    Izaberite dijagnozu iz liste<br />da vidite detalje
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
