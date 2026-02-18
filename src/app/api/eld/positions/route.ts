import { NextResponse } from "next/server";
import { samsara } from "@/lib/samsara";

/**
 * GET /api/eld/positions
 *
 * Returns real-time GPS coordinates for all active trucks.
 * Uses Samsara API if configured, otherwise returns simulated positions.
 *
 * Response shape maps truck IDs to SVG map coordinates (800x240 viewBox).
 * Projection: x = (125 - lon) / 58 * 760 + 20
 *             y = (49 - lat) / 24 * 200 + 20
 */

function geoToSvg(lat: number, lon: number): { x: number; y: number } {
  const x = Math.round(((125 - lon) / 58) * 760 + 20);
  const y = Math.round(((49 - lat) / 24) * 200 + 20);
  return { x, y };
}

export async function GET() {
  const locations = await samsara.getVehicleLocations();

  const positions = locations.map((loc) => {
    const svg = geoToSvg(loc.latitude, loc.longitude);
    return {
      vehicleId: loc.id,
      lat: loc.latitude,
      lon: loc.longitude,
      svgX: svg.x,
      svgY: svg.y,
      heading: loc.heading,
      speedMph: Math.round(loc.speedMilesPerHour),
      location: loc.reverseGeo?.formattedLocation ?? "En route",
      updatedAt: loc.time,
      simulated: samsara.isSandbox,
    };
  });

  return NextResponse.json({
    positions,
    source: samsara.isSandbox ? "simulator" : "samsara",
    updatedAt: new Date().toISOString(),
  });
}
