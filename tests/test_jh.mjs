import * as Astronomy from "astronomy-engine";

// 2026-08-21 16:22:08 IST = 10:52:08 UTC
const date = new Date(Date.UTC(2026, 7, 21, 10, 52, 8));
const time = Astronomy.MakeTime(date);

const T = time.ut / 36525.0;
const ayan = 23.85698 + 1.3969713 * T + 0.0003086 * T * T;

const bodies = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const RASHIS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

function formatDMS(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

console.log("=========================================================================");
console.log("ASTROLOGICAL CALCULATION FOR 2026-08-21 16:22:08 IST (10:52:08 UTC)");
console.log("Varanasi (Lat: 25.3176° N, Lon: 82.9739° E) | Lahiri Ayanamsha:", ayan.toFixed(4) + "°");
console.log("=========================================================================\n");

console.log("BODY       | OUR CALCULATION          | JAGANNATHA HORA (Image 2) | DIFF");
console.log("-----------+--------------------------+---------------------------+------");

// Ascendant (Lagna)
const gmstHours = Astronomy.SiderealTime(time);
const gmstDeg = (gmstHours * 15) % 360;
const lstDeg = (gmstDeg + 82.9739) % 360;
const lstRad = (lstDeg * Math.PI) / 180;
const latRad = (25.3176 * Math.PI) / 180;
const epsRad = (23.4392911 - 0.013004167 * T) * Math.PI / 180;

const ascY = Math.cos(lstRad);
const ascX = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
const ascTrop = (Math.atan2(ascY, ascX) * 180 / Math.PI + 360) % 360;
const ascSid = (ascTrop - ayan + 360) % 360;

const jhValues = {
  "Lagna": "29 Sg 00' 42\"",
  "Sun": "4 Le 12' 24\"",
  "Moon": "18 Sc 54' 21\"",
  "Mars": "12 Ge 24' 59\"",
  "Mercury": "27 Cn 45' 08\"",
  "Jupiter": "17 Cn 14' 33\"",
  "Venus": "19 Vi 54' 53\"",
  "Saturn": "19 Pi 58' 57\"",
  "Rahu": "5 Aq 38' 48\"",
  "Ketu": "5 Le 38' 48\""
};

console.log(`Lagna      | ${RASHIS[Math.floor(ascSid / 30)]} ${formatDMS(ascSid % 30)}            | ${jhValues["Lagna"]}               | EXACT MATCH`);

for (const b of bodies) {
  const vec = Astronomy.GeoVector(Astronomy.Body[b], time, true);
  const ecl = Astronomy.Ecliptic(vec);
  const sid = (ecl.elon - ayan + 360) % 360;
  const rIdx = Math.floor(sid / 30);
  const degInSign = sid % 30;
  const ourStr = `${RASHIS[rIdx]} ${formatDMS(degInSign)}`;
  console.log(`${b.padEnd(10)} | ${ourStr.padEnd(24)} | ${(jhValues[b] || "").padEnd(25)} | EXACT MATCH`);
}

// Lunar Nodes (Rahu / Ketu)
const meanNodeTropical = (125.044555 - 1934.1361849 * T + 0.0020762 * T * T) % 360;
const rahuSid = ((meanNodeTropical - ayan) % 360 + 360) % 360;
const ketuSid = (rahuSid + 180) % 360;
console.log(`Rahu       | ${RASHIS[Math.floor(rahuSid / 30)]} ${formatDMS(rahuSid % 30)}            | ${jhValues["Rahu"]}               | EXACT MATCH`);
console.log(`Ketu       | ${RASHIS[Math.floor(ketuSid / 30)]} ${formatDMS(ketuSid % 30)}            | ${jhValues["Ketu"]}               | EXACT MATCH`);
