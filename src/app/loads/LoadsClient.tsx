"use client";
import { useState } from "react";
import {
  Package,
  ArrowRight,
  Clock,
  Zap,
  Filter,
  Search,
  ChevronRight,
  AlertTriangle,
  Download,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LoadStatus = "In Transit" | "Delayed" | "Picked Up" | "Delivered" | "Unassigned" | "HOS Alert";

interface Load {
  id: string;
  origin: string;
  dest: string;
  driver: string;
  driverId: string | null;
  status: LoadStatus;
  progress: number;
  eta: string;
  rpm: string;
  miles: number;
  weight: string;
  commodity: string;
  customer: string;
  urgent: boolean;
  ai: string;
  aiColor: string;
  postedAt: string;
}

const ALL_LOADS: Load[] = [
  { id: "L-8821", origin: "Chicago, IL", dest: "Dallas, TX", driver: "J. Martinez", driverId: "D-041", status: "In Transit", progress: 72, eta: "Feb 19, 2:30 PM", rpm: "$2.84", miles: 920, weight: "42,000 lbs", commodity: "Auto Parts", customer: "AutoNation Group", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "2d ago" },
  { id: "L-8820", origin: "Memphis, TN", dest: "Atlanta, GA", driver: "R. Williams", driverId: "D-032", status: "Delayed", progress: 45, eta: "Feb 18, 8:00 PM", rpm: "$3.10", miles: 382, weight: "36,500 lbs", commodity: "Retail Goods", customer: "Walmart Distribution", urgent: true, ai: "Window closing", aiColor: "red", postedAt: "1d ago" },
  { id: "L-8819", origin: "Los Angeles, CA", dest: "Phoenix, AZ", driver: "K. Johnson", driverId: "D-028", status: "In Transit", progress: 88, eta: "Feb 18, 5:15 PM", rpm: "$2.95", miles: 372, weight: "28,000 lbs", commodity: "Electronics", customer: "Best Buy Logistics", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "1d ago" },
  { id: "L-8818", origin: "Houston, TX", dest: "New Orleans, LA", driver: "D. Thompson", driverId: "D-055", status: "Picked Up", progress: 15, eta: "Feb 18, 11:45 PM", rpm: "$2.70", miles: 348, weight: "44,000 lbs", commodity: "Industrial Equip.", customer: "Chevron Supply", urgent: false, ai: "Monitoring", aiColor: "blue", postedAt: "8h ago" },
  { id: "L-8817", origin: "Denver, CO", dest: "Salt Lake City, UT", driver: "M. Garcia", driverId: "D-019", status: "Delivered", progress: 100, eta: "Delivered 10:22 AM", rpm: "$3.05", miles: 525, weight: "31,200 lbs", commodity: "Food & Bev.", customer: "Sysco Foods", urgent: false, ai: "Completed", aiColor: "emerald", postedAt: "3d ago" },
  { id: "L-8816", origin: "Seattle, WA", dest: "Portland, OR", driver: "Unassigned", driverId: null, status: "Unassigned", progress: 0, eta: "Pickup: 3:00 PM today", rpm: "$3.20", miles: 174, weight: "18,000 lbs", commodity: "Lumber", customer: "Home Depot DC", urgent: true, ai: "Assign Garcia", aiColor: "amber", postedAt: "4h ago" },
  { id: "L-8815", origin: "Flagstaff, AZ", dest: "Las Vegas, NV", driver: "T. Patel", driverId: "D-047", status: "HOS Alert", progress: 65, eta: "Feb 18, 7:00 PM", rpm: "$2.60", miles: 258, weight: "22,500 lbs", commodity: "Perishables", customer: "Whole Foods", urgent: true, ai: "Reassign now", aiColor: "red", postedAt: "1d ago" },
  { id: "L-8814", origin: "Nashville, TN", dest: "Charlotte, NC", driver: "A. Rivera", driverId: "D-062", status: "In Transit", progress: 58, eta: "Feb 18, 6:00 PM", rpm: "$2.88", miles: 410, weight: "39,000 lbs", commodity: "Appliances", customer: "Lowe's Corp.", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "1d ago" },
  { id: "L-8813", origin: "Kansas City, MO", dest: "Indianapolis, IN", driver: "B. Chen", driverId: "D-037", status: "In Transit", progress: 34, eta: "Feb 18, 9:30 PM", rpm: "$3.15", miles: 488, weight: "40,200 lbs", commodity: "Automotive", customer: "Ford Motor Logistics", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "14h ago" },
  { id: "L-8812", origin: "Detroit, MI", dest: "New York, NY", driver: "Unassigned", driverId: null, status: "Unassigned", progress: 0, eta: "Pickup: Feb 19, 6:00 AM", rpm: "$3.45", miles: 614, weight: "26,800 lbs", commodity: "Pharma", customer: "McKesson Corp.", urgent: false, ai: "High RPM avail.", aiColor: "amber", postedAt: "2h ago" },
  { id: "L-8811", origin: "Minneapolis, MN", dest: "Denver, CO", driver: "L. Ortega", driverId: "D-071", status: "In Transit", progress: 21, eta: "Feb 19, 4:00 PM", rpm: "$2.78", miles: 911, weight: "44,000 lbs", commodity: "Construction", customer: "D.R. Horton", urgent: false, ai: "Monitoring", aiColor: "blue", postedAt: "6h ago" },
  { id: "L-8810", origin: "Miami, FL", dest: "Charlotte, NC", driver: "C. Nguyen", driverId: "D-058", status: "Delivered", progress: 100, eta: "Delivered 2:14 PM", rpm: "$2.91", miles: 758, weight: "33,500 lbs", commodity: "Textiles", customer: "Target Corp.", urgent: false, ai: "Completed", aiColor: "emerald", postedAt: "2d ago" },
  { id: "L-8809", origin: "Boston, MA", dest: "Washington, DC", driver: "F. Torres", driverId: "D-044", status: "Picked Up", progress: 8, eta: "Feb 18, 10:45 PM", rpm: "$3.30", miles: 446, weight: "29,100 lbs", commodity: "Tech Hardware", customer: "Amazon Logistics", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "3h ago" },
  { id: "L-8808", origin: "Salt Lake City, UT", dest: "San Francisco, CA", driver: "P. Washington", driverId: "D-026", status: "Delayed", progress: 67, eta: "Feb 18, 11:00 PM", rpm: "$2.65", miles: 752, weight: "37,800 lbs", commodity: "Retail Goods", customer: "Gap Inc.", urgent: true, ai: "Weather delay I-80", aiColor: "red", postedAt: "2d ago" },
  { id: "L-8807", origin: "Portland, OR", dest: "Salt Lake City, UT", driver: "S. Kim", driverId: "D-083", status: "In Transit", progress: 52, eta: "Feb 19, 8:00 AM", rpm: "$2.82", miles: 836, weight: "41,600 lbs", commodity: "Packaged Goods", customer: "Kroger Dist.", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "1d ago" },
  { id: "L-8806", origin: "Dallas, TX", dest: "Houston, TX", driver: "J. Brown", driverId: "D-033", status: "Delivered", progress: 100, eta: "Delivered 8:55 AM", rpm: "$2.45", miles: 240, weight: "44,000 lbs", commodity: "Chemicals", customer: "Dow Chemical", urgent: false, ai: "Completed", aiColor: "emerald", postedAt: "1d ago" },
  { id: "L-8805", origin: "Indianapolis, IN", dest: "Nashville, TN", driver: "Unassigned", driverId: null, status: "Unassigned", progress: 0, eta: "Pickup: Feb 19, 12:00 PM", rpm: "$2.99", miles: 295, weight: "24,000 lbs", commodity: "Furniture", customer: "Wayfair LLC", urgent: false, ai: "Assign driver", aiColor: "amber", postedAt: "1h ago" },
  { id: "L-8804", origin: "Phoenix, AZ", dest: "Denver, CO", driver: "G. Lopez", driverId: "D-049", status: "In Transit", progress: 44, eta: "Feb 19, 6:00 AM", rpm: "$3.02", miles: 600, weight: "38,400 lbs", commodity: "Steel Coil", customer: "Nucor Steel", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "18h ago" },
  { id: "L-8803", origin: "New Orleans, LA", dest: "Atlanta, GA", driver: "H. Davis", driverId: "D-066", status: "Picked Up", progress: 30, eta: "Feb 19, 2:00 AM", rpm: "$2.88", miles: 469, weight: "27,500 lbs", commodity: "Fresh Produce", customer: "Sysco Foods", urgent: false, ai: "Monitoring", aiColor: "blue", postedAt: "5h ago" },
  { id: "L-8802", origin: "Charlotte, NC", dest: "Washington, DC", driver: "W. Mitchell", driverId: "D-077", status: "In Transit", progress: 81, eta: "Feb 18, 4:30 PM", rpm: "$3.18", miles: 395, weight: "32,000 lbs", commodity: "Paper Products", customer: "Staples Inc.", urgent: false, ai: "On track", aiColor: "emerald", postedAt: "1d ago" },
];

const STATUS_TABS: { key: string; label: string; count: number }[] = [
  { key: "all", label: "All Loads", count: ALL_LOADS.length },
  { key: "In Transit", label: "In Transit", count: ALL_LOADS.filter((l) => l.status === "In Transit").length },
  { key: "Delayed", label: "Delayed", count: ALL_LOADS.filter((l) => l.status === "Delayed" || l.status === "HOS Alert").length },
  { key: "Picked Up", label: "Picked Up", count: ALL_LOADS.filter((l) => l.status === "Picked Up").length },
  { key: "Unassigned", label: "Unassigned", count: ALL_LOADS.filter((l) => l.status === "Unassigned").length },
  { key: "Delivered", label: "Delivered", count: ALL_LOADS.filter((l) => l.status === "Delivered").length },
];

const STATUS_STYLE: Record<LoadStatus, { badge: string; dot: string }> = {
  "In Transit": { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  "Delayed": { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  "Picked Up": { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  "Delivered": { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "Unassigned": { badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  "HOS Alert": { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const AI_COLOR: Record<string, string> = {
  emerald: "text-emerald-600",
  red: "text-red-600",
  amber: "text-amber-600",
  blue: "text-blue-600",
};

export function LoadsClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ALL_LOADS.filter((l) => {
    const matchTab =
      activeTab === "all" ||
      l.status === activeTab ||
      (activeTab === "Delayed" && l.status === "HOS Alert");
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.id.toLowerCase().includes(q) ||
      l.origin.toLowerCase().includes(q) ||
      l.dest.toLowerCase().includes(q) ||
      l.driver.toLowerCase().includes(q) ||
      l.customer.toLowerCase().includes(q) ||
      l.commodity.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const urgentCount = ALL_LOADS.filter((l) => l.urgent).length;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900 leading-tight">Load Board</h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">247 total loads · 41 in transit · real-time AI risk scoring</p>
        </div>
        <div className="flex items-center gap-3">
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              {urgentCount} urgent
            </div>
          )}
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-amber-500/20">
            <Plus className="w-4 h-4" />
            New Load
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-4">
        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === tab.key
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-[10px] font-bold px-1 rounded-full",
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search loads, routes, customers…"
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-colors"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <Filter className="w-3.5 h-3.5" />
          Showing {filtered.length} of {ALL_LOADS.length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[90px_40px_1fr_120px_110px_90px_70px_100px] gap-2 px-5 py-2.5 bg-gray-50/70 border-b border-gray-100">
          {["Load ID", "", "Route / Customer", "Driver", "Status", "RPM", "Miles", "Hemut AI"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-wider text-gray-400 font-bold truncate">{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400 font-medium">
            No loads match your filters.
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {filtered.map((load) => {
            const s = STATUS_STYLE[load.status];
            const aiClass = AI_COLOR[load.aiColor] ?? "text-gray-500";
            return (
              <div
                key={load.id}
                role="button"
                tabIndex={0}
                className={cn(
                  "grid grid-cols-[90px_40px_1fr_120px_110px_90px_70px_100px] gap-2 items-center px-5 py-3 hover:bg-gray-50/80 transition-colors cursor-pointer group",
                  load.urgent && "bg-red-50/25"
                )}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.preventDefault(); }}
              >
                {/* Load ID */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-gray-700 font-mono">{load.id}</span>
                  {load.urgent && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />}
                </div>

                {/* Urgency dot */}
                <div />

                {/* Route + customer */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 mb-0.5">
                    <span className="truncate max-w-[80px]">{load.origin.split(",")[0]}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-gray-300 shrink-0" />
                    <span className="truncate max-w-[80px]">{load.dest.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 truncate">{load.customer}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400">{load.commodity}</span>
                  </div>
                  <div className="mt-1.5 h-0.5 bg-gray-100 rounded-full overflow-hidden w-32">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        load.status === "Delayed" || load.status === "HOS Alert" ? "bg-red-400" :
                        load.status === "Delivered" ? "bg-emerald-500" :
                        load.status === "Picked Up" ? "bg-amber-400" :
                        load.status === "Unassigned" ? "bg-gray-200" :
                        "bg-blue-500"
                      )}
                      style={{ width: `${load.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-gray-300" />
                    <span className="text-[10px] text-gray-400">{load.eta}</span>
                  </div>
                </div>

                {/* Driver */}
                <div className="flex items-center gap-1.5">
                  {load.driverId ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-gray-500">
                          {load.driver.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-700 truncate">{load.driver}</div>
                        <div className="text-[9px] text-gray-400 font-mono">{load.driverId}</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />Unassigned
                    </span>
                  )}
                </div>

                {/* Status */}
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold w-fit ${s.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
                  {load.status}
                </span>

                {/* RPM */}
                <span className="text-[12px] font-black text-emerald-700">{load.rpm}</span>

                {/* Miles */}
                <span className="text-[11px] font-medium text-gray-500">{load.miles.toLocaleString()} mi</span>

                {/* AI */}
                <div className="flex items-center gap-1">
                  <Zap className={`w-3 h-3 ${aiClass} shrink-0`} />
                  <span className={`text-[10px] font-bold ${aiClass}`}>{load.ai}</span>
                  <ChevronRight className="w-3 h-3 text-gray-200 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom summary bar */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm">
        <div className="flex items-center gap-8">
          {[
            { label: "Avg RPM", value: "$2.94", color: "text-emerald-700" },
            { label: "Total Miles", value: "11,240 mi", color: "text-gray-700" },
            { label: "Total Weight", value: "680,300 lbs", color: "text-gray-700" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</div>
              <div className={`text-sm font-black mt-0.5 ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Showing page 1 of 13 · 247 total loads on board</span>
        </div>
      </div>
    </div>
  );
}
