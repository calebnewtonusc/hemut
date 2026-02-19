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
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
type NewsletterType = "weekly-ops" | "driver-bulletin" | "finance-brief" | "company-wide";
type Status = "draft" | "scheduled" | "sent";
type ActiveTab = "newsletters" | "blueprints";

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
  "weekly-ops":      { label: "Weekly Ops",     pill: "bg-white/[0.07] text-white/50 border border-white/[0.1]",     bar: "bg-amber-500", text: "text-white/50" },
  "driver-bulletin": { label: "Driver Bulletin", pill: "bg-white/[0.07] text-white/50 border border-white/[0.1]",     bar: "bg-amber-500", text: "text-white/50" },
  "finance-brief":   { label: "Finance Brief",   pill: "bg-white/[0.07] text-white/50 border border-white/[0.1]",     bar: "bg-amber-500", text: "text-white/50" },
  "company-wide":    { label: "Company-Wide",    pill: "bg-white/[0.07] text-white/50 border border-white/[0.1]",     bar: "bg-amber-500", text: "text-white/50" },
};

const STATUS_CONFIG: Record<Status, { label: string; pill: string; icon: React.ElementType }> = {
  sent:      { label: "SENT",      pill: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", icon: CheckCircle2 },
  scheduled: { label: "SCHEDULED", pill: "bg-sky-500/15 text-sky-400 border border-sky-500/20",             icon: Clock },
  draft:     { label: "DRAFT",     pill: "bg-white/[0.07] text-white/40 border border-white/[0.1]",          icon: Pencil },
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
    color: "amber",
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
    color: "sky",
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
    color: "violet",
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
    color: "emerald",
    icon: Users,
  },
];

const BLUEPRINT_COLORS: Record<string, { accent: string; iconBg: string; iconBorder: string; dot: string; btn: string; border: string; hoverBorder: string }> = {
  amber:   { accent: "text-amber-400",  iconBg: "bg-amber-500/10",  iconBorder: "border-amber-500/15",  dot: "bg-amber-400",  btn: "text-amber-400 hover:text-amber-300",  border: "border-white/[0.08]",  hoverBorder: "hover:border-amber-500/20" },
  sky:     { accent: "text-amber-400",  iconBg: "bg-amber-500/10",  iconBorder: "border-amber-500/15",  dot: "bg-amber-400",  btn: "text-amber-400 hover:text-amber-300",  border: "border-white/[0.08]",  hoverBorder: "hover:border-amber-500/20" },
  violet:  { accent: "text-amber-400",  iconBg: "bg-amber-500/10",  iconBorder: "border-amber-500/15",  dot: "bg-amber-400",  btn: "text-amber-400 hover:text-amber-300",  border: "border-white/[0.08]",  hoverBorder: "hover:border-amber-500/20" },
  emerald: { accent: "text-amber-400",  iconBg: "bg-amber-500/10",  iconBorder: "border-amber-500/15",  dot: "bg-amber-400",  btn: "text-amber-400 hover:text-amber-300",  border: "border-white/[0.08]",  hoverBorder: "hover:border-amber-500/20" },
};

// Modal blueprint chip colors (for selected state)
const MODAL_BLUEPRINT_SELECTED: Record<string, string> = {
  amber:   "bg-amber-500/10 border-amber-500/30 text-amber-300",
  sky:     "bg-amber-500/10 border-amber-500/30 text-amber-300",
  violet:  "bg-amber-500/10 border-amber-500/30 text-amber-300",
  emerald: "bg-amber-500/10 border-amber-500/30 text-amber-300",
};

const RECIPIENT_OPTIONS = [
  "All Dispatchers & Ops Managers (34)",
  "All Active CDL Drivers (58)",
  "Finance & Leadership (12)",
  "Entire Hemut Team (104)",
];

