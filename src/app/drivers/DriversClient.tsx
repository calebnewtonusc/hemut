"use client";
import { useState } from "react";
import {
  Users,
  Zap,
  Search,
  Plus,
  Download,
  AlertTriangle,
  MapPin,
  Phone,
  Shield,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DriverStatus = "Driving" | "On Duty" | "Off Duty" | "HOS Alert" | "Delayed" | "Training" | "Available" | "Sleeper" | "Picked Up";

interface Driver {
  name: string;
  initials: string;
  id: string;
  status: DriverStatus;
  hos: string;
  hosRemaining: number; // 0–100 %
  hosUsed: string;
  load: string | null;
  loadId: string | null;
  location: string;
  cdl: "Class A" | "Class B";
  csaScore: number; // lower = better
  yearsExp: number;
  phone: string;
  ai: string;
  aiColor: string;
  violations: number;
  homeDomicile: string;
  nextReset: string;
}

const ALL_DRIVERS: Driver[] = [
  { name: "J. Martinez", initials: "JM", id: "D-041", status: "Driving", hos: "6h 22m left", hosRemaining: 54, hosUsed: "4h 38m", load: "L-8821", loadId: "L-8821", location: "Springfield, IL", cdl: "Class A", csaScore: 12, yearsExp: 9, phone: "(312) 555-0141", ai: "On track", aiColor: "emerald", violations: 0, homeDomicile: "Chicago, IL", nextReset: "Feb 20" },
  { name: "R. Williams", initials: "RW", id: "D-032", status: "Delayed", hos: "5h 50m left", hosRemaining: 49, hosUsed: "5h 10m", load: "L-8820", loadId: "L-8820", location: "Corinth, MS", cdl: "Class A", csaScore: 28, yearsExp: 6, phone: "(901) 555-0032", ai: "Delay risk", aiColor: "red", violations: 1, homeDomicile: "Memphis, TN", nextReset: "Feb 19" },
  { name: "K. Johnson", initials: "KJ", id: "D-028", status: "Driving", hos: "2h 15m left", hosRemaining: 19, hosUsed: "8h 45m", load: "L-8819", loadId: "L-8819", location: "Casa Grande, AZ", cdl: "Class A", csaScore: 8, yearsExp: 14, phone: "(213) 555-0028", ai: "⚠ Low HOS", aiColor: "amber", violations: 0, homeDomicile: "Los Angeles, CA", nextReset: "Feb 20" },
  { name: "D. Thompson", initials: "DT", id: "D-055", status: "On Duty", hos: "1h 30m left", hosRemaining: 12, hosUsed: "9h 30m", load: "L-8818", loadId: "L-8818", location: "Beaumont, TX", cdl: "Class A", csaScore: 34, yearsExp: 4, phone: "(713) 555-0055", ai: "HOS caution", aiColor: "amber", violations: 2, homeDomicile: "Houston, TX", nextReset: "Feb 19" },
  { name: "T. Patel", initials: "TP", id: "D-047", status: "HOS Alert", hos: "1h 12m left", hosRemaining: 10, hosUsed: "9h 48m", load: "L-8815", loadId: "L-8815", location: "Flagstaff, AZ", cdl: "Class A", csaScore: 19, yearsExp: 7, phone: "(602) 555-0047", ai: "Reassign now", aiColor: "red", violations: 0, homeDomicile: "Phoenix, AZ", nextReset: "Feb 19" },
  { name: "M. Garcia", initials: "MG", id: "D-019", status: "Available", hos: "34h reset", hosRemaining: 100, hosUsed: "Resting", load: null, loadId: null, location: "Salt Lake City, UT", cdl: "Class A", csaScore: 5, yearsExp: 12, phone: "(801) 555-0019", ai: "Ready to dispatch", aiColor: "emerald", violations: 0, homeDomicile: "Denver, CO", nextReset: "Reset done" },
  { name: "A. Rivera", initials: "AR", id: "D-062", status: "Driving", hos: "4h 0m left", hosRemaining: 33, hosUsed: "7h 0m", load: "L-8814", loadId: "L-8814", location: "Knoxville, TN", cdl: "Class A", csaScore: 16, yearsExp: 5, phone: "(615) 555-0062", ai: "On track", aiColor: "emerald", violations: 0, homeDomicile: "Nashville, TN", nextReset: "Feb 20" },
  { name: "B. Chen", initials: "BC", id: "D-037", status: "Driving", hos: "7h 40m left", hosRemaining: 64, hosUsed: "3h 20m", load: "L-8813", loadId: "L-8813", location: "Columbia, MO", cdl: "Class A", csaScore: 11, yearsExp: 8, phone: "(816) 555-0037", ai: "On track", aiColor: "emerald", violations: 0, homeDomicile: "Kansas City, MO", nextReset: "Feb 21" },
  { name: "L. Ortega", initials: "LO", id: "D-071", status: "Driving", hos: "9h 0m left", hosRemaining: 75, hosUsed: "2h 0m", load: "L-8811", loadId: "L-8811", location: "Sioux Falls, SD", cdl: "Class A", csaScore: 22, yearsExp: 3, phone: "(612) 555-0071", ai: "Monitoring", aiColor: "blue", violations: 1, homeDomicile: "Minneapolis, MN", nextReset: "Feb 21" },
  { name: "C. Nguyen", initials: "CN", id: "D-058", status: "Off Duty", hos: "34h reset", hosRemaining: 100, hosUsed: "Resting", load: null, loadId: null, location: "Charlotte, NC", cdl: "Class A", csaScore: 7, yearsExp: 11, phone: "(704) 555-0058", ai: "Available tomorrow", aiColor: "blue", violations: 0, homeDomicile: "Miami, FL", nextReset: "Feb 19 PM" },
  { name: "F. Torres", initials: "FT", id: "D-044", status: "Picked Up", hos: "8h 15m left", hosRemaining: 69, hosUsed: "2h 45m", load: "L-8809", loadId: "L-8809", location: "Providence, RI", cdl: "Class A", csaScore: 18, yearsExp: 6, phone: "(617) 555-0044", ai: "On track", aiColor: "emerald", violations: 0, homeDomicile: "Boston, MA", nextReset: "Feb 21" },
  { name: "P. Washington", initials: "PW", id: "D-026", status: "Delayed", hos: "3h 33m left", hosRemaining: 29, hosUsed: "7h 27m", load: "L-8808", loadId: "L-8808", location: "Reno, NV", cdl: "Class A", csaScore: 31, yearsExp: 7, phone: "(385) 555-0026", ai: "I-80 weather", aiColor: "red", violations: 1, homeDomicile: "Salt Lake City, UT", nextReset: "Feb 19" },
  { name: "S. Kim", initials: "SK", id: "D-083", status: "Driving", hos: "5h 0m left", hosRemaining: 42, hosUsed: "6h 0m", load: "L-8807", loadId: "L-8807", location: "Boise, ID", cdl: "Class A", csaScore: 14, yearsExp: 5, phone: "(503) 555-0083", ai: "On track", aiColor: "emerald", violations: 0, homeDomicile: "Portland, OR", nextReset: "Feb 20" },
  { name: "J. Brown", initials: "JB", id: "D-033", status: "Available", hos: "11h avail.", hosRemaining: 92, hosUsed: "Resting", load: null, loadId: null, location: "Dallas, TX", cdl: "Class A", csaScore: 9, yearsExp: 13, phone: "(214) 555-0033", ai: "Ready to dispatch", aiColor: "emerald", violations: 0, homeDomicile: "Dallas, TX", nextReset: "Ready" },
  { name: "H. Davis", initials: "HD", id: "D-066", status: "On Duty", hos: "6h 30m left", hosRemaining: 54, hosUsed: "4h 30m", load: "L-8803", loadId: "L-8803", location: "Baton Rouge, LA", cdl: "Class A", csaScore: 25, yearsExp: 4, phone: "(504) 555-0066", ai: "Monitoring", aiColor: "blue", violations: 0, homeDomicile: "New Orleans, LA", nextReset: "Feb 21" },
  { name: "W. Mitchell", initials: "WM", id: "D-077", status: "Driving", hos: "2h 30m left", hosRemaining: 21, hosUsed: "8h 30m", load: "L-8802", loadId: "L-8802", location: "Richmond, VA", cdl: "Class A", csaScore: 15, yearsExp: 8, phone: "(704) 555-0077", ai: "Low HOS — ETA tight", aiColor: "amber", violations: 0, homeDomicile: "Charlotte, NC", nextReset: "Feb 19" },
];

const STATUS_TABS = [
  { key: "all", label: "All Drivers" },
  { key: "active", label: "Active" },
  { key: "alert", label: "Alerts" },
  { key: "available", label: "Available" },
  { key: "off", label: "Off Duty" },
];

const STATUS_STYLE: Record<DriverStatus, { badge: string }> = {
  "Driving": { badge: "bg-blue-100 text-blue-700" },
  "On Duty": { badge: "bg-amber-100 text-amber-700" },
  "Off Duty": { badge: "bg-gray-100 text-gray-500" },
  "HOS Alert": { badge: "bg-red-100 text-red-700" },
  "Delayed": { badge: "bg-orange-100 text-orange-700" },
  "Training": { badge: "bg-purple-100 text-purple-700" },
  "Available": { badge: "bg-emerald-100 text-emerald-700" },
  "Sleeper": { badge: "bg-slate-100 text-slate-500" },
  "Picked Up": { badge: "bg-sky-100 text-sky-700" },
} as Record<DriverStatus, { badge: string }>;

const AI_COLOR: Record<string, string> = {
  emerald: "text-emerald-600",
  red: "text-red-600",
  amber: "text-amber-600",
  blue: "text-blue-600",
};

function hosBarColor(pct: number) {
  if (pct < 15) return "bg-red-500";
  if (pct < 35) return "bg-amber-400";
  return "bg-emerald-500";
}

function csaColor(score: number) {
  if (score >= 30) return "text-red-600 bg-red-50";
  if (score >= 20) return "text-amber-600 bg-amber-50";
  return "text-emerald-700 bg-emerald-50";
}

// ─── DriverRow sub-component ────────────────────────────────
interface DriverRowProps {
  driver: Driver;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function DriverRow({ driver, isExpanded, onToggle }: DriverRowProps) {
  const s = STATUS_STYLE[driver.status] ?? { badge: "bg-gray-100 text-gray-500" };
  const aiClass = AI_COLOR[driver.aiColor] ?? "text-gray-500";
  const isAlert = driver.status === "HOS Alert";
  const isLowHos = driver.hosRemaining < 20;

  return (
    <div key={driver.id}>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "grid grid-cols-[200px_100px_1fr_140px_120px_100px_100px] gap-3 items-center px-5 py-3 hover:bg-gray-50/80 transition-colors cursor-pointer group",
          isAlert && "bg-red-50/25",
          isLowHos && !isAlert && "bg-amber-50/15"
        )}
        onClick={() => onToggle(driver.id)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(driver.id); } }}
      >
        <div className="flex items-center gap-2.5">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs", isAlert ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>
            {driver.initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-800 truncate">{driver.name}</div>
            <div className="text-[10px] text-gray-400 font-mono">{driver.id} · {driver.cdl}</div>
          </div>
        </div>
        <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-bold w-fit ${s.badge}`}>{driver.status}</span>
        <div className="pr-4">
          <div className="flex items-center justify-between mb-1">
            <span className={cn("text-[11px] font-semibold", isAlert || isLowHos ? "text-red-600" : "text-gray-700")}>{driver.hos}</span>
            {(driver.status === "Off Duty" || driver.status === "Available" || driver.status === "Sleeper") ? (
              <span className="text-[9px] text-emerald-600 font-bold">RESET</span>
            ) : (
              <span className="text-[9px] text-gray-400">{driver.hosRemaining}%</span>
            )}
          </div>
          {driver.status !== "Off Duty" && driver.status !== "Available" && driver.status !== "Sleeper" ? (
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${hosBarColor(driver.hosRemaining)}`} style={{ width: `${driver.hosRemaining}%` }} />
            </div>
          ) : (
            <div className="h-1.5 bg-emerald-200 rounded-full" />
          )}
        </div>
        <div>
          {driver.load ? (
            <div>
              <span className="text-[11px] font-black text-amber-600 font-mono">{driver.load}</span>
              <div className="text-[9px] text-gray-400 mt-0.5">Active load</div>
            </div>
          ) : (
            <span className="text-[11px] text-gray-400 font-medium">No load</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
          <span className="text-[11px] text-gray-600 truncate">{driver.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-gray-300 shrink-0" />
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md ${csaColor(driver.csaScore)}`}>{driver.csaScore}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className={`w-3 h-3 ${aiClass} shrink-0`} />
          <span className={`text-[10px] font-bold ${aiClass} truncate`}>{driver.ai}</span>
          <ChevronRight className={cn("w-3 h-3 text-gray-300 ml-auto shrink-0 transition-transform", isExpanded && "rotate-90")} />
        </div>
      </div>
      {isExpanded && (
        <div className="px-5 pb-4 pt-2 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-4 gap-5 ml-[53px]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Driver Details</p>
              <div className="space-y-1.5 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-300" />{driver.phone}</div>
                <div><span className="text-gray-400">Home Domicile:</span> {driver.homeDomicile}</div>
                <div><span className="text-gray-400">Experience:</span> {driver.yearsExp} years</div>
                <div><span className="text-gray-400">CDL Type:</span> {driver.cdl}</div>
                <div><span className="text-gray-400">Violations (12mo):</span> <span className={driver.violations > 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>{driver.violations}</span></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">HOS Status</p>
              <div className="space-y-1.5 text-[11px] text-gray-600">
                <div><span className="text-gray-400">Remaining:</span> <span className={isLowHos ? "text-red-600 font-bold" : "font-semibold"}>{driver.hos}</span></div>
                <div><span className="text-gray-400">Used today:</span> {driver.hosUsed}</div>
                <div><span className="text-gray-400">Next 34h reset:</span> {driver.nextReset}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-300" />
                  <span className="text-[10px] text-gray-400">11-hour rule applies</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">CSA Breakdown</p>
              <div className="space-y-1.5">
                {[
                  { category: "Unsafe Driving", score: Math.floor(driver.csaScore * 0.4) },
                  { category: "HOS Compliance", score: Math.floor(driver.csaScore * 0.35) },
                  { category: "Vehicle Maint.", score: Math.floor(driver.csaScore * 0.25) },
                ].map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">{cat.category}</span>
                    <span className={`font-bold ${cat.score >= 10 ? "text-red-600" : "text-emerald-600"}`}>{cat.score}</span>
                  </div>
                ))}
                <div className="text-[10px] text-gray-400 mt-1">FMCSA threshold: 65</div>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">AI Recommendation</p>
              <div className={cn(
                "rounded-lg p-3 text-[11px] leading-relaxed",
                driver.aiColor === "red" ? "bg-red-50 text-red-800 border border-red-100" :
                driver.aiColor === "amber" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                "bg-emerald-50 text-emerald-800 border border-emerald-100"
              )}>
                <div className="flex items-center gap-1 mb-1.5">
                  <Zap className="w-3 h-3" />
                  <span className="font-bold text-[10px] uppercase tracking-wide">Hemut AI</span>
                </div>
                {driver.aiColor === "red" && driver.status === "HOS Alert"
                  ? `${driver.name} has ${driver.hos} remaining near ${driver.location}. Reassign load ${driver.load} immediately or schedule 10-hour break before continuing. Proactive action prevents FMCSA violation.`
                  : driver.aiColor === "amber"
                  ? `${driver.name} is approaching HOS limit. Monitor closely — recommend scheduling 30-min break within next hour to protect delivery window.`
                  : `${driver.name} is performing well. No action required. Next optimal dispatch window based on reset: ${driver.nextReset}.`
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FleetAIPanel sub-component ─────────────────────────────
const FLEET_AI_INSIGHTS = [
  { id: "hos-limits", impact: "High", text: "3 drivers (D-047, D-055, D-077) hitting HOS limits within the next 2 hours. Pre-position D-019 (M. Garcia, reset complete) near I-40 corridor to absorb reassignments." },
  { id: "csa-trending", impact: "Medium", text: "D-032 (R. Williams) CSA score of 28 — trending up. Recommend targeted coaching on following distance. Score above 35 triggers FMCSA scrutiny." },
  { id: "missed-checkins", impact: "Medium", text: "2 drivers with missed check-ins this month (D-026, D-071). Proactive outreach historically reduces churn by 40%. Automated check-in message queued." },
];

function FleetAIPanel() {
  return (
    <div className="bg-[#080d1a] rounded-2xl p-5 border border-white/[0.05]">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <span className="font-bold text-white text-sm">Hemut AI · Fleet Intelligence</span>
          <p className="text-[11px] text-white/35 font-medium">HOS analysis · CSA trends · Driver retention signals</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {FLEET_AI_INSIGHTS.map((ins) => (
          <div key={ins.id} className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.07] hover:bg-white/[0.07] transition-colors cursor-pointer group">
            <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${ins.impact === "High" ? "text-amber-400" : "text-sky-400"}`}>
              {ins.impact} Impact
            </div>
            <p className="text-xs text-white/65 leading-relaxed">{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────
export function DriversClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleToggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const filtered = ALL_DRIVERS.filter((d) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "active" && ["Driving", "On Duty", "Delayed", "HOS Alert"].includes(d.status)) ||
      (activeTab === "alert" && ["HOS Alert", "Delayed"].includes(d.status)) ||
      (activeTab === "available" && ["Available"].includes(d.status)) ||
      (activeTab === "off" && ["Off Duty", "Sleeper"].includes(d.status));
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      (d.load?.toLowerCase().includes(q) ?? false);
    return matchTab && matchSearch;
  });

  const alertCount = ALL_DRIVERS.filter((d) => d.status === "HOS Alert" || d.status === "Delayed").length;
  const availableCount = ALL_DRIVERS.filter((d) => d.status === "Available").length;
  const drivingCount = ALL_DRIVERS.filter((d) => d.status === "Driving" || d.status === "On Duty").length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900 leading-tight">Drivers</h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">{ALL_DRIVERS.length} drivers · {drivingCount} active · {availableCount} available · {alertCount} alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              {alertCount} HOS alerts
            </div>
          )}
          <button type="button" className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button type="button" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-amber-500/20">
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Driving / On Duty", value: drivingCount, color: "border-l-blue-500", sub: "of 58 total drivers" },
          { label: "Available", value: availableCount, color: "border-l-emerald-500", sub: "reset complete" },
          { label: "HOS / Delay Alerts", value: alertCount, color: "border-l-red-500", sub: "action required" },
          { label: "Avg CSA Score", value: "16.8", color: "border-l-purple-500", sub: "fleet benchmark" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.color} px-4 py-3 shadow-sm`}>
            <div className="text-[24px] font-black text-gray-900 leading-none">{s.value}</div>
            <div className="text-[11px] font-semibold text-gray-600 mt-1">{s.label}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === tab.key ? "bg-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drivers, locations, loads…"
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-colors"
          />
        </div>
        <div className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} of {ALL_DRIVERS.length} drivers</div>
      </div>

      {/* Driver Roster */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[200px_100px_1fr_140px_120px_100px_100px] gap-3 px-5 py-2.5 bg-gray-50/70 border-b border-gray-100">
          {["Driver", "Status", "HOS Clock", "Current Load", "Location", "CSA Score", "Hemut AI"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{h}</span>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400 font-medium">No drivers match your filters.</div>
        )}
        <div className="divide-y divide-gray-50">
          {filtered.map((driver) => (
            <DriverRow
              key={driver.id}
              driver={driver}
              isExpanded={expanded === driver.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>

      <FleetAIPanel />
    </div>
  );
}
