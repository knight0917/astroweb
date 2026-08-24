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
}

const DEFAULT_GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const PRESET_QUESTIONS = [
  {
    icon: "💼",
    title: "Career & Finances",
    prompt: "Based on my 10th house, Lagna lord, and current Dasha, how will my career and finances evolve in the coming 1-2 years?",
  },
  {
    icon: "❤️",
    title: "Marriage & Love Life",
    prompt: "Analyzing my 7th house, Venus/Jupiter placements, and transit Gochar, what are the indications for marriage, relationship timing, and compatibility?",
  },
  {
    icon: "🪐",
    title: "Sade Sati & Shani",
    prompt: "Am I currently under Shani Sade Sati or Dhaiya? When does it end and what are the best classical remedies for me?",
  },
  {
    icon: "👑",
    title: "Current Dasha Period",
    prompt: "What are the specific planetary effects of my currently active Mahadasha and Antardasha? What precautions should I take?",
  },
  {
    icon: "💎",
    title: "Lucky Gemstones & Mantras",
    prompt: "Which gemstone, lucky color, and Vedic mantra are most auspicious and safe for my Lagna and Janma Rashi?",
  },
  {
    icon: "🧘",
    title: "Health & Peace of Mind",
    prompt: "Looking at my 6th, 8th houses and Moon strength, what should I keep in mind regarding my mental peace and physical wellness?",
  },
];

export default function AstroChatbot() {
  const {
    ephemeris: natalEphemeris,
    location,
    ayanamsha,
    houseSystem,
    nodeType,
  } = useAstroStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "**Pranam!** 🙏 I am your **Vedic AI Astrologer (ज्योतिष AI)**. I have analyzed your birth chart, Lagna, Moon sign, planetary houses, active Vimshottari Dasha, and Saturn Sade Sati.\n\nFeel free to ask any question about your **Career, Marriage, Dasha, Sade Sati, or Remedies** in English, हिन्दी, or Hinglish!",
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

  // Client-Side Direct Gemini API Call with Multi-Model Fallback Cascade
  const executeDirectGeminiCall = async (
    allMessages: Message[],
    dossier: string,
    apiKey: string
  ): Promise<string> => {
    const systemInstruction = `
You are "Acharya Jyotish AI" (आचार्य ज्योतिष AI), an enlightened, compassionate, highly knowledgeable Vedic Astrologer operating strictly on classical Brihat Parashara Hora Shastra (BPHS), Jaimini Sutras, and classical Phaladeepika principles.

Here is the native's exact computed astrological profile derived from their Date of Birth, Time, and Location:
${dossier || "No specific chart provided."}

YOUR GUIDING PRINCIPLES:
1. Ground every answer in the native's actual chart parameters (Lagna Lord, 10th House/Lord for Career, 7th House/Lord for Marriage, 5th/9th Houses for Fortune, current active Vimshottari Mahadasha/Antardasha, and Saturn Sade Sati status).
2. Answer in the user's preferred language: English, Hindi (हिंदी), or friendly conversational Hinglish.
3. Be compassionate, constructive, and uplifting. Avoid fatalism or fear-mongering; always focus on free will, righteous effort (Purushartha), and remedial actions.
4. When relevant, provide classical Vedic remedies:
   - Vedic Mantras (e.g., Gayatri, Maha Mrityunjaya, Shani or Guru mantras).
   - Auspicious gemstones with cautions on when to wear.
   - Charity (Daan) and fasting (Vrat) recommendations aligned with afflicted planets.
   - Favorable days and colors.
5. Format your response cleanly using markdown (bold headings, bullet points, and neat paragraphs).
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
            text: "Pranam! I have thoroughly ingested your Vedic Kundli, planetary placements, current Vimshottari Dasha period, and Saturn Gochar transits. How may I guide you on your life's journey today?",
          },
        ],
      },
    ];

    for (const msg of allMessages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
    ];

    let lastError = "";

    for (const modelName of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
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
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputPrompt("");
    setIsLoading(true);

    const activeKey = userApiKey.trim() || DEFAULT_GEMINI_KEY;

    if (!activeKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "🔑 **Google Gemini API Key Required on this Device:**\n\nTo enable instant astrological AI answers on this device:\n1. Paste your key in the **⚙️ Settings** box at the top of the chat.\n2. Click **Save** (it will be saved on this device forever).\n\nIf you need a free key, get one at [Google AI Studio](https://aistudio.google.com/app/apikey).",
          timestamp: new Date(),
        },
      ]);
      setShowSettings(true);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Try direct client-side Gemini execution (Works on GitHub Pages & all devices seamlessly)
      const reply = await executeDirectGeminiCall(
        updatedMessages,
        astroDossier,
        activeKey
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      // If direct call fails, try Next.js /api/astro-chat route as fallback
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
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: data.reply,
              timestamp: new Date(),
            },
          ]);
          return;
        }
      } catch (_) {}

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ **Could not connect to Astrological AI:** ${err.message}\n\nPlease verify your internet connection or click **⚙️ Settings** to enter a custom Gemini API key.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const ascRashi = natalEphemeris.ascendant.rashi.englishName;
  const moonRashi = natalEphemeris.planets.Moon?.rashi.englishName || "Aries";

  return (
    <>
      {/* 1. Floating Cosmic Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-5 right-5 z-[90] flex items-center gap-2.5 px-4 py-3 rounded-full font-black text-xs shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
          isOpen
            ? "bg-slate-900 border border-amber-500/60 text-amber-300 scale-105"
            : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 hover:scale-105 ring-4 ring-amber-500/20"
        }`}
        title="Chat with Vedic AI Astrologer"
      >
        <span className="text-base animate-pulse">✨</span>
        <span className="tracking-wide uppercase font-extrabold">
          {isOpen ? "Close Astrologer" : "Ask Astro AI (ज्योतिषी)"}
        </span>
      </button>

      {/* 2. Slide-Over Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-[95] w-[95vw] sm:w-[440px] h-[640px] max-h-[85vh] flex flex-col glass-panel bg-slate-950/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg text-amber-300 shadow-inner">
                🔮
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-100">
                    Acharya Jyotish AI
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gemini Active
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-400 font-mono">
                  Lagna: <span className="text-amber-300 font-bold">{ascRashi}</span> • Moon:{" "}
                  <span className="text-cyan-300 font-bold">{moonRashi}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Settings button */}
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
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
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                🗑️
              </button>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert prose-xs"
                  }`}
                >
                  {/* Format markdown line breaks & bullets */}
                  <div className="whitespace-pre-wrap space-y-1">
                    {msg.content}
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl w-fit text-xs text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-semibold text-[11px]">
                  Acharya is examining your Kundli houses & Dasha...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Prompt Chips */}
          <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {PRESET_QUESTIONS.map((q) => (
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
              placeholder="Ask about career, marriage, dasha, sade sati..."
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
              <span>Send</span>
              <span>🚀</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}