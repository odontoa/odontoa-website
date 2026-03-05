// Figma: https://www.figma.com/design/mYp2a6a5Lmanh6P1Dk6FId/Moodify---Mental-Health-Analytics-Admin-Dashboard--Community-?node-id=16:1146
"use client";

import Image from "next/image";
import {
  Search,
  Settings,
  Bell,
  ArrowUpRight,
  MoreHorizontal,
  Activity,
} from "lucide-react";
import { FigmaDesktopSidebar } from "./sidebars";
import { DonutChart } from "@/ui-lab/components/charts/donut-chart";
import { LineAreaChart } from "@/ui-lab/components/charts/line-area-chart";
import { GroupedBarChart } from "@/ui-lab/components/charts/grouped-bar-chart";
import {
  mockV2Stats,
  mockV2EarningStats,
  mockV2AgeStages,
  mockV2GenderStats,
  mockV2ConsultationTypes,
  mockV2DoctorsList,
  mockV2CounsellingList,
  mockV2RecentActivity,
} from "@/ui-lab/mock-data";
import {
  statIcon,
  StatusBadge,
  DropdownPill,
  ChartCardHeader,
  statusLabels,
} from "./shared";

// ─── Topbar ───────────────────────────────────────────────

function FigmaTopbar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 pl-[4px]"
      style={{ height: "var(--v2-topbar-h)" }}
    >
      {/* Title — Figma: 22px SemiBold, w-[340px] h-[40px] py-[2px] */}
      <div className="flex flex-col justify-center flex-shrink-0 py-[2px]" style={{ width: "340px" }}>
        <h1
          className="font-semibold leading-[1.2]"
          style={{ fontSize: "22px", color: "var(--v2-text)" }}
        >
          Kontrolna tabla
        </h1>
      </div>

      {/* Header Menu — Figma: gap-[12px], all items grouped right */}
      <div className="flex items-center gap-[12px] flex-shrink-0">
        {/* Search — Figma: w-330 px-13 py-9 rounded-20 gap-6 */}
        <div className="relative flex-shrink-0">
          <Search
            className="absolute left-[13px] top-1/2 -translate-y-1/2 h-[18px] w-[18px]"
            style={{ color: "var(--v2-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Pretraga"
            className="pl-[37px] pr-[13px] py-[9px] text-[14px] focus:outline-none placeholder:text-[var(--v2-text-muted)]"
            style={{
              width: "330px",
              background: "var(--v2-input-bg)",
              borderRadius: "var(--v2-radius-pill)",
              border: "none",
              color: "var(--v2-text)",
            }}
          />
        </div>

        {/* Settings — Figma: p-10 rounded-20 bg-purple-bg icon-20x20 */}
        <button
          className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
          style={{
            padding: "10px",
            borderRadius: "20px",
            background: "var(--v2-primary-bg)",
          }}
        >
          <Settings className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
        </button>

        {/* Bell — Figma: same as Settings + badge */}
        <button
          className="relative flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
          style={{
            padding: "10px",
            borderRadius: "20px",
            background: "var(--v2-primary-bg)",
          }}
        >
          <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
          <span
            className="absolute h-[8px] w-[8px] rounded-full"
            style={{ top: "4px", right: "4px", background: "var(--v2-primary)" }}
          />
        </button>

        {/* User Profile — Figma: gap-[12px] avatar(40x40 rounded-32) + name */}
        <div className="flex items-center gap-[12px] flex-shrink-0">
          <div
            className="flex items-center justify-center font-semibold flex-shrink-0 text-[12px] overflow-hidden"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "var(--v2-radius-avatar)",
              background: "var(--v2-primary)",
              color: "var(--v2-primary-fg)",
            }}
          >
            MM
          </div>
          <div className="hidden sm:flex flex-col gap-[2px]">
          <div
            className="font-bold leading-[1.2]"
            style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
          >
            Dr Marko Marković
          </div>
          <div
            className="leading-[1.3]"
            style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}
          >
            Administrator
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Main Screen ──────────────────────────────────────────

