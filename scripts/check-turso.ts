import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const r = await client.execute("SELECT id, email, name, password FROM users");
  console.log("Users in Turso:", JSON.stringify(r.rows, null, 2));

  if (r.rows.length > 0) {
    const user = r.rows[0] as { password: string };
    const valid = await bcrypt.compare("hemut2026", user.password);
    console.log("Password 'hemut2026' matches hash:", valid);
  }
}

main().catch(console.error);
