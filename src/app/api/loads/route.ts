import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const companyId = "demo-company";

  const where = {
    companyId,
    ...(status && status !== "all" ? { status: status.toUpperCase().replace(" ", "_") } : {}),
  };

  const loads = await prisma.load.findMany({
    where,
    include: { driver: true },
    orderBy: [{ urgent: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(loads);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const load = await prisma.load.create({
    data: {
      loadId: `L-${Date.now().toString().slice(-4)}`,
      origin: body.origin,
      dest: body.dest,
      customer: body.customer ?? null,
      commodity: body.commodity ?? null,
      weight: body.weight ?? null,
      miles: body.miles ?? 0,
      rpm: body.rpm ?? null,
      eta: body.eta ?? null,
      status: "UNASSIGNED",
      companyId: "demo-company",
      driverId: body.driverId ?? null,
    },
    include: { driver: true },
  });
  return NextResponse.json(load, { status: 201 });
}
