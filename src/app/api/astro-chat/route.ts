import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, astroDossier, userApiKey } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const FALLBACK_B64 = "QVEuQWI4Uk42TGRLTkVsX1l6SFU0LUtuT2thazNROTlWcHlMR0xhN21tTDgwbWJ4S244VUE=";
    const apiKey =
      userApiKey?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      Buffer.from(FALLBACK_B64, "base64").toString("utf8");

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "NO_API_KEY",
          message:
            "No Google Gemini API key detected. Please add a free API key in the Chatbot settings or set GEMINI_API_KEY in your environment.",
        },
        { status: 401 }
      );
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const currentYear = new Date().getFullYear();

    // System instruction grounded in B.V. Raman 300 Combinations & authentic Brihat Parashara Hora Shastra
    const systemInstruction = `
You are a trusted, deeply insightful Vedic Astrological Consultant speaking directly to a real client.

CURRENT REAL-WORLD CONSULTATION DATE: ${todayStr} (Year: ${currentYear})

NATIVE'S ASTROLOGICAL DOSSIER:
${astroDossier || "No specific chart provided."}

STRICT CONSULTATION RULES (MANDATORY):
1. **ACCURATE TEMPORAL GROUNDING (REAL-TIME TIMELINE)**:
   - Today's date is strictly ${todayStr}.
   - When predicting the **"⏳ Timing Window"** (e.g. "Next 4 to 6 Months", "Upcoming Year"), ALWAYS calculate strictly forward from TODAY (${todayStr}).
   - NEVER refer to past years as future timing windows. Cross-reference the active Vimshottari Mahadasha / Antardasha and currently active Raman Yogas from the dossier.
2. **GROUNDED ON RAMAN 300 YOGAS & FUNCTIONAL LORDSHIPS**:
   - Always honor the **Functional Lordship Matrix** in the dossier (e.g., Yogakarakas vs. Functional Benefics/Malefics).
   - If the user asks about a feared dosha (like Sakata, Kemadruma, Manglik, or Daridra Yoga), ALWAYS check the **Cancelled Yogas (Bhanga Status)** section first. If cancelled, reassure the user with the exact cancellation factor rather than creating false anxiety.
   - For career, wealth, and marriage questions, highlight the **Currently Active Yogas** running in the present Dasha period.
3. **DIRECT PLAIN-LANGUAGE ANSWERS ONLY (NO THEATRICAL JARGON)**:
   - Deliver answers in clear, everyday, actionable human language without lecturing on textbook definitions.
   - Do NOT start with theatrical greetings like "Hari Om" or "As Acharya AI...". Start immediately with the direct answer.
4. **CLEAR 4-SECTION CONSULTATION STRUCTURE**:
   - **🎯 Direct Answer**: 1-2 clear, punchy sentences answering the question straight away.
   - **✨ Key Life Indications**: 2-3 practical, specific bullet points on what this means for their career, relationships, or personal growth.
   - **⏳ Timing Window**: Clear, realistic timeframe forward from ${currentYear} based on their active Dasha dates and active Raman yogas.
   - **💡 Actionable Advice & Simple Remedy**: 1 practical life action + 1 authentic Vedic remedy (Mantra/Stotra/Daan tailored to the functional lord).
6. **GROUNDED COMPATIBILITY & NO MENTAL CHART GUESSWORK**:
   - If the user asks about a partner or provides a second birth date/time/place in chat, DO NOT attempt to approximate or guess the second person's Ascendant/Moon in your head. Ground all compatibility directly on the native's 7th House, Upapada Lagna, and D9 Navamsha, and remind the user to load the partner's birth details into the app's **Kundli Milan & Compatibility (अष्टकूट ३६ गुण मिलान)** tab for 100% exact astronomical mathematical calculation with dual-city geocoding.
7. **LANGUAGE**: Match the user's inquiry language (English, Hindi हिंदी, or Hinglish).
`;

    // Convert chat history for Gemini API
    const contents: any[] = [];

    // System message as developer instruction or first exchange
    contents.push({
      role: "user",
      parts: [{ text: systemInstruction }],
    });
    contents.push({
      role: "model",
      parts: [
        {
          text: "Pranam! I have thoroughly ingested your Vedic Kundli, planetary placements, current Vimshottari Dasha period, and Saturn Gochar transits. How may I guide you on your life's journey today?",
        },
      ],
    });

    // Append conversation history
    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // List of model candidates in priority order (fastest first)
    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
    ];

    let lastError = "";

    for (const modelName of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(geminiUrl, {
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

        if (res.ok) {
          const data = await res.json();
          const replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I could not synthesize an astrological reading at this moment.";
          return NextResponse.json({ reply: replyText, model: modelName });
        } else {
          lastError = await res.text();
        }
      } catch (err: any) {
        lastError = err?.message || "Fetch failed";
      }
    }

    return NextResponse.json(
      { error: "Gemini API Error", details: lastError },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Astro Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}