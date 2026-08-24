/**
 * Vimshottari Dasha Engine (120-Year Parashari Predictive Cycle)
 * Computes complete Mahadasha (MD), Antardasha (AD / Bhukti), and Pratyantardasha (PD)
 * with exact birth balance and real-time active period locator.
 */

export interface DashaLord {
  id: string;
  name: string;
  hindiName: string;
  symbol: string;
  years: number;
  color: string;
}

export const DASHA_LORDS: DashaLord[] = [
  { id: "Ketu", name: "Ketu", hindiName: "केतु", symbol: "☋", years: 7, color: "text-purple-400 bg-purple-950/40 border-purple-500/40" },
  { id: "Venus", name: "Venus", hindiName: "शुक्र", symbol: "♀", years: 20, color: "text-pink-300 bg-pink-950/40 border-pink-500/40" },
  { id: "Sun", name: "Sun", hindiName: "सूर्य", symbol: "☉", years: 6, color: "text-amber-400 bg-amber-950/40 border-amber-500/40" },
  { id: "Moon", name: "Moon", hindiName: "चन्द्र", symbol: "☽", years: 10, color: "text-cyan-300 bg-cyan-950/40 border-cyan-500/40" },
  { id: "Mars", name: "Mars", hindiName: "मंगल", symbol: "♂", years: 7, color: "text-red-400 bg-red-950/40 border-red-500/40" },
  { id: "Rahu", name: "Rahu", hindiName: "राहु", symbol: "☊", years: 18, color: "text-indigo-400 bg-indigo-950/40 border-indigo-500/40" },
  { id: "Jupiter", name: "Jupiter", hindiName: "गुरु", symbol: "♃", years: 16, color: "text-yellow-300 bg-yellow-950/40 border-yellow-500/40" },
  { id: "Saturn", name: "Saturn", hindiName: "शनि", symbol: "♄", years: 19, color: "text-blue-400 bg-blue-950/40 border-blue-500/40" },
  { id: "Mercury", name: "Mercury", hindiName: "बुध", symbol: "☿", years: 17, color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/40" },
];

export interface PratyantardashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

export interface AntardashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  pratyantardashas: PratyantardashaNode[];
}

export interface MahadashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  antardashas: AntardashaNode[];
}

export interface ActiveDashaPeriod {
  mahadasha: DashaLord;
  antardasha: DashaLord;
  pratyantardasha: DashaLord;
  mdStart: Date;
  mdEnd: Date;
  adStart: Date;
  adEnd: Date;
  pdStart: Date;
  pdEnd: Date;
  percentageCompleteMD: number;
  percentageCompleteAD: number;
  percentageCompletePD: number;
}

export interface VimshottariDashaResult {
  birthDate: Date;
  moonLongitude: number;
  startingNakshatraIndex: number;
  startingNakshatraName: string;
  startingLord: DashaLord;
  balanceYears: number;
  balanceFormatted: string;
  mahadashas: MahadashaNode[];
  activeDasha: ActiveDashaPeriod | null;
}

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const DAYS_IN_YEAR = 365.2425;

