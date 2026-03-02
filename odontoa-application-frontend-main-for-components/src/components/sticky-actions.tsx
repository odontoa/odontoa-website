import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";

interface StickyActionsProps {
    onSave?: () => void;
    saveDisabled?: boolean;
    className?: string;
}

export function StickyActions({
    onSave,
    saveDisabled = false,
    className
}: StickyActionsProps) {
    const { isEditing, toggleEditing, cancelEditing } = useAnalysisEditingMode();
    const { t } = useTranslation();

    return (
        <div className={cn(
            "sticky top-0 z-50 bg-white py-4 px-4 w-full transition-all duration-200",
            className
        )}>
            <div className="mx-auto">
                <div className="flex justify-end space-x-2">
                    {isEditing ? (
                        <>
                            <Button
                                type="button"
                                onClick={cancelEditing}
                                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                            >
                                <FaTimes className="text-black" />
                                <span className="text-black">{t("components.stickyActions.cancel")}</span>
                            </Button>
                            {onSave && (
                                <Button
                                    type="submit"
                                    onClick={onSave}
                                    disabled={saveDisabled}
                                    className="flex items-center space-x-1 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <FaSave className="text-white" />
                                    <span>{t("components.stickyActions.save")}</span>
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            type="button"
                            onClick={toggleEditing}
                            className="flex items-center space-x-1 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                        >
                            <FaEdit className="text-white" />
                            <span>{t("components.stickyActions.edit")}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
