import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  href: string;
  badge?: string;
  title: string;
  description: string;
  meta?: string;
  ctaLabel: string;
  featured?: boolean;
}

export default function ToolCard({
  href,
  badge,
  title,
  description,
  meta,
  ctaLabel,
  featured,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`alati-hub__card${featured ? " alati-hub__card--featured" : " alati-hub__card--secondary"}`}
    >
      {badge && <span className="alati-hub__card-badge">{badge}</span>}
      <h2 className="alati-hub__card-title">{title}</h2>
      <p className="alati-hub__card-desc">{description}</p>
      {meta && <p className="alati-hub__card-meta">{meta}</p>}
      <span className="alati-hub__card-cta">
        <span>{ctaLabel}</span>
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
