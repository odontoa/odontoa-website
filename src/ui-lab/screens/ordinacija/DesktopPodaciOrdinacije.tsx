"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Image as ImageIcon,
  FileText,
  StickyNote,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  Save,
} from "lucide-react";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import { FigmaDesktopSidebar } from "../figma-dashboard/sidebars";
import {
  loadClinicProfile,
  saveClinicProfile,
  DEFAULT_CLINIC_PROFILE,
} from "@/lib/ui-lab/clinic-profile-store";
import type { ClinicProfile } from "@/lib/ui-lab/clinic-profile-store";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

// ─── Required field keys for validation ──────────────────────────────────────

type FieldKey =
  | "name"
  | "pib"
  | "email"
  | "phone"
  | "address.street"
  | "address.city"
  | "address.zip";

const REQUIRED_FIELDS: FieldKey[] = [
  "name",
  "pib",
  "email",
  "phone",
  "address.street",
  "address.city",
  "address.zip",
];

function getFieldValue(profile: ClinicProfile, key: FieldKey): string {
  if (key.startsWith("address.")) {
    const sub = key.split(".")[1] as keyof ClinicProfile["address"];
    return profile.address[sub] ?? "";
  }
  return (profile[key as keyof ClinicProfile] as string) ?? "";
}

// ─── Card wrapper ────────────────────────────────────────────────────────────

