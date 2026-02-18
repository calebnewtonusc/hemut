import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
  const alerts = await prisma.alert.findMany({
    where: { companyId: "demo-company", resolved: false },
    orderBy: [
      { severity: "asc" }, // CRITICAL < HIGH < LOW alphabetically - we'll sort in client
      { createdAt: "desc" },
    ],
  });
  // Sort: CRITICAL first, then HIGH, then MEDIUM
  const order = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  alerts.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
  return NextResponse.json(alerts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const alert = await prisma.alert.create({
    data: {
      severity: body.severity ?? "MEDIUM",
      title: body.title,
      message: body.message,
      action: body.action ?? null,
      companyId: "demo-company",
    },
  });
  return NextResponse.json(alert, { status: 201 });
}
