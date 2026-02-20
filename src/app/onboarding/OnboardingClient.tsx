"use client";
import { useState, useReducer } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Plus,
  Search,
  Truck,
  Radio,
  DollarSign,
  ClipboardList,
  X,
  Users,
  Clock,
  Shield,
  AlertCircle,
  StickyNote,
  AlertTriangle,
  Calendar,
  TrendingUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "driver" | "dispatcher" | "finance" | "admin";
type MasterCategory = "Pre-Hire" | "Week 1" | "Week 2" | "Week 3-4" | "Certification";
type OnboardingStatus = "pending" | "in-progress" | "complete" | "overdue";

interface Task {
  label: string;
  done: boolean;
  required?: boolean;
}

interface OnboardingMember {
  id: string;
  name: string;
  initials: string;
  role: Role;
  startDate: string;
  weekNum: number;
  progress: number;
  tasks: Task[];
  mentor: string;
  preHire: boolean;
  notes: string;
  status: OnboardingStatus;
}

interface MasterItem {
  id: string;
  task: string;
  category: MasterCategory;
  roles: Role[];
  required: boolean;
  assignee: string;
  done: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<Role, string> = {
  driver: "CDL Driver",
  dispatcher: "Dispatcher",
  finance: "Finance",
  admin: "Admin",
};

const ROLE_COLOR: Record<Role, { badge: string; bar: string; dot: string; border: string; icon: string; iconBg: string }> = {
  driver: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bar: "bg-amber-500",
    dot: "bg-amber-400",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    iconBg: "bg-amber-500/10 border border-amber-500/15",
  },
  dispatcher: {
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    bar: "bg-sky-500",
    dot: "bg-sky-400",
    border: "border-sky-500/20",
    icon: "text-sky-400",
    iconBg: "bg-sky-500/10 border border-sky-500/15",
  },
  finance: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    bar: "bg-emerald-500",
    dot: "bg-emerald-400",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border border-emerald-500/15",
  },
  admin: {
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    bar: "bg-violet-500",
    dot: "bg-violet-400",
    border: "border-violet-500/20",
    icon: "text-violet-400",
    iconBg: "bg-violet-500/10 border border-violet-500/15",
  },
};

const STATUS_CONFIG: Record<OnboardingStatus, { label: string; cls: string }> = {
  "pending":     { label: "Pending",     cls: "bg-white/[0.07] text-white/45 border-white/[0.1]" },
  "in-progress": { label: "In Progress", cls: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  "complete":    { label: "Complete",    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  "overdue":     { label: "Overdue",     cls: "bg-red-500/15 text-red-400 border-red-500/20" },
};

const MASTER_CATEGORY_ORDER: MasterCategory[] = [
  "Pre-Hire",
  "Week 1",
  "Week 2",
  "Week 3-4",
  "Certification",
];

// Timeline phases for the progress tracker
const TIMELINE_PHASES = ["Pre-Hire", "Week 1", "Week 2", "Week 3-4", "Certified"];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: OnboardingMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    initials: "SC",
    role: "driver",
    startDate: "Feb 17, 2026",
    weekNum: 1,
    progress: 35,
    mentor: "Marcus Johnson (Sr. Driver)",
    preHire: false,
    notes: "",
    status: "in-progress",
    tasks: [
      { label: "CDL verification & MVR pull", done: true, required: true },
      { label: "DOT pre-employment drug test", done: true, required: true },
      { label: "FMCSA Clearinghouse query signed", done: true, required: true },
      { label: "ELD device paired to Hemut app", done: false, required: true },
      { label: "Shadow dispatch for 1 full shift", done: false },
      { label: "HOS rules & 11-hour clock training", done: false },
      { label: "First solo load assigned", done: false },
      { label: "Pre-trip / post-trip inspection cert", done: false },
      { label: "Safety handbook acknowledgment", done: false },
      { label: "I-9, W-4, direct deposit forms", done: false, required: true },
    ],
  },
  {
    id: "2",
    name: "David Reyes",
    initials: "DR",
    role: "dispatcher",
    startDate: "Feb 10, 2026",
    weekNum: 2,
    progress: 65,
    mentor: "Amy Torres (Lead Dispatcher)",
    preHire: false,
    notes: "",
    status: "in-progress",
    tasks: [
      { label: "TMS platform access granted", done: true, required: true },
      { label: "Load board & rate negotiation training", done: true, required: true },
      { label: "Communication protocols signed off", done: true, required: true },
      { label: "Shadow 5 live dispatches with mentor", done: true },
      { label: "Handle 10 independent dispatches", done: false },
      { label: "Exception & escalation procedures", done: false },
      { label: "Detention & accessorial billing", done: false },
      { label: "30-day check-in with ops manager", done: false },
    ],
  },
  {
    id: "3",
    name: "Priya Patel",
    initials: "PP",
    role: "finance",
    startDate: "Jan 27, 2026",
    weekNum: 4,
    progress: 85,
    mentor: "Robert Kim (Finance Lead)",
    preHire: false,
    notes: "",
    status: "in-progress",
    tasks: [
      { label: "Accounting system & factoring setup", done: true, required: true },
      { label: "Invoice workflow & aging review", done: true, required: true },
      { label: "Audit first 20 carrier invoices", done: true },
      { label: "IFTA reporting process walkthrough", done: true },
      { label: "Factoring company introduction", done: true },
      { label: "Meet all active carrier contacts", done: false },
      { label: "Month-end close process walkthrough", done: false },
      { label: "90-day review scheduled", done: false },
    ],
  },
  {
    id: "4",
    name: "James Liu",
    initials: "JL",
    role: "admin",
    startDate: "Mar 3, 2026",
    weekNum: 0,
    progress: 10,
    mentor: "Sara Williams (Office Manager)",
    preHire: true,
    notes: "",
    status: "pending",
    tasks: [
      { label: "Offer letter counter-signed", done: true, required: true },
      { label: "I-9 and W-4 submitted", done: false, required: true },
      { label: "Background check initiated", done: false, required: true },
      { label: "Welcome kit & equipment shipped", done: false },
      { label: "System access provisioned", done: false, required: true },
      { label: "Day 1 agenda confirmed", done: false },
      { label: "Policy acknowledgment signed", done: false, required: true },
    ],
  },
];

