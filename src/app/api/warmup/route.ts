/**
 * POST /api/warmup
 *
 * Pre-loads the embedding model and indexes the knowledge base.
 * Call this when the user opens the chat modal so the model is ready
 * by the time they finish typing their first question.
 */

import { warmUp } from "@/lib/vector-store";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await warmUp();
    return Response.json(result);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "warmup failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}