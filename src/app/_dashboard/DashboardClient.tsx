"use client";

import { useState, useReducer, useCallback } from "react";
import {
  Package,
  Users,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
  Zap,
  ArrowRight,
  Truck,
  MapPin,
} from "lucide-react";
import { useInterval } from "@/hooks/useInterval";
import { DispatchLoadModal } from "@/components/modals/DispatchLoadModal";
import { AssignDriverModal } from "@/components/modals/AssignDriverModal";
import { AlertActionModal } from "@/components/modals/AlertActionModal";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { LoadsTable } from "@/components/dashboard/LoadsTable";
import { DriversPanel } from "@/components/dashboard/DriversPanel";

// ─── Types ──────────────────────────────────────────────────
type LoadStatus = "In Transit" | "Delayed" | "Picked Up" | "Delivered" | "Unassigned" | "HOS Alert";
type DriverStatus = "Driving" | "On Duty" | "Off Duty" | "HOS Alert" | "Delayed" | "Training" | "Available";
type AlertSev = "critical" | "high" | "medium";

// ─── Map data ───────────────────────────────────────────────
// viewBox 800×240  |  x=(125−lon)/58×760+20  |  y=(49−lat)/24×200+20
const BG_CITIES = [
  { name: "Seattle", x: 55, y: 32 },
  { name: "Portland", x: 50, y: 49 },
  { name: "San Francisco", x: 54, y: 113 },
  { name: "Las Vegas", x: 150, y: 127 },
  { name: "Salt Lake City", x: 192, y: 88, abbr: "SLC" },
  { name: "Denver", x: 283, y: 98 },
  { name: "Minneapolis", x: 436, y: 54 },
  { name: "Kansas City", x: 419, y: 103 },
  { name: "Dallas", x: 390, y: 155 },
  { name: "Houston", x: 408, y: 180 },
  { name: "New Orleans", x: 477, y: 178, abbr: "NOLA" },
  { name: "Nashville", x: 520, y: 127 },
  { name: "Indianapolis", x: 530, y: 97 },
  { name: "Detroit", x: 570, y: 76 },
  { name: "Charlotte", x: 599, y: 135 },
  { name: "Washington DC", x: 649, y: 104, abbr: "D.C." },
  { name: "New York", x: 688, y: 89, abbr: "NYC" },
  { name: "Boston", x: 726, y: 75 },
  { name: "Miami", x: 607, y: 213 },
];

// Static route definitions — tx/ty are computed dynamically from routeProgress
const MAP_ROUTES = [
  {
    id: "L-8821", label: "D-041",
    x1: 510, y1: 79, x2: 390, y2: 155,
    tx: 424, ty: 134,
    status: "transit" as const,
    origin: "Chicago", dest: "Dallas",
  },
  {
    id: "L-8820", label: "D-032",
    x1: 479, y1: 136, x2: 552, y2: 148,
    tx: 512, ty: 141,
    status: "delayed" as const,
    origin: "Memphis", dest: "Atlanta",
  },
  {
    id: "L-8819", label: "D-028",
    x1: 109, y1: 144, x2: 189, y2: 150,
    tx: 179, ty: 149,
    status: "transit" as const,
    origin: "Los Angeles", dest: "Phoenix",
  },
  {
    id: "L-8818", label: "D-055",
    x1: 408, y1: 180, x2: 477, y2: 178,
    tx: 418, ty: 180,
    status: "pickup" as const,
    origin: "Houston", dest: "NOLA",
  },
  {
    id: "L-8817", label: null,
    x1: 283, y1: 98, x2: 192, y2: 88,
    tx: 192, ty: 88,
    status: "delivered" as const,
    origin: "Denver", dest: "SLC",
  },
  {
    id: "L-8816", label: null,
    x1: 55, y1: 32, x2: 50, y2: 49,
    tx: 55, ty: 32,
    status: "unassigned" as const,
    origin: "Seattle", dest: "Portland",
  },
  {
    id: "L-8815", label: "D-047",
    x1: 196, y1: 135, x2: 150, y2: 127,
    tx: 166, ty: 130,
    status: "hos" as const,
    origin: "Flagstaff", dest: "Las Vegas",
  },
];

