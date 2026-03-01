// Figma base: Invoices Mobile — node-id=345:18086
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Plus, X, CreditCard, AlertTriangle, Pencil } from "lucide-react";
import {
  usePayments, UplataStatusBadge, NacinPlacanjaBadge,
  formatDate, formatRSD, todayIso,
  inputStyle, BottomSheetOverlay,
  type Uplata,
} from "../shared";

function UplataForm({ initial, onSave, onClose }: { initial?: Uplata | null; onSave: (d: Omit<Uplata, "id">) => void; onClose: () => void }) {
  const [pacijent, setPacijent] = useState(initial?.pacijent ?? "");
  const [datum, setDatum] = useState(initial?.datum ?? todayIso());
  const [iznos, setIznos] = useState(initial?.iznos?.toString() ?? "");
  const [nacin, setNacin] = useState<Uplata["nacinPlacanja"]>(initial?.nacinPlacanja);
  const [napomena, setNapomena] = useState(initial?.napomena ?? "");
  const [err, setErr] = useState("");

  const handleSave = () => {
    if (!pacijent.trim()) { setErr("Ime je obavezno."); return; }
    if (!iznos || Number(iznos) <= 0) { setErr("Iznos mora biti veći od 0."); return; }
    onSave({ pacijent: pacijent.trim(), datum, iznos: Number(iznos), nacinPlacanja: nacin, napomena: napomena || undefined, status: initial?.status ?? "evidentirana" });
  };

  return (
    <BottomSheetOverlay>
      <div className="flex items-center justify-between px-[20px] pt-[8px] pb-[12px] flex-shrink-0">
        <h2 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>{initial ? "Izmeni uplatu" : "Nova uplata"}</h2>
        <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
      </div>
      <div className="px-[20px] pb-[28px] flex flex-col gap-[14px]">
        {err && <p className="text-[12px] px-[10px] py-[7px] rounded-[8px]" style={{ background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
        <div><label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Pacijent *</label><input value={pacijent} onChange={e => setPacijent(e.target.value)} placeholder="Ime i prezime" style={inputStyle} /></div>
        <div className="grid grid-cols-2 gap-[10px]">
          <div><label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Datum</label><input type="date" value={datum} onChange={e => setDatum(e.target.value)} style={inputStyle} /></div>
          <div><label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Iznos (RSD) *</label><input type="number" min={0} value={iznos} onChange={e => setIznos(e.target.value)} placeholder="0" style={inputStyle} /></div>
        </div>
        <div>
          <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Način plaćanja</label>
          <div className="flex flex-wrap gap-[6px]">
            {(["gotovina", "kartica", "racun", "ostalo"] as Uplata["nacinPlacanja"][]).map(opt => (
              <button key={opt} onClick={() => setNacin(nacin === opt ? undefined : opt)} className="text-[12px] font-medium" style={{ padding: "7px 12px", borderRadius: "var(--v2-radius-pill)", background: nacin === opt ? "var(--v2-primary)" : "var(--v2-input-bg)", color: nacin === opt ? "var(--v2-primary-fg)" : "var(--v2-text-muted)" }}>
                {opt === "gotovina" ? "Gotovina" : opt === "kartica" ? "Kartica" : opt === "racun" ? "Račun" : "Ostalo"}
              </button>
            ))}
          </div>
        </div>
        <div><label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Napomena (opciono)</label><textarea value={napomena} onChange={e => setNapomena(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></div>
        <div className="flex gap-[10px]">
          <button onClick={onClose} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={handleSave} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>Sačuvaj</button>
        </div>
      </div>
    </BottomSheetOverlay>
  );
}

function StornoSheet({ uplata, onConfirm, onClose }: { uplata: Uplata; onConfirm: () => void; onClose: () => void }) {
  return (
    <BottomSheetOverlay onBackdrop={onClose}>
      <div className="flex flex-col gap-[16px] px-[20px] pb-[28px] pt-[12px]">
        <div className="flex items-start gap-[10px]">
          <div className="p-[8px] flex-shrink-0" style={{ borderRadius: "10px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[4px]" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>Storniranje uplate</h2>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>Uplata od <strong style={{ color: "var(--v2-text)" }}>{formatRSD(uplata.iznos)}</strong> biće stornirana.</p>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={onClose} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Storniraj</button>
        </div>
      </div>
    </BottomSheetOverlay>
  );
}

function DetailSheet({ uplata, onClose, onEdit, onStorno }: { uplata: Uplata; onClose: () => void; onEdit: (u: Uplata) => void; onStorno: (u: Uplata) => void }) {
  return (
    <BottomSheetOverlay onBackdrop={onClose}>
      <div className="flex items-center justify-between px-[20px] pt-[8px] pb-[12px] flex-shrink-0">
        <div>
          <p className="font-semibold" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{uplata.pacijent}</p>
          <div className="mt-[3px]"><UplataStatusBadge status={uplata.status} /></div>
        </div>
        <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
      </div>
      <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />
      <div className="px-[20px] py-[14px] flex flex-col gap-[8px]">
        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Detalji</p>
        {[{ label: "Datum", value: formatDate(uplata.datum) }, { label: "Iznos", value: formatRSD(uplata.iznos) }].map(({ label, value }) => (
          <div key={label} className="flex gap-[8px]">
            <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
          </div>
        ))}
        <div className="flex gap-[8px]">
          <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Plaćanje</span>
          <NacinPlacanjaBadge nacin={uplata.nacinPlacanja} />
        </div>
        {uplata.napomena && (
          <div className="flex gap-[8px]">
            <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Napomena</span>
            <span className="text-[12px]" style={{ color: "var(--v2-text)" }}>{uplata.napomena}</span>
          </div>
        )}
      </div>
      <div className="px-[20px] pb-[28px] pt-[4px] flex flex-col gap-[10px] flex-shrink-0" style={{ borderTop: "1px solid var(--v2-border)" }}>
        {uplata.status === "evidentirana" && (
          <button onClick={() => onEdit(uplata)} className="flex items-center justify-center gap-[6px] text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
            <Pencil className="h-4 w-4" /> Izmeni
          </button>
        )}
        {uplata.status !== "stornirana" && (
          <button onClick={() => onStorno(uplata)} className="flex items-center justify-center gap-[6px] text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>
            Storniraj uplatu
          </button>
        )}
      </div>
    </BottomSheetOverlay>
  );
}

export default function MobileUplate({ className }: { className?: string }) {
  const { payments, add, update, storno } = usePayments();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState<Uplata | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Uplata | null>(null);
  const [stornoTarget, setStornoTarget] = useState<Uplata | null>(null);

  const filtered = payments.filter(p => p.pacijent.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (u: Uplata) => { setEditTarget(u); setSelected(null); setFormOpen(true); };
  const handleSave = (data: Omit<Uplata, "id">) => {
    if (editTarget) { update(editTarget.id, data); } else { add(data); }
    setFormOpen(false);
  };
  const handleStorno = () => {
    if (!stornoTarget) return;
    storno(stornoTarget.id);
    setStornoTarget(null);
    setSelected(null);
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <header className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]" style={{ background: "var(--v2-surface)" }}>
        <div className="flex items-center gap-[8px]">
          <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="Odontoa" width={32} height={32} className="h-[32px] w-[32px] object-contain" />
          <h1 className="font-semibold" style={{ fontSize: "18px", color: "var(--v2-text)" }}>Uplate</h1>
        </div>
        <div className="flex items-center gap-[8px]">
          <button onClick={() => setSearchOpen(v => !v)} className="flex items-center justify-center" style={{ padding: "8px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
            <Search className="h-[18px] w-[18px]" style={{ color: "var(--v2-primary-dark)" }} />
          </button>
          <div className="flex items-center justify-center font-semibold text-[11px]" style={{ height: "32px", width: "32px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
        </div>
      </header>
      {searchOpen && (
        <div className="px-[16px] pb-[10px] flex-shrink-0" style={{ background: "var(--v2-surface)" }}>
          <div className="relative">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
            <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži uplate..." className="w-full pl-[36px] pr-[12px] py-[10px] text-[14px] focus:outline-none" style={{ background: "var(--v2-input-bg)", borderRadius: "var(--v2-radius-pill)", border: "none", color: "var(--v2-text)" }} />
          </div>
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[12px] rounded-t-[24px]" style={{ background: "var(--v2-bg)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[10px] py-[60px]">
            <CreditCard className="h-10 w-10" style={{ color: "var(--v2-border)" }} />
            <p className="font-medium" style={{ fontSize: "14px", color: "var(--v2-text)" }}>{search ? "Nema rezultata" : "Nema uplata"}</p>
          </div>
        ) : filtered.map(u => (
          <button key={u.id} onClick={() => setSelected(u)} className="w-full text-left flex items-start gap-[12px] px-[14px] py-[12px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", opacity: u.status === "stornirana" ? 0.6 : 1 }}>
            <div className="flex items-center justify-center font-bold text-[12px] flex-shrink-0" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
              {u.pacijent.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-[8px]">
                <span className="text-[14px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{u.pacijent}</span>
                <UplataStatusBadge status={u.status} />
              </div>
              <div className="flex items-center justify-between mt-[4px]">
                <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(u.datum)}</span>
                <span className="text-[13px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(u.iznos)}</span>
              </div>
            </div>
          </button>
        ))}
      </main>
      <button onClick={openAdd} className="fixed bottom-[24px] right-[20px] flex items-center justify-center z-30" style={{ height: "52px", width: "52px", borderRadius: "26px", background: "var(--v2-primary)", color: "var(--v2-primary-fg)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
        <Plus className="h-6 w-6" />
      </button>
      {selected && <DetailSheet uplata={selected} onClose={() => setSelected(null)} onEdit={openEdit} onStorno={u => { setSelected(null); setStornoTarget(u); }} />}
      {formOpen && <UplataForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />}
      {stornoTarget && <StornoSheet uplata={stornoTarget} onConfirm={handleStorno} onClose={() => setStornoTarget(null)} />}
    </div>
  );
}
