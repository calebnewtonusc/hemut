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
  ClipboardCheck,
  Radio,
} from "lucide-react";

type Stage = "pre-hire" | "day1" | "week1" | "week2" | "ramped";
type Role = "driver" | "dispatcher" | "admin" | "finance";

interface OnboardingMember {
  id: string;
  name: string;
  initials: string;
  role: Role;
  startDate: string;
  stage: Stage;
  progress: number;
  tasks: { label: string; done: boolean; required?: boolean }[];
  mentor: string;
}

const stageLabels: Record<Stage, string> = {
  "pre-hire": "Pre-Hire",
  day1: "Day 1",
  week1: "Week 1",
  week2: "Week 2",
  ramped: "Ramped",
};

const stageColors: Record<Stage, string> = {
  "pre-hire": "bg-purple-100 text-purple-700",
  day1: "bg-sky-100 text-sky-700",
  week1: "bg-blue-100 text-blue-700",
  week2: "bg-amber-100 text-amber-700",
  ramped: "bg-emerald-100 text-emerald-700",
};

const roleColors: Record<Role, string> = {
  driver: "bg-blue-50 text-blue-700 border-blue-200",
  dispatcher: "bg-amber-50 text-amber-700 border-amber-200",
  admin: "bg-purple-50 text-purple-700 border-purple-200",
  finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const roleLabels: Record<Role, string> = {
  driver: "CDL Driver",
  dispatcher: "Dispatcher",
  admin: "Admin",
  finance: "Finance",
};

const mockMembers: OnboardingMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    initials: "SC",
    role: "driver",
    startDate: "Feb 17, 2026",
    stage: "week1",
    progress: 35,
    mentor: "Marcus Johnson (Sr. Driver)",
    tasks: [
      { label: "CDL verification & MVR pull", done: true, required: true },
      { label: "DOT pre-employment drug test", done: true, required: true },
      { label: "FMCSA Clearinghouse query signed", done: true, required: true },
      { label: "ELD device paired to Hemut app", done: false, required: true },
      { label: "Shadow dispatch for 1 full shift", done: false },
      { label: "HOS rules & 11-hour clock training", done: false },
      { label: "First solo load assigned", done: false },
    ],
  },
  {
    id: "2",
    name: "David Reyes",
    initials: "DR",
    role: "dispatcher",
    startDate: "Feb 10, 2026",
    stage: "week2",
    progress: 65,
    mentor: "Amy Torres (Lead Dispatcher)",
    tasks: [
      { label: "TMS platform access granted", done: true, required: true },
      { label: "Load board & rate negotiation training", done: true, required: true },
      { label: "Communication protocols signed off", done: true, required: true },
      { label: "Shadow 5 live dispatches with mentor", done: true },
      { label: "Handle 10 independent dispatches", done: false },
      { label: "30-day check-in with ops manager", done: false },
    ],
  },
  {
    id: "3",
    name: "Priya Patel",
    initials: "PP",
    role: "finance",
    startDate: "Jan 27, 2026",
    stage: "week2",
    progress: 85,
    mentor: "Robert Kim (Finance Lead)",
    tasks: [
      { label: "Accounting system & factoring setup", done: true, required: true },
      { label: "Invoice workflow & aging review", done: true, required: true },
      { label: "Audit first 20 carrier invoices", done: true },
      { label: "IFTA reporting process walkthrough", done: true },
      { label: "Meet all active carrier contacts", done: false },
      { label: "90-day review scheduled", done: false },
    ],
  },
  {
    id: "4",
    name: "James Liu",
    initials: "JL",
    role: "admin",
    startDate: "Mar 3, 2026",
    stage: "pre-hire",
    progress: 10,
    mentor: "Sara Williams (Office Manager)",
    tasks: [
      { label: "Offer letter counter-signed", done: true, required: true },
      { label: "I-9 and W-4 submitted", done: false, required: true },
      { label: "Background check initiated", done: false, required: true },
      { label: "Welcome kit & equipment shipped", done: false },
      { label: "Day 1 agenda confirmed", done: false },
    ],
  },
];

