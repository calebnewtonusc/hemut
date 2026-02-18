import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use lightweight authConfig (no Prisma) so this runs in Edge Runtime
const { auth } = NextAuth(authConfig);

// Next.js 16 requires named "proxy" export (replaces "middleware")
export { auth as proxy };

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
