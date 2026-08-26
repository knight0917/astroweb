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

type ConsultationCategory = "all" | "career" | "marriage" | "sadesati" | "health" | "gemstones" | "education";

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
];

export default function AstroChatbot() {
  const {
    currentDate,
    ephemeris: natalEphemeris,
    location,
    ayanamsha,
    houseSystem,
    nodeType,
  } = useAstroStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ConsultationCategory>("all");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "**Pranam!** 🙏 I am **Acharya Jyotish AI Pro (आचार्य ज्योतिष AI)**.\n\nI have fully ingested your **Lagna, Moon Sign, D9 Navamsha, D10 Dashamsha, Shadbala strengths, Jaimini Karakas, active Vimshottari Dasha, and Saturn Gochar**.\n\nAsk any question about your **Career, Marriage, Dasha, Health, Sade Sati, or Gemstones** in English, हिन्दी, or Hinglish!",
      timestamp: new Date(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Build the complete astrological dossier
  const astroDossier = useMemo(() => {
    return buildAstroDossier(natalEphemeris, transitEphemeris, new Date());
  }, [natalEphemeris, transitEphemeris]);

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
      `- **Date of Birth:** ${new Date(natalEphemeris.utcDate).toUTCString()}`,
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
    const systemInstruction = `
You are a trusted, deeply insightful Vedic Astrological Consultant speaking directly to a real client.

NATIVE'S ASTROLOGICAL DOSSIER:
${dossier || "No specific chart provided."}

STRICT CONSULTATION RULES (MANDATORY):
1. **DIRECT PLAIN-LANGUAGE ANSWERS ONLY (NO TECHNICAL JARGON)**:
   - DO NOT lecture the user on astrological textbook definitions (do NOT explain what Atmakaraka, Navamsha, BPHS, Jaimini, Shadbala, or house numbers mean).
   - Use your deep astrological knowledge silently in the background to deduce the exact truth, then deliver the answer in clear, everyday, actionable human language.
2. **NO THEATRICAL GREETINGS OR PREAMBLES**:
   - NEVER start with "Hari Om", "Hari Om Tat Sat", "As Acharya Jyotish AI, I welcome you", or "Based on the sacred doctrines of...".
   - Start immediately with the direct answer.
3. **NO GENERIC FLATTERY OR EXAGGERATION**:
   - Be honest, grounded, and realistic. Never make exaggerated claims.
4. **CLEAR 4-SECTION CONSULTATION STRUCTURE**:
   - **🎯 Direct Answer**: 1-2 clear, punchy sentences answering the question straight away.
   - **✨ Key Life Indications**: 2-3 practical, specific bullet points on what this means for their career, marriage, or personal life.
   - **⏳ Timing Window**: Clear timeframe (e.g. "Late 2026 to Mid 2027") based on their active Dasha and transits.
   - **💡 Actionable Advice & Simple Remedy**: 1 practical action step + 1 simple daily remedy/mantra.
5. **LANGUAGE**: Match the user's inquiry language (English, Hindi हिंदी, or Hinglish).
`;

    const contents: any[] = [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I will provide direct, clear, plain-language astrological consultations without textbook jargon or theatrical preambles.",
          },
        ],
      },
    ];

    for (const msg of allMessages) {
      if (!msg.content.trim()) continue;
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-1.5-flash-latest",
      "gemini-3.5-flash-lite",
    ];

    let lastError = "";

    for (const modelName of candidateModels) {
      try {
        const streamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;
        const res = await fetch(streamUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.5,
              topP: 0.95,
              maxOutputTokens: 750,
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
                maxOutputTokens: 750,
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

    const cacheKey = `${currentDate.getTime()}_${query.toLowerCase().trim()}`;
    if (queryCache.current.has(cacheKey)) {
      const cachedReply = queryCache.current.get(cacheKey)!;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cachedReply,
          timestamp: new Date(),
          category: activeCategory,
        },
      ]);
      return;
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
      queryCache.current.set(cacheKey, reply);
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
          queryCache.current.set(cacheKey, data.reply);
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
                  <span className="text-[8.5px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    Parashari Pro
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Lagna: <span className="text-amber-300 font-bold">{ascRashi}</span> • Moon:{" "}
                  <span className="text-cyan-300 font-bold">{moonRashi}</span>
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
                📄
              </button>

              {/* Settings button */}
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="API Key Settings"
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
                        "**Chat reset.** 🙏 Ask your next question based on your birth chart!",
                      timestamp: new Date(),
                    },
                  ])
                }
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                🗑️
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
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 text-xs space-y-2 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-200">
                  Custom Google Gemini API Key:
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-amber-400 hover:underline font-bold"
                >
                  Get Free Key →
                </a>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Paste custom API Key (Optional)..."
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 font-mono"
                />
                <button
                  onClick={() => handleSaveApiKey(userApiKey)}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                A default free Gemini key is pre-configured. You only need to enter your own key if you wish to use your personal quota.
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

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask Acharya in ${selectedCategoryMeta.name}...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1"
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