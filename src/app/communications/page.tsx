"use client";
import { useState } from "react";
import {
  MessageSquare,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Truck,
  Radio,
  ChevronRight,
  Plus,
  Shield,
  FileText,
  Zap,
  ArrowRight,
} from "lucide-react";

type Channel = "dispatch" | "driver" | "compliance" | "customer" | "team";

interface Message {
  id: string;
  channel: Channel;
  from: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  priority?: "critical" | "high" | "normal";
  load?: string;
}

interface Protocol {
  title: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  sla: string;
  channel: string;
  rules: string[];
}

const channelConfig: Record<Channel, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  dispatch: { label: "Dispatch Alerts", icon: Radio, color: "text-blue-700", bg: "bg-blue-100" },
  driver: { label: "Driver Check-ins", icon: Truck, color: "text-amber-700", bg: "bg-amber-100" },
  compliance: { label: "Compliance & Safety", icon: Shield, color: "text-red-700", bg: "bg-red-100" },
  customer: { label: "Customer Updates", icon: FileText, color: "text-purple-700", bg: "bg-purple-100" },
  team: { label: "Team Announcements", icon: Users, color: "text-emerald-700", bg: "bg-emerald-100" },
};

const messages: Message[] = [
  {
    id: "1",
    channel: "compliance",
    from: "FMCSA Alert System",
    initials: "FA",
    subject: "⚠ HOS Violation — Driver D-047 (T. Patel)",
    preview: "Driver T. Patel logged 11h 58min driving time on Feb 17 — exceeds 11-hour limit by 58 minutes. Review and document corrective action.",
    time: "8m ago",
    unread: true,
    priority: "critical",
    load: "L-8815",
  },
  {
    id: "2",
    channel: "dispatch",
    from: "Load Board System",
    initials: "LB",
    subject: "Load L-8816 — Driver needed by 3:00 PM today",
    preview: "Seattle → Portland · 174 mi · $3.20/mi. Available drivers: M. Garcia (reset), L. Brown (reset). Auto-match recommended: M. Garcia.",
    time: "22m ago",
    unread: true,
    priority: "high",
    load: "L-8816",
  },
  {
    id: "3",
    channel: "customer",
    from: "Walmart DC-Atlanta",
    initials: "WM",
    subject: "Delivery window exception — Load L-8820",
    preview: "Our dock will close at 9:00 PM EST. Current ETA is 8:45 PM — only 15-minute buffer. Please confirm or request appointment reschedule.",
    time: "35m ago",
    unread: true,
    priority: "high",
    load: "L-8820",
  },
  {
    id: "4",
    channel: "driver",
    from: "K. Johnson (D-028)",
    initials: "KJ",
    subject: "Check-in: Load L-8819 — Approaching Phoenix",
    preview: "Currently at milepost 142 on I-10 E. ETA to Phoenix dock 5:00 PM. No issues. Pre-trip complete. Will need fuel stop at exit 117.",
    time: "1h ago",
    unread: false,
    load: "L-8819",
  },
  {
    id: "5",
    channel: "dispatch",
    from: "Ops System",
    initials: "OS",
    subject: "Truck T-031 flagged for maintenance",
    preview: "15,246 miles since last preventive maintenance. DOT inspection due in 12 days. Schedule service to avoid out-of-service citation.",
    time: "1h ago",
    unread: false,
    priority: "normal",
  },
  {
    id: "6",
    channel: "team",
    from: "Ricky Maldonado",
    initials: "RM",
    subject: "Weekly ops brief — Feb 18 | Fleet at 84% utilization",
    preview: "Team — strong week. 247 active loads, 96.3% on-time. Two items need attention before EOD: L-8816 unassigned, T. Patel HOS issue needs documentation.",
    time: "2h ago",
    unread: false,
  },
  {
    id: "7",
    channel: "driver",
    from: "J. Martinez (D-041)",
    initials: "JM",
    subject: "Check-in: Load L-8821 — Tulsa, OK",
    preview: "Passed Tulsa OK. 72% complete. ETA Dallas Feb 19 2:30 PM confirmed. Weather clear through Texas. HOS at 6h 22m remaining.",
    time: "3h ago",
    unread: false,
    load: "L-8821",
  },
  {
    id: "8",
    channel: "compliance",
    from: "Safety Department",
    initials: "SD",
    subject: "Random drug test — D. Thompson (D-055) selected",
    preview: "D. Thompson has been randomly selected per DOT 49 CFR Part 40 protocol. Testing must be completed within 2 hours of notification.",
    time: "4h ago",
    unread: false,
    priority: "high",
  },
];

