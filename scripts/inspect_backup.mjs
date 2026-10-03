import fs from "fs";
import zlib from "zlib";

const backupPath = "D:/newWayToAstro/db_cluster-26-09-2026@05-46-51.backup.gz";

try {
  const compressed = fs.readFileSync(backupPath);
  const decompressed = zlib.gunzipSync(compressed);
  const text = decompressed.toString("utf8");
  console.log("Decompressed size:", text.length, "characters");

  const lines = text.split("\n");
  console.log("Total lines:", lines.length);

  // Check for birth_charts and reviews
  const chartLines = lines.filter(l => l.includes("birth_charts"));
  console.log("Occurrences of birth_charts:", chartLines.length);
  console.log("Sample birth_charts lines:\n", chartLines.slice(0, 10).join("\n"));

  const reviewLines = lines.filter(l => l.includes("reviews"));
  console.log("Occurrences of reviews:", reviewLines.length);

  // Write decompressed sql file to examine or restore
  fs.writeFileSync("D:/newWayToAstro/restored_backup.sql", text, "utf8");
  console.log("Wrote D:/newWayToAstro/restored_backup.sql successfully!");
} catch (err) {
  console.error("Error inspecting backup:", err);
}
