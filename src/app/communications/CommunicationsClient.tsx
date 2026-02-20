"use client";
import { useState, useEffect, useReducer } from "react";
import {
  MessageSquare,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Truck,
  Radio,
  Plus,
  Shield,
  FileText,
  X,
  Send,
  ArrowRight,
  Sparkles,
  Inbox,
  Star,
  Check,
} from "lucide-react";

// ─── AI Reply Suggestions ─────────────────────────────────────────────────────

const AI_REPLIES: Record<string, string> = {
  "1": `T. Patel — HOS violation on Load L-8815 (Feb 17, 2026) has been logged and corrective action form filed per FMCSA 49 CFR Part 395. Required documentation has been submitted to the safety department. Your next dispatch will include a mandatory pre-trip HOS review with your dispatcher. Please acknowledge receipt of this notice and confirm understanding. If you have questions about this citation or the corrective action process, contact the safety team directly. — Hemut Safety Dept`,

  "2": `Confirming: M. Garcia (D-019) assigned to Load L-8816, Seattle → Portland (174 mi, $3.20/mi). Pickup confirmed for 3:00 PM today. Driver notified via ELD push notification and has confirmed availability. Load updated in TMS — all paperwork attached. Estimated arrival Portland: 5:45 PM. Customer has been pre-notified of driver assignment. — Hemut Dispatch`,

  "3": `Hi Walmart DC-Atlanta — thank you for the heads-up on the delivery window. Our driver on Load L-8820 is on track and we have instructed them to skip the scheduled fuel stop to preserve buffer and ensure a comfortable arrival before your 9:00 PM closing time. We will monitor ETA in real time and call immediately if anything changes. ETA remains 8:45 PM. We appreciate the continued partnership. — Ricky Maldonado, Hemut Operations`,

  "4": `K. Johnson — thanks for the check-in on L-8819. Phoenix ETA at 5:00 PM looks great — you have 30 minutes of buffer on the appointment window. Best Buy DC confirmed open, dock assigned. HOS looks solid at 4h 15m remaining. Enjoy the Love's stop — fuel up and we'll see you in Phoenix. Drive safe. — Dispatch`,

  "5": `PM service scheduled for T-031 on Feb 19 AM prior to M. Garcia's next load assignment. Appointment confirmed at Fleet Service Center. DOT inspection will be completed at the same time. All maintenance records will be updated in the fleet system upon completion. M. Garcia's next load assignment is on hold until T-031 is cleared — estimated back in service by 1:00 PM Feb 19. — Hemut Fleet Ops`,

  "6": `Ricky — outstanding week. Both action items confirmed: (1) M. Garcia assigned to L-8816 — 3:00 PM pickup confirmed, driver notified. (2) T. Patel HOS corrective action form filed — safety team has 47 hours remaining on the 48-hour window, documentation complete. Fleet utilization trending up with two loads filling end-of-week slots. Great work this week. — Ops Team`,

  "7": `J. Martinez — thanks for the check-in near Tulsa. Load L-8821 looking solid — 72% complete, on pace for Dallas at 2:30 PM. Customer pre-notified, dock confirmed open. HOS at 6h 22m gives you plenty of margin. No weather alerts on your Texas corridor. Keep the check-ins coming every few hours. Drive safe. — Dispatch`,

  "8": `D. Thompson — DOT random drug and alcohol test selection has been processed per 49 CFR Part 40. Appointment confirmed at LabCorp — 2847 Houston Ave, Houston, TX. Testing must be completed before departure on Load L-8818. A confirmation SMS has been sent to your phone. Results expected within 24 hours. All documentation has been filed with the Hemut safety department. Questions? Contact safety@hemut.io. — Hemut Safety Dept`,
};

