import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { useTranslation } from "react-i18next";

export const ChairSwitcher = ({ chair, setChair }: { chair: string, setChair: (chair: string) => void }) => {
    const { t } = useTranslation();
    const { data: clinic } = useGetClinicById();

    const totalChairs = clinic?.chairNumber ?? 0;

    return (
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg border border-blue-200 p-1.5">
            <span className="font-medium text-sm mr-3 text-blue-700">{t("appointments.chair")}:</span>
            {totalChairs > 0
                ? Array.from({ length: totalChairs }, (_, index) => {
                    const value = String(index + 1);
                    const isSelected = chair === value;
                    return (
                        <Button
                            key={value}
                            variant={isSelected ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setChair(value)}
                            className={cn(
                                "w-12 h-8 text-sm font-medium hover:bg-blue-600 hover:text-white",
                                isSelected && "bg-blue-600 hover:bg-blue-700"
                            )}
                        >
                            {value}
                        </Button>
                    );
                })
                : (
                    <Button disabled size="sm" className="w-12 h-8 text-sm">-</Button>
                )}
        </div>
    );
};