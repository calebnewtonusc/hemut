"use client";
import { useState } from "react";
import {
  MessageSquare,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Users,
  Truck,
  DollarSign,
  Wrench,
  Plus,
  Clock,
  ArrowRight,
  Activity,
  Shield,
  Zap,
  Globe,
  Star,
  TrendingUp,
} from "lucide-react";

type Channel = "dispatch" | "driver" | "finance" | "maintenance" | "leadership" | "all";
type Priority = "critical" | "high" | "normal" | "low";

interface Message {
  id: string;
  from: string;
  fromDept: string;
  channel: Channel;
  subject: string;
  preview: string;
  time: string;
  priority: Priority;
  read: boolean;
  thread: number;
}

const channelConfig: Record<Channel, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  dispatch: { label: "Dispatch", icon: Truck, color: "text-blue-700", bg: "bg-blue-100" },
  driver: { label: "Driver Ops", icon: Users, color: "text-amber-700", bg: "bg-amber-100" },
  finance: { label: "Finance", icon: DollarSign, color: "text-emerald-700", bg: "bg-emerald-100" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "text-orange-700", bg: "bg-orange-100" },
  leadership: { label: "Leadership", icon: Star, color: "text-purple-700", bg: "bg-purple-100" },
  all: { label: "All Teams", icon: Globe, color: "text-gray-700", bg: "bg-gray-100" },
};

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
  critical: { label: "Critical", color: "text-red-600", dot: "bg-red-500" },
  high: { label: "High", color: "text-orange-600", dot: "bg-orange-400" },
  normal: { label: "Normal", color: "text-blue-600", dot: "bg-blue-400" },
  low: { label: "Low", color: "text-gray-500", dot: "bg-gray-300" },
};

const messages: Message[] = [
  {
    id: "1",
    from: "Marcus Johnson",
    fromDept: "Dispatch",
    channel: "dispatch",
    subject: "Load #8821 - Urgent: Driver needs alternate route",
    preview: "I-10 eastbound blocked near Banning. Need Marcus to reroute via SR-60. ETA pushed by 45min.",
    time: "3m ago",
    priority: "critical",
    read: false,
    thread: 3,
  },
  {
    id: "2",
    from: "Amy Torres",
    fromDept: "Finance",
    channel: "finance",
    subject: "Invoice Aging Alert: 7 accounts over 30 days",
    preview: "Following up on overdue invoices. Requesting approval to escalate Swift Logistics and Sun Valley Freight.",
    time: "18m ago",
    priority: "high",
    read: false,
    thread: 1,
  },
  {
    id: "3",
    from: "Robert Kim",
    fromDept: "Maintenance",
    channel: "maintenance",
    subject: "Truck #T-031 scheduled for brake inspection",
    preview: "T-031 due for brake inspection Feb 19. Please hold from dispatch assignment until cleared.",
    time: "1h ago",
    priority: "high",
    read: true,
    thread: 2,
  },
  {
    id: "4",
    from: "Sara Williams",
    fromDept: "Leadership",
    channel: "all",
    subject: "Q1 OKR Review — All Hands Prep",
    preview: "Our all-hands is Feb 28. Please submit your team's Q1 progress bullets by Feb 25.",
    time: "3h ago",
    priority: "normal",
    read: true,
    thread: 0,
  },
  {
    id: "5",
    from: "Driver Portal",
    fromDept: "Driver Ops",
    channel: "driver",
    subject: "Safety incident report filed — Load #8790",
    preview: "Minor incident reported near Tucson. No injuries. Driver Chen submitted full report. Review required.",
    time: "4h ago",
    priority: "high",
    read: true,
    thread: 4,
  },
];

const siloRisks = [
  {
    dept: "Finance ↔ Dispatch",
    issue: "Invoice disputes taking 4.2 days to resolve due to info gaps",
    recommendation: "Add Dispatch to weekly Finance Brief distribution",
    severity: "medium",
  },
  {
    dept: "Maintenance ↔ Dispatch",
    issue: "3 trucks assigned while in service last month — lost 2 loads",
    recommendation: "Create shared maintenance hold calendar with auto-dispatch block",
    severity: "high",
  },
  {
    dept: "Driver Ops ↔ Leadership",
    issue: "Driver feedback rarely reaches leadership — turnover correlation detected",
    recommendation: "Monthly driver pulse survey with exec summary auto-generated",
    severity: "medium",
  },
];

const communicationProtocols = [
  {
    type: "Critical Ops Alert",
    icon: AlertTriangle,
    triggers: ["Load unassigned >2 hours", "Truck breakdown on route", "Safety incident"],
    channel: "Hemut Chat + SMS + Email",
    sla: "Response within 15 minutes",
    color: "red",
  },
  {
    type: "Daily Standup",
    icon: Activity,
    triggers: ["Every weekday 8:00 AM", "Dispatch, Ops, Maintenance"],
    channel: "Video + Hemut Chat Summary",
    sla: "15-minute async recap by 8:30 AM",
    color: "blue",
  },
  {
    type: "Cross-Dept Update",
    icon: MessageSquare,
    triggers: ["Finance invoices >$50K", "Fleet utilization <70%", "New carrier added"],
    channel: "Email + Hemut Notification",
    sla: "Response within 4 hours",
    color: "amber",
  },
  {
    type: "Leadership Escalation",
    icon: Shield,
    triggers: ["Compliance violation", "Driver safety concern", "Revenue miss >10%"],
    channel: "Direct message + Priority inbox",
    sla: "Response within 1 hour",
    color: "purple",
  },
];

