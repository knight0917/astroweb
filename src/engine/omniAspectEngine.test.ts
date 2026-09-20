import { test } from "node:test";
import assert from "node:assert";
import { calculateVedicEphemeris } from "./ephemeris";
import {
  calculateOmniAspectMatrix,
  evaluateNeechaVakriPlanets,
  evaluateCombustionNuances,
  evaluateJaiminiArgalaSynthesis,
  evaluateDoubleTransitGates,
} from "./omniAspectEngine";

test("Phase 18: Omniscient 360° Multi-Aspect Astrological Intelligence Engine Verification", async (t) => {
  // 17 Sept 1999, 18:32 IST, Allahabad (25.4358 N, 81.8463 E)
  const dt = new Date("1999-09-17T13:02:00.000Z");
  const loc = {
    cityName: "Allahabad",
    country: "India",
    latitude: 25.4358,
    longitude: 81.8463,
    timezoneOffsetHours: 5.5,
  };

  const ephem = calculateVedicEphemeris(dt, loc, "Lahiri", "WholeSign", "Mean");

  await t.test("1. Correctly detects Neecha-Vakri Saturn with peak Chestabala boost", () => {
    const neechaVakri = evaluateNeechaVakriPlanets(ephem);
    const saturn = neechaVakri.find((p) => p.name === "Saturn");

    assert.ok(saturn, "Saturn must exist in planetary list");
    assert.strictEqual(saturn?.signName, "Aries", "Saturn must be in Aries");
    assert.strictEqual(saturn?.house, 2, "Saturn must be in the 2nd House from Pisces Lagna");
    assert.strictEqual(saturn?.isDebilitated, true, "Saturn must be debilitated in Aries");
    assert.strictEqual(saturn?.isRetrograde, true, "Saturn must be retrograde");
    assert.strictEqual(saturn?.isNeechaVakri, true, "Saturn must be flagged as Neecha-Vakri");
    assert.strictEqual(saturn?.chestabalaStatus, "Peak (Chestabala 60/60)");
    assert.match(saturn?.classicalVerdict || "", /Uttara Kalamrita 2.6/);
  });

  await t.test("2. Correctly computes Mercury combustion with Exaltation Shield and D-9 Decoupling", () => {
    const nuances = evaluateCombustionNuances(ephem);
    const mercury = nuances.find((p) => p.name === "Mercury");

    assert.ok(mercury, "Mercury must exist in combustion nuances");
    assert.strictEqual(mercury?.signName, "Virgo", "Mercury must be in Virgo");
    assert.strictEqual(mercury?.house, 7, "Mercury must be in the 7th house");
    assert.strictEqual(mercury?.isCombust, true, "Mercury is within 14 degrees of Sun");
    assert.ok(mercury && mercury.separationDeg > 7 && mercury.separationDeg < 8, "Separation must be ~7.5 degrees");
    assert.strictEqual(mercury?.hasExaltationShield, true, "Mercury must possess Exaltation Shield in Virgo");
    assert.strictEqual(mercury?.isD9Decoupled, true, "Mercury must decouple from Sun in D-9 Navamsha");
    assert.ok(mercury && mercury.immunityScore >= 70, "Immunity score must be >= 70%");
    assert.match(mercury?.effectiveVerdict || "", /Combustion Neutralized/);
  });

  await t.test("3. Correctly identifies Jaimini 5th/9th Argala Virodha with Dispositor Dharma Loop", () => {
    const argala = evaluateJaiminiArgalaSynthesis(ephem);

    assert.strictEqual(argala.has5thArgala, true, "5th house (Venus, Rahu) must have Argala on Lagna");
    assert.strictEqual(argala.has9thVirodha, true, "9th house (Moon, Mars) must have Virodha");
    assert.strictEqual(argala.dispositor5thIn9th, true, "5th Lord (Moon) must be located in 9th house");
    assert.match(argala.karmicFirewallExplanation, /Karmic Firewall/);
  });

  await t.test("4. Evaluates Double Transit activation houses without error", () => {
    const gates = evaluateDoubleTransitGates(ephem, new Date("2026-09-20T12:00:00.000Z"));

    assert.ok(gates.saturnTransitHouseFromLagna >= 1 && gates.saturnTransitHouseFromLagna <= 12);
    assert.ok(gates.jupiterTransitHouseFromLagna >= 1 && gates.jupiterTransitHouseFromLagna <= 12);
    assert.ok(Array.isArray(gates.activatedHouses));
  });

  await t.test("5. Master calculateOmniAspectMatrix produces 100% normalized Weighted Probability Scores", () => {
    const matrix = calculateOmniAspectMatrix(ephem, new Date("2026-09-20T12:00:00.000Z"));

    assert.strictEqual(matrix.ascendantSignName, "Pisces");
    assert.ok(matrix.lifeVectorScores.career, "Career vector must exist");
    assert.ok(matrix.lifeVectorScores.wealth, "Wealth vector must exist");
    assert.ok(matrix.lifeVectorScores.relationships, "Relationships vector must exist");
    assert.ok(matrix.lifeVectorScores.health, "Health vector must exist");
    assert.ok(matrix.lifeVectorScores.spirituality, "Spirituality vector must exist");

    // Check normalization: favorable + friction = 100
    for (const score of Object.values(matrix.lifeVectorScores)) {
      assert.strictEqual(
        score.favorablePct + score.frictionPct,
        100,
        `Score for ${score.vectorId} must add to 100%`
      );
      assert.ok(score.favorablePct >= 0 && score.favorablePct <= 100);
      assert.ok(score.primaryDrivers.length > 0, "Must contain primary drivers");
    }

    assert.strictEqual(matrix.suggestedFollowUpChips.length, 3, "Must have exactly 3 follow-up chips");
  });
});
