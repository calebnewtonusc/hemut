import { NextResponse } from "next/server";

// Simulated truck positions — in production this would come from
// Samsara/Motive GPS API via webhook updates stored in DB
const BASE_ROUTES = [
  { id: "L-8821", driverId: "D-041", x1: 510, y1: 79, x2: 390, y2: 155, progress: 72, status: "IN_TRANSIT" },
  { id: "L-8820", driverId: "D-032", x1: 479, y1: 136, x2: 552, y2: 148, progress: 45, status: "DELAYED" },
  { id: "L-8819", driverId: "D-028", x1: 109, y1: 144, x2: 189, y2: 150, progress: 88, status: "IN_TRANSIT" },
  { id: "L-8818", driverId: "D-055", x1: 408, y1: 180, x2: 477, y2: 178, progress: 15, status: "PICKED_UP" },
  { id: "L-8815", driverId: "D-047", x1: 196, y1: 135, x2: 150, y2: 127, progress: 65, status: "HOS_ALERT" },
];

export async function GET() {
  const now = Date.now();
  // Simulate progress creep based on time (0.5% per minute for active loads)
  const minutesSinceEpoch = now / 60000;

  const positions = BASE_ROUTES.map((r) => {
    const drift = r.status === "DELAYED" || r.status === "HOS_ALERT"
      ? 0 // stalled loads don't progress
      : (minutesSinceEpoch % 100) * 0.01; // slow creep

    const p = Math.min(r.progress + drift, 100);
    const tx = r.x1 + (r.x2 - r.x1) * (p / 100);
    const ty = r.y1 + (r.y2 - r.y1) * (p / 100);

    return {
      loadId: r.id,
      driverId: r.driverId,
      tx: Math.round(tx),
      ty: Math.round(ty),
      progress: Math.round(p),
      status: r.status,
      updatedAt: new Date().toISOString(),
    };
  });

  return NextResponse.json(positions);
}
