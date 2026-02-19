"use client";

import Link from "next/link";
import { ArrowRight, Clock, ChevronRight, Zap } from "lucide-react";

type LoadStatus = "In Transit" | "Delayed" | "Picked Up" | "Delivered" | "Unassigned" | "HOS Alert";

interface Load {
  id: string;
  origin: string;
  dest: string;
  driver: string;
  status: LoadStatus;
  progress: number;
  eta: string;
  rpm: string;
  miles: number;
  urgent: boolean;
  ai?: string;
  aiColor?: string;
}

const loadStatusStyle: Record<LoadStatus, { badge: string; dot: string }> = {
  "In Transit": { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  "Delayed": { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  "Picked Up": { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  "Delivered": { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "Unassigned": { badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  "HOS Alert": { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

interface LoadsTableProps {
  loads: Load[];
  routeProgress: Record<string, number>;
  onAssignLoad: (loadId: string) => void;
}

export function LoadsTable({ loads, routeProgress, onAssignLoad }: LoadsTableProps) {
  return (
    <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="font-semibold text-gray-900 text-sm">Active Load Pipeline</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">6 shown · sorted by urgency · AI risk scores live</p>
        </div>
        <Link href="/loads" className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700">
          View all 247 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[80px_1fr_90px_90px_65px_90px] gap-2 px-5 py-2.5 border-b border-gray-50 bg-gray-50/60">
        {["Load", "Route", "Driver", "Status", "$/mi", "Hemut AI"].map((h) => (
          <span key={h} className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{h}</span>
        ))}
      </div>

      <div className="divide-y divide-gray-50">
        {loads.map((load) => {
          const s = loadStatusStyle[load.status];
          const isAssignable = load.ai === "Assign Garcia" || load.status === "Unassigned";
          const rowClass = `grid grid-cols-[80px_1fr_90px_90px_65px_90px] gap-2 items-center px-5 py-3 hover:bg-gray-50/70 transition-colors ${load.urgent ? "bg-red-50/30" : ""} ${isAssignable ? "cursor-pointer" : ""}`;

          const rowContent = (
            <>
              {/* Load ID */}
              <div className="flex items-center gap-1.5">
                {load.urgent && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />}
                <span className="text-[11px] font-bold text-gray-700 font-mono">{load.id}</span>
              </div>

              {/* Route */}
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-800 mb-1.5">
                  <span className="truncate max-w-[70px]">{load.origin.split(",")[0]}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-gray-300 shrink-0" />
                  <span className="truncate max-w-[70px]">{load.dest.split(",")[0]}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${load.status === "Delayed" || load.status === "HOS Alert" ? "bg-red-400" : load.status === "Delivered" ? "bg-emerald-500" : load.status === "Picked Up" ? "bg-amber-400" : "bg-blue-500"}`}
                    style={{ width: `${routeProgress[load.id] ?? load.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-2.5 h-2.5 text-gray-300" />
                  <span className="text-[10px] text-gray-400 truncate">{load.eta}</span>
                </div>
              </div>

              {/* Driver */}
              <div className="text-[11px] font-medium text-gray-600 truncate">
                {load.driver === "Unassigned" ? (
                  <span className="text-red-500 font-bold">No Driver</span>
                ) : load.driver}
              </div>

              {/* Status */}
              <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold w-fit ${s.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {load.status}
              </span>

              {/* RPM */}
              <span className="text-[11px] font-bold text-emerald-700">{load.rpm}</span>

              {/* AI */}
              {load.ai ? (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${load.aiColor}`}>
                  <Zap className="w-2.5 h-2.5" />{load.ai}
                </span>
              ) : <span />}
            </>
          );

          if (isAssignable) {
            return (
              <button
                key={load.id}
                type="button"
                className={`w-full text-left ${rowClass}`}
                onClick={() => onAssignLoad(load.id)}
              >
                {rowContent}
              </button>
            );
          }
          return (
            <div key={load.id} className={rowClass}>
              {rowContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
