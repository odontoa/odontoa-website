import {
  Calendar,
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
  type LucideIcon,
} from "lucide-react";

// ─── Sidebar nav items ─────────────────────────────────────

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  children?: NavItem[];
}

export const sidebarNav: NavItem[] = [
  { label: "Kontrolna tabla", icon: LayoutDashboard, href: "/ui-lab/figma-dashboard" },
  { label: "Savetovanje",     icon: MessageCircle },
  { label: "Doktori",         icon: Stethoscope },
  { label: "Pacijenti",       icon: Users },
  { label: "Tehnika",         icon: Wrench,          href: "/ui-lab/technika" },
  { label: "Odeljenja",       icon: Building2 },
  { label: "Lekovi",          icon: Pill },
  {
    label: "Finansije",
    icon: DollarSign,
    href: "/ui-lab/finansije",
    children: [
      { label: "Predračun",  icon: FileText,   href: "/ui-lab/finansije/predracun" },
      { label: "Uplate",     icon: CreditCard, href: "/ui-lab/finansije/uplate" },
      { label: "Tehnika",    icon: Wrench,     href: "/ui-lab/finansije/tehnika" },
      { label: "Izveštaji",  icon: BarChart3,  href: "/ui-lab/finansije/izvestaji" },
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
