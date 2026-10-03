import fs from "fs";
import { neon } from "@neondatabase/serverless";

const databaseUrl = "postgresql://neondb_owner:npg_Jqd6Bng5ofYW@ep-morning-cloud-b8l1w5r7-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

async function syncLocal() {
  const rows = await sql`SELECT * FROM birth_charts;`;
  const formatted = rows.map((row) => ({
    id: row.id,
    userEmail: row.user_email,
    name: row.name,
    gender: row.gender || "male",
    dateIso: row.date_iso,
    dob: row.dob,
    time: row.time,
    location: {
      cityName: row.city_name || "Unknown City",
      country: row.country || "India",
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      elevation: Number(row.elevation || 0),
      timezoneOffsetHours: Number(row.timezone_offset_hours || 5.5),
    },
    ayanamsha: row.ayanamsha || "Lahiri",
    houseSystem: row.house_system || "WholeSign",
    isDefault: Boolean(row.is_default),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  fs.writeFileSync("data/charts_db.json", JSON.stringify(formatted, null, 2), "utf8");
  console.log(`Synced ${formatted.length} charts to data/charts_db.json!`);
}

syncLocal().catch(console.error);