const ROLE_TRACKS = [
  {
    role: "driver" as Role,
    title: "CDL Driver Track",
    stepCount: 12,
    avgTime: "21 days",
    steps: [
      "CDL verification & MVR pull",
      "DOT pre-employment drug test",
      "FMCSA Clearinghouse query",
      "I-9, W-4, direct deposit forms",
      "ELD device assigned & paired",
      "Hemut Driver App training",
      "HOS rules & 11-hour clock",
      "Pre-trip / post-trip inspection cert",
      "Load board training",
      "Safety orientation",
      "Mentored dispatches (5)",
      "Solo certification",
    ],
  },
  {
    role: "dispatcher" as Role,
    title: "Dispatcher Track",
    stepCount: 10,
    avgTime: "18 days",
    steps: [
      "TMS access provisioned",
      "Rate negotiation training",
      "Load board mastery",
      "Communication protocols signed",
      "Exception & escalation procedures",
      "Detention & accessorial billing",
      "Driver relationship protocols",
      "Daily stand-up participation",
      "Live shadow dispatches (5)",
      "Solo sign-off",
    ],
  },
  {
    role: "finance" as Role,
    title: "Finance Track",
    stepCount: 8,
    avgTime: "14 days",
    steps: [
      "Accounting system setup",
      "Invoice workflow training",
      "IFTA reporting process",
      "Factoring company intro",
      "Audit first 20 carrier invoices",
      "Aging review walkthrough",
      "Month-end close process",
      "90-day review scheduled",
    ],
  },
  {
    role: "admin" as Role,
    title: "Admin Track",
    stepCount: 6,
    avgTime: "7 days",
    steps: [
      "I-9 / W-4 completion",
      "Background check cleared",
      "System access provisioned",
      "Welcome kit delivered",
      "Policy acknowledgment",
      "Department meet & greet",
    ],
  },
];