const protocols: Protocol[] = [
  {
    title: "Dispatch Alerts",
    icon: Radio,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    sla: "Acknowledge within 5 min",
    channel: "Hemut Dispatch Board + SMS",
    rules: [
      "All load assignments confirmed via Hemut TMS — never verbal only",
      "Unassigned loads >1 hour trigger escalation to ops manager",
      "Route changes require driver acknowledgment in app before proceeding",
      "Delays >30 min must be logged with cause code in TMS",
    ],
  },
  {
    title: "Driver Check-ins",
    icon: Truck,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    sla: "Required every 4 hours on-route",
    channel: "Hemut Driver App + ELD",
    rules: [
      "Mandatory check-in at pickup, every 4h en route, and at delivery",
      "HOS clock visible to dispatch in real time via ELD integration",
      "Driver unreachable for 60+ min triggers ops manager alert",
      "All fuel stops, breakdowns, and delays logged in app within 15 min",
    ],
  },
  {
    title: "Compliance & Safety",
    icon: Shield,
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    sla: "Critical items: immediate action",
    channel: "Compliance Dashboard + Email",
    rules: [
      "HOS violations trigger immediate ops + safety manager notification",
      "Random drug test notifications require response within 2 hours",
      "Post-accident procedures: notify ops within 30 min, DOT within 24h",
      "All corrective actions documented within 48 hours of incident",
    ],
  },
  {
    title: "Customer Updates",
    icon: FileText,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    sla: "Proactive update before customer asks",
    channel: "Email + Customer Portal",
    rules: [
      "Delivery confirmations sent within 1 hour of POD capture",
      "Exceptions (delays, damage) communicated before customer follow-up",
      "Detention: notify shipper at hour 1, escalate at hour 2",
      "Appointment reschedules require 4-hour advance notice minimum",
    ],
  },
];

const siloRisks = [
  {
    title: "Driver ↔ Dispatch lag",
    severity: "High",
    desc: "Avg. check-in response time is 18 minutes. Industry standard is <5 minutes. 3 loads this month had delays tied to communication gaps.",
    fix: "Enable push notifications for all active drivers via Hemut app — estimated 4-minute avg. response after rollout.",
    icon: Truck,
  },
  {
    title: "Finance sees exceptions late",
    severity: "Medium",
    desc: "Invoice disputes are raised avg. 9 days after delivery. Finance team not looped in on detention or damage exceptions at point of occurrence.",
    fix: "Route compliance alerts to Finance CC list automatically. Create exception dashboard for Finance to monitor in real time.",
    icon: FileText,
  },
  {
    title: "Compliance updates siloed to safety team",
    severity: "Medium",
    desc: "HOS violations and drug test results reach ops managers 2–4 hours after incident. FMCSA violations require faster loop-in.",
    fix: "Compliance dashboard integrated into main ops view. All P1 compliance events auto-notify ops manager via SMS within 5 minutes.",
    icon: Shield,
  },
];

