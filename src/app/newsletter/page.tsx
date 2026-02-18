"use client";
import { useState } from "react";
import {
  Mail,
  Send,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Edit3,
  Copy,
  Calendar,
  CheckCircle2,
  Zap,
  ArrowRight,
  Star,
  BarChart2,
  Truck,
  DollarSign,
  Shield,
} from "lucide-react";

type NewsletterType = "weekly-ops" | "driver-bulletin" | "finance-brief" | "company-wide";
type Status = "draft" | "scheduled" | "sent";

interface Newsletter {
  id: string;
  title: string;
  type: NewsletterType;
  status: Status;
  audience: string;
  recipientCount: number;
  scheduledFor?: string;
  sentAt?: string;
  openRate?: number;
  sections: string[];
}

const typeConfig: Record<NewsletterType, { label: string; color: string; bg: string }> = {
  "weekly-ops": { label: "Weekly Ops", color: "text-blue-700", bg: "bg-blue-100" },
  "driver-bulletin": { label: "Driver Bulletin", color: "text-amber-700", bg: "bg-amber-100" },
  "finance-brief": { label: "Finance Brief", color: "text-emerald-700", bg: "bg-emerald-100" },
  "company-wide": { label: "Company-Wide", color: "text-purple-700", bg: "bg-purple-100" },
};

const statusConfig: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "text-gray-500 bg-gray-100", icon: Edit3 },
  scheduled: { label: "Scheduled", color: "text-blue-600 bg-blue-50", icon: Clock },
  sent: { label: "Sent", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 },
};

const newsletters: Newsletter[] = [
  {
    id: "1",
    title: "Weekly Ops Digest — Week of Feb 18",
    type: "weekly-ops",
    status: "scheduled",
    audience: "All Dispatchers & Ops Managers",
    recipientCount: 34,
    scheduledFor: "Mon Feb 18, 7:30 AM",
    sections: ["Fleet KPIs & utilization", "Load highlights (top RPM, longest haul)", "Driver spotlight", "Upcoming route changes", "Action items"],
  },
  {
    id: "2",
    title: "Driver Bulletin: Winter Weather Safety + Payroll",
    type: "driver-bulletin",
    status: "sent",
    audience: "All Active CDL Drivers",
    recipientCount: 58,
    sentAt: "Feb 14, 2026",
    openRate: 81,
    sections: ["Winter driving safety protocols", "I-80 & I-70 weather alerts", "HOS reminder — 34-hour restart rule", "Payroll dates & direct deposit update", "New ELD firmware — update required"],
  },
  {
    id: "3",
    title: "Finance Brief — January Close",
    type: "finance-brief",
    status: "sent",
    audience: "Finance & Leadership",
    recipientCount: 12,
    sentAt: "Feb 5, 2026",
    openRate: 92,
    sections: ["Revenue & RPM summary ($2.91/mi avg)", "Invoice aging report (7 over 30 days)", "Fuel cost vs. budget variance", "IFTA Q4 filing confirmation", "Q1 forecast — $4.8M target"],
  },
  {
    id: "4",
    title: "Company-Wide: Q1 Kickoff Recap + New Hires",
    type: "company-wide",
    status: "draft",
    audience: "Entire Hemut Team",
    recipientCount: 104,
    sections: ["Q1 goals: $4.8M revenue, 97% OTD", "Welcome: 3 new drivers, 1 dispatcher", "Safety recognition: zero incidents in January", "Leadership message from Ricky", "Upcoming: Driver appreciation week"],
  },
];

const templates = [
  {
    name: "Weekly Ops Digest",
    icon: TrendingUp,
    desc: "Monday morning briefing for dispatchers and ops managers covering KPIs, loads, and action items",
    sections: ["Fleet Utilization & KPIs", "Top Loads This Week", "Driver Spotlight", "Compliance Reminders", "Upcoming Changes & Action Items"],
    cadence: "Every Monday 7:30 AM",
    audience: "Ops Team (34)",
    color: "blue",
  },
  {
    name: "Driver Bulletin",
    icon: Truck,
    desc: "Bi-weekly safety and operational update for all active CDL drivers — safety, pay, app, and compliance",
    sections: ["Safety & Road Conditions", "HOS & Compliance Reminders", "Payroll & Benefits Updates", "App & ELD Feature Tips", "Driver Recognition Corner"],
    cadence: "Every other Friday 4:00 PM",
    audience: "All Drivers (58)",
    color: "amber",
  },
  {
    name: "Finance Brief",
    icon: DollarSign,
    desc: "Monthly close summary for finance and leadership — revenue, invoicing, cost, and forecast",
    sections: ["Revenue & RPM Summary", "Invoice Aging Report", "Carrier Cost Breakdown", "IFTA & Tax Filings", "Next Month Forecast"],
    cadence: "1st business day of month",
    audience: "Finance & Leadership (12)",
    color: "emerald",
  },
  {
    name: "Company-Wide Bulletin",
    icon: Users,
    desc: "Quarterly all-hands update — milestones, culture, new hires, and company direction",
    sections: ["Leadership Message", "Company Milestones & Stats", "New Team Members", "Safety Recognition", "Upcoming Priorities"],
    cadence: "Quarterly — leadership approval req.",
    audience: "Full Team (104)",
    color: "purple",
  },
];