const INITIAL_MASTER_ITEMS: MasterItem[] = [
  { id: "m1", task: "Offer letter counter-signed", category: "Pre-Hire", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: true },
  { id: "m2", task: "Background check initiated", category: "Pre-Hire", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: true },
  { id: "m3", task: "DOT pre-employment drug test", category: "Pre-Hire", roles: ["driver"], required: true, assignee: "Ops", done: true },
  { id: "m4", task: "CDL verification & MVR pull", category: "Pre-Hire", roles: ["driver"], required: true, assignee: "Safety", done: true },
  { id: "m5", task: "FMCSA Clearinghouse query", category: "Pre-Hire", roles: ["driver"], required: true, assignee: "Safety", done: false },
  { id: "m6", task: "I-9, W-4, direct deposit forms", category: "Week 1", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: true },
  { id: "m7", task: "System access provisioned", category: "Week 1", roles: ["dispatcher", "finance", "admin"], required: true, assignee: "IT", done: true },
  { id: "m8", task: "ELD device paired to Hemut app", category: "Week 1", roles: ["driver"], required: true, assignee: "Ops", done: false },
  { id: "m9", task: "Safety handbook acknowledgment", category: "Week 1", roles: ["driver", "dispatcher"], required: true, assignee: "Safety", done: true },
  { id: "m10", task: "Mentor assignment confirmed", category: "Week 1", roles: ["driver", "dispatcher", "finance", "admin"], required: false, assignee: "Manager", done: true },
  { id: "m11", task: "Team introduction / meet & greet", category: "Week 1", roles: ["driver", "dispatcher", "finance", "admin"], required: false, assignee: "Manager", done: false },
  { id: "m12", task: "Role-specific training module completed", category: "Week 2", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "Trainer", done: false },
  { id: "m13", task: "Shadowing milestone (5 sessions)", category: "Week 2", roles: ["driver", "dispatcher"], required: false, assignee: "Mentor", done: true },
  { id: "m14", task: "First independent task completed", category: "Week 2", roles: ["driver", "dispatcher", "finance", "admin"], required: false, assignee: "Mentor", done: false },
  { id: "m15", task: "30-day check-in with ops manager", category: "Week 3-4", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "Manager", done: false },
  { id: "m16", task: "KPI baseline set", category: "Week 3-4", roles: ["driver", "dispatcher"], required: false, assignee: "Manager", done: false },
  { id: "m17", task: "Independent task quota met", category: "Week 3-4", roles: ["driver", "dispatcher", "finance"], required: false, assignee: "Mentor", done: false },
  { id: "m18", task: "Solo certification / sign-off", category: "Certification", roles: ["driver", "dispatcher"], required: true, assignee: "Ops Lead", done: false },
  { id: "m19", task: "Ramp certification complete", category: "Certification", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "Manager", done: false },
  { id: "m20", task: "Onboarding officially closed", category: "Certification", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: false },
];

const ROLE_ICONS: Record<Role, React.ElementType> = {
  driver: Truck,
  dispatcher: Radio,
  finance: DollarSign,
  admin: ClipboardList,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${ROLE_COLOR[role].badge}`}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: OnboardingStatus }) {
  const { label, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cls}`}>
      {label}
    </span>
  );
}

function ReqBadge() {
  return (
    <span className="bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-lg">
      REQ
    </span>
  );
}

// ─── Visual Timeline ──────────────────────────────────────────────────────────

