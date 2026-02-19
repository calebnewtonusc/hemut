import { PrismaClient } from "@prisma/client";
// Use the web (HTTP) adapter — works on Vercel serverless + local dev
import { PrismaLibSql } from "@prisma/adapter-libsql/web";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const adapter = new PrismaLibSql({
    // Turso: use https:// for HTTP transport; local: file:// path
    url: tursoUrl ?? process.env.DATABASE_URL ?? "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