const driverTrack = [
  {
    name: "Pre-Hire",
    days: "Days −14 to 0",
    color: "border-t-purple-400 bg-purple-50/50",
    dot: "bg-purple-500",
    items: [
      "MVR (Motor Vehicle Record) pull",
      "DOT physical examination",
      "CDL copy & verification",
      "Pre-employment drug & alcohol test",
      "FMCSA Clearinghouse query",
      "10-year employment history check",
    ],
  },
  {
    name: "Week 1",
    days: "Days 1–7",
    color: "border-t-blue-400 bg-blue-50/50",
    dot: "bg-blue-500",
    items: [
      "I-9, W-4, direct deposit forms",
      "Safety handbook acknowledgment",
      "ELD device assigned & paired",
      "Hemut Driver App installed & trained",
      "HOS rules & 11-hour clock",
      "Pre-trip / post-trip inspection cert",
      "Shadow senior driver — 1 load",
    ],
  },
  {
    name: "Week 2",
    days: "Days 8–14",
    color: "border-t-amber-400 bg-amber-50/50",
    dot: "bg-amber-500",
    items: [
      "First solo load assigned",
      "Fuel card & IFTA reporting",
      "Accident & breakdown procedures",
      "Dispatch communication protocol",
      "Customer delivery expectations",
      "Check-in with ops manager",
    ],
  },
  {
    name: "Ramped",
    days: "Day 30+",
    color: "border-t-emerald-400 bg-emerald-50/50",
    dot: "bg-emerald-500",
    items: [
      "Full independent operation",
      "KPI baseline set (OTD, RPM)",
      "30-day performance review",
      "CSA score education & targets",
      "Mentor feedback session",
      "Team integration complete",
    ],
  },
];

const dispatcherTrack = [
  {
    name: "Pre-Hire",
    days: "Days −14 to 0",
    color: "border-t-purple-400 bg-purple-50/50",
    dot: "bg-purple-500",
    items: [
      "Background check initiated",
      "I-9 and W-4 forms",
      "TMS access request submitted",
      "Hardware & headset configured",
    ],
  },
  {
    name: "Week 1",
    days: "Days 1–7",
    color: "border-t-blue-400 bg-blue-50/50",
    dot: "bg-blue-500",
    items: [
      "Hemut TMS deep-dive training",
      "Load board & posting workflow",
      "Communication standards & SOPs",
      "Shadow senior dispatcher — 5 loads",
      "Carrier rate negotiation basics",
    ],
  },
  {
    name: "Week 2",
    days: "Days 8–14",
    color: "border-t-amber-400 bg-amber-50/50",
    dot: "bg-amber-500",
    items: [
      "Handle 10 supervised dispatches",
      "Exception & escalation procedures",
      "Driver relationship protocols",
      "Detention & accessorial billing",
      "Daily stand-up participation",
    ],
  },
  {
    name: "Ramped",
    days: "Day 30+",
    color: "border-t-emerald-400 bg-emerald-50/50",
    dot: "bg-emerald-500",
    items: [
      "Independent load management",
      "KPI targets set (loads/day, margin)",
      "Carrier network ownership",
      "Mentor program participation",
      "30-day performance review",
    ],
  },
];

