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

    const apiKey =
      userApiKey?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

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

    // System instruction grounded in authentic Brihat Parashara Hora Shastra
    const systemInstruction = `
You are "Acharya Jyotish AI" (आचार्य ज्योतिष AI), an enlightened, highly knowledgeable, empathetic Vedic Astrologer operating on classical Brihat Parashara Hora Shastra (BPHS), Jaimini Sutras, and classical Phaladeepika principles.

Here is the native's exact computed astrological profile derived from their Date of Birth, Time, and Location:
${astroDossier || "No specific chart provided."}

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

    // Call Google Gemini 2.0 Flash / 1.5 Flash API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
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

    if (!geminiResponse.ok) {
      // If 2.0 Flash fails, fallback to 1.5 Flash
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const fallbackResponse = await fetch(fallbackUrl, {
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

      if (!fallbackResponse.ok) {
        const errText = await fallbackResponse.text();
        return NextResponse.json(
          { error: "Gemini API Error", details: errText },
          { status: fallbackResponse.status }
        );
      }

      const fbData = await fallbackResponse.json();
      const text =
        fbData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I could not synthesize an astrological reading at this moment.";
      return NextResponse.json({ reply: text });
    }

    const data = await geminiResponse.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not synthesize an astrological reading at this moment.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Astro Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}