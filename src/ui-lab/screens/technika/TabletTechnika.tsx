// Figma base: Patients list Tablet — node-id=325:13070
"use client";

import { useState } from "react";
import {
  Search,
  Settings,
  Bell,
  Plus,
  X,
  Pencil,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { FigmaTabletSidebar } from "../figma-dashboard/sidebars";
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

function TabletTechTopbar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 pl-[4px]"
      style={{ height: "var(--v2-topbar-h)" }}
    >
      <h1 className="font-semibold leading-[1.2]" style={{ fontSize: "20px", color: "var(--v2-text)" }}>
        Tehnika
      </h1>
      <div className="flex items-center gap-[12px]">
        <button
          className="flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Search className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
        </button>
        <button
          className="flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Settings className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
        </button>
        <button
          className="relative flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}
        >
          <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
          <span className="absolute h-[8px] w-[8px] rounded-full" style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }} />
        </button>
        <div
          className="flex items-center justify-center font-semibold text-[12px]"
          style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
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
    padding: "9px 13px",
    width: "100%",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,11,19,0.45)" }}>
      <div className="flex flex-col gap-[20px] p-[24px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>
            {initial ? "Izmeni tehničara" : "Dodaj tehničara"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
        </div>
        <div className="flex flex-col gap-[14px]">
          <div>
            <label className="block text-[12px] mb-[5px]" style={{ color: "var(--v2-text-muted)" }}>Naziv *</label>
            <input value={naziv} onChange={(e) => setNaziv(e.target.value)} placeholder="Ime ili naziv laboratorije" style={inputStyle} />
            {err && <p className="mt-[4px] text-[11px]" style={{ color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
          </div>
          <div>
            <label className="block text-[12px] mb-[5px]" style={{ color: "var(--v2-text-muted)" }}>Telefon (opciono)</label>
            <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+381 11 000 0000" style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] mb-[5px]" style={{ color: "var(--v2-text-muted)" }}>Email (opciono)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.rs" type="email" style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] mb-[5px]" style={{ color: "var(--v2-text-muted)" }}>Napomena (opciono)</label>
            <textarea value={napomena} onChange={(e) => setNapomena(e.target.value)} rows={2} placeholder="Specijalizacija, napomene..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium transition-opacity hover:opacity-70" style={{ padding: "8px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button
            onClick={() => { if (!naziv.trim()) { setErr("Naziv je obavezan."); return; } onSave({ naziv, telefon, email, napomena }); }}
            className="text-[13px] font-medium transition-opacity hover:opacity-90"
            style={{ padding: "8px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,11,19,0.45)" }}>
      <div className="flex flex-col gap-[16px] p-[24px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "380px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start gap-[10px]">
          <div className="flex items-center justify-center flex-shrink-0 p-[8px]" style={{ borderRadius: "10px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[4px]" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>Deaktivacija tehničara</h2>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>
              <strong style={{ color: "var(--v2-text)" }}>{tech.naziv}</strong> će ostati u sistemu zbog istorije, ali neće biti dostupan za izbor u novim unosima.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="text-[13px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Deaktiviraj</button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail modal (tablet uses centered modal instead of panel) ───

function DetailModal({ tech, onClose, onEdit, onDeactivate, onReactivate }: {
  tech: Technician;
  onClose: () => void;
  onEdit: (t: Technician) => void;
  onDeactivate: (t: Technician) => void;
  onReactivate: (t: Technician) => void;
}) {
  const stats = SEED_STATS[tech.id];
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: "rgba(11,11,19,0.4)" }}>
      <div
        className="flex flex-col overflow-y-auto"
        style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "420px", maxHeight: "85vh", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-[10px] p-[16px] flex-shrink-0">
          <div className="flex items-center gap-[10px] min-w-0">
            <div
              className="flex items-center justify-center font-bold text-[13px] flex-shrink-0"
              style={{ height: "38px", width: "38px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
            >
              {getInitials(tech.naziv)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{tech.naziv}</p>
              <div className="mt-[3px]"><TechStatusBadge status={tech.status} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
        </div>

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

        {/* Contact */}
        <div className="p-[16px] flex flex-col gap-[8px]">
          <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Kontakt</p>
          {[{ label: "Telefon", v: tech.telefon }, { label: "Email", v: tech.email }, { label: "Napomena", v: tech.napomena }].map(({ label, v }) => (
            <div key={label} className="flex gap-[8px]">
              <span className="text-[12px] flex-shrink-0 w-[64px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
              <span className="text-[12px] break-words" style={{ color: v ? "var(--v2-text)" : "var(--v2-text-muted)" }}>{v || "—"}</span>
            </div>
          ))}
        </div>

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

        {/* Pregled rada */}
        <div className="p-[16px] flex flex-col gap-[10px]">
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
                  <div key={label} className="flex flex-col gap-[2px] p-[8px]" style={{ background: "var(--v2-input-bg)", borderRadius: "8px" }}>
                    <span className="text-[10px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                    <span className="font-semibold text-[12px]" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
                  </div>
                ))}
              </div>
              {stats.poslednjiRadovi.length > 0 && (
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[11px] font-medium" style={{ color: "var(--v2-text-muted)" }}>Poslednji radovi</p>
                  {stats.poslednjiRadovi.slice(0, 5).map((w) => (
                    <div key={w.id} className="flex flex-col gap-[3px] p-[8px]" style={{ background: "var(--v2-input-bg)", borderRadius: "8px" }}>
                      <div className="flex items-start justify-between gap-[6px]">
                        <span className="text-[12px] font-medium flex-1 min-w-0" style={{ color: "var(--v2-text)" }}>{w.pacijent}</span>
                        <WorkStatusBadge status={w.statusNaplate} />
                      </div>
                      <div className="flex items-center justify-between">
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

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

        {/* Actions */}
        <div className="p-[16px] flex gap-[10px] flex-shrink-0">
          <button
            onClick={() => onEdit(tech)}
            className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
          >
            <Pencil className="h-3.5 w-3.5" /> Izmeni
          </button>
          {tech.status === "aktivan" ? (
            <button
              onClick={() => onDeactivate(tech)}
              className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
              style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}
            >
              Deaktiviraj
            </button>
          ) : (
            <button
              onClick={() => onReactivate(tech)}
              className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
              style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-confirmed-bg)", color: "var(--v2-status-confirmed-fg)" }}
            >
              Aktiviraj
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main tablet layout ───────────────────────────────────

export default function TabletTechnika({ className }: { className?: string }) {
  const { technicians, add, update, deactivate, reactivate } = useTechnicians();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Technician | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Technician | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Technician | null>(null);

  const filtered = technicians.filter((t) => {
    const q = search.toLowerCase();
    return t.naziv.toLowerCase().includes(q) || (t.telefon ?? "").includes(q);
  });

  const stats = {
    ukupno: technicians.length,
    aktivni: technicians.filter((t) => t.status === "aktivan").length,
    neaktivni: technicians.filter((t) => t.status === "neaktivan").length,
  };

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
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaTabletSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <TabletTechTopbar />

        <main className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>

          {/* Stats — 3 equal cards */}
          <div className="grid grid-cols-3 gap-[16px]">
            {[
              { label: "Ukupno", value: stats.ukupno },
              { label: "Aktivni", value: stats.aktivni },
              { label: "Neaktivni", value: stats.neaktivni },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-[10px] px-[14px] py-[14px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
                <div className="flex items-center justify-center p-[8px]" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>
                  <Wrench className="h-4 w-4" style={{ color: "var(--v2-primary-fg)" }} />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                  <span className="font-bold" style={{ fontSize: "20px", color: "var(--v2-primary-dark)" }}>{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="flex flex-col" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-[10px] p-[14px]">
              <div className="relative flex-1">
                <Search className="absolute left-[10px] top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pretraži tehničare..."
                  className="pl-8 pr-[10px] py-[7px] text-[12px] focus:outline-none w-full"
                  style={{ background: "var(--v2-input-bg)", borderRadius: "16px", border: "none", color: "var(--v2-text)" }}
                />
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-[6px] text-[12px] font-medium flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
              >
                <Plus className="h-3.5 w-3.5" /> Dodaj
              </button>
            </div>

            {/* Table: Naziv | Status | Telefon */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "var(--v2-input-bg)" }}>
                    {["Naziv", "Status", "Telefon"].map((h, i) => (
                      <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-[40px] text-center">
                        <Wrench className="h-7 w-7 mx-auto mb-[6px]" style={{ color: "var(--v2-border)" }} />
                        <p className="text-[13px]" style={{ color: "var(--v2-text-muted)" }}>
                          {search ? "Nema rezultata" : "Nema tehničara"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tech) => (
                      <tr
                        key={tech.id}
                        onClick={() => setSelected(tech)}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: "1px solid var(--v2-border)",
                          opacity: tech.status === "neaktivan" ? 0.6 : 1,
                        }}
                      >
                        <td className="py-[12px] px-[12px]">
                          <div className="flex items-center gap-[8px]">
                            <div
                              className="flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                              style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
                            >
                              {getInitials(tech.naziv)}
                            </div>
                            <span className="text-[13px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{tech.naziv}</span>
                          </div>
                        </td>
                        <td className="py-[12px] px-[12px]"><TechStatusBadge status={tech.status} /></td>
                        <td className="py-[12px] px-[12px]">
                          <span className="text-[12px]" style={{ color: tech.telefon ? "var(--v2-text)" : "var(--v2-text-muted)" }}>
                            {tech.telefon || "—"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
            Copyright &copy; 2026 Odontoa
          </footer>
        </main>
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
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
