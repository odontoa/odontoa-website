import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  isFrontTooth,
  lowerJawPermanent,
  lowerJawTemporary,
  teethSVGsPermanent,
  teethSVGsTemporary,
  toothLabelPositions,
  upperJawPermanent,
  upperJawTemporary,
} from "@/lib/constants";
import { getToothStatusColor, type ToothStatus } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Helper component for rendering individual teeth with multiple path segments
interface ToothProps {
  toothNumber: string;
  toothStatus?: ToothStatus;
  onClick?: (toothNumber: string) => void;
  treatmentAreas?: string[];
  toothType: "permanent" | "deciduous";
}

const Tooth = ({
  toothNumber,
  toothStatus,
  onClick,
  treatmentAreas,
  toothType,
}: ToothProps) => {
  const paths =
    toothType === "permanent"
      ? teethSVGsPermanent[toothNumber]
      : teethSVGsTemporary[toothNumber];
  if (!paths || paths.length === 0) return null;

  const labelPos = toothLabelPositions[toothNumber];
  const statusColor = getToothStatusColor(toothStatus || null);

  // Determine if we should show treatment mini diagram
  const hasTreatmentAreas = treatmentAreas && treatmentAreas.length > 0;

  // Determine if this is a front tooth (incisors and canines) or side tooth (premolars and molars)
  const isFront = isFrontTooth(toothNumber);

  // Calculate position for mini treatment diagram (offset from tooth)
  const miniDiagramSize = 30;

  // Check if this is a lower tooth
  // Permanent: 31-38 or 41-48
  // Deciduous: 71-75 or 81-85
  const isLowerTooth =
    toothNumber.startsWith("3") ||
    toothNumber.startsWith("4") ||
    toothNumber.startsWith("7") ||
    toothNumber.startsWith("8");

  const miniDiagramOffset = {
    x: labelPos.x - miniDiagramSize / 2,
    y: isLowerTooth ? labelPos.y - 45 : labelPos.y + 20, // Above for lower teeth, below for upper
  };

  return (
    <g
      onClick={() => onClick?.(toothNumber)}
      style={{ cursor: onClick ? "pointer" : "default" }}
      className="group"
    >
      {paths.map((pathData, index) => (
        <path
          key={`${toothNumber}-${index}`}
          d={pathData}
          className={`
            ${statusColor} stroke-[0.5] 
            cursor-pointer transition-all duration-200 
            hover:opacity-50
          `}
        />
      ))}
      {/* Display tooth number */}
      {labelPos && (
        <text
          x={labelPos.x}
          y={labelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-700 text-[8px] font-semibold pointer-events-none select-none"
          style={{ fontSize: "10px" }}
        >
          {toothNumber}
        </text>
      )}

      {/* Mini treatment diagram showing treated areas */}
      {hasTreatmentAreas && labelPos && (
        <g
          transform={`translate(${miniDiagramOffset.x}, ${miniDiagramOffset.y})`}
        >
          {/* Background circle */}
          <circle
            cx={miniDiagramSize / 2}
            cy={miniDiagramSize / 2}
            r={miniDiagramSize / 2 + 1}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />

          {/* Mini tooth diagram */}
          <svg
            x="0"
            y="0"
            width={miniDiagramSize}
            height={miniDiagramSize}
            viewBox="-2 -2 45.19 45.18"
          >
            {/* Distalno (Right) - Always shown */}
            <path
              d="M34.88,5.76c3.89,3.74,6.31,9,6.31,14.83s-2.42,11.09-6.31,14.83l-8.56-8.49c1.74-1.55,2.83-3.82,2.83-6.34s-1.09-4.79-2.83-6.34h0s8.56-8.49,8.56-8.49Z"
              fill={treatmentAreas.includes("Distalno") ? "#3b82f6" : "#e5e7eb"}
              stroke={
                treatmentAreas.includes("Distalno") ? "#1e40af" : "#9ca3af"
              }
              strokeWidth="0.3"
            />

            {/* Lingvalno/Palatinalno (Top surface) - Always shown */}
            <path
              d="M34.88,5.76l-8.56,8.48c-1.51-1.37-3.52-2.2-5.72-2.2-2.48,0-4.71,1.05-6.27,2.74L5.98,6.08C9.72,2.33,14.89,0,20.6,0s10.57,2.2,14.28,5.76h0Z"
              fill={
                treatmentAreas.includes("Lingvalno") || treatmentAreas.includes("Palatinalno")
                  ? "#3b82f6"
                  : "#e5e7eb"
              }
              stroke={
                treatmentAreas.includes("Lingvalno") || treatmentAreas.includes("Palatinalno")
                  ? "#1e40af"
                  : "#9ca3af"
              }
              strokeWidth="0.3"
            />

            {/* Center part - Incizalno for front teeth, Okluzalno for side teeth */}
            {isFront ? (
              <path
                d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                fill={
                  treatmentAreas.includes("Incizalno") ? "#3b82f6" : "#e5e7eb"
                }
                stroke={
                  treatmentAreas.includes("Incizalno") ? "#1e40af" : "#9ca3af"
                }
                strokeWidth="0.3"
              />
            ) : (
              <path
                d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                fill={
                  treatmentAreas.includes("Okluzalno") ? "#3b82f6" : "#e5e7eb"
                }
                stroke={
                  treatmentAreas.includes("Okluzalno") ? "#1e40af" : "#9ca3af"
                }
                strokeWidth="0.3"
              />
            )}

            {/* Bottom part - Labijalno for front teeth, Bukalno for side teeth */}
            {isFront ? (
              <path
                d="M14.55,26.63c1.55,1.55,3.68,2.51,6.05,2.51,2.2,0,4.21-.83,5.72-2.21l8.56,8.49c-3.71,3.56-8.73,5.76-14.28,5.76s-10.88-2.32-14.61-6.07l8.34-8.18s.22-.3.22-.3Z"
                fill={
                  treatmentAreas.includes("Labijalno") ? "#3b82f6" : "#e5e7eb"
                }
                stroke={
                  treatmentAreas.includes("Labijalno") ? "#1e40af" : "#9ca3af"
                }
                strokeWidth="0.3"
              />
            ) : (
              <path
                d="M14.55,26.63c1.55,1.55,3.68,2.51,6.05,2.51,2.2,0,4.21-.83,5.72-2.21l8.56,8.49c-3.71,3.56-8.73,5.76-14.28,5.76s-10.88-2.32-14.61-6.07l8.34-8.18s.22-.3.22-.3Z"
                fill={
                  treatmentAreas.includes("Bukalno") ? "#3b82f6" : "#e5e7eb"
                }
                stroke={
                  treatmentAreas.includes("Bukalno") ? "#1e40af" : "#9ca3af"
                }
                strokeWidth="0.3"
              />
            )}

            {/* Mezijalno (Left) - Always shown */}
            <path
              d="M14.55,26.63l-.22.3-8.34,8.18C2.29,31.38,0,26.25,0,20.59S2.29,9.8,5.98,6.08l8.35,8.7c-1.41,1.52-2.28,3.56-2.28,5.81,0,2.36.96,4.5,2.5,6.04h0Z"
              fill={
                treatmentAreas.includes("Mezijalno") ? "#3b82f6" : "#e5e7eb"
              }
              stroke={
                treatmentAreas.includes("Mezijalno") ? "#1e40af" : "#9ca3af"
              }
              strokeWidth="0.3"
            />

            {/* Krunica - Only shown if selected (overlay on center) */}
            {treatmentAreas.includes("Krunica") && (
              <path
                d="M26.32,14.25c1.74,1.55,2.83,3.82,2.83,6.34s-1.09,4.79-2.83,6.34c-1.51,1.38-3.52,2.21-5.72,2.21-2.37,0-4.5-.96-6.05-2.51s-2.5-3.68-2.5-6.04.87-4.29,2.28-5.81c1.56-1.69,3.79-2.74,6.27-2.74,2.2,0,4.21.83,5.72,2.2h0Z"
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="0.3"
                opacity="0.7"
              />
            )}
          </svg>
        </g>
      )}
    </g>
  );
};

interface SVGOdontogramProps {
  teethStatuses?: Record<string, ToothStatus>;
  onToothClick?: (toothNumber: string) => void;
  treatmentsByTooth?: Record<string, string[]>; // Record<toothNumber, toothAreas[]>
}

export const SVGOdontogram = ({
  teethStatuses,
  onToothClick,
  treatmentsByTooth,
}: SVGOdontogramProps) => {
  const { t } = useTranslation();
  const [isDeciduous, setIsDeciduous] = useState(false);
  const toothType = isDeciduous ? "deciduous" : "permanent";

  // Helper to get tooth status by number
  const getToothStatus = (toothNumber: string): ToothStatus => {
    if (!teethStatuses) return null;
    return teethStatuses[toothNumber] || null;
  };

  // Helper to get treatment areas for a tooth
  const getTreatmentAreas = (toothNumber: string): string[] | undefined => {
    if (!treatmentsByTooth) return undefined;
    return treatmentsByTooth[toothNumber];
  };

  // Get the appropriate jaw arrays based on tooth type
  const upperJaw =
    toothType === "permanent" ? upperJawPermanent : upperJawTemporary;
  const lowerJaw =
    toothType === "permanent" ? lowerJawPermanent : lowerJawTemporary;

  return (
    <div className="w-full space-y-6 flex flex-col items-center justify-center">
      {/* Tooth Type Toggle */}
      <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsDeciduous(false)}
          className={cn(
            "px-6 py-2 text-sm font-medium transition-all",
            !isDeciduous
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {t("appointments.permanentTooth")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsDeciduous(true)}
          className={cn(
            "px-6 py-2 text-sm font-medium transition-all",
            isDeciduous
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {t("appointments.deciduousTooth")}
        </Button>
      </div>

      {/* Main Odontogram SVG */}
      <div className="w-full space-y-16 flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 818.34 220.45"
          className="w-full max-w-4xl"
        >
          {/* Render all teeth dynamically */}
          {upperJaw.map((toothNumber) => (
            <Tooth
              key={toothNumber}
              toothNumber={toothNumber}
              toothStatus={getToothStatus(toothNumber)}
              onClick={onToothClick}
              treatmentAreas={getTreatmentAreas(toothNumber)}
              toothType={toothType}
            />
          ))}
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 818.34 220.45"
          className="w-full max-w-4xl"
        >
          {lowerJaw.map((toothNumber) => (
            <Tooth
              key={toothNumber}
              toothNumber={toothNumber}
              toothStatus={getToothStatus(toothNumber)}
              onClick={onToothClick}
              treatmentAreas={getTreatmentAreas(toothNumber)}
              toothType={toothType}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
