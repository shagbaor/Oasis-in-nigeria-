// Creates the database tables. Usage: npm run db:migrate
// Reads DATABASE_URL from the environment or from .env.local.
import { readFileSync, existsSync } from "node:fs";

if (!process.env.DATABASE_URL && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local or your environment.");
  process.exit(1);
}

const statements = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .split(/;\s*$/m)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

const { hostname } = new URL(url);
const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

if (isLocal) {
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  for (const statement of statements) await client.query(statement);
  await client.end();
} else {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(url);
  for (const statement of statements) await sql.query(statement);
}

console.log(`Applied ${statements.length} statements. Database is ready.`);
