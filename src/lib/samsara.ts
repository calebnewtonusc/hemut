/**
 * Samsara API Client
 *
 * Set SAMSARA_API_KEY in .env.local to connect to real Samsara data.
 * Without an API key, all methods return realistic simulated data.
 *
 * Docs: https://developers.samsara.com/reference
 */

interface SamsaraVehicleLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  heading: number;
  speedMilesPerHour: number;
  time: string;
  reverseGeo?: { formattedLocation: string };
}

interface SamsaraHOSLog {
  driverId: string;
  driverName: string;
  dutyStatus: "DRIVING" | "ON_DUTY" | "SLEEPER_BED" | "OFF_DUTY" | "PERSONAL_CONVEYANCE" | "YARD_MOVES";
  startTime: string;
  durationMs: number;
  remainingDrivingMs: number;
  remainingOnDutyMs: number;
  remainingCycleMs: number;
  violationSummary: {
    hasViolation: boolean;
    violationType?: string;
  };
}

interface SamsaraDriverStatus {
  driverId: string;
  currentDutyStatus: string;
  hosRemaining: number; // minutes
  hosUsed: number; // minutes
  lastLocation?: string;
}

const SAMSARA_BASE = "https://api.samsara.com";
const API_KEY = process.env.SAMSARA_API_KEY;

// ─── Simulated data for sandbox mode ──────────────────────────────────────────

const SIMULATED_LOCATIONS: SamsaraVehicleLocation[] = [
  { id: "V-041", name: "Truck T-041", latitude: 39.78, longitude: -89.65, heading: 195, speedMilesPerHour: 62, time: new Date().toISOString(), reverseGeo: { formattedLocation: "Springfield, IL" } },
  { id: "V-032", name: "Truck T-032", latitude: 34.73, longitude: -88.52, heading: 90, speedMilesPerHour: 0, time: new Date().toISOString(), reverseGeo: { formattedLocation: "Corinth, MS" } },
  { id: "V-028", name: "Truck T-028", latitude: 32.88, longitude: -111.76, heading: 110, speedMilesPerHour: 68, time: new Date().toISOString(), reverseGeo: { formattedLocation: "Casa Grande, AZ" } },
  { id: "V-055", name: "Truck T-055", latitude: 30.08, longitude: -94.13, heading: 85, speedMilesPerHour: 55, time: new Date().toISOString(), reverseGeo: { formattedLocation: "Beaumont, TX" } },
  { id: "V-047", name: "Truck T-047", latitude: 35.19, longitude: -111.65, heading: 270, speedMilesPerHour: 0, time: new Date().toISOString(), reverseGeo: { formattedLocation: "Flagstaff, AZ" } },
];

const SIMULATED_HOS: SamsaraHOSLog[] = [
  { driverId: "D-041", driverName: "J. Martinez", dutyStatus: "DRIVING", startTime: new Date(Date.now() - 4.6 * 3600000).toISOString(), durationMs: 4.6 * 3600000, remainingDrivingMs: 6.37 * 3600000, remainingOnDutyMs: 6.37 * 3600000, remainingCycleMs: 32 * 3600000, violationSummary: { hasViolation: false } },
  { driverId: "D-032", driverName: "R. Williams", dutyStatus: "DRIVING", startTime: new Date(Date.now() - 5.17 * 3600000).toISOString(), durationMs: 5.17 * 3600000, remainingDrivingMs: 4.83 * 3600000, remainingOnDutyMs: 4.83 * 3600000, remainingCycleMs: 28 * 3600000, violationSummary: { hasViolation: false } },
  { driverId: "D-028", driverName: "K. Johnson", dutyStatus: "DRIVING", startTime: new Date(Date.now() - 8.75 * 3600000).toISOString(), durationMs: 8.75 * 3600000, remainingDrivingMs: 2.25 * 3600000, remainingOnDutyMs: 2.25 * 3600000, remainingCycleMs: 15 * 3600000, violationSummary: { hasViolation: false } },
  { driverId: "D-055", driverName: "D. Thompson", dutyStatus: "ON_DUTY", startTime: new Date(Date.now() - 9.5 * 3600000).toISOString(), durationMs: 9.5 * 3600000, remainingDrivingMs: 1.5 * 3600000, remainingOnDutyMs: 1.5 * 3600000, remainingCycleMs: 12 * 3600000, violationSummary: { hasViolation: false } },
  { driverId: "D-047", driverName: "T. Patel", dutyStatus: "DRIVING", startTime: new Date(Date.now() - 9.8 * 3600000).toISOString(), durationMs: 9.8 * 3600000, remainingDrivingMs: 1.0 * 3600000, remainingOnDutyMs: 1.0 * 3600000, remainingCycleMs: 8 * 3600000, violationSummary: { hasViolation: true, violationType: "HOS_11_HOUR_DRIVING" } },
];

