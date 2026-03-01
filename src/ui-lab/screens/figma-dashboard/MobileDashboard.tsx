// Figma Mobile: node-id=291-9656
"use client";

import Image from "next/image";
import {
  Search,
  ArrowUpRight,
  MoreHorizontal,
  Activity,
} from "lucide-react";
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
  statusLabels,
} from "./shared";

// ─── Mobile Navbar (no sidebar, logo + title + actions) ───

function MobileNavbar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]"
      style={{ background: "var(--v2-surface)" }}
    >
      <div className="flex items-center gap-[8px]">
        <Image
          src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
          alt="Odontoa"
          width={32}
          height={32}
          className="h-[32px] w-[32px] object-contain"
        />
        <h1
          className="font-semibold leading-[1.2]"
          style={{ fontSize: "18px", color: "var(--v2-text)" }}
        >
          Kontrolna tabla
        </h1>
      </div>
      <div className="flex items-center gap-[8px]">
        <button
          className="flex items-center justify-center transition-opacity hover:opacity-80"
          style={{
            padding: "8px",
            borderRadius: "20px",
            background: "var(--v2-primary-bg)",
          }}
        >
          <Search className="h-[18px] w-[18px]" style={{ color: "var(--v2-primary-dark)" }} />
        </button>
        <div
          className="flex items-center justify-center font-semibold text-[11px] overflow-hidden"
          style={{
            height: "32px",
            width: "32px",
            borderRadius: "var(--v2-radius-avatar)",
            background: "var(--v2-primary)",
            color: "var(--v2-primary-fg)",
          }}
        >
          MM
        </div>
      </div>
    </header>
  );
}

// ─── Main Mobile Layout ───────────────────────────────────

