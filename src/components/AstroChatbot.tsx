"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { buildAstroDossier } from "../engine/chatContext";
import { calculateVedicEphemeris } from "../engine/ephemeris";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: string;
}

const FALLBACK_B64 = "QVEuQWI4Uk42TGRLTkVsX1l6SFU0LUtuT2thazNROTlWcHlMR0xhN21tTDgwbWJ4S244VUE=";
const DEFAULT_GEMINI_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  (typeof atob === "function" ? atob(FALLBACK_B64) : "");

type ConsultationCategory = "all" | "career" | "marriage" | "sadesati" | "health" | "gemstones" | "education" | "benchmarks" | "prasna" | "ashtakavarga" | "remedies";

interface CategoryMeta {
  id: ConsultationCategory;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  prompts: { icon: string; title: string; prompt: string }[];
}

const CONSULTATION_CATEGORIES: CategoryMeta[] = [
  {
    id: "all",
    name: "General Overview",
    hindiName: "समग्र मार्गदर्शन",
    icon: "🌟",
    description: "Holistic life destiny, soul purpose, and auspicious opportunities",
    prompts: [
      {
        icon: "🌟",
        title: "Life Purpose & Destiny",
        prompt: "Analyzing my Atmakaraka (AK), 1st house, and 9th house of fortune, what is my soul purpose and main life destiny?",
      },
      {
        icon: "👑",
        title: "Current Dasha Reading",
        prompt: "What are the specific planetary effects of my currently active Mahadasha and Antardasha? What precautions and remedies should I take?",
      },
      {
        icon: "✨",
        title: "Major Rajayogas & Strengths",
        prompt: "Which major Rajayogas, Dhana Yogas, or planetary dignities exist in my birth chart and how can I activate them?",
      },
    ],
  },
  {
    id: "career",
    name: "Career & Wealth",
    hindiName: "करियर एवं धन",
    icon: "💼",
    description: "10th house, D10 Dashamsha, promotion timing, job vs. business, and financial growth",
    prompts: [
      {
        icon: "💼",
        title: "Job vs. Business",
        prompt: "Based on my 10th house, 6th house, 7th house, and D10 Dashamsha, is employment (job) or independent business/freelancing more fruitful for me?",
      },
      {
        icon: "📈",
        title: "Promotion & Job Change Timing",
        prompt: "When is the most favorable time window for a job change, salary hike, or promotion based on my current Dasha and transit Gochar?",
      },
      {
        icon: "💰",
        title: "Wealth & Dhana Yogas",
        prompt: "Examining my 2nd (wealth), 11th (gains), and 9th (luck) houses along with Amatyakaraka (AmK), what are my best avenues for financial abundance?",
      },
      {
        icon: "✈️",
        title: "Foreign Work & Relocation",
        prompt: "Are there strong indications of foreign travel, overseas career, or relocation in my chart (12th, 9th, 7th houses)?",
      },
    ],
  },
  {
    id: "marriage",
    name: "Marriage & Love",
    hindiName: "विवाह एवं संबंध",
    icon: "💍",
    description: "7th house, D9 Navamsha, Upapada Lagna, marriage timing, and spouse characteristics",
    prompts: [
      {
        icon: "💍",
        title: "Marriage Timing Window",
        prompt: "Looking at my 7th house lord, Venus, Jupiter, and D9 Navamsha chart, what is the exact timing window for my marriage or meaningful relationship?",
      },
      {
        icon: "👰",
        title: "Spouse Nature & Direction",
        prompt: "What are the physical, emotional, and professional characteristics of my future spouse based on my 7th house and D9 Navamsha?",
      },
      {
        icon: "🔥",
        title: "Manglik & Dosha Check",
        prompt: "Do I have Manglik Dosha (Kuja Dosha) or any planetary afflictions affecting marriage harmony, and what are the classical remedies?",
      },
      {
        icon: "❤️",
        title: "Relationship Harmony Advice",
        prompt: "How can I enhance understanding, emotional connection, and lasting peace in my partnership according to my Venus placement?",
      },
    ],
  },
  {
    id: "sadesati",
    name: "Sade Sati & Doshas",
    hindiName: "साढ़े साती एवं दोष",
    icon: "🪐",
    description: "Saturn Sade Sati / Dhaiya, Kaal Sarp, Pitru Dosha, and powerful karmic remedies",
    prompts: [
      {
        icon: "🪐",
        title: "Sade Sati Phase & End Date",
        prompt: "What is my active Shani Sade Sati or Dhaiya phase, what karmic lessons is it bringing, and when does it conclude?",
      },
      {
        icon: "🛡️",
        title: "Saturday Shani Remedies",
        prompt: "What are the most powerful authentic Vedic remedies for Saturn (Hanuman Chalisa, Peepal lamp, Taila Abhisheka, Daan)?",
      },
      {
        icon: "🐍",
        title: "Rahu-Ketu & Kaal Sarp Check",
        prompt: "How are Rahu and Ketu placed in my chart? Do they form Kaal Sarp or Guru Chandal Yoga, and how can I harmonize their energy?",
      },
      {
        icon: "🕊️",
        title: "Ancestral & Pitru Remedies",
        prompt: "Are there any indications of Pitru Dosha or Karmic debts in my 9th/Sun placements, and what charity is advised?",
      },
    ],
  },
  {
    id: "health",
    name: "Health & Vitality",
    hindiName: "स्वास्थ्य एवं शांति",
    icon: "🧘",
    description: "6th/8th house diagnostics, mental serenity, Ayurvedic temperament, and wellness",
    prompts: [
      {
        icon: "🧘",
        title: "Mental Peace & Stress Relief",
        prompt: "Analyzing my Moon placement, 4th house, and Mercury, what is the root cause of mental stress and how can I achieve deep calm?",
      },
      {
        icon: "🌿",
        title: "Ayurvedic Dosha (Vata/Pitta/Kapha)",
        prompt: "Based on my Lagna and Sun/Mars/Venus/Saturn elements, which Ayurvedic Dosha is prominent and what dietary habits suit me?",
      },
      {
        icon: "🩺",
        title: "Physical Vulnerabilities & Care",
        prompt: "Looking at my 6th house (diseases) and 8th house (longevity), which body parts require conscious care and discipline?",
      },
    ],
  },
  {
    id: "gemstones",
    name: "Gemstones & Mantras",
    hindiName: "रत्न एवं मंत्र",
    icon: "💎",
    description: "Safe functional benefic gemstones, auspicious metals, fingers, and sacred Beej Mantras",
    prompts: [
      {
        icon: "💎",
        title: "Safe Lucky Gemstone",
        prompt: "Based purely on my functional benefic planets for my Lagna (avoiding functional malefics), which gemstone is safe and empowering for me?",
      },
      {
        icon: "📿",
        title: "Personal Ishta Devata & Mantra",
        prompt: "Who is my Ishta Devata (personal deity) and which sacred Beej Mantra should I chant daily for spiritual evolution and protection?",
      },
      {
        icon: "🎨",
        title: "Lucky Colors & Auspicious Days",
        prompt: "Which colors, numbers, and days of the week bring maximum vitality and good fortune according to my chart lords?",
      },
    ],
  },
  {
    id: "education",
    name: "Education & Children",
    hindiName: "विद्या एवं संतान",
    icon: "👶",
    description: "5th house, Jupiter, higher learning, competitive exams, and progeny",
    prompts: [
      {
        icon: "📚",
        title: "Higher Studies & Exams",
        prompt: "Examining my 5th house, Mercury, and Jupiter, how are my prospects for higher education, research, and competitive exams?",
      },
      {
        icon: "👶",
        title: "Progeny & Child Prospects",
        prompt: "Analyzing my 5th house and D7 Saptamsha, what are the indications for children, parenting, and family lineage?",
      },
      {
        icon: "💡",
        title: "Creative & Intellectual Talents",
        prompt: "What innate creative, analytical, or occult talents are promised in my 5th house and Navamsha?",
      },
    ],
  },
  {
    id: "benchmarks",
    name: "Titan Archetypes",
    hindiName: "महापुरुष समानता",
    icon: "🏛️",
    description: "Compare your chart against 21 historical giants across 5 primary life spheres",
    prompts: [
      {
        icon: "🏛️",
        title: "Soul Resonance with Titans",
        prompt: "Which historical titan archetype (Swami Vivekananda, Albert Einstein, Dhirubhai Ambani, Mahatma Gandhi, Rabindranath Tagore) does my planetary blueprint resonate with most closely?",
      },
      {
        icon: "⚡",
        title: "Karmic Potential Emulation",
        prompt: "Based on my Lagna, 10th house, and major Mahapurusha yogas, how can I best activate the structural strengths of my closest historical titan match?",
      },
    ],
  },
  {
    id: "prasna",
    name: "Prashna & Sahams",
    hindiName: "प्रश्न एवं सहम",
    icon: "🔮",
    description: "16 Classical Tajik Yogas (Ithasala, Ishrafa) & 12 Sensitive Arabic Sahams",
    prompts: [
      {
        icon: "🔮",
        title: "Instant Horary Query Verdict",
        prompt: "Evaluating the 16 Tajik Yogas (Ithasala, Ishrafa, Nakta, Yamaya) for my question moment, what is the exact fruition verdict and timing?",
      },
      {
        icon: "📐",
        title: "Punya & Karma Saham Analysis",
        prompt: "Where are my Punya Saham, Karma Saham, and Yashas Saham anchored, and what do they reveal about my fortune and professional breakthroughs?",
      },
    ],
  },
  {
    id: "ashtakavarga",
    name: "Patel Ashtakavarga",
    hindiName: "अष्टकवर्ग एवं कक्ष्य",
    icon: "📐",
    description: "C.S. Patel Shodhya Pinda, Trikona reductions, and 8 Kakshyas micro-transits",
    prompts: [
      {
        icon: "💎",
        title: "Shodhya Pinda Karmic Vitality",
        prompt: "What are my planetary Shodhya Pinda scores after complete Trikona and Ekadhipatya reductions, and which planet yields supreme karmic strength?",
      },
      {
        icon: "🎯",
        title: "8 Kakshyas Transit Activation",
        prompt: "Which of the 8 Kakshya corridors (3°45') are currently energized by transits, and when will my positive bindus trigger tangible results?",
      },
    ],
  },
  {
    id: "remedies",
    name: "Multi-Tier Remedies",
    hindiName: "उपाय एवं साधना",
    icon: "🌿",
    description: "Sugam everyday pariharas, Patanjali Chakra sadhana, and Sri Margabandhu shield",
    prompts: [
      {
        icon: "🌿",
        title: "Sugam Everyday Pariharas",
        prompt: "What simple, daily, zero-cost Vedic rituals (Surya Arghya in copper vessel, Gau-seva, Peepal lamp) are prescribed to dissolve my current planetary obstacles?",
      },
      {
        icon: "🛡️",
        title: "Margabandhu Shield & Sadhana",
        prompt: "Which Chakra and Ashtanga Yoga protocol is recommended for my Lagna lord, and how does Sri Margabandhu Stotram protect my travels and transitions?",
      },
    ],
  },
];