const ROUTE_COLORS = {
  transit: { stroke: "#3b82f6", ring: "#bfdbfe", label: "#1d4ed8" },
  delayed: { stroke: "#ef4444", ring: "#fecaca", label: "#b91c1c" },
  pickup: { stroke: "#f59e0b", ring: "#fde68a", label: "#b45309" },
  delivered: { stroke: "#10b981", ring: "#a7f3d0", label: "#065f46" },
  unassigned: { stroke: "#94a3b8", ring: "#e2e8f0", label: "#64748b" },
  hos: { stroke: "#ef4444", ring: "#fecaca", label: "#b91c1c" },
};

// ─── Loads ──────────────────────────────────────────────────
interface Load {
  id: string; origin: string; dest: string; driver: string;
  status: LoadStatus; progress: number; eta: string; rpm: string; miles: number; urgent: boolean;
  ai?: string; aiColor?: string;
}

const loads: Load[] = [
  { id: "L-8821", origin: "Chicago, IL", dest: "Dallas, TX", driver: "J. Martinez", status: "In Transit", progress: 72, eta: "Feb 19, 2:30 PM", rpm: "$2.84", miles: 920, urgent: false, ai: "On track", aiColor: "text-emerald-600" },
  { id: "L-8820", origin: "Memphis, TN", dest: "Atlanta, GA", driver: "R. Williams", status: "Delayed", progress: 45, eta: "Feb 18, 8:00 PM", rpm: "$3.10", miles: 382, urgent: true, ai: "Window closing", aiColor: "text-red-600" },
  { id: "L-8819", origin: "Los Angeles, CA", dest: "Phoenix, AZ", driver: "K. Johnson", status: "In Transit", progress: 88, eta: "Feb 18, 5:15 PM", rpm: "$2.95", miles: 372, urgent: false, ai: "On track", aiColor: "text-emerald-600" },
  { id: "L-8818", origin: "Houston, TX", dest: "New Orleans, LA", driver: "D. Thompson", status: "Picked Up", progress: 15, eta: "Feb 18, 11:45 PM", rpm: "$2.70", miles: 348, urgent: false, ai: "Monitoring", aiColor: "text-blue-600" },
  { id: "L-8817", origin: "Denver, CO", dest: "Salt Lake City, UT", driver: "M. Garcia", status: "Delivered", progress: 100, eta: "Delivered 10:22 AM", rpm: "$3.05", miles: 525, urgent: false },
  { id: "L-8816", origin: "Seattle, WA", dest: "Portland, OR", driver: "Unassigned", status: "Unassigned", progress: 0, eta: "Pickup: 3:00 PM today", rpm: "$3.20", miles: 174, urgent: true, ai: "Assign Garcia", aiColor: "text-amber-600" },
];

// ─── Drivers ────────────────────────────────────────────────
interface Driver {
  name: string; initials: string; id: string;
  status: DriverStatus; hos: string; hosPercent: number; load: string; ai?: string;
}

const drivers: Driver[] = [
  { name: "J. Martinez", initials: "JM", id: "D-041", status: "Driving", hos: "6h 22m", hosPercent: 54, load: "L-8821" },
  { name: "R. Williams", initials: "RW", id: "D-032", status: "Delayed", hos: "4h 10m", hosPercent: 35, load: "L-8820", ai: "Delay risk" },
  { name: "K. Johnson", initials: "KJ", id: "D-028", status: "Driving", hos: "8h 45m", hosPercent: 73, load: "L-8819" },
  { name: "D. Thompson", initials: "DT", id: "D-055", status: "On Duty", hos: "9h 30m", hosPercent: 79, load: "L-8818" },
  { name: "T. Patel", initials: "TP", id: "D-047", status: "HOS Alert", hos: "1h 12m", hosPercent: 10, load: "L-8815", ai: "Reassign now" },
  { name: "M. Garcia", initials: "MG", id: "D-019", status: "Off Duty", hos: "Reset", hosPercent: 100, load: "—", ai: "Available" },
];

// ─── Alerts ─────────────────────────────────────────────────
const alerts: { severity: AlertSev; title: string; msg: string; action: string; time: string }[] = [
  { severity: "critical", title: "HOS Limit Imminent", msg: "T. Patel (D-047) — 1h 12m left near Flagstaff, AZ · Load L-8815", action: "Reassign Load", time: "now" },
  { severity: "high", title: "Delivery Window Closing", msg: "L-8820 +2h 40min late — Walmart DC-Atlanta pickup window at 9:00 PM", action: "Notify Customer", time: "12m" },
  { severity: "medium", title: "Maintenance Overdue", msg: "Truck T-031 — 15,246 mi since last PM (limit 15,000 mi)", action: "Schedule", time: "1h" },
];

