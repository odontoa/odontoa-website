// Figma base: Invoices — node-id=63:12897
"use client";

import { useState } from "react";
import {
  Search, Plus, X, Pencil, MoreHorizontal,
  ChevronDown, FileText, AlertTriangle, Trash2, Eye, Download,
} from "lucide-react";
import { FigmaDesktopSidebar } from "../../figma-dashboard/sidebars";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import { ConfirmDialog } from "@/ui-lab/components/ui/ConfirmDialog";
import {
  useProformas, PredracunStatusBadge,
  calcMedjuzbir, calcPopustAmount, calcUkupno,
  formatDate, formatRSD, getInitials, newStavka, todayIso,
  inputStyle, labelStyle, ModalOverlay,
  type Predracun, type PredracunStavka, type PredracunPopust,
} from "../shared";

// ─── Predračun form (create / edit) ──────────────────────

interface FormProps {
  initial?: Predracun | null;
  onSave: (data: Omit<Predracun, "id">) => void;
  onClose: () => void;
}

function PredForm({ initial, onSave, onClose }: FormProps) {
  const [pacijent, setPacijent] = useState(initial?.pacijent ?? "");
  const [datum, setDatum] = useState(initial?.datum ?? todayIso());
  const [stavke, setStavke] = useState<PredracunStavka[]>(initial?.stavke?.length ? initial.stavke : [newStavka()]);
  const [hasPopust, setHasPopust] = useState(!!initial?.popust);
  const [popustType, setPopustType] = useState<PredracunPopust["type"]>(initial?.popust?.type ?? "procenat");
  const [popustValue, setPopustValue] = useState(initial?.popust?.value?.toString() ?? "");
  const [err, setErr] = useState("");

  const popust: PredracunPopust | undefined = hasPopust && popustValue ? { type: popustType, value: Number(popustValue) } : undefined;
  const medjuzbir = calcMedjuzbir(stavke);
  const popustAmount = calcPopustAmount(medjuzbir, popust);
  const ukupno = Math.max(0, medjuzbir - popustAmount);

  const addStavka = () => setStavke(p => [...p, newStavka()]);
  const updStavka = (id: string, ch: Partial<PredracunStavka>) => setStavke(p => p.map(s => s.id === id ? { ...s, ...ch } : s));
  const remStavka = (id: string) => setStavke(p => p.filter(s => s.id !== id));

  const handleSave = () => {
    if (!pacijent.trim()) { setErr("Ime pacijenta je obavezno."); return; }
    const validStavke = stavke.filter(s => s.naziv.trim() && s.cena > 0);
    if (!validStavke.length) { setErr("Dodaj bar jednu stavku sa nazivom i cenom."); return; }
    onSave({ pacijent: pacijent.trim(), datum, status: initial?.status ?? "draft", stavke: validStavke, popust });
  };

  return (
    <ModalOverlay>
      <div
        className="flex flex-col gap-[20px] p-[28px] overflow-y-auto"
        style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "560px", maxHeight: "90vh", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}
      >
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>
            {initial ? "Izmeni predračun" : "Novi predračun"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
        </div>

        {err && (
          <p className="text-[12px] px-[12px] py-[8px] rounded-[8px]" style={{ background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>{err}</p>
        )}

        <div className="grid grid-cols-2 gap-[14px]">
          <div className="col-span-2">
            <label style={labelStyle}>Pacijent *</label>
            <input value={pacijent} onChange={e => setPacijent(e.target.value)} placeholder="Ime i prezime pacijenta" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Datum</label>
            <input type="date" value={datum} onChange={e => setDatum(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Stavke */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium" style={{ color: "var(--v2-text-muted)" }}>Stavke *</label>
            <button
              onClick={addStavka}
              className="flex items-center gap-[4px] text-[11px] font-medium transition-opacity hover:opacity-80"
              style={{ padding: "5px 10px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
            >
              <Plus className="h-3 w-3" /> Dodaj stavku
            </button>
          </div>

          {stavke.map((s) => (
            <div key={s.id} className="flex flex-col gap-[8px] p-[12px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
              <div className="flex items-center gap-[8px]">
                <input
                  value={s.naziv}
                  onChange={e => updStavka(s.id, { naziv: e.target.value })}
                  placeholder="Naziv usluge"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={() => remStavka(s.id)} style={{ color: "var(--v2-text-muted)", flexShrink: 0 }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-[8px]">
                <div>
                  <label className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Količina</label>
                  <input
                    type="number" min={1} value={s.poZubu ? "" : s.kolicina}
                    onChange={e => updStavka(s.id, { kolicina: Math.max(1, Number(e.target.value)) })}
                    disabled={!!s.poZubu}
                    style={{ ...inputStyle, fontSize: "13px", padding: "7px 10px", opacity: s.poZubu ? 0.4 : 1 }}
                  />
                </div>
                <div>
                  <label className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Cena (RSD)</label>
                  <input
                    type="number" min={0} value={s.cena || ""}
                    onChange={e => updStavka(s.id, { cena: Math.max(0, Number(e.target.value)) })}
                    style={{ ...inputStyle, fontSize: "13px", padding: "7px 10px" }}
                  />
                </div>
                <div>
                  <label className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Po zubu?</label>
                  <div className="flex items-center gap-[6px] mt-[8px]">
                    <input
                      type="checkbox" checked={!!s.poZubu}
                      onChange={e => updStavka(s.id, { poZubu: e.target.checked, brojZuba: e.target.checked ? (s.brojZuba ?? 1) : undefined })}
                    />
                    {s.poZubu && (
                      <input
                        type="number" min={1} value={s.brojZuba ?? 1}
                        onChange={e => updStavka(s.id, { brojZuba: Math.max(1, Number(e.target.value)) })}
                        placeholder="Br. zuba"
                        style={{ ...inputStyle, width: "60px", fontSize: "12px", padding: "5px 8px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px]" style={{ color: "var(--v2-text-muted)" }}>
                Iznos: <strong style={{ color: "var(--v2-primary-dark)" }}>
                  {formatRSD((s.poZubu && s.brojZuba ? s.brojZuba : s.kolicina) * s.cena)}
                </strong>
              </div>
            </div>
          ))}
        </div>

        {/* Popust */}
        <div className="flex flex-col gap-[10px]">
          <label className="flex items-center gap-[8px] cursor-pointer">
            <input type="checkbox" checked={hasPopust} onChange={e => setHasPopust(e.target.checked)} />
            <span className="text-[13px] font-medium" style={{ color: "var(--v2-text)" }}>Dodaj popust</span>
          </label>
          {hasPopust && (
            <div className="flex items-center gap-[10px]">
              <div className="flex items-center gap-[6px]">
                {(["procenat", "iznos"] as PredracunPopust["type"][]).map(t => (
                  <button
                    key={t}
                    onClick={() => setPopustType(t)}
                    className="text-[12px] font-medium transition-colors"
                    style={{
                      padding: "6px 12px", borderRadius: "var(--v2-radius-pill)",
                      background: popustType === t ? "var(--v2-primary)" : "var(--v2-input-bg)",
                      color: popustType === t ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
                    }}
                  >
                    {t === "procenat" ? "%" : "RSD"}
                  </button>
                ))}
              </div>
              <input
                type="number" min={0} value={popustValue}
                onChange={e => setPopustValue(e.target.value)}
                placeholder={popustType === "procenat" ? "npr. 10" : "iznos"}
                style={{ ...inputStyle, width: "120px" }}
              />
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-[6px] p-[14px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "var(--v2-text-muted)" }}>Međuzbir</span>
            <span style={{ color: "var(--v2-text)" }}>{formatRSD(medjuzbir)}</span>
          </div>
          {popust && popustAmount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span style={{ color: "var(--v2-text-muted)" }}>Popust ({popust.type === "procenat" ? `${popust.value}%` : "iznos"})</span>
              <span style={{ color: "var(--v2-status-cancelled-fg)" }}>−{formatRSD(popustAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-[4px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
            <span style={{ color: "var(--v2-text)" }}>Ukupno</span>
            <span style={{ color: "var(--v2-primary-dark)", fontSize: "15px" }}>{formatRSD(ukupno)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-[10px] flex-shrink-0">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={handleSave} className="text-[13px] font-medium transition-opacity hover:opacity-90" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>Sačuvaj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Storno confirm ───────────────────────────────────────

function StornoConfirm({ pred, onConfirm, onClose }: { pred: Predracun; onConfirm: () => void; onClose: () => void }) {
  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[20px] p-[28px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start gap-[12px]">
          <div className="flex items-center justify-center flex-shrink-0 p-[10px]" style={{ borderRadius: "12px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-5 w-5" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[6px]" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>Storniranje predračuna</h2>
            <p style={{ fontSize: "13px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>
              Predračun za pacijenta <strong style={{ color: "var(--v2-text)" }}>{pred.pacijent}</strong> biće označen kao storniran. Ova akcija se ne može poništiti.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="text-[13px] font-medium" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Storniraj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Detail panel ─────────────────────────────────────────

function DetailPanel({ pred, onClose, onEdit, onConfirmFinal, onStorno, onDelete }: {
  pred: Predracun;
  onClose: () => void;
  onEdit: (p: Predracun) => void;
  onConfirmFinal: (p: Predracun) => void;
  onStorno: (p: Predracun) => void;
  onDelete: (p: Predracun) => void;
}) {
  const medjuzbir = calcMedjuzbir(pred.stavke);
  const popustAmount = calcPopustAmount(medjuzbir, pred.popust);
  const ukupno = calcUkupno(pred.stavke, pred.popust);
  const initials = getInitials(pred.pacijent);
  const isLocked = pred.status !== "draft";

  return (
    <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{ width: "340px", background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-[12px] p-[16px] flex-shrink-0">
        <div className="flex items-center gap-[10px] min-w-0">
          <div
            className="flex items-center justify-center font-bold text-[14px] flex-shrink-0"
            style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-[1.2] truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{pred.pacijent}</p>
            <div className="mt-[4px] flex items-center gap-[6px]">
              <PredracunStatusBadge status={pred.status} />
            </div>
          </div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)", marginTop: "2px" }}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Meta */}
      <div className="p-[16px] flex flex-col gap-[8px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Detalji</p>
        {[
          { label: "Datum", value: formatDate(pred.datum) },
          { label: "Br. stavki", value: String(pred.stavke.length) },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start gap-[8px]">
            <span className="text-[12px] w-[72px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
            <span className="text-[12px]" style={{ color: "var(--v2-text)" }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Stavke */}
      <div className="p-[16px] flex flex-col gap-[8px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Stavke</p>
        {pred.stavke.map(s => {
          const qty = s.poZubu && s.brojZuba ? s.brojZuba : s.kolicina;
          return (
            <div key={s.id} className="flex items-start justify-between gap-[6px] p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "8px" }}>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium leading-[1.3]" style={{ color: "var(--v2-text)" }}>{s.naziv}</p>
                <p className="text-[11px] mt-[2px]" style={{ color: "var(--v2-text-muted)" }}>
                  {qty > 1 ? `${qty} × ` : ""}{formatRSD(s.cena)}
                  {s.poZubu ? ` · ${s.brojZuba} zuba` : ""}
                </p>
              </div>
              <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(qty * s.cena)}</span>
            </div>
          );
        })}
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Summary */}
      <div className="p-[16px] flex flex-col gap-[6px]">
        <div className="flex justify-between text-[13px]">
          <span style={{ color: "var(--v2-text-muted)" }}>Međuzbir</span>
          <span style={{ color: "var(--v2-text)" }}>{formatRSD(medjuzbir)}</span>
        </div>
        {pred.popust && popustAmount > 0 && (
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "var(--v2-text-muted)" }}>
              Popust ({pred.popust.type === "procenat" ? `${pred.popust.value}%` : "iznos"})
            </span>
            <span style={{ color: "var(--v2-status-cancelled-fg)" }}>−{formatRSD(popustAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold mt-[4px] pt-[4px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
          <span style={{ color: "var(--v2-text)" }}>Ukupno</span>
          <span style={{ color: "var(--v2-primary-dark)", fontSize: "15px" }}>{formatRSD(ukupno)}</span>
        </div>
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      {/* Actions */}
      <div className="p-[16px] flex flex-col gap-[8px] flex-shrink-0">
        {/* Print actions */}
        <div className="flex gap-[6px]">
          <button
            disabled={!pred.id}
            onClick={() => window.open(`/ui-lab/finansije/predracun/${pred.id}/print`, "_blank", "noopener,noreferrer")}
            className="flex-1 flex items-center justify-center gap-[5px] text-[12px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ padding: "8px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)" }}
          >
            <Eye className="h-3.5 w-3.5" /> Pregled
          </button>
          <button
            disabled={!pred.id}
            onClick={() => window.open(`/ui-lab/finansije/predracun/${pred.id}/print?autoprint=1`, "_blank", "noopener,noreferrer")}
            className="flex-1 flex items-center justify-center gap-[5px] text-[12px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ padding: "8px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)" }}
          >
            <Download className="h-3.5 w-3.5" /> Preuzmi PDF
          </button>
        </div>
        <div className="h-px" style={{ background: "var(--v2-border)" }} />
        {!isLocked && (
          <button
            onClick={() => onEdit(pred)}
            className="w-full flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}
          >
            <Pencil className="h-3.5 w-3.5" /> Izmeni nacrt
          </button>
        )}
        {pred.status === "draft" && (
          <button
            onClick={() => onConfirmFinal(pred)}
            className="w-full flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-90"
            style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
          >
            Potvrdi kao finalan
          </button>
        )}
        {pred.status !== "storniran" && (
          <button
            onClick={() => onStorno(pred)}
            className="w-full flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}
          >
            Storniraj
          </button>
        )}
        {pred.status === "draft" && (
          <button
            onClick={() => onDelete(pred)}
            className="w-full flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "transparent", color: "var(--v2-status-cancelled-fg)", border: "1px solid var(--v2-status-cancelled-bg)" }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Obriši nacrt
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main desktop layout ──────────────────────────────────

export default function DesktopPredracun({ className }: { className?: string }) {
  const { proformas, add, update, confirmFinal, storno, remove } = useProformas();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Predracun | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Predracun | null>(null);
  const [stornoTarget, setStornoTarget] = useState<Predracun | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Predracun | null>(null);

  const filtered = proformas.filter(p => {
    const q = search.toLowerCase();
    return p.pacijent.toLowerCase().includes(q);
  });

  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (p: Predracun) => { setEditTarget(p); setFormOpen(true); };

  const handleSave = (data: Omit<Predracun, "id">) => {
    if (editTarget) {
      update(editTarget.id, data);
      setSelected(prev => prev?.id === editTarget.id ? { ...prev, ...data } : prev);
    } else {
      add(data);
    }
    setFormOpen(false);
  };

  const handleConfirmFinal = (p: Predracun) => {
    confirmFinal(p.id);
    setSelected(prev => prev?.id === p.id ? { ...prev, status: "final" } : prev);
  };

  const handleStorno = () => {
    if (!stornoTarget) return;
    storno(stornoTarget.id);
    setSelected(prev => prev?.id === stornoTarget.id ? { ...prev, status: "storniran" } : prev);
    setStornoTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    if (selected?.id === deleteTarget.id) setSelected(null);
    setDeleteTarget(null);
  };

  const stats = {
    ukupno: proformas.length,
    draft: proformas.filter(p => p.status === "draft").length,
    final: proformas.filter(p => p.status === "final").length,
  };

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <V2PageHeader
          section="Finansije"
          title="Predračun"
          extraActions={
            <button
              onClick={openAdd}
              className="flex items-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-90"
              style={{ padding: "9px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
            >
              <Plus className="h-4 w-4" /> Kreiraj predračun
            </button>
          }
        />

        <div className="flex-1 overflow-hidden p-[20px] flex gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <div className="flex-1 flex flex-col gap-[20px] overflow-y-auto min-w-0">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-[20px]">
              {[
                { label: "Ukupno predračuna", value: stats.ukupno, icon: <FileText className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} /> },
                { label: "Nacrti", value: stats.draft, icon: <div className="h-[10px] w-[10px] rounded-full" style={{ background: "var(--v2-primary-fg)" }} /> },
                { label: "Finalni", value: stats.final, icon: <div className="h-[10px] w-[10px] rounded-full border-2" style={{ borderColor: "var(--v2-primary-fg)" }} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-[12px] px-[14px] py-[16px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
                  <div className="flex items-center justify-center p-[10px]" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>{icon}</div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                    <span className="font-bold" style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Table card */}
            <div className="flex flex-col" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-[12px] p-[16px]">
                <div className="relative">
                  <Search className="absolute left-[10px] top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                  <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Pretraži predračune..."
                    className="pl-8 pr-[10px] py-[7px] text-[12px] focus:outline-none"
                    style={{ width: "224px", background: "var(--v2-input-bg)", borderRadius: "18px", border: "none", color: "var(--v2-text)" }}
                  />
                </div>
                <button className="flex items-center gap-[4px] text-[11px] font-medium" style={{ padding: "7px 12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
                  Status <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--v2-input-bg)" }}>
                      {["Pacijent", "Datum", "Status", "Ukupno", ""].map((h, i) => (
                        <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} className="py-[48px] text-center">
                        <FileText className="h-8 w-8 mx-auto mb-[8px]" style={{ color: "var(--v2-border)" }} />
                        <p className="font-medium" style={{ fontSize: "14px", color: "var(--v2-text)" }}>
                          {search ? "Nema rezultata pretrage" : "Nema predračuna"}
                        </p>
                      </td></tr>
                    ) : filtered.map(pred => {
                      const isSelected = selected?.id === pred.id;
                      return (
                        <tr
                          key={pred.id}
                          onClick={() => setSelected(isSelected ? null : pred)}
                          className="cursor-pointer transition-colors"
                          style={{ borderBottom: "1px solid var(--v2-border)", background: isSelected ? "var(--v2-primary-bg)" : "transparent", opacity: pred.status === "storniran" ? 0.55 : 1 }}
                        >
                          <td className="py-[12px] px-[12px]">
                            <div className="flex items-center gap-[8px]">
                              <div className="flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
                                {getInitials(pred.pacijent)}
                              </div>
                              <span className="text-[13px] font-medium" style={{ color: "var(--v2-text)" }}>{pred.pacijent}</span>
                            </div>
                          </td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(pred.datum)}</span></td>
                          <td className="py-[12px] px-[12px]"><PredracunStatusBadge status={pred.status} /></td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(calcUkupno(pred.stavke, pred.popust))}</span></td>
                          <td className="py-[12px] px-[12px]">
                            <button onClick={e => { e.stopPropagation(); openEdit(pred); }} disabled={pred.status !== "draft"} style={{ color: "var(--v2-text-muted)", opacity: pred.status !== "draft" ? 0.3 : 1 }}>
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length > 0 && (
                <div className="flex items-center justify-between px-[16px] py-[10px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{filtered.length} predračun{filtered.length !== 1 ? "a" : ""}{search && ` · "${search}"`}</span>
                  <button className="flex items-center gap-[4px] text-[10px] font-medium" style={{ color: "var(--v2-text-muted)" }}>10 <ChevronDown className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
              Copyright &copy; 2026 Odontoa
            </footer>
          </div>

          {selected && (
            <DetailPanel
              pred={selected}
              onClose={() => setSelected(null)}
              onEdit={openEdit}
              onConfirmFinal={handleConfirmFinal}
              onStorno={p => setStornoTarget(p)}
              onDelete={p => setDeleteTarget(p)}
            />
          )}
        </div>
      </div>

      {formOpen && <PredForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />}
      {stornoTarget && <StornoConfirm pred={stornoTarget} onConfirm={handleStorno} onClose={() => setStornoTarget(null)} />}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Brisanje nacrta predračuna"
        message={`Da li ste sigurni da želite da obrišete nacrt predračuna za "${deleteTarget?.pacijent ?? ""}"?`}
        confirmLabel="Obriši"
        cancelLabel="Otkaži"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