export default function MobileDashboard({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--v2-surface)" }}
    >
      <MobileNavbar />

      {/* Content area — rounded top, gray bg */}
      <main
        className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[16px] rounded-t-[24px]"
        style={{ background: "var(--v2-bg)" }}
      >
        {/* Greeting card — vertical chips */}
        <div
          className="flex flex-col gap-[20px] pb-[20px] pt-[24px] px-[16px]"
          style={{
            background: "var(--v2-primary-bg)",
            borderRadius: "var(--v2-radius-card)",
          }}
        >
          <div className="flex flex-col gap-[7px]">
            <h2
              className="font-bold leading-[1.1]"
              style={{ fontSize: "20px", color: "var(--v2-text)" }}
            >
              Zdravo, Dr Marko Marković! 👋
            </h2>
            <p
              className="leading-[1.3]"
              style={{ fontSize: "13px", color: "var(--v2-text)" }}
            >
              Dobrodošli na kontrolnu tablu. Evo brzog pregleda rasporeda vaše ordinacije danas.
            </p>
          </div>
          {/* Brze akcije */}
          <div className="flex flex-col gap-[8px] items-start">
            {["Zakaži termin", "Dodaj pacijenta", "Vidi sve pacijente"].map((label) => (
              <button
                key={label}
                className="px-[14px] py-[9px] text-[13px] font-medium leading-[1.25] transition-opacity hover:opacity-75"
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

        {/* Stats — stacked, horizontal card layout */}
        <div className="flex flex-col gap-[12px]">
          {mockV2Stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-[12px] px-[14px] py-[14px]"
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
                  style={{ fontSize: "20px", color: "var(--v2-primary-dark)" }}
                >
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Earning Statistics */}
        <div
          className="p-[16px] flex flex-col gap-[12px]"
          style={{
            background: "var(--v2-surface)",
            borderRadius: "var(--v2-radius-card)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold leading-[1.25]"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Statistika zarade
            </h3>
            <DropdownPill size="md">Ove godine</DropdownPill>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[11px] leading-[1.24]" style={{ color: "var(--v2-text-muted)" }}>
                  Ukupan prihod
                </span>
                <span
                  className="font-bold leading-[1.1]"
                  style={{ fontSize: "20px", color: "var(--v2-primary-dark)" }}
                >
                  $129,850
                </span>
              </div>
              <div className="flex items-center gap-[16px]">
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Dobit</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary-dark)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Troškovi</span>
                </div>
              </div>
            </div>
            <LineAreaChart data={mockV2EarningStats} height={160} smooth />
          </div>
        </div>

        {/* Patients by Age Stages */}
        <div
          className="p-[16px] flex flex-col gap-[12px]"
          style={{
            background: "var(--v2-surface)",
            borderRadius: "var(--v2-radius-card)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold leading-[1.25]"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Pacijenti po starosnim grupama
            </h3>
            <DropdownPill size="md">Ove nedelje</DropdownPill>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[11px] leading-[1.24]" style={{ color: "var(--v2-text-muted)" }}>
                  Ukupno pacijenata
                </span>
                <span className="font-bold leading-[1.1]" style={{ fontSize: "20px", color: "var(--v2-primary-dark)" }}>
                  685
                </span>
              </div>
              <div className="flex items-center gap-[16px]">
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-border)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Children</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Teens</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary-dark)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Adults</span>
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
              height={160}
            />
          </div>
        </div>

        {/* Patients by Gender */}
        <div
          className="p-[16px] flex flex-col gap-[12px]"
          style={{
            background: "var(--v2-surface)",
            borderRadius: "var(--v2-radius-card)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold leading-[1.25]"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Pacijenti po polu
            </h3>
            <DropdownPill size="md">Poslednjih 7 meseci</DropdownPill>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[11px] leading-[1.24]" style={{ color: "var(--v2-text-muted)" }}>
                  Ukupno pacijenata
                </span>
                <span className="font-bold leading-[1.1]" style={{ fontSize: "20px", color: "var(--v2-primary-dark)" }}>
                  17,498
                </span>
              </div>
              <div className="flex items-center gap-[16px]">
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary-dark)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Muški</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block flex-shrink-0" style={{ width: "8px", height: "8px", borderRadius: "4px", background: "var(--v2-primary)" }} />
                  <span className="text-[11px] leading-[1.3]" style={{ color: "var(--v2-text)" }}>Ženski</span>
                </div>
              </div>
            </div>
            <GroupedBarChart
              data={mockV2GenderStats}
              labelKey="day"
              series={[
                { key: "male",   color: "var(--v2-primary-dark)" },
                { key: "female", color: "var(--v2-primary)" },
              ]}
              height={220}
              variant="stacked"
            />
          </div>
        </div>

        {/* Patients by Consultation — full width */}
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
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
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
            size={120}
          />
        </div>

        {/* Doctor List — full width */}
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
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Lista doktora
            </h3>
            <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
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
                      className="text-[13px] font-medium leading-[1.25] truncate"
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
                  <div className="my-[8px] h-px" style={{ background: "var(--v2-border)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Counselling List — short table, overflow-x-auto */}
        <div
          className="p-[16px]"
          style={{
            background: "var(--v2-surface)",
            borderRadius: "var(--v2-radius-card)",
          }}
        >
          <div className="flex items-center justify-between mb-[12px] gap-[8px]">
            <h3
              className="font-semibold flex-shrink-0"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Lista savetovanja
            </h3>
            <div className="flex items-center gap-2">
              <DropdownPill size="md">Ove nedelje</DropdownPill>
              <button
                className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-90"
                style={{
                  padding: "7px 12px",
                  borderRadius: "var(--v2-radius-pill)",
                  background: "var(--v2-primary)",
                  color: "var(--v2-primary-fg)",
                }}
              >
                Sve <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr style={{ background: "var(--v2-input-bg)" }}>
                  {["Datum i vreme", "Ime", "Doktor", "Termin za", "Status"].map((h) => (
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
          <div className="flex items-center justify-between mb-[12px]">
            <h3
              className="font-semibold"
              style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}
            >
              Nedavna aktivnost
            </h3>
            <button className="transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)" }}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-[11px]">
            {mockV2RecentActivity.map((item, i) => (
              <div key={i} className="flex gap-[8px] items-start">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    height: "28px",
                    width: "28px",
                    borderRadius: "14px",
                    background: "var(--v2-primary)",
                  }}
                >
                  <Activity className="h-3.5 w-3.5" style={{ color: "var(--v2-primary-fg)" }} />
                </div>
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <div style={{ fontSize: "10px", color: "var(--v2-text-muted)", lineHeight: "1.3" }}>
                    {item.time}
                  </div>
                  <div style={{ fontSize: "12px", lineHeight: "1.5", color: "var(--v2-text)" }}>
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — stacked, centered */}
        <footer
          className="flex flex-col items-center gap-[4px] py-[12px]"
          style={{ fontSize: "11px", color: "var(--v2-text-muted)" }}
        >
          <span>Copyright &copy; 2026 Odontoa</span>
          <div className="flex items-center gap-[8px]">
            <span className="hover:opacity-80 cursor-pointer">Politika privatnosti</span>
            <span>&middot;</span>
            <span className="hover:opacity-80 cursor-pointer">Uslovi korišćenja</span>
            <span>&middot;</span>
            <span className="hover:opacity-80 cursor-pointer">Kontakt</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
