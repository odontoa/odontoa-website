import {
  Calendar,
  CalendarDays,
  Stethoscope,
  Pill,
  DollarSign,
  Activity,
  ChevronDown,
  LayoutDashboard,
  MessageCircle,
  Users,
  Building2,
  Receipt,
  Mail,
  Wrench,
  FileText,
  CreditCard,
  BarChart3,
  ListChecks,
  FlaskConical,
  BookOpen,
  Info,
  type LucideIcon,
} from "lucide-react";

// ─── Sidebar nav items ─────────────────────────────────────

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  exact?: boolean;
  children?: NavItem[];
}

export const sidebarNav: NavItem[] = [
  { label: "Kontrolna tabla", icon: LayoutDashboard, href: "/ui-lab/figma-dashboard", exact: true },
  { label: "Kalendar",        icon: CalendarDays,    href: "/ui-lab/figma-dashboard/calendar" },
  { label: "Savetovanje",     icon: MessageCircle },
  { label: "Doktori",         icon: Stethoscope },
  { label: "Pacijenti",       icon: Users, href: "/ui-lab/pacijenti", exact: true },
  { label: "Odeljenja",       icon: Building2 },
  { label: "Lekovi",          icon: Pill },
  {
    label: "Finansije",
    icon: DollarSign,
    href: "/ui-lab/finansije/predracun",
    children: [
      { label: "Predračun",  icon: FileText,   href: "/ui-lab/finansije/predracun" },
      { label: "Uplate",     icon: CreditCard, href: "/ui-lab/finansije/uplate" },
      { label: "Izveštaj tehnike", icon: Wrench, href: "/ui-lab/finansije/tehnika" },
      { label: "Izveštaji",  icon: BarChart3,  href: "/ui-lab/finansije/izvestaji" },
    ],
  },
  {
    label: "Ordinacija",
    icon: Building2,
    href: "/ui-lab/ordinacija/podaci",
    children: [
      { label: "Podaci",    icon: Info,         href: "/ui-lab/ordinacija/podaci" },
      { label: "Cenovnik",  icon: ListChecks,   href: "/ui-lab/ordinacija/cenovnik" },
      { label: "Tehnika",   icon: FlaskConical, href: "/ui-lab/ordinacija/tehnika" },
      { label: "MKB-10",    icon: BookOpen,     href: "/ui-lab/ordinacija/mkb-10" },
    ],
  },
  { label: "E-pošta",         icon: Mail, badge: 5 },
];

// Receipt is intentionally retained for a potential future "Računi" nav item
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _receiptForFutureRacuniItem = Receipt;

// ─── Stat icon helper ─────────────────────────────────────

export function statIcon(iconKey: string) {
  const isDark = iconKey === "calendar" || iconKey === "dollar";
  return (
    <div
      className="flex items-center justify-center p-[10px] flex-shrink-0"
      style={{
        borderRadius: "var(--v2-radius-icon)",
        background: isDark ? "var(--v2-primary-dark)" : "var(--v2-primary)",
      }}
    >
      {(() => {
        const cls = "h-5 w-5";
        const style = { color: "var(--v2-primary-fg)" };
        switch (iconKey) {
          case "calendar":    return <Calendar className={cls} style={style} />;
          case "stethoscope": return <Stethoscope className={cls} style={style} />;
          case "pill":        return <Pill className={cls} style={style} />;
          case "dollar":      return <DollarSign className={cls} style={style} />;
          default:            return <Activity className={cls} style={style} />;
        }
      })()}
    </div>
  );
}

// ─── Status labels & badge ────────────────────────────────

export const statusLabels: Record<string, string> = {
  Confirmed: "Potvrđeno",
  Ongoing: "U toku",
  Cancelled: "Otkazano",
  Pending: "Na čekanju",
  Available: "Dostupno",
  "Full Booked": "Potpuno popunjeno",
  "On Duty": "Na dužnosti",
  Absent: "Odsutan",
};

