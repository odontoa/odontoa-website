// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146
"use client";

interface DataPoint {
  month: string;
  profit: number;
  expenses: number;
}

interface LineAreaChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export function LineAreaChart({ data, width = 500, height = 180 }: LineAreaChartProps) {
  const padLeft = 40;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 32;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const allValues = data.flatMap((d) => [d.profit, d.expenses]);
  const maxVal = Math.max(...allValues);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const xStep = chartW / (data.length - 1);

  const toX = (i: number) => padLeft + i * xStep;
  const toY = (v: number) => padTop + chartH - ((v - minVal) / range) * chartH;

  const buildPath = (key: "profit" | "expenses") =>
    data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(d[key]).toFixed(1)}`)
      .join(" ");

  const buildArea = (key: "profit" | "expenses") => {
    const linePart = buildPath(key);
    const lastX = toX(data.length - 1).toFixed(1);
    const firstX = toX(0).toFixed(1);
    const baseY = (padTop + chartH).toFixed(1);
    return `${linePart} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  // Y-axis grid labels
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = Math.round((maxVal * i) / gridCount);
    const y = toY(val);
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
        <defs>
          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--v2-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--v2-primary)" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--v2-primary-dark)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--v2-primary-dark)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

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
              x={padLeft - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="var(--v2-text-muted)"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Area fills */}
        <path d={buildArea("profit")} fill="url(#profitGrad)" />
        <path d={buildArea("expenses")} fill="url(#expensesGrad)" />

        {/* Lines */}
        <path
          d={buildPath("profit")}
          fill="none"
          stroke="var(--v2-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={buildPath("expenses")}
          fill="none"
          stroke="var(--v2-primary-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={toX(i)}
            y={padTop + chartH + 18}
            textAnchor="middle"
            fontSize="10"
            fill="var(--v2-text-muted)"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}
