"use client";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  legendBelow?: boolean;
  centerLabel?: string;
}

export function DonutChart({
  data,
  size = 146,
  strokeWidth = 10,
  legendBelow = false,
  centerLabel = "Total",
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-slate-500">
          <div className="text-sm">Nema podataka za prikaz</div>
        </div>
      </div>
    );
  }

  let cumulativeOffset = 0;
  const segments = data.map((item) => {
    const segmentLength = (item.value / total) * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += segmentLength;
    return { ...item, segmentLength, offset };
  });

  const formattedTotal = total.toLocaleString("en-US");

  const donut = (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={centerX}
          cy={centerY}
          r={radius - strokeWidth / 2}
          fill="var(--v2-surface, #fff)"
        />
        {segments.map((segment, idx) => (
          <circle
            key={idx}
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.segmentLength} ${circumference}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className="font-bold leading-none"
            style={{ fontSize: "24px", color: "var(--v2-primary-dark, #2a2c4c)" }}
          >
            {formattedTotal}
          </div>
          <div
            className="mt-1"
            style={{ fontSize: "11px", color: "var(--v2-text-muted, #6d6d71)" }}
          >
            {centerLabel}
          </div>
        </div>
      </div>
    </div>
  );

  const legend = legendBelow ? (
    <div className="flex flex-col gap-[10px] w-full">
      {data.map((item, idx) => {
        const computedPct = Math.round((item.value / total) * 100);
        const displayPct = item.percentage ?? `${computedPct}%`;
        return (
          <div key={idx} className="flex items-center gap-2.5">
            <div
              className="flex-shrink-0"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                backgroundColor: item.color,
              }}
            />
            <div
              className="flex-1 min-w-0"
              style={{ fontSize: "12px", color: "var(--v2-text-heading, #1a1615)" }}
            >
              {item.label}
            </div>
            <div
              className="font-bold flex-shrink-0"
              style={{ fontSize: "14px", color: "var(--v2-primary-dark, #2a2c4c)" }}
            >
              {displayPct}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="space-y-2.5">
      {data.map((item, idx) => {
        const computedPct = Math.round((item.value / total) * 100);
        return (
          <div key={idx} className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-base font-medium text-slate-700">{item.label}</div>
              <div className="text-sm text-slate-500">
                {item.value} ({computedPct}%)
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (legendBelow) {
    return (
      <div className="flex flex-col items-center gap-[10px]">
        {donut}
        {legend}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      {donut}
      {legend}
    </div>
  );
}
