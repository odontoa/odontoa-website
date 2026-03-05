// Šabloni dokumenata — clinic template management screen.
// Desktop-only (follows existing Ordinacija screen pattern).
"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Copy, Trash2, Search, FileStack, Power } from "lucide-react";
import { FigmaDesktopSidebar } from "@/ui-lab/screens/figma-dashboard/sidebars";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import {
  getClinicTemplates,
  deleteTemplate,
  duplicateTemplate,
  toggleTemplateActive,
  createNewTemplate,
} from "@/ui-lab/lib/templatesStorage";
import { TemplateEditorDrawer } from "./TemplateEditorDrawer";
import type { ClinicTemplate, TemplateCategory } from "@/ui-lab/types/dokumenti";

// ─── Constants ────────────────────────────────────────────

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  opravdanja: "Opravdanja",
  potvrde:    "Potvrde",
  uputi:      "Uputi",
  ostalo:     "Ostalo",
};

// ─── Helpers ─────────────────────────────────────────────

function fmtRelative(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "malo pre";
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return d.toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit", year: "2-digit" });
  } catch {
    return "–";
  }
}

// ─── Main screen ─────────────────────────────────────────

interface Props {
  className?: string;
}

export default function OrdinacijaSabloniScreen({ className }: Props) {
  const [templates, setTemplates]   = useState<ClinicTemplate[]>([]);
  const [search, setSearch]         = useState("");
  const [editorTarget, setEditorTarget] = useState<ClinicTemplate | null | undefined>(undefined);
  // undefined = editor closed, null = create mode, ClinicTemplate = edit mode

  // Load from localStorage on mount
  useEffect(() => {
    setTemplates(getClinicTemplates());
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return templates;
    const q = search.toLowerCase();
    return templates.filter(t => t.name.toLowerCase().includes(q));
  }, [templates, search]);

  function handleEdit(t: ClinicTemplate) {
    setEditorTarget(t);
  }

  function handleNew() {
    setEditorTarget(null);
  }

  function handleDuplicate(id: string) {
    const copy = duplicateTemplate(id);
    setTemplates(prev => [...prev, copy]);
  }

  function handleDelete(id: string) {
    if (!confirm("Obrisati ovaj šablon?")) return;
    const next = deleteTemplate(id);
    setTemplates(next);
  }

  function handleToggleActive(id: string) {
    const next = toggleTemplateActive(id);
    setTemplates(next);
  }

  function handleEditorSaved(list: ClinicTemplate[]) {
    setTemplates(list);
  }

  const inputSt: React.CSSProperties = {
    padding: "8px 10px 8px 36px",
    borderRadius: "var(--v2-radius-pill)",
    border: "1px solid var(--v2-border)",
    background: "var(--v2-input-bg)",
    color: "var(--v2-text)",
    fontSize: "13px",
    outline: "none",
    width: "260px",
  };

  return (
    <div
      className={className ?? "flex h-full w-full"}
      style={{ background: "var(--v2-bg)", overflow: "hidden" }}
    >
      <FigmaDesktopSidebar />

      {/* Main column */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        {/* Topbar */}
        <V2PageHeader
          section="Ordinacija"
          title="Šabloni dokumenata"
          subtitle="Kreiraj i upravljaj šablonima za potvrde, opravdanja i upute."
          extraActions={
            <button
              onClick={handleNew}
              className="flex items-center gap-[6px] font-semibold text-[13px] hover:opacity-80 transition-opacity"
              style={{
                padding: "8px 16px",
                borderRadius: "var(--v2-radius-pill)",
                background: "var(--v2-primary)",
                color: "var(--v2-primary-fg)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus style={{ width: "15px", height: "15px" }} />
              Novi šablon
            </button>
          }
        />

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >

          {/* Search bar */}
          <div className="relative" style={{ alignSelf: "flex-start" }}>
            <Search
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "var(--v2-text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Pretraži šablone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={inputSt}
            />
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-[12px] py-[60px]"
              style={{ color: "var(--v2-text-muted)", textAlign: "center" }}
            >
              <FileStack style={{ width: "40px", height: "40px", opacity: 0.3 }} />
              <p style={{ fontSize: "15px", fontWeight: 600 }}>
                {templates.length === 0 ? "Nema šablona" : "Nema rezultata pretrage"}
              </p>
              {templates.length === 0 && (
                <p style={{ fontSize: "13px" }}>Klikni „Novi šablon" da kreiraš prvi šablon.</p>
              )}
            </div>
          ) : (
            <div
              className="rounded-[16px] overflow-hidden"
              style={{ border: "1px solid var(--v2-border)", background: "var(--v2-surface)" }}
            >
              {/* Table header */}
              <div
                className="grid px-[16px] py-[10px]"
                style={{
                  gridTemplateColumns: "1fr 120px 100px 120px 180px",
                  borderBottom: "1px solid var(--v2-border)",
                  background: "var(--v2-input-bg)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--v2-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                <span>Naziv</span>
                <span>Kategorija</span>
                <span>Status</span>
                <span>Ažurirano</span>
                <span style={{ textAlign: "right" }}>Akcije</span>
              </div>

              {/* Rows */}
              {filtered.map((t, i) => (
                <div
                  key={t.id}
                  className="grid px-[16px] py-[14px] items-center transition-colors hover:bg-[color-mix(in_srgb,var(--v2-primary-bg)_15%,transparent)]"
                  style={{
                    gridTemplateColumns: "1fr 120px 100px 120px 180px",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--v2-border)" : "none",
                  }}
                >
                  {/* Naziv */}
                  <div className="flex items-center gap-[8px] min-w-0">
                    <FileStack style={{ width: "15px", height: "15px", flexShrink: 0, color: "var(--v2-primary)" }} />
                    <span
                      className="font-medium truncate"
                      style={{ fontSize: "13px", color: "var(--v2-text-heading)" }}
                    >
                      {t.name}
                    </span>
                  </div>

                  {/* Kategorija */}
                  <span
                    className="text-[11px] font-medium px-[8px] py-[3px] rounded-full"
                    style={{
                      background: "var(--v2-primary-bg)",
                      color: "var(--v2-primary-dark)",
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    {CATEGORY_LABELS[t.category]}
                  </span>

                  {/* Status */}
                  <span
                    className="text-[11px] font-medium px-[8px] py-[3px] rounded-full"
                    style={{
                      background: t.isActive
                        ? "var(--v2-status-confirmed-bg)"
                        : "var(--v2-status-cancelled-bg)",
                      color: t.isActive
                        ? "var(--v2-status-confirmed-fg)"
                        : "var(--v2-status-cancelled-fg)",
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    {t.isActive ? "Aktivan" : "Neaktivan"}
                  </span>

                  {/* Ažurirano */}
                  <span style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
                    {fmtRelative(t.updatedAt)}
                  </span>

                  {/* Akcije */}
                  <div className="flex items-center gap-[6px] justify-end">
                    <ActionBtn
                      icon={<Pencil style={{ width: "13px", height: "13px" }} />}
                      title="Uredi"
                      onClick={() => handleEdit(t)}
                    />
                    <ActionBtn
                      icon={<Copy style={{ width: "13px", height: "13px" }} />}
                      title="Dupliraj"
                      onClick={() => handleDuplicate(t.id)}
                    />
                    <ActionBtn
                      icon={<Power style={{ width: "13px", height: "13px" }} />}
                      title={t.isActive ? "Deaktiviraj" : "Aktiviraj"}
                      onClick={() => handleToggleActive(t.id)}
                      active={!t.isActive}
                    />
                    <ActionBtn
                      icon={<Trash2 style={{ width: "13px", height: "13px" }} />}
                      title="Obriši"
                      onClick={() => handleDelete(t.id)}
                      danger
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Count footer */}
          {templates.length > 0 && (
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>
              {templates.length} {templates.length === 1 ? "šablon" : "šablona"} ukupno
              {search && ` · ${filtered.length} prikazano`}
            </p>
          )}

        </div>
      </div>

      {/* Editor drawer */}
      {editorTarget !== undefined && (
        <TemplateEditorDrawer
          template={editorTarget}
          onClose={() => setEditorTarget(undefined)}
          onSaved={handleEditorSaved}
        />
      )}

    </div>
  );
}

// ─── Action button ────────────────────────────────────────

function ActionBtn({
  icon,
  title,
  onClick,
  danger,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex items-center justify-center transition-opacity hover:opacity-70"
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "8px",
        background: danger
          ? "var(--v2-status-cancelled-bg)"
          : active
            ? "var(--v2-primary-bg)"
            : "var(--v2-input-bg)",
        color: danger
          ? "var(--v2-status-cancelled-fg)"
          : active
            ? "var(--v2-primary)"
            : "var(--v2-text-muted)",
        border: "none",
        cursor: "pointer",
      }}
    >
      {icon}
    </button>
  );
}
