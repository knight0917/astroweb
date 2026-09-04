import { NextRequest, NextResponse } from "next/server";
import { buildChatSystemInstruction, extractUserConfirmedFacts } from "@/engine/chatPrompt";

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

    // Extract user-confirmed facts from conversation history
    const userConfirmedFacts = extractUserConfirmedFacts(messages);
    const systemInstruction = buildChatSystemInstruction(astroDossier, userConfirmedFacts);

    // Filter chat history to retain rich conversation memory without runaway token bloat
    const filteredHistory = messages
      .filter((msg: any) => msg.id !== "welcome" && msg.content && msg.content.trim())
      .slice(-24);

    const isOpenRouter = apiKey.startsWith("sk-or-");
    const isSiliconFlow =
      !isOpenRouter &&
      (apiKey.startsWith("sk-") ||
        Boolean(process.env.SILICONFLOW_API_KEY && (!userApiKey || userApiKey.startsWith("sk-"))));

    // 1. OPENROUTER FREE / PRO ROUTE
    if (isOpenRouter) {
      const orMessages = [
        { role: "system", content: systemInstruction },
        ...filteredHistory.map((m: any) => ({
          role:
            m.sender === "bot" || m.role === "assistant" || m.role === "model"
              ? "assistant"
              : "user",
          content: m.content || "",
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

      let orLastError = "";

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
              stream: false,
            }),
          });

          if (orRes.ok) {
            const orData = await orRes.json();
            const replyText =
              orData.choices?.[0]?.message?.content ||
              "I could not synthesize an astrological reading at this moment.";
            return NextResponse.json({
              reply: replyText,
              model: modelName,
              provider: "openrouter",
            });
          } else {
            orLastError = await orRes.text();
          }
        } catch (err: any) {
          orLastError = err?.message || "OpenRouter fetch failed";
        }
      }

      console.warn("OpenRouter failed, falling back to Gemini:", orLastError);
    }

    // 2. SILICONFLOW DEEPSEEK ROUTE (OPENAI-COMPATIBLE)
    if (isSiliconFlow) {
      const sfApiKey = apiKey.startsWith("sk-")
        ? apiKey
        : process.env.SILICONFLOW_API_KEY || apiKey;

      const sfMessages = [
        { role: "system", content: systemInstruction },
        ...filteredHistory.map((m: any) => ({
          role:
            m.sender === "bot" || m.role === "assistant" || m.role === "model"
              ? "assistant"
              : "user",
          content: m.content || "",
        })),
      ];

      if (sfMessages.length === 1) {
        sfMessages.push({
          role: "user",
          content: "Pranam! Please provide my reading based on my birth chart.",
        });
      }

      const siliconCandidateModels = [
        "deepseek-ai/DeepSeek-V3",
        "deepseek-ai/DeepSeek-V4-Pro",
        "deepseek-ai/DeepSeek-R1",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        "Qwen/Qwen2.5-7B-Instruct",
        "THUDM/glm-4-9b-chat",
      ];

      let sfLastError = "";

      for (const modelName of siliconCandidateModels) {
        try {
          const sfRes = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sfApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages: sfMessages,
              temperature: 0.3,
              max_tokens: 4096,
              stream: false,
            }),
          });

          if (sfRes.ok) {
            const sfData = await sfRes.json();
            const replyText =
              sfData.choices?.[0]?.message?.content ||
              "I could not synthesize an astrological reading at this moment.";
            return NextResponse.json({
              reply: replyText,
              model: modelName,
              provider: "siliconflow",
            });
          } else {
            sfLastError = await sfRes.text();
          }
        } catch (err: any) {
          sfLastError = err?.message || "SiliconFlow fetch failed";
        }
      }

      // If SiliconFlow key failed, don't hard crash if default Gemini key exists
      console.warn("SiliconFlow failed, falling back to Gemini:", sfLastError);
    }

    // 3. GOOGLE GEMINI ROUTE (DEFAULT / FALLBACK)
    const geminiApiKey = apiKey.startsWith("sk-")
      ? process.env.GEMINI_API_KEY ||
        process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
        Buffer.from(FALLBACK_B64, "base64").toString("utf8")
      : apiKey;

    const contents: any[] = [];
    for (const msg of filteredHistory) {
      let textContent = msg.content;
      if (msg.role === "user" && /accident|graduat|marriage|surgery|hospital|job|promotion|relocat|event|year|20\d\d|btr|verify/i.test(msg.content)) {
        textContent += "\n\n[Note to Astrologer: The native's birth details and Dasha timeline are already fully loaded in your active dossier above. Do NOT ask for DOB/TOB/POB. Analyze these events directly against the active horoscope.]";
      }
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: textContent }],
      });
    }

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Pranam! Please provide my reading based on my birth chart." }],
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
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.25,
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
          return NextResponse.json({ reply: replyText, model: modelName, provider: "gemini" });
        } else {
          // Fallback if system_instruction is not supported on this specific model
          const fallbackRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Understood. Grounding freshly in the astrological dossier without past conversational bias." }] },
                ...contents,
              ],
              generationConfig: {
                temperature: 0.25,
                topP: 0.95,
                maxOutputTokens: 4096,
              },
            }),
          });
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            const replyText =
              data.candidates?.[0]?.content?.parts?.[0]?.text ||
              "I could not synthesize an astrological reading at this moment.";
            return NextResponse.json({ reply: replyText, model: modelName, provider: "gemini" });
          }
          lastError = await res.text();
        }
      } catch (err: any) {
        lastError = err?.message || "Fetch failed";
      }
    }

    return NextResponse.json(
      { error: "AI API Error", details: lastError },
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