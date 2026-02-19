import { Truck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fleet · Hemut" };

export default function FleetPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#080d1a] min-h-screen">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <Truck className="w-6 h-6 text-amber-400" />
      </div>
      <div className="text-center">
        <h1 className="text-white font-semibold text-lg">Fleet</h1>
        <p className="text-white/30 text-sm mt-1">Coming soon</p>
      </div>
    </div>
  );
}