export default function DesktopDashboard({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-bg)" }}
    >
      <FigmaDesktopSidebar />

      {/* Main column — Figma: Content frame pr-[24px] py-[16px], white surface bg */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]"
        style={{ background: "var(--v2-surface)" }}
      >
        <FigmaTopbar />

        {/* Body — Figma: gray rounded-[24px] inset panel, overflow-clip */}
        <main
          className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]"
          style={{ background: "var(--v2-bg)" }}
        >

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
                  Zdravo, Dr Marko Marković! 👋
                </h2>
                <p
                  className="leading-[1.2]"
                  style={{ fontSize: "16px", color: "var(--v2-text)" }}
                >
                  Dobrodošli na kontrolnu tablu. Evo brzog pregleda rasporeda vaše ordinacije danas.
                </p>
              </div>
              {/* Brze akcije */}
              <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
                {["Zakaži termin", "Dodaj pacijenta", "Vidi sve pacijente"].map((label) => (
                  <button
                    key={label}
                    className="px-[16px] py-[10px] text-[14px] font-medium leading-[1.25] flex-shrink-0 transition-opacity hover:opacity-75"
                    style={{
                      background: "var(--v2-surface)",
                      borderRadius: "var(--v2-radius-pill)",
                      border: "1px solid var(--v2-border)",
                      color: "var(--v2-primary-dark)",
                    }}
                  >
                    {label}
                  </button>
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
              <ChartCardHeader
                title="Statistika zarade"
                dropdownLabel="Ove godine"
                subtext="Ukupan prihod"
                value="$129,850"
                legends={[
                  { label: "Dobit",    color: "var(--v2-primary)" },
                  { label: "Troškovi", color: "var(--v2-primary-dark)" },
                ]}
              />
              <LineAreaChart data={mockV2EarningStats} height={186} smooth />
            </div>

            {/* Patients by Age Stages — same structure as Earning widget */}
            <div
              className="p-[16px] flex flex-col gap-[12px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <ChartCardHeader
                title="Pacijenti po starosnim grupama"
                dropdownLabel="Ove nedelje"
                subtext="Ukupno pacijenata"
                value="685"
                legends={[
                  { label: "Children", color: "var(--v2-border)" },
                  { label: "Teens",    color: "var(--v2-primary)" },
                  { label: "Adults",   color: "var(--v2-primary-dark)" },
                ]}
              />
              <GroupedBarChart
                data={mockV2AgeStages}
                labelKey="day"
                series={[
                  { key: "children", color: "var(--v2-border)" },
                  { key: "teens",    color: "var(--v2-primary)" },
                  { key: "adults",   color: "var(--v2-primary-dark)" },
                ]}
                height={186}
              />
            </div>
          </div>

          {/* Row 3: Gender + Consultation + Doctors — Figma: 557:268:268 ≈ 2.08:1:1 */}
          <div className="grid grid-cols-[2.08fr_1fr_1fr] gap-[20px]">

            {/* Patients by Gender */}
            <div
              className="p-[16px] flex flex-col gap-[12px]"
              style={{
                background: "var(--v2-surface)",
                borderRadius: "var(--v2-radius-card)",
              }}
            >
              <ChartCardHeader
                title="Pacijenti po polu"
                dropdownLabel="Poslednjih 7 meseci"
                subtext="Ukupno pacijenata"
                value="17,498"
                legends={[
                  { label: "Muški",  color: "var(--v2-primary-dark)" },
                  { label: "Ženski", color: "var(--v2-primary)" },
                ]}
              />
              <GroupedBarChart
                data={mockV2GenderStats}
                labelKey="day"
                series={[
                  { key: "male",   color: "var(--v2-primary-dark)" },
                  { key: "female", color: "var(--v2-primary)" },
                ]}
                height={212}
                variant="stacked"
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
                  Pacijenti po tipu konsultacije
                </h3>
                <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <DonutChart
                data={mockV2ConsultationTypes}
                legendBelow={true}
                centerLabel="Ukupno pacijenata"
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
                  Lista doktora
                </h3>
                <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              {/* Figma: items h-36px, divider lines between rows, 10px gap each side of line */}
              <div className="flex flex-col">
                {mockV2DoctorsList.map((doc, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-[8px] h-[36px]">
                      <div
                        className="flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          height: "36px",
                          width: "36px",
                          borderRadius: "var(--v2-radius-avatar)",
                          background: "var(--v2-primary-bg)",
                          color: "var(--v2-primary-dark)",
                        }}
                      >
                        {doc.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[14px] font-medium leading-[1.25] truncate"
                          style={{ color: "var(--v2-text-heading)" }}
                        >
                          {doc.name}
                        </div>
                        <div
                          className="text-[10px] leading-[1.3] truncate"
                          style={{ color: "var(--v2-text-muted)" }}
                        >
                          {doc.specialty}
                        </div>
                      </div>
                      {/* Plain colored text status per Figma — no filled badge */}
                      <span
                        className="text-[10px] leading-[1.3] flex-shrink-0 text-right"
                        style={{
                          color: doc.status === "Available"    ? "var(--moodify-green)"
                               : doc.status === "Full Booked"  ? "var(--moodify-yellow)"
                               : doc.status === "On Duty"      ? "var(--v2-primary)"
                               : doc.status === "Absent"       ? "var(--moodify-red)"
                               : "var(--v2-text-muted)",
                        }}
                      >
                        {statusLabels[doc.status] ?? doc.status}
                      </span>
                    </div>
                    {i < mockV2DoctorsList.length - 1 && (
                      <div
                        className="my-[10px] h-px"
                        style={{ background: "var(--v2-border)" }}
                      />
                    )}
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
                  Lista savetovanja
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-[8px] top-1/2 -translate-y-1/2 h-3 w-3"
                      style={{ color: "var(--v2-text-muted)" }}
                    />
                    <input
                      type="text"
                      placeholder="Pretraga pacijenta, doktora..."
                      className="pl-6 pr-[8px] py-[6px] text-[11px] focus:outline-none"
                      style={{
                        width: "223px",
                        background: "var(--v2-input-bg)",
                        borderRadius: "16px",
                        border: "none",
                        color: "var(--v2-text)",
                      }}
                    />
                  </div>
                  <DropdownPill>Ove nedelje</DropdownPill>
                  <button
                    className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-90"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--v2-radius-pill)",
                      background: "var(--v2-primary)",
                      color: "var(--v2-primary-fg)",
                    }}
                  >
                    Prikaži sve <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--v2-input-bg)" }}>
                      {["ID pacijenta", "Datum i vreme", "Ime", "Doktor", "Termin za", "Izveštaj", "Status"].map((h) => (
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
              className="p-[16px] flex flex-col"
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
                  Nedavna aktivnost
                </h3>
                <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              {/* Figma: items justify-between (space-between), gap-11px, icon size-30px, inner icon 16px, info gap-3px */}
              <div className="flex flex-col justify-between flex-1 gap-[11px]">
                {mockV2RecentActivity.map((item, i) => (
                  <div key={i} className="flex gap-[8px] items-start">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "15px",
                        background: "var(--v2-primary)",
                      }}
                    >
                      <Activity className="h-4 w-4" style={{ color: "var(--v2-primary-fg)" }} />
                    </div>
                    <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                      <div style={{ fontSize: "10px", color: "var(--v2-text-muted)", lineHeight: "1.3" }}>
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
            Copyright &copy; 2026 Odontoa &middot;{" "}
            <span className="hover:opacity-80 cursor-pointer">Politika privatnosti</span>{" "}
            &middot;{" "}
            <span className="hover:opacity-80 cursor-pointer">Uslovi korišćenja</span>{" "}
            &middot;{" "}
            <span className="hover:opacity-80 cursor-pointer">Kontakt</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
