import {
  Package,
  Users,
  Truck,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
  Zap,
  ChevronRight,
  ArrowRight,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type LoadStatus = "In Transit" | "Delayed" | "Picked Up" | "Delivered" | "Unassigned";
type DriverStatus = "Driving" | "On Duty" | "Off Duty" | "HOS Alert" | "Delayed" | "Training";
type AlertSeverity = "critical" | "high" | "medium";

interface Load {
  id: string;
  origin: string;
  dest: string;
  driver: string;
  status: LoadStatus;
  progress: number;
  eta: string;
  rpm: string;
  miles: number;
  urgent: boolean;
}

interface Driver {
  name: string;
  initials: string;
  id: string;
  status: DriverStatus;
  hos: string;
  hosPercent: number;
  load: string;
}

interface Alert {
  severity: AlertSeverity;
  title: string;
  msg: string;
  action: string;
  time: string;
}

const loads: Load[] = [
  { id: "L-8821", origin: "Chicago, IL", dest: "Dallas, TX", driver: "J. Martinez", status: "In Transit", progress: 72, eta: "Feb 19, 2:30 PM", rpm: "$2.84", miles: 920, urgent: false },
  { id: "L-8820", origin: "Memphis, TN", dest: "Atlanta, GA", driver: "R. Williams", status: "Delayed", progress: 45, eta: "Feb 18, 8:00 PM", rpm: "$3.10", miles: 382, urgent: true },
  { id: "L-8819", origin: "Los Angeles, CA", dest: "Phoenix, AZ", driver: "K. Johnson", status: "In Transit", progress: 88, eta: "Feb 18, 5:15 PM", rpm: "$2.95", miles: 372, urgent: false },
  { id: "L-8818", origin: "Houston, TX", dest: "New Orleans, LA", driver: "D. Thompson", status: "Picked Up", progress: 15, eta: "Feb 18, 11:45 PM", rpm: "$2.70", miles: 348, urgent: false },
  { id: "L-8817", origin: "Denver, CO", dest: "Salt Lake City, UT", driver: "M. Garcia", status: "Delivered", progress: 100, eta: "Delivered 10:22 AM", rpm: "$3.05", miles: 525, urgent: false },
  { id: "L-8816", origin: "Seattle, WA", dest: "Portland, OR", driver: "Unassigned", status: "Unassigned", progress: 0, eta: "Pickup: 3:00 PM today", rpm: "$3.20", miles: 174, urgent: true },
];

const drivers: Driver[] = [
  { name: "J. Martinez", initials: "JM", id: "D-041", status: "Driving", hos: "6h 22m", hosPercent: 54, load: "L-8821" },
  { name: "R. Williams", initials: "RW", id: "D-032", status: "Delayed", hos: "4h 10m", hosPercent: 35, load: "L-8820" },
  { name: "K. Johnson", initials: "KJ", id: "D-028", status: "Driving", hos: "8h 45m", hosPercent: 73, load: "L-8819" },
  { name: "D. Thompson", initials: "DT", id: "D-055", status: "On Duty", hos: "9h 30m", hosPercent: 79, load: "L-8818" },
  { name: "T. Patel", initials: "TP", id: "D-047", status: "HOS Alert", hos: "1h 12m", hosPercent: 10, load: "L-8815" },
  { name: "M. Garcia", initials: "MG", id: "D-019", status: "Off Duty", hos: "Reset", hosPercent: 100, load: "—" },
];

const alerts: Alert[] = [
  { severity: "critical", title: "HOS Limit Imminent", msg: "T. Patel (D-047) — 1h 12m remaining near Flagstaff, AZ on Load L-8815", action: "Reassign Load", time: "now" },
  { severity: "high", title: "Delivery at Risk", msg: "L-8820 is +2h 40min late — Walmart DC-Atlanta pickup window closes at 9:00 PM", action: "Notify Customer", time: "12m ago" },
  { severity: "medium", title: "Maintenance Overdue", msg: "Truck T-031 — 15,246 mi since last PM (threshold: 15,000 mi)", action: "Schedule Service", time: "1h ago" },
];

const aiInsights = [
  { text: "I-40 corridor optimization available — estimated $8,200/wk savings on 3 recurring lanes", impact: "High" },
  { text: "Retention risk flagged for 3 drivers with 2+ late check-ins this month — recommend proactive outreach", impact: "Medium" },
  { text: "7 invoices aging 30+ days — auto-follow-up campaign queued for tomorrow 8 AM", impact: "High" },
];

const loadStatusConfig: Record<LoadStatus, { color: string; dot: string }> = {
  "In Transit": { color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  "Delayed": { color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  "Picked Up": { color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  "Delivered": { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "Unassigned": { color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const driverStatusConfig: Record<DriverStatus, { color: string; bg: string }> = {
  "Driving": { color: "text-blue-700", bg: "bg-blue-100" },
  "On Duty": { color: "text-amber-700", bg: "bg-amber-100" },
  "Off Duty": { color: "text-gray-500", bg: "bg-gray-100" },
  "HOS Alert": { color: "text-red-700", bg: "bg-red-100" },
  "Delayed": { color: "text-orange-700", bg: "bg-orange-100" },
  "Training": { color: "text-purple-700", bg: "bg-purple-100" },
};

const alertBorder: Record<AlertSeverity, string> = {
  critical: "border-l-red-500 bg-red-50",
  high: "border-l-orange-400 bg-orange-50",
  medium: "border-l-amber-400 bg-amber-50",
};

const alertLabel: Record<AlertSeverity, string> = {
  critical: "text-red-600",
  high: "text-orange-600",
  medium: "text-amber-600",
};

function hosBarColor(percent: number) {
  if (percent < 20) return "bg-red-500";
  if (percent < 40) return "bg-amber-400";
  return "bg-emerald-500";
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-5 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Operations Command</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tuesday, February 18, 2026 · 9:41 AM CT</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </div>
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-amber-500/20">
            <Package className="w-4 h-4" />
            Dispatch Load
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Active Loads",
            value: "247",
            sub: "41 in transit · 12 pending pickup",
            icon: Package,
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
            trend: "+12% WoW",
            up: true,
          },
          {
            label: "Drivers On Duty",
            value: "41 / 58",
            sub: "1 HOS alert · 3 delayed",
            icon: Users,
            bg: "bg-amber-50",
            iconColor: "text-amber-600",
            alert: true,
          },
          {
            label: "Revenue MTD",
            value: "$1.24M",
            sub: "89% of $1.40M target",
            icon: DollarSign,
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            trend: "+8.5%",
            up: true,
            progress: 89,
          },
          {
            label: "On-Time Delivery",
            value: "96.3%",
            sub: "9 late loads this month",
            icon: CheckCircle2,
            bg: "bg-purple-50",
            iconColor: "text-purple-600",
            trend: "+1.8%",
            up: true,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${kpi.iconColor}`} />
                </div>
                {kpi.trend && (
                  <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {kpi.trend}
                  </div>
                )}
                {kpi.alert && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Alert
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{kpi.value}</div>
              <div className="text-xs text-gray-400">{kpi.sub}</div>
              {kpi.progress && (
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${kpi.progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Load Pipeline */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Live Load Pipeline</h2>
              <p className="text-xs text-gray-400 mt-0.5">6 of 247 active loads shown · sorted by urgency</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700">
              View All Loads <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[90px_1fr_110px_70px_90px_60px] gap-3 px-5 py-2.5 border-b border-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            <span>Load ID</span>
            <span>Route</span>
            <span>Driver</span>
            <span>Status</span>
            <span>ETA</span>
            <span>$/mi</span>
          </div>

          <div className="divide-y divide-gray-50">
            {loads.map((load) => {
              const sc = loadStatusConfig[load.status];
              return (
                <div
                  key={load.id}
                  className={`grid grid-cols-[90px_1fr_110px_70px_90px_60px] gap-3 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors ${load.urgent ? "bg-red-50/40" : ""}`}
                >
                  {/* Load ID */}
                  <div className="flex items-center gap-1.5">
                    {load.urgent && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                    <span className="text-xs font-bold text-gray-700 font-mono">{load.id}</span>
                  </div>

                  {/* Route */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-800">
                      <span className="truncate max-w-[80px]">{load.origin.split(",")[0]}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                      <span className="truncate max-w-[80px]">{load.dest.split(",")[0]}</span>
                    </div>
                    <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden w-full">
                      <div
                        className={`h-full rounded-full ${load.status === "Delayed" ? "bg-red-400" : load.status === "Delivered" ? "bg-emerald-500" : "bg-blue-500"}`}
                        style={{ width: `${load.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-2.5 h-2.5 text-gray-300" />
                      <span className="text-[10px] text-gray-400">{load.miles.toLocaleString()} mi</span>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="text-xs text-gray-600 font-medium truncate">
                    {load.driver === "Unassigned" ? (
                      <span className="text-red-500 font-semibold">⚠ Unassigned</span>
                    ) : load.driver}
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${sc.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {load.status}
                    </span>
                  </div>

                  {/* ETA */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock className="w-2.5 h-2.5 text-gray-300 shrink-0" />
                    <span className="truncate">{load.eta}</span>
                  </div>

                  {/* RPM */}
                  <div className="text-xs font-semibold text-emerald-700">{load.rpm}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 space-y-4">
          {/* Critical Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="font-semibold text-sm text-gray-900">Critical Alerts</h2>
              </div>
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">3</span>
            </div>
            <div className="divide-y divide-gray-50">
              {alerts.map((alert, i) => (
                <div key={i} className={`border-l-4 px-4 py-3.5 ${alertBorder[alert.severity]}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${alertLabel[alert.severity]}`}>
                      {alert.severity} · {alert.time}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mb-1">{alert.title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-2">{alert.msg}</p>
                  <button className="text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-50 transition-colors">
                    {alert.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Driver HOS Board */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <h2 className="font-semibold text-sm text-gray-900">Driver HOS Board</h2>
              </div>
              <span className="text-[10px] text-gray-400">Hours of Service</span>
            </div>
            <div className="divide-y divide-gray-50">
              {drivers.map((d) => {
                const ds = driverStatusConfig[d.status];
                return (
                  <div key={d.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-gray-600">{d.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-800 truncate">{d.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ds.bg} ${ds.color}`}>
                          {d.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          {d.status !== "Off Duty" && d.status !== "Training" ? (
                            <div
                              className={`h-full rounded-full ${hosBarColor(d.hosPercent)}`}
                              style={{ width: `${d.hosPercent}%` }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 rounded-full" />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium shrink-0 w-10 text-right">{d.hos}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-[#0a0f1e] to-[#111827] rounded-xl p-5 text-white border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-semibold text-sm text-white">AI Ops Intelligence</span>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold ml-1">3 insights</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {aiInsights.map((insight, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/8 hover:bg-white/8 transition-colors cursor-pointer group">
              <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${insight.impact === "High" ? "text-amber-400" : "text-sky-400"}`}>
                {insight.impact} Impact
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{insight.text}</p>
              <div className="mt-3 text-[10px] text-white/30 group-hover:text-amber-400/70 transition-colors font-medium">
                View recommendation →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
