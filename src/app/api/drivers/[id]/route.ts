import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await prisma.driver.findFirst({
    where: { OR: [{ id }, { driverId: id }] },
    include: { loads: true },
  });
  if (!driver) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(driver);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const driver = await prisma.driver.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.hosRemaining !== undefined && { hosRemaining: body.hosRemaining }),
      ...(body.location && { location: body.location }),
    },
  });
  return NextResponse.json(driver);
}
