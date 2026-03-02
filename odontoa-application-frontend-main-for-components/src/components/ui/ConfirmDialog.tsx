import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ConfirmDialogVariant = "destructive" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: ConfirmDialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantConfig = {
  destructive: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    titleColor: "text-red-600",
    buttonVariant: "destructive" as const,
    buttonClass: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-600",
    buttonVariant: "default" as const,
    buttonClass: "bg-yellow-600 hover:bg-yellow-700",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    titleColor: "text-blue-600",
    buttonVariant: "default" as const,
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    titleColor: "text-green-600",
    buttonVariant: "default" as const,
    buttonClass: "bg-green-600 hover:bg-green-700",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "destructive",
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  loading = false,
  children,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${config.titleColor}`}>
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {children && (
          <div className="bg-gray-50 rounded-lg p-4">
            {children}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText || t("common.cancel")}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={loading}
            className={config.buttonClass}
          >
            {loading ? t("common.loading") : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 