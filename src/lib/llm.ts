/**
 * LLM provider abstraction.
 *
 * All providers speak the OpenAI-compatible chat-completion API, so we can
 * swap between them with just env vars.
 *
 * Provider selection order:
 *  1. NVIDIA_API_KEY (primary — OpenAI OSS 120B, excellent reasoning)
 *  2. OPENAI_BASE_URL + OPENAI_API_KEY (explicit override for any provider)
 *  3. GROQ_API_KEY (fallback — fast, free)
 *  4. OPENROUTER_API_KEY (fallback — many free models)
 *  5. OPENAI_API_KEY (paid fallback)
 *  6. Demo mode (no key) — returns a helpful setup message
 */

import OpenAI from "openai";

interface ProviderConfig {
  name: string;
  baseURL: string;
  apiKey: string;
  model: string;
}

function detectProvider(): ProviderConfig | null {
  // 1. NVIDIA — primary provider (OpenAI OSS 120B)
  if (process.env.NVIDIA_API_KEY) {
    return {
      name: "nvidia",
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: process.env.NVIDIA_API_KEY,
      model: process.env.NVIDIA_MODEL || "openai/gpt-oss-120b",
    };
  }
  // 2. Explicit override for any OpenAI-compatible endpoint
  if (process.env.OPENAI_BASE_URL && process.env.OPENAI_API_KEY) {
    return {
      name: "custom",
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }
  // 3. Groq (fast, generous free tier)
  if (process.env.GROQ_API_KEY) {
    return {
      name: "groq",
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    };
  }
  // 4. OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    return {
      name: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-7b-instruct:free",
    };
  }
  // 5. OpenAI
  if (process.env.OPENAI_API_KEY) {
    return {
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }
  return null;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
  const provider = detectProvider();

  if (!provider) {
    yield "**Demo mode — no LLM API key configured.**\n\n";
    yield "To activate the chatbot, add `NVIDIA_API_KEY` to your `.env`.\n\n";
    yield "Other supported providers: `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, ";
    yield "or any OpenAI-compatible endpoint via `OPENAI_BASE_URL` + `OPENAI_API_KEY`.\n\n";
    yield "Retrieval is working — the context below is what would be sent to the LLM:\n\n";
    yield "```\n" + (messages[messages.length - 1]?.content.slice(0, 600) || "") + "\n```";
    return;
  }

  const client = new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseURL,
  });

  const stream = await client.chat.completions.create({
    model: provider.model,
    messages,
    stream: true,
    temperature: 0.3, // low — faithful, grounded answers
    max_tokens: 1024,
    // For NVIDIA gpt-oss-120b (and other reasoning models), the API may
    // return a `reasoning_content` field. We only stream the final answer.
  });

  for await (const chunk of stream) {
    // `reasoning_content` (if present) is internal chain-of-thought; we
    // intentionally ignore it so recruiters only see the clean final answer.
    const delta = chunk.choices[0]?.delta as
      | { content?: string; reasoning_content?: string }
      | undefined;
    const content = delta?.content;
    if (content) yield content;
  }
}

export function getProviderInfo(): { name: string; model: string } | null {
  const p = detectProvider();
  return p ? { name: p.name, model: p.model } : null;
}
