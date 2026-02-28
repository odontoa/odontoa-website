// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146
// Tablet (later): node-id=288:7994 | Mobile (later): node-id=291:9656
"use client";

import {
  LayoutDashboard,
  MessageCircle,
  Stethoscope,
  Users,
  Building2,
  Pill,
  Receipt,
  Mail,
  LogOut,
  Search,
  Settings,
  Bell,
  Calendar,
  DollarSign,
  Activity,
  ChevronDown,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { DonutChart } from "@/ui-lab/components/charts/donut-chart";
import { LineAreaChart } from "@/ui-lab/components/charts/line-area-chart";
import { GroupedBarChart } from "@/ui-lab/components/charts/grouped-bar-chart";
import {
  mockV2Stats,
  mockV2TaskChips,
  mockV2EarningStats,
  mockV2AgeStages,
  mockV2GenderStats,
  mockV2ConsultationTypes,
  mockV2DoctorsList,
  mockV2CounsellingList,
  mockV2RecentActivity,
} from "@/ui-lab/mock-data";

// ─── Sidebar ─────────────────────────────────────────────

const sidebarNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Counselling", icon: MessageCircle, active: false },
  { label: "Doctors", icon: Stethoscope, active: false },
  { label: "Patients", icon: Users, active: false },
  { label: "Departments", icon: Building2, active: false },
  { label: "Medicines", icon: Pill, active: false },
  { label: "Invoices", icon: Receipt, active: false },
  { label: "Emails", icon: Mail, active: false, badge: 5 },
];

