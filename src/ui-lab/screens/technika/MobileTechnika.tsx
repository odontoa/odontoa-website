// Figma base: Patients list Mobile — node-id=325:13563
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Plus, X, Pencil, Wrench, AlertTriangle } from "lucide-react";
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

// ─── Mobile navbar ────────────────────────────────────────

function MobileNavbar({ onSearch }: { onSearch: () => void }) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]"
      style={{ background: "var(--v2-surface)" }}
    >
      <div className="flex items-center gap-[8px]">
        <Image
          src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
          alt="Odontoa"
          width={32}
          height={32}
          className="h-[32px] w-[32px] object-contain"
        />
        <h1 className="font-semibold leading-[1.2]" style={{ fontSize: "18px", color: "var(--v2-text)" }}>
          Tehnika
        </h1>
      </div>
      <div className="flex items-center gap-[8px]">
        <button
          onClick={onSearch}
          className="flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "8px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Search className="h-[18px] w-[18px]" style={{ color: "var(--v2-primary-dark)" }} />
        </button>
        <div
          className="flex items-center justify-center font-semibold text-[11px]"
          style={{ height: "32px", width: "32px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
        >
          MM
        </div>
      </div>
    </header>
  );
}

// ─── Form modal ──────────────────────────────────────────

function TechForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Technician | null;
  onSave: (d: { naziv: string; telefon: string; email: string; napomena: string }) => void;
  onClose: () => void;
}) {
  const [naziv, setNaziv] = useState(initial?.naziv ?? "");
  const [telefon, setTelefon] = useState(initial?.telefon ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [napomena, setNapomena] = useState(initial?.napomena ?? "");
  const [err, setErr] = useState("");

  const inputStyle = {
    background: "var(--v2-input-bg)",
    border: "1px solid var(--v2-border)",
    borderRadius: "10px",
    color: "var(--v2-text)",
    fontSize: "14px",
    padding: "10px 13px",
    width: "100%",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(11,11,19,0.5)" }}>
      <div
        className="flex flex-col gap-[20px] p-[24px] w-full"
        style={{
          background: "var(--v2-surface)",
          borderRadius: "20px 20px 0 0",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
            {initial ? "Izmeni tehničara" : "Dodaj tehničara"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-col gap-[14px]">
          <div>
            <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Naziv *</label>
            <input value={naziv} onChange={(e) => setNaziv(e.target.value)} placeholder="Ime ili naziv laboratorije" style={inputStyle} />
            {err && <p className="mt-[4px] text-[11px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
          </div>
          <div>
            <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Telefon (opciono)</label>
            <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+381 11 000 0000" style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Email (opciono)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.rs" type="email" style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Napomena (opciono)</label>
            <textarea value={napomena} onChange={(e) => setNapomena(e.target.value)} rows={3} placeholder="Specijalizacija, napomene..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={onClose} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button
            onClick={() => { if (!naziv.trim()) { setErr("Naziv je obavezan."); return; } onSave({ naziv, telefon, email, napomena }); }}
            className="flex-1 text-[14px] font-medium"
            style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
          >
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Deactivate confirm ───────────────────────────────────

function DeactivateConfirm({ tech, onConfirm, onClose }: { tech: Technician; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(11,11,19,0.5)" }}>
      <div className="flex flex-col gap-[16px] p-[24px] w-full" style={{ background: "var(--v2-surface)", borderRadius: "20px 20px 0 0" }}>
        <div className="flex items-start gap-[10px]">
          <div className="flex-shrink-0 p-[8px]" style={{ borderRadius: "10px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[4px]" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>Deaktivacija tehničara</h2>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>
              <strong style={{ color: "var(--v2-text)" }}>{tech.naziv}</strong> će ostati u sistemu zbog istorije, ali neće biti dostupan za izbor u novim unosima.
            </p>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={onClose} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Deaktiviraj</button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail bottom sheet ─────────────────────────────────

function DetailSheet({ tech, onClose, onEdit, onDeactivate, onReactivate }: {
  tech: Technician;
  onClose: () => void;
  onEdit: (t: Technician) => void;
  onDeactivate: (t: Technician) => void;
  onReactivate: (t: Technician) => void;
}) {
  const stats = SEED_STATS[tech.id];
  return (
    <div className="fixed inset-0 z-40 flex items-end" style={{ background: "rgba(11,11,19,0.45)" }} onClick={onClose}>
      <div
        className="w-full flex flex-col overflow-y-auto"
        style={{ background: "var(--v2-surface)", borderRadius: "20px 20px 0 0", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-[12px] pb-[4px] flex-shrink-0">
          <div className="rounded-full" style={{ width: "40px", height: "4px", background: "var(--v2-border)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-[20px] pt-[8px] pb-[12px] flex-shrink-0">
          <div className="flex items-center gap-[10px] min-w-0">
            <div
              className="flex items-center justify-center font-bold text-[13px] flex-shrink-0"
              style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: tech.status === "aktivan" ? "var(--v2-primary-bg)" : "var(--v2-input-bg)", color: "var(--v2-primary-dark)" }}
            >
              {getInitials(tech.naziv)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{tech.naziv}</p>
              <div className="mt-[3px]"><TechStatusBadge status={tech.status} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
        </div>

        <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />

        {/* Contact */}
        <div className="px-[20px] py-[14px] flex flex-col gap-[8px]">
          <p className="text-[10px] font-medium uppercase tracking-wide mb-[2px]" style={{ color: "var(--v2-text-muted)" }}>Kontakt</p>
          {[{ label: "Telefon", v: tech.telefon }, { label: "Email", v: tech.email }, { label: "Napomena", v: tech.napomena }].map(({ label, v }) => (
            <div key={label} className="flex gap-[8px]">
              <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
              <span className="text-[12px] break-words" style={{ color: v ? "var(--v2-text)" : "var(--v2-text-muted)" }}>{v || "—"}</span>
            </div>
          ))}
        </div>

        <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />

        {/* Pregled rada */}
        <div className="px-[20px] py-[14px] flex flex-col gap-[10px]">
          <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Pregled rada</p>
          {stats ? (
            <>
              <div className="grid grid-cols-2 gap-[8px]">
                {[
                  { label: "Broj radova",   value: String(stats.brojRadova) },
                  { label: "Ukupan dug",    value: formatRSD(stats.ukupanDug) },
                  { label: "Plaćeno do",    value: formatDate(stats.placenoDo) },
                  { label: "Poslednji rad", value: formatDate(stats.poslednjiRad) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-[2px] p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
                    <span className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                    <span className="font-semibold text-[13px] break-words" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
                  </div>
                ))}
              </div>
              {stats.poslednjiRadovi.length > 0 && (
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[11px] font-medium" style={{ color: "var(--v2-text-muted)" }}>Poslednji radovi</p>
                  {stats.poslednjiRadovi.slice(0, 5).map((w) => (
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
              )}
            </>
          ) : (
            <p className="text-[12px] text-center py-[8px]" style={{ color: "var(--v2-text-muted)" }}>Nema podataka o radovima.</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-[20px] pb-[28px] pt-[4px] flex gap-[10px] flex-shrink-0" style={{ borderTop: "1px solid var(--v2-border)" }}>
          <button
            onClick={() => onEdit(tech)}
            className="flex-1 flex items-center justify-center gap-[6px] text-[14px] font-medium"
            style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
          >
            <Pencil className="h-4 w-4" /> Izmeni
          </button>
          {tech.status === "aktivan" ? (
            <button
              onClick={() => onDeactivate(tech)}
              className="flex-1 flex items-center justify-center gap-[6px] text-[14px] font-medium"
              style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}
            >
              Deaktiviraj
            </button>
          ) : (
            <button
              onClick={() => onReactivate(tech)}
              className="flex-1 flex items-center justify-center gap-[6px] text-[14px] font-medium"
              style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-confirmed-bg)", color: "var(--v2-status-confirmed-fg)" }}
            >
              Aktiviraj
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main mobile layout ───────────────────────────────────

export default function MobileTechnika({ className }: { className?: string }) {
  const { technicians, add, update, deactivate, reactivate } = useTechnicians();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState<Technician | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Technician | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Technician | null>(null);

  const filtered = technicians.filter((t) => {
    const q = search.toLowerCase();
    return t.naziv.toLowerCase().includes(q) || (t.telefon ?? "").includes(q) || (t.email ?? "").toLowerCase().includes(q);
  });

  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (t: Technician) => { setEditTarget(t); setSelected(null); setFormOpen(true); };

  const handleSave = (data: { naziv: string; telefon: string; email: string; napomena: string }) => {
    if (editTarget) { update(editTarget.id, data); } else { add(data); }
    setFormOpen(false);
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    deactivate(deactivateTarget.id);
    if (selected?.id === deactivateTarget.id) setSelected((p) => p ? { ...p, status: "neaktivan" } : null);
    setDeactivateTarget(null);
  };

  const handleReactivate = (tech: Technician) => {
    reactivate(tech.id);
    if (selected?.id === tech.id) setSelected((p) => p ? { ...p, status: "aktivan" } : null);
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <MobileNavbar onSearch={() => setSearchOpen((v) => !v)} />

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="px-[16px] pb-[10px] flex-shrink-0" style={{ background: "var(--v2-surface)" }}>
          <div className="relative">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži tehničare..."
              className="w-full pl-[36px] pr-[12px] py-[10px] text-[14px] focus:outline-none"
              style={{ background: "var(--v2-input-bg)", borderRadius: "var(--v2-radius-pill)", border: "none", color: "var(--v2-text)" }}
            />
          </div>
        </div>
      )}

      {/* Body */}
      <main
        className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[12px] rounded-t-[24px]"
        style={{ background: "var(--v2-bg)" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[10px] py-[60px]">
            <Wrench className="h-10 w-10" style={{ color: "var(--v2-border)" }} />
            <p className="font-medium text-center" style={{ fontSize: "14px", color: "var(--v2-text)" }}>
              {search ? "Nema rezultata pretrage" : "Nema tehničara"}
            </p>
            {!search && (
              <p className="text-center" style={{ fontSize: "12px", color: "var(--v2-text-muted)", maxWidth: "280px", lineHeight: "1.5" }}>
                Dodaj prvog tehničara da bi mogao da ga koristiš u laboratorijskim radovima i istoriji pacijenata.
              </p>
            )}
          </div>
        ) : (
          filtered.map((tech) => {
            const secondary = tech.telefon || tech.email;
            return (
              <button
                key={tech.id}
                onClick={() => setSelected(tech)}
                className="w-full text-left flex items-center gap-[12px] px-[14px] py-[12px] transition-colors"
                style={{
                  background: "var(--v2-surface)",
                  borderRadius: "var(--v2-radius-card)",
                  opacity: tech.status === "neaktivan" ? 0.65 : 1,
                }}
              >
                <div
                  className="flex items-center justify-center font-bold text-[12px] flex-shrink-0"
                  style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "var(--v2-radius-avatar)",
                    background: tech.status === "aktivan" ? "var(--v2-primary-bg)" : "var(--v2-input-bg)",
                    color: "var(--v2-primary-dark)",
                  }}
                >
                  {getInitials(tech.naziv)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[8px] justify-between">
                    <span className="text-[14px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{tech.naziv}</span>
                    <TechStatusBadge status={tech.status} />
                  </div>
                  {secondary && (
                    <p className="text-[12px] mt-[2px] truncate" style={{ color: "var(--v2-text-muted)" }}>
                      {secondary}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </main>

      {/* FAB — add button */}
      <button
        onClick={openAdd}
        className="fixed bottom-[24px] right-[20px] flex items-center justify-center z-30 transition-opacity hover:opacity-90"
        style={{
          height: "52px",
          width: "52px",
          borderRadius: "26px",
          background: "var(--v2-primary)",
          color: "var(--v2-primary-fg)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Overlays */}
      {selected && (
        <DetailSheet
          tech={selected}
          onClose={() => setSelected(null)}
          onEdit={openEdit}
          onDeactivate={(t) => { setSelected(null); setDeactivateTarget(t); }}
          onReactivate={handleReactivate}
        />
      )}
      {formOpen && (
        <TechForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />
      )}
      {deactivateTarget && (
        <DeactivateConfirm tech={deactivateTarget} onConfirm={handleDeactivate} onClose={() => setDeactivateTarget(null)} />
      )}
    </div>
  );
}
