"use client";
import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  Truck,
  FileText,
  Shield,
  Smartphone,
  Users,
  BookOpen,
  Star,
} from "lucide-react";

type Stage = "pre" | "week1" | "week2" | "week4" | "complete";
type Role = "driver" | "dispatcher" | "admin" | "finance";

interface OnboardingMember {
  id: string;
  name: string;
  role: Role;
  startDate: string;
  stage: Stage;
  progress: number;
  tasks: { label: string; done: boolean }[];
  mentor: string;
}

const stageLabels: Record<Stage, string> = {
  pre: "Pre-Hire",
  week1: "Week 1",
  week2: "Week 2",
  week4: "Week 4",
  complete: "Complete",
};

const stageColors: Record<Stage, string> = {
  pre: "bg-purple-100 text-purple-700",
  week1: "bg-blue-100 text-blue-700",
  week2: "bg-amber-100 text-amber-700",
  week4: "bg-orange-100 text-orange-700",
  complete: "bg-emerald-100 text-emerald-700",
};

const roleColors: Record<Role, string> = {
  driver: "bg-blue-50 text-blue-700 border-blue-200",
  dispatcher: "bg-amber-50 text-amber-700 border-amber-200",
  admin: "bg-purple-50 text-purple-700 border-purple-200",
  finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const mockMembers: OnboardingMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "driver",
    startDate: "Feb 17, 2026",
    stage: "week1",
    progress: 35,
    mentor: "Marcus Johnson",
    tasks: [
      { label: "Complete DOT medical exam", done: true },
      { label: "Submit background check", done: true },
      { label: "Hemut app setup & training", done: false },
      { label: "Shadow dispatch for 1 shift", done: false },
      { label: "First solo load assigned", done: false },
    ],
  },
  {
    id: "2",
    name: "David Reyes",
    role: "dispatcher",
    startDate: "Feb 10, 2026",
    stage: "week2",
    progress: 65,
    mentor: "Amy Torres",
    tasks: [
      { label: "System access & credentials", done: true },
      { label: "Load management training", done: true },
      { label: "Communication protocols review", done: true },
      { label: "Handle 10 independent dispatches", done: false },
      { label: "30-day check-in with manager", done: false },
    ],
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "finance",
    startDate: "Jan 27, 2026",
    stage: "week4",
    progress: 85,
    mentor: "Robert Kim",
    tasks: [
      { label: "Accounting software onboarding", done: true },
      { label: "Invoice workflow training", done: true },
      { label: "Audit first 20 invoices", done: true },
      { label: "Meet all carrier contacts", done: true },
      { label: "90-day review scheduled", done: false },
    ],
  },
  {
    id: "4",
    name: "James Liu",
    role: "admin",
    startDate: "Mar 3, 2026",
    stage: "pre",
    progress: 10,
    mentor: "Sara Williams",
    tasks: [
      { label: "Offer letter signed", done: true },
      { label: "I-9 and W-4 forms submitted", done: false },
      { label: "Background check initiated", done: false },
      { label: "Welcome kit sent", done: false },
      { label: "Day 1 agenda confirmed", done: false },
    ],
  },
];

const onboardingTracks = [
  {
    role: "Driver",
    icon: Truck,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    phases: [
      { name: "Pre-Hire", days: "Days -14 to 0", items: ["Background check", "DOT physical", "CDL verification", "Drug test"] },
      { name: "Week 1", days: "Days 1-7", items: ["App installation & training", "Route familiarization", "Shadow experienced driver", "Safety protocols"] },
      { name: "Week 2", days: "Days 8-14", items: ["First solo load", "Check-in with ops manager", "Fleet maintenance basics", "Emergency procedures"] },
      { name: "Month 1+", days: "Days 15-30+", items: ["Full independent operation", "Performance review", "Feedback session", "Team integration"] },
    ],
  },
  {
    role: "Dispatcher",
    icon: Users,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    phases: [
      { name: "Pre-Hire", days: "Days -14 to 0", items: ["Offer letter", "I-9 forms", "System access request", "Equipment setup"] },
      { name: "Week 1", days: "Days 1-7", items: ["Hemut platform deep-dive", "Load board training", "Communication standards", "Shadow senior dispatcher"] },
      { name: "Week 2", days: "Days 8-14", items: ["Handle supervised dispatches", "Carrier relationship intro", "Escalation procedures", "Rate negotiation basics"] },
      { name: "Month 1+", days: "Days 15-30+", items: ["Independent load management", "KPI targets set", "Mentor program", "30-day performance review"] },
    ],
  },
];

