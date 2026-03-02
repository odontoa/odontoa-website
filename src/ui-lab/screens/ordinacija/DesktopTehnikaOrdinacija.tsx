"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FlaskConical,
  Phone,
  FileText,
  Check,
} from "lucide-react";
import { FigmaDesktopSidebar } from "../figma-dashboard/sidebars";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import { loadTechnicians, saveTechnicians } from "@/lib/ui-lab/clinic-store";
import type { Technician } from "@/lib/ui-lab/types";

function genId() {
  return `tech-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Inline form ──────────────────────────────────────────

type FormState = { name: string; phone: string; note: string };
const EMPTY_FORM: FormState = { name: "", phone: "", note: "" };

function TechForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FormState;
  onSave: (f: FormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial ?? EMPTY_FORM);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name.trim()) { setError("Naziv je obavezan."); return; }
    onSave(form);
  };

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: "var(--v2-primary)", background: "var(--v2-surface)", boxShadow: "0 0 0 3px var(--v2-primary-bg)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[14px]" style={{ color: "var(--v2-text-heading)" }}>
          {initial ? "Izmeni tehničara / lab" : "Dodaj tehničara / lab"}
        </h3>
        <button onClick={onCancel} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[color:var(--v2-input-bg)]">
          <X className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
            Naziv <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="npr. Dental Lab Beograd"
            value={form.name}
            onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setError(""); }}
            className="h-10 px-3 rounded-lg border text-[13px] focus:outline-none"
            style={{
              background: "var(--v2-input-bg)",
              borderColor: error ? "#ef4444" : "var(--v2-border)",
              color: "var(--v2-text)",
            }}
          />
          {error && <p className="text-[11px]" style={{ color: "#ef4444" }}>{error}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
            Telefon
            <span className="ml-1 font-normal text-[11px]" style={{ color: "var(--v2-text-muted)" }}>(opciono)</span>
          </label>
          <input
            type="tel"
            placeholder="+381 11 000 0000"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="h-10 px-3 rounded-lg border text-[13px] focus:outline-none"
            style={{ background: "var(--v2-input-bg)", borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>
          Napomena
          <span className="ml-1 font-normal text-[11px]" style={{ color: "var(--v2-text-muted)" }}>(opciono)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Npr. Metalokeramika, krunice, CAD/CAM..."
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          className="px-3 py-2 rounded-lg border text-[13px] resize-none focus:outline-none"
          style={{ background: "var(--v2-input-bg)", borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-medium border"
          style={{ borderColor: "var(--v2-border)", color: "var(--v2-text)" }}
        >
          Odustani
        </button>
        <button
          onClick={handleSubmit}
          className="flex-[2] h-10 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold flex items-center justify-center gap-2 hover:opacity-90"
          style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
        >
          <Check className="h-4 w-4" />
          {initial ? "Sačuvaj izmene" : "Dodaj"}
        </button>
      </div>
    </div>
  );
}

// ─── Technician card ──────────────────────────────────────

function TechCard({
  tech,
  onEdit,
  onDelete,
}: {
  tech: Technician;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
      style={{ borderColor: "var(--v2-border)", background: "var(--v2-surface)" }}
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--v2-primary-bg)" }}
      >
        <FlaskConical className="h-5 w-5" style={{ color: "var(--v2-primary)" }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px]" style={{ color: "var(--v2-text-heading)" }}>{tech.name}</p>
        {tech.phone && (
          <div className="flex items-center gap-1.5 mt-1">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--v2-text-muted)" }} />
            <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{tech.phone}</p>
          </div>
        )}
        {tech.note && (
          <div className="flex items-start gap-1.5 mt-1">
            <FileText className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--v2-text-muted)" }} />
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--v2-text-muted)" }}>{tech.note}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--v2-input-bg)]"
          title="Izmeni"
        >
          <Pencil className="h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
        </button>
        <button
          onClick={onDelete}
          className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
          title="Obriši"
        >
          <Trash2 className="h-3.5 w-3.5" style={{ color: "#ef4444" }} />
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────

export default function DesktopTehnikaOrdinacija({ className }: { className?: string }) {
  const [technicians, setTechnicians] = useState<Technician[]>(() => loadTechnicians());
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const persist = (updated: Technician[]) => {
    setTechnicians(updated);
    saveTechnicians(updated);
  };

  const handleAdd = (form: FormState) => {
    persist([...technicians, { id: genId(), name: form.name, phone: form.phone || undefined, note: form.note || undefined }]);
    setShowForm(false);
  };

  const handleSaveEdit = (id: string, form: FormState) => {
    persist(technicians.map((t) => t.id === id ? { ...t, name: form.name, phone: form.phone || undefined, note: form.note || undefined } : t));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    persist(technicians.filter((t) => t.id !== id));
  };

  const filtered = search.trim()
    ? technicians.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.note ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : technicians;

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}>

        <V2PageHeader
          section="Ordinacija"
          title="Tehničari i laboratorije"
          centerSearch={{ value: search, onChange: setSearch, placeholder: "Pretraži...", width: 240 }}
          extraActions={
            <button
              onClick={() => { setShowForm(true); setEditingId(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold hover:opacity-90 transition-opacity"
              style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
            >
              <Plus className="h-4 w-4" />
              Dodaj
            </button>
          }
        />

        <main className="flex-1 overflow-hidden rounded-[24px] flex flex-col" style={{ background: "var(--v2-bg)" }}>
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {showForm && !editingId && (
              <TechForm
                onSave={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            )}

            {filtered.length === 0 && !showForm ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <FlaskConical className="h-8 w-8" style={{ color: "var(--v2-text-muted)" }} />
                <p className="text-[14px]" style={{ color: "var(--v2-text-muted)" }}>
                  {search ? `Nema rezultata za "${search}"` : "Nema tehničara. Dodajte prvog."}
                </p>
              </div>
            ) : (
              filtered.map((tech) =>
                editingId === tech.id ? (
                  <TechForm
                    key={tech.id}
                    initial={{ name: tech.name, phone: tech.phone ?? "", note: tech.note ?? "" }}
                    onSave={(form) => handleSaveEdit(tech.id, form)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <TechCard
                    key={tech.id}
                    tech={tech}
                    onEdit={() => { setEditingId(tech.id); setShowForm(false); }}
                    onDelete={() => handleDelete(tech.id)}
                  />
                )
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
