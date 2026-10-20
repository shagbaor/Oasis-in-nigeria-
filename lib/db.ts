import "server-only";

type Runner = (text: string, params: unknown[]) => Promise<Record<string, unknown>[]>;

let runner: Runner | undefined;

// Uses Neon's serverless driver in production. A localhost DATABASE_URL
// falls back to node-postgres so the app can run against a local Postgres.
async function getRunner(): Promise<Runner> {
  if (runner) return runner;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const { hostname } = new URL(url);
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url });
    runner = async (text, params) => (await pool.query(text, params)).rows;
  } else {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    runner = (text, params) => sql.query(text, params) as Promise<Record<string, unknown>[]>;
  }
  return runner;
}

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const run = await getRunner();
  return (await run(text, params)) as T[];
}

export function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
