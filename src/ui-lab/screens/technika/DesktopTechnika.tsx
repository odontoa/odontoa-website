// Figma base: Patients list — node-id=56:5743
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Settings,
  Bell,
  Plus,
  X,
  Pencil,
  MoreHorizontal,
  ChevronDown,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { FigmaDesktopSidebar } from "../figma-dashboard/sidebars";
import {
  useTechnicians,
  TechStatusBadge,
  WorkStatusBadge,
  SEED_STATS,
  getInitials,
  formatDate,
  formatRSD,
  type Technician,
} from "./shared";

// ─── Topbar ──────────────────────────────────────────────

function TechTopbar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 pl-[4px]"
      style={{ height: "var(--v2-topbar-h)" }}
    >
      <div className="flex flex-col justify-center flex-shrink-0 py-[2px]" style={{ width: "340px" }}>
        <h1 className="font-semibold leading-[1.2]" style={{ fontSize: "22px", color: "var(--v2-text)" }}>
          Tehnika
        </h1>
      </div>

      <div className="flex items-center gap-[12px] flex-shrink-0">
        <div className="relative flex-shrink-0">
          <Search
            className="absolute left-[13px] top-1/2 -translate-y-1/2 h-[18px] w-[18px]"
            style={{ color: "var(--v2-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Pretraga"
            className="pl-[37px] pr-[13px] py-[9px] text-[14px] focus:outline-none placeholder:text-[var(--v2-text-muted)]"
            style={{
              width: "330px",
              background: "var(--v2-input-bg)",
              borderRadius: "var(--v2-radius-pill)",
              border: "none",
              color: "var(--v2-text)",
            }}
          />
        </div>

        <button
          className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Settings className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
        </button>

        <button
          className="relative flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
          <span
            className="absolute h-[8px] w-[8px] rounded-full"
            style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }}
          />
        </button>

        <div className="flex items-center gap-[12px] flex-shrink-0">
          <div
            className="flex items-center justify-center font-semibold flex-shrink-0 text-[12px]"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "var(--v2-radius-avatar)",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            MM
          </div>
          <div className="hidden sm:flex flex-col gap-[2px]">
            <div className="font-bold leading-[1.2]" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
              Dr Marko Marković
            </div>
            <div className="leading-[1.3]" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
              Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Stat card ───────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  const iconEl = icon === "total"
    ? <Wrench className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} />
    : icon === "active"
    ? <div className="h-[10px] w-[10px] rounded-full" style={{ background: "var(--v2-primary-fg)" }} />
    : <div className="h-[10px] w-[10px] rounded-full border-2" style={{ borderColor: "var(--v2-primary-fg)" }} />;

  return (
    <div
      className="flex items-center gap-[12px] px-[14px] py-[16px]"
      style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}
    >
      <div
        className="flex items-center justify-center p-[10px] flex-shrink-0"
        style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}
      >
        {iconEl}
      </div>
      <div className="flex flex-col gap-[4px]">
        <span className="text-[11px] leading-[1.24]" style={{ color: "var(--v2-text-muted)" }}>
          {label}
        </span>
        <span className="font-bold leading-[1.1]" style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}>
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Add / Edit form modal ────────────────────────────────

interface FormState {
  naziv: string;
  telefon: string;
  email: string;
  napomena: string;
}

function TechForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Technician | null;
  onSave: (data: FormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    naziv: initial?.naziv ?? "",
    telefon: initial?.telefon ?? "",
    email: initial?.email ?? "",
    napomena: initial?.napomena ?? "",
  });
  const [error, setError] = useState("");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.naziv.trim()) { setError("Naziv je obavezan."); return; }
    onSave(form);
  };

  const inputStyle = {
    background: "var(--v2-input-bg)",
    border: "1px solid var(--v2-border)",
    borderRadius: "10px",
    color: "var(--v2-text)",
    fontSize: "14px",
    padding: "9px 13px",
    width: "100%",
    outline: "none",
  } as React.CSSProperties;

  const labelStyle = { fontSize: "12px", color: "var(--v2-text-muted)", marginBottom: "6px", display: "block" } as React.CSSProperties;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,11,19,0.4)" }}
    >
      <div
        className="flex flex-col gap-[20px] p-[28px]"
        style={{
          background: "var(--v2-surface)",
          borderRadius: "var(--v2-radius-card)",
          width: "440px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
            {initial ? "Izmeni tehničara" : "Dodaj tehničara"}
          </h2>
          <button onClick={onClose} className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div>
            <label style={labelStyle}>Naziv *</label>
            <input
              value={form.naziv}
              onChange={set("naziv")}
              placeholder="Ime i prezime ili naziv laboratorije"
              style={inputStyle}
            />
            {error && <p className="mt-[4px] text-[12px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{error}</p>}
          </div>
          <div>
            <label style={labelStyle}>Telefon (opciono)</label>
            <input value={form.telefon} onChange={set("telefon")} placeholder="+381 11 000 0000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email (opciono)</label>
            <input value={form.email} onChange={set("email")} placeholder="tehnicar@example.rs" type="email" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Napomena (opciono)</label>
            <textarea
              value={form.napomena}
              onChange={set("napomena")}
              placeholder="Specijalizacija, napomene..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-[12px]">
          <button
            onClick={onClose}
            className="text-[14px] font-medium transition-opacity hover:opacity-70"
            style={{
              padding: "9px 18px",
              borderRadius: "var(--v2-radius-pill)",
              background: "var(--v2-input-bg)",
              color: "var(--v2-text-muted)",
            }}
          >
            Otkaži
          </button>
          <button
            onClick={handleSave}
            className="text-[14px] font-medium transition-opacity hover:opacity-90"
            style={{
              padding: "9px 18px",
              borderRadius: "var(--v2-radius-pill)",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Deactivate confirm modal ────────────────────────────

function DeactivateConfirm({
  tech,
  onConfirm,
  onClose,
}: {
  tech: Technician;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,11,19,0.4)" }}
    >
      <div
        className="flex flex-col gap-[20px] p-[28px]"
        style={{
          background: "var(--v2-surface)",
          borderRadius: "var(--v2-radius-card)",
          width: "420px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-start gap-[12px]">
          <div
            className="flex items-center justify-center flex-shrink-0 p-[10px]"
            style={{ borderRadius: "12px", background: "var(--v2-status-cancelled-bg)" }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[6px]" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
              Deaktivacija tehničara
            </h2>
            <p className="leading-[1.5]" style={{ fontSize: "13px", color: "var(--v2-text-muted)" }}>
              <strong style={{ color: "var(--v2-text)" }}>{tech.naziv}</strong> će ostati u sistemu zbog istorije, ali neće biti dostupan za izbor u novim unosima.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-[12px]">
          <button
            onClick={onClose}
            className="text-[14px] font-medium transition-opacity hover:opacity-70"
            style={{
              padding: "9px 18px",
              borderRadius: "var(--v2-radius-pill)",
              background: "var(--v2-input-bg)",
              color: "var(--v2-text-muted)",
            }}
          >
            Otkaži
          </button>
          <button
            onClick={onConfirm}
            className="text-[14px] font-medium transition-opacity hover:opacity-90"
            style={{
              padding: "9px 18px",
              borderRadius: "var(--v2-radius-pill)",
              background: "var(--v2-status-cancelled-bg)",
              color: "var(--v2-status-cancelled-fg)",
            }}
          >
            Deaktiviraj
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────

function DetailPanel({
  tech,
  onClose,
  onEdit,
  onDeactivate,
  onReactivate,
}: {
  tech: Technician;
  onClose: () => void;
  onEdit: (t: Technician) => void;
  onDeactivate: (t: Technician) => void;
  onReactivate: (t: Technician) => void;
}) {
  const stats = SEED_STATS[tech.id];
  const initials = getInitials(tech.naziv);

  return (
    <div
      className="flex-shrink-0 flex flex-col overflow-y-auto"
      style={{
        width: "340px",
        background: "var(--v2-surface)",
        borderRadius: "var(--v2-radius-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-[12px] p-[16px] flex-shrink-0">
        <div className="flex items-center gap-[10px] min-w-0">
          <div
            className="flex items-center justify-center font-bold text-[14px] flex-shrink-0"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "var(--v2-radius-avatar)",
              background: tech.status === "aktivan" ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
              color: "var(--v2-primary-dark)",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-[1.2] truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>
              {tech.naziv}
            </p>
            <div className="mt-[4px]">
              <TechStatusBadge status={tech.status} />
            </div>
          </div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)", marginTop: "2px" }}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Contact info */}
      <div className="p-[16px] flex flex-col gap-[10px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>
          Kontakt
        </p>
        {[
          { label: "Telefon", value: tech.telefon },
          { label: "Email",   value: tech.email },
          { label: "Napomena", value: tech.napomena },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start gap-[8px]">
            <span className="text-[12px] flex-shrink-0 w-[64px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
            <span className="text-[12px] break-words min-w-0 flex-1" style={{ color: value ? "var(--v2-text)" : "var(--v2-text-muted)" }}>
              {value || "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Pregled rada — issue #27 */}
      <div className="p-[16px] flex flex-col gap-[12px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>
          Pregled rada
        </p>

        {stats ? (
          <>
            {/* 2×2 stats grid */}
            <div className="grid grid-cols-2 gap-[8px]">
              {[
                { label: "Broj radova",    value: String(stats.brojRadova) },
                { label: "Ukupan dug",     value: formatRSD(stats.ukupanDug) },
                { label: "Plaćeno do",     value: formatDate(stats.placenoDo) },
                { label: "Poslednji rad",  value: formatDate(stats.poslednjiRad) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-[2px] p-[10px]"
                  style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}
                >
                  <span className="text-[10px] leading-[1.3]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                  <span className="font-semibold leading-[1.2] text-[13px] break-words" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Poslednji radovi list */}
            {stats.poslednjiRadovi.length > 0 && (
              <div className="flex flex-col gap-[6px]">
                <p className="text-[11px] font-medium" style={{ color: "var(--v2-text-muted)" }}>
                  Poslednji radovi
                </p>
                {stats.poslednjiRadovi.slice(0, 5).map((w) => (
                  <div
                    key={w.id}
                    className="flex flex-col gap-[4px] p-[10px]"
                    style={{
                      background: "var(--v2-input-bg)",
                      borderRadius: "10px",
                      opacity: tech.status === "neaktivan" ? 0.8 : 1,
                    }}
                  >
                    <div className="flex items-start justify-between gap-[6px]">
                      <span className="text-[12px] font-medium leading-[1.25] flex-1 min-w-0" style={{ color: "var(--v2-text)" }}>
                        {w.pacijent}
                      </span>
                      <WorkStatusBadge status={w.statusNaplate} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{w.vrstaRada}</span>
                      <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(w.datum)}</span>
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: "var(--v2-primary-dark)" }}>
                      {formatRSD(w.iznos)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className="p-[12px] text-center"
            style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}
          >
            <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
              Nema podataka o radovima.
            </p>
          </div>
        )}
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Action buttons */}
      <div className="p-[16px] flex items-center gap-[10px] flex-shrink-0">
        <button
          onClick={() => onEdit(tech)}
          className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{
            padding: "9px 14px",
            borderRadius: "var(--v2-radius-pill)",
            background: "var(--v2-primary-bg)",
            color: "var(--v2-primary-dark)",
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
          Izmeni
        </button>
        {tech.status === "aktivan" ? (
          <button
            onClick={() => onDeactivate(tech)}
            className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{
              padding: "9px 14px",
              borderRadius: "var(--v2-radius-pill)",
              background: "var(--v2-status-cancelled-bg)",
              color: "var(--v2-status-cancelled-fg)",
            }}
          >
            Deaktiviraj
          </button>
        ) : (
          <button
            onClick={() => onReactivate(tech)}
            className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{
              padding: "9px 14px",
              borderRadius: "var(--v2-radius-pill)",
              background: "var(--v2-status-confirmed-bg)",
              color: "var(--v2-status-confirmed-fg)",
            }}
          >
            Aktiviraj
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────

export default function DesktopTechnika({ className }: { className?: string }) {
  const { technicians, add, update, deactivate, reactivate } = useTechnicians();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Technician | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Technician | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Technician | null>(null);

  const filtered = technicians.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.naziv.toLowerCase().includes(q) ||
      (t.telefon ?? "").includes(q) ||
      (t.email ?? "").toLowerCase().includes(q)
    );
  });

  const stats = {
    ukupno: technicians.length,
    aktivni: technicians.filter((t) => t.status === "aktivan").length,
    neaktivni: technicians.filter((t) => t.status === "neaktivan").length,
  };

  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (t: Technician) => { setEditTarget(t); setFormOpen(true); };

  const handleFormSave = (data: { naziv: string; telefon: string; email: string; napomena: string }) => {
    if (editTarget) {
      update(editTarget.id, data);
      if (selected?.id === editTarget.id) setSelected((prev) => prev ? { ...prev, ...data } : null);
    } else {
      add(data);
    }
    setFormOpen(false);
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    deactivate(deactivateTarget.id);
    if (selected?.id === deactivateTarget.id) setSelected((prev) => prev ? { ...prev, status: "neaktivan" } : null);
    setDeactivateTarget(null);
  };

  const handleReactivate = (tech: Technician) => {
    reactivate(tech.id);
    if (selected?.id === tech.id) setSelected((prev) => prev ? { ...prev, status: "aktivan" } : null);
  };

  return (
    <div
      className={`flex h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaDesktopSidebar />

      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <TechTopbar />

        {/* Gray body panel — flex-row so table + detail sit side by side */}
        <div
          className="flex-1 overflow-hidden p-[20px] flex gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >
          {/* Left: stats + table */}
          <div className="flex-1 flex flex-col gap-[20px] overflow-y-auto min-w-0">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-[20px]">
              <StatCard label="Ukupno tehničara" value={stats.ukupno}    icon="total"    />
              <StatCard label="Aktivni"           value={stats.aktivni}   icon="active"   />
              <StatCard label="Neaktivni"         value={stats.neaktivni} icon="inactive" />
            </div>

            {/* Table card */}
            <div
              className="flex flex-col"
              style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-[12px] p-[16px]">
                <div className="relative">
                  <Search
                    className="absolute left-[10px] top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                    style={{ color: "var(--v2-text-muted)" }}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pretraži tehničare..."
                    className="pl-8 pr-[10px] py-[7px] text-[12px] focus:outline-none"
                    style={{
                      width: "224px",
                      background: "var(--v2-input-bg)",
                      borderRadius: "18px",
                      border: "none",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>

                <button
                  onClick={openAdd}
                  className="flex items-center gap-[6px] text-[12px] font-medium transition-opacity hover:opacity-90 flex-shrink-0"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--v2-radius-pill)",
                    background: "var(--v2-primary)",
                    color: "var(--v2-primary-fg)",
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Dodaj tehničara
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--v2-input-bg)" }}>
                      {["Naziv", "Telefon", "Email", "Status", ""].map((h, i) => (
                        <th
                          key={i}
                          className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]"
                          style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-[48px] text-center">
                          <div className="flex flex-col items-center gap-[8px]">
                            <Wrench className="h-8 w-8" style={{ color: "var(--v2-border)" }} />
                            <p className="font-medium" style={{ fontSize: "14px", color: "var(--v2-text)" }}>
                              {search ? "Nema rezultata pretrage" : "Nema tehničara"}
                            </p>
                            {!search && (
                              <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", maxWidth: "340px" }}>
                                Dodaj prvog tehničara da bi mogao da ga koristiš u laboratorijskim radovima i istoriji pacijenata.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((tech) => {
                        const isSelected = selected?.id === tech.id;
                        const isInactive = tech.status === "neaktivan";
                        return (
                          <tr
                            key={tech.id}
                            onClick={() => setSelected(isSelected ? null : tech)}
                            className="cursor-pointer transition-colors"
                            style={{
                              borderBottom: "1px solid var(--v2-border)",
                              background: isSelected ? "var(--v2-primary-bg)" : "transparent",
                              opacity: isInactive ? 0.6 : 1,
                            }}
                          >
                            {/* Naziv */}
                            <td className="py-[12px] px-[12px]">
                              <div className="flex items-center gap-[8px]">
                                <div
                                  className="flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                  style={{
                                    height: "28px",
                                    width: "28px",
                                    borderRadius: "14px",
                                    background: isInactive ? "var(--v2-input-bg)" : "var(--v2-primary-bg)",
                                    color: "var(--v2-primary-dark)",
                                  }}
                                >
                                  {getInitials(tech.naziv)}
                                </div>
                                <span className="text-[13px] font-medium" style={{ color: "var(--v2-text)" }}>
                                  {tech.naziv}
                                </span>
                              </div>
                            </td>
                            {/* Telefon */}
                            <td className="py-[12px] px-[12px]">
                              <span className="text-[12px]" style={{ color: tech.telefon ? "var(--v2-text)" : "var(--v2-text-muted)" }}>
                                {tech.telefon || "—"}
                              </span>
                            </td>
                            {/* Email */}
                            <td className="py-[12px] px-[12px]">
                              <span className="text-[12px]" style={{ color: tech.email ? "var(--v2-text)" : "var(--v2-text-muted)" }}>
                                {tech.email || "—"}
                              </span>
                            </td>
                            {/* Status */}
                            <td className="py-[12px] px-[12px]">
                              <TechStatusBadge status={tech.status} />
                            </td>
                            {/* Row action */}
                            <td className="py-[12px] px-[12px]">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEdit(tech); }}
                                className="transition-opacity hover:opacity-60"
                                style={{ color: "var(--v2-text-muted)" }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              {filtered.length > 0 && (
                <div
                  className="flex items-center justify-between px-[16px] py-[10px]"
                  style={{ borderTop: "1px solid var(--v2-border)" }}
                >
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                    {filtered.length} {filtered.length === 1 ? "tehničar" : "tehničara"}
                    {search && ` · pretraga: "${search}"`}
                  </span>
                  <button
                    className="flex items-center gap-[4px] text-[10px] font-medium"
                    style={{ color: "var(--v2-text-muted)" }}
                  >
                    10 <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
              Copyright &copy; 2026 Odontoa &middot;{" "}
              <span className="hover:opacity-80 cursor-pointer">Politika privatnosti</span>{" "}
              &middot;{" "}
              <span className="hover:opacity-80 cursor-pointer">Uslovi korišćenja</span>{" "}
              &middot;{" "}
              <span className="hover:opacity-80 cursor-pointer">Kontakt</span>
            </footer>
          </div>

          {/* Right: detail panel */}
          {selected && (
            <DetailPanel
              tech={selected}
              onClose={() => setSelected(null)}
              onEdit={openEdit}
              onDeactivate={(t) => setDeactivateTarget(t)}
              onReactivate={handleReactivate}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {formOpen && (
        <TechForm
          initial={editTarget}
          onSave={handleFormSave}
          onClose={() => setFormOpen(false)}
        />
      )}
      {deactivateTarget && (
        <DeactivateConfirm
          tech={deactivateTarget}
          onConfirm={handleDeactivate}
          onClose={() => setDeactivateTarget(null)}
        />
      )}
    </div>
  );
}
