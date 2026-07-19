/**
 * POST /api/chat
 *
 * Body: { message: string, history?: { role, content }[] }
 * Response: text/event-stream
 *   - event: sources  → JSON { chunks: [{ id, source, headingPath, score }] }
 *   - event: delta    → text chunk
 *   - event: error    → JSON { message }
 *   - event: done     → (no data)
 */

import { getVectorStore } from "@/lib/vector-store";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { streamChat, type ChatMessage } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

interface HistoryItem {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  let message: string;
  let history: HistoryItem[] = [];
  try {
    const body = (await req.json()) as { message?: string; history?: HistoryItem[] };
    message = (body.message || "").trim();
    history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  } catch {
    return new Response("invalid request", { status: 400 });
  }

  if (!message || message.length > 2000) {
    return new Response("message required and <= 2000 chars", { status: 400 });
  }

  // Rate limit per IP (simple in-memory)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!checkRateLimit(ip)) {
    return new Response("rate limited — try again in a few seconds", { status: 429 });
  }

  const encoder = new TextEncoder();
  const store = await getVectorStore();

  // Query expansion: if the latest message is short/follow-up, prepend the last user turn
  const lastUserTurn = [...history].reverse().find((m) => m.role === "user");
  const expandedQuery =
    message.length < 20 && lastUserTurn ? `${lastUserTurn.content} ${message}` : message;

  const retrieval = await store.search(expandedQuery, 5);

  const userPrompt = buildUserPrompt(message, retrieval.chunks);

  // Build chat history — keep only recent turns, trimmed to fit context window
  const historyMessages: ChatMessage[] = history.map((m) => ({
    role: m.role,
    content: m.content.slice(0, 1500),
  }));

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...historyMessages,
    { role: "user", content: userPrompt },
  ];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data?: string) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        if (data !== undefined) {
          // split data across lines per SSE spec
          for (const line of data.split("\n")) {
            controller.enqueue(encoder.encode(`data: ${line}\n`));
          }
        } else {
          controller.enqueue(encoder.encode(`data: \n`));
        }
        controller.enqueue(encoder.encode(`\n`));
      };

      try {
        // Send sources first
        send(
          "sources",
          JSON.stringify({
            chunks: retrieval.chunks.map((c) => ({
              id: c.id,
              source: c.source,
              headingPath: c.headingPath,
              score: Math.round(c.score * 1000) / 1000,
            })),
            timingMs: retrieval.timingMs,
          })
        );

        for await (const token of streamChat(messages)) {
          send("delta", token);
        }

        send("done");
        controller.close();
      } catch (err) {
        console.error("[chat] stream error:", err);
        send(
          "error",
          JSON.stringify({
            message: err instanceof Error ? err.message : "generation failed",
          })
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

// --- simple in-memory rate limiter ---
const rateMap = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const hits = (rateMap.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_REQUESTS) return false;
  hits.push(now);
  rateMap.set(key, hits);
  // trim old keys
  if (rateMap.size > 1000) {
    for (const [k, v] of rateMap) {
      if (v.every((t) => now - t >= WINDOW_MS)) rateMap.delete(k);
    }
  }
  return true;
}
