import { calculateAstroMarketSignal } from "../src/engine/financialAstro";

console.log("Testing calculateAstroMarketSignal...");

const symbols = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "USOIL"] as const;

for (const sym of symbols) {
  const signal = calculateAstroMarketSignal(sym);
  console.log(`\n================== ${sym} ==================`);
  console.log(`Bias: ${signal.signals.directionalBias} | Vol Mult: ${signal.signals.volatilityMultiplier} | Confluence Pts: ${signal.signals.confluencePoints}`);
  console.log(`Regime: ${signal.signals.marketRegime} (Confidence: ${signal.signals.confidenceScore}%)`);
  console.log(`Dikshit Nakshatra: ${signal.dikshitLiquidityCycle.moonNakshatraName} -> ${signal.dikshitLiquidityCycle.action}`);
  console.log(`Active Hora Lord: ${signal.activeHora.horaLord} (Beneficial: ${signal.activeHora.horaBeneficialForAsset})`);
  console.log(`Advice: Longs=${signal.quantAdvice.allowLongs}, Shorts=${signal.quantAdvice.allowShorts}, LotScale=${signal.quantAdvice.lotSizeScale}`);
}

console.log("\nAll financial astrology signals computed successfully!");
