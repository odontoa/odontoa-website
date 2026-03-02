import { addDays, format, startOfWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/utils";

export const useWeekDays = (currentDate: Date, includeWeekend: boolean = false) => {
  const { i18n } = useTranslation();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysToShow = includeWeekend ? 7 : 5;
  const locale = getDateFnsLocale(i18n.language);

  const dayNames = Array.from({ length: daysToShow }).map((_, i) =>
    format(addDays(weekStart, i), "EEEE", { locale })
  );

  const dates = Array.from({ length: daysToShow }).map((_, i) =>
    format(addDays(weekStart, i), "dd.MM")
  );

  return { dayNames, dates };
};