export function StatusBadge({ status }: { status: string }) {
  const varMap: Record<string, { bg: string; fg: string }> = {
    Confirmed:    { bg: "var(--v2-status-confirmed-bg)", fg: "var(--v2-status-confirmed-fg)" },
    Ongoing:      { bg: "var(--v2-status-ongoing-bg)",   fg: "var(--v2-status-ongoing-fg)" },
    Cancelled:    { bg: "var(--v2-status-cancelled-bg)", fg: "var(--v2-status-cancelled-fg)" },
    Pending:      { bg: "var(--v2-status-pending-bg)",   fg: "var(--v2-status-pending-fg)" },
    Available:    { bg: "var(--moodify-green-light)",    fg: "var(--moodify-on-surface)" },
    "Full Booked":{ bg: "var(--moodify-yellow-light)",   fg: "var(--moodify-on-surface)" },
    "On Duty":    { bg: "var(--v2-status-ongoing-bg)",   fg: "var(--v2-status-ongoing-fg)" },
    Absent:       { bg: "var(--v2-status-cancelled-bg)", fg: "var(--v2-status-cancelled-fg)" },
  };
  const colors = varMap[status] ?? { bg: "var(--v2-input-bg)", fg: "var(--v2-text-muted)" };
  const label = statusLabels[status] ?? status;
  return (
    <span
      className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]"
      style={{
        borderRadius: "var(--v2-radius-badge)",
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {label}
    </span>
  );
}

// ─── Chart card header (title+value left | dropdown+legends right) ──

interface LegendItem { label: string; color: string }

export function ChartCardHeader({
  title,
  dropdownLabel,
  subtext,
  value,
  legends,
  legendGap = "25px",
}: {
  title: string;
  dropdownLabel: string;
  subtext: string;
  value: string;
  legends: LegendItem[];
  /** Gap between legend items — use "16px" on tablet for 3-legend cards to prevent overflow */
  legendGap?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
      {/* Left: title, then subtext + value — min-w-0 prevents overflow */}
      <div className="flex flex-col gap-[12px] min-w-0">
        <h3
          className="font-semibold leading-[1.25]"
          style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
        >
          {title}
        </h3>
        <div className="flex flex-col gap-[4px]">
          <span
            className="text-[11px] leading-[1.24]"
            style={{ color: "var(--v2-text-muted)" }}
          >
            {subtext}
          </span>
          <span
            className="font-bold leading-[1.1]"
            style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}
          >
            {value}
          </span>
        </div>
      </div>
      {/* Right: shrink-0 + whitespace-nowrap keeps dropdown in one line */}
      <div className="flex flex-col items-end gap-[12px] shrink-0 whitespace-nowrap">
        <DropdownPill>{dropdownLabel}</DropdownPill>
        {/* flex-wrap + whitespace-normal so legends can wrap on narrow viewports */}
        <div className="flex items-center flex-wrap whitespace-normal" style={{ gap: legendGap }}>
          {legends.map((l) => (
            <div key={l.label} className="flex items-center gap-[8px]">
              <span
                className="inline-block flex-shrink-0"
                style={{ width: "8px", height: "8px", borderRadius: "4px", background: l.color }}
              />
              <span className="text-[12px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dropdown pill button ─────────────────────────────────

export function DropdownPill({
  children,
  size = "sm",
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  const isMd = size === "md";
  return (
    <button
      className={`flex items-center gap-1 font-medium transition-opacity hover:opacity-80 ${isMd ? "text-[12px]" : "text-[10px]"}`}
      style={{
        paddingLeft: isMd ? "14px" : "10px",
        paddingRight: isMd ? "12px" : "8px",
        paddingTop: isMd ? "8px" : "6px",
        paddingBottom: isMd ? "8px" : "6px",
        borderRadius: "var(--v2-radius-pill)",
        background: "var(--v2-primary-bg)",
        color: "var(--v2-text)",
      }}
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}