const colorMap: Record<string, { border: string; bg: string; accent: string; text: string; lightBg: string }> = {
  blue: { border: "border-blue-200", bg: "bg-blue-50", accent: "bg-blue-500", text: "text-blue-700", lightBg: "bg-blue-50/50" },
  amber: { border: "border-amber-200", bg: "bg-amber-50", accent: "bg-amber-500", text: "text-amber-700", lightBg: "bg-amber-50/50" },
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50", accent: "bg-emerald-500", text: "text-emerald-700", lightBg: "bg-emerald-50/50" },
  purple: { border: "border-purple-200", bg: "bg-purple-50", accent: "bg-purple-500", text: "text-purple-700", lightBg: "bg-purple-50/50" },
};

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "templates" | "composer">("overview");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Newsletter System</h1>
          <p className="text-sm text-gray-400 mt-0.5">Structured communications for every team segment — drivers, ops, finance, and leadership</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Create Newsletter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Sent This Month", value: "6", icon: Send, bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Total Recipients", value: "104", icon: Users, bg: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "Avg. Open Rate", value: "86%", icon: TrendingUp, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "Scheduled", value: "2", icon: Calendar, bg: "bg-purple-50", iconColor: "text-purple-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.iconColor}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {(["overview", "templates", "composer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "overview" ? "All Newsletters" : tab === "templates" ? "Blueprints" : "Composer Guide"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-3">
          {newsletters.map((nl) => {
            const type = typeConfig[nl.type];
            const status = statusConfig[nl.status];
            const StatusIcon = status.icon;
            return (
              <div key={nl.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">{nl.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${type.bg} ${type.color}`}>
                        {type.label}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${status.color}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {nl.audience} ({nl.recipientCount})
                      </span>
                      {nl.scheduledFor && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          Sends: {nl.scheduledFor}
                        </span>
                      )}
                      {nl.sentAt && (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Sent: {nl.sentAt}
                        </span>
                      )}
                      {nl.openRate && (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                          <BarChart2 className="w-3 h-3" />
                          {nl.openRate}% open rate
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {nl.sections.map((s, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-2 gap-5">
          {templates.map((tmpl) => {
            const c = colorMap[tmpl.color];
            const Icon = tmpl.icon;
            return (
              <div key={tmpl.name} className={`bg-white rounded-xl border ${c.border} shadow-sm overflow-hidden`}>
                <div className={`${c.bg} px-5 py-4 border-b ${c.border}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-5 h-5 ${c.text}`} />
                    <h3 className={`font-bold ${c.text}`}>{tmpl.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{tmpl.desc}</p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">Cadence</span>
                      <p className="text-gray-700 mt-1 font-semibold">{tmpl.cadence}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">Audience</span>
                      <p className="text-gray-700 mt-1 font-semibold">{tmpl.audience}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">Sections</span>
                    <ul className="mt-2 space-y-1.5">
                      {tmpl.sections.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${c.accent} shrink-0`} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold ${c.text} ${c.bg} border ${c.border} hover:opacity-90 transition-opacity`}>
                    Use This Blueprint
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Composer Tab */}
      {activeTab === "composer" && (
        <div className="max-w-3xl space-y-4">
          <div className="bg-gradient-to-br from-[#0a0f1e] to-[#111827] rounded-xl p-5 text-white border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm">AI-Assisted Newsletter Composer</span>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              {"Hemut's AI auto-drafts newsletters from live operational data — fleet KPIs, load performance, invoice aging — so your team communicates consistently and on time, every time."}
            </p>
          </div>

          {[
            {
              step: "01",
              title: "Define Your Audience & Purpose",
              desc: "Every newsletter serves one audience. Before writing, answer: Who receives this? What do they need to act on? Use Hemut's audience segments: Drivers, Dispatchers, Finance, or All-Team.",
              tips: [
                "Drivers need safety, compliance, pay, and route info — keep it simple and mobile-first",
                "Dispatchers need KPIs, load status, and operational changes",
                "Finance needs revenue, invoice aging, and cost variance",
                "Never send a catch-all update when a targeted one exists",
              ],
            },
            {
              step: "02",
              title: "Use the Section Blueprint",
              desc: "Every Hemut newsletter follows a consistent section structure. Readers know what to expect — this predictability increases open rates and trust over time.",
              tips: [
                "Lead with the most urgent or impactful item — top of fold",
                "KPIs and metrics always visualized — never buried in a paragraph",
                "End every issue with a clear action item or call-to-action",
                "Driver bulletins: use plain language, short sentences, bullet points",
              ],
            },
            {
              step: "03",
              title: "AI Data Pull",
              desc: "Hemut auto-populates each newsletter section with live data — fleet utilization, on-time %, RPM, invoice aging, open loads — so you write the narrative, not the numbers.",
              tips: [
                "Review all AI-generated data points before hitting send",
                "Customize the leadership message section — personal tone matters",
                "Flag anomalies in auto-populated metrics before they go out",
                "Driver bulletin safety alerts pull from live road condition APIs",
              ],
            },
            {
              step: "04",
              title: "Review, Schedule & Send",
              desc: "Every newsletter routes through a 1-click review. Optimal send times are pre-configured per audience to maximize open rates.",
              tips: [
                "Weekly Ops Digest: Monday 7:30 AM (before dispatch starts day)",
                "Driver Bulletin: Friday 4:00 PM (end of shift, high open rate)",
                "Finance Brief: 1st business day of month",
                "Company-Wide: requires leadership approval before send",
              ],
            },
          ].map((step) => (
            <div key={step.step} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm shadow-amber-500/30">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{step.desc}</p>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <Star className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
