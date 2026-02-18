"use client";
import { useState, useEffect } from "react";
import { X, AlertTriangle, Check, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertData {
  id?: string;
  severity: string;
  title: string;
  msg: string;
  action: string;
  time?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  alert?: AlertData | null;
}

const SEV_STYLE: Record<string, { bar: string; bg: string; text: string; border: string }> = {
  critical: { bar: "bg-red-500", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  high:     { bar: "bg-orange-400", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  medium:   { bar: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const RESOLUTIONS = [
  { id: "acknowledge", label: "Acknowledge", desc: "Mark as seen, no action yet" },
  { id: "reassign", label: "Reassign Load", desc: "Open driver assignment flow" },
  { id: "notify", label: "Notify Customer", desc: "Send automated delay notification" },
  { id: "schedule", label: "Schedule Maintenance", desc: "Create PM work order" },
  { id: "resolve", label: "Resolve — Fixed", desc: "Issue resolved, close alert" },
];

export function AlertActionModal({ open, onClose, alert }: Props) {
  const [resolution, setResolution] = useState("acknowledge");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) { setResolution("acknowledge"); setNotes(""); setSuccess(false); }
  }, [open]);

  async function handleResolve() {
    setLoading(true);
    try {
      if (alert?.id) {
        await fetch(`/api/alerts/${alert.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resolved: true }),
        });
      }
    } catch { /* demo mode */ }
    setSuccess(true);
    setTimeout(onClose, 1400);
    setLoading(false);
  }

  if (!open || !alert) return null;

  const sev = alert.severity?.toLowerCase() ?? "medium";
  const style = SEV_STYLE[sev] ?? SEV_STYLE.medium;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Severity bar */}
        <div className={`h-1 ${style.bar} w-full`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={cn("w-5 h-5", style.text)} />
            <div>
              <h2 className="font-bold text-gray-900 text-[15px]">{alert.title}</h2>
              <div className={cn("text-[10px] font-bold uppercase tracking-wide", style.text)}>
                {alert.severity} Priority{alert.time ? ` · ${alert.time} ago` : ""}
              </div>
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
            <p className="font-bold text-gray-900 text-lg">Alert Resolved</p>
            <p className="text-sm text-gray-400">Logged to audit trail. Hemut AI updated.</p>
          </div>
        ) : (
          <>
            {/* Alert details */}
            <div className={cn("px-6 py-3.5 border-b", style.bg, style.border)}>
              <p className="text-sm text-gray-700 leading-relaxed">{alert.msg}</p>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* AI recommendation */}
              <div className="bg-[#080d1a] rounded-xl p-3.5 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-amber-400 mb-0.5">Hemut AI Recommendation</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    {sev === "critical"
                      ? "Immediate action required. Reassign load before HOS violation occurs. Driver M. Garcia (D-019) is fully reset and closest."
                      : sev === "high"
                      ? "Send automated delay notification to customer now. Every minute counts for delivery window recovery."
                      : "Schedule maintenance during next available downtime window. Log mileage and assign to preferred vendor."}
                  </p>
                </div>
              </div>

              {/* Resolution options */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Resolution Action</label>
                <div className="space-y-1.5">
                  {RESOLUTIONS.filter(r => {
                    if (sev === "critical") return ["acknowledge", "reassign", "resolve"].includes(r.id);
                    if (sev === "high") return ["acknowledge", "notify", "resolve"].includes(r.id);
                    return ["acknowledge", "schedule", "resolve"].includes(r.id);
                  }).map(r => (
                    <div
                      key={r.id}
                      onClick={() => setResolution(r.id)}
                      className={cn(
                        "flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
                        resolution === r.id ? "border-amber-400 bg-amber-50" : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0 flex items-center justify-center">
                        {resolution === r.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{r.label}</div>
                        <div className="text-[10px] text-gray-400">{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">
                  <MessageSquare className="w-3 h-3 inline mr-1" />Notes (optional)
                </label>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-colors placeholder-gray-300"
                  placeholder="Add context for the audit log…"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Dismiss
              </button>
              <button
                onClick={handleResolve}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
              >
                {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {loading ? "Resolving…" : "Resolve Alert"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
