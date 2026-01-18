import Link from "next/link";
import {
  FileText,
  Calendar,
  Package,
  Users,
  BarChart,
  Megaphone,
} from "lucide-react";

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  highlighted?: boolean;
}

const topics: Topic[] = [
  {
    id: "digitalna-kartoteka",
    title: "Digitalna kartoteka",
    description: "Upravljajte kartama pacijenata efikasno i bez papira",
    icon: FileText,
    href: "/blogovi?tema=digitalna-kartoteka",
    highlighted: true,
  },
  {
    id: "zakazivanje",
    title: "Zakazivanje",
    description: "Automatizujte proces zakazivanja termina",
    icon: Calendar,
    href: "/blogovi?tema=zakazivanje",
  },
  {
    id: "zalihe",
    title: "Zalihe",
    description: "Pratite i upravljajte zalihama u realnom vremenu",
    icon: Package,
    href: "/blogovi?tema=zalihe",
  },
  {
    id: "tim-i-smene",
    title: "Tim i smene",
    description: "Organizujte tim i raspored smena bez komplikacija",
    icon: Users,
    href: "/blogovi?tema=tim-i-smene",
  },
  {
    id: "analitika",
    title: "Analitika",
    description: "Koristite podatke za bolje poslovne odluke",
    icon: BarChart,
    href: "/blogovi?tema=analitika",
  },
  {
    id: "marketing",
    title: "Marketing za ordinacije",
    description: "Privucite nove pacijente i zadržite postojeće",
    icon: Megaphone,
    href: "/blogovi?tema=marketing",
  },
];

export function TopicCarousel() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-3">
            Saveti i vodiči za efikasniji rad
          </h2>
          <p className="text-muted-foreground text-lg">
            Otkrijte vredne uvide za optimizaciju vašeg poslovanja i maksimalnu efikasnost
          </p>
        </div>

        {/* Topic Cards - Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0 scrollbar-hide">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isHighlighted = topic.highlighted;

            return (
              <Link
                key={topic.id}
                href={topic.href}
                className={`group flex-shrink-0 w-80 md:w-auto flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                  isHighlighted
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-foreground border-border hover:shadow-md"
                }`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${
                    isHighlighted
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isHighlighted ? "text-primary-foreground" : "text-primary"
                    }`}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-normal mb-2 ${
                    isHighlighted ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {topic.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm mb-4 leading-relaxed flex-1 ${
                    isHighlighted
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {topic.description}
                </p>

                {/* Link */}
                <div
                  className={`inline-flex items-center gap-2 text-sm font-medium mt-auto ${
                    isHighlighted
                      ? "text-primary-foreground"
                      : "text-primary group-hover:gap-3 transition-all"
                  }`}
                >
                  Pogledaj vodiče
                  <span
                    className={`transition-transform ${
                      isHighlighted ? "" : "group-hover:translate-x-1"
                    }`}
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Arrow buttons (visual only for now) */}
        <div className="hidden lg:flex justify-end gap-2 mt-6">
          <button
            type="button"
            aria-label="Previous topics"
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            disabled
          >
            <span className="text-muted-foreground">←</span>
          </button>
          <button
            type="button"
            aria-label="Next topics"
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            disabled
          >
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
