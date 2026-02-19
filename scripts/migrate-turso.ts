/**
 * Pushes Prisma migrations and seed data directly to Turso via libsql client.
 * Run: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrate-turso.ts
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });

const migrationSql = readFileSync(
  join(process.cwd(), "prisma/migrations/20260218093536_init/migration.sql"),
  "utf-8"
);

// Split on semicolons, keep only non-empty statements
const statements = migrationSql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function main() {
  console.log("Applying migration to Turso...");
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (e: unknown) {
      // Ignore "already exists" errors so re-runs are safe
      if (
        e instanceof Error &&
        (e.message.includes("already exists") || e.message.includes("duplicate"))
      ) {
        console.log(`  skipped (already exists): ${stmt.slice(0, 60)}...`);
      } else {
        throw e;
      }
    }
  }
  console.log("Migration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
