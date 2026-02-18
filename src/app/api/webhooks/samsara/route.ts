import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Samsara Webhook Endpoint
 *
 * Configure in Samsara dashboard: Settings → Webhooks → Add Endpoint
 * URL: https://yourdomain.com/api/webhooks/samsara
 * Events: vehicle_location, hos_violation, driver_status_change
 *
 * Set SAMSARA_WEBHOOK_SECRET in .env.local to the secret from Samsara.
 */

interface SamsaraWebhookEvent {
  eventType: "vehicle_location" | "hos_violation" | "driver_status_change" | "vehicle_stats";
  eventId: string;
  orgId: string;
  data: Record<string, unknown>;
  occurredAt: string;
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  if (!secret) return true; // Skip verification in dev if no secret set
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expected}`),
    Buffer.from(signature)
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-samsara-signature") ?? "";
  const secret = process.env.SAMSARA_WEBHOOK_SECRET ?? "";

  // Verify webhook authenticity
  if (secret && !verifySignature(body, signature, secret)) {
    console.error("[Samsara Webhook] Invalid signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: SamsaraWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.info(`[Samsara Webhook] Received: ${event.eventType} at ${event.occurredAt}`);

  switch (event.eventType) {
    case "vehicle_location": {
      // Update truck GPS position in DB
      // In production: await prisma.driver.update({ where: { truckId: event.data.vehicleId }, data: { lat: event.data.lat, lon: event.data.lon, location: event.data.reverseGeo } })
      console.info("[Samsara] Vehicle location update:", event.data);
      break;
    }

    case "hos_violation": {
      // Create a critical alert in DB
      // In production: await prisma.alert.create({ data: { severity: "CRITICAL", title: "HOS Violation", message: `Driver ${event.data.driverName}: ${event.data.violationType}`, companyId: "..." } })
      console.warn("[Samsara] HOS violation:", event.data);
      break;
    }

    case "driver_status_change": {
      // Update driver duty status in DB
      const statusMap: Record<string, string> = {
        "DRIVING": "DRIVING",
        "ON_DUTY_NOT_DRIVING": "ON_DUTY",
        "OFF_DUTY": "OFF_DUTY",
        "SLEEPER_BED": "SLEEPER",
      };
      const newStatus = statusMap[event.data.currentDutyStatus as string] ?? "ON_DUTY";
      console.info(`[Samsara] Driver ${event.data.driverId} status → ${newStatus}`);
      // In production: await prisma.driver.update({ where: { driverId: event.data.driverId }, data: { status: newStatus } })
      break;
    }

    case "vehicle_stats": {
      console.info("[Samsara] Vehicle stats update:", event.data);
      break;
    }

    default:
      console.warn(`[Samsara Webhook] Unknown event type: ${event.eventType}`);
  }

  // Samsara expects a 200 response quickly
  return NextResponse.json({ received: true, eventId: event.eventId });
}