const checklistItems = [
  { icon: FileText, label: "HR Documents", desc: "I-9, W-4, direct deposit authorization, emergency contacts, handbook acknowledgment", required: true },
  { icon: Shield, label: "Compliance & Certs", desc: "DOT compliance forms, FMCSA Clearinghouse query, safety certifications, drug test clearance", required: true },
  { icon: Smartphone, label: "Technology Setup", desc: "Hemut app access, ELD device pairing (drivers), company email, TMS credentials", required: true },
  { icon: BookOpen, label: "Training Modules", desc: "Role-specific training, HOS rules (drivers), TMS platform (dispatchers), invoice workflow (finance)", required: true },
  { icon: ClipboardCheck, label: "Drug & Alcohol Program", desc: "Pre-employment test cleared, enrolled in random testing consortium, policy signed", required: true },
  { icon: Users, label: "Team Introduction", desc: "Department meet & greet, mentor assigned, manager 1:1 scheduled, buddy program pairing", required: false },
  { icon: Star, label: "30-Day Check-In", desc: "Performance snapshot, goal alignment, resource gaps identified, feedback captured", required: false },
  { icon: CheckCircle2, label: "Ramp Certification", desc: "Independent performance confirmed, KPI baseline locked in, onboarding officially closed", required: false },
];

export function OnboardingClient() {
  const [activeTab, setActiveTab] = useState<"active" | "tracks" | "checklist">("active");
  const [search, setSearch] = useState("");

  const filtered = mockMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Onboarding Framework</h1>
          <p className="text-sm text-gray-400 mt-0.5">DOT-compliant structured onboarding for every Hemut role</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Start Onboarding
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Onboardees", value: "4", sub: "2 drivers · 1 dispatcher · 1 finance" },
          { label: "Avg. Time to Ramp", value: "18 days", sub: "↓ 3 days from last quarter" },
          { label: "DOT Compliance Rate", value: "100%", sub: "All pre-hires cleared" },
          { label: "Pending Actions", value: "7", sub: "Requires attention today" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-xs font-semibold text-gray-700 mb-0.5">{card.label}</div>
            <div className="text-xs text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {(["active", "tracks", "checklist"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
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
          <div className="relative max-w-xs mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((member) => (
              <div key={member.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Started {member.startDate}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${roleColors[member.role]}`}>
                      {roleLabels[member.role]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${stageColors[member.stage]}`}>
                      {stageLabels[member.stage]}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Onboarding Progress</span>
                    <span className="text-xs font-bold text-gray-900">{member.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${member.progress === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${member.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {member.tasks.slice(0, 4).map((task) => (
                    <div key={task.label} className="flex items-center gap-2 text-xs">
                      {task.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${task.required ? "border-amber-400" : "border-gray-300"}`} />
                      )}
                      <span className={task.done ? "line-through text-gray-400" : "text-gray-600"}>{task.label}</span>
                      {task.required && !task.done && (
                        <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold uppercase">Req.</span>
                      )}
                    </div>
                  ))}
                  {member.tasks.length > 4 && (
                    <span className="text-xs text-gray-400 ml-5">+{member.tasks.length - 4} more tasks</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Mentor: <span className="text-gray-600 font-medium">{member.mentor}</span></span>
                  <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1">
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
          {[
            { role: "CDL Driver", icon: Truck, bg: "bg-blue-50", iconColor: "text-blue-600", track: driverTrack },
            { role: "Dispatcher", icon: Radio, bg: "bg-amber-50", iconColor: "text-amber-600", track: dispatcherTrack },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.role} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${t.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${t.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{t.role} Onboarding Track</h3>
                </div>
                <div className="grid grid-cols-4 divide-x divide-gray-100">
                  {t.track.map((phase) => (
                    <div key={phase.name} className={`p-5 border-t-2 ${phase.color}`}>
                      <div className="font-bold text-gray-900 mb-0.5 text-sm">{phase.name}</div>
                      <div className="text-xs text-gray-400 mb-3 font-medium">{phase.days}</div>
                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                            <div className={`w-1.5 h-1.5 rounded-full ${phase.dot} mt-1.5 shrink-0`} />
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-900 text-sm">Universal Onboarding Checklist</div>
              <p className="text-xs text-amber-700 mt-1">
                Applies to all Hemut team members. Role-specific requirements layered on top. Items marked Required must clear before Day 1 system access is granted.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {checklistItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                    <Icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                      {item.required && (
                        <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
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
