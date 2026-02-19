import { TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics · Hemut" };

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 bg-[#080d1a] min-h-screen">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <TrendingUp className="w-7 h-7 text-amber-400" />
      </div>
      <div className="text-center max-w-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-amber-400 text-[10px] font-semibold tracking-wide uppercase">In Development</span>
        </div>
        <h1 className="text-white font-semibold text-xl">Analytics</h1>
        <p className="text-white/35 text-sm mt-2 leading-relaxed">Fleet performance analytics, RPM trends, driver efficiency, and business intelligence.</p>
      </div>
    </div>
  );
}
