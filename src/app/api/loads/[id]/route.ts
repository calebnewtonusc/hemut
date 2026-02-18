import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const load = await prisma.load.findFirst({
    where: { OR: [{ id }, { loadId: id }] },
    include: { driver: true },
  });
  if (!load) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(load);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const load = await prisma.load.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.progress !== undefined && { progress: body.progress }),
      ...(body.driverId !== undefined && { driverId: body.driverId }),
      ...(body.eta && { eta: body.eta }),
      ...(body.urgent !== undefined && { urgent: body.urgent }),
    },
    include: { driver: true },
  });
  return NextResponse.json(load);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.load.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
