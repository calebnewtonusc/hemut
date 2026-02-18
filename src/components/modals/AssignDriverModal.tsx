"use client";
import { useState, useEffect } from "react";
import { X, User, Zap, MapPin, Clock, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  loadId?: string | null;
}

const LOAD_INFO: Record<string, { origin: string; dest: string; eta: string; customer: string; urgent: boolean }> = {
  "L-8816": { origin: "Seattle, WA", dest: "Portland, OR", eta: "Pickup: 3:00 PM today", customer: "Home Depot DC", urgent: true },
  "L-8812": { origin: "Detroit, MI", dest: "New York, NY", eta: "Pickup: Feb 19, 6:00 AM", customer: "McKesson Corp.", urgent: false },
  "L-8815": { origin: "Flagstaff, AZ", dest: "Las Vegas, NV", eta: "HOS Alert — needs reassignment", customer: "Whole Foods", urgent: true },
};

const AVAILABLE_DRIVERS = [
  { id: "D-019", name: "M. Garcia", initials: "MG", hos: "Reset done", hosPercent: 100, location: "Salt Lake City, UT", ai: "AI Top Pick — closest, fully reset", aiColor: "emerald", score: 98 },
  { id: "D-033", name: "J. Brown", initials: "JB", hos: "11h avail.", hosPercent: 92, location: "Dallas, TX", ai: "Good match for southern routes", aiColor: "emerald", score: 87 },
  { id: "D-037", name: "B. Chen", initials: "BC", hos: "7h 40m left", hosPercent: 64, location: "Columbia, MO", ai: "Sufficient HOS — moderate fit", aiColor: "blue", score: 71 },
  { id: "D-062", name: "A. Rivera", initials: "AR", hos: "4h 0m left", hosPercent: 33, location: "Knoxville, TN", ai: "Low HOS — risky assignment", aiColor: "amber", score: 44 },
];

function hosColor(pct: number) {
  if (pct < 20) return "bg-red-400";
  if (pct < 40) return "bg-amber-400";
  return "bg-emerald-500";
}

export function AssignDriverModal({ open, onClose, loadId }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = loadId ? (LOAD_INFO[loadId] ?? LOAD_INFO["L-8816"]) : LOAD_INFO["L-8816"];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) { setSelected(null); setSuccess(false); }
  }, [open, loadId]);

  async function handleAssign() {
    if (!selected) return;
    setLoading(true);
    try {
      // PATCH the load to assign the driver
      if (loadId) {
        await fetch(`/api/loads/${loadId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driverId: selected, status: "PICKED_UP" }),
        });
      }
    } catch { /* demo mode */ }
    setSuccess(true);
    setTimeout(onClose, 1400);
    setLoading(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-[15px]">Assign Driver</h2>
              <p className="text-[11px] text-gray-400">AI-ranked by HOS, location, and CSA score</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-12 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="font-bold text-gray-900 text-lg">Driver Assigned</p>
            <p className="text-sm text-gray-400">Load updated. ELD notification sent to driver.</p>
          </div>
        ) : (
          <>
            {/* Load info */}
            <div className={cn("px-6 py-3.5 border-b", load.urgent ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100")}>
              {load.urgent && (
                <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold uppercase tracking-wide mb-1.5">
                  <AlertTriangle className="w-3 h-3" />Urgent Assignment Required
                </div>
              )}
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {load.origin} → {load.dest}
              </div>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{load.eta}</span>
                <span>· {load.customer}</span>
                {loadId && <span className="font-mono font-bold text-amber-600">{loadId}</span>}
              </div>
            </div>

            {/* Driver list */}
            <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
              {AVAILABLE_DRIVERS.map((d, i) => (
                <div
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                    selected === d.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0",
                    i === 0 ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    {i + 1}
                  </div>
                  {/* Avatar */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    selected === d.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                  )}>
                    {d.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-gray-800">{d.name}</span>
                      <span className="text-[9px] font-mono text-gray-400">{d.id}</span>
                    </div>
                    {/* HOS bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${hosColor(d.hosPercent)}`} style={{ width: `${d.hosPercent}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500 w-16 shrink-0">{d.hos}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Zap className={cn("w-2.5 h-2.5", d.aiColor === "emerald" ? "text-emerald-500" : d.aiColor === "amber" ? "text-amber-500" : "text-blue-500")} />
                      <span className={cn("text-[10px] font-medium", d.aiColor === "emerald" ? "text-emerald-600" : d.aiColor === "amber" ? "text-amber-600" : "text-blue-600")}>
                        {d.ai}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-black text-gray-700">{d.score}</span>
                    <span className="text-[9px] text-gray-400">AI score</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0 flex items-center justify-center">
                    {selected === d.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selected || loading}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
              >
                {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <User className="w-3.5 h-3.5" />}
                {loading ? "Assigning…" : "Confirm Assignment"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
