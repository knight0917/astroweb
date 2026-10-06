import { AstroQueryDomain, detectAstroQueryDomain } from "../lib/ragRetriever";

export interface ActiveUserCorrection {
  query: string;
  correction: string;
  category?: string;
}

export interface ConsultationState {
  currentDomain: AstroQueryDomain;
  exploredDomains: AstroQueryDomain[];
  exploredHouses: number[];
  prescribedRemedies: string[];
  activeCorrections?: ActiveUserCorrection[];
  turnCount: number;
}

/**
 * Extracts and tracks state across multiple conversation turns.
 */
export function buildConsultationState(
  messages: any[],
  currentQuery: string,
  newPrescribedUpaya?: string,
  activeCorrections?: ActiveUserCorrection[]
): ConsultationState {
  const exploredDomainsSet = new Set<AstroQueryDomain>();
  const exploredHousesSet = new Set<number>();
  const remediesList: string[] = [];
  const correctionsList: ActiveUserCorrection[] = activeCorrections ? [...activeCorrections] : [];

  const { domain: activeDomain, targetHouses } = detectAstroQueryDomain(currentQuery);
  exploredDomainsSet.add(activeDomain);
  targetHouses.forEach((h) => exploredHousesSet.add(h));

  if (Array.isArray(messages)) {
    for (const msg of messages) {
      const text = msg.content || "";
      if (msg.role === "user" || msg.sender === "user") {
        const { domain, targetHouses: th } = detectAstroQueryDomain(text);
        exploredDomainsSet.add(domain);
        th.forEach((h) => exploredHousesSet.add(h));
      } else if (msg.role === "assistant" || msg.sender === "bot") {
        // Detect previously prescribed remedies
        if (text.includes("Surya Arghya")) remediesList.push("Surya Arghya");
        if (text.includes("Gayatri Mantra")) remediesList.push("Gayatri Mantra");
        if (text.includes("Gau-Seva") || text.includes("cow service")) remediesList.push("Gau-Seva");
        if (text.includes("mustard oil") || text.includes("Peepal")) remediesList.push("Peepal Tree Oil Lamp");
        if (text.includes("banana tree") || text.includes("Kadali")) remediesList.push("Kadali Tree Seva");
      }
    }
  }

  if (newPrescribedUpaya && !remediesList.includes(newPrescribedUpaya)) {
    remediesList.push(newPrescribedUpaya);
  }

  return {
    currentDomain: activeDomain,
    exploredDomains: Array.from(exploredDomainsSet),
    exploredHouses: Array.from(exploredHousesSet).sort((a, b) => a - b),
    prescribedRemedies: Array.from(new Set(remediesList)),
    activeCorrections: correctionsList,
    turnCount: Array.isArray(messages) ? messages.length : 1,
  };
}

/**
 * Formats consultation state into a clean instructions block for LLM continuity.
 */
export function formatConsultationStateBlock(state: ConsultationState): string {
  const lines = [
    "### CONSULTATION STATE & NARRATIVE ARC (PERSISTENT MEMORY):",
    `- Active Focus Domain: ${state.currentDomain.toUpperCase()}`,
    `- Previously Explored Domains: [${state.exploredDomains.join(", ")}]`,
    `- Analyzed Houses: [${state.exploredHouses.join(", ")}]`,
    `- Already Prescribed Remedies: [${state.prescribedRemedies.length > 0 ? state.prescribedRemedies.join(", ") : "None yet"}]`,
  ];

  if (state.activeCorrections && state.activeCorrections.length > 0) {
    lines.push("- ACTIVE SESSION USER CORRECTIONS (MANDATORY AXIOMS):");
    for (let i = 0; i < state.activeCorrections.length; i++) {
      const c = state.activeCorrections[i];
      lines.push(
        `  * [Correction Precedent #${i + 1}] User clarified: "${c.correction}" (Context: "${c.query}"). Strictly adopt this interpretation and avoid disputed claims.`
      );
    }
  }

  lines.push(
    "- Continuity Directive: Seamlessly connect your response to previous advice. Do not needlessly repeat already-prescribed remedies; evolve the consultation forward naturally."
  );

  return lines.join("\n");
}
