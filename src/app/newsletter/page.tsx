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
} from "lucide-react";

type NewsletterType = "weekly-ops" | "driver-update" | "finance-brief" | "company-wide";
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
  "driver-update": { label: "Driver Update", color: "text-amber-700", bg: "bg-amber-100" },
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
    sections: ["Fleet performance KPIs", "Load highlights", "Driver spotlights", "Upcoming route changes"],
  },
  {
    id: "2",
    title: "Driver Update: Winter Safety Protocols",
    type: "driver-update",
    status: "sent",
    audience: "All Active Drivers",
    recipientCount: 58,
    sentAt: "Feb 14, 2026",
    openRate: 78,
    sections: ["Safety reminders", "Weather alerts", "App feature updates", "Payroll dates"],
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
    sections: ["Revenue summary", "Invoice aging report", "Cost analysis", "Q1 forecast preview"],
  },
  {
    id: "4",
    title: "Company-Wide: Q1 Kickoff Recap",
    type: "company-wide",
    status: "draft",
    audience: "Entire Team",
    recipientCount: 104,
    sections: ["Q1 goals announced", "New hires welcome", "Culture initiatives", "Leadership message"],
  },
];

const templates = [
  {
    name: "Weekly Ops Digest",
    desc: "Monday morning operations briefing for dispatchers and managers",
    sections: ["KPI Summary", "Active Loads & Fleet Status", "Driver Spotlight", "Upcoming Changes", "Action Items"],
    cadence: "Every Monday 7:30 AM",
    audience: "Ops Team (34)",
    color: "blue",
  },
  {
    name: "Driver Update",
    desc: "Bi-weekly update for all active drivers covering safety, pay, and app news",
    sections: ["Safety & Compliance Updates", "Payroll & Benefits Info", "Route & Load News", "App Feature Tips", "Recognition Corner"],
    cadence: "Every other Friday 4 PM",
    audience: "All Drivers (58)",
    color: "amber",
  },
  {
    name: "Finance Brief",
    desc: "Monthly financial summary for leadership and finance team",
    sections: ["Revenue & Margin Summary", "Invoice Aging", "Top Carrier Performance", "Cost Breakdown", "Next Month Forecast"],
    cadence: "1st business day of month",
    audience: "Finance & Leadership (12)",
    color: "emerald",
  },
  {
    name: "Company-Wide Bulletin",
    desc: "Quarterly all-hands update covering company milestones, new hires, and culture",
    sections: ["CEO Message", "Company Milestones", "New Team Members", "Culture & Events", "Upcoming Priorities"],
    cadence: "Quarterly",
    audience: "Full Team (104)",
    color: "purple",
  },
];

const colorMap: Record<string, { border: string; bg: string; accent: string; text: string }> = {
  blue: { border: "border-blue-200", bg: "bg-blue-50", accent: "bg-blue-500", text: "text-blue-700" },
  amber: { border: "border-amber-200", bg: "bg-amber-50", accent: "bg-amber-500", text: "text-amber-700" },
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50", accent: "bg-emerald-500", text: "text-emerald-700" },
  purple: { border: "border-purple-200", bg: "bg-purple-50", accent: "bg-purple-500", text: "text-purple-700" },
};

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "templates" | "composer">("overview");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter System</h1>
          <p className="text-gray-500 mt-0.5">Structured communication blueprints for every team segment</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Create Newsletter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Sent This Month", value: "6", icon: Send, bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Total Recipients", value: "104", icon: Users, bg: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "Avg. Open Rate", value: "85%", icon: TrendingUp, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "Scheduled", value: "2", icon: Calendar, bg: "bg-purple-50", iconColor: "text-purple-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
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
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
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
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{nl.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${type.bg} ${type.color}`}>
                        {type.label}
                      </span>
                      <span className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {nl.audience} ({nl.recipientCount})
                      </span>
                      {nl.scheduledFor && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Scheduled: {nl.scheduledFor}
                        </span>
                      )}
                      {nl.sentAt && (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Sent: {nl.sentAt}
                        </span>
                      )}
                      {nl.openRate && (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                          <BarChart2 className="w-3.5 h-3.5" />
                          {nl.openRate}% open rate
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {nl.sections.map((s, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-2 gap-6">
          {templates.map((tmpl) => {
            const c = colorMap[tmpl.color];
            return (
              <div key={tmpl.name} className={`bg-white rounded-xl border ${c.border} shadow-sm overflow-hidden`}>
                <div className={`${c.bg} px-6 py-5 border-b ${c.border}`}>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{tmpl.name}</h3>
                  <p className="text-sm text-gray-600">{tmpl.desc}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Cadence</span>
                      <p className="text-gray-700 mt-1 font-medium">{tmpl.cadence}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Audience</span>
                      <p className="text-gray-700 mt-1 font-medium">{tmpl.audience}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Sections</span>
                    <ul className="mt-2 space-y-1.5">
                      {tmpl.sections.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${c.accent}`} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={`mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${c.text} ${c.bg} border ${c.border} hover:opacity-90 transition-opacity`}>
                    Use This Blueprint
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Composer Tab */}
      {activeTab === "composer" && (
        <div className="max-w-3xl space-y-5">
          <div className="bg-gradient-to-r from-[#0f1629] to-[#162040] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-lg">AI-Assisted Newsletter Composer</span>
            </div>
            <p className="text-white/70 text-sm">
              {"Hemut's AI drafts newsletters automatically from live operational data. Follow this guide to produce consistent, high-quality team communications every time."}
            </p>
          </div>

          {[
            {
              step: "01",
              title: "Define Your Audience & Purpose",
              desc: "Before writing, answer: Who needs this? What do they need to know? What action should they take? Each newsletter serves one primary audience.",
              tips: ["Use predefined audience segments (Drivers, Dispatchers, Finance, All-Team)", "Never send general updates when specific updates exist", "Keep each issue purpose-driven, not a catch-all"],
            },
            {
              step: "02",
              title: "Use the Section Blueprint",
              desc: "Every Hemut newsletter follows a consistent structure. Readers know what to expect, increasing open rates and trust.",
              tips: ["Lead with the most important update (top of fold)", "KPIs/metrics always visualized — never buried in text", "End with a clear CTA or action item"],
            },
            {
              step: "03",
              title: "AI Data Pull",
              desc: "Hemut automatically pulls real-time data for each newsletter section — fleet stats, invoice summaries, driver performance — so you focus on narrative, not numbers.",
              tips: ["Review AI-generated data points before sending", "Customize the 'Leadership Note' section personally", "Flag any anomalies in auto-populated metrics"],
            },
            {
              step: "04",
              title: "Review, Schedule & Send",
              desc: "All newsletters go through a 1-click review process. Scheduled sends ensure teams receive updates at optimal times.",
              tips: ["Weekly Ops: Monday 7:30 AM", "Driver Updates: Friday 4:00 PM", "Finance Brief: 1st business day monthly", "Company-Wide: Leadership approval required"],
            },
          ].map((step) => (
            <div key={step.step} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{step.desc}</p>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
