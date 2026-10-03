import fs from "fs";

const text = fs.readFileSync("D:/newWayToAstro/restored_backup.sql", "utf8");
const lines = text.split("\n");

let inCopy = false;
const dataLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith("COPY public.birth_charts")) {
    inCopy = true;
    console.log("Found COPY line:", line);
    continue;
  }
  if (inCopy) {
    if (line.trim() === "\\.") {
      inCopy = false;
      console.log("End of COPY block reached.");
      break;
    }
    dataLines.push(line);
  }
}

console.log(`Found ${dataLines.length} birth chart rows in backup!`);
if (dataLines.length > 0) {
  console.log("First row preview:", dataLines[0]);
}
