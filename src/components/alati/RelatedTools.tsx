import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedTool {
  href: string;
  title: string;
}

export default function RelatedTools({ tools }: { tools: RelatedTool[] }) {
  if (tools.length === 0) return null;
  return (
    <section className="alati-related">
      <h2 className="alati-related__title">Povezani alati</h2>
      <ul className="alati-related__list">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link href={tool.href} className="alati-related__link">
              <span>{tool.title}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
