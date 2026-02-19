import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Temporary debug endpoint — remove before launch
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const user = await prisma.user.findUnique({
      where: { email: "ricky@hemut.io" },
      select: { id: true, email: true, name: true, role: true, password: true },
    });
    return NextResponse.json({
      ok: true,
      userCount,
      userFound: !!user,
      hasPassword: !!user?.password,
      passwordLength: user?.password?.length ?? 0,
      dbUrl: process.env.TURSO_DATABASE_URL ? "turso:set" : "local",
      authToken: process.env.TURSO_AUTH_TOKEN ? "set" : "missing",
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
