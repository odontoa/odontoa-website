import { toothLabelPositions } from "@/lib/constants";
import { getToothStatusColor, type ToothStatus } from "@/lib/utils";

// Helper component for rendering individual teeth with multiple path segments
interface ToothGroupProps {
  toothNumber: string;
  toothStatus?: ToothStatus;
  onClick?: (toothNumber: string) => void;
  selected?: boolean;
  paths: string[];
}

export const ToothGroup = ({
  toothNumber,
  toothStatus,
  onClick,
  selected = false,
  paths,
}: ToothGroupProps) => {
  if (!paths || paths.length === 0) return null;

  const labelPos = toothLabelPositions[toothNumber];
  const statusColor = getToothStatusColor(toothStatus || null);

  return (
    <g
      onClick={() => onClick?.(toothNumber)}
      style={{ cursor: onClick ? "pointer" : "default" }}
      className="group transition-all duration-200 hover:[&>path]:fill-blue-500 hover:[&>path]:opacity-80"
    >
      {paths.map((pathData, index) => (
        <path
          key={`${toothNumber}-${index}`}
          d={pathData}
          className={`
              ${
                selected ? "fill-blue-500 opacity-80" : statusColor
              } stroke-[0.5] 
              transition-all duration-200
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
    </g>
  );
};
