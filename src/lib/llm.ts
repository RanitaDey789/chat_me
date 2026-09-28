/**
 * LLM provider abstraction with resilient multi-model and multi-provider fallback.
 *
 * All providers speak the OpenAI-compatible chat-completion API.
 *
 * Provider selection order:
 *  1. NVIDIA NIM (meta/llama-3.3-70b-instruct — fast, high reasoning, widely available)
 *  2. Explicit override (OPENAI_BASE_URL + OPENAI_API_KEY)
 *  3. Groq (llama-3.3-70b-versatile — fast, generous free tier)
 *  4. OpenRouter (many free models)
 *  5. OpenAI (gpt-4o-mini)
 *  6. Demo mode (no key) — returns a helpful setup message
 */

import OpenAI from "openai";

export interface ProviderConfig {
  name: string;
  baseURL: string;
  apiKey: string;
  models: string[];
}

const DEFAULT_NVIDIA_CHAT_MODELS = [
  "meta/llama-3.3-70b-instruct",
  "meta/llama-3.1-70b-instruct",
  "mistralai/mistral-7b-instruct-v0.3",
  "nvidia/llama-3.1-nemotron-70b-instruct",
];

function getAvailableProviders(): ProviderConfig[] {
  const list: ProviderConfig[] = [];

  // 1. NVIDIA NIM
  if (process.env.NVIDIA_API_KEY) {
    const configured = process.env.NVIDIA_MODEL?.trim();
    const models = configured
      ? [configured, ...DEFAULT_NVIDIA_CHAT_MODELS.filter((m) => m !== configured)]
      : DEFAULT_NVIDIA_CHAT_MODELS;

    list.push({
      name: "nvidia",
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: process.env.NVIDIA_API_KEY,
      models,
    });
  }

  // 2. Custom OpenAI-compatible endpoint
  if (process.env.OPENAI_BASE_URL && process.env.OPENAI_API_KEY) {
    list.push({
      name: "custom",
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
      models: [process.env.OPENAI_MODEL || "gpt-4o-mini"],
    });
  }

  // 3. Groq
  if (process.env.GROQ_API_KEY) {
    list.push({
      name: "groq",
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
      models: [
        process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
      ],
    });
  }

  // 4. OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    list.push({
      name: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      models: [
        process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-7b-instruct:free",
        "meta-llama/llama-3.3-70b-instruct:free",
      ],
    });
  }

  // 5. OpenAI
  if (process.env.OPENAI_API_KEY) {
    list.push({
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
      models: [process.env.OPENAI_MODEL || "gpt-4o-mini"],
    });
  }

  return list;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
  const providers = getAvailableProviders();

  if (providers.length === 0) {
    yield "**Demo mode — no LLM API key configured.**\n\n";
    yield "To activate streaming AI answers, set an API key in your environment variables:\n\n";
    yield "- **NVIDIA NIM** (free): `NVIDIA_API_KEY` (from [build.nvidia.com](https://build.nvidia.com/))\n";
    yield "- **Groq** (free & ultra-fast): `GROQ_API_KEY` (from [console.groq.com](https://console.groq.com/))\n";
    yield "- **OpenRouter** or **OpenAI**: `OPENROUTER_API_KEY` or `OPENAI_API_KEY`\n\n";
    yield "Retrieval is functioning — below is the grounded context retrieved for your query:\n\n";
    yield "```markdown\n" + (messages[messages.length - 1]?.content.slice(0, 700) || "") + "\n```";
    return;
  }

  const errors: { provider: string; model: string; error: string }[] = [];

  for (const provider of providers) {
    const client = new OpenAI({
      apiKey: provider.apiKey,
      baseURL: provider.baseURL,
    });

    for (const model of provider.models) {
      try {
        const stream = await client.chat.completions.create({
          model,
          messages,
          stream: true,
          temperature: 0.3,
          max_tokens: 1024,
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta as
            | { content?: string; reasoning_content?: string }
            | undefined;
          const content = delta?.content;
          if (content) yield content;
        }

        // Successfully completed streaming with this model
        return;
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[llm] Provider ${provider.name} model ${model} failed (${status || msg}). Trying next candidate...`);
        errors.push({ provider: provider.name, model, error: `[HTTP ${status || "err"}] ${msg}` });

        // If it's a 410 (Gone) or 404 (Not Found), immediately try the next model
        continue;
      }
    }
  }

  // If all providers and models failed
  console.error("[llm] All providers and model candidates failed:", errors);
  const primaryError = errors[0];

  yield "⚠️ **The AI service encountered an issue with the configured model.**\n\n";
  if (primaryError?.error.includes("410")) {
    yield `The model endpoint returned HTTP **410 (Gone)**. This occurs when NVIDIA deprecates a model (such as older gpt-oss endpoints) or when your NVIDIA Build key needs updated model routing.\n\n`;
    yield `**Easy Fixes:**\n`;
    yield `1. In your Render / host environment variables, set:\n`;
    yield `   \`NVIDIA_MODEL=meta/llama-3.3-70b-instruct\`\n`;
    yield `2. Or add a free **Groq** key:\n`;
    yield `   \`GROQ_API_KEY=gsk_...\` (from [console.groq.com](https://console.groq.com)) for instant, high-speed responses.\n\n`;
  } else {
    yield `Error details: \`${primaryError?.error || "Unknown error"}\`\n\n`;
    yield `Please verify your API key in your hosting dashboard.\n\n`;
  }

  yield "---\n\n**Retrieved Context from Knowledge Base:**\n\n";
  yield "```markdown\n" + (messages[messages.length - 1]?.content.slice(0, 600) || "") + "\n```";
}

export function getProviderInfo(): { name: string; model: string } | null {
  const providers = getAvailableProviders();
  if (providers.length === 0) return null;
  return {
    name: providers[0].name,
    model: providers[0].models[0],
  };
}
