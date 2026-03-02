"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, ListChecks, Pencil, Check } from "lucide-react";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import { Switch } from "@/components/ui/switch";
import { FigmaDesktopSidebar } from "../figma-dashboard/sidebars";
import { loadTherapies, saveTherapies } from "@/lib/ui-lab/clinic-store";
import type { Therapy, TherapyCategory } from "@/lib/ui-lab/types";

// ─── Category section ─────────────────────────────────────

function CategorySection({
  category,
  therapies,
  forceOpen,
  editingTherapyId,
  onPriceChange,
  onToggleActive,
  onStartEdit,
  onEndEdit,
}: {
  category: TherapyCategory;
  therapies: Therapy[];
  forceOpen: boolean;
  editingTherapyId: string | null;
  onPriceChange: (id: string, price: number) => void;
  onToggleActive: (id: string) => void;
  onStartEdit: (id: string) => void;
  onEndEdit: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const isOpen = forceOpen || !collapsed;

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: "var(--v2-border)", background: "var(--v2-surface)" }}
    >
      {/* Category header — card header feel */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-colors hover:opacity-90"
        style={{ background: "var(--v2-input-bg)" }}
      >
        <div className="flex items-center gap-2.5">
          <ListChecks className="h-4 w-4" style={{ color: "var(--v2-primary)" }} />
          <span className="font-semibold text-[14px]" style={{ color: "var(--v2-text-heading)" }}>
            {category}
          </span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
          >
            {therapies.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
        ) : (
          <ChevronDown className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
        )}
      </button>

      {/* Therapy rows */}
      {isOpen && (
        <div className="pt-2 pb-1 flex flex-col gap-0 px-2">
          {therapies.map((t, i) => (
            <div
              key={t.id}
              className={[
                "grid items-center gap-6 px-4 py-3 rounded-[12px] transition-colors",
                "max-sm:grid-cols-1 max-sm:gap-2",
                i % 2 === 1
                  ? "bg-[color-mix(in_srgb,var(--v2-input-bg)_55%,transparent)]"
                  : "",
                "hover:bg-[color-mix(in_srgb,var(--v2-primary-bg)_18%,transparent)]",
              ].join(" ")}
              style={{ minHeight: "68px", gridTemplateColumns: "1fr 200px 140px" }}
            >
              {/* Col 1: Therapy name */}
              <span
                className="text-[15px] font-medium leading-5"
                style={{
                  color: "var(--v2-text-heading)",
                  opacity: t.isActive ? 1 : 0.6,
                }}
              >
                {t.name}
              </span>

              {/* Col 2: Price input — locked until user clicks pencil */}
              {(() => {
                const isEditing = editingTherapyId === t.id;
                return (
                  <div className="relative w-full max-sm:hidden flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        step={100}
                        readOnly={!isEditing}
                        value={t.defaultPrice}
                        onChange={(e) => onPriceChange(t.id, Number(e.target.value || 0))}
                        onBlur={() => { if (isEditing) onEndEdit(); }}
                        onKeyDown={(e) => { if (e.key === "Enter" && isEditing) { e.currentTarget.blur(); } }}
                        className="h-10 w-full text-right pr-12 pl-3 rounded-lg text-[14px] font-medium tabular-nums focus:outline-none border transition-colors"
                        style={{
                          background: isEditing ? "var(--v2-surface)" : "var(--v2-input-bg)",
                          borderColor: isEditing ? "var(--v2-primary)" : "var(--v2-border)",
                          color: isEditing ? "var(--v2-text-heading)" : "var(--v2-text-muted)",
                          cursor: isEditing ? "text" : "not-allowed",
                        }}
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] select-none pointer-events-none"
                        style={{ color: "var(--v2-text-muted)" }}
                      >
                        RSD
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={isEditing ? "Zaključaj cenu" : "Izmeni cenu"}
                      onClick={() => isEditing ? onEndEdit() : onStartEdit(t.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-80"
                      style={{
                        background: isEditing ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
                        color: isEditing ? "var(--v2-primary)" : "var(--v2-text-muted)",
                      }}
                    >
                      {isEditing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                );
              })()}

              {/* Col 3: Switch — always active */}
              <div className="flex items-center gap-2 max-sm:hidden">
                <Switch
                  checked={t.isActive}
                  onCheckedChange={() => onToggleActive(t.id)}
                  aria-label={t.isActive ? "Deaktiviraj terapiju" : "Aktiviraj terapiju"}
                />
                <span className="text-[12px] select-none" style={{ color: "var(--v2-text-muted)" }}>
                  {t.isActive ? "Aktivna" : "—"}
                </span>
              </div>

              {/* Responsive: price + switch in a single row below name */}
              {(() => {
                const isEditing = editingTherapyId === t.id;
                return (
                  <div className="hidden max-sm:flex items-center gap-3">
                    <div className="relative flex-1 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={0}
                          step={100}
                          readOnly={!isEditing}
                          value={t.defaultPrice}
                          onChange={(e) => onPriceChange(t.id, Number(e.target.value || 0))}
                          onBlur={() => { if (isEditing) onEndEdit(); }}
                          onKeyDown={(e) => { if (e.key === "Enter" && isEditing) e.currentTarget.blur(); }}
                          className="h-9 w-full text-right pr-10 pl-3 rounded-lg text-[13px] font-medium tabular-nums focus:outline-none border transition-colors"
                          style={{
                            background: isEditing ? "var(--v2-surface)" : "var(--v2-input-bg)",
                            borderColor: isEditing ? "var(--v2-primary)" : "var(--v2-border)",
                            color: isEditing ? "var(--v2-text-heading)" : "var(--v2-text-muted)",
                            cursor: isEditing ? "text" : "not-allowed",
                          }}
                        />
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] select-none pointer-events-none"
                          style={{ color: "var(--v2-text-muted)" }}
                        >
                          RSD
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => isEditing ? onEndEdit() : onStartEdit(t.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-80"
                        style={{
                          background: isEditing ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
                          color: isEditing ? "var(--v2-primary)" : "var(--v2-text-muted)",
                        }}
                      >
                        {isEditing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={t.isActive}
                        onCheckedChange={() => onToggleActive(t.id)}
                        aria-label={t.isActive ? "Deaktiviraj terapiju" : "Aktiviraj terapiju"}
                      />
                      <span className="text-[12px] select-none" style={{ color: "var(--v2-text-muted)" }}>
                        {t.isActive ? "Aktivna" : "—"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────

export default function DesktopCenovnik({ className }: { className?: string }) {
  const [therapies, setTherapies] = useState<Therapy[]>(() => loadTherapies());
  const [search, setSearch] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [editingTherapyId, setEditingTherapyId] = useState<string | null>(null);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const debouncedSave = (list: Therapy[]) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTherapies(list);
      setSavedAt(new Date());
    }, 250);
  };

  const handlePriceChange = (id: string, price: number) => {
    const updated = therapies.map((t) => (t.id === id ? { ...t, defaultPrice: price } : t));
    setTherapies(updated);
    debouncedSave(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = therapies.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
    setTherapies(updated);
    debouncedSave(updated);
  };

  const hasSearch = search.trim().length > 0;

  const grouped = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q
      ? therapies.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      : therapies;

    const map = new Map<TherapyCategory, Therapy[]>();
    for (const t of filtered) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, [therapies, search]);

  const totalActive = therapies.filter((t) => t.isActive).length;

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />

      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <V2PageHeader
          section="Ordinacija"
          title="Cenovnik terapija"
          centerSearch={{ value: search, onChange: setSearch, placeholder: "Pretraži terapije…" }}
        />

        <main
          className="flex-1 overflow-hidden rounded-[24px] flex flex-col"
          style={{ background: "var(--v2-bg)" }}
        >
          {/* Stats bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
            style={{ borderColor: "var(--v2-border)", background: "var(--v2-surface)" }}
          >
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                  Ukupno terapija
                </p>
                <p className="text-[22px] font-bold" style={{ color: "var(--v2-text-heading)" }}>
                  {therapies.length}
                </p>
              </div>
              <div className="w-px h-10" style={{ background: "var(--v2-border)" }} />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                  Aktivnih
                </p>
                <p className="text-[22px] font-bold" style={{ color: "#10b981" }}>
                  {totalActive}
                </p>
              </div>
              <div className="w-px h-10" style={{ background: "var(--v2-border)" }} />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                  Kategorija
                </p>
                <p className="text-[22px] font-bold" style={{ color: "var(--v2-text-heading)" }}>
                  {grouped.size}
                </p>
              </div>
            </div>
            {savedAt && (
              <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
                Sačuvano {savedAt.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>

          {/* Category list — max-width centered */}
          <div className="flex-1 overflow-y-auto py-5">
            <div className="max-w-[1100px] mx-auto w-full px-6 flex flex-col gap-4">
              {grouped.size === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <p className="text-[14px]" style={{ color: "var(--v2-text-muted)" }}>
                    Nema rezultata za &ldquo;{search}&rdquo;
                  </p>
                </div>
              ) : (
                Array.from(grouped.entries()).map(([cat, items]) => (
                  <CategorySection
                    key={cat}
                    category={cat}
                    therapies={items}
                    forceOpen={hasSearch}
                    editingTherapyId={editingTherapyId}
                    onPriceChange={handlePriceChange}
                    onToggleActive={handleToggleActive}
                    onStartEdit={setEditingTherapyId}
                    onEndEdit={() => setEditingTherapyId(null)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