// ─── AI Draft Content ─────────────────────────────────────────
const AI_DRAFTS: Record<string, string> = {
  "weekly-ops": `## Fleet KPIs & Utilization

Fleet at **84% utilization** for week of Feb 11–17. 247 loads managed, 41,200 revenue miles. Average RPM: **$2.91/mi** (↑ $0.04 from prior week). On-time delivery: 96.3%.

## Load Highlights

Top-performing load: L-8821 Dallas run at $3.40/mi. Longest haul: L-8819 Phoenix, 680 miles. Driver spotlight: K. Johnson (D-028) — 5th consecutive on-time delivery this week.

## Upcoming Route Changes

I-80 winter weather advisory active through Feb 20. Recommend routing Nebraska-bound loads via I-70 alternate corridor. Update ETA estimates by +45 min for affected loads.

## Action Items

1. Assign L-8816 (Seattle → Portland) by 3:00 PM today — M. Garcia recommended (Dispatch)
2. Complete T. Patel HOS corrective action form by Feb 19 (Safety)
3. Schedule T-031 preventive maintenance Feb 19 AM (Fleet)`,

  "driver-bulletin": `## Safety Alerts & Weather

Winter weather advisory active on I-80 (Wyoming) and I-70 (Colorado) through Feb 20. Reduce speed, increase following distance, and report road conditions to dispatch every 100 miles in affected areas. Chain laws may apply.

## HOS & Regulatory Reminder

The 11-hour daily driving limit is strictly enforced. If you are within 30 minutes of your limit, call dispatch immediately — never push through your clock. Your ELD logs are reviewed daily and any anomalies are flagged automatically.

## Payroll Update

Pay cycle closes Feb 20. All miles, stops, and detention time through Feb 19 at 11:59 PM will be included. Direct deposit processes Feb 21. Contact HR for any discrepancies.

## ELD Update

New ELD firmware v3.2.1 available. Update must be completed by Feb 28. See your dispatcher for update instructions. This update improves HOS clock accuracy and adds Wi-Fi sync.

## Driver Spotlight

This week's recognition goes to K. Johnson (D-028) — 5 consecutive on-time deliveries with zero compliance issues. Outstanding professionalism. Thank you!`,

  "finance-brief": `## Revenue & RPM Summary

January revenue: **$847,200** (↑ 6.2% vs. December). Average RPM: $2.91/mi (↑ from $2.87 in Q4). Total revenue miles: 291,100. Fleet utilization: 84% (target: 88%).

## Invoice Aging Report

Outstanding AR: $124,500 across 23 open invoices. **7 invoices aging >30 days** ($43,200 total) — action required. Top priority: Walmart DC #INV-2481 ($18,400, 34 days). Suggest follow-up call before Feb 21.

## Fuel Cost Variance

January fuel spend: $89,400 vs. budget of $82,000 (+$7,400 over). Primary driver: California fuel surcharge spike (+18¢/gal). Hedging review scheduled for Feb 28 stand-up.

## IFTA & Compliance Filings

Q4 IFTA report due Feb 28. Mileage data compiled and ready for review. No discrepancies flagged. Tax liability estimate: $12,400.

## Cash Flow & Q1 Forecast

Q1 revenue forecast: **$2.6M** at current run rate. Cash position healthy at 42 DSO. No factoring adjustments needed this month. Q1 profitability on track.`,

  "company-wide": `## A Note from Leadership

Team — Q1 is off to one of our strongest starts yet. 96.3% on-time, $2.91/mi average RPM, and zero lost-time safety incidents in January. This is exactly what we built Hemut to do. Thank you.

## Welcome to the Team

Please join us in welcoming three new team members: **Sarah Chen** (CDL Driver), **David Reyes** (Dispatcher), and **James Liu** (Admin). They are in their first weeks of the Hemut onboarding framework — let's make them feel at home.

## Safety Recognition

**January Safety Star: K. Johnson (D-028)** — 5 consecutive on-time deliveries with zero violations or incidents. Recognized at this week's all-hands stand-up. This is what professional driving looks like.

## What's Next in Q1

- Fleet expansion to 55 trucks arriving in March
- ELD firmware upgrade for all units by Feb 28
- Q1 team offsite — date to be announced

We are building something special here. Let's close Q1 strong. — The Hemut Leadership Team`,
};

