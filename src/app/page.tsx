import {
  Truck,
  Package,
  Users,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
} from "lucide-react";

const stats = [
  {
    label: "Active Loads",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: Package,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Fleet Utilization",
    value: "84%",
    change: "+3.2%",
    trend: "up",
    icon: Truck,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "On-Time Delivery",
    value: "96.3%",
    change: "+1.8%",
    trend: "up",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Revenue MTD",
    value: "$1.24M",
    change: "+8.5%",
    trend: "up",
    icon: DollarSign,
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const recentActivities = [
  { message: "Load #8821 dispatched to Driver Martinez", time: "2m ago", status: "success" },
  { message: "Invoice #INV-2024-4421 auto-generated for $12,400", time: "8m ago", status: "success" },
  { message: "Truck #T-047 delayed on I-10 — 45min ETA shift", time: "15m ago", status: "warning" },
  { message: "Driver Sarah Chen completed onboarding — Day 1", time: "1h ago", status: "info" },
  { message: "Weekly ops newsletter sent to 34 team members", time: "2h ago", status: "success" },
  { message: "Load #8810 unassigned — needs dispatch", time: "3h ago", status: "warning" },
];

const teamUpdates = [
  { dept: "Dispatch", status: "All loads covered", members: 8, active: true },
  { dept: "Finance", status: "3 invoices pending", members: 4, active: false },
  { dept: "Maintenance", status: "2 trucks in service", members: 6, active: false },
  { dept: "Driver Ops", status: "12 drivers on route", members: 12, active: true },
];

const aiInsights = [
  { text: "Route optimization on I-40 corridor could save ~$8,200/week", impact: "High" },
  { text: "Driver retention risk detected for 3 drivers — recommend check-in", impact: "Medium" },
  { text: "Invoice aging: 7 invoices >30 days — auto-follow-up scheduled", impact: "High" },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="text-gray-500 mt-0.5">Tuesday, February 18, 2026 · Live data</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          All Systems Operational
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Activity Feed */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Live Activity Feed</h2>
            </div>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">Auto-refresh 30s</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  activity.status === "success" ? "bg-emerald-400" :
                  activity.status === "warning" ? "bg-amber-400" : "bg-blue-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
            <Users className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Team Status</h2>
          </div>
          <div className="p-5 space-y-3">
            {teamUpdates.map((team, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">{team.dept}</span>
                  <div className={`w-2 h-2 rounded-full ${team.active ? "bg-emerald-400" : "bg-gray-300"}`} />
                </div>
                <p className="text-xs text-gray-500">{team.status}</p>
                <p className="text-xs text-gray-400 mt-1">{team.members} team members</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#0f1629] to-[#162040] rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold text-white">AI Insights</h2>
          <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">3 new</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {aiInsights.map((insight, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className={`text-xs font-medium mb-2 ${insight.impact === "High" ? "text-amber-400" : "text-blue-400"}`}>
                {insight.impact} Impact
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