function OnboardingTimeline({ weekNum, preHire }: { weekNum: number; preHire: boolean }) {
  // Determine current phase index: pre-hire=0, w1=1, w2=2, w3-4=3, certified=4
  const phaseIndex = preHire ? 0 : Math.min(weekNum, 4);

  return (
    <div className="w-full">
      <div className="flex items-center gap-0">
        {TIMELINE_PHASES.map((phase, i) => {
          const isComplete = i < phaseIndex;
          const isCurrent = i === phaseIndex;
          const isUpcoming = i > phaseIndex;
          return (
            <div key={phase} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Connector + dot */}
              <div className="flex items-center w-full">
                {/* Left line */}
                {i > 0 && (
                  <div className={`flex-1 h-[2px] ${isComplete || isCurrent ? "bg-amber-500" : "bg-white/[0.08]"}`} />
                )}
                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isComplete
                      ? "bg-amber-500 border-amber-500"
                      : isCurrent
                      ? "bg-amber-500/20 border-amber-500"
                      : "bg-transparent border-white/[0.12]"
                  }`}
                >
                  {isComplete && (
                    <svg className="w-2 h-2 text-[#080d1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                </div>
                {/* Right line */}
                {i < TIMELINE_PHASES.length - 1 && (
                  <div className={`flex-1 h-[2px] ${isComplete ? "bg-amber-500" : "bg-white/[0.08]"}`} />
                )}
              </div>
              {/* Label */}
              <span
                className={`text-[9px] font-semibold text-center leading-tight ${
                  isComplete ? "text-amber-400" : isCurrent ? "text-white/70" : "text-white/20"
                }`}
              >
                {phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  member: OnboardingMember;
  onClose: () => void;
  onToggleTask: (memberId: string, taskIdx: number) => void;
  onUpdateNotes: (memberId: string, notes: string) => void;
  onMarkComplete: (memberId: string) => void;
}

function DetailDrawer({ member, onClose, onToggleTask, onUpdateNotes, onMarkComplete }: DrawerProps) {
  const colors = ROLE_COLOR[member.role];
  const completedCount = member.tasks.filter((t) => t.done).length;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      />
      <div className="fixed right-0 top-0 h-full w-[440px] z-50 flex flex-col bg-[#0a1020] border-l border-white/[0.08] animate-slide-in-right">
        {/* Drawer header */}
        <div className="h-[68px] flex items-center justify-between px-6 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white bg-white/[0.08]">
              {member.initials}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-semibold text-white">{member.name}</span>
              <RoleBadge role={member.role} />
              <StatusBadge status={member.status} />
              {member.preHire && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.07] text-white/45 border border-white/[0.1] font-semibold">
                  Pre-Hire
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white/65 hover:bg-white/[0.06] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin">

          {/* Timeline */}
          <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5">
            <div className="text-[11px] text-white/35 font-medium mb-4">Onboarding Journey</div>
            <OnboardingTimeline weekNum={member.weekNum} preHire={member.preHire} />
          </div>

          {/* Progress section */}
          <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/35 font-medium">Task Progress</span>
              <span className="text-[13px] font-bold text-white">{member.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                style={{ width: `${member.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[12px] text-white/40">
              <span>{completedCount} of {member.tasks.length} tasks complete</span>
              {member.tasks.filter(t => t.required && !t.done).length > 0 && (
                <span className="text-amber-400 font-medium">
                  {member.tasks.filter(t => t.required && !t.done).length} required pending
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 pt-1 border-t border-white/[0.05]">
              <span className="flex items-center gap-1.5 text-[12px] text-white/40">
                <Clock className="w-3 h-3" />
                Started {member.startDate}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-white/40">
                <Users className="w-3 h-3" />
                {member.mentor.split(" (")[0]}
              </span>
            </div>
          </div>

          {/* Full task list */}
          <div>
            <div className="text-[11px] text-white/35 font-medium mb-3">
              Full Checklist
            </div>
            <div className="space-y-0.5">
              {member.tasks.map((task, idx) => (
                <button
                  key={task.label}
                  onClick={() => onToggleTask(member.id, idx)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left group"
                >
                  {task.done ? (
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${colors.icon}`} />
                  ) : (
                    <Circle className="w-4 h-4 shrink-0 mt-0.5 text-white/20 group-hover:text-white/35 transition-colors" />
                  )}
                  <span
                    className={`flex-1 text-[13px] leading-snug ${
                      task.done ? "line-through text-white/30" : "text-white/70"
                    }`}
                  >
                    {task.label}
                  </span>
                  {task.required && !task.done && <ReqBadge />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes section */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <StickyNote className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[11px] text-white/35 font-medium">Notes</span>
            </div>
            <textarea
              value={member.notes}
              onChange={(e) => onUpdateNotes(member.id, e.target.value)}
              placeholder="Add notes about this onboardee..."
              rows={3}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full resize-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-white/[0.06] shrink-0">
          <button
            onClick={() => onMarkComplete(member.id)}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#080d1a] text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Onboarding Complete
          </button>
        </div>
      </div>
    </>
  );
}

// ─── New Onboarding Modal ─────────────────────────────────────────────────────

interface NewOnboardeeForm {
  name: string;
  role: Role | "";
  startDate: string;
  mentor: string;
}

interface NewOnboardingModalProps {
  onClose: () => void;
  onSubmit: (form: NewOnboardeeForm) => void;
}

function NewOnboardingModal({ onClose, onSubmit }: NewOnboardingModalProps) {
  const [form, setForm] = useState<NewOnboardeeForm>({
    name: "",
    role: "",
    startDate: "",
    mentor: "",
  });

  const isValid = form.name.trim() && form.role && form.startDate;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      />
      <div
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-onboarding-title"
          className="w-full max-w-md bg-[#0a1020] border border-white/[0.1] rounded-2xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-slide-up"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 id="new-onboarding-title" className="text-[19px] font-bold text-white">Start Onboarding</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white/65 hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="onboard-name" className="block text-[11px] text-white/35 font-medium mb-1.5">
                Full Name
              </label>
              <input
                id="onboard-name"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full transition-all"
              />
            </div>

            <div>
              <label htmlFor="onboard-role" className="block text-[11px] text-white/35 font-medium mb-1.5">
                Role
              </label>
              {/* Role picker with visual cards */}
              <div className="grid grid-cols-2 gap-2">
                {(["driver", "dispatcher", "finance", "admin"] as Role[]).map((r) => {
                  const Icon = ROLE_ICONS[r];
                  const colors = ROLE_COLOR[r];
                  const selected = form.role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-[13px] font-medium text-left transition-all ${
                        selected
                          ? `${colors.iconBg} ${colors.border} ${colors.icon}`
                          : "bg-white/[0.03] border-white/[0.07] text-white/45 hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {ROLE_LABEL[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="onboard-startdate" className="block text-[11px] text-white/35 font-medium mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1 -mt-0.5" />
                Start Date
              </label>
              <input
                id="onboard-startdate"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full transition-all"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div>
              <label htmlFor="onboard-mentor" className="block text-[11px] text-white/35 font-medium mb-1.5">
                Mentor
              </label>
              <input
                id="onboard-mentor"
                type="text"
                placeholder="e.g. Marcus Johnson (Sr. Driver)"
                value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full transition-all"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="bg-white/[0.05] hover:bg-white/[0.08] text-white/65 hover:text-white/85 text-[13px] px-4 py-2 rounded-xl border border-white/[0.08] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => isValid && onSubmit(form)}
              disabled={!isValid}
              className="bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Framework
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-white/20 shrink-0" />
        <div className="text-[11px] text-white/35 font-medium">{label}</div>
      </div>
      <div className={`text-[26px] font-bold tracking-tight leading-none ${valueColor ?? "text-white"}`}>{value}</div>
      <div className="text-[12px] text-white/30 mt-0.5">{sub}</div>
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────

interface MemberCardProps {
  member: OnboardingMember;
  onViewDetails: () => void;
}

function MemberCard({ member, onViewDetails }: MemberCardProps) {
  const colors = ROLE_COLOR[member.role];
  const completedCount = member.tasks.filter((t) => t.done).length;
  const incompleteTasks = member.tasks.filter((t) => !t.done).slice(0, 2);
  const requiredPending = member.tasks.filter((t) => t.required && !t.done).length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onViewDetails}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetails(); }}
      className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.09] transition-all flex flex-col gap-3"
    >
      {/* Top: name + badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold ${colors.icon} ${colors.iconBg} shrink-0`}>
            {member.initials}
          </div>
          <div>
            <div className="text-[15px] font-semibold text-white/90">{member.name}</div>
            <div className="text-[12px] text-white/40 mt-0.5">
              {member.mentor.split(" (")[0]}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <RoleBadge role={member.role} />
          <StatusBadge status={member.status} />
        </div>
      </div>

      {/* Start date */}
      <div className="flex items-center gap-1.5 text-[12px] text-white/35">
        <Calendar className="w-3 h-3 shrink-0" />
        {member.preHire ? `Starts ${member.startDate}` : `Started ${member.startDate}`}
        {member.weekNum > 0 && ` · Week ${member.weekNum}`}
      </div>

      {/* Timeline strip */}
      <OnboardingTimeline weekNum={member.weekNum} preHire={member.preHire} />

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-white/35 font-medium">Completion</span>
          <span className="text-[12px] font-semibold text-white/55">{member.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
            style={{ width: `${member.progress}%` }}
          />
        </div>
      </div>

      {/* Task count + required warning */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white/40">
          {completedCount}/{member.tasks.length} tasks
        </span>
        {requiredPending > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
            <AlertTriangle className="w-3 h-3" />
            {requiredPending} required
          </span>
        )}
      </div>

      {/* Incomplete tasks */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-1.5 border-t border-white/[0.05] pt-3">
          {incompleteTasks.map((task) => (
            <div key={task.label} className="flex items-center gap-2.5">
              <Circle className="w-3 h-3 shrink-0 text-white/20" />
              <span className="text-[12px] text-white/35 truncate leading-snug">{task.label}</span>
              {task.required && <ReqBadge />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
        <Users className="w-6 h-6 text-white/20" />
      </div>
      <p className="text-[13px] text-white/30 max-w-xs">{message}</p>
    </div>
  );
}

// ─── Role Track Card ──────────────────────────────────────────────────────────

function RoleTrackCard({
  role,
  title,
  stepCount,
  avgTime,
  steps,
}: {
  role: Role;
  title: string;
  stepCount: number;
  avgTime: string;
  steps: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = ROLE_COLOR[role];
  const Icon = ROLE_ICONS[role];

  return (
    <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
          <Icon className={`w-4 h-4 ${colors.icon}`} />
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-semibold text-white">{title}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-white/40">{stepCount} steps</span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1 text-[12px] text-white/40">
              <Clock className="w-3 h-3" />
              Avg {avgTime}
            </span>
          </div>
        </div>
        <RoleBadge role={role} />
      </div>

      {/* Timeline visual for track */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {steps.slice(0, 5).map((step, i) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full ${colors.bar} opacity-${Math.round((1 - i * 0.15) * 100)}`}
            style={{ opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>

      <div className="space-y-2">
        {(expanded ? steps : steps.slice(0, 5)).map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${colors.icon} ${colors.iconBg} shrink-0`}>
              {i + 1}
            </div>
            <span className="text-[13px] text-white/55 leading-snug">{step}</span>
          </div>
        ))}
        {!expanded && steps.length > 5 && (
          <div className="text-[12px] text-white/30 pl-8">+{steps.length - 5} more steps</div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className={`self-start flex items-center gap-1.5 text-[12px] font-semibold ${colors.icon} hover:opacity-80 transition-opacity`}
      >
        {expanded ? "Collapse Track" : "View Full Track"}
        {!expanded && <ChevronRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ─── State Types for useReducer ───────────────────────────────────────────────

interface OnboardingState {
  activeTab: "active" | "tracks" | "checklist";
  search: string;
  members: OnboardingMember[];
  masterItems: MasterItem[];
  selectedMemberId: string | null;
  showNewModal: boolean;
  roleFilter: Role | "all";
  statusFilter: OnboardingStatus | "all";
}

type OnboardingAction =
  | { type: "SET_TAB"; tab: OnboardingState["activeTab"] }
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_ROLE_FILTER"; role: Role | "all" }
  | { type: "SET_STATUS_FILTER"; status: OnboardingStatus | "all" }
  | { type: "SELECT_MEMBER"; id: string | null }
  | { type: "SHOW_MODAL"; show: boolean }
  | { type: "TOGGLE_TASK"; memberId: string; taskIdx: number }
  | { type: "UPDATE_NOTES"; memberId: string; notes: string }
  | { type: "MARK_COMPLETE"; memberId: string }
  | { type: "TOGGLE_MASTER_ITEM"; id: string }
  | { type: "ADD_MEMBER"; member: OnboardingMember };

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    case "SET_SEARCH":
      return { ...state, search: action.search };
    case "SET_ROLE_FILTER":
      return { ...state, roleFilter: action.role };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.status };
    case "SELECT_MEMBER":
      return { ...state, selectedMemberId: action.id };
    case "SHOW_MODAL":
      return { ...state, showNewModal: action.show };
    case "TOGGLE_TASK":
      return {
        ...state,
        members: state.members.map((m) => {
          if (m.id !== action.memberId) return m;
          const newTasks = m.tasks.map((t, i) =>
            i === action.taskIdx ? { ...t, done: !t.done } : t
          );
          const doneCount = newTasks.filter((t) => t.done).length;
          const progress = Math.round((doneCount / newTasks.length) * 100);
          const status: OnboardingStatus =
            progress === 100 ? "complete" : progress > 0 ? "in-progress" : "pending";
          return { ...m, tasks: newTasks, progress, status };
        }),
      };
    case "UPDATE_NOTES":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.memberId ? { ...m, notes: action.notes } : m
        ),
      };
    case "MARK_COMPLETE":
      return {
        ...state,
        selectedMemberId: null,
        members: state.members.map((m) =>
          m.id === action.memberId
            ? { ...m, progress: 100, status: "complete", tasks: m.tasks.map((t) => ({ ...t, done: true })) }
            : m
        ),
      };
    case "TOGGLE_MASTER_ITEM":
      return {
        ...state,
        masterItems: state.masterItems.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item
        ),
      };
    case "ADD_MEMBER":
      return {
        ...state,
        showNewModal: false,
        members: [...state.members, action.member],
      };
    default:
      return state;
  }
}

const INITIAL_STATE: OnboardingState = {
  activeTab: "active",
  search: "",
  members: INITIAL_MEMBERS,
  masterItems: INITIAL_MASTER_ITEMS,
  selectedMemberId: null,
  showNewModal: false,
  roleFilter: "all",
  statusFilter: "all",
};

// ─── Focused Sub-Tab Components ───────────────────────────────────────────────

interface ActiveMembersTabProps {
  members: OnboardingMember[];
  search: string;
  statusFilter: OnboardingStatus | "all";
  statusCounts: Record<string, number>;
  onSearch: (s: string) => void;
  onStatusFilter: (s: OnboardingStatus | "all") => void;
  onSelectMember: (id: string) => void;
}

function ActiveMembersTab({
  members,
  search,
  statusFilter,
  statusCounts,
  onSearch,
  onStatusFilter,
  onSelectMember,
}: ActiveMembersTabProps) {
  const STATUS_LABELS: Record<string, string> = {
    all: "All",
    "in-progress": "In Progress",
    pending: "Pending",
    complete: "Complete",
    overdue: "Overdue",
  };

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      ROLE_LABEL[m.role].toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="relative w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "in-progress", "pending", "complete", "overdue"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilter(s)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                statusFilter === s
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/65"
              }`}
            >
              {STATUS_LABELS[s]}
              <span className="text-[10px] opacity-70">{statusCounts[s]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onViewDetails={() => onSelectMember(member.id)}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState message="No onboardees match your search or filter criteria." />
        )}
      </div>
    </div>
  );
}

interface MasterChecklistTabProps {
  masterItems: MasterItem[];
  roleFilter: Role | "all";
  onRoleFilter: (r: Role | "all") => void;
  onToggleItem: (id: string) => void;
}

function MasterChecklistTab({
  masterItems,
  roleFilter,
  onRoleFilter,
  onToggleItem,
}: MasterChecklistTabProps) {
  const filtered =
    roleFilter === "all"
      ? masterItems
      : masterItems.filter((item) => item.roles.includes(roleFilter));

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-[11px] text-white/35 font-medium mr-1">Filter by Role</span>
        {(["all", "driver", "dispatcher", "finance", "admin"] as const).map((r) => (
          <button
            key={r}
            onClick={() => onRoleFilter(r)}
            className={`text-[12px] font-semibold px-3 py-1 rounded-full transition-colors ${
              roleFilter === r
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/65"
            }`}
          >
            {r === "all" ? "All Roles" : ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[13px] text-amber-300/80 leading-relaxed">
          Universal checklist for all Hemut team members. Role-specific items are layered on top.
          Items marked <span className="font-bold text-amber-400">REQ</span> must clear before Day 1 system access is granted.
        </p>
      </div>

      <div className="space-y-3">
        {MASTER_CATEGORY_ORDER.map((category) => {
          const items = filtered.filter((i) => i.category === category);
          if (items.length === 0) return null;
          const doneCount = items.filter((i) => i.done).length;
          const phaseComplete = doneCount === items.length;
          return (
            <div key={category} className="bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {phaseComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/20" />
                  )}
                  <span className="text-[13px] font-semibold text-white/80">{category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-white/35">{doneCount}/{items.length}</span>
                  {phaseComplete ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase">
                      Complete
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`px-6 py-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors ${
                    idx < items.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <button onClick={() => onToggleItem(item.id)} className="shrink-0">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-white/20 hover:text-white/40 transition-colors" />
                    )}
                  </button>
                  <span className={`flex-1 text-[13px] ${item.done ? "line-through text-white/30" : "text-white/70"}`}>
                    {item.task}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.roles.slice(0, 2).map((r) => (
                      <RoleBadge key={r} role={r} />
                    ))}
                    {item.roles.length > 2 && (
                      <span className="text-[11px] text-white/30">+{item.roles.length - 2}</span>
                    )}
                  </div>
                  {item.required && <ReqBadge />}
                  <span className="text-[12px] text-white/40 shrink-0 w-16 text-right">
                    {item.assignee}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OnboardingKpiStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-6 border-b border-white/[0.05]">
      <KpiCard label="Active Onboardees" value="4" sub="2 drivers · 1 dispatcher · 1 finance" icon={Users} />
      <KpiCard label="Avg Time to Ramp" value="18 days" sub="Down 3 days from last quarter" icon={TrendingUp} />
      <KpiCard label="DOT Compliance" value="100%" sub="All pre-hires cleared" icon={Shield} valueColor="text-emerald-400" />
      <KpiCard label="Pending Actions" value="7" sub="Requires attention today" icon={AlertTriangle} valueColor="text-amber-400" />
    </div>
  );
}

interface OnboardingTabBarProps {
  activeTab: OnboardingState["activeTab"];
  onSetTab: (tab: OnboardingState["activeTab"]) => void;
}

function OnboardingTabBar({ activeTab, onSetTab }: OnboardingTabBarProps) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-1.5 flex gap-1 w-fit mb-6">
      {(["active", "tracks", "checklist"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onSetTab(tab)}
          className={`text-[13px] px-5 py-2 rounded-lg transition-all ${
            activeTab === tab
              ? "bg-white/[0.09] text-white font-semibold"
              : "text-white/40 hover:text-white/65"
          }`}
        >
          {tab === "active" ? "Active Members" : tab === "tracks" ? "Role Tracks" : "Master Checklist"}
        </button>
      ))}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function OnboardingClient() {
  const [reducerState, dispatchAction] = useReducer(onboardingReducer, INITIAL_STATE);

  function handleAddOnboardee(form: NewOnboardeeForm) {
    if (!form.role) return;
    const id = String(Date.now());
    const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const newMember: OnboardingMember = {
      id,
      name: form.name.trim(),
      initials,
      role: form.role,
      startDate: form.startDate
        ? new Date(form.startDate + "T12:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "TBD",
      weekNum: 0,
      progress: 0,
      mentor: form.mentor.trim() || "Unassigned",
      preHire: true,
      notes: "",
      status: "pending",
      tasks: [
        { label: "Offer letter counter-signed", done: false, required: true },
        { label: "I-9 and W-4 submitted", done: false, required: true },
        { label: "Background check initiated", done: false, required: true },
        { label: "System access provisioned", done: false, required: true },
      ],
    };
    dispatchAction({ type: "ADD_MEMBER", member: newMember });
  }

  const { activeTab, search, members, masterItems, selectedMemberId, showNewModal, roleFilter, statusFilter } = reducerState;
  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null;
  const statusCounts = {
    all: members.length,
    "in-progress": members.filter((m) => m.status === "in-progress").length,
    pending: members.filter((m) => m.status === "pending").length,
    complete: members.filter((m) => m.status === "complete").length,
    overdue: members.filter((m) => m.status === "overdue").length,
  };

  return (
    <div className="px-6 lg:px-10 pt-8 pb-10">
      {/* Page Header */}
      <div className="flex items-start justify-between pb-6 mb-8 border-b border-white/[0.06]">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-white">Onboarding</h1>
          <p className="text-[14px] text-white/40 mt-2.5 leading-relaxed">
            Manage new hire progress, role tracks, and compliance checklists.
          </p>
        </div>
        <button
          onClick={() => dispatchAction({ type: "SHOW_MODAL", show: true })}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Start Onboarding
        </button>
      </div>

      <OnboardingKpiStrip />

      <OnboardingTabBar
        activeTab={activeTab}
        onSetTab={(tab) => dispatchAction({ type: "SET_TAB", tab })}
      />

      {activeTab === "active" && (
        <ActiveMembersTab
          members={members}
          search={search}
          statusFilter={statusFilter}
          statusCounts={statusCounts}
          onSearch={(s) => dispatchAction({ type: "SET_SEARCH", search: s })}
          onStatusFilter={(s) => dispatchAction({ type: "SET_STATUS_FILTER", status: s })}
          onSelectMember={(id) => dispatchAction({ type: "SELECT_MEMBER", id })}
        />
      )}

      {activeTab === "tracks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ROLE_TRACKS.map((track) => (
            <RoleTrackCard
              key={track.role}
              role={track.role}
              title={track.title}
              stepCount={track.stepCount}
              avgTime={track.avgTime}
              steps={track.steps}
            />
          ))}
        </div>
      )}

      {activeTab === "checklist" && (
        <MasterChecklistTab
          masterItems={masterItems}
          roleFilter={roleFilter}
          onRoleFilter={(r) => dispatchAction({ type: "SET_ROLE_FILTER", role: r })}
          onToggleItem={(id) => dispatchAction({ type: "TOGGLE_MASTER_ITEM", id })}
        />
      )}

      {selectedMember && (
        <DetailDrawer
          member={selectedMember}
          onClose={() => dispatchAction({ type: "SELECT_MEMBER", id: null })}
          onToggleTask={(memberId, taskIdx) => dispatchAction({ type: "TOGGLE_TASK", memberId, taskIdx })}
          onUpdateNotes={(memberId, notes) => dispatchAction({ type: "UPDATE_NOTES", memberId, notes })}
          onMarkComplete={(memberId) => dispatchAction({ type: "MARK_COMPLETE", memberId })}
        />
      )}

      {showNewModal && (
        <NewOnboardingModal
          onClose={() => dispatchAction({ type: "SHOW_MODAL", show: false })}
          onSubmit={handleAddOnboardee}
        />
      )}
    </div>
  );
}