// KPI strip data
const KPI_ITEMS = [
  { label: "Active Loads", value: "247", sub: "41 in transit · 12 pending", icon: Package, left: "border-l-blue-500", trend: "+12%", up: true },
  { label: "Drivers On Duty", value: "41/58", sub: "1 HOS alert · 3 delayed", icon: Users, left: "border-l-amber-500", alert: true },
  { label: "Fleet Utilization", value: "84%", sub: "14 trucks available", icon: Truck, left: "border-l-emerald-500", trend: "+3.2%", up: true },
  { label: "Revenue MTD", value: "$1.24M", sub: "89% of $1.40M target", icon: DollarSign, left: "border-l-purple-500", trend: "+8.5%", up: true, progress: 89 },
  { label: "On-Time Delivery", value: "96.3%", sub: "9 late this month", icon: CheckCircle2, left: "border-l-sky-500", trend: "+1.8%", up: true },
];

// Map legend data
const MAP_LEGEND = [
  { color: "bg-blue-500", label: "In Transit" },
  { color: "bg-red-500", label: "Delayed / HOS Alert" },
  { color: "bg-amber-400", label: "Picked Up" },
  { color: "bg-emerald-500", label: "Delivered" },
  { color: "bg-gray-300", label: "Unassigned" },
];

// AI Insights
const AI_INSIGHTS = [
  { impact: "High", text: "I-40 corridor optimization on 3 recurring lanes — projected $8,200/wk savings. Suggest route update for next 6 dispatches.", action: "View plan" },
  { impact: "Medium", text: "Driver retention signal: 3 drivers with 2+ missed check-ins this month. Proactive outreach reduces churn by 40% historically.", action: "View drivers" },
  { impact: "High", text: "7 invoices aging 30+ days totaling $84,200. Auto-follow-up sequence queued — approve to run tomorrow at 8:00 AM.", action: "Approve" },
];

// ─── Modal reducer ──────────────────────────────────────────
interface ModalState {
  dispatchOpen: boolean;
  assignOpen: boolean;
  assignLoadId: string | undefined;
  alertOpen: boolean;
  activeAlert: typeof alerts[number] | undefined;
}

type ModalAction =
  | { type: "OPEN_DISPATCH" }
  | { type: "CLOSE_DISPATCH" }
  | { type: "OPEN_ASSIGN"; loadId: string }
  | { type: "CLOSE_ASSIGN" }
  | { type: "OPEN_ALERT"; alert: typeof alerts[number] }
  | { type: "CLOSE_ALERT" };

const modalInitial: ModalState = {
  dispatchOpen: false,
  assignOpen: false,
  assignLoadId: undefined,
  alertOpen: false,
  activeAlert: undefined,
};

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "OPEN_DISPATCH":  return { ...state, dispatchOpen: true };
    case "CLOSE_DISPATCH": return { ...state, dispatchOpen: false };
    case "OPEN_ASSIGN":    return { ...state, assignOpen: true, assignLoadId: action.loadId };
    case "CLOSE_ASSIGN":   return { ...state, assignOpen: false };
    case "OPEN_ALERT":     return { ...state, alertOpen: true, activeAlert: action.alert };
    case "CLOSE_ALERT":    return { ...state, alertOpen: false };
    default:               return state;
  }
}

