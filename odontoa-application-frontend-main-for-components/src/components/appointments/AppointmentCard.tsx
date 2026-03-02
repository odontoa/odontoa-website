import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type AppointmentCardProps = {
  patientName: string;
  procedureType: string;
  time: string;
  price?: number;
  currency?: string;
};

export default function AppointmentCard({
  patientName,
  procedureType,
  time,
  price,
  currency = "RSD",
}: AppointmentCardProps) {
  return (
    <div
      className={`rounded-lg p-3 border shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-sm">{patientName}</h3>
        {price !== undefined && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <DollarSign size={12} />
            {formatCurrency(price, currency)}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-600 mb-1">{procedureType}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  );
}
