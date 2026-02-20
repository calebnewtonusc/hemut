"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Truck,
  Shield,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Activity,
  DollarSign,
  Package,
  Bell,
} from "lucide-react";

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
        }
      };
      frameRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  sub: string;
  icon: React.ElementType;
  trend?: { value: string; up: boolean };
  accent?: "amber" | "emerald" | "red" | "sky";
  delay?: number;
}

function KpiCard({ label, value, suffix = "", prefix = "", sub, icon: Icon, trend, accent = "amber", delay = 0 }: KpiCardProps) {
  const animated = useCountUp(value, 1200, delay);

  const accentMap = {
    amber:   { icon: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/15" },
    emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
    red:     { icon: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/15" },
    sky:     { icon: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/15" },
  };
  const a = accentMap[accent];

  return (
    <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.04] hover:border-white/[0.09] transition-all">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${a.icon}`} />
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            trend.up
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
              : "bg-red-500/10 text-red-400 border border-red-500/15"
          }`}>
            {trend.up ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div>
        <div className="text-[32px] font-bold tracking-tight text-white leading-none tabular-nums">
          {prefix}{animated.toLocaleString()}{suffix}
        </div>
        <div className="text-[11px] text-white/35 font-medium mt-1">{label}</div>
      </div>
      <div className="text-[12px] text-white/30">{sub}</div>
    </div>
  );
}

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

// ─── Activity Item ────────────────────────────────────────────────────────────

interface ActivityItemProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  text: string;
  time: string;
  status?: StatusType;
}

function ActivityItem({ icon: Icon, iconColor, iconBg, text, time, status }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white/70 leading-snug">{text}</p>
        <p className="text-[11px] text-white/30 mt-0.5">{time}</p>
      </div>
      {status && <StatusBadge status={status} />}
    </div>
  );
}

// ─── Pending Actions ──────────────────────────────────────────────────────────

const pendingActions = [
  { text: "Assign driver to Load L-8816 (Seattle → Portland)", due: "Due by 3:00 PM", status: "overdue" as StatusType, href: "/communications" },
  { text: "T. Patel HOS corrective action documentation", due: "48hr window — 36h remain", status: "in-progress" as StatusType, href: "/communications" },
  { text: "Schedule T-031 preventive maintenance", due: "DOT inspection in 12 days", status: "pending" as StatusType, href: "/communications" },
  { text: "D. Thompson DOT drug test confirmation", due: "Pending clearance", status: "pending" as StatusType, href: "/communications" },
  { text: "Sarah Chen — ELD device pairing", due: "Week 1 required task", status: "in-progress" as StatusType, href: "/onboarding" },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────

const recentActivity = [
  {
    icon: Shield,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    text: "FMCSA alert: HOS violation — T. Patel (D-047) logged 11h 58m on Load L-8815",
    time: "8 min ago",
    status: "critical" as StatusType,
  },
  {
    icon: Truck,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    text: "Load L-8816 requires driver assignment by 3:00 PM — M. Garcia recommended",
    time: "22 min ago",
    status: "overdue" as StatusType,
  },
  {
    icon: MessageSquare,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10",
    text: "Walmart DC-Atlanta: delivery window exception — L-8820 ETA 8:45 PM",
    time: "35 min ago",
    status: "pending" as StatusType,
  },
  {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    text: "K. Johnson (D-028) check-in confirmed — Load L-8819 on track, ETA 5:00 PM",
    time: "1h ago",
    status: "complete" as StatusType,
  },
  {
    icon: UserCheck,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    text: "Sarah Chen (CDL Driver) started Week 1 onboarding — mentor assigned",
    time: "2h ago",
    status: "in-progress" as StatusType,
  },
  {
    icon: Activity,
    iconColor: "text-white/40",
    iconBg: "bg-white/[0.06]",
    text: "Weekly Ops Digest newsletter scheduled — Mon Feb 18, 7:30 AM (34 recipients)",
    time: "3h ago",
    status: "pending" as StatusType,
  },
];

// ─── Compliance Snapshot ──────────────────────────────────────────────────────

const complianceItems = [
  { label: "HOS Compliance",        pct: 94, color: "bg-amber-500", status: "in-progress" as StatusType },
  { label: "Drug Test Clearance",   pct: 88, color: "bg-emerald-500", status: "complete" as StatusType },
  { label: "CDL Verifications",     pct: 100, color: "bg-emerald-500", status: "complete" as StatusType },
  { label: "DOT Inspections",       pct: 76, color: "bg-amber-500", status: "pending" as StatusType },
  { label: "Vehicle Maintenance",   pct: 82, color: "bg-amber-500", status: "in-progress" as StatusType },
];

function ComplianceBar({ label, pct, color, status }: { label: string; pct: number; color: string; status: StatusType }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 400);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white/55">{label}</span>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <span className="text-[12px] font-semibold text-white/70 tabular-nums">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${animated}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function DashboardClient() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="px-8 lg:px-10 pt-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 mb-8 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wide uppercase">Live Operations</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-white">Operations Dashboard</h1>
          <p className="text-[14px] text-white/40 mt-1.5">{dateStr} · {timeStr} — Hemut Logistics OS</p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full">
            <Bell className="w-3.5 h-3.5" />
            3 unread alerts
          </div>
          <Link
            href="/communications"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#080d1a] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-colors"
          >
            Go to Inbox
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard
          label="Active Drivers"
          value={41}
          sub="of 48 total drivers on duty"
          icon={Truck}
          accent="amber"
          trend={{ value: "3 from yesterday", up: true }}
          delay={0}
        />
        <KpiCard
          label="On-Time Delivery"
          value={96}
          suffix="%"
          sub="Target: 95% — above goal"
          icon={TrendingUp}
          accent="emerald"
          trend={{ value: "1.3%", up: true }}
          delay={100}
        />
        <KpiCard
          label="Pending Actions"
          value={5}
          sub="Require attention today"
          icon={AlertTriangle}
          accent="red"
          delay={200}
        />
        <KpiCard
          label="Fleet Utilization"
          value={84}
          suffix="%"
          sub="Target: 88% — 2 trucks idle"
          icon={Activity}
          accent="sky"
          trend={{ value: "2%", up: false }}
          delay={300}
        />
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <KpiCard
          label="Active Loads"
          value={247}
          sub="loads managed this week"
          icon={Package}
          accent="amber"
          delay={400}
        />
        <KpiCard
          label="Revenue This Week"
          value={847200}
          prefix="$"
          sub="at $2.91/mi avg RPM"
          icon={DollarSign}
          accent="emerald"
          delay={500}
        />
        <KpiCard
          label="Compliance Rate"
          value={94}
          suffix="%"
          sub="1 critical HOS violation open"
          icon={Shield}
          accent="sky"
          delay={600}
        />
        <KpiCard
          label="Onboarding Active"
          value={4}
          sub="2 drivers · 1 dispatcher · 1 finance"
          icon={UserCheck}
          accent="amber"
          delay={700}
        />
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pending Actions */}
        <div className="lg:col-span-1 bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-[14px] font-semibold text-white">Pending Actions</span>
            </div>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {pendingActions.length}
            </span>
          </div>
          <div className="px-5 divide-y divide-white/[0.04]">
            {pendingActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-start gap-3 py-3.5 group hover:bg-white/[0.02] -mx-5 px-5 transition-colors"
              >
                <div className="mt-0.5 shrink-0">
                  {action.status === "overdue" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  ) : action.status === "in-progress" ? (
                    <Circle className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white/70 leading-snug group-hover:text-white/85 transition-colors">{action.text}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{action.due}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
          {pendingActions.length === 0 && (
            <div className="px-5 py-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3 opacity-60" />
              <p className="text-[13px] text-white/30">All caught up — no pending actions</p>
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-1 bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[14px] font-semibold text-white">Live Activity</span>
            </div>
            <Link href="/communications" className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-medium">
              View all →
            </Link>
          </div>
          <div className="px-5">
            {recentActivity.map((item, i) => (
              <ActivityItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Compliance Snapshot */}
        <div className="lg:col-span-1 bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-[14px] font-semibold text-white">Compliance Snapshot</span>
            </div>
            <span className="text-[11px] text-white/35 font-medium">Feb 2026</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            {complianceItems.map((item) => (
              <ComplianceBar key={item.label} {...item} />
            ))}
          </div>
          <div className="px-5 pb-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-300/80 leading-relaxed">
                1 open HOS violation requires documentation within 36 hours per FMCSA 49 CFR Part 395.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/communications", label: "Communications", desc: "3 unread · 2 require action", icon: MessageSquare, badge: "3 unread", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
          { href: "/onboarding",     label: "Onboarding",     desc: "4 active · 7 pending tasks",  icon: UserCheck,     badge: "7 tasks",  badgeColor: "bg-white/[0.07] text-white/45 border-white/[0.1]" },
          { href: "/newsletter",     label: "Newsletter",     desc: "1 scheduled · 1 draft",        icon: Mail,         badge: "Scheduled", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
        ].map(({ href, label, desc, icon: Icon, badge, badgeColor }) => (
          <Link
            key={href}
            href={href}
            className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/[0.09] transition-all group flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white/90">{label}</div>
              <div className="text-[12px] text-white/35 mt-0.5">{desc}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
