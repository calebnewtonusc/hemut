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
  X,
  Send,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "dispatch" | "driver" | "compliance" | "customer" | "team";
type MainTab = "inbox" | "sops" | "silos";
type InboxChannel = Channel | "all";

interface Message {
  id: string;
  channel: Channel;
  from: string;
  initials: string;
  subject: string;
  preview: string;
  fullBody: string;
  time: string;
  unread: boolean;
  priority?: "critical" | "high" | "normal";
  load?: string;
}

interface SOP {
  id: string;
  title: string;
  description: string;
  channel: Channel;
  sla: string;
  lastUpdated: string;
}

interface Silo {
  before: string;
  after: string;
  beforeDesc: string;
  afterDesc: string;
  efficiencyGain: number;
  icon: React.ElementType;
  iconColor: string;
}

// ─── Channel Config ───────────────────────────────────────────────────────────

const channelConfig: Record<
  Channel,
  {
    label: string;
    icon: React.ElementType;
    pillBg: string;
    pillText: string;
    avatarBg: string;
    avatarText: string;
  }
> = {
  compliance: {
    label: "Compliance & Safety",
    icon: Shield,
    pillBg: "bg-red-500/15",
    pillText: "text-red-400",
    avatarBg: "bg-red-500/20",
    avatarText: "text-red-300",
  },
  dispatch: {
    label: "Dispatch Alerts",
    icon: Radio,
    pillBg: "bg-amber-500/15",
    pillText: "text-amber-400",
    avatarBg: "bg-amber-500/20",
    avatarText: "text-amber-300",
  },
  driver: {
    label: "Driver Check-ins",
    icon: Truck,
    pillBg: "bg-blue-500/15",
    pillText: "text-blue-400",
    avatarBg: "bg-blue-500/20",
    avatarText: "text-blue-300",
  },
  customer: {
    label: "Customer Updates",
    icon: FileText,
    pillBg: "bg-emerald-500/15",
    pillText: "text-emerald-400",
    avatarBg: "bg-emerald-500/20",
    avatarText: "text-emerald-300",
  },
  team: {
    label: "Team Announcements",
    icon: Users,
    pillBg: "bg-purple-500/15",
    pillText: "text-purple-400",
    avatarBg: "bg-purple-500/20",
    avatarText: "text-purple-300",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const messages: Message[] = [
  {
    id: "1",
    channel: "compliance",
    from: "FMCSA Alert System",
    initials: "FA",
    subject: "HOS Violation — Driver D-047 (T. Patel)",
    preview:
      "Driver T. Patel logged 11h 58min driving time on Feb 17 — exceeds 11-hour limit by 58 minutes.",
    fullBody:
      "Driver T. Patel (D-047) logged 11 hours and 58 minutes of driving time on February 17, 2026, exceeding the federal 11-hour limit by 58 minutes on Load L-8815 (Flagstaff, AZ → Las Vegas, NV).\n\nRequired action: Review and document corrective action within 48 hours per FMCSA 49 CFR Part 395. Failure to document may result in a compliance violation on the next audit.",
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
    preview:
      "Seattle → Portland · 174 mi · $3.20/mi. Available drivers: M. Garcia (reset), L. Brown (reset).",
    fullBody:
      "Load L-8816 requires a driver by 3:00 PM today for a Seattle, WA → Portland, OR run (174 miles, $3.20/mi, 18,000 lbs lumber).\n\nAvailable drivers:\n• M. Garcia (D-019) — just completed reset, HOS at 11h available\n• L. Brown (D-031) — completed reset, HOS at 10h 45m available\n\nAI Recommendation: Assign M. Garcia based on proximity and HOS hours. Auto-match is ready to send — confirm to dispatch.",
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
    preview:
      "Our dock will close at 9:00 PM EST. Current ETA is 8:45 PM — only 15-minute buffer.",
    fullBody:
      "This is an urgent notification from Walmart Distribution Center — Atlanta.\n\nOur dock closes at 9:00 PM EST tonight. Your driver on Load L-8820 has a current ETA of 8:45 PM, leaving only a 15-minute buffer. Any delay, including traffic or fuel stop, will result in a missed delivery window.\n\nPlease confirm the current ETA or request an appointment reschedule for tomorrow morning (Feb 19, 6:00 AM earliest available slot). Note that a reschedule will incur a $150 appointment fee per our dock agreement.",
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
    preview:
      "Currently at milepost 142 on I-10 E. ETA to Phoenix dock 5:00 PM. No issues. Pre-trip complete.",
    fullBody:
      "Check-in Update — K. Johnson (D-028) | Load L-8819\n\nCurrent Position: Milepost 142 on I-10 East\nETA to Phoenix Dock: 5:00 PM today\nHOS Remaining: 4h 15m\nFuel Status: Will stop at Exit 117 (Love's Travel Stop) — approx. 20 min\n\nNo mechanical issues. Pre-trip inspection completed at last rest stop. Weather clear through Phoenix. Delivery appointment confirmed at Best Buy DC.",
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
    preview:
      "15,246 miles since last preventive maintenance. DOT inspection due in 12 days.",
    fullBody:
      "Automated Maintenance Alert — Truck T-031\n\nMiles since last PM: 15,246 (threshold: 15,000)\nDOT Inspection Due: March 2, 2026 (12 days)\nCurrent Driver: M. Garcia (D-019)\nCurrent Status: Available (post-reset)\n\nRecommended Action: Schedule preventive maintenance service before next load assignment. Delaying PM beyond 16,000 miles risks out-of-service citation at next weigh station inspection. Suggested service window: Feb 19 AM (while M. Garcia is between loads).",
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
    preview:
      "Team — strong week. 247 active loads, 96.3% on-time. Two items need attention before EOD.",
    fullBody:
      "Team — good week overall.\n\nKey metrics (week of Feb 11–17):\n• 247 active loads managed\n• 96.3% on-time delivery rate (target: 95%)\n• Fleet utilization: 84% (target: 88%)\n• Total revenue miles: 41,200\n\nTwo items need attention before EOD today:\n1. L-8816 is unassigned — pickup is at 3:00 PM. Assign M. Garcia now.\n2. T. Patel HOS violation (L-8815) needs corrective action documentation within 48 hours.\n\nGreat work this week. Let's close strong.",
    time: "2h ago",
    unread: false,
  },
  {
    id: "7",
    channel: "driver",
    from: "J. Martinez (D-041)",
    initials: "JM",
    subject: "Check-in: Load L-8821 — Tulsa, OK",
    preview:
      "Passed Tulsa OK. 72% complete. ETA Dallas Feb 19 2:30 PM confirmed. HOS at 6h 22m remaining.",
    fullBody:
      "Check-in Update — J. Martinez (D-041) | Load L-8821\n\nCurrent Position: Past Tulsa, OK on I-44 South\nLoad Progress: 72% complete\nETA to Dallas: February 19, 2:30 PM\nHOS Remaining: 6h 22m\n\nWeather: Clear through Texas. No incidents. Cargo secure — last strap check at fuel stop. Will make ETA with time to spare. No issues to report.",
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
    preview:
      "D. Thompson has been randomly selected per DOT 49 CFR Part 40. Testing within 2 hours of notification.",
    fullBody:
      "Random Drug & Alcohol Testing Notification\n\nDriver: D. Thompson (D-055)\nRegulation: DOT 49 CFR Part 40 — Random Testing Protocol\nSelection Method: Computer-generated random selection (Q1 2026 pool)\n\nRequired: Testing must be completed within 2 hours of this notification. Driver has been notified via SMS. Designated collection site: LabCorp — 2847 Houston Ave, Houston, TX.\n\nDriver D. Thompson is currently on Load L-8818 (Houston → New Orleans). Coordinate with driver for collection timing before departure or at origin.",
    time: "4h ago",
    unread: false,
    priority: "high",
  },
];

const sops: SOP[] = [
  {
    id: "sop-1",
    title: "HOS Violation Response",
    description:
      "Step-by-step protocol for documenting, escalating, and resolving Hours of Service violations in compliance with FMCSA 49 CFR Part 395. Includes driver notification, corrective action form, and 48-hour documentation requirements.",
    channel: "compliance",
    sla: "Immediate action · 48hr documentation",
    lastUpdated: "Jan 14, 2026",
  },
  {
    id: "sop-2",
    title: "Customer Delivery Exception",
    description:
      "Protocol for communicating delivery delays, missed windows, and appointment reschedules to customers. Covers notification timing, escalation paths, and documentation requirements for detention claims and appointment fees.",
    channel: "customer",
    sla: "Notify customer before they follow up",
    lastUpdated: "Jan 28, 2026",
  },
  {
    id: "sop-3",
    title: "Driver Check-in Protocol",
    description:
      "Mandatory check-in schedule and communication standards for all active drivers. Includes required check-in points (pickup, every 4 hours, delivery), ELD integration procedures, and unreachable driver escalation steps.",
    channel: "driver",
    sla: "Every 4 hours on-route",
    lastUpdated: "Feb 3, 2026",
  },
  {
    id: "sop-4",
    title: "Load Delay Notification",
    description:
      "Procedure for logging, escalating, and communicating load delays exceeding 30 minutes. Includes cause code taxonomy, automatic customer notification triggers, and ops manager escalation thresholds.",
    channel: "dispatch",
    sla: "Log within 30 min of delay",
    lastUpdated: "Jan 21, 2026",
  },
  {
    id: "sop-5",
    title: "Critical Alert Escalation",
    description:
      "Multi-tier escalation framework for P1 compliance, safety, and operational alerts. Defines escalation triggers, notification channels (SMS/push/email), response time SLAs, and after-hours on-call procedures.",
    channel: "compliance",
    sla: "5-minute P1 response",
    lastUpdated: "Feb 10, 2026",
  },
];

const silos: Silo[] = [
  {
    before: "Phone calls between dispatch and drivers",
    after: "Dispatch Alerts (Hemut)",
    beforeDesc:
      "Verbal instructions lost, no audit trail, average callback time 18+ minutes during shift changes.",
    afterDesc:
      "Structured push notifications with driver acknowledgment, full audit log, and 4-min average response.",
    efficiencyGain: 78,
    icon: Radio,
    iconColor: "text-amber-400",
  },
  {
    before: "WhatsApp group chats for driver updates",
    after: "Driver Check-ins (Hemut)",
    beforeDesc:
      "Unstructured messages mixed with personal content, no integration with ELD or TMS data, no SLA enforcement.",
    afterDesc:
      "Structured check-ins every 4 hours with location, HOS, and cargo status — automatically logged to TMS.",
    efficiencyGain: 65,
    icon: Truck,
    iconColor: "text-blue-400",
  },
  {
    before: "Email chains for customer updates",
    after: "Customer Updates (Hemut)",
    beforeDesc:
      "Delayed notifications averaging 3+ hours post-event, no visibility into delivery status, high dispute rate.",
    afterDesc:
      "Automated proactive updates triggered by ELD events — customer notified before they ask, every time.",
    efficiencyGain: 82,
    icon: FileText,
    iconColor: "text-emerald-400",
  },
  {
    before: "Siloed compliance alerts (safety team only)",
    after: "Compliance & Safety (Hemut)",
    beforeDesc:
      "HOS violations and drug test selections reach ops managers 2–4 hours after incident. FMCSA audit risk.",
    afterDesc:
      "All P1 compliance events auto-notify ops manager via SMS within 5 minutes. Full corrective action workflow.",
    efficiencyGain: 71,
    icon: Shield,
    iconColor: "text-red-400",
  },
  {
    before: "Fragmented team announcements (Slack + email)",
    after: "Team Announcements (Hemut)",
    beforeDesc:
      "Critical ops updates buried in general Slack channels, no priority differentiation, low read rates.",
    afterDesc:
      "Priority-tiered announcements with mandatory acknowledgment for P1 items. 94% same-day read rate.",
    efficiencyGain: 58,
    icon: Users,
    iconColor: "text-purple-400",
  },
  {
    before: "Finance learns about exceptions 9 days late",
    after: "Integrated Exception Routing (Hemut)",
    beforeDesc:
      "Invoice disputes raised long after delivery due to no real-time loop-in on detention, damage, or delays.",
    afterDesc:
      "Compliance and ops exceptions auto-routed to Finance CC list at point of occurrence. Live exception dashboard.",
    efficiencyGain: 69,
    icon: Zap,
    iconColor: "text-amber-400",
  },
];

// ─── Compose Modal ─────────────────────────────────────────────────────────────

function ComposeModal({ onClose }: { onClose: () => void }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!to || !subject || !body) return;
    setSent(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-[#0d1424] border border-white/[0.08] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">New Message</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {sent ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <p className="text-sm font-medium text-white/80">Message sent</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">
                To (driver or customer)
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/80 focus:outline-none focus:border-amber-500/60 transition-colors"
              >
                <option value="" className="bg-[#0d1424]">
                  Select recipient...
                </option>
                <optgroup label="Drivers" className="bg-[#0d1424]">
                  <option value="d-028" className="bg-[#0d1424]">K. Johnson (D-028)</option>
                  <option value="d-041" className="bg-[#0d1424]">J. Martinez (D-041)</option>
                  <option value="d-047" className="bg-[#0d1424]">T. Patel (D-047)</option>
                  <option value="d-055" className="bg-[#0d1424]">D. Thompson (D-055)</option>
                  <option value="d-019" className="bg-[#0d1424]">M. Garcia (D-019)</option>
                </optgroup>
                <optgroup label="Customers" className="bg-[#0d1424]">
                  <option value="walmart" className="bg-[#0d1424]">Walmart DC-Atlanta</option>
                  <option value="bestbuy" className="bg-[#0d1424]">Best Buy Logistics</option>
                  <option value="amazon" className="bg-[#0d1424]">Amazon Logistics</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">
                Message
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!to || !subject || !body}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reply Drawer ──────────────────────────────────────────────────────────────

function ReplyDrawer({
  message,
  onClose,
}: {
  message: Message;
  onClose: () => void;
}) {
  const [reply, setReply] = useState("");
  const [resolved, setResolved] = useState(false);
  const [sent, setSent] = useState(false);
  const ch = channelConfig[message.channel];

  function handleSend() {
    if (!reply.trim()) return;
    setSent(true);
    setTimeout(onClose, 1200);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full z-50 w-[420px] bg-[#0d1424] border-l border-white/[0.07] shadow-2xl flex flex-col animate-slide-in-right">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full ${ch.pillBg} ${ch.pillText}`}
            >
              <ch.icon className="w-3 h-3" />
              {ch.label}
            </span>
            {message.load && (
              <span className="text-[10px] font-mono font-bold text-white/30 bg-white/[0.05] border border-white/[0.06] px-1.5 py-0.5 rounded">
                {message.load}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-full ${ch.avatarBg} flex items-center justify-center shrink-0 font-bold text-xs ${ch.avatarText}`}
            >
              {message.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-xs font-semibold text-white/80">
                  {message.from}
                </span>
                <span className="text-[10px] text-white/30 shrink-0">
                  {message.time}
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-2">
                {message.subject}
              </p>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">
                {message.fullBody}
              </p>
            </div>
          </div>
        </div>

        {/* Reply Area */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-y-auto">
          {sent ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <p className="text-sm font-medium text-white/80">Reply sent</p>
            </div>
          ) : (
            <>
              <label className="text-xs font-medium text-white/40">
                Your reply
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response..."
                rows={6}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors resize-none flex-1"
              />
            </>
          )}
        </div>

        {/* Actions */}
        {!sent && (
          <div className="px-5 py-4 border-t border-white/[0.06] shrink-0 flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={!reply.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-1 justify-center"
            >
              <Send className="w-3.5 h-3.5" />
              Send Reply
            </button>
            <button
              onClick={() => setResolved((r) => !r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                resolved
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/[0.15]"
              }`}
            >
              {resolved ? "Resolved" : "Mark Resolved"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KpiCards() {
  const kpis = [
    {
      label: "Messages Today",
      value: "38",
      sub: "3 require action now",
      icon: MessageSquare,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      valuColor: "text-white",
    },
    {
      label: "Compliance Alerts",
      value: "2",
      sub: "1 critical · 1 pending",
      icon: AlertTriangle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      valuColor: "text-red-400",
    },
    {
      label: "Driver Check-ins",
      value: "41",
      sub: "All active drivers reported",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      valuColor: "text-emerald-400",
    },
    {
      label: "Avg. Response Time",
      value: "18 min",
      sub: "Target: < 5 min",
      icon: Clock,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      valuColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div
            key={k.label}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
          >
            <div
              className={`w-9 h-9 ${k.iconBg} rounded-lg flex items-center justify-center mb-3`}
            >
              <Icon className={`w-4 h-4 ${k.iconColor}`} />
            </div>
            <div className={`text-2xl font-bold mb-0.5 ${k.valuColor}`}>
              {k.value}
            </div>
            <div className="text-xs font-semibold text-white/70 mb-0.5">
              {k.label}
            </div>
            <div className="text-[11px] text-white/35">{k.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Inbox Tab ────────────────────────────────────────────────────────────────

function InboxTab({
  onReply,
}: {
  onReply: (msg: Message) => void;
}) {
  const [activeChannel, setActiveChannel] = useState<InboxChannel>("all");

  const channelOrder: Channel[] = [
    "dispatch",
    "compliance",
    "driver",
    "customer",
    "team",
  ];

  const unreadByChannel = (ch: Channel) =>
    messages.filter((m) => m.channel === ch && m.unread).length;

  const filtered =
    activeChannel === "all"
      ? messages
      : messages.filter((m) => m.channel === activeChannel);

  return (
    <div className="flex gap-5">
      {/* Channel Sidebar */}
      <div className="w-52 shrink-0 space-y-1">
        {/* All Channels */}
        <button
          onClick={() => setActiveChannel("all")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeChannel === "all"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4" />
            All Channels
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeChannel === "all"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-white/[0.06] text-white/40"
            }`}
          >
            {messages.length}
          </span>
        </button>

        <div className="pt-1 pb-1">
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-3 mb-1">
            Channels
          </p>
        </div>

        {channelOrder.map((key) => {
          const cfg = channelConfig[key];
          const Icon = cfg.icon;
          const count = messages.filter((m) => m.channel === key).length;
          const unread = unreadByChannel(key);
          const active = activeChannel === key;
          return (
            <button
              key={key}
              onClick={() => setActiveChannel(key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span className="truncate text-xs leading-tight">
                  {cfg.label}
                </span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {unread > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
                <span className="text-[10px] font-bold text-white/30">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Message List */}
      <div className="flex-1 space-y-2 min-w-0">
        {filtered.map((msg) => {
          const ch = channelConfig[msg.channel];
          return (
            <div
              key={msg.id}
              className={`rounded-xl border p-4 transition-all ${
                msg.unread
                  ? "bg-white/[0.05] border-white/[0.08]"
                  : "bg-white/[0.03] border-white/[0.05]"
              } ${
                msg.priority === "critical"
                  ? "border-l-2 border-l-red-500/60"
                  : msg.priority === "high"
                  ? "border-l-2 border-l-amber-500/50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full ${ch.avatarBg} flex items-center justify-center shrink-0 font-bold text-xs ${ch.avatarText}`}
                >
                  {msg.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {/* Channel pill */}
                    <span
                      className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ch.pillBg} ${ch.pillText}`}
                    >
                      <ch.icon className="w-2.5 h-2.5" />
                      {ch.label}
                    </span>
                    {/* Load badge */}
                    {msg.load && (
                      <span className="text-[10px] font-mono font-bold text-white/30 bg-white/[0.05] border border-white/[0.07] px-1.5 py-0.5 rounded">
                        {msg.load}
                      </span>
                    )}
                    {/* Priority badge */}
                    {msg.priority === "critical" && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                        Critical
                      </span>
                    )}
                    {msg.priority === "high" && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                        High
                      </span>
                    )}
                    {/* Unread dot */}
                    {msg.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    )}
                  </div>

                  {/* Subject */}
                  <p
                    className={`text-sm mb-1 leading-snug ${
                      msg.unread
                        ? "font-semibold text-white"
                        : "font-medium text-white/70"
                    }`}
                  >
                    {msg.subject}
                  </p>

                  {/* Preview */}
                  <p className="text-xs text-white/35 line-clamp-2 leading-relaxed">
                    {msg.preview}
                  </p>
                </div>

                {/* Right column */}
                <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-white/30 whitespace-nowrap">
                    {msg.time}
                  </span>
                  <button
                    onClick={() => onReply(msg)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Reply <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SOPs Tab ─────────────────────────────────────────────────────────────────

function SOPsTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-semibold text-white/80">
          Standard Operating Procedures
        </p>
        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full ml-1">
          {sops.length} Active
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {sops.map((sop) => {
          const ch = channelConfig[sop.channel];
          return (
            <div
              key={sop.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${ch.avatarBg} flex items-center justify-center shrink-0`}
                >
                  <ch.icon className={`w-5 h-5 ${ch.pillText}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">
                      {sop.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ch.pillBg} ${ch.pillText}`}
                    >
                      {ch.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed mb-3">
                    {sop.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[11px] text-white/40">
                        <Clock className="w-3 h-3" />
                        SLA: <span className="text-white/60 font-medium">{sop.sla}</span>
                      </span>
                      <span className="text-[11px] text-white/25">
                        Updated {sop.lastUpdated}
                      </span>
                    </div>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors opacity-0 group-hover:opacity-100">
                      View SOP <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Silo Analysis Tab ────────────────────────────────────────────────────────

function SiloTab() {
  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Communication Silo Analysis
            </h3>
            <p className="text-xs text-white/45 leading-relaxed max-w-2xl">
              Hemut replaces 6 fragmented communication channels with a unified,
              structured inbox. Each row shows the tool being replaced, what it
              becomes in Hemut, and the measured efficiency gain from elimination
              of context-switching and response delays.
            </p>
          </div>
          <div className="shrink-0 ml-auto">
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">71%</div>
              <div className="text-[11px] text-white/35">avg. efficiency gain</div>
            </div>
          </div>
        </div>
      </div>

      {/* Silo grid */}
      <div className="grid grid-cols-2 gap-4">
        {silos.map((silo) => {
          const Icon = silo.icon;
          return (
            <div
              key={silo.before}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
            >
              {/* Before → After header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white/[0.05] rounded-lg flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${silo.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                      Before
                    </span>
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      After
                    </span>
                  </div>
                </div>
                {/* Efficiency badge */}
                <div className="shrink-0">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                    +{silo.efficiencyGain}%
                  </span>
                </div>
              </div>

              {/* Before block */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 mb-2">
                <p className="text-[11px] font-semibold text-red-400/80 mb-1">
                  {silo.before}
                </p>
                <p className="text-[11px] text-white/30 leading-relaxed">
                  {silo.beforeDesc}
                </p>
              </div>

              {/* After block */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                <p className="text-[11px] font-semibold text-emerald-400/80 mb-1">
                  {silo.after}
                </p>
                <p className="text-[11px] text-white/30 leading-relaxed">
                  {silo.afterDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CommunicationsClient() {
  const [activeTab, setActiveTab] = useState<MainTab>("inbox");
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const totalUnread = messages.filter((m) => m.unread).length;

  const tabs: { id: MainTab; label: string }[] = [
    { id: "inbox", label: "Unified Inbox" },
    { id: "sops", label: "Communication SOPs" },
    { id: "silos", label: "Silo Analysis" },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#080d1a", color: "rgba(255,255,255,0.9)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Communications Hub</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Unified dispatch · driver · compliance · customer communications
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalUnread > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
              <Bell className="w-3.5 h-3.5" />
              {totalUnread} unread
            </div>
          )}
          <button
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Tab Bar */}
      <div className="flex items-center border-b border-white/[0.06] mb-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 pb-3 text-sm font-medium transition-colors mr-1 ${
                active ? "text-amber-400" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {tab.id === "inbox" && totalUnread > 0 && (
                <span className="ml-1.5 text-[10px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded-full">
                  {totalUnread}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "inbox" && (
        <InboxTab onReply={(msg) => setReplyTarget(msg)} />
      )}
      {activeTab === "sops" && <SOPsTab />}
      {activeTab === "silos" && <SiloTab />}

      {/* Reply Drawer */}
      {replyTarget && (
        <ReplyDrawer
          message={replyTarget}
          onClose={() => setReplyTarget(null)}
        />
      )}

      {/* Compose Modal */}
      {composeOpen && <ComposeModal onClose={() => setComposeOpen(false)} />}

      {/* Drawer animation */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
