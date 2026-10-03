import { neon } from "@neondatabase/serverless";

const databaseUrl = "postgresql://neondb_owner:npg_Jqd6Bng5ofYW@ep-morning-cloud-b8l1w5r7-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

async function init() {
  console.log("Connecting to Neon...");
  const result = await sql`SELECT version();`;
  console.log("Postgres version:", result[0].version);

  console.log("Creating tables if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS birth_charts (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      name TEXT NOT NULL,
      gender TEXT DEFAULT 'male',
      date_iso TEXT,
      dob TEXT,
      time TEXT,
      city_name TEXT,
      country TEXT,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      elevation DOUBLE PRECISION DEFAULT 0,
      timezone_offset_hours DOUBLE PRECISION DEFAULT 5.5,
      ayanamsha TEXT DEFAULT 'Lahiri',
      house_system TEXT DEFAULT 'WholeSign',
      is_default BOOLEAN DEFAULT FALSE,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_birth_charts_user_email ON birth_charts(user_email);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_birth_charts_updated_at ON birth_charts(updated_at DESC);
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject VARCHAR(100),
      description TEXT,
      rating INTEGER DEFAULT 5,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_reviews_email ON reviews(email);
  `;

  console.log("Tables verified successfully!");

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;
  console.log("Public tables in Neon:", tables.map(t => t.table_name));
}

init().catch(err => {
  console.error("Error initializing Neon:", err);
  process.exit(1);
});
