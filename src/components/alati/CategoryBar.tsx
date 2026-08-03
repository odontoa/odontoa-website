"use client";

interface CategoryBarProps {
  label: string;
  percent: number;
}

function barColor(percent: number): string {
  if (percent < 35) return "#d97757";
  if (percent < 60) return "#d4a73a";
  if (percent < 80) return "#3a9d8f";
  return "var(--alati-accent)";
}

export default function CategoryBar({ label, percent }: CategoryBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="alati-category-bar">
      <div className="alati-category-bar__head">
        <span className="alati-category-bar__label">{label}</span>
        <span className="alati-category-bar__value">{clamped}%</span>
      </div>
      <div className="alati-category-bar__track">
        <div
          className="alati-category-bar__fill"
          style={{
            width: `${clamped}%`,
            background: barColor(clamped),
          }}
        />
      </div>
    </div>
  );
}