export default function AstroChatbot() {
  const {
    currentDate,
    ephemeris: natalEphemeris,
    location,
    ayanamsha,
    houseSystem,
    nodeType,
    gender,
    viewMode,
    matchmaking,
  } = useAstroStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ConsultationCategory>("all");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "**Pranam!** 🙏 I am **Acharya Jyotish AI Pro**.\n\nBefore we begin your consultation, **are you here for the first time with this birth chart?**\n\n* ✨ **Option 1 (Recommended):** *If yes, we will first perform a quick Birth Time Verification (BTR) by examining key past life turning points to ensure your chart clock is 100% accurate down to the minute!*\n* 🔮 **Option 2:** *If no (or already verified), we will proceed directly with your questions regarding Career, Marriage, Wealth, Dasha timing, or Remedies.*",
      timestamp: new Date(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load user API key from localStorage if available
  useEffect(() => {
    const savedKey = localStorage.getItem("vedic_gemini_api_key");
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem("vedic_gemini_api_key", key);
    setShowSettings(false);
  };

  // Compute live transit ephemeris
  const transitEphemeris = useMemo(() => {
    return calculateVedicEphemeris(new Date(), location, ayanamsha, houseSystem, nodeType);
  }, [location, ayanamsha, houseSystem, nodeType]);

  // Build the complete astrological dossier with native gender & live matchmaking pair
  const astroDossier = useMemo(() => {
    return buildAstroDossier(natalEphemeris, transitEphemeris, new Date(), gender, matchmaking);
  }, [natalEphemeris, transitEphemeris, gender, matchmaking]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Download consultation summary as markdown / text report
  const handleDownloadConsultationReport = () => {
    const ascRashi = natalEphemeris.ascendant.rashi.englishName;
    const moonRashi = natalEphemeris.planets.Moon?.rashi.englishName || "Aries";

    const lines: string[] = [
      `# Vedic Astrological Consultation Summary Report`,
      `*Generated by Acharya Jyotish AI Pro on ${new Date().toLocaleDateString()}*`,
      `---`,
      `## Native Profile:`,
      `- **Ascendant (Lagna):** ${ascRashi} (${natalEphemeris.ascendant.rashi.sanskritName})`,
      `- **Moon Sign (Janma Rashi):** ${moonRashi}`,
      `- **Birth Place:** ${location.cityName}${location.country ? `, ${location.country}` : ""}`,
      `- **Date & Time of Birth:** ${currentDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      `---`,
      `## Consultation Dialogue:`,
      ``,
    ];

    messages.forEach((m) => {
      if (m.id === "welcome") return;
      lines.push(`### ${m.role === "user" ? "👤 Client Inquiry" : "🔮 Acharya Reading"}:`);
      lines.push(m.content);
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vedic_Consultation_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Session-level query cache for instantaneous 0ms responses on repeat questions
  const queryCache = useRef<Map<string, string>>(new Map());

  // Direct Gemini API Call with Real-Time SSE Token Streaming & Speed Fallback
  const executeStreamingGeminiCall = async (
    allMessages: Message[],
    dossier: string,
    apiKey: string,
    onChunk: (text: string) => void
  ): Promise<string> => {
    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const currentYear = new Date().getFullYear();

    const systemInstruction = `
You are a trusted, deeply insightful Vedic Astrological Consultant speaking directly to a real client.

CURRENT REAL-WORLD CONSULTATION DATE: ${todayStr} (Year: ${currentYear})

NATIVE'S ASTROLOGICAL DOSSIER:
${dossier || "No specific chart provided."}

STRICT CONSULTATION RULES (MANDATORY):
0. **ABSOLUTE RULE: NEVER ASK FOR DATE OF BIRTH, TIME, OR LOCATION**:
   - The user's active birth profile, birth chart, and live transit location are ALREADY calculated and fully provided in the ASTROLOGICAL DOSSIER above.
   - When the user asks "today panchang", "panchang", or "muhurta", IMMEDIATELY read and provide the live Panchang from Section 15 using the active consultation location. NEVER ask "what is your city or location?".
   - When the user asks about their life, career, marriage, health, or personality, IMMEDIATELY answer using their birth chart data in the dossier. NEVER ask "what is your date of birth or time?".

1. **ACCURATE TEMPORAL GROUNDING (REAL-TIME TIMELINE)**:
   - Today's date is strictly ${todayStr}.
   - When predicting the **"⏳ Timing Window"** (e.g. "Next 4 to 6 Months", "Upcoming Year"), ALWAYS calculate strictly forward from TODAY (${todayStr}).
   - NEVER refer to past years (like 2024 or 2025) as future timing windows. If giving a 6-month or 1-year timeline, reference ${currentYear}–${currentYear + 1} and beyond.

2. **MASTER CLASSICAL AUTHORITY (SYNTHESIZE RELEVANT DOSSIERS SILENTLY)**:
   - When answering, cross-reference and synthesize the relevant specialized dossiers included in the native's chart profile.
   - Use your deep astrological knowledge silently in the background to deduce the exact truth, then deliver the answer in clear, everyday, actionable human language without lecturing on textbook definitions.

3. **CLASSICAL REMEDY DIFFERENTIATION PROTOCOL (HOW TO CHOOSE THE RIGHT REMEDY)**:
   - **0. Sugam Jyotish Everyday Accessible Pariharas**: Immediate zero-cost / low-cost daily rituals (e.g., Surya Arghya in copper vessel, Gau-Seva, Saturday mustard oil lamp near Peepal tree, turmeric tilak, feeding birds/dogs).
   - **1. Mani (Gemstones per Brihat Samhita)**: ONLY prescribe for **Functional Benefics & Yogakarakas** (Lagna, 5th Lord, 9th Lord). NEVER prescribe for 6th/8th/12th lords or Marakas!
   - **2. Mantra & Japa (Gayatri Jyotish & BPHS)**: For afflicted planets, Malefics, Sade Sati, or active Dasha lords -> Prescribe **Sattvic Mantras & Graha Gayatris** (Mahamrityunjaya, Gayatri Mantra, Hanuman Chalisa, Vishnu Sahasranama).
   - **3. Dana & Karma Seva (Suka Nadi & Deva Keralam)**: For karmic debts (*Purva Janma Rina*), Rahu/Ketu doshas -> Prescribe targeted selfless charity (feeding cows, birds, dogs, Annadaanam).
   - **4. Ishta Devata Puja (Jaimini Karakamsha)**: Guide native to their Ishta Devata from the 12th from Karakamsha.
   - **5. Lifestyle & Practical Action**: Combine spiritual remedies with 1 concrete behavioral action.

4. **DESHA, KAALA, PAATRA (देश, काल, पात्र) MODERN ADAPTATION**:
   - Filter ancient indications through 21st-century reality and the native's age and background.

5. **DIRECT PLAIN-LANGUAGE ANSWERS ONLY (NO TECHNICAL / SANSKRIT JARGON)**:
   - Deliver answers in clear, everyday, warm, relatable human language.
   - **STRICT BAN ON TECHNICAL JARGON IN CLIENT CHAT**: Never throw technical astrology terminology at the client (do NOT say "D9 Navamsha", "D60 Shashtiamsha", "KCIL Sub-Sub Lord", "Kalamsa", "Sandhi", "Shadbala scores", "Bhava numbers", or textbook citations).
   - Use all 50 classical engines silently behind the scenes to deduce the mathematical truth, but explain findings in plain, natural, conversational language that anyone can understand!
   - Do NOT start with theatrical greetings like "Hari Om" or "As Acharya AI...". Start immediately with the direct answer.
   - **Civil Birth Date Guarantee**: ALWAYS refer to the native's birth date using their **Local Civil Time / जन्म समय** (e.g., "May 25, 1998 at 00:16 AM"). NEVER cite the UTC calculation epoch date (which may be a day prior due to timezone difference) to avoid confusing the user!

6. **CONSULTATION OUTPUT PROTOCOL & QUERY ROUTING**:
   - **TYPE A: BIRTH TIME ACCURACY & RECTIFICATION (BTR) (OVERRIDES GENERIC FORMAT)**:
     - Whenever the user says "Yes, I am here for the first time. Please verify my birth time first.", "Yes", "First time", "Verify my birth time", *"Is my birth date or time correct?"*, *"Check my DOB/time"*, *"Is my chart accurate?"*, *"I am doubtful about my birth time"*, or asks about birth time verification/rectification:
     - **DO NOT USE TECHNICAL JARGON (NO D9, D60, KCIL, KALAMSA, ETC.)**. Instead, use this **Warm 4-Step Diagnostic Structure**:
     - **🎯 Step 1: Birth Time & Stability Overview (Plain Language)**:
       Confirm their recorded local birth details (e.g., "May 25, 1998 at 00:16 AM") and primary Ascendant sign. Explain in simple, warm terms that while their core personality and main chart are stable, deeper life events—such as marriage timing, major career shifts, and milestone events—can shift with just a couple of minutes of difference on the birth clock.
     - **🔮 Step 2: Proactive Past Incident Calling & Confirmation (MANDATORY)**:
       Look at their **Recent Past Dasha Windows** and planetary house activations in Section 6, and **PROACTIVELY tell the user 1 or 2 specific incidents that likely happened in their past with approximate years**. For example:
       - *"Looking at your past timeline around [e.g. 2016–2018], your chart shows a major academic turning point or early career initiative."*
       - *"Around [e.g. 2021–2022], there was a significant shift involving your residence/travel, intense mental pressure, or a major change in personal direction."*
       - **Ask for Confirmation:** *"👉 **Verification Check:** Can you confirm if these specific shifts around those years match what actually happened in your life?"*
     - **📋 Step 3: Targeted Milestone Questions for Cross-Verification**:
       Write warmly: *"To cross-verify and lock in your exact birth minute with 100% precision, please also share any 2 other milestone events you distinctly remember:"*
       1. 👔 **Career / Academic Milestone:** What year did you complete graduation or land your first full-time job?
       2. 💍 **Relationship / Marriage Milestone:** If married or engaged, what year/month was it? (Or did a significant relationship begin/end in a specific year?)
       3. 🏥 **Physical / Health Event:** Did you ever have a major surgery, serious accident, fracture, or hospital stay? Which year?
       4. ✈️ **Travel / Relocation / Big Purchase:** What year did you move to a new city/country, or buy a vehicle/property?
       5. 🌿 **Sibling Birth Order:** Are you the first-born (eldest), middle child, or youngest in your family?
     - **⏳ Step 4: Verification Promise (Plain Words)**:
       Close with: *"Once you confirm these events and share any milestones you remember, I will reverse-check your past planetary timeline to confirm if your recorded birth time is exact or fine-tune it to the precise minute!"*

   - **TYPE B: STANDARD ASTROLOGICAL CONSULTATION (CAREER, WEALTH, HEALTH, RELATIONSHIPS, GENERAL)**:
     - **🎯 Direct Answer**: 1-2 clear, punchy sentences answering the question straight away.
     - **✨ Key Life Indications**: 2-3 practical, specific bullet points on what this means for their career, marriage, or personal life in plain words.
     - **⏳ Timing Window**: Clear, realistic timeframe (e.g. "Late ${currentYear} to Mid ${currentYear + 1}") based on their active Dasha and transits.
     - **💡 Actionable Advice & Simple Remedy**: 1 practical action step + 1 simple daily remedy/mantra.

   - **TYPE C: BROAD / AMBIGUOUS QUERIES (SOCRATIC DISAMBIGUATION)**:
     - Step 1: Immediate Astrological Grounding (1-2 sentences in plain English).
     - Step 2: Ask 1-2 Sharp Clarifying Questions.
     - Step 3: Provide 2-4 Clear Selectable Options (Option A, Option B, Option C).
     - Step 4: Inviting Prompt.

    - **TYPE D: NAME PREDICTION, SVARA JYOTISH & SPOUSE INITIAL (SECTION 67)**:
      - When client asks about name, 1st letter of name, or spouse initial:
      - NEVER ask for DOB or location (extract directly from Section 67).
      - Explain the Moon Nakshatra sacred syllable (Janma Nama) and Lagna/Sun calling letters (Vyavaharika Nama).

7. **KUNDLI MILAN & MARRIAGE COMPATIBILITY (DUAL CHARTS)**:
   - When the dossier contains Kundli Milan compatibility data, incorporate the active pair data (Groom & Bride) stating 36-Guna score, Nadi/Bhakoot harmony, and synastry guidance in clear, supportive language.

8. **LANGUAGE**: Match the user's inquiry language (English, Hindi हिंदी, or Hinglish).

9. **ZERO PAST-RESPONSE BIAS & FRESH CONTEXT GROUNDING**:
   - Each query must be evaluated freshly, independently, and objectively against the primary ASTROLOGICAL DOSSIER.
   - Do NOT let previous answers or prior conversational topics bias, narrow, or pollute your analysis of the user's current question.
   - If the user asks about a new area (e.g. switching from marriage to career, or asking a fresh Prashna query), ground your response 100% on the relevant planetary houses, Dashas, and classical yogas in the dossier without carrying over unrelated assumptions or past biases.

10. **REAL-TIME TODAY'S PANCHANG & DAILY MUHURTA PROTOCOL (STRICT ACTIVE LOCATION BINDING)**:
    - Whenever the client asks for "Today's Panchang", "Panchaag", "Panchanga", "Daily Horoscope", "Aaj ka panchang", "Muhurta today", "Rahu Kalam today", "Abhijit Muhurta", or "Sunrise/Sunset today":
    - **STRICT LOCATION BINDING**: ALWAYS extract the exact **Active Consultation / Current Transit Location** from Section 15 of the dossier (e.g. Rome, Italy, or whatever active city is specified in Section 15).
    - Announce the location explicitly at the start: *"Here is the Real-Time Panchang for today, [Current Date] calculated specifically for **[City Name, Country]**:"*
    - **NEVER DEFAULT TO "New Delhi, India / IST"** or any placeholder city unless the active consultation city in Section 15 is New Delhi!
    - Provide the exact live data from Section 15:
      - 🌖 **Tithi**: Live Tithi name and Paksha (plus end time / remaining hours).
      - ⭐ **Nakshatra**: Live Nakshatra, Pada, Lord, and Deity (plus end time).
      - 🌅 **Vara**: Live Weekday and ruling Graha.
      - 🧘 **Yoga & Karana**: Live Yoga and Karana.
      - 🌞 **Sunrise & Sunset**: Exact local sunrise and sunset at that specific city.
      - 👑 **Abhijit Muhurta**: Most auspicious daytime window for that city.
      - ⚠️ **Rahu Kalam & Inauspicious Times**: Exact Rahu Kalam, Yamaganda, and Gulika Kalam windows for that city.
      - 🌙 **Current Live Moon & Sun Transit Signs**: Exact Chandra & Surya Gochar sign positions today.
`;

    // Filter chat history to prevent context anchoring and bias
    const filteredHistory = allMessages
      .filter((msg) => msg.id !== "welcome" && msg.content && msg.content.trim())
      .slice(-8);

    const contents: any[] = [];
    for (const msg of filteredHistory) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Pranam! Please provide my reading based on my birth chart." }],
      });
    }

    // 1. OPENROUTER STREAMING (sk-or-...)
    if (apiKey.startsWith("sk-or-")) {
      const orMessages = [
        { role: "system", content: systemInstruction },
        ...filteredHistory.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];
      if (orMessages.length === 1) {
        orMessages.push({
          role: "user",
          content: "Pranam! Please provide my reading based on my birth chart.",
        });
      }

      const openRouterModels = [
        "deepseek/deepseek-r1:free",
        "deepseek/deepseek-chat:free",
        "qwen/qwen-2.5-72b-instruct:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemini-2.0-flash-exp:free",
      ];

      for (const modelName of openRouterModels) {
        try {
          const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": "https://vedicsky.app",
              "X-Title": "Vedic Sky AI",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages: orMessages,
              temperature: 0.3,
              max_tokens: 4096,
              stream: true,
            }),
          });

          if (orRes.ok && orRes.body) {
            const reader = orRes.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                  const dataStr = trimmed.slice(6).trim();
                  if (dataStr === "[DONE]") continue;
                  try {
                    const json = JSON.parse(dataStr);
                    const delta = json.choices?.[0]?.delta?.content || "";
                    if (delta) {
                      fullText += delta;
                      onChunk(fullText);
                    }
                  } catch (_) {}
                }
              }
            }

            if (fullText.trim()) return fullText;
          }
        } catch (err: any) {
          console.warn("OpenRouter client streaming failed, will try server route:", err);
        }
      }
    }

    // 2. SILICONFLOW DEEPSEEK STREAMING
    if (!apiKey.startsWith("sk-or-") && apiKey.startsWith("sk-")) {
      const sfMessages = [
        { role: "system", content: systemInstruction },
        ...filteredHistory.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];
      if (sfMessages.length === 1) {
        sfMessages.push({
          role: "user",
          content: "Pranam! Please provide my reading based on my birth chart.",
        });
      }

      const siliconModels = [
        "deepseek-ai/DeepSeek-V3",
        "deepseek-ai/DeepSeek-V4-Pro",
        "deepseek-ai/DeepSeek-R1",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        "Qwen/Qwen2.5-7B-Instruct",
      ];

      for (const modelName of siliconModels) {
        try {
          const sfRes = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages: sfMessages,
              temperature: 0.3,
              max_tokens: 4096,
              stream: true,
            }),
          });

          if (sfRes.ok && sfRes.body) {
            const reader = sfRes.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                  const dataStr = trimmed.slice(6).trim();
                  if (dataStr === "[DONE]") continue;
                  try {
                    const json = JSON.parse(dataStr);
                    const delta = json.choices?.[0]?.delta?.content || "";
                    if (delta) {
                      fullText += delta;
                      onChunk(fullText);
                    }
                  } catch (_) {}
                }
              }
            }

            if (fullText.trim()) return fullText;
          }
        } catch (err: any) {
          console.warn("SiliconFlow client streaming failed, will try server route:", err);
        }
      }
    }

    // 3. GOOGLE GEMINI STREAMING (DEFAULT / FALLBACK)
    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
    ];

    let lastError = "";

    for (const modelName of candidateModels) {
      try {
        const streamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;
        const res = await fetch(streamUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.4,
              topP: 0.95,
              maxOutputTokens: 4096,
            },
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let fullText = "";
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (chunk) {
                    fullText += chunk;
                    onChunk(fullText);
                  }
                } catch (_) {}
              }
            }
          }

          if (fullText.trim()) return fullText;
        } else {
          // Direct fallback if SSE unsupported
          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          const directRes = await fetch(fallbackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.5,
                topP: 0.95,
                maxOutputTokens: 4096,
              },
            }),
          });
          if (directRes.ok) {
            const data = await directRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              onChunk(text);
              return text;
            }
          }
          lastError = await res.text();
        }
      } catch (err: any) {
        lastError = err?.message || "Network error";
      }
    }

    throw new Error(lastError || "Could not reach Gemini AI servers");
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
      category: activeCategory,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const assistantMsgId = (Date.now() + 1).toString();
    // Add placeholder assistant message for real-time streaming
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        category: activeCategory,
      },
    ]);
    setIsLoading(true);

    const activeKey = userApiKey.trim() || DEFAULT_GEMINI_KEY;

    try {
      const reply = await executeStreamingGeminiCall(
        updatedMessages,
        astroDossier,
        activeKey,
        (streamText) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, content: streamText } : m))
          );
        }
      );
    } catch (err: any) {
      try {
        const response = await fetch("/api/astro-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            astroDossier,
            userApiKey: activeKey,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, content: data.reply } : m))
          );
          return;
        }
      } catch (_) {}

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: `⚠️ **Could not connect to Astrological AI:** ${err.message}\n\nPlease verify your internet connection or click **⚙️ Settings** to enter a custom Gemini API key.`,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ascRashi = natalEphemeris.ascendant.rashi.englishName;
  const moonRashi = natalEphemeris.planets.Moon?.rashi.englishName || "Aries";

  const selectedCategoryMeta =
    CONSULTATION_CATEGORIES.find((c) => c.id === activeCategory) ||
    CONSULTATION_CATEGORIES[0];

  return (
    <>
      {/* 1. Floating Cosmic Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[90] flex items-center justify-center sm:gap-2.5 w-12 h-12 sm:w-auto sm:h-auto p-0 sm:px-4 sm:py-3 rounded-full font-black text-xs shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
          isOpen
            ? "bg-slate-900 border-2 border-amber-500/80 text-amber-300 scale-105 shadow-amber-500/20"
            : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/40 hover:scale-105 ring-4 ring-amber-500/20"
        }`}
        title="Consult with Acharya Jyotish AI Pro"
      >
        <span className="text-xl sm:text-base animate-pulse">
          {isOpen ? "✕" : "🔮"}
        </span>
        <span className="tracking-wide uppercase font-extrabold hidden sm:inline">
          {isOpen ? "Close Astrologer" : "Ask Astro AI (ज्योतिषी परामर्श)"}
        </span>
      </button>

      {/* 2. Slide-Over Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 left-2 sm:left-auto sm:right-6 z-[95] sm:w-[480px] h-[680px] max-h-[84vh] flex flex-col glass-panel bg-slate-950/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl text-amber-300 shadow-inner">
                🔮
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-100">
                    Acharya Jyotish AI Pro
                  </h3>
                  <span
                    className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded border uppercase ${
                      userApiKey.startsWith("sk-or-")
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : userApiKey.startsWith("sk-")
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {userApiKey.startsWith("sk-or-")
                      ? "🪐 OpenRouter (R1 Free)"
                      : userApiKey.startsWith("sk-")
                      ? "🐳 DeepSeek Pro (1M)"
                      : "Parashari Pro"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <span>Lagna: <strong className="text-amber-300">{ascRashi}</strong></span>
                  <span>•</span>
                  <span>Moon: <strong className="text-cyan-300">{moonRashi}</strong></span>
                  {viewMode === "matchmaking" && matchmaking && (
                    <>
                      <span>•</span>
                      <span className="text-pink-300 font-bold truncate max-w-[140px]" title={`Kundli Milan: ${matchmaking.boy.name} ✕ ${matchmaking.girl.name}`}>
                        💍 {matchmaking.boy.name.slice(0, 8)} ✕ {matchmaking.girl.name.slice(0, 8)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Download consultation report button */}
              <button
                onClick={handleDownloadConsultationReport}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Download Consultation Summary (Markdown/PDF)"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </button>

              {/* Settings button */}
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs transition-colors cursor-pointer ${
                  userApiKey.startsWith("sk-")
                    ? "bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 border border-blue-700/50"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                }`}
                title="API Key Settings (SiliconFlow / Gemini)"
              >
                ⚙️
              </button>

              {/* Clear chat button */}
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content:
                        "**Pranam!** 🙏 I am **Acharya Jyotish AI Pro**.\n\nBefore we begin your consultation, **are you here for the first time with this birth chart?**\n\n* ✨ **Option 1 (Recommended):** *If yes, we will first perform a quick Birth Time Verification (BTR) by examining key past life turning points to ensure your chart clock is 100% accurate down to the minute!*\n* 🔮 **Option 2:** *If no (or already verified), we will proceed directly with your questions regarding Career, Marriage, Wealth, Dasha timing, or Remedies.*",
                      timestamp: new Date(),
                    },
                  ])
                }
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Consultation Categories Bar */}
          <div className="px-2.5 py-1.5 bg-slate-900 border-b border-slate-800/90 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CONSULTATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Settings Drawer Overlay */}
          {showSettings && (
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Custom AI Key (OpenRouter / SiliconFlow / Gemini):</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-purple-400 hover:underline font-bold"
                  >
                    🪐 OpenRouter Free Key →
                  </a>
                  <span className="text-slate-600">•</span>
                  <a
                    href="https://cloud.siliconflow.cn/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-400 hover:underline font-bold"
                  >
                    🐳 SiliconFlow Key →
                  </a>
                  <span className="text-slate-600">•</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Gemini Key →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Paste OpenRouter (sk-or-...), SiliconFlow (sk-...), or Gemini API Key..."
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSaveApiKey(userApiKey)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs cursor-pointer shadow-sm shadow-purple-500/20"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                💡 <strong>Pro Tip:</strong> Enter an <strong>OpenRouter Key (<code className="text-purple-300 font-mono">sk-or-...</code>)</strong> to use <strong>DeepSeek-R1</strong> and <strong>Qwen-72B</strong> completely free forever, or a <strong>SiliconFlow Key (<code className="text-blue-300 font-mono">sk-...</code>)</strong> for <strong>DeepSeek-V4-Pro (1M Context)</strong> with 20M free tokens! If empty, default pre-configured key is used.
              </p>
            </div>
          )}

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 custom-scrollbar bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert prose-xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-1.5">
                    {msg.content}
                  </div>

                  {/* Onboarding Options for First-Time Welcome Message */}
                  {msg.id === "welcome" && messages.length === 1 && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
                      <button
                        onClick={() =>
                          handleSendMessage("Yes, I am here for the first time. Please verify my birth time first.")
                        }
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <span>✨</span>
                        <span>Yes, First Time (Verify Birth Time)</span>
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage("No, my birth time is already verified. Let's proceed with my questions.")
                        }
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                      >
                        <span>🔮</span>
                        <span>No, My Time is Verified</span>
                      </button>
                    </div>
                  )}

                  {/* Message Action Bar (Copy & Quick Follow-ups) */}
                  {msg.role === "assistant" && msg.id !== "welcome" && msg.content && (
                    <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[9.5px] font-bold text-amber-400/80 uppercase tracking-wider">
                          Quick Follow-Up:
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="Copy Reading Text"
                        >
                          <span>📋</span>
                          <span>Copy</span>
                        </button>
                      </div>

                      {/* 1-Tap Quick Action Follow-Up Chips */}
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {[
                          { icon: "⏳", label: "When will this activate?", prompt: "When will this timing activate based on my current Dasha and transits?" },
                          { icon: "📿", label: "Simple Mantra Remedy", prompt: "What is the most effective daily mantra or simple remedy for this?" },
                          { icon: "💼", label: "Career & Wealth impact", prompt: "How does this specifically impact my career and financial growth?" },
                        ].map((chip) => (
                          <button
                            key={chip.label}
                            onClick={() => handleSendMessage(chip.prompt)}
                            disabled={isLoading}
                            className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/50 text-[10px] text-slate-300 hover:text-amber-300 font-medium transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>{chip.icon}</span>
                            <span>{chip.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[8.5px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl w-fit text-xs text-amber-300 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-semibold text-[11px]">
                  Acharya is examining houses, D9/D10 Vargas, Dasha & Shadbala...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Inquiries (Categorized) */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {selectedCategoryMeta.prompts.map((q) => (
              <button
                key={q.title}
                onClick={() => handleSendMessage(q.prompt)}
                disabled={isLoading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 text-[10.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              >
                <span>{q.icon}</span>
                <span>{q.title}</span>
              </button>
            ))}
          </div>

          {/* Multiline Input Box supporting Shift+Enter */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-end gap-2"
          >
            <div className="flex-1 relative flex flex-col">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={`Ask Acharya in ${selectedCategoryMeta.name}...`}
                value={inputPrompt}
                onChange={(e) => {
                  setInputPrompt(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors resize-none max-h-32 min-h-[40px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
              />
              <span className="text-[9px] text-slate-500 mt-1 px-1 flex items-center justify-between">
                <span>↵ Enter to send</span>
                <span className="font-mono text-amber-400/80 font-semibold">Shift + ↵ for new line</span>
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 mb-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
            >
              <span>Consult</span>
              <span>🚀</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}