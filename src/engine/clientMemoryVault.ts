/**
 * Persistent Client Memory Vault & Anti-Amnesia Engine
 * Cross-session persistent retention of client life realities, milestones,
 * active remedial sadhana, and consultation history.
 *
 * Adheres strictly to the Zero-Name Frontend Rule.
 */

export interface ActiveSadhanaItem {
  id: string;
  remedyName: string;
  deityOrGraha: string;
  targetCount: number; // e.g. 108
  currentRepetition: number;
  completedDays: number; // e.g. 12 / 40
  targetDays: number; // 40
  startedAt: string;
  lastPracticedAt?: string;
  isCompleted?: boolean;
}

export interface ClientMemoryVault {
  version: number;
  clientCallingName?: string;
  maritalStatus?: "Married" | "Single" | "Divorced" | "Committed";
  hasChildren?: boolean;
  childrenDetails?: string;
  birthOrder?: "Eldest" | "Youngest" | "Middle" | "Only Child";
  residenceStatus?: "Relocated" | "Living in Birth Region";
  educationMilestones: string[];
  careerMilestones: string[];
  familyInitials: Record<string, string>;
  confirmedFacts: string[];
  activeSadhana: ActiveSadhanaItem[];
  lastConsultationDate?: string;
  consultationCount: number;
  notes: string[];
}

const VAULT_STORAGE_KEY = "vedic_client_memory_vault_v1";

/**
 * Returns default empty memory vault
 */
export function createDefaultMemoryVault(): ClientMemoryVault {
  return {
    version: 1,
    educationMilestones: [],
    careerMilestones: [],
    familyInitials: {},
    confirmedFacts: [],
    activeSadhana: [],
    consultationCount: 0,
    notes: [],
  };
}

/**
 * Loads the persistent memory vault from localStorage (client-side) or returns default.
 */
export function loadClientMemoryVault(): ClientMemoryVault {
  if (typeof window === "undefined" || !window.localStorage) {
    return createDefaultMemoryVault();
  }

  try {
    const raw = window.localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return createDefaultMemoryVault();
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      clientCallingName: parsed.clientCallingName,
      maritalStatus: parsed.maritalStatus,
      hasChildren: parsed.hasChildren,
      childrenDetails: parsed.childrenDetails,
      birthOrder: parsed.birthOrder,
      residenceStatus: parsed.residenceStatus,
      educationMilestones: Array.isArray(parsed.educationMilestones) ? parsed.educationMilestones : [],
      careerMilestones: Array.isArray(parsed.careerMilestones) ? parsed.careerMilestones : [],
      familyInitials: typeof parsed.familyInitials === "object" && parsed.familyInitials ? parsed.familyInitials : {},
      confirmedFacts: Array.isArray(parsed.confirmedFacts) ? parsed.confirmedFacts : [],
      activeSadhana: Array.isArray(parsed.activeSadhana) ? parsed.activeSadhana : [],
      lastConsultationDate: parsed.lastConsultationDate,
      consultationCount: typeof parsed.consultationCount === "number" ? parsed.consultationCount : 0,
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
  } catch (err) {
    console.warn("[ClientMemoryVault] Failed to parse vault from storage:", err);
    return createDefaultMemoryVault();
  }
}

/**
 * Persists the client memory vault to localStorage.
 */
export function saveClientMemoryVault(vault: ClientMemoryVault): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch (err) {
    console.warn("[ClientMemoryVault] Failed to persist vault to storage:", err);
  }
}

/**
 * Scans messages for client facts and synchronizes them into the persistent vault.
 */
