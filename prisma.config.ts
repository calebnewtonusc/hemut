import { defineConfig } from "prisma/config";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: tursoUrl
      ? `${tursoUrl}?authToken=${tursoToken}`
      : (process.env.DATABASE_URL ?? "file:./prisma/dev.db"),
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