/**
 * Computes complete Vimshottari Dasha tree (120 years) from Moon's sidereal longitude
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonLongitude: number,
  evaluationDate: Date = new Date()
): VimshottariDashaResult {
  const normMoon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.3333333333°
  const nakshatraIdx = Math.floor(normMoon / nakshatraSpan);
  const nakshatraName = NAKSHATRA_NAMES[nakshatraIdx] || "Ashwini";

  // Starting Dasha Lord is mapped by nakshatra % 9
  const startingLordIdx = nakshatraIdx % 9;
  const startingLord = DASHA_LORDS[startingLordIdx];

  // Fraction of nakshatra traversed
  const progInNak = (normMoon % nakshatraSpan) / nakshatraSpan;
  // Balance fraction remaining in the first Mahadasha
  const balanceFraction = 1.0 - progInNak;
  const balanceYears = balanceFraction * startingLord.years;

  const balY = Math.floor(balanceYears);
  const balM = Math.floor((balanceYears - balY) * 12);
  const balD = Math.floor(((balanceYears - balY) * 12 - balM) * 30.4375);
  const balanceFormatted = `${balY}y ${balM}m ${balD}d (${startingLord.name})`;

  const mahadashas: MahadashaNode[] = [];
  let currentStartMs = birthDate.getTime();

  // Generate 9 Mahadashas (120 full years from birth)
  for (let i = 0; i < 9; i++) {
    const lordIdx = (startingLordIdx + i) % 9;
    const mdLord = DASHA_LORDS[lordIdx];
    // First Mahadasha only lasts the balance remaining
    const effectiveYears = i === 0 ? balanceYears : mdLord.years;
    const durationDays = effectiveYears * DAYS_IN_YEAR;
    const durationMs = durationDays * 86400000;
    const mdEndMs = currentStartMs + durationMs;

    const mdStartDate = new Date(currentStartMs);
    const mdEndDate = new Date(mdEndMs);

    // Generate 9 Antardashas (Bhuktis) inside this Mahadasha
    const antardashas: AntardashaNode[] = [];
    let adStartMs = currentStartMs;

    // In classical Vedic astrology, full Antardasha starts with the MD lord
    for (let j = 0; j < 9; j++) {
      const adLordIdx = (lordIdx + j) % 9;
      const adLord = DASHA_LORDS[adLordIdx];

      // Standard full AD duration = (MD_years * AD_years) / 120 years
      const standardAdYears = (mdLord.years * adLord.years) / 120;
      let adDurationDays = standardAdYears * DAYS_IN_YEAR;

      // Scale first Mahadasha proportionally to remaining balance
      if (i === 0) {
        adDurationDays = adDurationDays * balanceFraction;
      }

      const adDurationMs = adDurationDays * 86400000;
      const adEndMs = adStartMs + adDurationMs;
      const adStartDate = new Date(adStartMs);
      const adEndDate = new Date(adEndMs);

      // Generate 9 Pratyantardashas inside this Antardasha
      const pratyantardashas: PratyantardashaNode[] = [];
      let pdStartMs = adStartMs;

      for (let k = 0; k < 9; k++) {
        const pdLordIdx = (adLordIdx + k) % 9;
        const pdLord = DASHA_LORDS[pdLordIdx];

        // PD duration = (AD_duration * PD_years) / 120
        const pdDurationDays = (adDurationDays * pdLord.years) / 120;
        const pdDurationMs = pdDurationDays * 86400000;
        const pdEndMs = pdStartMs + pdDurationMs;

        pratyantardashas.push({
          lord: pdLord,
          startDate: new Date(pdStartMs),
          endDate: new Date(pdEndMs),
          durationDays: Math.round(pdDurationDays * 10) / 10,
        });

        pdStartMs = pdEndMs;
      }

      antardashas.push({
        lord: adLord,
        startDate: adStartDate,
        endDate: adEndDate,
        durationDays: Math.round(adDurationDays * 10) / 10,
        pratyantardashas,
      });

      adStartMs = adEndMs;
    }

    mahadashas.push({
      lord: mdLord,
      startDate: mdStartDate,
      endDate: mdEndDate,
      durationYears: Math.round(effectiveYears * 100) / 100,
      antardashas,
    });

    currentStartMs = mdEndMs;
  }

  // Find currently active Dasha at evaluation date
  const evalMs = evaluationDate.getTime();
  let activeDasha: ActiveDashaPeriod | null = null;

  for (const md of mahadashas) {
    if (evalMs >= md.startDate.getTime() && evalMs <= md.endDate.getTime()) {
      const mdTotal = md.endDate.getTime() - md.startDate.getTime();
      const mdElapsed = evalMs - md.startDate.getTime();
      const pctMD = Math.min(100, Math.max(0, Math.round((mdElapsed / mdTotal) * 100)));

      for (const ad of md.antardashas) {
        if (evalMs >= ad.startDate.getTime() && evalMs <= ad.endDate.getTime()) {
          const adTotal = ad.endDate.getTime() - ad.startDate.getTime();
          const adElapsed = evalMs - ad.startDate.getTime();
          const pctAD = Math.min(100, Math.max(0, Math.round((adElapsed / adTotal) * 100)));

          for (const pd of ad.pratyantardashas) {
            if (evalMs >= pd.startDate.getTime() && evalMs <= pd.endDate.getTime()) {
              const pdTotal = pd.endDate.getTime() - pd.startDate.getTime();
              const pdElapsed = evalMs - pd.startDate.getTime();
              const pctPD = Math.min(100, Math.max(0, Math.round((pdElapsed / pdTotal) * 100)));

              activeDasha = {
                mahadasha: md.lord,
                antardasha: ad.lord,
                pratyantardasha: pd.lord,
                mdStart: md.startDate,
                mdEnd: md.endDate,
                adStart: ad.startDate,
                adEnd: ad.endDate,
                pdStart: pd.startDate,
                pdEnd: pd.endDate,
                percentageCompleteMD: pctMD,
                percentageCompleteAD: pctAD,
                percentageCompletePD: pctPD,
              };
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }

  return {
    birthDate,
    moonLongitude: normMoon,
    startingNakshatraIndex: nakshatraIdx,
    startingNakshatraName: nakshatraName,
    startingLord,
    balanceYears,
    balanceFormatted,
    mahadashas,
    activeDasha,
  };
}