/**
 * Classical Yoga Activation & Dasha-Gochar Conduit
 * References:
 * - Three Hundred Important Combinations (Dr. B.V. Raman - Summary & Timing Rules)
 * - Brihat Parashara Hora Shastra (BPHS Vimshottari Dasha Phala)
 */

import { RamanYoga } from "./ramanYogas";
import { VimshottariDashaResult } from "./dasha";

export type YogaActivationStatus =
  | "ACTIVE_NOW"
  | "UPCOMING"
  | "LIFELONG_CONSTITUTIONAL"
  | "DORMANT"
  | "CANCELLED";

export interface ActivatedYogaReport {
  yoga: RamanYoga;
  status: YogaActivationStatus;
  statusLabel: string;
  statusBadgeColor: "emerald" | "amber" | "indigo" | "slate" | "rose";
  timingDescription: string;
  activeDashaWindow?: {
    mahadasha: string;
    antardasha?: string;
    startDate: string;
    endDate: string;
  };
  relevanceScore: number;
}

export interface ChartYogaActivationSummary {
  currentlyActive: ActivatedYogaReport[];
  lifelongYogas: ActivatedYogaReport[];
  upcomingYogas: ActivatedYogaReport[];
  dormantYogas: ActivatedYogaReport[];
  cancelledYogas: ActivatedYogaReport[];
  dominantLifeTheme: string;
}

export function mapYogaActivationTimeline(
  yogas: RamanYoga[],
  dashaResult: VimshottariDashaResult
): ChartYogaActivationSummary {
  const activeDasha = dashaResult.activeDasha;
  const activeMD = activeDasha ? activeDasha.mahadasha.name : "";
  const activeAD = activeDasha ? activeDasha.antardasha.name : "";

  const currentlyActive: ActivatedYogaReport[] = [];
  const lifelongYogas: ActivatedYogaReport[] = [];
  const upcomingYogas: ActivatedYogaReport[] = [];
  const dormantYogas: ActivatedYogaReport[] = [];
  const cancelledYogas: ActivatedYogaReport[] = [];

  yogas.forEach((yoga) => {
    // 1. Cancelled Yogas
    if (yoga.isCancelled) {
      cancelledYogas.push({
        yoga,
        status: "CANCELLED",
        statusLabel: "Cancelled / Neutralized (भङ्ग)",
        statusBadgeColor: "slate",
        timingDescription: yoga.cancellationReason || "Mitigated by classical cancellation rules.",
        relevanceScore: 10,
      });
      return;
    }

    // 2. Lifelong Constitutional Yogas
    if (yoga.isLifelong && yoga.category === "32 Nabhasa Yogas") {
      lifelongYogas.push({
        yoga,
        status: "LIFELONG_CONSTITUTIONAL",
        statusLabel: "Lifelong Constitutional Blueprint (आजीवन)",
        statusBadgeColor: "indigo",
        timingDescription: "Shapes innate character, physique, and enduring life archetype throughout life.",
        relevanceScore: yoga.potencyPercent,
      });
      return;
    }

    // 3. Check if currently active in active MD or AD
    const isMdParticipating = yoga.activationDashaLords.includes(activeMD);
    const isAdParticipating = yoga.activationDashaLords.includes(activeAD);

    if (activeDasha && (isMdParticipating || (isAdParticipating && yoga.potencyPercent >= 70))) {
      const startFmt = activeDasha.adStart.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const endFmt = activeDasha.adEnd.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const activeWindowStr = activeDasha.mahadasha.name + " MD / " + activeDasha.antardasha.name + " AD (" + startFmt + " - " + endFmt + ")";

      currentlyActive.push({
        yoga,
        status: "ACTIVE_NOW",
        statusLabel: "Currently Active in Running Dasha (सक्रिय दशा)",
        statusBadgeColor: "emerald",
        timingDescription: "Triggered right now during " + activeWindowStr + ".",
        activeDashaWindow: {
          mahadasha: activeDasha.mahadasha.name,
          antardasha: activeDasha.antardasha.name,
          startDate: activeDasha.adStart.toISOString(),
          endDate: activeDasha.adEnd.toISOString(),
        },
        relevanceScore: Math.min(100, yoga.potencyPercent + 15),
      });
      return;
    }

    // 4. Check for upcoming Dasha periods in this lifetime
    let upcomingFound: { md: string; ad: string; start: Date; end: Date } | null = null;
    const nowTime = new Date().getTime();

    if (dashaResult.mahadashas && Array.isArray(dashaResult.mahadashas)) {
      for (const mdNode of dashaResult.mahadashas) {
        if (mdNode.endDate.getTime() < nowTime) continue;

        if (mdNode.antardashas && Array.isArray(mdNode.antardashas)) {
          for (const adNode of mdNode.antardashas) {
            if (adNode.startDate.getTime() > nowTime && yoga.activationDashaLords.includes(adNode.lord.name)) {
              upcomingFound = {
                md: mdNode.lord.name,
                ad: adNode.lord.name,
                start: adNode.startDate,
                end: adNode.endDate,
              };
              break;
            }
          }
        }
        if (upcomingFound) break;
      }
    }

    if (upcomingFound) {
      const startYr = upcomingFound.start.getFullYear();
      const startFmt = upcomingFound.start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const endFmt = upcomingFound.end.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      upcomingYogas.push({
        yoga,
        status: "UPCOMING",
        statusLabel: "Upcoming in " + startYr + " (आगामी)",
        statusBadgeColor: "amber",
        timingDescription: "Scheduled to activate during " + upcomingFound.md + " Dasha (" + startFmt + " - " + endFmt + ").",
        activeDashaWindow: {
          mahadasha: upcomingFound.md,
          antardasha: upcomingFound.ad,
          startDate: upcomingFound.start.toISOString(),
          endDate: upcomingFound.end.toISOString(),
        },
        relevanceScore: Math.round(yoga.potencyPercent * 0.8),
      });
    } else {
      dormantYogas.push({
        yoga,
        status: "DORMANT",
        statusLabel: "Dormant (सुप्त)",
        statusBadgeColor: "slate",
        timingDescription: "Natal combination is present, but operating Dasha period is outside primary active window.",
        relevanceScore: Math.round(yoga.potencyPercent * 0.4),
      });
    }
  });

  let dominantTheme = "Native is currently navigating " + activeMD + " Mahadasha and " + activeAD + " Antardasha. ";
  if (currentlyActive.length > 0) {
    const topActive = currentlyActive.sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
    dominantTheme += "Primary operational energy is driven by " + topActive.yoga.name + " (" + topActive.yoga.potencyPercent + "% strength), signifying " + topActive.yoga.bhavasSignified.join(", ") + ".";
  } else {
    dominantTheme += "General planetary progression activating house significations of current sub-lords.";
  }

  return {
    currentlyActive: currentlyActive.sort((a, b) => b.relevanceScore - a.relevanceScore),
    lifelongYogas: lifelongYogas.sort((a, b) => b.relevanceScore - a.relevanceScore),
    upcomingYogas: upcomingYogas.sort((a, b) => b.relevanceScore - a.relevanceScore),
    dormantYogas: dormantYogas.sort((a, b) => b.relevanceScore - a.relevanceScore),
    cancelledYogas,
    dominantLifeTheme: dominantTheme,
  };
}
