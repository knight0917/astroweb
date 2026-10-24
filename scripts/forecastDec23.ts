import { calculateAstroMarketSignal } from '../src/engine/financialAstro';
import { calculateVedicEphemeris } from '../src/engine/ephemeris';

const targetDate = new Date(Date.UTC(2025, 11, 23, 12, 0, 0)); // 23 Dec 2025 noon UTC
const sig = calculateAstroMarketSignal('XAUUSD', targetDate);
const eph = calculateVedicEphemeris(targetDate, {
  latitude: 41.9028,
  longitude: 12.4964,
  elevation: 21,
  timezoneOffsetHours: 1,
});

console.log('=== EXACT ASTRONOMICAL EPHEMERIS FOR 23 DEC 2025 ===');
console.log('Day of Week:', targetDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }));
console.log('Sun Sidereal Longitude:', eph.planets["Sun"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Sun"]?.rashi.name);
console.log('Moon Sidereal Longitude:', eph.planets["Moon"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Moon"]?.rashi.name, 'Nakshatra:', eph.planets["Moon"]?.nakshatra.name);
console.log('Mars Longitude:', eph.planets["Mars"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Mars"]?.rashi.name, 'Retrograde:', eph.planets["Mars"]?.isRetrograde);
console.log('Mercury Longitude:', eph.planets["Mercury"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Mercury"]?.rashi.name, 'Retrograde:', eph.planets["Mercury"]?.isRetrograde);
console.log('Jupiter Longitude:', eph.planets["Jupiter"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Jupiter"]?.rashi.name, 'Retrograde:', eph.planets["Jupiter"]?.isRetrograde);
console.log('Venus Longitude:', eph.planets["Venus"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Venus"]?.rashi.name);
console.log('Saturn Longitude:', eph.planets["Saturn"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Saturn"]?.rashi.name);
console.log('Rahu Longitude:', eph.planets["Rahu"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Rahu"]?.rashi.name);
console.log('Ketu Longitude:', eph.planets["Ketu"]?.siderealLongitude.toFixed(2), 'Sign:', eph.planets["Ketu"]?.rashi.name);
console.log('');
console.log('=== FINANCIAL ASTRO SIGNAL FOR 23 DEC 2025 (XAUUSD) ===');
console.log('Directional Bias:', sig.signals.directionalBias);
console.log('Market Regime:', sig.signals.marketRegime);
console.log('Volatility Multiplier:', sig.signals.volatilityMultiplier);
console.log('Confidence Score:', sig.signals.confidenceScore);
console.log('Moon Nakshatra:', sig.dikshitLiquidityCycle.moonNakshatraName);
console.log('Moon Nakshatra Index:', sig.dikshitLiquidityCycle.moonNakshatraIndex);
console.log('Dikshit Action:', sig.dikshitLiquidityCycle.action);
console.log('Dikshit Rule Description:', sig.dikshitLiquidityCycle.ruleDescription);
console.log('Tithi:', sig.lunarPhase.tithiName, 'Paksha:', sig.lunarPhase.paksha);
console.log('Narapati Rahu Hemisphere:', sig.narapatiSwarodaya.rahuKalanalaHemisphere);
console.log('Brihat Samhita Scarcity Score:', sig.varahamihiraScarcity.scarcityInflationScore);
console.log('Allow Longs:', sig.quantAdvice.allowLongs);
console.log('Allow Shorts:', sig.quantAdvice.allowShorts);
console.log('Suggested Action:', sig.quantAdvice.suggestedAction);
console.log('');
console.log('=== 24-HOUR TIMELINE SNAPSHOT ===');
for (const s of sig.intradayTimeline || []) {
  console.log(`Hour ${s.hourUtc.toString().padStart(2, '0')}:00 UTC (${(s.hourUtc + 1).toString().padStart(2, '0')}:00 Rome) -> Hora: ${s.horaLord.padEnd(8)} | Kakshya: ${s.moonKakshyaLord.padEnd(8)} | Hourly Bias: ${s.hourlyBias > 0 ? '+' : ''}${s.hourlyBias.toFixed(2)} | Action: ${s.hourlyBias >= 0.25 ? 'BUY' : s.hourlyBias <= -0.25 ? 'SELL' : 'CHOP'}`);
}