const colorProto: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", badge: "bg-red-100 text-red-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
};

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "protocols" | "silos">("inbox");
  const [filterChannel, setFilterChannel] = useState<Channel | "all">("all");

  const filtered = messages.filter(
    (m) => filterChannel === "all" || m.channel === filterChannel
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications Hub</h1>
          <p className="text-gray-500 mt-0.5">Unified visibility across all Hemut teams — zero silos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-200">
            <Bell className="w-4 h-4" />
            {unreadCount} unread
          </div>
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Broadcast
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Messages Today", value: "47", sub: "Across all channels", icon: MessageSquare, bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Avg Response Time", value: "12m", sub: "↓ 8min from last week", icon: Clock, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "Critical Alerts", value: "2", sub: "Require immediate action", icon: AlertTriangle, bg: "bg-red-50", iconColor: "text-red-600" },
          { label: "Silo Risk Score", value: "34", sub: "Low (target: <50)", icon: TrendingUp, bg: "bg-amber-50", iconColor: "text-amber-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm font-medium text-gray-700">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {(["inbox", "protocols", "silos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "inbox" ? "Unified Inbox" : tab === "protocols" ? "Protocols" : "Silo Analysis"}
          </button>
        ))}
      </div>

      {/* Inbox Tab */}
      {activeTab === "inbox" && (
        <div className="flex gap-6">
          <div className="w-52 shrink-0 space-y-1">
            {(["all", ...Object.keys(channelConfig).filter(c => c !== "all")] as (Channel | "all")[]).map((ch) => {
              const config = ch === "all"
                ? { label: "All Channels", icon: Globe, color: "text-gray-700", bg: "bg-gray-100" }
                : channelConfig[ch as Channel];
              const Icon = config.icon;
              const count = ch === "all" ? messages.length : messages.filter(m => m.channel === ch).length;
              return (
                <button
                  key={ch}
                  onClick={() => setFilterChannel(ch)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filterChannel === ch ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{config.label}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 space-y-2">
            {filtered.map((msg) => {
              const ch = channelConfig[msg.channel];
              const ChIcon = ch.icon;
              const pri = priorityConfig[msg.priority];
              return (
                <div
                  key={msg.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    !msg.read ? "border-l-4 border-l-amber-400 border-gray-200" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-lg ${ch.bg} flex items-center justify-center shrink-0`}>
                      <ChIcon className={`w-4 h-4 ${ch.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-semibold text-sm ${!msg.read ? "text-gray-900" : "text-gray-700"}`}>
                          {msg.subject}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${pri.dot}`} />
                        <span className={`text-xs font-medium ${pri.color}`}>{pri.label}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {msg.from} · {msg.fromDept}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-gray-400">{msg.time}</div>
                      {msg.thread > 0 && (
                        <div className="flex items-center justify-end gap-1 mt-1 text-xs text-gray-400">
                          <MessageSquare className="w-3 h-3" />
                          {msg.thread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Protocols Tab */}
      {activeTab === "protocols" && (
        <div className="grid grid-cols-2 gap-5">
          {communicationProtocols.map((proto) => {
            const Icon = proto.icon;
            const c = colorProto[proto.color];
            return (
              <div key={proto.type} className={`bg-white rounded-xl border ${c.border} shadow-sm overflow-hidden`}>
                <div className={`${c.bg} px-6 py-5 border-b ${c.border}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                    <h3 className="font-bold text-gray-900">{proto.type}</h3>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${c.badge}`}>
                    <Clock className="w-3 h-3" />
                    SLA: {proto.sla}
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Triggers</span>
                    <ul className="mt-2 space-y-1.5">
                      {proto.triggers.map((t, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${c.icon.replace("text-", "bg-")}`} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Delivery Channel</span>
                    <p className="text-sm text-gray-700 font-medium mt-1">{proto.channel}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Silo Analysis Tab */}
      {activeTab === "silos" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-[#0f1629] to-[#162040] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-lg">AI Silo Detection</span>
              <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">3 risks identified</span>
            </div>
            <p className="text-white/70 text-sm">
              {"Hemut's AI analyzes cross-team communication patterns, response times, and task handoffs to detect information silos before they cause operational issues."}
            </p>
          </div>

          {siloRisks.map((risk, i) => (
            <div key={i} className={`bg-white rounded-xl border shadow-sm p-6 ${risk.severity === "high" ? "border-l-4 border-l-red-400 border-gray-200" : "border-l-4 border-l-amber-400 border-gray-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${risk.severity === "high" ? "text-red-500" : "text-amber-500"}`} />
                    <span className="font-bold text-gray-900 text-lg">{risk.dept}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${risk.severity === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {risk.severity === "high" ? "High Risk" : "Medium Risk"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{risk.issue}</p>
                  <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">AI Recommendation</span>
                      <p className="text-sm text-emerald-800 mt-0.5">{risk.recommendation}</p>
                    </div>
                  </div>
                </div>
                <button className="shrink-0 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Fix Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-5">Team Communication Health</h3>
            <div className="space-y-4">
              {[
                { team: "Dispatch ↔ Drivers", score: 92, color: "bg-emerald-500" },
                { team: "Finance ↔ Dispatch", score: 61, color: "bg-amber-500" },
                { team: "Maintenance ↔ Dispatch", score: 54, color: "bg-red-500" },
                { team: "Leadership ↔ All Teams", score: 78, color: "bg-blue-500" },
                { team: "Driver Ops ↔ Leadership", score: 47, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.team}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700">{item.team}</span>
                    <span className={`text-sm font-bold ${item.score >= 80 ? "text-emerald-600" : item.score >= 60 ? "text-amber-600" : "text-red-600"}`}>
                      {item.score}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
