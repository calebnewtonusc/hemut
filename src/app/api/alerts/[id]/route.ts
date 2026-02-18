import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const alert = await prisma.alert.update({
    where: { id },
    data: {
      ...(body.resolved !== undefined && { resolved: body.resolved }),
      ...(body.resolved && { resolvedAt: new Date() }),
    },
  });
  return NextResponse.json(alert);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.alert.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
