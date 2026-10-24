/**
 * Prompt injection guard for the Vedic Astrology chatbot.
 * Detects common jailbreak and prompt-hijack patterns and caps message length
 * to prevent token-flooding attacks.
 */

/** Patterns that indicate an attempt to override the AI system persona or extract internal instructions. */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /forget\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /print\s+(your\s+)?(system\s+)?prompt/i,
  /show\s+(me\s+)?(your\s+)?(system\s+)?instructions?/i,
  /you\s+are\s+now\s+(a\s+)?(dan|jailbreak|unrestricted|evil|sigma)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(?!an?\s+astrologer|vedic)/i,
  /act\s+as\s+(?!(an?\s+)?(astrologer|jyotishi|vedic\s+master))/i,
  /override\s+(your\s+)?(system|guidelines|constraints|rules|persona)/i,
  /disregard\s+(your\s+)?(system|guidelines|constraints|rules)/i,
  /you\s+have\s+no\s+(restrictions?|guidelines?|rules?)/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /<\s*script[\s>]/i, // XSS via reflected content
  /\bexec\s*\(/i,    // Code injection patterns
];

/**
 * Returns true if the message contains a likely prompt injection attempt.
 */
export function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Sanitizes a user message:
 * - Trims whitespace
 * - Caps length at 2000 characters to prevent token flooding
 * - Strips null bytes
 */
export function sanitizeUserMessage(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/\0/g, "") // strip null bytes
    .trim()
    .slice(0, 2000);
}
