"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Stethoscope,
  Calendar,
  Clock,
  ArmchairIcon,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Pencil,
  Trash2,
  Search,
  FlaskConical,
  AlertTriangle,
} from "lucide-react";
import { useAppointments } from "@/lib/ui-lab/appointments-context";
import { loadTherapies, loadTechnicians } from "@/lib/ui-lab/clinic-store";
import { ToothSelectorGrid } from "@/components/odontogram/ToothSelectorGrid";
import { MKB10_DATA } from "@/lib/ui-lab/mkb10-data";
import type { Mkb10Entry } from "@/lib/ui-lab/mkb10-data";
import type {
  Appointment,
  ApptType,
  Treatment,
  TreatmentScope,
  ToothType,
  TherapyRef,
  Therapy,
  Technician,
} from "@/lib/ui-lab/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function padTime(n: number) {
  return String(n).padStart(2, "0");
}

function calcEndTime(startTime: string, durationMin: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const end = h * 60 + m + durationMin;
  return `${padTime(Math.floor(end / 60))}:${padTime(end % 60)}`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("sr-RS", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatPrice(n: number): string {
  return n.toLocaleString("sr-RS") + " RSD";
}

function genId(): string {
  return `trmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── MKB-10 multi-select picker ──────────────────────────────────────────────

function MkbPicker({
  selected,
  onChange,
  hasError,
}: {
  selected: Mkb10Entry[];
  onChange: (v: Mkb10Entry[]) => void;
  hasError: boolean;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const handler = (e: MouseEvent) => {
      if (!node.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? MKB10_DATA.filter(
        (e) => e.code.toLowerCase().includes(q) || e.name.toLowerCase().includes(q),
      ).slice(0, 40)
    : MKB10_DATA.slice(0, 40);

  const isSelected = (e: Mkb10Entry) => selected.some((s) => s.code === e.code);

  const toggle = (e: Mkb10Entry) => {
    if (isSelected(e)) onChange(selected.filter((s) => s.code !== e.code));
    else onChange([...selected, e]);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <label
        className="text-[12px] font-semibold uppercase tracking-wider flex items-center gap-1"
        style={{ color: hasError ? "#ef4444" : "var(--v2-text-muted)" }}
      >
        MKB dijagnoza
        <span style={{ color: "#ef4444" }}>*</span>
        {hasError && (
          <span className="normal-case font-normal text-[11px]">(obavezno)</span>
        )}
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((e) => (
            <span
              key={e.code}
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full"
              style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
            >
              <span className="font-bold">{e.code}</span>
              <span className="opacity-80 truncate max-w-[160px]">{e.name}</span>
              <button
                type="button"
                onClick={() => toggle(e)}
                className="hover:opacity-70 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input + dropdown */}
      <div className="relative">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--v2-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Pretraži po šifri ili nazivu…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border text-[13px] focus:outline-none"
            style={{
              background: "var(--v2-input-bg)",
              borderColor: hasError ? "#ef4444" : "var(--v2-border)",
              color: "var(--v2-text)",
            }}
          />
        </div>
        {open && (
          <div
            className="absolute top-full left-0 right-0 z-30 rounded-xl border overflow-y-auto shadow-lg mt-1"
            style={{
              maxHeight: "220px",
              background: "var(--v2-surface)",
              borderColor: "var(--v2-border)",
            }}
          >
            {filtered.length === 0 ? (
              <p className="text-[12px] text-center py-4" style={{ color: "var(--v2-text-muted)" }}>
                Nema rezultata
              </p>
            ) : (
              filtered.map((e) => {
                const sel = isSelected(e);
                return (
                  <button
                    key={e.code}
                    type="button"
                    onClick={() => toggle(e)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[color:var(--v2-input-bg)]"
                  >
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{
                        background: sel ? "var(--v2-primary)" : "var(--v2-primary-bg)",
                        color: sel ? "var(--v2-primary-fg)" : "var(--v2-primary)",
                      }}
                    >
                      {e.code}
                    </span>
                    <span className="text-[13px] flex-1 truncate" style={{ color: "var(--v2-text)" }}>
                      {e.name}
                    </span>
                    {sel && <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-primary)" }} />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Appointment info card ────────────────────────────────────────────────────

function ApptInfoCard({ appt }: { appt: Appointment }) {
  const rows = [
    { icon: <User className="h-3.5 w-3.5" />, label: "Pacijent", value: appt.patientName },
    { icon: <Stethoscope className="h-3.5 w-3.5" />, label: "Doktor", value: appt.doctorName ?? "Dr. Marko Marković" },
    { icon: <Calendar className="h-3.5 w-3.5" />, label: "Datum", value: formatDate(appt.dateISO) },
    {
      icon: <Clock className="h-3.5 w-3.5" />, label: "Vreme",
      value: `${appt.startTime} → ${calcEndTime(appt.startTime, appt.durationMin)} (${appt.durationMin} min)`,
    },
    { icon: <ArmchairIcon className="h-3.5 w-3.5" />, label: "Stolica", value: `Stolica ${appt.chairId}` },
  ];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--v2-border)", background: "var(--v2-surface)" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--v2-border)", background: "var(--v2-input-bg)" }}>
        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Informacije o terminu
        </p>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 px-5 py-3 border-t" style={{ borderColor: "var(--v2-border)" }}>
          <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--v2-input-bg)" }}>
            <span style={{ color: "var(--v2-text-muted)" }}>{r.icon}</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>{r.label}</p>
            <p className="text-[13px] font-medium" style={{ color: "var(--v2-text-heading)" }}>{r.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Treatment card ───────────────────────────────────────────────────────────

function TreatmentCard({
  treatment,
  onEdit,
  onDelete,
}: {
  treatment: Treatment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const scopeLabel: Record<TreatmentScope, string> = {
    ALL: "Svi zubi", SINGLE: "Jedan zub", MULTI: "Više zuba",
  };

  const isMulti = treatment.scope === "MULTI" && treatment.selectedTeeth.length > 0;
  const visibleTherapies = treatment.therapies.slice(0, 2);
  const therapyOverflow = treatment.therapies.length - 2;

  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{ borderColor: "var(--v2-border)", background: "var(--v2-surface)" }}
    >
      {/* Top row: scope/type badges + price + actions */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}>
              {scopeLabel[treatment.scope]}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
              {treatment.toothType === "STALNI" ? "Stalni zubi" : "Mlečni zubi"}
            </span>
            {treatment.isPriceOverridden && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.1)", color: "#d97706" }}>
                Ručno korigovano
              </span>
            )}
          </div>

          {/* SINGLE: single tooth label */}
          {!isMulti && treatment.selectedTeeth.length > 0 && (
            <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
              Zub: <strong style={{ color: "var(--v2-text)" }}>{treatment.selectedTeeth.join(", ")}</strong>
            </p>
          )}

          {/* Therapy badges (non-MULTI or MULTI compact) */}
          {!isMulti && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {visibleTherapies.map((th) => (
                <span key={th.therapyId} className="text-[12px] font-medium px-2 py-0.5 rounded-lg"
                  style={{ background: "var(--v2-input-bg)", color: "var(--v2-text)" }}>
                  {th.name}
                </span>
              ))}
              {therapyOverflow > 0 && (
                <span className="text-[12px] font-medium px-2 py-0.5 rounded-lg"
                  style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
                  +{therapyOverflow}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-4">
          <div className="text-right mr-2">
            <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>Ukupno</p>
            <p className="text-[15px] font-bold" style={{ color: "var(--v2-text-heading)" }}>
              {formatPrice(treatment.totalPrice)}
            </p>
            {isMulti && !treatment.isPriceOverridden && (
              <p className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>
                {treatment.therapies.length} ter. × {treatment.selectedTeeth.length} zuba
              </p>
            )}
          </div>
          <button onClick={onEdit} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[color:var(--v2-input-bg)]">
            <Pencil className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
          </button>
          <button onClick={onDelete} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" style={{ color: "#ef4444" }} />
          </button>
        </div>
      </div>

      {/* MULTI: per-tooth breakdown */}
      {isMulti && (
        <div
          className="flex flex-col gap-1.5 pt-1 border-t"
          style={{ borderColor: "var(--v2-border)" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--v2-text-muted)" }}>
            Raspodela po zubima
          </p>
          {treatment.selectedTeeth.map((tooth) => (
            <div key={tooth} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
                >
                  {tooth}
                </span>
                <div className="flex flex-wrap gap-1 min-w-0">
                  {visibleTherapies.map((t) => (
                    <span key={t.therapyId} className="text-[11px] px-1.5 py-0.5 rounded truncate max-w-[130px]"
                      style={{ background: "var(--v2-input-bg)", color: "var(--v2-text)" }}>
                      {t.name}
                    </span>
                  ))}
                  {therapyOverflow > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
                      +{therapyOverflow}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>
                {formatPrice(treatment.basePrice)}
              </span>
            </div>
          ))}
        </div>
      )}

      {treatment.tech && (
        <p className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
          Tehnika: {treatment.tech.name} — {formatPrice(treatment.tech.cost)}
        </p>
      )}
      {treatment.note && (
        <p className="text-[11px] italic" style={{ color: "var(--v2-text-muted)" }}>{treatment.note}</p>
      )}
    </div>
  );
}

// ─── Add treatment form ───────────────────────────────────────────────────────

interface TreatmentFormProps {
  therapies: Therapy[];
  technicians: Technician[];
  initial?: Treatment;
  onSave: (t: Treatment) => void;
  onCancel: () => void;
}

function TreatmentForm({ therapies, technicians, initial, onSave, onCancel }: TreatmentFormProps) {
  const [scope, setScope]         = useState<TreatmentScope>(initial?.scope ?? "SINGLE");
  const [toothType, setToothType] = useState<ToothType>(initial?.toothType ?? "STALNI");
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>(initial?.selectedTeeth ?? []);
  const [therapySearch, setTherapySearch] = useState("");
  const [selectedTherapies, setSelectedTherapies] = useState<TherapyRef[]>(initial?.therapies ?? []);
  const [priceOverride, setPriceOverride] = useState<string>(
    initial ? String(initial.totalPrice) : "",
  );
  const [percentCorrection, setPercentCorrection] = useState<string>(
    initial?.percentCorrection != null ? String(initial.percentCorrection) : "",
  );
  const [priceMode, setPriceMode] = useState<"auto" | "manual" | "percent">(
    initial?.isPriceOverridden
      ? (initial.percentCorrection != null ? "percent" : "manual")
      : "auto",
  );
  const [techOpen, setTechOpen]     = useState(!!initial?.tech);
  const [techId, setTechId]         = useState(initial?.tech?.techId ?? "");
  const [techCost, setTechCost]     = useState(initial?.tech?.cost ? String(initial.tech.cost) : "");
  const [note, setNote]             = useState(initial?.note ?? "");
  const [errors, setErrors]         = useState<string[]>([]);

  // Auto-price calculation
  const basePrice = selectedTherapies.reduce((sum, t) => sum + t.unitPrice, 0);
  const multiplier = scope === "MULTI" ? Math.max(1, selectedTeeth.length) : 1;
  const autoPrice = basePrice * multiplier;

  const percentCorrNum = Number(percentCorrection) || 0;
  const displayPrice =
    priceMode === "manual"
      ? Number(priceOverride) || 0
      : priceMode === "percent"
        ? Math.round(autoPrice * (1 + percentCorrNum / 100))
        : autoPrice;

  const handleToothToggle = useCallback(
    (n: number) => {
      setSelectedTeeth((prev) => {
        if (scope === "SINGLE") return prev.includes(n) ? [] : [n];
        return prev.includes(n) ? prev.filter((t) => t !== n) : [...prev, n];
      });
      setPriceMode("auto");
    },
    [scope],
  );

  const handleTherapyToggle = (th: Therapy) => {
    setSelectedTherapies((prev) => {
      const exists = prev.some((t) => t.therapyId === th.id);
      if (exists) return prev.filter((t) => t.therapyId !== th.id);
      return [...prev, { therapyId: th.id, name: th.name, unitPrice: th.defaultPrice }];
    });
    setPriceMode("auto");
  };

  const filteredTherapies = useMemo(() => {
    const q = therapySearch.toLowerCase().trim();
    const active = therapies.filter((t) => t.isActive);
    return q ? active.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) : active;
  }, [therapies, therapySearch]);

  const selectedTech = technicians.find((t) => t.id === techId);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (scope === "SINGLE" && selectedTeeth.length !== 1)
      errs.push("Za 'Jedan zub' mora biti izabran tačno 1 zub.");
    if (scope === "MULTI" && selectedTeeth.length < 2)
      errs.push("Za 'Više zuba' moraju biti izabrana najmanje 2 zuba.");
    if (selectedTherapies.length === 0) errs.push("Izaberite barem jednu terapiju.");
    if (techOpen && techId && !techCost) errs.push("Unesite cenu tehnike.");
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }

    const techCostNum = Number(techCost) || 0;
    const techEntry = techOpen && selectedTech
      ? { techId: selectedTech.id, name: selectedTech.name, cost: techCostNum }
      : null;

    const totalPrice = displayPrice + (techEntry?.cost ?? 0);

    onSave({
      id: initial?.id ?? genId(),
      scope,
      toothType,
      selectedTeeth,
      therapies: selectedTherapies,
      basePrice,
      multiplier,
      totalPrice,
      isPriceOverridden: priceMode !== "auto",
      percentCorrection: priceMode === "percent" ? percentCorrNum : undefined,
      tech: techEntry,
      note: note.trim(),
    });
  };

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-5"
      style={{
        borderColor: "var(--v2-primary)",
        background: "var(--v2-surface)",
        boxShadow: "0 0 0 3px var(--v2-primary-bg)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px]" style={{ color: "var(--v2-text-heading)" }}>
          {initial ? "Izmeni tretman" : "Dodaj tretman"}
        </h3>
        <button onClick={onCancel} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[color:var(--v2-input-bg)]">
          <X className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="flex flex-col gap-1 p-3 rounded-xl border"
          style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
          {errors.map((e) => (
            <p key={e} className="flex items-center gap-2 text-[12px]" style={{ color: "#ef4444" }}>
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />{e}
            </p>
          ))}
        </div>
      )}

      {/* Scope */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Obim rada
        </label>
        <div className="flex gap-2">
          {(["ALL", "SINGLE", "MULTI"] as TreatmentScope[]).map((s) => {
            const labels: Record<TreatmentScope, string> = {
              ALL: "Svi zubi", SINGLE: "Jedan zub", MULTI: "Više zuba",
            };
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setScope(s);
                  setSelectedTeeth([]);
                  setIsPriceManual(false);
                }}
                className="flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all"
                style={{
                  background: scope === s ? "var(--v2-primary)" : "var(--v2-input-bg)",
                  borderColor: scope === s ? "var(--v2-primary)" : "var(--v2-border)",
                  color: scope === s ? "var(--v2-primary-fg)" : "var(--v2-text)",
                }}
              >
                {labels[s]}
              </button>
            );
          })}
        </div>
        {scope === "MULTI" && (
          <p className="text-[12px] px-1" style={{ color: "var(--v2-text-muted)" }}>
            Izabrane terapije primenjuju se na <strong>sve izabrane zube</strong>. Ako želite različite terapije po zubu, dodajte još jedan tretman.
          </p>
        )}
      </div>

      {/* Tooth type */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Tip zuba
        </label>
        <div className="flex gap-2">
          {(["STALNI", "MLECNI"] as ToothType[]).map((tt) => (
            <button
              key={tt}
              type="button"
              onClick={() => { setToothType(tt); setSelectedTeeth([]); }}
              className="flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all"
              style={{
                background: toothType === tt ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
                borderColor: toothType === tt ? "var(--v2-primary)" : "var(--v2-border)",
                color: toothType === tt ? "var(--v2-primary)" : "var(--v2-text)",
              }}
            >
              {tt === "STALNI" ? "Stalni" : "Mlečni"}
            </button>
          ))}
        </div>
      </div>

      {/* Tooth selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Odontogram — odabir zuba
        </label>
        <ToothSelectorGrid
          toothType={toothType}
          mode={scope === "ALL" ? "none" : scope === "SINGLE" ? "single" : "multi"}
          selectedTeeth={selectedTeeth}
          onToggle={handleToothToggle}
        />
      </div>

      {/* Therapy multi-select */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Terapije (iz cenovnika)
        </label>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
          <input
            type="text"
            placeholder="Pretraži terapije..."
            value={therapySearch}
            onChange={(e) => setTherapySearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border text-[13px] focus:outline-none"
            style={{ background: "var(--v2-input-bg)", borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
          />
        </div>

        {/* Selected chips */}
        {selectedTherapies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedTherapies.map((t) => (
              <span
                key={t.therapyId}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full"
                style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
              >
                {t.name}
                <button
                  onClick={() => setSelectedTherapies((prev) => prev.filter((x) => x.therapyId !== t.therapyId))}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Therapy list */}
        <div
          className="rounded-xl border overflow-y-auto"
          style={{ maxHeight: "200px", borderColor: "var(--v2-border)" }}
        >
          {filteredTherapies.length === 0 ? (
            <p className="text-[12px] text-center py-4" style={{ color: "var(--v2-text-muted)" }}>
              {therapySearch ? `Nema terapija za "${therapySearch}"` : "Nema aktivnih terapija."}
            </p>
          ) : (
            filteredTherapies.map((t) => {
              const isSelected = selectedTherapies.some((s) => s.therapyId === t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTherapyToggle(t)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left border-b transition-colors hover:bg-[color:var(--v2-input-bg)] last:border-0"
                  style={{
                    borderColor: "var(--v2-border)",
                    background: isSelected ? "var(--v2-primary-bg)" : "var(--v2-surface)",
                  }}
                >
                  <span className="text-[13px]" style={{ color: isSelected ? "var(--v2-primary)" : "var(--v2-text)" }}>
                    {t.name}
                    <span className="ml-2 text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                      {t.category}
                    </span>
                  </span>
                  <span className="text-[12px] font-semibold ml-4 flex-shrink-0"
                    style={{ color: isSelected ? "var(--v2-primary)" : "var(--v2-text-muted)" }}>
                    {t.defaultPrice > 0 ? formatPrice(t.defaultPrice) : "0 RSD"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* MULTI: per-tooth breakdown */}
      {scope === "MULTI" && selectedTeeth.length > 0 && selectedTherapies.length > 0 && (
        <div
          className="flex flex-col gap-3 p-4 rounded-xl border"
          style={{ borderColor: "var(--v2-border)", background: "var(--v2-input-bg)" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
            Raspodela po zubima
          </p>
          <div className="flex flex-col gap-2">
            {selectedTeeth.map((tooth) => {
              const visibleTherapies = selectedTherapies.slice(0, 2);
              const overflow = selectedTherapies.length - 2;
              return (
                <div
                  key={tooth}
                  className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg"
                  style={{ background: "var(--v2-surface)" }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="text-[12px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
                    >
                      {tooth}
                    </span>
                    <div className="flex flex-wrap gap-1 min-w-0">
                      {visibleTherapies.map((t) => (
                        <span
                          key={t.therapyId}
                          className="text-[11px] px-2 py-0.5 rounded-md truncate max-w-[140px]"
                          style={{ background: "var(--v2-input-bg)", color: "var(--v2-text)" }}
                        >
                          {t.name}
                        </span>
                      ))}
                      {overflow > 0 && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-md flex-shrink-0"
                          style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}
                        >
                          +{overflow}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: "var(--v2-text-heading)" }}>
                    {formatPrice(basePrice)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Cena tretmana
        </label>

        {/* Auto cena info */}
        <div
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border"
          style={{ borderColor: "var(--v2-border)", background: "var(--v2-input-bg)" }}
        >
          <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
            {scope === "MULTI" && selectedTeeth.length > 0
              ? `${selectedTherapies.length} ter. × ${selectedTeeth.length} zuba = ${formatPrice(autoPrice)}`
              : `Suma terapija: ${formatPrice(autoPrice)}`}
          </span>
          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--v2-border)" }}>
            {(["auto", "manual", "percent"] as const).map((mode) => {
              const labels = { auto: "Auto", manual: "Ručno", percent: "%" };
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setPriceMode(mode);
                    if (mode === "manual") setPriceOverride(String(autoPrice));
                  }}
                  className="px-3 py-1.5 text-[11px] font-semibold transition-colors"
                  style={{
                    background: priceMode === mode ? "var(--v2-primary)" : "var(--v2-surface)",
                    color: priceMode === mode ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
                  }}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual override input */}
        {priceMode === "manual" && (
          <div className="relative">
            <input
              type="number"
              min={0}
              step={100}
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
              className="w-full pr-14 pl-4 py-2.5 rounded-xl border text-[15px] font-bold focus:outline-none"
              style={{
                background: "var(--v2-surface)",
                borderColor: "var(--v2-primary)",
                color: "var(--v2-text-heading)",
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold"
              style={{ color: "var(--v2-text-muted)" }}>
              RSD
            </span>
          </div>
        )}

        {/* Percent correction input + breakdown */}
        {priceMode === "percent" && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="number"
                step={1}
                placeholder="-10 ili +5"
                value={percentCorrection}
                onChange={(e) => setPercentCorrection(e.target.value)}
                className="w-full pr-8 pl-4 py-2.5 rounded-xl border text-[15px] font-bold focus:outline-none"
                style={{
                  background: "var(--v2-surface)",
                  borderColor: "var(--v2-primary)",
                  color: "var(--v2-text-heading)",
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold"
                style={{ color: "var(--v2-text-muted)" }}>
                %
              </span>
            </div>
            <div
              className="flex items-center justify-between text-[12px] px-3 py-2 rounded-xl"
              style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}
            >
              <span>Auto: <strong style={{ color: "var(--v2-text-heading)" }}>{formatPrice(autoPrice)}</strong></span>
              <span>→</span>
              <span>
                Korekcija: <strong style={{ color: percentCorrNum < 0 ? "#ef4444" : "#10b981" }}>
                  {percentCorrNum >= 0 ? "+" : ""}{percentCorrNum}%
                </strong>
              </span>
              <span>→</span>
              <span>
                Konačna: <strong style={{ color: "var(--v2-text-heading)" }}>{formatPrice(displayPrice)}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Final price read-only display for auto mode */}
        {priceMode === "auto" && (
          <div className="relative">
            <input
              type="number"
              readOnly
              value={autoPrice}
              className="w-full pr-14 pl-4 py-2.5 rounded-xl border text-[15px] font-bold focus:outline-none"
              style={{
                background: "var(--v2-input-bg)",
                borderColor: "var(--v2-border)",
                color: "var(--v2-text-heading)",
                cursor: "not-allowed",
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold"
              style={{ color: "var(--v2-text-muted)" }}>
              RSD
            </span>
          </div>
        )}
      </div>

      {/* Tehnika (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setTechOpen((o) => !o)}
          className="flex items-center gap-2 text-[13px] font-medium"
          style={{ color: "var(--v2-text-muted)" }}
        >
          <FlaskConical className="h-4 w-4" />
          Tehnika (opciono)
          {techOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {techOpen && (
          <div className="mt-3 flex flex-col gap-3">
            <select
              value={techId}
              onChange={(e) => setTechId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border text-[13px] focus:outline-none appearance-none"
              style={{ background: "var(--v2-input-bg)", borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
            >
              <option value="">Izaberite tehničara / lab...</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            {techId && (
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={100}
                  placeholder="Cena tehnike"
                  value={techCost}
                  onChange={(e) => setTechCost(e.target.value)}
                  className="w-full pr-14 pl-4 py-2.5 rounded-xl border text-[13px] focus:outline-none"
                  style={{ background: "var(--v2-input-bg)", borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px]"
                  style={{ color: "var(--v2-text-muted)" }}>
                  RSD
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--v2-text-muted)" }}>
          Napomena
          <span className="ml-1 normal-case text-[11px] font-normal">(opciono)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Dodatne napomene za ovaj tretman..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border text-[13px] resize-none focus:outline-none"
          style={{ background: "var(--v2-input-bg)", borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
        />
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border"
          style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
        >
          Odustani
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-[2] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
        >
          <Plus className="h-4 w-4" />
          {initial ? "Sačuvaj izmene" : "Dodaj tretman"}
        </button>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function CompleteAppointmentScreen({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const { appointments, completeAppointment } = useAppointments();

  const appt = appointments.find((a) => a.id === appointmentId) ?? null;

  const [apptType, setApptType]   = useState<ApptType>("STOMATOLOSKI");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [mkbCodes, setMkbCodes]   = useState<Mkb10Entry[]>([]);
  const [mkbError, setMkbError]   = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const therapies   = useMemo(() => loadTherapies(), []);
  const technicians = useMemo(() => loadTechnicians(), []);

  const totalPrice   = treatments.reduce((s, t) => s + t.totalPrice, 0);
  const tehnikaCost  = treatments.reduce((s, t) => s + (t.tech?.cost ?? 0), 0);
  const netoProfit   = totalPrice - tehnikaCost;

  const handleAddTreatment = (t: Treatment) => {
    setTreatments((prev) => [...prev, t]);
    setShowForm(false);
  };

  const handleEditTreatment = (t: Treatment) => {
    setTreatments((prev) => prev.map((x) => (x.id === t.id ? t : x)));
    setEditingId(null);
  };

  const handleDeleteTreatment = (id: string) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFinalize = () => {
    if (treatments.length === 0) return;
    if (mkbCodes.length === 0) {
      setMkbError(true);
      const el = document.getElementById("mkb-picker-section");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setMkbError(false);
    setSubmitting(true);
    completeAppointment(appointmentId, { apptType, treatments });
    setTimeout(() => {
      router.push("/ui-lab/figma-dashboard/calendar");
    }, 300);
  };

  if (!appt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-[16px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
            Termin nije pronađen
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-[13px]"
            style={{ color: "var(--v2-primary)" }}
          >
            Nazad
          </button>
        </div>
      </div>
    );
  }

  if (appt.status === "ZAVRSENO") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center flex flex-col items-center gap-3">
          <CheckCircle2 className="h-12 w-12" style={{ color: "#10b981" }} />
          <p className="text-[16px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
            Termin je već završen
          </p>
          <button
            onClick={() => router.push("/ui-lab/figma-dashboard/calendar")}
            className="text-[13px] mt-2"
            style={{ color: "var(--v2-primary)" }}
          >
            Nazad na kalendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--v2-bg)" }}>
      {/* Page header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-8 border-b"
        style={{
          height: "64px",
          background: "var(--v2-surface)",
          borderColor: "var(--v2-border)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full flex items-center justify-center border transition-colors hover:bg-[color:var(--v2-input-bg)]"
            style={{ borderColor: "var(--v2-border)" }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--v2-primary)" }}>
              Kalendar
            </p>
            <h1 className="font-bold text-[20px] leading-tight" style={{ color: "var(--v2-text-heading)" }}>
              Završi termin — {appt.patientName}
            </h1>
          </div>
        </div>

        {/* Appointment type segmented control */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: "var(--v2-input-bg)" }}
        >
          {(["STOMATOLOSKI", "ORTODONTSKI"] as ApptType[]).map((t) => (
            <button
              key={t}
              onClick={() => setApptType(t)}
              className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-all"
              style={{
                background: apptType === t ? "var(--v2-surface)" : "transparent",
                color: apptType === t ? "var(--v2-text-heading)" : "var(--v2-text-muted)",
                boxShadow: apptType === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t === "STOMATOLOSKI" ? "Stomatološki" : "Ortodontski"}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1100px] mx-auto px-8 py-8 flex gap-8">

        {/* Left: appointment info */}
        <div className="w-[340px] flex-shrink-0">
          <div className="sticky top-[80px] flex flex-col gap-4">
            <ApptInfoCard appt={appt} />

            {/* MKB Picker — sticky left panel */}
            <div
              id="mkb-picker-section"
              className="rounded-2xl border p-4 flex flex-col gap-3"
              style={{
                borderColor: mkbError ? "#ef4444" : "var(--v2-border)",
                background: "var(--v2-surface)",
                boxShadow: mkbError ? "0 0 0 2px rgba(239,68,68,0.15)" : "none",
              }}
            >
              <MkbPicker
                selected={mkbCodes}
                onChange={(v) => { setMkbCodes(v); if (v.length > 0) setMkbError(false); }}
                hasError={mkbError}
              />
              {mkbError && (
                <p className="flex items-center gap-1 text-[12px]" style={{ color: "#ef4444" }}>
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  Izaberite barem jednu MKB dijagnozu pre završetka.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: treatments */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Treatments section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[16px]" style={{ color: "var(--v2-text-heading)" }}>
                Tretmani
              </h2>
              {!showForm && !editingId && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
                >
                  <Plus className="h-4 w-4" />
                  Dodaj tretman
                </button>
              )}
            </div>

            {/* Add form */}
            {showForm && !editingId && (
              <TreatmentForm
                therapies={therapies}
                technicians={technicians}
                onSave={handleAddTreatment}
                onCancel={() => setShowForm(false)}
              />
            )}

            {/* Treatment list */}
            {treatments.length === 0 && !showForm ? (
              <div
                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-3"
                style={{ borderColor: "var(--v2-border)" }}
              >
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--v2-input-bg)" }}>
                  <Plus className="h-6 w-6" style={{ color: "var(--v2-text-muted)" }} />
                </div>
                <p className="text-[14px]" style={{ color: "var(--v2-text-muted)" }}>
                  Dodajte barem jedan tretman da biste završili termin.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {treatments.map((t) =>
                  editingId === t.id ? (
                    <TreatmentForm
                      key={t.id}
                      therapies={therapies}
                      technicians={technicians}
                      initial={t}
                      onSave={handleEditTreatment}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <TreatmentCard
                      key={t.id}
                      treatment={t}
                      onEdit={() => { setEditingId(t.id); setShowForm(false); }}
                      onDelete={() => handleDeleteTreatment(t.id)}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* Totals + finalize */}
          {treatments.length > 0 && !showForm && !editingId && (
            <div
              className="sticky bottom-6 rounded-2xl border p-5 flex items-center justify-between gap-4"
              style={{
                borderColor: "var(--v2-border)",
                background: "var(--v2-surface)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <div className="flex items-center gap-5 flex-wrap">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                    Tretmana
                  </p>
                  <p className="text-[20px] font-bold" style={{ color: "var(--v2-text-heading)" }}>
                    {treatments.length}
                  </p>
                </div>
                <div className="w-px h-10" style={{ background: "var(--v2-border)" }} />
                {tehnikaCost > 0 ? (
                  <>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                        Bruto
                      </p>
                      <p className="text-[20px] font-bold" style={{ color: "var(--v2-text-heading)" }}>
                        {formatPrice(totalPrice)}
                      </p>
                    </div>
                    <div className="w-px h-10" style={{ background: "var(--v2-border)" }} />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                        Tehnika
                      </p>
                      <p className="text-[20px] font-bold" style={{ color: "#f59e0b" }}>
                        -{formatPrice(tehnikaCost)}
                      </p>
                    </div>
                    <div className="w-px h-10" style={{ background: "var(--v2-border)" }} />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                        Neto prihod
                      </p>
                      <p className="text-[20px] font-bold" style={{ color: "#10b981" }}>
                        {formatPrice(netoProfit)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--v2-text-muted)" }}>
                      Ukupna cena
                    </p>
                    <p className="text-[20px] font-bold" style={{ color: "#10b981" }}>
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleFinalize}
                disabled={submitting}
                className="flex-shrink-0 flex items-center gap-2 px-8 py-3 rounded-[var(--v2-radius-pill)] text-[14px] font-bold hover:opacity-90 active:opacity-80 transition-opacity"
                style={{
                  background: submitting ? "var(--v2-text-muted)" : "#10b981",
                  color: "#ffffff",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                <CheckCircle2 className="h-5 w-5" />
                Završi i sačuvaj termin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