const healthScores = [
  { label: "Dispatch ↔ Driver Response Time", score: 62, target: 90 },
  { label: "Customer Notification SLA", score: 84, target: 95 },
  { label: "Compliance Loop-In Speed", score: 55, target: 85 },
  { label: "Cross-Team Visibility Index", score: 71, target: 90 },
];

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "protocols" | "silos">("inbox");
  const [activeChannel, setActiveChannel] = useState<Channel | "all">("all");

  const filtered = activeChannel === "all" ? messages : messages.filter((m) => m.channel === activeChannel);
  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Communications Hub</h1>
          <p className="text-sm text-gray-400 mt-0.5">Unified dispatch, driver, compliance, and customer communications</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              <Bell className="w-3.5 h-3.5" />
              {unreadCount} unread
            </div>
          )}
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Messages Today", value: "38", sub: "3 require action now", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Compliance Alerts", value: "2", sub: "1 critical · 1 pending", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Driver Check-ins", value: "41", sub: "All active drivers reported", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg. Response Time", value: "18 min", sub: "Target: <5 min", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</div>
              <div className="text-xs font-semibold text-gray-700 mb-0.5">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "inbox" ? "Unified Inbox" : tab === "protocols" ? "Communication SOPs" : "Silo Analysis"}
          </button>
        ))}
      </div>

      {/* Inbox Tab */}
      {activeTab === "inbox" && (
        <div className="flex gap-5">
          {/* Channel Filter */}
          <div className="w-48 shrink-0 space-y-1">
            <button
              onClick={() => setActiveChannel("all")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeChannel === "all" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                All Channels
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeChannel === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                {messages.length}
              </span>
            </button>
            {(Object.entries(channelConfig) as [Channel, typeof channelConfig[Channel]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const count = messages.filter((m) => m.channel === key).length;
              const active = activeChannel === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveChannel(key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span className="truncate text-xs">{cfg.label}</span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2">
            {filtered.map((msg) => {
              const ch = channelConfig[msg.channel];
              const ChannelIcon = ch.icon;
              return (
                <div
                  key={msg.id}
                  className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    msg.priority === "critical" ? "border-red-200 bg-red-50/30" :
                    msg.priority === "high" ? "border-orange-200 bg-orange-50/20" :
                    "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-bold text-gray-600 text-xs">
                      {msg.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ch.bg} ${ch.color}`}>
                          <ChannelIcon className="w-2.5 h-2.5" />
                          {ch.label}
                        </span>
                        {msg.load && (
                          <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {msg.load}
                          </span>
                        )}
                        {msg.priority === "critical" && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full uppercase">Critical</span>
                        )}
                        {msg.priority === "high" && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full uppercase">High</span>
                        )}
                        {msg.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <div className={`text-sm mb-1 ${msg.unread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                        {msg.subject}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{msg.preview}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{msg.time}</span>
                      <button className="text-[10px] text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-0.5">
                        Reply <ArrowRight className="w-2.5 h-2.5" />
                      </button>
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
          {protocols.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className={`bg-white rounded-xl border ${p.border} shadow-sm overflow-hidden`}>
                <div className={`${p.bg} px-5 py-4 border-b ${p.border}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-5 h-5 ${p.color}`} />
                    <h3 className={`font-bold ${p.color}`}>{p.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>SLA: <span className="font-semibold text-gray-700">{p.sla}</span></span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Channel: <span className="font-semibold text-gray-700">{p.channel}</span></div>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {p.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <ChevronRight className={`w-3.5 h-3.5 ${p.color} shrink-0 mt-0.5`} />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Silo Analysis Tab */}
      {activeTab === "silos" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-[#0a0f1e] to-[#111827] rounded-xl p-5 text-white border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-sm">AI Communication Health Analysis</span>
              <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold ml-auto">
                Feb 18 · Live
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {healthScores.map((h) => (
                <div key={h.label} className="bg-white/5 rounded-lg p-3 border border-white/8">
                  <div className="text-[10px] text-white/40 mb-2 leading-tight">{h.label}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className={`text-xl font-bold ${h.score >= 80 ? "text-emerald-400" : h.score >= 65 ? "text-amber-400" : "text-red-400"}`}>
                      {h.score}
                    </span>
                    <span className="text-xs text-white/30 mb-0.5">/ 100</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${h.score >= 80 ? "bg-emerald-500" : h.score >= 65 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${h.score}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-white/25 mt-1">Target: {h.target}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {siloRisks.map((risk, i) => {
              const Icon = risk.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{risk.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          risk.severity === "High" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {risk.severity} Risk
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{risk.desc}</p>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                        <div className="flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-emerald-700 font-medium">{risk.fix}</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 shrink-0 flex items-center gap-1 mt-1">
                      Fix Now <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
