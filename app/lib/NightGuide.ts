import { GoogleGenerativeAI, Content } from "@google/generative-ai";

// ─────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error("⚠️ NEXT_PUBLIC_GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey as string);

/**
 * Models tried in order. On quota / rate-limit / 404 the next one is used.
 */
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

// ─────────────────────────────────────────────
//  System Prompt
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are NightGuide, a friendly and knowledgeable AI assistant specializing in movies and TV shows. 🎬

YOUR ONLY JOB:
- Recommend great movies and TV shows based on the user's request
- Use your knowledge to pick the best, most relevant titles
- You do NOT have access to a database — just your training knowledge

RESPONSE FORMAT (STRICT — ALWAYS FOLLOW):
For movies:
🎬 **Exact Movie Title** (Year) - One-line description.

For TV shows:
📺 **Exact Show Title** (Year) - One-line description.

RULES:
- Always suggest 3–5 options
- Use the EXACT, OFFICIAL title (e.g. "The Dark Knight", not "dark knight")
- The year must be the correct release year
- Be concise and engaging
- Use emoji to keep it lively 🎉
- NEVER include IDs, URLs, or technical data — just title and year
- NEVER say "I can't find" or refuse to help — always provide recommendations

Examples:
🎬 **Inception** (2010) - A mind-bending heist inside the world of dreams.
🎬 **The Dark Knight** (2008) - A gritty superhero thriller with an iconic villain.
📺 **Breaking Bad** (2008) - A chemistry teacher transforms into a drug lord.
`.trim();

// ─────────────────────────────────────────────
//  Conversation History
// ─────────────────────────────────────────────

let conversationHistory: Content[] = [];
const MAX_HISTORY = 20;

// ─────────────────────────────────────────────
//  Main AI Function (with model fallback)
// ─────────────────────────────────────────────

export async function askAI(prompt: string): Promise<string> {
  if (!prompt.trim()) {
    return "Please ask me something about movies or TV shows! 🎬";
  }

  for (let i = 0; i < MODEL_PRIORITY.length; i++) {
    const modelName = MODEL_PRIORITY[i];
    const isLastModel = i === MODEL_PRIORITY.length - 1;

    try {
      console.log(`[NightGuide] Using model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          {
            role: "model",
            parts: [
              {
                text: "Got it! I'm NightGuide — ready to find your next favourite movie or show. Just tell me what you're in the mood for! 🎬",
              },
            ],
          },
          ...conversationHistory,
        ],
      });

      const result = await chat.sendMessage(prompt);
      const text = result.response.text();

      // Persist conversation
      conversationHistory.push({ role: "user", parts: [{ text: prompt }] });
      conversationHistory.push({ role: "model", parts: [{ text }] });
      if (conversationHistory.length > MAX_HISTORY) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY);
      }

      return text;
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      console.warn(`[NightGuide] Model "${modelName}" failed:`, err?.message ?? error);

      const isRetryable =
        err?.status === 429 ||
        err?.status === 503 ||
        err?.status === 404 ||
        err?.message?.includes("quota") ||
        err?.message?.includes("not found") ||
        err?.message?.includes("overloaded");

      if (isLastModel || !isRetryable) {
        return handleError(err);
      }

      console.log(`[NightGuide] Retrying with next model...`);
    }
  }

  return "⚠️ All models are currently unavailable. Please try again in a moment.";
}

// ─────────────────────────────────────────────
//  Public Utilities
// ─────────────────────────────────────────────

export function clearConversation(): void {
  conversationHistory = [];
}

export function getConversationHistory(): Content[] {
  return [...conversationHistory];
}

export function getQuickSuggestions(): string[] {
  return [
    "Recommend sci-fi movies like Inception",
    "What are some good comedy shows?",
    "Suggest thriller movies from 2023",
    "Movies similar to The Dark Knight",
    "Best animated films for family night",
  ];
}

// ─────────────────────────────────────────────
//  Error Handling
// ─────────────────────────────────────────────

function handleError(error: { status?: number; message?: string }): string {
  if (error?.status === 429 || error?.message?.includes("quota")) {
    return "⚠️ All models are rate-limited right now. Please wait a moment and try again.";
  }
  if (error?.message?.includes("fetch") || error?.message?.includes("network")) {
    return "⚠️ Connection error. Please check your internet connection.";
  }
  if (error?.status === 401 || error?.message?.includes("API key")) {
    return "⚠️ Authentication error. Please check your API key.";
  }
  if (error?.message?.includes("safety") || error?.message?.includes("blocked")) {
    return "⚠️ That request was blocked. Please try rephrasing your question.";
  }
  return "⚠️ Something went wrong. Please try again.";
}