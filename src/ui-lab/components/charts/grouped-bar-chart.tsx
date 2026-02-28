// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146
"use client";

interface GroupedBarSeries {
  key: string;
  color: string;
}

interface GroupedBarChartProps {
  data: Record<string, number | string>[];
  labelKey: string;
  series: GroupedBarSeries[];
  width?: number;
  height?: number;
}

// Figma: rounded-tl-[24px] rounded-tr-[24px] — top corners only, radius capped at bar width/2
function topRoundedBar(x: number, y: number, w: number, h: number): string {
  if (h <= 0) return "";
  const r = Math.min(24, w / 2, h);
  return (
    `M ${x + r},${y} ` +
    `L ${x + w - r},${y} ` +
    `Q ${x + w},${y} ${x + w},${y + r} ` +
    `L ${x + w},${y + h} ` +
    `L ${x},${y + h} ` +
    `L ${x},${y + r} ` +
    `Q ${x},${y} ${x + r},${y} Z`
  );
}

export function GroupedBarChart({
  data,
  labelKey,
  series,
  width = 400,
  height = 180,
}: GroupedBarChartProps) {
  const padLeft = 36;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const allValues = data.flatMap((row) => series.map((s) => Number(row[s.key]) || 0));
  const maxVal = Math.max(...allValues) || 1;

  const groupWidth = chartW / data.length;
  // Figma: gap-[4px] between bars within a group
  const barPad = 4;
  const barWidth = (groupWidth - barPad * (series.length + 1)) / series.length;

  const toY = (v: number) => padTop + chartH - (v / maxVal) * chartH;
  const toH = (v: number) => (v / maxVal) * chartH;

  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = Math.round((maxVal * i) / gridCount);
    const y = padTop + chartH - (val / maxVal) * chartH;
    const label = val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val.toString();
    return { y, label };
  });

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {gridLines.map(({ y, label }, i) => (
          <g key={i}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke="var(--v2-border)"
              strokeWidth="1"
            />
            <text
              x={padLeft - 4}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="var(--v2-text-muted)"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Bars — top-only rounded corners (24px, capped at barWidth/2) */}
        {data.map((row, gi) => {
          const groupX = padLeft + gi * groupWidth + barPad;
          return (
            <g key={gi}>
              {series.map((s, si) => {
                const val = Number(row[s.key]) || 0;
                const x = groupX + si * (barWidth + barPad);
                const h = toH(val);
                const y = toY(val);
                const d = topRoundedBar(x, y, barWidth, h);
                if (!d) return null;
                return (
                  <path
                    key={s.key}
                    d={d}
                    fill={s.color}
                    className="transition-opacity hover:opacity-80"
                  />
                );
              })}
              {/* X-axis label */}
              <text
                x={groupX + (series.length * (barWidth + barPad)) / 2 - barPad / 2}
                y={padTop + chartH + 16}
                textAnchor="middle"
                fontSize="9"
                fill="var(--v2-text-muted)"
              >
                {String(row[labelKey])}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
