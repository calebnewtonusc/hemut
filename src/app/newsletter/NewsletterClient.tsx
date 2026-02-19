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
  ArrowRight,
  BarChart2,
  Truck,
  DollarSign,
  Shield,
  X,
  ChevronDown,
  BookOpen,
  Pencil,
  AlertCircle,
  FileText,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
type NewsletterType = "weekly-ops" | "driver-bulletin" | "finance-brief" | "company-wide";
type Status = "draft" | "scheduled" | "sent";
type ActiveTab = "newsletters" | "blueprints" | "guide";

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
  topics: string[];
}

interface Blueprint {
  id: string;
  name: string;
  type: NewsletterType;
  audience: string;
  audienceCount: number;
  cadence: string;
  sections: string[];
  color: string;
  icon: React.ElementType;
}

interface ComposeState {
  open: boolean;
  title: string;
  type: NewsletterType | "";
  blueprint: string;
  recipients: string[];
  scheduleNow: boolean;
  scheduleDate: string;
  scheduleTime: string;
  body: string;
}

// ─── Config ──────────────────────────────────────────────────
const TYPE_CONFIG: Record<NewsletterType, { label: string; pill: string; bar: string; text: string }> = {
  "weekly-ops":      { label: "Weekly Ops",    pill: "bg-blue-400/15 text-blue-400 border border-blue-400/20",   bar: "bg-blue-400",    text: "text-blue-400" },
  "driver-bulletin": { label: "Driver Bulletin", pill: "bg-amber-400/15 text-amber-400 border border-amber-400/20", bar: "bg-amber-400",   text: "text-amber-400" },
  "finance-brief":   { label: "Finance Brief",  pill: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/20", bar: "bg-emerald-400", text: "text-emerald-400" },
  "company-wide":    { label: "Company-Wide",   pill: "bg-violet-400/15 text-violet-400 border border-violet-400/20",  bar: "bg-violet-400",  text: "text-violet-400" },
};

const STATUS_CONFIG: Record<Status, { label: string; pill: string; icon: React.ElementType }> = {
  sent:      { label: "Sent",      pill: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", icon: CheckCircle2 },
  scheduled: { label: "Scheduled", pill: "bg-amber-400/15 text-amber-400 border border-amber-400/20",       icon: Clock },
  draft:     { label: "Draft",     pill: "bg-white/5 text-white/40 border border-white/10",                  icon: Pencil },
};

// ─── Data ────────────────────────────────────────────────────
const NEWSLETTERS: Newsletter[] = [
  {
    id: "1",
    title: "Weekly Ops Digest — Week of Feb 18",
    type: "weekly-ops",
    status: "scheduled",
    audience: "All Dispatchers & Ops Managers",
    recipientCount: 34,
    scheduledFor: "Mon Feb 18, 7:30 AM",
    topics: ["Fleet KPIs", "Load highlights", "Driver spotlight", "Route changes", "Action items"],
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
    topics: ["Winter driving safety", "I-80/I-70 weather alerts", "HOS reminder", "Payroll update", "ELD firmware"],
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
    topics: ["Revenue & RPM summary", "Invoice aging", "Fuel cost variance", "IFTA Q4 filing", "Q1 forecast"],
  },
  {
    id: "4",
    title: "Company-Wide: Q1 Kickoff Recap + New Hires",
    type: "company-wide",
    status: "draft",
    audience: "Entire Hemut Team",
    recipientCount: 104,
    topics: ["Q1 goals", "Welcome new drivers", "Safety recognition", "Leadership message", "Driver appreciation week"],
  },
];

const BLUEPRINTS: Blueprint[] = [
  {
    id: "weekly-ops",
    name: "Weekly Ops Digest",
    type: "weekly-ops",
    audience: "All Dispatchers & Ops Managers",
    audienceCount: 34,
    cadence: "Every Monday 7:30 AM",
    sections: [
      "Fleet KPIs & utilization",
      "Load highlights (top RPM, longest haul)",
      "Driver spotlight",
      "Upcoming route changes",
      "Action items & priorities",
    ],
    color: "blue",
    icon: BarChart2,
  },
  {
    id: "driver-bulletin",
    name: "Driver Bulletin",
    type: "driver-bulletin",
    audience: "All Active CDL Drivers",
    audienceCount: 58,
    cadence: "Bi-weekly Friday 4:00 PM",
    sections: [
      "Safety alerts & weather",
      "HOS & regulatory reminders",
      "Payroll & direct deposit updates",
      "Equipment & ELD updates",
      "Recognition & shoutouts",
    ],
    color: "amber",
    icon: Truck,
  },
  {
    id: "finance-brief",
    name: "Finance Brief",
    type: "finance-brief",
    audience: "Finance & Leadership",
    audienceCount: 12,
    cadence: "Monthly (1st Tuesday)",
    sections: [
      "Revenue & RPM summary",
      "Invoice aging report",
      "Fuel cost vs. budget",
      "IFTA & compliance filings",
      "Cash flow & forecast",
    ],
    color: "emerald",
    icon: DollarSign,
  },
  {
    id: "company-wide",
    name: "Company-Wide Update",
    type: "company-wide",
    audience: "Entire Hemut Team",
    audienceCount: 104,
    cadence: "Quarterly",
    sections: [
      "Company goals & OKRs",
      "New hires & promotions",
      "Safety recognition",
      "Leadership message",
      "Upcoming events",
    ],
    color: "purple",
    icon: Users,
  },
];

const BLUEPRINT_COLORS: Record<string, { accent: string; muted: string; dot: string; btn: string; text: string; border: string }> = {
  blue:    { accent: "text-blue-400",    muted: "text-blue-400/60",    dot: "bg-blue-400",    btn: "bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 border border-blue-400/20",    text: "text-blue-400",    border: "border-blue-400/20" },
  amber:   { accent: "text-amber-400",   muted: "text-amber-400/60",   dot: "bg-amber-400",   btn: "bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/20",   text: "text-amber-400",   border: "border-amber-400/20" },
  emerald: { accent: "text-emerald-400", muted: "text-emerald-400/60", dot: "bg-emerald-400", btn: "bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 border border-emerald-400/20", text: "text-emerald-400", border: "border-emerald-400/20" },
  purple:  { accent: "text-violet-400",  muted: "text-violet-400/60",  dot: "bg-violet-400",  btn: "bg-violet-400/10 hover:bg-violet-400/20 text-violet-400 border border-violet-400/20",  text: "text-violet-400",  border: "border-violet-400/20" },
};

const RECIPIENT_OPTIONS = [
  "All Dispatchers & Ops Managers (34)",
  "All Active CDL Drivers (58)",
  "Finance & Leadership (12)",
  "Entire Hemut Team (104)",
];

// ─── KPI Card ────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, iconClass }: { label: string; value: string; icon: React.ElementType; iconClass: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center mb-4 ${iconClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

// ─── Newsletter Row ───────────────────────────────────────────
function NewsletterRow({ nl, onEdit }: { nl: Newsletter; onEdit: () => void }) {
  const type = TYPE_CONFIG[nl.type];
  const status = STATUS_CONFIG[nl.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
            <h3 className="font-semibold text-white text-sm">{nl.title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${type.pill}`}>
              {type.label}
            </span>
            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${status.pill}`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-white/40 mb-3">
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3 shrink-0" />
              {nl.audience} ({nl.recipientCount})
            </span>
            {nl.scheduledFor && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 shrink-0" />
                Sends: {nl.scheduledFor}
              </span>
            )}
            {nl.sentAt && (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                Sent: {nl.sentAt}
              </span>
            )}
          </div>

          {/* Open rate bar */}
          {nl.openRate !== undefined && (
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex-1 max-w-[180px] h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${type.bar}`}
                  style={{ width: `${nl.openRate}%` }}
                />
              </div>
              <span className={`text-xs font-semibold ${type.text}`}>
                {nl.openRate}% open rate
              </span>
            </div>
          )}

          {/* Topics */}
          <div className="flex flex-wrap gap-1.5">
            {nl.topics.map((t) => (
              <span key={t} className="text-[10px] bg-white/[0.05] text-white/35 px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors" title="Preview">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors" title="Duplicate">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit} className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors" title="Edit">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Blueprint Card ───────────────────────────────────────────
function BlueprintCard({ bp, onUse }: { bp: Blueprint; onUse: (bp: Blueprint) => void }) {
  const c = BLUEPRINT_COLORS[bp.color];
  const Icon = bp.icon;
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.10] transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-1.5">
          <div className={`w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center ${c.accent}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className={`font-bold text-sm ${c.accent}`}>{bp.name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-1">Audience</div>
            <div className="text-xs text-white/60 leading-tight">{bp.audience}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-1">Cadence</div>
            <div className={`text-xs font-semibold ${c.accent}`}>{bp.cadence}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-2.5">Sections</div>
        <ul className="space-y-2 mb-5">
          {bp.sections.map((s) => (
            <li key={s} className="flex items-start gap-2 text-xs text-white/50">
              <div className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0 mt-1`} />
              {s}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onUse(bp)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors ${c.btn}`}
        >
          Use Blueprint
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Composer Guide Tab ───────────────────────────────────────
function ComposerGuide() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Know Your Audience */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
          <Users className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-white text-sm">Know Your Audience</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 text-[10px] uppercase tracking-widest">
                <th className="text-left pb-3 pr-4 font-semibold">Segment</th>
                <th className="text-left pb-3 pr-4 font-semibold">Tone</th>
                <th className="text-left pb-3 pr-4 font-semibold">Key Topics</th>
                <th className="text-left pb-3 font-semibold">Timing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                { seg: "Drivers", tone: "Simple, direct, mobile-first", topics: "Safety, HOS, pay, route alerts", time: "Bi-weekly Fri 4 PM" },
                { seg: "Dispatchers & Ops", tone: "Data-driven, action-oriented", topics: "KPIs, loads, route changes, priorities", time: "Every Mon 7:30 AM" },
                { seg: "Finance & Leadership", tone: "Analytical, concise", topics: "Revenue, invoicing, cost, forecast", time: "Monthly 1st Tue" },
                { seg: "All Team", tone: "Warm, celebratory", topics: "Milestones, new hires, recognition, OKRs", time: "Quarterly" },
              ].map((r) => (
                <tr key={r.seg}>
                  <td className="py-2.5 pr-4 font-semibold text-white/70">{r.seg}</td>
                  <td className="py-2.5 pr-4 text-white/45">{r.tone}</td>
                  <td className="py-2.5 pr-4 text-white/45">{r.topics}</td>
                  <td className="py-2.5 text-white/45">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Subject Line Formula */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-sm">Subject Line Formula</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { type: "Weekly Ops",    color: "blue-400",    ex: "[Weekly Ops] Feb 18 — Fleet KPIs, Load Highlights + Action Items" },
            { type: "Driver Bulletin", color: "amber-400", ex: "[Driver Bulletin] Winter Weather Safety + Payroll Update — Fri Feb 14" },
            { type: "Finance Brief",  color: "emerald-400", ex: "[Finance] January Close — Revenue $2.91/mi · 7 invoices aging · Q1 forecast" },
            { type: "Company-Wide",   color: "violet-400", ex: "[Hemut Update] Q1 Kickoff Recap · 3 New Hires · Zero Incidents in January" },
          ].map((item) => (
            <div key={item.type} className="flex items-start gap-3">
              <span className={`text-[10px] font-bold text-${item.color} shrink-0 mt-0.5 w-28`}>{item.type}</span>
              <code className="text-xs text-white/50 font-mono leading-relaxed">{item.ex}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Message Structure */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-violet-400" />
          <h3 className="font-bold text-white text-sm">Message Structure</h3>
        </div>
        <div className="p-5">
          <div className="flex items-stretch gap-0">
            {[
              { step: "1", label: "Opening Hook", desc: "One sentence — most urgent or impressive stat. Sets the tone immediately.", color: "bg-blue-400" },
              { step: "2", label: "Key Info", desc: "Data-backed sections. Use bullet points, not paragraphs. Visuals over text.", color: "bg-amber-400" },
              { step: "3", label: "Action Items", desc: "Numbered list of specific things the reader must do. Clear owner + deadline.", color: "bg-emerald-400" },
              { step: "4", label: "Closing", desc: "One warm sentence + open door. \"Questions? Reply directly.\"", color: "bg-violet-400" },
            ].map((s, i, arr) => (
              <div key={s.step} className={`flex-1 ${i < arr.length - 1 ? "border-r border-white/[0.06]" : ""} p-4`}>
                <div className={`w-6 h-6 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold mb-2.5`}>{s.step}</div>
                <div className="text-xs font-semibold text-white/70 mb-1.5">{s.label}</div>
                <div className="text-[11px] text-white/35 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Rate Tips */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">Open Rate Tips</h3>
        </div>
        <ul className="p-5 space-y-3">
          {[
            "Send at the right time — use the pre-configured cadence for each audience type",
            "Mention a specific number or name in the subject line (e.g., \"$2.91/mi\" or \"T. Patel recognized\")",
            "Keep subject lines under 60 characters — most drivers read on mobile",
            "Driver Bulletin: Friday afternoon wins. Ops: Monday before 8 AM wins",
            "Consistency matters more than perfection — same day, same time builds habitual opens",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-white/50">
              <div className="w-5 h-5 rounded-full bg-emerald-400/15 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* DOT Compliance Notes */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-white text-sm">DOT Compliance Notes</h3>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-white/40 leading-relaxed">Any safety-related communications sent to drivers must be documented. The following items are required when publishing a Driver Bulletin that includes regulatory content:</p>
          <ul className="space-y-2.5">
            {[
              "HOS reminders must cite the specific 49 CFR Part 395 rule referenced",
              "Weather & road condition alerts must include the source (NOAA, state DOT, or verified carrier reports)",
              "ELD update notices must specify firmware version number and deadline for compliance",
              "All safety policy changes sent to drivers must be countersigned in driver files within 14 days",
              "Retain proof of delivery (email open/read receipts or driver acknowledgment) for FMCSA audit readiness",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-white/50">
                <AlertCircle className="w-3.5 h-3.5 text-red-400/70 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

// ─── Compose Modal ────────────────────────────────────────────
function ComposeModal({
  state,
  onChange,
  onClose,
}: {
  state: ComposeState;
  onChange: (patch: Partial<ComposeState>) => void;
  onClose: () => void;
}) {
  const selectedBlueprintData = BLUEPRINTS.find((b) => b.id === state.blueprint);

  const handleBlueprintSelect = (bpId: string) => {
    const bp = BLUEPRINTS.find((b) => b.id === bpId);
    if (bp) {
      const recipientLabel = RECIPIENT_OPTIONS.find((r) => r.includes(bp.audience.split(" ")[1] ?? "")) ?? `${bp.audience} (${bp.audienceCount})`;
      onChange({
        blueprint: bpId,
        type: bp.type,
        recipients: [recipientLabel],
        body: bp.sections.map((s) => `## ${s}\n\n`).join("\n"),
      });
    } else {
      onChange({ blueprint: bpId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0d1424] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-white">Create Newsletter</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Blueprint selector */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/35 font-semibold mb-2">Blueprint (optional — pre-fills fields)</label>
            <div className="grid grid-cols-2 gap-2">
              {BLUEPRINTS.map((bp) => {
                const c = BLUEPRINT_COLORS[bp.color];
                const Icon = bp.icon;
                const selected = state.blueprint === bp.id;
                return (
                  <button
                    key={bp.id}
                    onClick={() => handleBlueprintSelect(selected ? "" : bp.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                      selected
                        ? `${c.btn} border-current`
                        : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.05]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${selected ? c.accent : "text-white/30"}`} />
                    <span className="text-xs font-medium">{bp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/35 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Weekly Ops Digest — Week of Feb 25"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/35 font-semibold mb-2">Type</label>
            <div className="relative">
              <select
                value={state.type}
                onChange={(e) => onChange({ type: e.target.value as NewsletterType | "" })}
                className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors"
              >
                <option value="" className="bg-[#0d1424]">Select type...</option>
                <option value="weekly-ops" className="bg-[#0d1424]">Weekly Ops Digest</option>
                <option value="driver-bulletin" className="bg-[#0d1424]">Driver Bulletin</option>
                <option value="finance-brief" className="bg-[#0d1424]">Finance Brief</option>
                <option value="company-wide" className="bg-[#0d1424]">Company-Wide Update</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/35 font-semibold mb-2">Recipients</label>
            <div className="space-y-1.5">
              {RECIPIENT_OPTIONS.map((opt) => {
                const checked = state.recipients.includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                        checked ? "bg-amber-400 border-amber-400" : "bg-white/[0.04] border-white/[0.10] group-hover:border-white/25"
                      }`}
                      onClick={() => {
                        const next = checked
                          ? state.recipients.filter((r) => r !== opt)
                          : [...state.recipients, opt];
                        onChange({ recipients: next });
                      }}
                    >
                      {checked && <CheckCircle2 className="w-2.5 h-2.5 text-black" />}
                    </div>
                    <span className="text-xs text-white/55">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/35 font-semibold mb-2">Send Time</label>
            <div className="flex gap-2 mb-3">
              {(["now", "schedule"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => onChange({ scheduleNow: opt === "now" })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    (opt === "now") === state.scheduleNow
                      ? "bg-amber-400/15 border-amber-400/30 text-amber-400"
                      : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:bg-white/[0.05]"
                  }`}
                >
                  {opt === "now" ? "Send Now" : "Schedule"}
                </button>
              ))}
            </div>
            {!state.scheduleNow && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={state.scheduleDate}
                  onChange={(e) => onChange({ scheduleDate: e.target.value })}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                />
                <input
                  type="time"
                  value={state.scheduleTime}
                  onChange={(e) => onChange({ scheduleTime: e.target.value })}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-white/35 font-semibold">Message</label>
              {selectedBlueprintData && (
                <span className="text-[10px] text-amber-400/70 font-medium">Blueprint sections pre-filled</span>
              )}
            </div>
            <textarea
              value={state.body}
              onChange={(e) => onChange({ body: e.target.value })}
              placeholder="Write your newsletter content here. Use ## for section headers, **bold** for emphasis, and - for bullet points."
              rows={8}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/50 transition-colors resize-none font-mono"
            />
            <div className="flex gap-3 mt-1.5 text-[10px] text-white/25">
              <span>## Section header</span>
              <span>**bold**</span>
              <span>- bullet</span>
              <span>[link](url)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-sm text-white/40 hover:text-white/60 transition-colors px-3 py-2"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] text-white/60 text-sm font-medium transition-colors border border-white/[0.08]">
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-colors shadow-lg shadow-amber-500/20">
              <Send className="w-3.5 h-3.5" />
              {state.scheduleNow ? "Send Now" : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function NewsletterClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("newsletters");
  const [compose, setCompose] = useState<ComposeState>({
    open: false,
    title: "",
    type: "",
    blueprint: "",
    recipients: [],
    scheduleNow: true,
    scheduleDate: "",
    scheduleTime: "",
    body: "",
  });

  const openCompose = (patch?: Partial<ComposeState>) => {
    setCompose((prev) => ({ ...prev, open: true, ...patch }));
  };

  const closeCompose = () => {
    setCompose({
      open: false,
      title: "",
      type: "",
      blueprint: "",
      recipients: [],
      scheduleNow: true,
      scheduleDate: "",
      scheduleTime: "",
      body: "",
    });
  };

  const handleBlueprintUse = (bp: Blueprint) => {
    openCompose({
      blueprint: bp.id,
      type: bp.type,
      recipients: [`${bp.audience} (${bp.audienceCount})`],
      body: bp.sections.map((s) => `## ${s}\n\n`).join("\n"),
    });
  };

  const TABS: { key: ActiveTab; label: string }[] = [
    { key: "newsletters", label: "All Newsletters" },
    { key: "blueprints",  label: "Blueprints" },
    { key: "guide",       label: "Composer Guide" },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white">Newsletter System</h1>
          <p className="text-sm text-white/35 mt-1">
            Structured communications for every team segment — drivers, ops, finance, and leadership
          </p>
        </div>
        <button
          onClick={() => openCompose()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Newsletter
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <KpiCard label="Sent This Month"   value="6"    icon={Send}       iconClass="text-blue-400" />
        <KpiCard label="Total Recipients"  value="104"  icon={Users}      iconClass="text-amber-400" />
        <KpiCard label="Avg Open Rate"     value="86%"  icon={TrendingUp} iconClass="text-emerald-400" />
        <KpiCard label="Scheduled"         value="2"    icon={Calendar}   iconClass="text-violet-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: All Newsletters */}
      {activeTab === "newsletters" && (
        <div className="space-y-3">
          {NEWSLETTERS.map((nl) => (
            <NewsletterRow
              key={nl.id}
              nl={nl}
              onEdit={() => openCompose({ title: nl.title, type: nl.type })}
            />
          ))}
        </div>
      )}

      {/* Tab: Blueprints */}
      {activeTab === "blueprints" && (
        <div className="grid grid-cols-2 gap-5">
          {BLUEPRINTS.map((bp) => (
            <BlueprintCard key={bp.id} bp={bp} onUse={handleBlueprintUse} />
          ))}
        </div>
      )}

      {/* Tab: Composer Guide */}
      {activeTab === "guide" && <ComposerGuide />}

      {/* Compose Modal */}
      {compose.open && (
        <ComposeModal
          state={compose}
          onChange={(patch) => setCompose((prev) => ({ ...prev, ...patch }))}
          onClose={closeCompose}
        />
      )}
    </div>
  );
}
