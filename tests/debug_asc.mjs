import * as Astronomy from "astronomy-engine";

function getGMSTDegrees(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  return ((gmst % 360) + 360) % 360;
}

function getEclipticObliquityDegrees(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.4392911 - 0.013004167 * T - 0.000000164 * T * T + 0.0000005036 * T * T * T;
}

function calculateTropicalAngles(jd, latitudeDeg, longitudeDeg) {
  const gmst = getGMSTDegrees(jd);
  const lstDeg = ((gmst + longitudeDeg) % 360 + 360) % 360;
  const lstRad = (lstDeg * Math.PI) / 180;
  const latRad = (latitudeDeg * Math.PI) / 180;
  const epsDeg = getEclipticObliquityDegrees(jd);
  const epsRad = (epsDeg * Math.PI) / 180;

  const ascY = Math.cos(lstRad);
  const ascX = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = (Math.atan2(ascY, ascX) * 180) / Math.PI;
  ascTropical = ((ascTropical % 360) + 360) % 360;
  return { ascTropical, lstDeg };
}

// Exact Horizon Search using Astronomy.Horizon:
function exactTropicalAsc(date, lat, lon) {
  const obs = new Astronomy.Observer(lat, lon, 0);
  const time = Astronomy.MakeTime(date);
  let best = 0, minAlt = 999;
  for (let deg = 0; deg < 360; deg += 0.25) {
    const rad = deg * Math.PI / 180;
    const eps = 23.4392911 * Math.PI / 180;
    const dec = Math.asin(Math.sin(eps) * Math.sin(rad));
    const ra = (Math.atan2(Math.cos(eps) * Math.sin(rad), Math.cos(rad)) * 180 / Math.PI + 360) % 360;
    const hor = Astronomy.Horizon(time, obs, ra, dec * 180 / Math.PI, "normal");
    // Rising in East (Azimuth between 20° and 160°)
    if (hor.azimuth > 20 && hor.azimuth < 160 && Math.abs(hor.altitude) < minAlt) {
      minAlt = Math.abs(hor.altitude);
      best = deg;
    }
  }
  return best;
}

const RASHIS = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
const ayan = 24.218;

console.log("=== VARANASI 2026-08-21 HOURLY ASCENDANT (UTC + 5.5 = IST) ===");
for (let utcHour = 0; utcHour < 24; utcHour += 2) {
  const d = new Date(Date.UTC(2026, 7, 21, utcHour, 0, 0));
  const astroTime = Astronomy.MakeTime(d);
  const { ascTropical, lstDeg } = calculateTropicalAngles(astroTime.ut, 25.3176, 82.9739);
  const exactTrop = exactTropicalAsc(d, 25.3176, 82.9739);
  
  const siderealFormula = (ascTropical - ayan + 360) % 360;
  const siderealExact = (exactTrop - ayan + 360) % 360;
  const istHour = (utcHour + 5.5) % 24;
  
  console.log(`UTC ${String(utcHour).padStart(2, '0')}:00 (IST ${String(istHour).padStart(4, ' ')}:30) | Formula: ${siderealFormula.toFixed(1)}° [${RASHIS[Math.floor(siderealFormula/30)]}] | Exact Horizon: ${siderealExact.toFixed(1)}° [${RASHIS[Math.floor(siderealExact/30)]}]`);
}
