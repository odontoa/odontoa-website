// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146
"use client";

interface DataPoint {
  month: string;
  profit: number;
  expenses: number;
}

type SmoothMode = "none" | "catmull" | "monotone";

interface LineAreaChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  /** @deprecated use smoothMode instead */
  smooth?: boolean;
  smoothMode?: SmoothMode;
}

// ── Path builders ───────────────────────────────────────────

type Pt = { x: number; y: number };

function linearPath(points: Pt[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

function catmullRomPath(points: Pt[], tension = 0.28): string {
  if (points.length < 2) return linearPath(points);

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    let cp1y = p1.y + (p2.y - p0.y) * tension;
    let cp2y = p2.y - (p3.y - p1.y) * tension;

    // Clamp control points to stay within the local y-range
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);
    cp1y = Math.max(minY, Math.min(maxY, cp1y));
    cp2y = Math.max(minY, Math.min(maxY, cp2y));

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Monotone cubic interpolation (Fritsch-Carlson).
 * Guarantees no overshoot between data points — ideal for chart curves.
 */
function monotonePath(points: Pt[]): string {
  const n = points.length;
  if (n < 2) return linearPath(points);
  if (n === 2) return linearPath(points);

  // 1. Compute secant slopes
  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1].x - points[i].x);
    dy.push(points[i + 1].y - points[i].y);
    slopes.push(dx[i] === 0 ? 0 : dy[i] / dx[i]);
  }

  // 2. Initial tangent estimates
  const tangents: number[] = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      tangents.push(0);
    } else {
      tangents.push((slopes[i - 1] + slopes[i]) / 2);
    }
  }
  tangents.push(slopes[n - 2]);

  // 3. Fritsch-Carlson constraint to prevent overshoot
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(slopes[i]) < 1e-10) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const alpha = tangents[i] / slopes[i];
      const beta = tangents[i + 1] / slopes[i];
      const s = alpha * alpha + beta * beta;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        tangents[i] = tau * alpha * slopes[i];
        tangents[i + 1] = tau * beta * slopes[i];
      }
    }
  }

  // 4. Build SVG cubic bezier path
  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    const cp1x = points[i].x + h;
    const cp1y = points[i].y + tangents[i] * h;
    const cp2x = points[i + 1].x - h;
    const cp2y = points[i + 1].y - tangents[i + 1] * h;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${points[i + 1].x.toFixed(1)},${points[i + 1].y.toFixed(1)}`;
  }
  return d;
}

function buildSvgPath(points: Pt[], mode: SmoothMode): string {
  switch (mode) {
    case "monotone":
      return monotonePath(points);
    case "catmull":
      return catmullRomPath(points);
    default:
      return linearPath(points);
  }
}

// ── Component ───────────────────────────────────────────────

export function LineAreaChart({
  data,
  width = 500,
  height = 180,
  smooth = false,
  smoothMode,
}: LineAreaChartProps) {
  const mode: SmoothMode = smoothMode ?? (smooth ? "monotone" : "none");

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

  const buildPath = (key: "profit" | "expenses") => {
    const pts = data.map((d, i) => ({ x: toX(i), y: toY(d[key]) }));
    return buildSvgPath(pts, mode);
  };

  const buildArea = (key: "profit" | "expenses") => {
    const linePart = buildPath(key);
    const lastX = toX(data.length - 1).toFixed(1);
    const firstX = toX(0).toFixed(1);
    const baseY = (padTop + chartH).toFixed(1);
    return `${linePart} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
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
              x={padLeft - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="11"
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={buildPath("expenses")}
          fill="none"
          stroke="var(--v2-primary-dark)"
          strokeWidth="2"
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
            fontSize="11"
            fill="var(--v2-text-muted)"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}
