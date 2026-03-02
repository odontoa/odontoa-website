import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateTimes } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function TimeSelect({time, setTime}: any) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="time">{t("components.timeSelect.time")}</Label>
      <Select value={time} onValueChange={setTime}>
        <SelectTrigger id="time" className="">
          <SelectValue placeholder={t("components.timeSelect.selectTime")} />
        </SelectTrigger>
        <SelectContent>
          {generateTimes().map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