function FigmaSidebar() {
  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full w-[224px] min-[1440px]:w-[243px] px-[16px] py-[16px] gap-[12px]"
      style={{
        background: "var(--v2-surface)",
      }}
    >
      {/* Logo — Figma: 20px Regular, #2a2c4c, wrapped px-[8px] py-[4px] */}
      <div className="px-[8px] py-[4px]">
        <span
          className="text-[20px] font-normal leading-[1.1]"
          style={{ color: "var(--v2-primary-dark)" }}
        >
          moodify
        </span>
      </div>

      {/* Nav — Figma: gap-[8px], icon size-[32px], pl-[12px] pr-[8px] py-[12px] */}
      <nav className="flex-1 flex flex-col gap-[4px] overflow-y-auto">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center justify-between pl-[12px] pr-[8px] py-[8px] transition-colors"
              style={{
                borderRadius: "var(--v2-radius-nav)",
                background: item.active ? "var(--v2-primary)" : "transparent",
                color: item.active ? "var(--v2-primary-fg)" : "var(--v2-text-muted)",
              }}
            >
              <span className="flex items-center gap-[8px]">
                <Icon className="h-8 w-8 flex-shrink-0" />
                <span className="text-[14px] font-medium leading-none">
                  {item.label}
                </span>
              </span>
              {item.badge && (
                <span
                  className="flex items-center justify-center text-[10px] leading-[1.35]"
                  style={{
                    minWidth: "18px",
                    padding: "2px",
                    borderRadius: "9px",
                    background: "var(--v2-primary)",
                    color: "var(--v2-primary-fg)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Promo banner — Figma: p-[16px] gap-[16px] rounded-[24px] bg-purple-bg */}
      <div
        className="flex flex-col gap-[16px] p-[16px]"
        style={{
          background: "var(--v2-primary-bg)",
          borderRadius: "24px",
        }}
      >
        {/* Logo symbol placeholder */}
        <span
          className="text-[24px] font-normal leading-[1.1]"
          style={{ color: "var(--v2-primary-dark)" }}
        >
          oo
        </span>
        <p className="text-[14px] font-medium leading-[1.25]" style={{ color: "var(--v2-text)" }}>
          Simplify patient management, track appointments, and access key insights all in one place.
        </p>
        <button
          className="text-[14px] font-medium transition-opacity hover:opacity-90"
          style={{
            padding: "10px 16px",
            borderRadius: "var(--v2-radius-pill)",
            background: "var(--v2-primary)",
            color: "var(--v2-primary-fg)",
          }}
        >
          Upgrade 4.0
        </button>
      </div>

      {/* Logout — same item geometry as nav: pl-[12px] pr-[8px] py-[12px] gap-[8px] */}
      <button
        className="flex items-center gap-[8px] pl-[12px] pr-[8px] py-[8px] text-[14px] font-medium leading-none transition-colors hover:opacity-80"
        style={{
          borderRadius: "var(--v2-radius-nav)",
          color: "var(--v2-text-muted)",
        }}
      >
        <LogOut className="h-8 w-8 flex-shrink-0" />
        Logout
      </button>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────

function FigmaTopbar() {
  return (
    <header
      className="flex items-center gap-4 flex-shrink-0 pl-[4px] pr-[24px]"
      style={{
        height: "var(--v2-topbar-h)",
        background: "var(--v2-surface)",
      }}
    >
      {/* Title — Figma: 22px SemiBold (600), not Bold */}
      <h1
        className="font-semibold flex-shrink-0"
        style={{ fontSize: "22px", color: "var(--v2-text)" }}
      >
        Dashboard
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-xs mx-auto">
        <div className="relative">
          <Search
            className="absolute left-[13px] top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            style={{ color: "var(--v2-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search anything"
            className="pl-8 pr-[13px] py-[9px] text-[14px] focus:outline-none placeholder:text-[var(--v2-text-muted)]"
            style={{
              width: "237px",
              background: "var(--v2-input-bg)",
              borderRadius: "var(--v2-radius-pill)",
              border: "none",
              color: "var(--v2-text)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          className="flex items-center justify-center transition-opacity hover:opacity-80"
          style={{
            padding: "10px",
            borderRadius: "var(--v2-radius-icon)",
            background: "var(--v2-primary-bg)",
          }}
        >
          <Settings className="h-4 w-4" style={{ color: "var(--v2-primary-dark)" }} />
        </button>
        <button
          className="relative flex items-center justify-center transition-opacity hover:opacity-80"
          style={{
            padding: "10px",
            borderRadius: "var(--v2-radius-icon)",
            background: "var(--v2-primary-bg)",
          }}
        >
          <Bell className="h-4 w-4" style={{ color: "var(--v2-primary-dark)" }} />
          {/* Bell badge — Figma: size-[8px], top-[4px] right-[4px] */}
          <span
            className="absolute h-[8px] w-[8px] rounded-full"
            style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }}
          />
        </button>
        {/* User */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center font-semibold flex-shrink-0 text-[12px]"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "var(--v2-radius-avatar)",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            MW
          </div>
          {/* User name + role — Figma: gap-[2px] between them */}
          <div className="hidden sm:flex flex-col gap-[2px]">
            <div
              className="font-bold leading-[1.2]"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Milla Willow
            </div>
            <div
              className="leading-[1.3]"
              style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}
            >
              Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Stat icon helper ─────────────────────────────────────

function statIcon(iconKey: string) {
  return (
    <div
      className="flex items-center justify-center p-[10px]"
      style={{
        borderRadius: "var(--v2-radius-icon)",
        background: "var(--v2-primary)",
      }}
    >
      {(() => {
        const cls = "h-8 w-8";
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

// ─── Status badge ─────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
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
  return (
    <span
      className="text-[10px] font-medium whitespace-nowrap px-[8px] py-[4px]"
      style={{
        borderRadius: "var(--v2-radius-badge)",
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {status}
    </span>
  );
}

// ─── Dropdown pill button ─────────────────────────────────

function DropdownPill({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-80"
      style={{
        paddingLeft: "10px",
        paddingRight: "8px",
        paddingTop: "6px",
        paddingBottom: "6px",
        borderRadius: "var(--v2-radius-pill)",
        background: "var(--v2-primary-bg)",
        color: "var(--v2-text)",
      }}
    >
      {children}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}

// ─── Main Screen ──────────────────────────────────────────

export default function FigmaDashboardScreen() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaSidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <FigmaTopbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]">

          {/* Row 1: Welcome + Stats */}
          <div className="grid grid-cols-[1.9fr_1fr] gap-[20px]">

            {/* Greeting card — Figma: flex-col gap-[30px], pb-[20px] pt-[28px] px-[20px] */}
            <div
              className="flex flex-col gap-[30px] pb-[20px] pt-[28px] px-[20px]"
              style={{
                background: "var(--v2-primary-bg)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              {/* Title block — Figma: flex-col gap-[7px], both text #0b0b13 (Black) */}
              <div className="flex flex-col gap-[7px]">
                <h2
                  className="font-bold leading-[1.1]"
                  style={{ fontSize: "26px", color: "var(--v2-text)" }}
                >
                  Hello, Milla Willow! 👋
                </h2>
                <p
                  className="leading-[1.2]"
                  style={{ fontSize: "16px", color: "var(--v2-text)" }}
                >
                  Welcome to your dashboard. Here&rsquo;s a quick look at your clinic&rsquo;s schedule today.
                </p>
              </div>
              {/* Chips — Figma: gap-[12px], chip text #2a2c4c (primary-dark) */}
              <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
                {mockV2TaskChips.map((chip, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-[6px] pl-[6px] pr-[12px] py-[6px] flex-shrink-0"
                    style={{
                      background: "var(--v2-surface)",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      className="flex items-center justify-center text-[16px] font-bold leading-[1.2]"
                      style={{
                        padding: "4px",
                        borderRadius: "8px",
                        background: "var(--v2-primary)",
                        color: "var(--v2-primary-fg)",
                        minWidth: "27px",
                        textAlign: "center",
                      }}
                    >
                      {chip.count}
                    </div>
                    <span
                      className="text-[14px] font-normal leading-[1.25]"
                      style={{ color: "var(--v2-primary-dark)" }}
                    >
                      {chip.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats 2×2 — Figma: icon LEFT, info RIGHT, gap-[12px], px-[14px] py-[16px] */}
            <div className="grid grid-cols-2 gap-[20px]">
              {mockV2Stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[12px] px-[14px] py-[16px]"
                  style={{
                    background: "var(--v2-surface)",
                    borderRadius: "var(--v2-radius-card)",
                  }}
                >
                  {statIcon(stat.icon)}
                  <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                    <span
                      className="text-[11px] leading-[1.24]"
                      style={{ color: "var(--v2-text-muted)" }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="font-bold leading-[1.1]"
                      style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}
                    >
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Earning Statistics + Age Stages */}
          <div className="grid grid-cols-2 gap-[20px]">

            {/* Earning Statistics — Figma: flex-col gap-[12px] (header|body), body gap-[16px] (revenue+legends|chart) */}
            <div
              className="p-[16px] flex flex-col gap-[12px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              {/* Header row: title + dropdown */}
              <div className="flex items-center justify-between">
                <h3
                  className="font-semibold leading-[1.25]"
                  style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                >
                  Earning Statistics
                </h3>
                <DropdownPill>This Year</DropdownPill>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-[16px]">
                {/* Revenue & Legends row */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-[4px]">
                    <span
                      className="text-[11px] leading-[1.24]"
                      style={{ color: "var(--v2-text-muted)" }}
                    >
                      Total Revenue
                    </span>
                    <span
                      className="font-bold leading-[1.1]"
                      style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}
                    >
                      $129,850
                    </span>
                  </div>
                  {/* Legends — Figma: gap-[25px] between items, dot size-[8px] rounded-[4px], item gap-[8px] */}
                  <div className="flex items-center gap-[25px]">
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-block flex-shrink-0"
                        style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary)" }}
                      />
                      <span className="text-[12px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Profit</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-block flex-shrink-0"
                        style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary-dark)" }}
                      />
                      <span className="text-[12px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Expenses</span>
                    </div>
                  </div>
                </div>
                <LineAreaChart data={mockV2EarningStats} height={160} />
              </div>
            </div>

            {/* Patients by Age Stages — same structure as Earning widget */}
            <div
              className="p-[16px] flex flex-col gap-[12px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <h3
                  className="font-semibold leading-[1.25]"
                  style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                >
                  Patients by Age Stages
                </h3>
                <DropdownPill>This Week</DropdownPill>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-[16px]">
                {/* Revenue & Legends — Figma: Children=#e2e2e3 (Gray-Line = var(--v2-border)) */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-[4px]">
                    <span
                      className="text-[11px] leading-[1.24]"
                      style={{ color: "var(--v2-text-muted)" }}
                    >
                      Total Patients
                    </span>
                    <span
                      className="font-bold leading-[1.1]"
                      style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}
                    >
                      685
                    </span>
                  </div>
                  {/* Legends — gap-[25px], dot size-[8px] rounded-[4px] */}
                  <div className="flex items-center gap-[25px]">
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-block flex-shrink-0"
                        style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-border)" }}
                      />
                      <span className="text-[12px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Children</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-block flex-shrink-0"
                        style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary)" }}
                      />
                      <span className="text-[12px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Teens</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-block flex-shrink-0"
                        style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary-dark)" }}
                      />
                      <span className="text-[12px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Adults</span>
                    </div>
                  </div>
                </div>
                <GroupedBarChart
                  data={mockV2AgeStages}
                  labelKey="day"
                  series={[
                    { key: "children", color: "var(--v2-border)" },
                    { key: "teens",    color: "var(--v2-primary)" },
                    { key: "adults",   color: "var(--v2-primary-dark)" },
                  ]}
                  height={140}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Gender + Consultation + Doctors */}
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-[20px]">

            {/* Patients by Gender */}
            <div
              className="p-[16px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <div className="flex items-start justify-between mb-[12px]">
                <div>
                  <h3
                    className="font-semibold"
                    style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                  >
                    Patients by Gender
                  </h3>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: "var(--v2-text-muted)" }}
                  >
                    Total Patients
                  </div>
                  <div
                    className="font-bold mt-0.5"
                    style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}
                  >
                    17,498
                  </div>
                </div>
                <DropdownPill>Last 7 Months</DropdownPill>
              </div>
              <div className="flex gap-[16px] mb-[8px]">
                <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--v2-text)" }}>
                  <span className="h-2 w-2 rounded-full inline-block" style={{ background: "var(--v2-primary-dark)" }} />
                  Male
                </span>
                <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--v2-text)" }}>
                  <span className="h-2 w-2 rounded-full inline-block" style={{ background: "var(--v2-primary)" }} />
                  Female
                </span>
              </div>
              <GroupedBarChart
                data={mockV2GenderStats}
                labelKey="day"
                series={[
                  { key: "male",   color: "var(--v2-primary-dark)" },
                  { key: "female", color: "var(--v2-primary)" },
                ]}
                height={140}
              />
            </div>

            {/* Patients by Consultation */}
            <div
              className="p-[16px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <div className="flex items-center justify-between mb-[16px]">
                <h3
                  className="font-semibold"
                  style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                >
                  Patients by Consultation
                </h3>
                <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <DonutChart
                data={mockV2ConsultationTypes}
                legendBelow={true}
                centerLabel="Total Patients"
              />
            </div>

            {/* Doctor List */}
            <div
              className="p-[16px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <div className="flex items-center justify-between mb-[12px]">
                <h3
                  className="font-semibold"
                  style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                >
                  Doctor List
                </h3>
                <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-[12px]">
                {mockV2DoctorsList.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{
                        height: "32px",
                        width: "32px",
                        borderRadius: "var(--v2-radius-avatar)",
                        background: "var(--v2-primary-bg)",
                        color: "var(--v2-primary-dark)",
                      }}
                    >
                      {doc.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[12px] font-medium truncate"
                        style={{ color: "var(--v2-text-heading)" }}
                      >
                        {doc.name}
                      </div>
                      <div
                        className="text-[11px] truncate"
                        style={{ color: "var(--v2-text-muted)" }}
                      >
                        {doc.specialty}
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Counselling List + Recent Activity */}
          <div className="grid grid-cols-[3.15fr_1fr] gap-[20px]">

            {/* Counselling List */}
            <div
              className="p-[16px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <div className="flex items-center justify-between mb-[12px]">
                <h3
                  className="font-semibold"
                  style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                >
                  Counselling List
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-[8px] top-1/2 -translate-y-1/2 h-3 w-3"
                      style={{ color: "var(--v2-text-muted)" }}
                    />
                    <input
                      type="text"
                      placeholder="Search patient, doctor, etc"
                      className="pl-6 pr-[8px] py-[6px] text-[11px] focus:outline-none"
                      style={{
                        width: "180px",
                        background: "var(--v2-input-bg)",
                        borderRadius: "16px",
                        border: "none",
                        color: "var(--v2-text)",
                      }}
                    />
                  </div>
                  <DropdownPill>This Week</DropdownPill>
                  <button
                    className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-90"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--v2-radius-pill)",
                      background: "var(--v2-primary)",
                      color: "var(--v2-primary-fg)",
                    }}
                  >
                    View All <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--v2-input-bg)" }}>
                      {["Patient ID", "Date & Time", "Name", "Doctor", "Appoint For", "Report", "Status"].map((h) => (
                        <th
                          key={h}
                          className="pt-[10px] pb-[8px] px-[8px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]"
                          style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockV2CounsellingList.map((row, i) => (
                      <tr
                        key={i}
                        className="transition-colors hover:opacity-90"
                        style={{ borderBottom: "1px solid var(--v2-border)" }}
                      >
                        <td
                          className="py-[12px] px-[8px] font-mono whitespace-nowrap"
                          style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}
                        >
                          {row.id}
                        </td>
                        <td className="py-[12px] px-[8px] whitespace-nowrap">
                          <div style={{ fontSize: "12px", color: "var(--v2-text)" }}>{row.date}</div>
                          <div style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}>{row.time}</div>
                        </td>
                        <td
                          className="py-[12px] px-[8px] font-medium whitespace-nowrap"
                          style={{ fontSize: "12px", color: "var(--v2-text)" }}
                        >
                          {row.name}
                        </td>
                        <td
                          className="py-[12px] px-[8px] whitespace-nowrap"
                          style={{ fontSize: "12px", color: "var(--v2-text)" }}
                        >
                          {row.doctor}
                        </td>
                        <td
                          className="py-[12px] px-[8px] whitespace-nowrap"
                          style={{ fontSize: "12px", color: "var(--v2-text)" }}
                        >
                          {row.appointFor}
                        </td>
                        <td className="py-[12px] px-[8px] whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="h-[6px] w-[6px] rounded-full inline-block flex-shrink-0"
                              style={{ background: "var(--v2-primary)" }}
                            />
                            <span
                              style={{ fontSize: "12px", color: "var(--v2-text-heading)" }}
                            >
                              {row.report}
                            </span>
                          </span>
                        </td>
                        <td className="py-[12px] px-[8px]">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className="p-[16px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <div className="flex items-center justify-between mb-[16px]">
                <h3
                  className="font-semibold"
                  style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}
                >
                  Recent Activity
                </h3>
                <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {mockV2RecentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "15px",
                        background: "var(--v2-primary)",
                      }}
                    >
                      <Activity className="h-3.5 w-3.5" style={{ color: "var(--v2-primary-fg)" }} />
                    </div>
                    <div>
                      <div
                        className="mb-0.5"
                        style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}
                      >
                        {item.time}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          lineHeight: "1.64",
                          color: "var(--v2-text)",
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer
            className="text-center py-2"
            style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}
          >
            Copyright &copy; 2024 Peterdraw &middot;{" "}
            <span className="hover:opacity-80 cursor-pointer">Privacy Policy</span>{" "}
            &middot;{" "}
            <span className="hover:opacity-80 cursor-pointer">Term and conditions</span>{" "}
            &middot;{" "}
            <span className="hover:opacity-80 cursor-pointer">Contact</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