// ─── Page ───────────────────────────────────────────────────
export default function DashboardClient() {
  // Live progress state — keyed by load ID
  const [routeProgress, setRouteProgress] = useState<Record<string, number>>({
    "L-8821": 72,
    "L-8820": 45, // delayed — won't increment
    "L-8819": 88,
    "L-8818": 15,
    "L-8817": 100, // delivered
    "L-8816": 0,   // unassigned
    "L-8815": 65,  // HOS alert — won't increment
  });

  const [lastUpdated, setLastUpdated] = useState(0);

  // Modal state
  const [modals, dispatchModal] = useReducer(modalReducer, modalInitial);
  const { dispatchOpen, assignOpen, assignLoadId, alertOpen, activeAlert } = modals;

  // Statuses that should NOT increment
  const frozenStatuses: LoadStatus[] = ["Delivered", "Unassigned", "Delayed", "HOS Alert"];

  // Every 9 seconds: advance active loads by 0.5–1.5%, reset "last updated" counter
  const tickProgress = useCallback(() => {
    setRouteProgress((prev) => {
      const next = { ...prev };
      for (const load of loads) {
        if (frozenStatuses.includes(load.status)) continue;
        const increment = 0.5 + Math.random(); // 0.5–1.5
        next[load.id] = Math.min((next[load.id] ?? 0) + increment, 100);
      }
      return next;
    });
    setLastUpdated(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useInterval(tickProgress, 9000);

  // Every 1 second: increment the "last updated" display counter
  const tickClock = useCallback(() => {
    setLastUpdated((s) => s + 1);
  }, []);

  useInterval(tickClock, 1000);

  // Derive live map routes from current progress state
  const liveMapRoutes = MAP_ROUTES.map((r) => {
    const p = routeProgress[r.id] ?? 0;
    return {
      ...r,
      tx: Math.round(r.x1 + (r.x2 - r.x1) * (p / 100)),
      ty: Math.round(r.y1 + (r.y2 - r.y1) * (p / 100)),
      progress: p,
    };
  });

  const handleAssignLoad = useCallback((loadId: string) => {
    dispatchModal({ type: "OPEN_ASSIGN", loadId });
  }, []);

  const handleAlertAction = useCallback((alert: typeof alerts[number]) => {
    dispatchModal({ type: "OPEN_ALERT", alert });
  }, []);

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900 leading-tight">Operations Command</h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">Tue, February 18, 2026 · 9:41 AM CT</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" />
            2 critical alerts
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Live
          </div>
          <button
            type="button"
            onClick={() => dispatchModal({ type: "OPEN_DISPATCH" })}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-amber-500/20"
          >
            <Package className="w-4 h-4" />
            Dispatch Load
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-3">
        {KPI_ITEMS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${k.left} p-4 shadow-sm`}>
              <div className="flex items-start justify-between mb-2">
                <Icon className="w-4 h-4 text-gray-400" />
                {k.trend && (
                  <span className={`flex items-center gap-0.5 text-[10px] font-bold ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                    <ArrowUpRight className="w-2.5 h-2.5" />{k.trend}
                  </span>
                )}
                {k.alert && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Alert</span>
                )}
              </div>
              <div className="text-[26px] font-black text-gray-900 leading-none tracking-tight">{k.value}</div>
              <div className="text-[11px] text-gray-400 mt-1 font-medium">{k.sub}</div>
              {k.progress && (
                <div className="mt-2.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${k.progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fleet Map */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900 text-sm">Live Fleet Map</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold ml-1">
              {lastUpdated === 0 ? "JUST NOW" : `${lastUpdated}s ago`}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">
            {MAP_LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-[#f8fafc] px-4 py-3">
          <svg viewBox="0 0 800 240" className="w-full" style={{ height: "260px" }}>
            {/* Dot grid */}
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="14" r="0.9" fill="#dde3ea" />
              </pattern>
            </defs>
            <rect width="800" height="240" fill="#f8fafc" />
            <rect width="800" height="240" fill="url(#dots)" />

            {/* Route lines — full dashed gray first */}
            {liveMapRoutes.map((r) => (
              <line
                key={`bg-${r.id}`}
                x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                stroke="#dde3ea" strokeWidth="1.5" strokeDasharray="5,3"
              />
            ))}

            {/* Completed portions */}
            {liveMapRoutes.filter((r) => r.status !== "unassigned").map((r) => {
              const c = ROUTE_COLORS[r.status];
              return (
                <line
                  key={`progress-${r.id}`}
                  x1={r.x1} y1={r.y1} x2={r.tx} y2={r.ty}
                  stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round"
                />
              );
            })}

            {/* Origin/destination city dots */}
            {liveMapRoutes.map((r) => {
              const c = ROUTE_COLORS[r.status];
              return (
                <g key={`cities-${r.id}`}>
                  <circle cx={r.x1} cy={r.y1} r="3.5" fill={c.stroke} opacity="0.5" />
                  <circle cx={r.x2} cy={r.y2} r="3.5" fill={c.stroke} opacity="0.8" />
                </g>
              );
            })}

            {/* Background city dots for geographic context */}
            {BG_CITIES.map((c) => {
              const isRouteCity = liveMapRoutes.some(
                (r) => r.origin === c.name || r.dest === c.name || c.name === "Chicago"
              );
              if (isRouteCity) return null;
              return (
                <g key={c.name}>
                  <circle cx={c.x} cy={c.y} r="2" fill="#b0bcc8" />
                  <text x={c.x + 4} y={c.y + 4} fontSize="7.5" fill="#94a3b8" fontFamily="system-ui, sans-serif">
                    {c.abbr || c.name}
                  </text>
                </g>
              );
            })}

            {/* Chicago label (route city) */}
            <text x="514" y="75" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Chicago</text>
            <text x="393" y="151" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Dallas</text>
            <text x="481" y="131" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Memphis</text>
            <text x="554" y="144" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Atlanta</text>
            <text x="70" y="140" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">L.A.</text>
            <text x="190" y="147" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Phoenix</text>
            <text x="410" y="176" fontSize="7.5" fill="#64748b" fontFamily="system-ui, sans-serif">Houston</text>

            {/* Truck position markers */}
            {liveMapRoutes.filter((r) => r.label).map((r) => {
              const c = ROUTE_COLORS[r.status];
              return (
                <g key={`truck-${r.id}`}>
                  <circle cx={r.tx} cy={r.ty} r="9" fill={c.ring} opacity="0.7" />
                  <circle cx={r.tx} cy={r.ty} r="5" fill={c.stroke} />
                  <text
                    x={r.tx + 8} y={r.ty - 6}
                    fontSize="8.5" fontFamily="ui-monospace, monospace" fontWeight="700"
                    fill={c.label}
                  >
                    {r.label}
                  </text>
                  <text
                    x={r.tx + 8} y={r.ty + 5}
                    fontSize="7" fontFamily="system-ui, sans-serif"
                    fill={c.label} opacity="0.7"
                  >
                    {r.id}
                  </text>
                </g>
              );
            })}

            {/* Delivered check at SLC */}
            <text x="178" y="85" fontSize="8" fill="#059669" fontFamily="system-ui, sans-serif" fontWeight="700">
              ✓ L-8817
            </text>

            {/* Unassigned marker at Seattle */}
            <circle cx={55} cy={32} r="5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x={60} y={28} fontSize="7.5" fill="#94a3b8" fontFamily="system-ui, sans-serif">L-8816 unassigned</text>
          </svg>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">

        {/* Load Pipeline */}
        <LoadsTable
          loads={loads}
          routeProgress={routeProgress}
          onAssignLoad={handleAssignLoad}
        />

        {/* Right Panel */}
        <div className="col-span-1 space-y-4">
          <AlertsPanel alerts={alerts} onAlertAction={handleAlertAction} />
          <DriversPanel drivers={drivers} />
        </div>
      </div>

      {/* AI Ops Intelligence */}
      <div className="bg-[#080d1a] rounded-2xl p-5 border border-white/[0.05]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">Hemut AI · Ops Intelligence</span>
            <p className="text-[11px] text-white/35 font-medium">Running continuously · last updated 42s ago</p>
          </div>
          <span className="ml-auto text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">3 insights</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {AI_INSIGHTS.map((ins) => (
            <div key={ins.text.slice(0, 40)} className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.07] hover:bg-white/[0.07] transition-colors cursor-pointer group">
              <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${ins.impact === "High" ? "text-amber-400" : "text-sky-400"}`}>
                {ins.impact} Impact
              </div>
              <p className="text-xs text-white/65 leading-relaxed mb-3">{ins.text}</p>
              <span className="text-[10px] font-bold text-white/30 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                {ins.action} <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <DispatchLoadModal open={dispatchOpen} onClose={() => dispatchModal({ type: "CLOSE_DISPATCH" })} />
      <AssignDriverModal open={assignOpen} onClose={() => dispatchModal({ type: "CLOSE_ASSIGN" })} loadId={assignLoadId} />
      <AlertActionModal open={alertOpen} onClose={() => dispatchModal({ type: "CLOSE_ALERT" })} alert={activeAlert} />
    </div>
  );
}
