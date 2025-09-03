import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL is not set. The API will fail to access Postgres.");
}

let ssl: false | { rejectUnauthorized: boolean } = false;
try {
  if (connectionString) {
    const u = new URL(connectionString);
    const host = u.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      ssl = { rejectUnauthorized: false };
    }
    console.log(`Postgres target host: ${host}`);
  }
} catch {}

export const pool = new Pool({ connectionString: connectionString, ssl });

export async function ensureSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        job_type TEXT NOT NULL CHECK (job_type IN ('Full-time','Part-time','Contract','Internship')),
        salary_min INTEGER NOT NULL,
        salary_max INTEGER NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        responsibilities TEXT NOT NULL,
        deadline DATE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS title TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS responsibilities TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deadline DATE;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
    `);
  } finally {
    client.release();
  }
}
