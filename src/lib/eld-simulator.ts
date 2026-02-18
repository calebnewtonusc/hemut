/**
 * HOS (Hours of Service) Simulation Engine
 *
 * Implements FMCSA 11-hour driving rule, 14-hour on-duty rule,
 * 30-minute break requirement, and 34-hour restart.
 *
 * Used when Samsara API is unavailable or in sandbox mode.
 */

export type DutyStatus = "DRIVING" | "ON_DUTY" | "OFF_DUTY" | "SLEEPER_BED";

export interface HOSState {
  driverId: string;
  dutyStatus: DutyStatus;
  drivingMinutes: number;   // minutes driven today
  onDutyMinutes: number;    // total on-duty minutes (driving + other)
  cycleMinutes: number;     // 60/70hr cycle minutes used
  lastBreakMinutes: number; // minutes since last 30-min break
  shiftStartMs: number;     // timestamp when current shift started
}

export interface HOSAnalysis {
  driverId: string;
  remainingDrivingMins: number;   // max 660 (11 hours)
  remainingOnDutyMins: number;    // max 840 (14 hours)
  needsBreak: boolean;            // true if >480 driving mins without 30-min break
  minsUntilRequiredBreak: number;
  violations: HOSViolation[];
  recommendation: string;
  riskLevel: "GREEN" | "AMBER" | "RED";
  nextResetMs: number;            // when 34-hour restart completes
}

export interface HOSViolation {
  type: "11_HOUR" | "14_HOUR" | "30_MIN_BREAK" | "60_70_CYCLE";
  description: string;
  severity: "WARNING" | "VIOLATION";
}

const RULES = {
  MAX_DRIVING_MINS: 660,      // 11 hours
  MAX_ON_DUTY_MINS: 840,      // 14 hours
  BREAK_REQUIRED_AFTER: 480,  // 8 hours driving → need 30-min break
  BREAK_DURATION: 30,         // 30-minute break
  CYCLE_60H: 3600,            // 60-hour / 7-day rule (minutes)
  CYCLE_70H: 4200,            // 70-hour / 8-day rule (minutes)
  RESTART_DURATION: 2040,     // 34 hours (minutes)
};

export function analyzeHOS(state: HOSState): HOSAnalysis {
  const violations: HOSViolation[] = [];

  // 11-hour driving rule
  const remainingDriving = RULES.MAX_DRIVING_MINS - state.drivingMinutes;
  if (remainingDriving <= 0) {
    violations.push({
      type: "11_HOUR",
      description: "11-hour driving limit reached. Driver must stop immediately.",
      severity: "VIOLATION",
    });
  } else if (remainingDriving <= 60) {
    violations.push({
      type: "11_HOUR",
      description: `Only ${remainingDriving} minutes of drive time remaining.`,
      severity: "WARNING",
    });
  }

  // 14-hour on-duty rule
  const remainingOnDuty = RULES.MAX_ON_DUTY_MINS - state.onDutyMinutes;
  if (remainingOnDuty <= 0) {
    violations.push({
      type: "14_HOUR",
      description: "14-hour on-duty window expired. Driver cannot continue.",
      severity: "VIOLATION",
    });
  }

  // 30-minute break requirement
  const needsBreak = state.drivingMinutes > RULES.BREAK_REQUIRED_AFTER && state.lastBreakMinutes < RULES.BREAK_DURATION;
  const minsUntilBreak = Math.max(0, RULES.BREAK_REQUIRED_AFTER - state.lastBreakMinutes);

  if (needsBreak) {
    violations.push({
      type: "30_MIN_BREAK",
      description: "30-minute break required after 8 hours of driving.",
      severity: state.drivingMinutes > RULES.BREAK_REQUIRED_AFTER + 30 ? "VIOLATION" : "WARNING",
    });
  }

  // Risk level
  const effectiveRemaining = Math.min(remainingDriving, remainingOnDuty);
  let riskLevel: HOSAnalysis["riskLevel"] = "GREEN";
  if (violations.some((v) => v.severity === "VIOLATION") || effectiveRemaining <= 0) {
    riskLevel = "RED";
  } else if (effectiveRemaining <= 90 || needsBreak) {
    riskLevel = "AMBER";
  }

  // Recommendation
  let recommendation = "";
  if (riskLevel === "RED") {
    recommendation = "Driver must stop. Pull to nearest safe location and begin 10-hour off-duty rest period.";
  } else if (riskLevel === "AMBER" && needsBreak) {
    recommendation = `Schedule 30-minute break within ${minsUntilBreak} minutes to remain compliant with FMCSA 30-minute rule.`;
  } else if (riskLevel === "AMBER") {
    const hrs = Math.floor(effectiveRemaining / 60);
    const mins = effectiveRemaining % 60;
    recommendation = `${hrs}h ${mins}m remaining. Plan rest stop within this window to protect delivery schedule.`;
  } else {
    recommendation = "Compliant. No action required.";
  }

  const nextResetMs = state.shiftStartMs + RULES.RESTART_DURATION * 60 * 1000;

  return {
    driverId: state.driverId,
    remainingDrivingMins: Math.max(0, remainingDriving),
    remainingOnDutyMins: Math.max(0, remainingOnDuty),
    needsBreak,
    minsUntilRequiredBreak: minsUntilBreak,
    violations,
    recommendation,
    riskLevel,
    nextResetMs,
  };
}

/**
 * Generate a simulated HOS state for demo purposes.
 * Produces realistic variation so the dashboard looks live.
 */
export function generateSimulatedHOS(
  driverId: string,
  baseProfile: { drivingHours: number; status: DutyStatus }
): HOSState {
  const jitter = Math.random() * 0.1; // ±6 minutes of variance
  const drivingMinutes = Math.round((baseProfile.drivingHours + jitter) * 60);

  return {
    driverId,
    dutyStatus: baseProfile.status,
    drivingMinutes,
    onDutyMinutes: drivingMinutes + Math.floor(Math.random() * 60), // add pre-trip inspection time
    cycleMinutes: drivingMinutes * 3 + Math.floor(Math.random() * 120), // multi-day accumulation
    lastBreakMinutes: drivingMinutes < 480 ? drivingMinutes : 35, // assume break taken
    shiftStartMs: Date.now() - drivingMinutes * 60 * 1000,
  };
}

// Pre-computed profiles for all Hemut demo drivers
export const DRIVER_HOS_PROFILES: Record<string, { drivingHours: number; status: DutyStatus }> = {
  "D-041": { drivingHours: 4.63, status: "DRIVING" },
  "D-032": { drivingHours: 5.17, status: "DRIVING" },
  "D-028": { drivingHours: 8.75, status: "DRIVING" },
  "D-055": { drivingHours: 9.5, status: "ON_DUTY" },
  "D-047": { drivingHours: 9.8, status: "DRIVING" },
  "D-019": { drivingHours: 0, status: "OFF_DUTY" },
  "D-062": { drivingHours: 7.0, status: "DRIVING" },
  "D-037": { drivingHours: 3.33, status: "DRIVING" },
  "D-071": { drivingHours: 2.0, status: "DRIVING" },
  "D-058": { drivingHours: 0, status: "OFF_DUTY" },
};
