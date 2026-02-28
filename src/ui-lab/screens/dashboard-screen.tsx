"use client";

import {
  Users,
  Calendar,
  Stethoscope,
  UserPlus,
  Zap,
  Activity,
} from "lucide-react";
import { BarChart } from "@/ui-lab/components/charts/bar-chart";
import { DonutChart } from "@/ui-lab/components/charts/donut-chart";
import {
  mockMetrics,
  mockQuickActions,
  mockAppointmentStatus,
  mockWeeklyAppointments,
  mockTodayAppointments,
  mockRecentActivity,
  mockUser,
} from "@/ui-lab/mock-data";

const quickActionIcons = [UserPlus, Calendar, Users];

export default function DashboardScreen() {
  return (
    <div className="flex flex-col space-y-6 p-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {mockUser.initials}
        </div>
        <div>
          <h1 className="text-2xl tracking-tight">
            <span className="text-slate-500 font-medium">
              Dobrodošli nazad,
            </span>
            <br />
            <span className="text-slate-900 font-semibold">
              Dr {mockUser.firstName} {mockUser.lastName}
            </span>
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base text-slate-500 font-semibold">
              Ukupno pacijenata
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {mockMetrics.totalPatients}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base text-slate-500 font-semibold">
              Termini danas
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {mockMetrics.todayAppointments}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base text-slate-500 font-semibold">
              Aktivni stomatolozi
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {mockMetrics.activeDentists}
          </div>
        </div>
      </div>

      {/* Brze akcije */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-blue-600" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Brze akcije
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockQuickActions.map((action, idx) => {
            const Icon = quickActionIcons[idx];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-px transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-base font-semibold text-slate-900 mb-1">
                  {action.title}
                </div>
                <div className="text-sm text-slate-500">
                  {action.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status termina danas — DonutChart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Status termina danas
            </h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <DonutChart data={mockAppointmentStatus} />
          </div>
        </div>

        {/* Termini po danima — BarChart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Termini po danima
            </h3>
          </div>
          <div className="flex-1 flex items-end min-h-0">
            <BarChart data={mockWeeklyAppointments} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Appointments + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Današnji termini */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium tracking-tight text-slate-900">
                Današnji termini ({mockMetrics.todayAppointments})
              </h3>
            </div>
          </div>
          <div className="space-y-2.5 flex-1">
            {mockTodayAppointments.slice(0, 4).map((apt, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex-shrink-0 w-14 text-base font-semibold text-slate-700">
                  {apt.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-slate-900 truncate">
                    {apt.patient}
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {apt.procedure}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button className="w-full py-2.5 px-3 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              Vidi sve termine za danas &rarr;
            </button>
          </div>
        </div>

        {/* Nedavna aktivnost */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium tracking-tight text-slate-900">
              Nedavna aktivnost
            </h3>
          </div>
          <div className="space-y-2.5 flex-1">
            {mockRecentActivity.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <Icon
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${activity.color}`}
                  />
                  <div className="text-base text-slate-700 flex-1">
                    {activity.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
