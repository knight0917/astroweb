import fs from "fs";
import { neon } from "@neondatabase/serverless";

const databaseUrl = "postgresql://neondb_owner:npg_Jqd6Bng5ofYW@ep-morning-cloud-b8l1w5r7-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

async function restoreCharts() {
  const text = fs.readFileSync("D:/newWayToAstro/restored_backup.sql", "utf8");
  const lines = text.split("\n");

  let inCopy = false;
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("COPY public.birth_charts")) {
      inCopy = true;
      continue;
    }
    if (inCopy) {
      if (line.trim() === "\\.") {
        inCopy = false;
        break;
      }
      if (line.trim().length > 0) {
        rows.push(line.split("\t"));
      }
    }
  }

  console.log(`Parsing ${rows.length} rows...`);

  for (const cols of rows) {
    // Columns: id, user_email, name, gender, date_iso, dob, time, city_name, country, latitude, longitude, elevation, timezone_offset_hours, ayanamsha, house_system, is_default, notes, created_at, updated_at
    const [
      id, user_email, name, gender, date_iso, dob, time,
      city_name, country, latStr, lngStr, elevStr, tzStr,
      ayanamsha, house_system, isDefStr, notesStr, created_at, updated_at
    ] = cols;

    const parseVal = (v) => (!v || v === "\\N" ? null : v.trim());
    const latitude = parseVal(latStr) ? parseFloat(latStr) : null;
    const longitude = parseVal(lngStr) ? parseFloat(lngStr) : null;
    const elevation = parseVal(elevStr) ? parseFloat(elevStr) : 0;
    const timezone_offset_hours = parseVal(tzStr) ? parseFloat(tzStr) : 5.5;
    const is_default = isDefStr === "t" || isDefStr === "true";
    const notes = parseVal(notesStr);

    console.log(`Restoring chart: [${name}] for user [${user_email}]...`);

    await sql`
      INSERT INTO birth_charts (
        id, user_email, name, gender, date_iso, dob, time,
        city_name, country, latitude, longitude, elevation,
        timezone_offset_hours, ayanamsha, house_system, is_default, notes, created_at, updated_at
      ) VALUES (
        ${parseVal(id)},
        ${parseVal(user_email)},
        ${parseVal(name)},
        ${parseVal(gender) || "male"},
        ${parseVal(date_iso)},
        ${parseVal(dob)},
        ${parseVal(time)},
        ${parseVal(city_name)},
        ${parseVal(country)},
        ${latitude},
        ${longitude},
        ${elevation},
        ${timezone_offset_hours},
        ${parseVal(ayanamsha) || "Lahiri"},
        ${parseVal(house_system) || "WholeSign"},
        ${is_default},
        ${notes},
        ${parseVal(created_at) || new Date().toISOString()},
        ${parseVal(updated_at) || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        user_email = EXCLUDED.user_email,
        name = EXCLUDED.name,
        updated_at = EXCLUDED.updated_at;
    `;
  }

  const result = await sql`SELECT count(*) FROM birth_charts;`;
  console.log(`Success! Total birth_charts count in Neon: ${result[0].count}`);

  const allCharts = await sql`SELECT id, name, user_email, city_name, dob FROM birth_charts;`;
  console.table(allCharts);
}

restoreCharts().catch(console.error);