function generateAIReply(messageId: string): string {
  return (
    AI_REPLIES[messageId] ??
    "Thank you for your message. We have reviewed the situation and will take immediate action. Please reach out directly if you need additional information or assistance. — Hemut Ops Team"
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "dispatch" | "driver" | "compliance" | "customer" | "team";
type InboxChannel = Channel | "all";
type InboxFilter = "all" | "unread" | "important";

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
  starred?: boolean;
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
    label: "Compliance",
    icon: Shield,
    pillBg: "bg-red-500/10",
    pillText: "text-red-400",
    avatarBg: "bg-red-500/10",
    avatarText: "text-red-400",
  },
  dispatch: {
    label: "Dispatch",
    icon: Radio,
    pillBg: "bg-amber-500/10",
    pillText: "text-amber-400",
    avatarBg: "bg-amber-500/10",
    avatarText: "text-amber-400",
  },
  driver: {
    label: "Driver",
    icon: Truck,
    pillBg: "bg-sky-500/10",
    pillText: "text-sky-400",
    avatarBg: "bg-sky-500/10",
    avatarText: "text-sky-400",
  },
  customer: {
    label: "Customer",
    icon: FileText,
    pillBg: "bg-violet-500/10",
    pillText: "text-violet-400",
    avatarBg: "bg-violet-500/10",
    avatarText: "text-violet-400",
  },
  team: {
    label: "Team",
    icon: Users,
    pillBg: "bg-emerald-500/10",
    pillText: "text-emerald-400",
    avatarBg: "bg-emerald-500/10",
    avatarText: "text-emerald-400",
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
    starred: true,
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
      "Load L-8816 requires a driver by 3:00 PM today for a Seattle, WA → Portland, OR run (174 miles, $3.20/mi, 18,000 lbs lumber).\n\nAvailable drivers:\n• M. Garcia (D-019) — just completed reset, HOS at 11h available\n• L. Brown (D-031) — completed reset, HOS at 10h 45m available\n\nAI Recommendation: Assign M. Garcia based on proximity and HOS hours.",
    time: "22m ago",
    unread: true,
    priority: "high",
    load: "L-8816",
    starred: true,
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
      "This is an urgent notification from Walmart Distribution Center — Atlanta.\n\nOur dock closes at 9:00 PM EST tonight. Your driver on Load L-8820 has a current ETA of 8:45 PM, leaving only a 15-minute buffer. Any delay, including traffic or fuel stop, will result in a missed delivery window.\n\nPlease confirm the current ETA or request an appointment reschedule for tomorrow morning.",
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
      "Check-in Update — K. Johnson (D-028) | Load L-8819\n\nCurrent Position: Milepost 142 on I-10 East\nETA to Phoenix Dock: 5:00 PM today\nHOS Remaining: 4h 15m\n\nNo mechanical issues. Pre-trip inspection completed at last rest stop. Weather clear through Phoenix.",
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
      "Automated Maintenance Alert — Truck T-031\n\nMiles since last PM: 15,246 (threshold: 15,000)\nDOT Inspection Due: March 2, 2026 (12 days)\nCurrent Driver: M. Garcia (D-019)\n\nRecommended Action: Schedule preventive maintenance service before next load assignment.",
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
      "Team — good week overall.\n\nKey metrics (week of Feb 11–17):\n• 247 active loads managed\n• 96.3% on-time delivery rate (target: 95%)\n• Fleet utilization: 84% (target: 88%)\n\nTwo items need attention before EOD today:\n1. L-8816 is unassigned — pickup is at 3:00 PM.\n2. T. Patel HOS violation needs corrective action documentation within 48 hours.",
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
      "Check-in Update — J. Martinez (D-041) | Load L-8821\n\nCurrent Position: Past Tulsa, OK on I-44 South\nLoad Progress: 72% complete\nETA to Dallas: February 19, 2:30 PM\nHOS Remaining: 6h 22m\n\nWeather clear through Texas. No incidents.",
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
      "Random Drug & Alcohol Testing Notification\n\nDriver: D. Thompson (D-055)\nRegulation: DOT 49 CFR Part 40 — Random Testing Protocol\n\nRequired: Testing must be completed within 2 hours of this notification. Designated collection site: LabCorp — 2847 Houston Ave, Houston, TX.",
    time: "4h ago",
    unread: false,
    priority: "high",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

type StatusType = "pending" | "in-progress" | "complete" | "overdue" | "critical";

function StatusBadge({ status }: { status: StatusType }) {
  const map: Record<StatusType, { label: string; cls: string }> = {
    "pending":     { label: "Pending",     cls: "bg-white/[0.07] text-white/45 border-white/[0.1]" },
    "in-progress": { label: "In Progress", cls: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
    "complete":    { label: "Complete",    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    "overdue":     { label: "Overdue",     cls: "bg-red-500/15 text-red-400 border-red-500/20" },
    "critical":    { label: "Critical",    cls: "bg-red-500/20 text-red-300 border-red-500/30" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cls}`}>
      {label}
    </span>
  );
}

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
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#0a1020] border border-white/[0.1] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-slide-up">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <h2 className="text-[17px] font-bold text-white">New Message</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-14 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-[13px] font-semibold text-white/80">Message sent</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="compose-to" className="text-[12px] font-semibold text-white/45 mb-1.5 block">
                To (driver or customer)
              </label>
              <select
                id="compose-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full"
              >
                <option value="" className="bg-[#0a1020]">Select recipient...</option>
                <optgroup label="Drivers" className="bg-[#0a1020]">
                  <option value="d-028" className="bg-[#0a1020]">K. Johnson (D-028)</option>
                  <option value="d-041" className="bg-[#0a1020]">J. Martinez (D-041)</option>
                  <option value="d-047" className="bg-[#0a1020]">T. Patel (D-047)</option>
                  <option value="d-055" className="bg-[#0a1020]">D. Thompson (D-055)</option>
                  <option value="d-019" className="bg-[#0a1020]">M. Garcia (D-019)</option>
                </optgroup>
                <optgroup label="Customers" className="bg-[#0a1020]">
                  <option value="walmart" className="bg-[#0a1020]">Walmart DC-Atlanta</option>
                  <option value="bestbuy" className="bg-[#0a1020]">Best Buy Logistics</option>
                  <option value="amazon" className="bg-[#0a1020]">Amazon Logistics</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label htmlFor="compose-subject" className="text-[12px] font-semibold text-white/45 mb-1.5 block">
                Subject
              </label>
              <input
                id="compose-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject..."
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full"
              />
            </div>
            <div>
              <label htmlFor="compose-message" className="text-[12px] font-semibold text-white/45 mb-1.5 block">
                Message
              </label>
              <textarea
                id="compose-message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 w-full resize-none"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-white/[0.05] hover:bg-white/[0.08] text-white/65 hover:text-white/85 text-[13px] px-4 py-2 rounded-xl border border-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!to || !subject || !body}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
  onRead,
}: {
  message: Message;
  onClose: () => void;
  onRead: (id: string) => void;
}) {
  const [reply, setReply] = useState("");
  const [resolved, setResolved] = useState(false);
  const [sent, setSent] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const ch = channelConfig[message.channel];

  useEffect(() => { onRead(message.id); }, [message.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSend() {
    if (!reply.trim()) return;
    setSent(true);
    setTimeout(onClose, 1200);
  }

  async function handleAIGenerate() {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reply",
          context: {
            from: message.from,
            channel: message.channel,
            subject: message.subject,
            fullBody: message.fullBody,
          },
        }),
      });
      const data = await res.json();
      if (data.text) setReply(data.text);
    } catch {
      setReply(generateAIReply(message.id));
    } finally {
      setAiGenerating(false);
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      />
      <div className="fixed right-0 top-0 h-full z-50 w-[460px] bg-[#0a1020] border-l border-white/[0.08] shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="h-[60px] px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <p className="text-[14px] font-semibold text-white/90 truncate pr-4">{message.subject}</p>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message preview */}
        <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[12px] text-white/40">From:</span>
            <span className="text-[12px] text-white/70 font-medium">{message.from}</span>
            {message.load && (
              <span className="ml-auto text-[10px] font-mono font-bold text-white/30 bg-white/[0.05] border border-white/[0.06] px-1.5 py-0.5 rounded">
                {message.load}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ch.pillBg} ${ch.pillText}`}>
              <ch.icon className="w-2.5 h-2.5" />
              {ch.label}
            </span>
            {message.priority === "critical" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 uppercase tracking-wide">
                Critical
              </span>
            )}
            {message.priority === "high" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                High
              </span>
            )}
            <span className="text-[11px] text-white/25 ml-auto">{message.time}</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line scrollbar-thin">
            {message.fullBody}
          </p>
        </div>

        {/* Reply area */}
        <div className="flex-1 px-6 py-5 flex flex-col overflow-y-auto">
          {sent ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-[13px] font-semibold text-white/80">Reply sent</p>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/25 mb-3">
                Your Reply
              </p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response or use AI Draft..."
                className={`bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white/80 placeholder:text-white/20 resize-none h-40 w-full focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all ${aiGenerating ? "opacity-50" : ""}`}
              />
              <button
                onClick={handleAIGenerate}
                disabled={aiGenerating}
                className="mt-3 flex items-center gap-2 text-[13px] text-amber-400/80 hover:text-amber-400 transition-colors disabled:opacity-50 self-start"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Draft
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className="px-6 py-4 border-t border-white/[0.06] shrink-0 flex items-center justify-between">
            <span className="text-[12px] text-white/30">
              Reply to {message.from.split(" ")[0]} {message.from.split(" ")[1] ?? ""}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setResolved((r) => !r)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-colors ${
                  resolved
                    ? "bg-amber-500/15 border-amber-500/20 text-amber-400"
                    : "bg-white/[0.05] border-white/[0.08] text-white/65 hover:text-white/85 hover:bg-white/[0.08]"
                }`}
              >
                {resolved ? "Resolved" : "Mark Resolved"}
              </button>
              <button
                onClick={handleSend}
                disabled={!reply.trim()}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: InboxFilter }) {
  const config = {
    all:       { icon: Inbox,   title: "No messages",       sub: "Your inbox is empty — nothing here yet." },
    unread:    { icon: Bell,    title: "All caught up",      sub: "No unread messages. Great job staying on top of things." },
    important: { icon: Star,    title: "No starred messages", sub: "Star messages to find them here quickly." },
  };
  const { icon: Icon, title, sub } = config[filter];
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
        <Icon className="w-6 h-6 text-white/20" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-white/40">{title}</p>
        <p className="text-[13px] text-white/25 mt-1.5 max-w-xs">{sub}</p>
      </div>
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────

function BulkActionBar({
  selectedCount,
  onMarkRead,
  onClear,
}: {
  selectedCount: number;
  onMarkRead: () => void;
  onClear: () => void;
}) {
  if (selectedCount === 0) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4 animate-slide-up">
      <span className="text-[12px] font-semibold text-amber-400">
        {selectedCount} selected
      </span>
      <div className="flex-1" />
      <button
        onClick={onMarkRead}
        className="flex items-center gap-1.5 text-[12px] font-medium text-white/65 hover:text-white/90 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 rounded-lg transition-colors"
      >
        <Check className="w-3 h-3" />
        Mark Read
      </button>
      <button
        onClick={onClear}
        className="flex items-center gap-1.5 text-[12px] font-medium text-white/65 hover:text-white/90 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 rounded-lg transition-colors"
      >
        <X className="w-3 h-3" />
        Clear
      </button>
    </div>
  );
}

// ─── Message Card ─────────────────────────────────────────────────────────────

function MessageCard({
  msg,
  isUnread,
  isSelected,
  onSelect,
  onOpen,
  onStar,
}: {
  msg: Message;
  isUnread: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (msg: Message) => void;
  onStar: (id: string) => void;
}) {
  const ch = channelConfig[msg.channel];

  return (
    <div
      className={`group relative border-b border-white/[0.05] transition-colors ${
        isSelected ? "bg-amber-500/[0.05]" : "hover:bg-white/[0.025]"
      } ${
        msg.priority === "critical"
          ? "pl-3 border-l-2 border-l-red-500/70"
          : msg.priority === "high"
          ? "pl-3 border-l-2 border-l-amber-500/50"
          : "pl-0"
      }`}
    >
      <div className="flex items-start gap-3 py-4 pr-4">
        {/* Checkbox */}
        <button
          onClick={() => onSelect(msg.id)}
          className={`mt-0.5 shrink-0 w-4 h-4 rounded border transition-all ${
            isSelected
              ? "bg-amber-500 border-amber-500"
              : "border-white/[0.15] bg-transparent hover:border-white/30"
          } flex items-center justify-center`}
          aria-label="Select message"
        >
          {isSelected && <Check className="w-2.5 h-2.5 text-[#080d1a]" />}
        </button>

        {/* Star */}
        <button
          onClick={() => onStar(msg.id)}
          className="mt-0.5 shrink-0"
          aria-label="Star message"
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors ${
              msg.starred ? "text-amber-400 fill-amber-400" : "text-white/15 hover:text-white/35"
            }`}
          />
        </button>

        {/* Content */}
        <div
          role="button"
          tabIndex={0}
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onOpen(msg)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(msg); }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {msg.priority === "critical" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 uppercase tracking-wide">
                  Critical
                </span>
              )}
              {msg.priority === "high" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                  High
                </span>
              )}
              <span className={`text-[14px] font-semibold ${isUnread ? "text-white" : "text-white/65"}`}>
                {msg.from}
              </span>
            </div>
            <span className="text-[11px] text-white/30 shrink-0 mt-0.5 ml-3">{msg.time}</span>
          </div>

          {/* Subject */}
          <p className={`text-[13px] font-semibold mb-1.5 leading-snug ${isUnread ? "text-white/90" : "text-white/55"}`}>
            {msg.subject}
          </p>

          {/* Preview */}
          <p className="text-[12px] text-white/38 leading-relaxed line-clamp-1 mb-3">
            {msg.preview}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${ch.pillBg} ${ch.pillText}`}>
                <ch.icon className="w-2.5 h-2.5" />
                {ch.label}
              </span>
              {msg.load && (
                <span className="text-[10px] font-mono font-bold text-white/30 bg-white/[0.06] border border-white/[0.06] px-2 py-0.5 rounded-md">
                  {msg.load}
                </span>
              )}
              {isUnread && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </div>
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-white/25 group-hover:text-white/50 transition-colors">
              Reply <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── State & Reducer for CommunicationsClient ─────────────────────────────────

interface CommsState {
  activeChannel: InboxChannel;
  inboxFilter: InboxFilter;
  replyTarget: Message | null;
  composeOpen: boolean;
  readIds: Set<string>;
  starredIds: Set<string>;
  selectedIds: Set<string>;
}

type CommsAction =
  | { type: "SET_CHANNEL"; channel: InboxChannel }
  | { type: "SET_FILTER"; filter: InboxFilter }
  | { type: "SET_REPLY_TARGET"; message: Message | null }
  | { type: "SET_COMPOSE_OPEN"; open: boolean }
  | { type: "MARK_READ"; id: string }
  | { type: "TOGGLE_STAR"; id: string }
  | { type: "TOGGLE_SELECT"; id: string }
  | { type: "MARK_SELECTED_READ"; ids: Set<string> }
  | { type: "CLEAR_SELECTED" };

function commsReducer(state: CommsState, action: CommsAction): CommsState {
  switch (action.type) {
    case "SET_CHANNEL":
      return { ...state, activeChannel: action.channel };
    case "SET_FILTER":
      return { ...state, inboxFilter: action.filter, selectedIds: new Set() };
    case "SET_REPLY_TARGET":
      return { ...state, replyTarget: action.message };
    case "SET_COMPOSE_OPEN":
      return { ...state, composeOpen: action.open };
    case "MARK_READ":
      if (state.readIds.has(action.id)) return state;
      return { ...state, readIds: new Set([...state.readIds, action.id]) };
    case "TOGGLE_STAR": {
      const next = new Set(state.starredIds);
      if (next.has(action.id)) next.delete(action.id); else next.add(action.id);
      return { ...state, starredIds: next };
    }
    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedIds);
      if (next.has(action.id)) next.delete(action.id); else next.add(action.id);
      return { ...state, selectedIds: next };
    }
    case "MARK_SELECTED_READ":
      return {
        ...state,
        readIds: new Set([...state.readIds, ...action.ids]),
        selectedIds: new Set(),
      };
    case "CLEAR_SELECTED":
      return { ...state, selectedIds: new Set() };
    default:
      return state;
  }
}

const COMMS_INITIAL_STATE: CommsState = {
  activeChannel: "all",
  inboxFilter: "all",
  replyTarget: null,
  composeOpen: false,
  readIds: new Set(),
  starredIds: new Set(messages.filter((m) => m.starred).map((m) => m.id)),
  selectedIds: new Set(),
};

// ─── Main Component ────────────────────────────────────────────────────────────

export function CommunicationsClient() {
  const [state, dispatch] = useReducer(commsReducer, COMMS_INITIAL_STATE);
  const { activeChannel, inboxFilter, replyTarget, composeOpen, readIds, starredIds, selectedIds } = state;

  const markRead = (id: string) => dispatch({ type: "MARK_READ", id });
  const toggleStar = (id: string) => dispatch({ type: "TOGGLE_STAR", id });
  const toggleSelect = (id: string) => dispatch({ type: "TOGGLE_SELECT", id });
  const markSelectedRead = () => dispatch({ type: "MARK_SELECTED_READ", ids: selectedIds });

  const isUnread = (m: Message) => m.unread && !readIds.has(m.id);
  const isStarred = (m: Message) => starredIds.has(m.id);
  const totalUnread = messages.filter(isUnread).length;

  const channelOrder: Channel[] = ["dispatch", "compliance", "driver", "customer", "team"];

  const unreadByChannel = (ch: Channel) =>
    messages.filter((m) => m.channel === ch && isUnread(m)).length;

  // Apply channel filter
  const byChannel =
    activeChannel === "all"
      ? messages
      : messages.filter((m) => m.channel === activeChannel);

  // Apply inbox filter (All / Unread / Important)
  const filtered = byChannel.filter((m) => {
    if (inboxFilter === "unread") return isUnread(m);
    if (inboxFilter === "important") return isStarred(m);
    return true;
  });

  const kpis = [
    {
      label: "Messages Today",
      value: "38",
      sub: "3 require action now",
      icon: MessageSquare,
      iconBg: "bg-amber-500/10",
      iconBorder: "border-amber-500/15",
      iconColor: "text-amber-400",
    },
    {
      label: "Compliance Alerts",
      value: "2",
      sub: "1 critical · 1 pending",
      icon: AlertTriangle,
      iconBg: "bg-red-500/10",
      iconBorder: "border-red-500/15",
      iconColor: "text-red-400",
    },
    {
      label: "Driver Check-ins",
      value: "41",
      sub: "All active drivers reported",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconBorder: "border-emerald-500/15",
      iconColor: "text-emerald-400",
    },
    {
      label: "Avg Response Time",
      value: "18 min",
      sub: "Target: < 5 min",
      icon: Clock,
      iconBg: "bg-amber-500/10",
      iconBorder: "border-amber-500/15",
      iconColor: "text-amber-400",
    },
  ];

  const filterTabs: { key: InboxFilter; label: string; count?: number }[] = [
    { key: "all",       label: "All",       count: messages.length },
    { key: "unread",    label: "Unread",    count: totalUnread },
    { key: "important", label: "Important", count: starredIds.size },
  ];

  return (
    <div className="flex flex-col h-full px-6 lg:px-10">
      {/* Page header */}
      <div className="flex items-start justify-between pt-8 pb-6 mb-8 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-white">Communications</h1>
          <p className="text-[14px] text-white/40 mt-2.5 leading-relaxed">
            Unified inbox across dispatch, compliance, driver, customer, and team channels.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {totalUnread > 0 && (
            <div className="flex items-center gap-2 text-[12px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-full">
              <Bell className="w-3.5 h-3.5" />
              {totalUnread} unread
            </div>
          )}
          <button
            onClick={() => dispatch({ type: "SET_COMPOSE_OPEN", open: true })}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-6 border-b border-white/[0.05] shrink-0">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-6 h-6 rounded-lg ${k.iconBg} border ${k.iconBorder} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3 h-3 ${k.iconColor}`} />
                </div>
                <p className="text-[11px] text-white/35 font-medium">{k.label}</p>
              </div>
              <p className="text-[26px] font-bold tracking-tight text-white leading-none">{k.value}</p>
              <p className="text-[12px] text-white/30 mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex gap-7 flex-1 min-h-0 pb-10 overflow-hidden">

        {/* Channel sidebar */}
        <div className="w-48 shrink-0 overflow-y-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/25 mb-5 px-2">
            Channels
          </p>
          <div className="space-y-1">
            <button
              onClick={() => dispatch({ type: "SET_CHANNEL", channel: "all" })}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all ${
                activeChannel === "all"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white/75 border border-transparent"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-[14px] h-[14px] shrink-0" />
                All
              </span>
              <span className="text-[10px] bg-white/[0.07] rounded-full px-1.5 py-0.5 text-white/40 min-w-[20px] text-center">
                {messages.length}
              </span>
            </button>

            {channelOrder.map((key) => {
              const cfg = channelConfig[key];
              const Icon = cfg.icon;
              const count = messages.filter((m) => m.channel === key).length;
              const unread = unreadByChannel(key);
              const active = activeChannel === key;
              return (
                <button
                  key={key}
                  onClick={() => dispatch({ type: "SET_CHANNEL", channel: key })}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all ${
                    active
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-white/45 hover:bg-white/[0.04] hover:text-white/75 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-[14px] h-[14px] shrink-0" />
                    <span className="truncate">{cfg.label}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-[#080d1a]">
                        {unread}
                      </span>
                    )}
                    <span className="text-[10px] bg-white/[0.07] rounded-full px-1.5 py-0.5 text-white/40 min-w-[20px] text-center">
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto min-w-0 pr-1">
          {/* Filter tabs: All / Unread / Important */}
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-fit mb-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => dispatch({ type: "SET_FILTER", filter: tab.key })}
                className={`flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  inboxFilter === tab.key
                    ? "bg-white/[0.09] text-white font-semibold"
                    : "text-white/40 hover:text-white/65"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    inboxFilter === tab.key ? "bg-white/10 text-white/80" : "bg-white/[0.06] text-white/35"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bulk action bar */}
          <BulkActionBar
            selectedCount={selectedIds.size}
            onMarkRead={markSelectedRead}
            onClear={() => dispatch({ type: "CLEAR_SELECTED" })}
          />

          {/* Message list */}
          {filtered.length === 0 ? (
            <EmptyState filter={inboxFilter} />
          ) : (
            <div>
              {filtered.map((msg) => (
                <MessageCard
                  key={msg.id}
                  msg={{ ...msg, starred: starredIds.has(msg.id) }}
                  isUnread={isUnread(msg)}
                  isSelected={selectedIds.has(msg.id)}
                  onSelect={toggleSelect}
                  onOpen={(msg) => dispatch({ type: "SET_REPLY_TARGET", message: msg })}
                  onStar={toggleStar}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {replyTarget && (
        <ReplyDrawer
          message={replyTarget}
          onClose={() => dispatch({ type: "SET_REPLY_TARGET", message: null })}
          onRead={markRead}
        />
      )}
      {composeOpen && <ComposeModal onClose={() => dispatch({ type: "SET_COMPOSE_OPEN", open: false })} />}
    </div>
  );
}
