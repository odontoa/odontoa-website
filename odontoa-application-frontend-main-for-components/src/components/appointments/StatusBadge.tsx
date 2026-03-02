import { useTranslation } from "react-i18next";

type StatusBadgeProps = {
  status: 'finished' | 'encounter' | 'registered' | 'canceled';
  className?: string;
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation();
  
  const statusConfig = {
    finished: { bgColor: 'bg-green-100', textColor: 'text-green-800', label: t('appointmentDetail.finished') },
    encounter: { bgColor: 'bg-blue-100', textColor: 'text-blue-800', label: t('appointmentDetail.encounter') },
    registered: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', label: t('appointmentDetail.registered') },
    canceled: { bgColor: 'bg-red-100', textColor: 'text-red-800', label: t('appointmentDetail.canceled') },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}>
      {config.label}
    </span>
  );
} 