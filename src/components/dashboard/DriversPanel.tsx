"use client";

import Link from "next/link";
import { Users, Zap } from "lucide-react";

type DriverStatus = "Driving" | "On Duty" | "Off Duty" | "HOS Alert" | "Delayed" | "Training" | "Available";

interface Driver {
  name: string;
  initials: string;
  id: string;
  status: DriverStatus;
  hos: string;
  hosPercent: number;
  load: string;
  ai?: string;
}

const driverStatusStyle: Record<DriverStatus, string> = {
  "Driving": "bg-blue-100 text-blue-700",
  "On Duty": "bg-amber-100 text-amber-700",
  "Off Duty": "bg-gray-100 text-gray-500",
  "HOS Alert": "bg-red-100 text-red-700",
  "Delayed": "bg-orange-100 text-orange-700",
  "Training": "bg-purple-100 text-purple-700",
  "Available": "bg-emerald-100 text-emerald-700",
};

function hosBar(p: number) {
  if (p < 20) return "bg-red-500";
  if (p < 40) return "bg-amber-400";
  return "bg-emerald-500";
}

interface DriversPanelProps {
  drivers: Driver[];
}

export function DriversPanel({ drivers }: DriversPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900 text-sm">Driver HOS Board</span>
        </div>
        <Link href="/drivers" className="text-[10px] font-semibold text-amber-600 hover:text-amber-700">
          All drivers →
        </Link>
      </div>
      {drivers.map((d) => (
        <div key={d.id} className="px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-gray-600">{d.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-800 truncate">{d.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${driverStatusStyle[d.status]}`}>
                  {d.status}
                </span>
                {d.ai && (
                  <span className={`text-[9px] font-bold flex items-center gap-0.5 ${d.status === "HOS Alert" ? "text-red-600" : d.ai === "Available" ? "text-emerald-600" : "text-orange-600"}`}>
                    <Zap className="w-2.5 h-2.5" />{d.ai}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  {d.status !== "Off Duty" && d.status !== "Training" ? (
                    <div className={`h-full rounded-full ${hosBar(d.hosPercent)}`} style={{ width: `${d.hosPercent}%` }} />
                  ) : (
                    <div className="h-full w-full bg-emerald-200 rounded-full" />
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium shrink-0 w-10 text-right">{d.hos}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
