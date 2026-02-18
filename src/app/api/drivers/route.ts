import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest) {
  const drivers = await prisma.driver.findMany({
    where: { companyId: "demo-company" },
    include: { loads: { where: { status: { not: "DELIVERED" } } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(drivers);
}
