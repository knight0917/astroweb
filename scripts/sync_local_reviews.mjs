import fs from "fs";
import { neon } from "@neondatabase/serverless";

const databaseUrl = "postgresql://neondb_owner:npg_Jqd6Bng5ofYW@ep-morning-cloud-b8l1w5r7-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

async function syncReviews() {
  const raw = fs.readFileSync("data/reviews_db.json", "utf8");
  const reviews = JSON.parse(raw);
  console.log(`Found ${reviews.length} local reviews.`);

  let inserted = 0;
  for (const r of reviews) {
    await sql`
      INSERT INTO reviews (id, name, email, subject, description, rating, created_at)
      VALUES (${r.id}, ${r.name}, ${r.email}, ${r.subject || ""}, ${r.description}, ${r.rating || 5}, ${r.createdAt})
      ON CONFLICT (id) DO NOTHING;
    `;
    inserted++;
  }

  const count = await sql`SELECT count(*) FROM reviews;`;
  console.log(`Neon reviews table count: ${count[0].count}`);
}

syncReviews().catch(console.error);
