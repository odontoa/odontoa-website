"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: "danger" | "primary";
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmVariant = "danger",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.4)" }}
      onClick={onCancel}
    >
      <div
        className="flex flex-col gap-[20px] p-[24px] max-w-[360px] w-full"
        style={{
          background: "var(--v2-surface)",
          borderRadius: "var(--v2-radius-card)",
          border: "1px solid var(--v2-border)",
          boxShadow: "var(--v2-shadow-tooltip)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[8px]">
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--v2-text-heading)",
              lineHeight: "1.3",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "var(--v2-text)",
              lineHeight: "1.4",
            }}
          >
            {message}
          </span>
        </div>
        <div className="flex gap-[12px] justify-end">
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--v2-text)",
              background: "var(--v2-bg)",
              border: "1px solid var(--v2-border)",
              borderRadius: "var(--v2-radius-badge)",
              cursor: "pointer",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: confirmVariant === "danger" ? "var(--v2-status-cancelled-fg)" : "var(--v2-primary-fg)",
              background: confirmVariant === "danger" ? "var(--v2-status-cancelled-bg)" : "var(--v2-primary)",
              border: "none",
              borderRadius: "var(--v2-radius-badge)",
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