const checklistItems = [
  { icon: FileText, label: "Document Collection", desc: "I-9, W-4, direct deposit, emergency contacts", required: true },
  { icon: Shield, label: "Compliance & Certifications", desc: "DOT compliance, safety certifications, training modules", required: true },
  { icon: Smartphone, label: "Technology Setup", desc: "Hemut app, email, communication channels, ELD device", required: true },
  { icon: BookOpen, label: "Training Completion", desc: "Role-specific training tracks, compliance modules", required: true },
  { icon: Users, label: "Team Introduction", desc: "Meet your team, manager 1:1, buddy program assignment", required: false },
  { icon: Star, label: "30-Day Check-In", desc: "Performance feedback, goal setting, resource review", required: false },
];

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState<"active" | "tracks" | "checklist">("active");
  const [search, setSearch] = useState("");

  const filtered = mockMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding Framework</h1>
          <p className="text-gray-500 mt-0.5">Scalable, structured onboarding for every Hemut role</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Start Onboarding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Active Onboardees", value: "4", sub: "2 drivers, 1 dispatcher, 1 finance" },
          { label: "Avg. Time to Ramp", value: "18 days", sub: "↓ 3 days from last quarter" },
          { label: "Completion Rate", value: "94%", sub: "Up 6% this month" },
          { label: "Pending Actions", value: "7", sub: "Needs your attention" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm font-medium text-gray-700 mb-1">{card.label}</div>
            <div className="text-xs text-gray-500">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {(["active", "tracks", "checklist"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "active" ? "Active Members" : tab === "tracks" ? "Role Tracks" : "Master Checklist"}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      {activeTab === "active" && (
        <div>
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((member) => (
              <div key={member.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">Started {member.startDate}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColors[member.stage]}`}>
                      {stageLabels[member.stage]}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Overall Progress</span>
                    <span className="text-xs font-semibold text-gray-900">{member.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${member.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {member.tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      {task.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                      )}
                      <span className={task.done ? "line-through text-gray-400" : "text-gray-600"}>{task.label}</span>
                    </div>
                  ))}
                  {member.tasks.length > 3 && (
                    <span className="text-xs text-gray-400 ml-6">+{member.tasks.length - 3} more tasks</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Mentor: <span className="text-gray-700 font-medium">{member.mentor}</span></span>
                  <button className="text-xs text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1">
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracks Tab */}
      {activeTab === "tracks" && (
        <div className="space-y-6">
          {onboardingTracks.map((track) => {
            const Icon = track.icon;
            return (
              <div key={track.role} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${track.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${track.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{track.role} Onboarding Track</h3>
                </div>
                <div className="grid grid-cols-4 divide-x divide-gray-100">
                  {track.phases.map((phase, i) => (
                    <div key={i} className="p-5">
                      <div className="font-semibold text-gray-900 mb-1">{phase.name}</div>
                      <div className="text-xs text-gray-500 mb-3">{phase.days}</div>
                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === "checklist" && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-900">Universal Onboarding Checklist</div>
                <p className="text-sm text-amber-700 mt-1">
                  This master checklist applies to all new Hemut team members. Role-specific items are added on top. Required items must be completed before Day 1.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {checklistItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.label}</span>
                      {item.required && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{item.desc}</p>
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