export function syncMessagesToMemoryVault(
  messages: Array<{ role?: string; sender?: string; content?: string }>,
  existingVault?: ClientMemoryVault
): ClientMemoryVault {
  const vault = existingVault ? { ...existingVault } : loadClientMemoryVault();
  
  const userTexts = messages
    .filter((m) => m.role === "user" || m.sender === "user")
    .map((m) => (m.content || "").toLowerCase());
  const fullText = userTexts.join(" \n ");

  // 1. Calling Name
  const nameMatch = fullText.match(/\b(?:my name is|call me|i am|native's name is)\s+([a-z]{3,20})\b/i);
  if (nameMatch && !vault.clientCallingName && !/here|married|single|asking|curious|looking/i.test(nameMatch[1])) {
    vault.clientCallingName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
  }

  // 2. Marital Status
  if (/\b(i am married|married|my wife|my husband|my spouse|got married|we married)\b/.test(fullText)) {
    if (!/\b(not married|unmarried|single)\b/.test(fullText) || /\b(i am married|already married)\b/.test(fullText)) {
      vault.maritalStatus = "Married";
      addUniqueFact(vault.confirmedFacts, "💍 **Marital Reality:** **Married** (Explicitly confirmed by user).");
    }
  } else if (/\b(i am single|unmarried|single|not married yet)\b/.test(fullText)) {
    vault.maritalStatus = "Single";
    addUniqueFact(vault.confirmedFacts, "💍 **Marital Reality:** **Single / Unmarried** (Explicitly confirmed by user).");
  }

  // 3. Progeny / Children
  if (/\b(i have a kid|have a kid|have a child|have children|my kid|my child|my son|my daughter|blessed with a baby|with a son|with a daughter|have a son|have a daughter|a son|a daughter)\b/.test(fullText)) {
    vault.hasChildren = true;
    addUniqueFact(vault.confirmedFacts, "👶 **Progeny Reality:** **Has a Child / Children** (Explicitly confirmed by user).");
  }

  // 4. Sibling Position
  if (/\b(eldest|elder brother|elder sister|1st born|first born)\b/.test(fullText)) {
    vault.birthOrder = "Eldest";
    addUniqueFact(vault.confirmedFacts, "🌿 **Sibling Position:** **Eldest Child** (Confirmed by user).");
  } else if (/\b(youngest|younger brother|younger sister|last born)\b/.test(fullText)) {
    vault.birthOrder = "Youngest";
    addUniqueFact(vault.confirmedFacts, "🌿 **Sibling Position:** **Youngest Child** (Confirmed by user).");
  } else if (/\b(middle child|middle)\b/.test(fullText)) {
    vault.birthOrder = "Middle";
    addUniqueFact(vault.confirmedFacts, "🌿 **Sibling Position:** **Middle Child** (Confirmed by user).");
  } else if (/\b(only child)\b/.test(fullText)) {
    vault.birthOrder = "Only Child";
    addUniqueFact(vault.confirmedFacts, "🌿 **Sibling Position:** **Only Child** (Confirmed by user).");
  }

  // 5. Residence
  if (/\b(relocated|moved abroad|living in italy|living in usa|living in canada|living away from home)\b/.test(fullText)) {
    vault.residenceStatus = "Relocated";
    addUniqueFact(vault.confirmedFacts, "✈️ **Residence Status:** **Relocated away from birth region / Ancestral soil**.");
  } else if (/\b(home region|birth region|living in birth city|with parents)\b/.test(fullText)) {
    vault.residenceStatus = "Living in Birth Region";
    addUniqueFact(vault.confirmedFacts, "🏡 **Residence Status:** **Living in Birth Region**.");
  }

  // 6. Education Milestones
  const boardMatch = fullText.match(/10th (?:board )?(?:in )?(\d{4}(?:\s*[-–]\s*\d{4})?)/);
  if (boardMatch) {
    const entry = `10th Board in ${boardMatch[1]}`;
    if (!vault.educationMilestones.includes(entry)) vault.educationMilestones.push(entry);
    addUniqueFact(vault.confirmedFacts, `🎓 **Education Milestone:** 10th Board completed in **${boardMatch[1]}**.`);
  }

  const gradMatch = fullText.match(/(?:graduat\w*|btech|degree|college) (?:in )?(\d{4}(?:\s*[-–]\s*\d{4})?)/);
  if (gradMatch) {
    const entry = `Degree in ${gradMatch[1]}`;
    if (!vault.educationMilestones.includes(entry)) vault.educationMilestones.push(entry);
    addUniqueFact(vault.confirmedFacts, `🎓 **Higher Education Milestone:** College/Degree completed in **${gradMatch[1]}**.`);
  }

  // 7. Family Initials
  const fMatch = fullText.match(/\b(?:father(?:'s)? name (?:is|starts with)|father starts with)\s*([a-z])/i);
  if (fMatch) {
    vault.familyInitials.father = fMatch[1].toUpperCase();
    addUniqueFact(vault.confirmedFacts, `👨 **Father's Name Initial:** Starts with **"${fMatch[1].toUpperCase()}"**.`);
  }

  const mMatch = fullText.match(/\b(?:mother(?:'s)? name (?:is|starts with)|mother starts with)\s*([a-z])/i);
  if (mMatch) {
    vault.familyInitials.mother = mMatch[1].toUpperCase();
    addUniqueFact(vault.confirmedFacts, `👩 **Mother's Name Initial:** Starts with **"${mMatch[1].toUpperCase()}"**.`);
  }

  const sMatch = fullText.match(/\b(?:sister(?:'s)? name (?:is|starts with)|older sister.*(?:is|starts with))\s*([a-z])/i);
  if (sMatch) {
    vault.familyInitials.sister = sMatch[1].toUpperCase();
    addUniqueFact(vault.confirmedFacts, `👧 **Older Sister's Name Initial:** Starts with **"${sMatch[1].toUpperCase()}"**.`);
  }

  vault.lastConsultationDate = new Date().toISOString();
  saveClientMemoryVault(vault);
  return vault;
}

/**
 * Registers or updates an active sadhana in the client's memory vault.
 */
export function recordSadhanaProgress(
  remedyName: string,
  deityOrGraha: string,
  repsDelta: number,
  dayComplete: boolean = false
): ClientMemoryVault {
  const vault = loadClientMemoryVault();
  const id = `sadhana_${deityOrGraha.toLowerCase().replace(/\s+/g, "_")}`;
  
  let item = vault.activeSadhana.find((s) => s.id === id);
  if (!item) {
    item = {
      id,
      remedyName,
      deityOrGraha,
      targetCount: 108,
      currentRepetition: 0,
      completedDays: 0,
      targetDays: 40,
      startedAt: new Date().toISOString(),
    };
    vault.activeSadhana.push(item);
  }

  item.currentRepetition = Math.max(0, item.currentRepetition + repsDelta);
  if (item.currentRepetition >= item.targetCount) {
    item.currentRepetition = item.targetCount;
  }

  if (dayComplete) {
    item.completedDays = Math.min(item.targetDays, item.completedDays + 1);
    item.currentRepetition = 0; // reset for next day
    if (item.completedDays >= item.targetDays) {
      item.isCompleted = true;
    }
  }

  item.lastPracticedAt = new Date().toISOString();
  saveClientMemoryVault(vault);
  return vault;
}

/**
 * Generates an individualized welcome message for returning clients with verified life facts.
 */
export function buildReturningClientWelcome(vault: ClientMemoryVault): string {
  const namePart = vault.clientCallingName ? ` **${vault.clientCallingName}**` : "";
  const count = vault.consultationCount + 1;

  let knownContextSummary = "";
  if (vault.confirmedFacts.length > 0) {
    const briefBullets = vault.confirmedFacts.slice(0, 3).map((f) => f.replace(/\*\*/g, "")).join(" • ");
    knownContextSummary = `\n\n📌 **Verified Memory Profile:** ${briefBullets}`;
  }

  let sadhanaNote = "";
  const ongoingSadhana = vault.activeSadhana.find((s) => !s.isCompleted);
  if (ongoingSadhana) {
    sadhanaNote = `\n📿 **Active Sankalpa:** **${ongoingSadhana.remedyName}** (Day ${ongoingSadhana.completedDays}/${ongoingSadhana.targetDays})`;
  }

  return `**Pranam${namePart}!** 🙏 Welcome back to **Acharya Jyotish AI Pro** (Consultation #${count}).

I hold your complete natal horoscope and your previously verified life realities securely in memory.${knownContextSummary}${sadhanaNote}

How may I assist your astrological inquiry today? Feel free to ask about upcoming Dasha timing, career prospects, relationship dynamics, or classical remedies.`;
}

/**
 * Formats client memory vault realities for injection into the server-side system instruction.
 */
export function formatClientMemoryPromptContext(vault: ClientMemoryVault): string {
  if (vault.confirmedFacts.length === 0 && vault.activeSadhana.length === 0) {
    return "";
  }

  const sections: string[] = [];

  if (vault.confirmedFacts.length > 0) {
    sections.push(
      `🔒 PERSISTENT CLIENT MEMORY VAULT (CROSS-SESSION IMMUTABLE FACTS):\n` +
      vault.confirmedFacts.map((f) => `- ${f}`).join("\n")
    );
  }

  if (vault.activeSadhana.length > 0) {
    sections.push(
      `📿 ACTIVE 40-DAY REMEDIAL SANKALPAS IN PROGRESS:\n` +
      vault.activeSadhana
        .map(
          (s) =>
            `- ${s.remedyName} (${s.deityOrGraha}): Day ${s.completedDays}/${s.targetDays} ${
              s.isCompleted ? "[COMPLETED]" : "[ONGOING]"
            }`
        )
        .join("\n")
    );
  }

  return sections.join("\n\n");
}

function addUniqueFact(facts: string[], newFact: string): void {
  const norm = newFact.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const exists = facts.some((f) => f.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() === norm);
  if (!exists) {
    facts.push(newFact);
  }
}
