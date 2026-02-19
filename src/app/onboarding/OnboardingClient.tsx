"use client";
import { useState } from "react";
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
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "driver" | "dispatcher" | "finance" | "admin";
type MasterCategory = "Pre-Hire" | "Week 1" | "Week 2" | "Week 3-4" | "Certification";

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

const ROLE_COLOR: Record<Role, { badge: string; bar: string; dot: string; border: string; icon: string }> = {
  driver: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    bar: "bg-blue-400",
    dot: "bg-blue-400",
    border: "border-blue-500/30",
    icon: "text-blue-400",
  },
  dispatcher: {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
    border: "border-violet-500/30",
    icon: "text-violet-400",
  },
  finance: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
  },
  admin: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    border: "border-amber-500/30",
    icon: "text-amber-400",
  },
};

const MASTER_CATEGORY_ORDER: MasterCategory[] = [
  "Pre-Hire",
  "Week 1",
  "Week 2",
  "Week 3-4",
  "Certification",
];

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
  // Pre-Hire
  { id: "m1", task: "Offer letter counter-signed", category: "Pre-Hire", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: true },
  { id: "m2", task: "Background check initiated", category: "Pre-Hire", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: true },
  { id: "m3", task: "DOT pre-employment drug test", category: "Pre-Hire", roles: ["driver"], required: true, assignee: "Ops", done: true },
  { id: "m4", task: "CDL verification & MVR pull", category: "Pre-Hire", roles: ["driver"], required: true, assignee: "Safety", done: true },
  { id: "m5", task: "FMCSA Clearinghouse query", category: "Pre-Hire", roles: ["driver"], required: true, assignee: "Safety", done: false },
  // Week 1
  { id: "m6", task: "I-9, W-4, direct deposit forms", category: "Week 1", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "HR", done: true },
  { id: "m7", task: "System access provisioned", category: "Week 1", roles: ["dispatcher", "finance", "admin"], required: true, assignee: "IT", done: true },
  { id: "m8", task: "ELD device paired to Hemut app", category: "Week 1", roles: ["driver"], required: true, assignee: "Ops", done: false },
  { id: "m9", task: "Safety handbook acknowledgment", category: "Week 1", roles: ["driver", "dispatcher"], required: true, assignee: "Safety", done: true },
  { id: "m10", task: "Mentor assignment confirmed", category: "Week 1", roles: ["driver", "dispatcher", "finance", "admin"], required: false, assignee: "Manager", done: true },
  { id: "m11", task: "Team introduction / meet & greet", category: "Week 1", roles: ["driver", "dispatcher", "finance", "admin"], required: false, assignee: "Manager", done: false },
  // Week 2
  { id: "m12", task: "Role-specific training module completed", category: "Week 2", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "Trainer", done: false },
  { id: "m13", task: "Shadowing milestone (5 sessions)", category: "Week 2", roles: ["driver", "dispatcher"], required: false, assignee: "Mentor", done: true },
  { id: "m14", task: "First independent task completed", category: "Week 2", roles: ["driver", "dispatcher", "finance", "admin"], required: false, assignee: "Mentor", done: false },
  // Week 3-4
  { id: "m15", task: "30-day check-in with ops manager", category: "Week 3-4", roles: ["driver", "dispatcher", "finance", "admin"], required: true, assignee: "Manager", done: false },
  { id: "m16", task: "KPI baseline set", category: "Week 3-4", roles: ["driver", "dispatcher"], required: false, assignee: "Manager", done: false },
  { id: "m17", task: "Independent task quota met", category: "Week 3-4", roles: ["driver", "dispatcher", "finance"], required: false, assignee: "Mentor", done: false },
  // Certification
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
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${ROLE_COLOR[role].badge}`}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}

function ReqBadge() {
  return (
    <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1 rounded">
      REQ.
    </span>
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div
        className="fixed right-0 top-0 h-full w-[420px] z-50 flex flex-col"
        style={{ background: "#0d1424", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              {member.initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{member.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <RoleBadge role={member.role} />
                {member.preHire && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20 font-semibold">
                    Pre-Hire
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress summary */}
        <div className="px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">
              {completedCount} of {member.tasks.length} tasks complete
            </span>
            <span className="text-xs font-bold text-white">{member.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${colors.bar}`}
              style={{ width: `${member.progress}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Started {member.startDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              {member.mentor}
            </span>
          </div>
        </div>

        {/* Full task list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 scrollbar-thin">
          <div className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">
            Full Checklist
          </div>
          {member.tasks.map((task, idx) => (
            <button
              key={task.label}
              onClick={() => onToggleTask(member.id, idx)}
              className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left group"
            >
              {task.done ? (
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${colors.icon}`} />
              ) : (
                <Circle className="w-4 h-4 shrink-0 mt-0.5 text-white/20 group-hover:text-white/40 transition-colors" />
              )}
              <span
                className={`flex-1 text-sm leading-snug ${
                  task.done ? "line-through text-white/25" : "text-white/70"
                }`}
              >
                {task.label}
              </span>
              {task.required && !task.done && <ReqBadge />}
            </button>
          ))}
        </div>

        {/* Notes */}
        <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
              Notes
            </span>
          </div>
          <textarea
            value={member.notes}
            onChange={(e) => onUpdateNotes(member.id, e.target.value)}
            placeholder="Add notes about this onboardee..."
            rows={3}
            className="w-full text-sm text-white/60 placeholder:text-white/20 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Mark Complete button */}
        <div className="px-5 pb-5 shrink-0">
          <button
            onClick={() => onMarkComplete(member.id)}
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold transition-colors"
          >
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
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6"
          style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Start Onboarding</h2>
              <p className="text-xs text-white/40 mt-0.5">Add a new team member to the framework</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/25 bg-white/[0.05] border border-white/[0.08] focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role | "" })}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white bg-white/[0.05] border border-white/[0.08] focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                style={{ colorScheme: "dark" }}
              >
                <option value="" disabled style={{ background: "#0d1424" }}>Select role…</option>
                <option value="driver" style={{ background: "#0d1424" }}>CDL Driver</option>
                <option value="dispatcher" style={{ background: "#0d1424" }}>Dispatcher</option>
                <option value="finance" style={{ background: "#0d1424" }}>Finance</option>
                <option value="admin" style={{ background: "#0d1424" }}>Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white bg-white/[0.05] border border-white/[0.08] focus:outline-none focus:border-amber-500/50 transition-colors"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Mentor
              </label>
              <input
                type="text"
                placeholder="e.g. Marcus Johnson (Sr. Driver)"
                value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/25 bg-white/[0.05] border border-white/[0.08] focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white/50 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => isValid && onSubmit(form)}
              disabled={!isValid}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className={`text-2xl font-bold ${accent ? "text-amber-400" : "text-white"}`}>{value}</div>
      <div className="text-xs font-semibold text-white/60">{label}</div>
      <div className="text-xs text-white/30">{sub}</div>
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
  const visibleTasks = member.tasks.slice(0, 4);
  const hiddenCount = member.tasks.length - 4;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 hover:bg-white/[0.04] transition-colors"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white/80"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {member.initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{member.name}</div>
            <div className="text-[11px] text-white/35 mt-0.5">
              Started {member.startDate}
              {member.weekNum > 0 && ` · Week ${member.weekNum}`}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <RoleBadge role={member.role} />
          {member.preHire && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20 font-semibold">
              Pre-Hire
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-white/35">Progress</span>
          <span className="text-[11px] font-bold text-white/70">{member.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{ width: `${member.progress}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        {visibleTasks.map((task) => (
          <div key={task.label} className="flex items-center gap-2 text-xs">
            {task.done ? (
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${colors.icon}`} />
            ) : (
              <Circle className="w-3.5 h-3.5 shrink-0 text-white/20" />
            )}
            <span
              className={
                task.done
                  ? "line-through text-white/25 flex-1 leading-snug"
                  : "text-white/55 flex-1 leading-snug"
              }
            >
              {task.label}
            </span>
            {task.required && !task.done && <ReqBadge />}
          </div>
        ))}
        {hiddenCount > 0 && (
          <div className="text-[11px] text-white/25 pl-5">+{hiddenCount} more tasks</div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-[11px] text-white/30">
          Mentor:{" "}
          <span className="text-white/50 font-medium">{member.mentor}</span>
        </span>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          View Details <ChevronRight className="w-3 h-3" />
        </button>
      </div>
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
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Icon className={`w-4.5 h-4.5 ${colors.icon}`} style={{ width: "18px", height: "18px" }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{title}</div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[11px] text-white/35">{stepCount} steps</span>
              <span className="text-[11px] text-white/35">·</span>
              <span className="text-[11px] text-white/35">Avg {avgTime}</span>
            </div>
          </div>
        </div>
        <RoleBadge role={role} />
      </div>

      {/* Steps list */}
      <div className="space-y-1.5">
        {(expanded ? steps : steps.slice(0, 5)).map((step, i) => (
          <div key={step} className="flex items-center gap-2.5 text-xs">
            <div
              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white/60 shrink-0`}
              style={{ width: "18px", height: "18px", background: "rgba(255,255,255,0.06)" }}
            >
              {i + 1}
            </div>
            <span className="text-white/55 leading-snug">{step}</span>
          </div>
        ))}
        {!expanded && steps.length > 5 && (
          <div className="text-[11px] text-white/25 pl-6">+{steps.length - 5} more steps</div>
        )}
      </div>

      {/* View Track button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors self-start mt-auto"
      >
        {expanded ? "Collapse Track" : "View Track →"}
      </button>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function OnboardingClient() {
  const [activeTab, setActiveTab] = useState<"active" | "tracks" | "checklist">("active");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<OnboardingMember[]>(INITIAL_MEMBERS);
  const [masterItems, setMasterItems] = useState<MasterItem[]>(INITIAL_MASTER_ITEMS);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null;

  // Filtered active members
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      ROLE_LABEL[m.role].toLowerCase().includes(search.toLowerCase())
  );

  // Filtered master checklist
  const filteredMasterItems =
    roleFilter === "all"
      ? masterItems
      : masterItems.filter((item) => item.roles.includes(roleFilter));

  // Toggle a task in the drawer
  function handleToggleTask(memberId: string, taskIdx: number) {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const newTasks = m.tasks.map((t, i) =>
          i === taskIdx ? { ...t, done: !t.done } : t
        );
        const doneCount = newTasks.filter((t) => t.done).length;
        const progress = Math.round((doneCount / newTasks.length) * 100);
        return { ...m, tasks: newTasks, progress };
      })
    );
  }

  // Update notes
  function handleUpdateNotes(memberId: string, notes: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, notes } : m))
    );
  }

  // Mark complete
  function handleMarkComplete(memberId: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, progress: 100, tasks: m.tasks.map((t) => ({ ...t, done: true })) }
          : m
      )
    );
    setSelectedMemberId(null);
  }

  // Toggle master item
  function handleToggleMasterItem(id: string) {
    setMasterItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  // Add new onboardee
  function handleAddOnboardee(form: NewOnboardeeForm) {
    if (!form.role) return;
    const id = String(Date.now());
    const initials = form.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
      tasks: [
        { label: "Offer letter counter-signed", done: false, required: true },
        { label: "I-9 and W-4 submitted", done: false, required: true },
        { label: "Background check initiated", done: false, required: true },
        { label: "System access provisioned", done: false, required: true },
      ],
    };
    setMembers((prev) => [...prev, newMember]);
    setShowNewModal(false);
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#080d1a" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Onboarding Framework</h1>
          <p className="text-sm text-white/35 mt-0.5">
            DOT-compliant structured onboarding for every Hemut role
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Start Onboarding
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Active Onboardees"
          value="4"
          sub="2 drivers · 1 dispatcher · 1 finance"
        />
        <KpiCard
          label="Avg Time to Ramp"
          value="18 days"
          sub="↓ 3 days from last quarter"
        />
        <KpiCard
          label="DOT Compliance Rate"
          value="100%"
          sub="All pre-hires cleared"
        />
        <KpiCard
          label="Pending Actions"
          value="7"
          sub="Requires attention today"
          accent
        />
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div
        className="flex gap-1 rounded-lg p-1 w-fit mb-6"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {(["active", "tracks", "checklist"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab === "active"
              ? "Active Members"
              : tab === "tracks"
              ? "Role Tracks"
              : "Master Checklist"}
          </button>
        ))}
      </div>

      {/* ── Active Members Tab ─────────────────────────────────────────────── */}
      {activeTab === "active" && (
        <div>
          {/* Search */}
          <div className="relative max-w-xs mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              placeholder="Search by name or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 rounded-lg focus:outline-none focus:border-white/20 transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-5">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onViewDetails={() => setSelectedMemberId(member.id)}
              />
            ))}
            {filteredMembers.length === 0 && (
              <div className="col-span-2 text-center py-12 text-white/30 text-sm">
                No onboardees match your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Role Tracks Tab ────────────────────────────────────────────────── */}
      {activeTab === "tracks" && (
        <div className="grid grid-cols-2 gap-5">
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

      {/* ── Master Checklist Tab ───────────────────────────────────────────── */}
      {activeTab === "checklist" && (
        <div>
          {/* Info banner */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl mb-5"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" style={{ width: "18px", height: "18px" }} />
            <div>
              <div className="text-sm font-semibold text-amber-300">Universal Onboarding Checklist</div>
              <p className="text-xs text-amber-400/60 mt-0.5 leading-relaxed">
                Applies to all Hemut team members. Role-specific items layered on top. Items marked{" "}
                <span className="font-bold">REQ.</span> must clear before Day 1 system access is granted.
              </p>
            </div>
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-white/30 font-semibold uppercase tracking-wider mr-1">
              Filter:
            </span>
            {(["all", "driver", "dispatcher", "finance", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  roleFilter === r
                    ? "bg-amber-500 text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
                style={
                  roleFilter !== r
                    ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }
                    : {}
                }
              >
                {r === "all" ? "All Roles" : ROLE_LABEL[r]}
              </button>
            ))}
          </div>

          {/* Grouped checklist */}
          <div className="space-y-6">
            {MASTER_CATEGORY_ORDER.map((category) => {
              const items = filteredMasterItems.filter((i) => i.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <div className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">
                    {category}
                  </div>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors ${
                          idx > 0 ? "border-t border-white/[0.04]" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleMasterItem(item.id)}
                          className="shrink-0"
                        >
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-white/20 hover:text-white/40 transition-colors" />
                          )}
                        </button>

                        {/* Task name */}
                        <span
                          className={`flex-1 text-sm ${
                            item.done ? "line-through text-white/25" : "text-white/65"
                          }`}
                        >
                          {item.task}
                        </span>

                        {/* Role badges */}
                        <div className="flex items-center gap-1 shrink-0">
                          {item.roles.slice(0, 2).map((r) => (
                            <RoleBadge key={r} role={r} />
                          ))}
                          {item.roles.length > 2 && (
                            <span className="text-[10px] text-white/30">
                              +{item.roles.length - 2}
                            </span>
                          )}
                        </div>

                        {/* REQ badge */}
                        {item.required && <ReqBadge />}

                        {/* Assignee */}
                        <span className="text-[11px] text-white/30 shrink-0 w-16 text-right">
                          {item.assignee}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Detail Drawer ──────────────────────────────────────────────────── */}
      {selectedMember && (
        <DetailDrawer
          member={selectedMember}
          onClose={() => setSelectedMemberId(null)}
          onToggleTask={handleToggleTask}
          onUpdateNotes={handleUpdateNotes}
          onMarkComplete={handleMarkComplete}
        />
      )}

      {/* ── New Onboarding Modal ───────────────────────────────────────────── */}
      {showNewModal && (
        <NewOnboardingModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleAddOnboardee}
        />
      )}
    </div>
  );
}
