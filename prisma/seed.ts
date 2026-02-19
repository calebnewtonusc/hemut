import "dotenv/config";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let dbUrl: string;
let authToken: string | undefined;

if (tursoUrl) {
  dbUrl = tursoUrl;
  authToken = tursoToken;
} else {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  // libsql requires absolute file path for local SQLite
  dbUrl = rawUrl.startsWith("file:./")
    ? `file://${path.resolve(rawUrl.replace("file:./", ""))}`
    : rawUrl.startsWith("file:") && !rawUrl.startsWith("file://")
    ? `file://${rawUrl.slice(5)}`
    : rawUrl;
}

const adapter = new PrismaLibSql({ url: dbUrl, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Hemut demo database...");

  // Company
  await prisma.company.upsert({
    where: { dot: "1234567" },
    update: {},
    create: {
      id: "demo-company",
      name: "Hemut Logistics Demo",
      dot: "1234567",
      mc: "MC-987654",
    },
  });

  // Admin user
  const hashedPassword = await bcrypt.hash("hemut2026", 10);
  await prisma.user.upsert({
    where: { email: "ricky@hemut.io" },
    update: {},
    create: {
      email: "ricky@hemut.io",
      name: "Ricky Maldonado",
      password: hashedPassword,
      role: "ADMIN",
      companyId: "demo-company",
    },
  });

  // Drivers
  const driversData = [
    { driverId: "D-041", name: "J. Martinez", initials: "JM", phone: "(312) 555-0141", status: "DRIVING", hosRemaining: 382, hosUsed: 278, hosLabel: "6h 22m left", location: "Springfield, IL", csaScore: 12, yearsExp: 9, violations: 0, homeDomicile: "Chicago, IL", nextReset: "Feb 20" },
    { driverId: "D-032", name: "R. Williams", initials: "RW", phone: "(901) 555-0032", status: "DELAYED", hosRemaining: 294, hosUsed: 310, hosLabel: "4h 54m left", location: "Corinth, MS", csaScore: 28, yearsExp: 6, violations: 1, homeDomicile: "Memphis, TN", nextReset: "Feb 19" },
    { driverId: "D-028", name: "K. Johnson", initials: "KJ", phone: "(213) 555-0028", status: "DRIVING", hosRemaining: 114, hosUsed: 525, hosLabel: "1h 54m left", location: "Casa Grande, AZ", csaScore: 8, yearsExp: 14, violations: 0, homeDomicile: "Los Angeles, CA", nextReset: "Feb 20" },
    { driverId: "D-055", name: "D. Thompson", initials: "DT", phone: "(713) 555-0055", status: "ON_DUTY", hosRemaining: 72, hosUsed: 570, hosLabel: "1h 12m left", location: "Beaumont, TX", csaScore: 34, yearsExp: 4, violations: 2, homeDomicile: "Houston, TX", nextReset: "Feb 19" },
    { driverId: "D-047", name: "T. Patel", initials: "TP", phone: "(602) 555-0047", status: "HOS_ALERT", hosRemaining: 60, hosUsed: 588, hosLabel: "1h 0m left", location: "Flagstaff, AZ", csaScore: 19, yearsExp: 7, violations: 0, homeDomicile: "Phoenix, AZ", nextReset: "Feb 19" },
    { driverId: "D-019", name: "M. Garcia", initials: "MG", phone: "(801) 555-0019", status: "AVAILABLE", hosRemaining: 660, hosUsed: 0, hosLabel: "Reset done", location: "Salt Lake City, UT", csaScore: 5, yearsExp: 12, violations: 0, homeDomicile: "Denver, CO", nextReset: "Ready" },
    { driverId: "D-062", name: "A. Rivera", initials: "AR", phone: "(615) 555-0062", status: "DRIVING", hosRemaining: 240, hosUsed: 420, hosLabel: "4h 0m left", location: "Knoxville, TN", csaScore: 16, yearsExp: 5, violations: 0, homeDomicile: "Nashville, TN", nextReset: "Feb 20" },
    { driverId: "D-037", name: "B. Chen", initials: "BC", phone: "(816) 555-0037", status: "DRIVING", hosRemaining: 460, hosUsed: 200, hosLabel: "7h 40m left", location: "Columbia, MO", csaScore: 11, yearsExp: 8, violations: 0, homeDomicile: "Kansas City, MO", nextReset: "Feb 21" },
    { driverId: "D-071", name: "L. Ortega", initials: "LO", phone: "(612) 555-0071", status: "DRIVING", hosRemaining: 540, hosUsed: 120, hosLabel: "9h 0m left", location: "Sioux Falls, SD", csaScore: 22, yearsExp: 3, violations: 1, homeDomicile: "Minneapolis, MN", nextReset: "Feb 21" },
    { driverId: "D-058", name: "C. Nguyen", initials: "CN", phone: "(704) 555-0058", status: "OFF_DUTY", hosRemaining: 660, hosUsed: 0, hosLabel: "Reset", location: "Charlotte, NC", csaScore: 7, yearsExp: 11, violations: 0, homeDomicile: "Miami, FL", nextReset: "Feb 19 PM" },
  ];

  for (const d of driversData) {
    await prisma.driver.upsert({
      where: { driverId: d.driverId },
      update: d,
      create: { ...d, companyId: "demo-company" },
    });
  }

  // Loads
  const loadsData = [
    { loadId: "L-8821", origin: "Chicago, IL", dest: "Dallas, TX", status: "IN_TRANSIT", progress: 72, eta: "Feb 19, 2:30 PM", rpm: 2.84, miles: 920, weight: "42,000 lbs", commodity: "Auto Parts", customer: "AutoNation Group", urgent: false },
    { loadId: "L-8820", origin: "Memphis, TN", dest: "Atlanta, GA", status: "DELAYED", progress: 45, eta: "Feb 18, 8:00 PM", rpm: 3.10, miles: 382, weight: "36,500 lbs", commodity: "Retail Goods", customer: "Walmart Distribution", urgent: true },
    { loadId: "L-8819", origin: "Los Angeles, CA", dest: "Phoenix, AZ", status: "IN_TRANSIT", progress: 88, eta: "Feb 18, 5:15 PM", rpm: 2.95, miles: 372, weight: "28,000 lbs", commodity: "Electronics", customer: "Best Buy Logistics", urgent: false },
    { loadId: "L-8818", origin: "Houston, TX", dest: "New Orleans, LA", status: "PICKED_UP", progress: 15, eta: "Feb 18, 11:45 PM", rpm: 2.70, miles: 348, weight: "44,000 lbs", commodity: "Industrial Equip.", customer: "Chevron Supply", urgent: false },
    { loadId: "L-8817", origin: "Denver, CO", dest: "Salt Lake City, UT", status: "DELIVERED", progress: 100, eta: "Delivered 10:22 AM", rpm: 3.05, miles: 525, weight: "31,200 lbs", commodity: "Food & Bev.", customer: "Sysco Foods", urgent: false },
    { loadId: "L-8816", origin: "Seattle, WA", dest: "Portland, OR", status: "UNASSIGNED", progress: 0, eta: "Pickup: 3:00 PM today", rpm: 3.20, miles: 174, weight: "18,000 lbs", commodity: "Lumber", customer: "Home Depot DC", urgent: true },
    { loadId: "L-8815", origin: "Flagstaff, AZ", dest: "Las Vegas, NV", status: "HOS_ALERT", progress: 65, eta: "Feb 18, 7:00 PM", rpm: 2.60, miles: 258, weight: "22,500 lbs", commodity: "Perishables", customer: "Whole Foods", urgent: true },
    { loadId: "L-8814", origin: "Nashville, TN", dest: "Charlotte, NC", status: "IN_TRANSIT", progress: 58, eta: "Feb 18, 6:00 PM", rpm: 2.88, miles: 410, weight: "39,000 lbs", commodity: "Appliances", customer: "Lowe's Corp.", urgent: false },
    { loadId: "L-8813", origin: "Kansas City, MO", dest: "Indianapolis, IN", status: "IN_TRANSIT", progress: 34, eta: "Feb 18, 9:30 PM", rpm: 3.15, miles: 488, weight: "40,200 lbs", commodity: "Automotive", customer: "Ford Motor Logistics", urgent: false },
    { loadId: "L-8812", origin: "Detroit, MI", dest: "New York, NY", status: "UNASSIGNED", progress: 0, eta: "Pickup: Feb 19, 6:00 AM", rpm: 3.45, miles: 614, weight: "26,800 lbs", commodity: "Pharma", customer: "McKesson Corp.", urgent: false },
  ];

  // Get driver IDs for assignment
  const d041 = await prisma.driver.findUnique({ where: { driverId: "D-041" } });
  const d032 = await prisma.driver.findUnique({ where: { driverId: "D-032" } });
  const d028 = await prisma.driver.findUnique({ where: { driverId: "D-028" } });
  const d055 = await prisma.driver.findUnique({ where: { driverId: "D-055" } });
  const d047 = await prisma.driver.findUnique({ where: { driverId: "D-047" } });

  const driverMap: Record<string, string | null> = {
    "L-8821": d041?.id ?? null,
    "L-8820": d032?.id ?? null,
    "L-8819": d028?.id ?? null,
    "L-8818": d055?.id ?? null,
    "L-8815": d047?.id ?? null,
  };

  for (const l of loadsData) {
    await prisma.load.upsert({
      where: { loadId: l.loadId },
      update: l,
      create: { ...l, companyId: "demo-company", driverId: driverMap[l.loadId] ?? null },
    });
  }

  // Alerts
  await prisma.alert.deleteMany({});
  await prisma.alert.createMany({
    data: [
      { severity: "CRITICAL", title: "HOS Limit Imminent", message: "T. Patel (D-047) — 1h 0m left near Flagstaff, AZ · Load L-8815", action: "Reassign Load", companyId: "demo-company" },
      { severity: "HIGH", title: "Delivery Window Closing", message: "L-8820 +2h 40min late — Walmart DC-Atlanta pickup window at 9:00 PM", action: "Notify Customer", companyId: "demo-company" },
      { severity: "MEDIUM", title: "Maintenance Overdue", message: "Truck T-031 — 15,246 mi since last PM (limit 15,000 mi)", action: "Schedule", companyId: "demo-company" },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
