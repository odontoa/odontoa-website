import { useTranslation } from "react-i18next";

export const FallbackPage = () => {
    const { t } = useTranslation();
    return (
        <div>{t("common.loading")}</div>
    )
}