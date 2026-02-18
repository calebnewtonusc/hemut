import { NextRequest, NextResponse } from "next/server";
import { samsara } from "@/lib/samsara";
import { analyzeHOS, generateSimulatedHOS, DRIVER_HOS_PROFILES } from "@/lib/eld-simulator";

/**
 * GET /api/eld/hos?driverId=D-041
 * Returns HOS analysis for a specific driver.
 *
 * GET /api/eld/hos
 * Returns HOS analysis for all active drivers.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const driverId = searchParams.get("driverId");

  if (driverId) {
    // Single driver
    const hosLog = await samsara.getDriverHOS(driverId);

    if (hosLog) {
      // Real Samsara data — convert to our format
      const state = {
        driverId,
        dutyStatus: hosLog.dutyStatus as "DRIVING" | "ON_DUTY" | "OFF_DUTY" | "SLEEPER_BED",
        drivingMinutes: Math.round((11 * 60) - (hosLog.remainingDrivingMs / 60000)),
        onDutyMinutes: Math.round((14 * 60) - (hosLog.remainingOnDutyMs / 60000)),
        cycleMinutes: Math.round((70 * 60) - (hosLog.remainingCycleMs / 60000)),
        lastBreakMinutes: 35, // Samsara provides this in detail endpoint
        shiftStartMs: new Date(hosLog.startTime).getTime(),
      };
      return NextResponse.json(analyzeHOS(state));
    }

    // Fallback to simulator
    const profile = DRIVER_HOS_PROFILES[driverId];
    if (!profile) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }
    const simState = generateSimulatedHOS(driverId, profile);
    return NextResponse.json({ ...analyzeHOS(simState), simulated: true });
  }

  // All drivers
  const hosLogs = await samsara.getAllDriverHOS();
  const results = Object.keys(DRIVER_HOS_PROFILES).map((id) => {
    const log = hosLogs.find((l) => l.driverId === id);
    if (log) {
      const state = {
        driverId: id,
        dutyStatus: log.dutyStatus as "DRIVING" | "ON_DUTY" | "OFF_DUTY" | "SLEEPER_BED",
        drivingMinutes: Math.round((11 * 60) - (log.remainingDrivingMs / 60000)),
        onDutyMinutes: Math.round((14 * 60) - (log.remainingOnDutyMs / 60000)),
        cycleMinutes: Math.round((70 * 60) - (log.remainingCycleMs / 60000)),
        lastBreakMinutes: 35,
        shiftStartMs: new Date(log.startTime).getTime(),
      };
      return analyzeHOS(state);
    }
    return analyzeHOS(generateSimulatedHOS(id, DRIVER_HOS_PROFILES[id]));
  });

  return NextResponse.json(results);
}
