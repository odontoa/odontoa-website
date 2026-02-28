"use client";

export function BarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxBarHeight = 140;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart area with grid */}
      <div className="flex-1 relative flex items-end justify-between gap-3 mb-2">
        {/* Very subtle grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full border-t border-slate-100" />
          ))}
        </div>

        {/* Bars */}
        {data.map((item, idx) => {
          const height = (item.value / maxValue) * maxBarHeight;
          const isMax = item.value === maxValue;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: maxBarHeight }}
              >
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ease-out ${
                    isMax ? "bg-blue-600" : "bg-blue-400"
                  }`}
                  style={{ height: `${height}px` }}
                />
              </div>
              <div className="text-sm text-slate-600 font-medium text-center">
                {item.label}
              </div>
              <div className="text-base font-semibold text-slate-900">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