function Card({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--v2-border)", background: "var(--v2-surface)" }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: "var(--v2-border)" }}
      >
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--v2-primary-bg)" }}
        >
          <span style={{ color: "var(--v2-primary)" }}>{icon}</span>
        </div>
        <div>
          <p className="text-[14px] font-semibold" style={{ color: "var(--v2-text-heading)" }}>{title}</p>
          {description && (
            <p className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Field row ───────────────────────────────────────────────────────────────

function FieldRow({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold" style={{ color: error ? "#ef4444" : "var(--v2-text-muted)" }}>
        {label}
        {required && <span className="ml-0.5" style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          Obavezno polje
        </p>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-[13px] focus:outline-none transition-colors"
      style={{
        background: "var(--v2-input-bg)",
        border: `1px solid ${error ? "#ef4444" : "var(--v2-border)"}`,
        color: "var(--v2-text)",
      }}
    />
  );
}

// ─── Upload field ─────────────────────────────────────────────────────────────

function UploadField({
  label,
  accept,
  dataUrl,
  fileName,
  onFile,
  onClear,
  uploadError,
  previewType,
}: {
  label: string;
  accept: string;
  dataUrl?: string;
  fileName?: string;
  onFile: (dataUrl: string, fileName: string) => void;
  onClear: () => void;
  uploadError?: string | null;
  previewType: "image" | "document";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      // signal error via callback — parent handles state
      onFile("__size_error__", file.name);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onFile(reader.result as string, file.name);
    };
    reader.readAsDataURL(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      {dataUrl && previewType === "image" ? (
        <div className="flex items-center gap-3">
          <div
            className="h-16 w-16 rounded-xl border overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ borderColor: "var(--v2-border)", background: "var(--v2-input-bg)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium" style={{ color: "var(--v2-text)" }}>{fileName ?? "logo"}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[12px] font-medium px-3 py-1 rounded-lg"
                style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
              >
                Zameni
              </button>
              <button
                type="button"
                onClick={onClear}
                className="text-[12px] font-medium px-3 py-1 rounded-lg"
                style={{ background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}
              >
                Ukloni
              </button>
            </div>
          </div>
        </div>
      ) : dataUrl && previewType === "document" ? (
        <div
          className="flex items-center justify-between p-3 rounded-xl border"
          style={{ borderColor: "var(--v2-border)", background: "var(--v2-input-bg)" }}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 flex-shrink-0" style={{ color: "var(--v2-primary)" }} />
            <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>{fileName ?? "dokument"}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[12px] font-medium px-3 py-1 rounded-lg"
              style={{ background: "var(--v2-primary-bg)", color: "var(--v2-primary)" }}
            >
              Zameni
            </button>
            <button
              type="button"
              onClick={onClear}
              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" style={{ color: "#ef4444" }} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed transition-colors hover:border-[color:var(--v2-primary)] hover:bg-[color:var(--v2-primary-bg)]"
          style={{ borderColor: "var(--v2-border)" }}
        >
          <Upload className="h-5 w-5" style={{ color: "var(--v2-text-muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
        </button>
      )}

      {uploadError && (
        <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          {uploadError}
        </p>
      )}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function DesktopPodaciOrdinacije({ className }: { className?: string }) {
  const [profile, setProfile] = useState<ClinicProfile>(() => loadClinicProfile());
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [memoError, setMemoError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistSave = useCallback((p: ClinicProfile) => {
    saveClinicProfile(p);
    setSavedAt(new Date());
    setIsDirty(false);
  }, []);

  const debouncedSave = useCallback((p: ClinicProfile) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persistSave(p), 250);
  }, [persistSave]);

  const handleManualSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    persistSave(profile);
  }, [profile, persistSave]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const update = useCallback(
    (patch: Partial<ClinicProfile> | ((prev: ClinicProfile) => ClinicProfile)) => {
      setIsDirty(true);
      setProfile((prev) => {
        const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave],
  );

  const updateAddress = useCallback(
    (key: keyof ClinicProfile["address"], value: string) => {
      update((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    },
    [update],
  );

  const touchField = (key: FieldKey) => setTouched((t) => ({ ...t, [key]: true }));

  const isError = (key: FieldKey) =>
    touched[key] === true && getFieldValue(profile, key).trim() === "";

  // ─── Logo upload ────────────────────────────────────────
  const handleLogo = (dataUrl: string, fileName: string) => {
    if (dataUrl === "__size_error__") {
      setLogoError("Fajl je prevelik (max 2 MB). Pokušajte sa manjom slikom.");
      return;
    }
    setLogoError(null);
    setIsDirty(true);
    update({ logoDataUrl: dataUrl, memoFileName: profile.memoFileName });
    // store fileName in a separate key by piggybacking note pattern
    setProfile((prev) => {
      const next = { ...prev, logoDataUrl: dataUrl, _logoFileName: fileName } as ClinicProfile & { _logoFileName?: string };
      debouncedSave(next);
      return next;
    });
  };

  const clearLogo = () => {
    setLogoError(null);
    update({ logoDataUrl: undefined });
  };

  // ─── Memo upload ────────────────────────────────────────
  const handleMemo = (dataUrl: string, fileName: string) => {
    if (dataUrl === "__size_error__") {
      setMemoError("Fajl je prevelik (max 2 MB). Pokušajte sa manjim fajlom.");
      return;
    }
    setMemoError(null);
    setProfile((prev) => {
      const next = { ...prev, memoDataUrl: dataUrl, memoFileName: fileName };
      debouncedSave(next);
      return next;
    });
  };

  const clearMemo = () => {
    setMemoError(null);
    setProfile((prev) => {
      const next = { ...prev, memoDataUrl: undefined, memoFileName: undefined };
      debouncedSave(next);
      return next;
    });
  };

  // ─── Logo file name helper ───────────────────────────────
  const logoFileName = (profile as ClinicProfile & { _logoFileName?: string })._logoFileName;

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />

      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <V2PageHeader
          section="Ordinacija"
          title="Podaci o ordinaciji"
          extraActions={
            <div className="flex items-center gap-3">
              {savedAt && !isDirty && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#10b981" }} />
                  <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>
                    Sačuvano {savedAt.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={handleManualSave}
                disabled={!isDirty}
                className="flex items-center gap-2 px-4 py-2 rounded-[var(--v2-radius-pill)] text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
              >
                <Save className="h-3.5 w-3.5" />
                Sačuvaj
              </button>
            </div>
          }
        />

        <main
          className="flex-1 overflow-hidden rounded-[24px] flex flex-col"
          style={{ background: "var(--v2-bg)" }}
        >
          <div className="flex-1 overflow-y-auto py-6">
            <div className="max-w-[860px] mx-auto w-full px-6 flex flex-col gap-5">

              {/* 1 — Osnovno */}
              <Card
                icon={<Building2 className="h-4 w-4" />}
                title="Osnovno"
                description="Naziv, PIB, matični broj i kontakt podaci"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FieldRow label="Naziv ordinacije" required error={isError("name")}>
                      <TextInput
                        value={profile.name}
                        onChange={(v) => update({ name: v })}
                        onBlur={() => touchField("name")}
                        placeholder="npr. Stomatološka ordinacija Dr. Marković"
                        error={isError("name")}
                      />
                    </FieldRow>
                  </div>

                  <FieldRow label="PIB" required error={isError("pib")}>
                    <TextInput
                      value={profile.pib}
                      onChange={(v) => update({ pib: v })}
                      onBlur={() => touchField("pib")}
                      placeholder="npr. 123456789"
                      error={isError("pib")}
                    />
                  </FieldRow>

                  <FieldRow label="Matični broj (opciono)">
                    <TextInput
                      value={profile.mb ?? ""}
                      onChange={(v) => update({ mb: v })}
                      placeholder="npr. 12345678"
                    />
                  </FieldRow>

                  <FieldRow label="Email" required error={isError("email")}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => update({ email: e.target.value })}
                        onBlur={() => touchField("email")}
                        placeholder="ordinacija@primer.rs"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px] focus:outline-none transition-colors"
                        style={{
                          background: "var(--v2-input-bg)",
                          border: `1px solid ${isError("email") ? "#ef4444" : "var(--v2-border)"}`,
                          color: "var(--v2-text)",
                        }}
                      />
                    </div>
                    {isError("email") && (
                      <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
                        <AlertTriangle className="h-3 w-3" />Obavezno polje
                      </p>
                    )}
                  </FieldRow>

                  <FieldRow label="Telefon" required error={isError("phone")}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => update({ phone: e.target.value })}
                        onBlur={() => touchField("phone")}
                        placeholder="+381 11 123 4567"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px] focus:outline-none transition-colors"
                        style={{
                          background: "var(--v2-input-bg)",
                          border: `1px solid ${isError("phone") ? "#ef4444" : "var(--v2-border)"}`,
                          color: "var(--v2-text)",
                        }}
                      />
                    </div>
                    {isError("phone") && (
                      <p className="flex items-center gap-1 text-[11px]" style={{ color: "#ef4444" }}>
                        <AlertTriangle className="h-3 w-3" />Obavezno polje
                      </p>
                    )}
                  </FieldRow>

                  <div className="col-span-2">
                    <FieldRow label="Veb sajt (opciono)">
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                        <input
                          type="url"
                          value={profile.website ?? ""}
                          onChange={(e) => update({ website: e.target.value })}
                          placeholder="https://www.ordinacija.rs"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px] focus:outline-none transition-colors"
                          style={{
                            background: "var(--v2-input-bg)",
                            border: "1px solid var(--v2-border)",
                            color: "var(--v2-text)",
                          }}
                        />
                      </div>
                    </FieldRow>
                  </div>
                </div>
              </Card>

              {/* 2 — Adresa */}
              <Card
                icon={<MapPin className="h-4 w-4" />}
                title="Adresa"
                description="Lokacija ordinacije"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FieldRow label="Ulica i broj" required error={isError("address.street")}>
                      <TextInput
                        value={profile.address.street}
                        onChange={(v) => updateAddress("street", v)}
                        onBlur={() => touchField("address.street")}
                        placeholder="npr. Knez Mihailova 10"
                        error={isError("address.street")}
                      />
                    </FieldRow>
                  </div>

                  <FieldRow label="Grad" required error={isError("address.city")}>
                    <TextInput
                      value={profile.address.city}
                      onChange={(v) => updateAddress("city", v)}
                      onBlur={() => touchField("address.city")}
                      placeholder="npr. Beograd"
                      error={isError("address.city")}
                    />
                  </FieldRow>

                  <FieldRow label="Poštanski broj" required error={isError("address.zip")}>
                    <TextInput
                      value={profile.address.zip}
                      onChange={(v) => updateAddress("zip", v)}
                      onBlur={() => touchField("address.zip")}
                      placeholder="npr. 11000"
                      error={isError("address.zip")}
                    />
                  </FieldRow>

                  <div className="col-span-2">
                    <FieldRow label="Država">
                      <TextInput
                        value={profile.address.country}
                        onChange={(v) => updateAddress("country", v)}
                        placeholder="Srbija"
                      />
                    </FieldRow>
                  </div>
                </div>
              </Card>

              {/* 3 — Brending i dokumenti */}
              <Card
                icon={<ImageIcon className="h-4 w-4" />}
                title="Brending i dokumenti"
                description="Logo, memorandum i pečat ordinacije"
              >
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--v2-text-muted)" }}>
                      Logo <span className="font-normal">(PNG ili SVG, max 2 MB)</span>
                    </p>
                    <UploadField
                      label="Kliknite da dodate logo"
                      accept="image/png,image/svg+xml,image/jpeg"
                      dataUrl={profile.logoDataUrl}
                      fileName={logoFileName}
                      onFile={handleLogo}
                      onClear={clearLogo}
                      uploadError={logoError}
                      previewType="image"
                    />
                  </div>

                  <div className="h-px" style={{ background: "var(--v2-border)" }} />

                  <div>
                    <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--v2-text-muted)" }}>
                      Memorandum <span className="font-normal">(PDF ili PNG, max 2 MB)</span>
                    </p>
                    <UploadField
                      label="Kliknite da dodate memorandum"
                      accept="application/pdf,image/png"
                      dataUrl={profile.memoDataUrl}
                      fileName={profile.memoFileName}
                      onFile={handleMemo}
                      onClear={clearMemo}
                      uploadError={memoError}
                      previewType="document"
                    />
                  </div>

                  <div className="h-px" style={{ background: "var(--v2-border)" }} />

                  <div>
                    <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--v2-text-muted)" }}>
                      Pečat <span className="font-normal">(placeholder — dolazi uskoro)</span>
                    </p>
                    <div
                      className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed"
                      style={{ borderColor: "var(--v2-border)", opacity: 0.5 }}
                    >
                      <FileText className="h-5 w-5" style={{ color: "var(--v2-text-muted)" }} />
                      <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>Uskoro dostupno</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 4 — Napomena */}
              <Card
                icon={<StickyNote className="h-4 w-4" />}
                title="Napomena"
                description="Interne napomene (opciono)"
              >
                <textarea
                  rows={4}
                  placeholder="Npr. posebne instrukcije za štampu, kontakti za hitne slučajeve..."
                  value={profile.note ?? ""}
                  onChange={(e) => update({ note: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-[13px] resize-none focus:outline-none transition-colors"
                  style={{
                    background: "var(--v2-input-bg)",
                    border: "1px solid var(--v2-border)",
                    color: "var(--v2-text)",
                  }}
                />
              </Card>

              {/* Required fields hint */}
              <p className="text-[11px] pb-4" style={{ color: "var(--v2-text-muted)" }}>
                <span style={{ color: "#ef4444" }}>*</span> Obavezna polja
              </p>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
