import { calculateVedicEphemeris } from "./src/engine/ephemeris.ts";
import { calculateVargaSign } from "./src/engine/shodashavarga.ts";
import { NAISARGIKA_MAITRI } from "./src/engine/panchadaMaitri.ts";

const loc = {
  cityName: "Allahabad",
  country: "India",
  latitude: 25.44,
  longitude: 81.85,
  timezoneOffsetHours: 5.5,
};

const date = new Date("1999-09-17T13:02:51.000Z");
const ephem = calculateVedicEphemeris(date, loc, "Lahiri", "WholeSign", "Mean");

const vargas = ["D1", "D2", "D3", "D7", "D9", "D12", "D30"];
const RASHI_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

function getPanchada(p: string, lord: string, pSign: number, lSign: number) {
  if (p === lord) return "Own";
  const diff = (lSign - pSign + 12) % 12;
  const isTemporalFriend = [1, 2, 3, 9, 10, 11].includes(diff); // Houses 2, 3, 4, 10, 11, 12 from planet
  
  const nat = NAISARGIKA_MAITRI[p];
  let natRel = "Neutral";
  if (nat.friends.includes(lord)) natRel = "Friend";
  if (nat.enemies.includes(lord)) natRel = "Enemy";

  if (natRel === "Friend" && isTemporalFriend) return "Adhi Mitra";
  if (natRel === "Friend" && !isTemporalFriend) return "Sama";
  if (natRel === "Neutral" && isTemporalFriend) return "Mitra";
  if (natRel === "Neutral" && !isTemporalFriend) return "Shatru";
  if (natRel === "Enemy" && isTemporalFriend) return "Sama";
  return "Adhi Shatru";
}

console.log("=== SAPTAVARGAJA BALA WITH PANCHADA RELATIONSHIPS ===");
const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
for (const p of planets) {
  const pLon = ephem.planets[p].siderealLongitude;
  const pD1Sign = Math.floor(pLon / 30);
  let total = 0;
  const breakdown: string[] = [];

  vargas.forEach((v) => {
    const vSign = calculateVargaSign(pLon, v);
    const vLord = RASHI_LORDS[vSign];
    const vLordD1Sign = Math.floor((ephem.planets[vLord]?.siderealLongitude || 0) / 30);
    const rel = getPanchada(p, vLord, pD1Sign, vLordD1Sign);

    let pts = 7.5;
    if (rel === "Own") pts = 30.0;
    else if (rel === "Adhi Mitra") pts = 22.5;
    else if (rel === "Mitra") pts = 15.0;
    else if (rel === "Sama") pts = 7.5;
    else if (rel === "Shatru") pts = 3.75;
    else if (rel === "Adhi Shatru") pts = 1.875;

    total += pts;
    breakdown.push(`${v}:${vLord}(${rel}=${pts})`);
  });

  console.log(`${p.padEnd(8)}: Total=${total.toFixed(2)} -> [${breakdown.join(", ")}]`);
}
