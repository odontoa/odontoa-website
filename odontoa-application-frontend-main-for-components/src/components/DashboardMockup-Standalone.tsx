import {
  Home,
  Users,
  Stethoscope,
  Calendar,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  CalendarClock,
  Activity,
  DollarSign,
  Zap,
} from "lucide-react";

// Simple Bar Chart Component (Vertical bars)
export function BarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxBarHeight = 140;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart area with grid */}
      <div className="flex-1 relative flex items-end justify-between gap-3 mb-2">
        {/* Very subtle grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full border-t border-slate-100/50" />
          ))}
        </div>

        {/* Bars */}
        {data.map((item, idx) => {
          const height = (item.value / maxValue) * maxBarHeight;
          const isMax = item.value === maxValue;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: maxBarHeight }}
              >
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ease-out ${
                    isMax ? "bg-blue-600" : "bg-blue-400"
                  }`}
                  style={{ height: `${height}px` }}
                />
              </div>
              <div className="text-sm text-slate-600 font-medium text-center">
                {item.label}
              </div>
              <div className="text-base font-semibold text-slate-900">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple Donut Chart Component - Full 360° circle with three segments
export function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  // Handle empty data case
  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-slate-500">
          <div className="text-sm">Nema podataka za prikaz</div>
        </div>
      </div>
    );
  }

  // Calculate segments with cumulative offset
  let cumulativeOffset = 0;
  const segments = data.map((item) => {
    const percentage = item.value / total;
    const segmentLength = percentage * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += segmentLength;
    
    return {
      ...item,
      percentage,
      segmentLength,
      offset,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Inner circle background for depth */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - strokeWidth / 2}
            fill="#f8fafc"
            className="transform rotate-90 origin-center"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke="rgba(15, 23, 42, 0.04)"
            strokeWidth="1"
            className="transform rotate-90 origin-center"
          />

          {/* Donut segments - using strokeDasharray and strokeDashoffset */}
          {segments.map((segment, idx) => {
            // strokeDashoffset needs to be negative to move the dash pattern
            // We subtract the offset from circumference to position correctly
            const dashOffset = -segment.offset;
            
            return (
              <circle
                key={idx}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segment.segmentLength} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{
                  stroke: segment.color,
                }}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 leading-none">
              {total}
            </div>
            <div className="text-sm text-slate-500 mt-1">ukupno</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const percentage = Math.round((item.value / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-slate-700">
                  {item.label}
                </div>
                <div className="text-sm text-slate-500">
                  {item.value} ({percentage}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardMockup() {
  const statusData = [
    { label: "Zakazani", value: 10, color: "#2563eb" },
    { label: "Završeni", value: 5, color: "#22c55e" },
    { label: "Otkazani", value: 3, color: "#ef4444" },
  ];

  const appointmentsByDayData = [
    { label: "Ponedeljak", value: 14 },
    { label: "Utorak", value: 18 },
    { label: "Sreda", value: 16 },
    { label: "Četvrtak", value: 20 },
    { label: "Petak", value: 12 },
  ];

  const todayAppointments = [
    {
      time: "09:00",
      patient: "Ana Petrović",
      procedure: "Preventivni pregled",
    },
    { time: "10:30", patient: "Marko Ilić", procedure: "Plomba" },
    { time: "12:00", patient: "Jelena Marković", procedure: "Kontrola" },
    { time: "14:15", patient: "Stefan Jovanović", procedure: "Konsultacija" },
    { time: "16:00", patient: "Milica Nikolić", procedure: "Čišćenje kamenca" },
  ];

  const recentActivity = [
    {
      icon: UserPlus,
      text: "Novi pacijent dodat: Ivana Petrović",
      color: "text-blue-600",
    },
    {
      icon: CalendarClock,
      text: "Termin pomeren: Marko Ilić (10:30 → 11:00)",
      color: "text-blue-600",
    },
    {
      icon: CheckCircle2,
      text: "Završen pregled: Ana Petrović",
      color: "text-emerald-600",
    },
    {
      icon: MessageSquare,
      text: "Poslat SMS podsetnik: Jelena Marković",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="h-full w-full">
        {/* Main Dashboard Container */}
        <div
          className="bg-white h-full w-full overflow-hidden"
          style={{
            boxShadow:
              "0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
              {/* Logo */}
              <div className="p-4 border-b border-slate-200 flex-shrink-0">
                <div className="relative h-8 w-full">
                  <img
                    src="/odontoa-logo-horizontal.png"
                    alt="Odontoa"
                    className="object-contain object-left"
                  />
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0">
                <a className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow-sm relative group">
                  <Home className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Početna</div>
                    <div className="text-xs opacity-90">Glavna stranica</div>
                  </div>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </a>

                <a className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors group">
                  <Users className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pacijenti</div>
                    <div className="text-xs text-slate-500">
                      Upravljanje pacijentima
                    </div>
                  </div>
                </a>

                <a className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors group">
                  <Stethoscope className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Doktori</div>
                    <div className="text-xs text-slate-500">
                      Upravljanje doktorima
                    </div>
                  </div>
                </a>

                <a className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors group">
                  <Calendar className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Kalendar</div>
                    <div className="text-xs text-slate-500">
                      Raspored termina
                    </div>
                  </div>
                </a>

                <a className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors group">
                  <DollarSign className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Finansije</div>
                    <div className="text-xs text-slate-500">
                      Upravljanje finansijama
                    </div>
                  </div>
                </a>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&facepad=2"
                        alt="Dr Marko Marković"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl tracking-tight">
                        <span className="text-slate-500 font-medium">
                          Dobrodošli nazad,
                        </span>
                        <br />
                        <span className="text-slate-900 font-semibold">
                          Dr Marko Marković
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0 mt-3">
                  <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-base text-slate-500 font-semibold">
                        Ukupno pacijenata
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">452</div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-base text-slate-500 font-semibold">
                        Termini danas
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">18</div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-base text-slate-500 font-semibold">
                        Aktivni stomatolozi
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">6</div>
                  </div>
                </div>

                {/* Brze akcije */}
                <div className="mb-4 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      Brze akcije
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-base font-semibold text-slate-900 mb-1">
                        Novi pacijent
                      </div>
                      <div className="text-sm text-slate-500">
                        Dodaj novog pacijenta u sistem
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-base font-semibold text-slate-900 mb-1">
                        Zakaži termin
                      </div>
                      <div className="text-sm text-slate-500">
                        Kreiraj novi termin za pacijenta
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-base font-semibold text-slate-900 mb-1">
                        Pacijenti
                      </div>
                      <div className="text-sm text-slate-500">
                        Pregledaj sve pacijente
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div
                  className="grid gap-5 mb-4 flex-shrink-0"
                  style={{
                    gridTemplateColumns:
                      "minmax(520px, 1.3fr) minmax(380px, 1fr)",
                  }}
                >
                  {/* Status termina danas */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold tracking-tight text-slate-900">
                        Status termina danas
                      </h3>
                    </div>
                    <div className="flex-1 flex items-center min-h-0">
                      <DonutChart data={statusData} />
                    </div>
                  </div>

                  {/* Termini po danima */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold tracking-tight text-slate-900">
                        Termini po danima
                      </h3>
                    </div>
                    <div className="flex-1 flex items-end min-h-0">
                      <BarChart data={appointmentsByDayData} />
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                  {/* Today's Appointments */}
                  <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium tracking-tight text-slate-900">
                          Današnji termini (18)
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-2.5 flex-1">
                      {todayAppointments.slice(0, 4).map((apt, idx) => (
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
                    <div className="mt-2.5 flex-shrink-0">
                      <button className="w-full py-2.5 px-3 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors">
                        Vidi sve termine za danas →
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium tracking-tight text-slate-900">
                        Nedavna aktivnost
                      </h3>
                    </div>
                    <div className="space-y-2.5 flex-1">
                      {recentActivity.map((activity, idx) => {
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
