"use client";

import { AlertTriangle } from "lucide-react";

type AlertSev = "critical" | "high" | "medium";

interface AlertItem {
  severity: AlertSev;
  title: string;
  msg: string;
  action: string;
  time: string;
}

const alertStyle: Record<AlertSev, { bar: string; bg: string; label: string; btn: string }> = {
  critical: { bar: "bg-red-500", bg: "bg-red-50", label: "text-red-600", btn: "border-red-200 text-red-700 hover:bg-red-50" },
  high: { bar: "bg-orange-400", bg: "bg-orange-50", label: "text-orange-600", btn: "border-orange-200 text-orange-700 hover:bg-orange-50" },
  medium: { bar: "bg-amber-400", bg: "bg-amber-50", label: "text-amber-600", btn: "border-amber-200 text-amber-700 hover:bg-amber-50" },
};

interface AlertsPanelProps {
  alerts: AlertItem[];
  onAlertAction: (alert: AlertItem) => void;
}

export function AlertsPanel({ alerts, onAlertAction }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="font-semibold text-gray-900 text-sm">Active Alerts</span>
        </div>
        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{alerts.length}</span>
      </div>
      {alerts.map((a) => {
        const st = alertStyle[a.severity];
        return (
          <div key={`${a.severity}-${a.title}`} className={`flex gap-0 border-b border-gray-50 last:border-0 ${st.bg}`}>
            <div className={`w-1 shrink-0 ${st.bar}`} />
            <div className="px-4 py-3 flex-1">
              <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${st.label}`}>
                {a.severity} · {a.time} ago
              </div>
              <p className="text-[11px] font-semibold text-gray-800 mb-1">{a.title}</p>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-2">{a.msg}</p>
              <button
                type="button"
                className={`text-[10px] font-bold px-2 py-1 rounded-md bg-white border ${st.btn} transition-colors`}
                onClick={() => onAlertAction(a)}
              >
                {a.action} →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