function getDraft(typeOrBlueprint: string): string {
  return AI_DRAFTS[typeOrBlueprint] ?? "";
}

// ─── KPI Card ────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-white/20 shrink-0" />
        <div className="text-[11px] text-white/35 font-medium">{label}</div>
      </div>
      <div className="text-[26px] font-bold tracking-tight text-white leading-none">{value}</div>
      <div className="text-[12px] text-white/30 mt-0.5">{subtitle}</div>
    </div>
  );
}

// ─── Newsletter Row ───────────────────────────────────────────
function NewsletterRow({ nl, onEdit }: { nl: Newsletter; onEdit: () => void }) {
  const type = TYPE_CONFIG[nl.type];
  const status = STATUS_CONFIG[nl.status];

  return (
    <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 mb-4 hover:bg-white/[0.04] hover:border-white/[0.09] transition-all cursor-default">
      <div className="flex items-center gap-5">
        {/* Left section */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-[15px] font-semibold text-white/90">{nl.title}</h3>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${type.pill}`}>
              {type.label}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase whitespace-nowrap ${status.pill}`}>
              {status.label}
            </span>
          </div>

          {/* Subtitle row */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="text-[12px] text-white/40 flex items-center gap-1.5">
              <Users className="w-3 h-3 shrink-0" />
              {nl.audience} · {nl.recipientCount} recipients
            </span>
            {nl.scheduledFor && (
              <span className="text-[12px] text-white/40 flex items-center gap-1.5">
                <Clock className="w-3 h-3 shrink-0" />
                Sends {nl.scheduledFor}
              </span>
            )}
            {nl.sentAt && (
              <span className="text-[12px] text-white/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                Sent {nl.sentAt}
              </span>
            )}
          </div>

          {/* Topics row */}
          <div className="flex flex-wrap gap-1.5">
            {nl.topics.map((t) => (
              <span key={t} className="text-[11px] bg-white/[0.06] text-white/40 px-2.5 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right section: open rate bar */}
        <div className="w-48 shrink-0">
          {nl.openRate !== undefined ? (
            <div>
              <div className="text-[11px] text-white/35 font-medium mb-2">Open Rate</div>
              <div className="bg-white/[0.07] rounded-full h-1.5 overflow-hidden mb-1.5">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${nl.openRate}%` }}
                />
              </div>
              <div className="text-[13px] font-semibold text-white/70">{nl.openRate}%</div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-1">
              <button
                className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {nl.openRate !== undefined && (
            <div className="flex items-center justify-end gap-1 mt-3">
              <button
                className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
    <div
      className={`bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 cursor-pointer hover:bg-white/[0.04] ${c.hoverBorder} transition-all`}
    >
      {/* Top: icon + title */}
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} border ${c.iconBorder} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${c.accent}`} />
        </div>
        <div>
          <h3 className={`text-[15px] font-semibold text-white/90`}>{bp.name}</h3>
          <div className="text-[12px] text-white/50 mt-0.5">{bp.audience}</div>
        </div>
      </div>

      {/* Frequency chip */}
      <div className="mt-3">
        <span className="text-[11px] bg-white/[0.06] rounded-full px-2.5 py-0.5 text-white/40">
          {bp.cadence}
        </span>
      </div>

      {/* Sections list */}
      <ul className="mt-4 space-y-2">
        {bp.sections.map((s) => (
          <li key={s} className="flex items-center gap-2 text-[12px] text-white/45">
            <div className={`w-1 h-1 rounded-full ${c.dot} shrink-0`} />
            {s}
          </li>
        ))}
      </ul>

      {/* Use Blueprint button */}
      <button
        onClick={() => onUse(bp)}
        className={`mt-6 text-[13px] font-medium transition-colors ${c.btn}`}
      >
        Use Blueprint →
      </button>
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
  const [aiDrafting, setAiDrafting] = useState(false);

  const draftKey = state.blueprint || state.type || "";
  const hasDraft = draftKey !== "" && getDraft(draftKey) !== "";

  const handleAiDraft = async () => {
    if (!hasDraft || aiDrafting) return;
    setAiDrafting(true);
    try {
      const selectedBp = BLUEPRINTS.find((b) => b.id === state.blueprint);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "draft",
          context: {
            newsletterType: state.type || state.blueprint || "weekly-ops",
            audience: selectedBp?.audience ?? "All Team",
            sections: selectedBp?.sections.join(", ") ?? "Fleet KPIs, Action items",
          },
        }),
      });
      const data = await res.json();
      if (data.text) {
        onChange({ body: data.text });
      } else {
        onChange({ body: getDraft(draftKey) });
      }
    } catch {
      onChange({ body: getDraft(draftKey) });
    } finally {
      setAiDrafting(false);
    }
  };

  const handleBlueprintSelect = (bpId: string) => {
    const bp = BLUEPRINTS.find((b) => b.id === bpId);
    if (bp) {
      const recipientLabel =
        RECIPIENT_OPTIONS.find((r) => r.includes(bp.audience.split(" ")[1] ?? "")) ??
        `${bp.audience} (${bp.audienceCount})`;
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Overlay click to close */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      />

      {/* Modal */}
      <div className="relative bg-[#0a1020] border border-white/[0.1] rounded-2xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[19px] font-bold text-white">New Newsletter</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-white/35 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Blueprint selector */}
        <div className="mb-5">
          <div className="text-[11px] text-white/35 font-medium mb-2">
            Blueprint — optional, pre-fills fields
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BLUEPRINTS.map((bp) => {
              const Icon = bp.icon;
              const selected = state.blueprint === bp.id;
              const selectedCls = MODAL_BLUEPRINT_SELECTED[bp.color] ?? "bg-amber-500/10 border-amber-500/30 text-amber-300";
              return (
                <button
                  key={bp.id}
                  onClick={() => handleBlueprintSelect(selected ? "" : bp.id)}
                  className={`flex items-center gap-2 rounded-xl p-3 border text-[12px] text-left transition-colors ${
                    selected
                      ? selectedCls
                      : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">{bp.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="compose-title" className="text-[12px] font-semibold text-white/45 mb-1.5 block">Title</label>
            <input
              id="compose-title"
              type="text"
              value={state.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Weekly Ops Digest — Week of Feb 25"
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="compose-type" className="text-[12px] font-semibold text-white/45 mb-1.5 block">Type</label>
            <div className="relative">
              <select
                id="compose-type"
                value={state.type}
                onChange={(e) => onChange({ type: e.target.value as NewsletterType | "" })}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full appearance-none"
              >
                <option value="" className="bg-[#0c1525]">Select type...</option>
                <option value="weekly-ops" className="bg-[#0c1525]">Weekly Ops Digest</option>
                <option value="driver-bulletin" className="bg-[#0c1525]">Driver Bulletin</option>
                <option value="finance-brief" className="bg-[#0c1525]">Finance Brief</option>
                <option value="company-wide" className="bg-[#0c1525]">Company-Wide Update</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Recipients */}
          <div>
            <p className="text-[12px] font-semibold text-white/45 mb-1.5 block">Recipients</p>
            <div className="space-y-2">
              {RECIPIENT_OPTIONS.map((opt) => {
                const checked = state.recipients.includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      role="checkbox"
                      aria-checked={checked}
                      tabIndex={0}
                      className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 ${
                        checked
                          ? "bg-amber-500 border-amber-500"
                          : "bg-white/[0.04] border-white/[0.10] group-hover:border-white/25"
                      }`}
                      onClick={() => {
                        const next = checked
                          ? state.recipients.filter((r) => r !== opt)
                          : [...state.recipients, opt];
                        onChange({ recipients: next });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const next = checked
                            ? state.recipients.filter((r) => r !== opt)
                            : [...state.recipients, opt];
                          onChange({ recipients: next });
                        }
                      }}
                    >
                      {checked && <CheckCircle2 className="w-2.5 h-2.5 text-[#080d1a]" />}
                    </div>
                    <span className="text-[13px] text-white/55">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Send time */}
          <div>
            <p className="text-[12px] font-semibold text-white/45 mb-1.5 block">Send Time</p>
            <div className="flex gap-2 mb-3">
              {(["now", "schedule"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => onChange({ scheduleNow: opt === "now" })}
                  className={`flex-1 py-2 rounded-xl text-[13px] font-medium border transition-colors ${
                    (opt === "now") === state.scheduleNow
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:bg-white/[0.06]"
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
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
                />
                <input
                  type="time"
                  value={state.scheduleTime}
                  onChange={(e) => onChange({ scheduleTime: e.target.value })}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="compose-body" className="text-[12px] font-semibold text-white/45 mb-1.5 block">Message</label>
            <button
              onClick={handleAiDraft}
              disabled={aiDrafting || !hasDraft}
              title={!hasDraft ? "Select a blueprint to generate draft" : "Generate AI draft"}
              className={`mt-2 mb-3 flex items-center justify-center gap-2 w-full bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[13px] font-medium rounded-xl py-2.5 transition-colors ${
                !hasDraft ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {aiDrafting ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Draft
                </>
              )}
            </button>
            <textarea
              id="compose-body"
              value={state.body}
              onChange={(e) => onChange({ body: e.target.value })}
              placeholder="Write your newsletter content here. Use ## for section headers, **bold** for emphasis, and - for bullet points."
              className={`bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full min-h-[120px] resize-none font-mono ${
                aiDrafting ? "opacity-50" : ""
              }`}
            />
            <div className="flex gap-3 mt-1.5 text-[12px] text-white/40">
              <span>## Section header</span>
              <span>**bold**</span>
              <span>- bullet</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-white/[0.05] hover:bg-white/[0.08] text-white/65 hover:text-white/85 text-[13px] px-4 py-2 rounded-xl border border-white/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button className="bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            {state.scheduleNow ? "Send Now" : "Schedule"}
          </button>
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
    { key: "newsletters", label: "Newsletters" },
    { key: "blueprints",  label: "Blueprints" },
  ];

  return (
    <div className="px-10 pt-8 pb-10">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6 mb-8 border-b border-white/[0.06]">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-white">Newsletter</h1>
          <p className="text-[14px] text-white/40 mt-2.5 leading-relaxed">
            Create and distribute structured bulletins across your operations team.
          </p>
        </div>
        <button
          onClick={() => openCompose()}
          className="bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Newsletter
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-6 mb-8 pb-6 border-b border-white/[0.05]">
        <KpiCard label="Sent This Month"  value="6"    subtitle="newsletters"     icon={Send} />
        <KpiCard label="Total Recipients" value="104"  subtitle="team members"    icon={Users} />
        <KpiCard label="Avg Open Rate"    value="86%"  subtitle="last 30 days"    icon={TrendingUp} />
        <KpiCard label="Scheduled"        value="2"    subtitle="upcoming sends"  icon={Calendar} />
      </div>

      {/* Tab bar */}
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-1.5 flex gap-1 w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-[13px] px-5 py-2 rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white/[0.09] text-white font-semibold"
                : "text-white/40 hover:text-white/65"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Newsletters */}
      {activeTab === "newsletters" && (
        <div>
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
        <div className="grid grid-cols-2 gap-6">
          {BLUEPRINTS.map((bp) => (
            <BlueprintCard key={bp.id} bp={bp} onUse={handleBlueprintUse} />
          ))}
        </div>
      )}

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