// ─── API Client ────────────────────────────────────────────────────────────────

class SamsaraClient {
  private apiKey: string | undefined;
  private sandboxMode: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? API_KEY;
    this.sandboxMode = !this.apiKey;

    if (this.sandboxMode && process.env.NODE_ENV !== "test") {
      console.info("[Samsara] No API key found — running in sandbox/simulation mode");
    }
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${SAMSARA_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 30 }, // cache 30s
    });

    if (!res.ok) {
      throw new Error(`Samsara API error ${res.status}: ${await res.text()}`);
    }

    return res.json();
  }

  /**
   * Get real-time GPS locations for all active vehicles.
   * Falls back to simulated positions in sandbox mode.
   */
  async getVehicleLocations(): Promise<SamsaraVehicleLocation[]> {
    if (this.sandboxMode) {
      // Add small random jitter to simulate movement
      return SIMULATED_LOCATIONS.map((loc) => ({
        ...loc,
        latitude: loc.latitude + (Math.random() - 0.5) * 0.01,
        longitude: loc.longitude + (Math.random() - 0.5) * 0.01,
        speedMilesPerHour: loc.speedMilesPerHour > 0
          ? Math.max(0, loc.speedMilesPerHour + (Math.random() - 0.5) * 5)
          : 0,
        time: new Date().toISOString(),
      }));
    }

    const data = await this.fetch<{ data: SamsaraVehicleLocation[] }>(
      "/v1/fleet/locations"
    );
    return data.data;
  }

  /**
   * Get HOS (Hours of Service) logs for a specific driver.
   * Falls back to simulated HOS data in sandbox mode.
   */
  async getDriverHOS(driverId: string): Promise<SamsaraHOSLog | null> {
    if (this.sandboxMode) {
      return SIMULATED_HOS.find((h) => h.driverId === driverId) ?? null;
    }

    try {
      const data = await this.fetch<{ data: SamsaraHOSLog }>(
        `/v1/fleet/hos_logs?driverId=${driverId}&limit=1`
      );
      return data.data;
    } catch {
      return null;
    }
  }

  /**
   * Get HOS logs for all drivers.
   */
  async getAllDriverHOS(): Promise<SamsaraHOSLog[]> {
    if (this.sandboxMode) {
      return SIMULATED_HOS;
    }

    const data = await this.fetch<{ data: SamsaraHOSLog[] }>(
      "/v1/fleet/hos_logs?limit=100"
    );
    return data.data;
  }

  /**
   * Get vehicle stats (odometer, engine hours, fuel level).
   */
  async getVehicleStats(vehicleId: string): Promise<{
    odometer: number;
    engineHours: number;
    fuelPercent: number;
  } | null> {
    if (this.sandboxMode) {
      return {
        odometer: 185000 + Math.floor(Math.random() * 50000),
        engineHours: 6200 + Math.floor(Math.random() * 1000),
        fuelPercent: 20 + Math.floor(Math.random() * 70),
      };
    }

    try {
      const data = await this.fetch<{
        data: { odometer: number; engineHours: number; fuelPercent: number };
      }>(`/v1/vehicles/${vehicleId}/stats`);
      return data.data;
    } catch {
      return null;
    }
  }

  get isSandbox() {
    return this.sandboxMode;
  }
}

// Singleton instance
export const samsara = new SamsaraClient();
